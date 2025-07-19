import { db } from './firebase.config';
import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  query,
  where,
  orderBy 
} from 'firebase/firestore';

// Locations
export const getLocations = async () => {
  try {
    const locationsCollection = await getDocs(collection(db, 'locations'));
    return locationsCollection.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting locations:', error);
    throw error;
  }
};

// Barbers
export const getBarbersByLocation = async (locationId) => {
  try {
    const barbersQuery = query(
      collection(db, 'barbers'),
      where('locationId', '==', locationId),
      where('isActive', '==', true)
    );
    const barbersCollection = await getDocs(barbersQuery);
    return barbersCollection.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting barbers:', error);
    throw error;
  }
};

// Appointments
export const createAppointment = async (appointmentData) => {
  try {
    const docRef = await addDoc(collection(db, 'appointments'), {
      ...appointmentData,
      createdAt: new Date(),
      status: 'confirmed',
      serviceCompleted: false,
      pointsAwarded: false
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Error creating appointment:', error);
    throw error;
  }
};

export const getUserAppointments = async (userId) => {
  try {
    const appointmentsQuery = query(
      collection(db, 'appointments'),
      where('userId', '==', userId)
    );
    const appointmentsCollection = await getDocs(appointmentsQuery);
    const appointments = appointmentsCollection.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    // Ordenar en el cliente para evitar índice compuesto
    return appointments.sort((a, b) => {
      const dateA = new Date(a.createdAt?.seconds * 1000 || 0);
      const dateB = new Date(b.createdAt?.seconds * 1000 || 0);
      return dateB - dateA;
    });
  } catch (error) {
    console.error('Error getting user appointments:', error);
    throw error;
  }
};

export const updateAppointmentStatus = async (appointmentId, status) => {
  try {
    await updateDoc(doc(db, 'appointments', appointmentId), { status });
    return { success: true };
  } catch (error) {
    console.error('Error updating appointment:', error);
    throw error;
  }
};

// Rewards
export const getRewards = async () => {
  try {
    const rewardsQuery = query(
      collection(db, 'rewards'),
      where('isActive', '==', true)
    );
    const rewardsCollection = await getDocs(rewardsQuery);
    return rewardsCollection.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting rewards:', error);
    throw error;
  }
};

// Points History
export const addPointsHistory = async (pointsData) => {
  try {
    await addDoc(collection(db, 'pointsHistory'), {
      ...pointsData,
      createdAt: new Date()
    });
    return { success: true };
  } catch (error) {
    console.error('Error adding points history:', error);
    throw error;
  }
};

export const getUserPointsHistory = async (userId) => {
  try {
    const historyQuery = query(
      collection(db, 'pointsHistory'),
      where('userId', '==', userId)
    );
    const historyCollection = await getDocs(historyQuery);
    const history = historyCollection.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    // Ordenar en el cliente para evitar índice compuesto
    return history.sort((a, b) => {
      const dateA = new Date(a.createdAt?.seconds * 1000 || 0);
      const dateB = new Date(b.createdAt?.seconds * 1000 || 0);
      return dateB - dateA;
    });
  } catch (error) {
    console.error('Error getting points history:', error);
    throw error;
  }
};

// Check appointment availability
export const checkAppointmentAvailability = async (barberId, date, time) => {
  try {
    const appointmentsQuery = query(
      collection(db, 'appointments'),
      where('barberId', '==', barberId),
      where('date', '==', date),
      where('time', '==', time),
      where('status', 'in', ['confirmed', 'pending'])
    );
    const existingAppointments = await getDocs(appointmentsQuery);
    return existingAppointments.empty; // true if available
  } catch (error) {
    console.error('Error checking availability:', error);
    throw error;
  }
};

// Backoffice: Mark service as completed and award points
export const completeService = async (appointmentId, userId) => {
  try {
    // Update appointment as completed
    await updateDoc(doc(db, 'appointments', appointmentId), {
      serviceCompleted: true,
      completedAt: new Date()
    });

    // Award points if not already awarded
    const appointmentDoc = await getDoc(doc(db, 'appointments', appointmentId));
    const appointmentData = appointmentDoc.data();
    
    if (!appointmentData.pointsAwarded) {
      // Add points to user
      const userDoc = await getDoc(doc(db, 'users', userId));
      const currentPoints = userDoc.data()?.points || 0;
      await updateDoc(doc(db, 'users', userId), {
        points: currentPoints + 20
      });

      // Add points history
      await addPointsHistory({
        userId,
        points: 20,
        type: 'service_completed',
        description: 'Servicio completado',
        appointmentId
      });

      // Mark points as awarded
      await updateDoc(doc(db, 'appointments', appointmentId), {
        pointsAwarded: true
      });
    }

    return { success: true };
  } catch (error) {
    console.error('Error completing service:', error);
    throw error;
  }
};