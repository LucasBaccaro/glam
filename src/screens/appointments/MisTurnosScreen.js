
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, ActivityIndicator, RefreshControl } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { getUserAppointments, updateAppointmentStatus } from '../../services/firestore.service';

const MisTurnosScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (user) {
      loadAppointments();
    }
  }, [user]);

  const loadAppointments = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const userAppointments = await getUserAppointments(user.uid);
      
      // Ordenar por fecha y hora
      const sortedAppointments = userAppointments.sort((a, b) => {
        const dateA = new Date(`${a.date} ${a.time}`);
        const dateB = new Date(`${b.date} ${b.time}`);
        return dateB - dateA; // Más recientes primero
      });
      
      setAppointments(sortedAppointments);
    } catch (error) {
      console.error('Error loading appointments:', error);
      Alert.alert('Error', 'No se pudieron cargar los turnos');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadAppointments();
    setRefreshing(false);
  };

  const handleCancelAppointment = (appointment) => {
    const appointmentDateTime = new Date(`${appointment.date} ${appointment.time}`);
    const now = new Date();
    const twoHoursFromNow = new Date(now.getTime() + (2 * 60 * 60 * 1000));

    if (appointmentDateTime < twoHoursFromNow) {
      Alert.alert(
        'No se puede cancelar',
        'Solo puedes cancelar turnos con al menos 2 horas de anticipación'
      );
      return;
    }

    Alert.alert(
      'Confirmar Cancelación',
      '¿Estás seguro de que quieres cancelar este turno?',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Sí, cancelar',
          style: 'destructive',
          onPress: () => cancelAppointment(appointment.id)
        }
      ]
    );
  };

  const cancelAppointment = async (appointmentId) => {
    try {
      await updateAppointmentStatus(appointmentId, 'cancelled');
      Alert.alert('Turno cancelado', 'Tu turno ha sido cancelado exitosamente');
      await loadAppointments(); // Recargar la lista
    } catch (error) {
      console.error('Error cancelling appointment:', error);
      Alert.alert('Error', 'No se pudo cancelar el turno');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return '#2e7d32';
      case 'completed':
        return '#1565c0';
      case 'cancelled':
        return '#d32f2f';
      default:
        return '#666';
    }
  };

  const getStatusText = (status, serviceCompleted) => {
    switch (status) {
      case 'confirmed':
        return serviceCompleted ? 'Servicio Completado' : 'Confirmado';
      case 'completed':
        return 'Completado';
      case 'cancelled':
        return 'Cancelado';
      case 'pending':
        return 'Pendiente';
      default:
        return status;
    }
  };

  const isUpcoming = (appointment) => {
    const appointmentDateTime = new Date(`${appointment.date} ${appointment.time}`);
    const now = new Date();
    return appointmentDateTime > now && appointment.status === 'confirmed';
  };

  const canCancel = (appointment) => {
    if (appointment.status !== 'confirmed') return false;
    
    const appointmentDateTime = new Date(`${appointment.date} ${appointment.time}`);
    const now = new Date();
    const twoHoursFromNow = new Date(now.getTime() + (2 * 60 * 60 * 1000));
    
    return appointmentDateTime > twoHoursFromNow;
  };

  const renderAppointment = ({ item }) => (
    <View style={styles.appointmentCard}>
      <View style={styles.appointmentHeader}>
        <Text style={styles.appointmentDate}>
          {new Date(item.date).toLocaleDateString('es-ES', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          <Text style={styles.statusText}>{getStatusText(item.status, item.serviceCompleted)}</Text>
        </View>
      </View>

      <View style={styles.appointmentDetails}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>🕐 Hora:</Text>
          <Text style={styles.detailValue}>{item.time}</Text>
        </View>
        
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>👨‍💼 Peluquero:</Text>
          <Text style={styles.detailValue}>{item.barberName || 'No especificado'}</Text>
        </View>
        
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>📍 Ubicación:</Text>
          <Text style={styles.detailValue}>{item.locationName || 'No especificada'}</Text>
        </View>
        
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>💰 Precio:</Text>
          <Text style={styles.detailValue}>${item.amount?.toLocaleString() || '0'}</Text>
        </View>
        
        {item.paymentId && (
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>🧾 ID Pago:</Text>
            <Text style={styles.detailValue}>{item.paymentId}</Text>
          </View>
        )}

        {item.serviceCompleted && item.pointsAwarded && (
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>🎁 Puntos:</Text>
            <Text style={styles.detailValue}>+20 puntos otorgados</Text>
          </View>
        )}
      </View>

      {isUpcoming(item) && (
        <View style={styles.upcomingBadge}>
          <Text style={styles.upcomingText}>📅 Próximo turno</Text>
        </View>
      )}

      {canCancel(item) && (
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => handleCancelAppointment(item)}
        >
          <Text style={styles.cancelButtonText}>Cancelar Turno</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#000000" />
        <Text style={styles.loadingText}>Cargando turnos...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mis Turnos</Text>
      
      {appointments.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>📅</Text>
          <Text style={styles.emptyTitle}>No tienes turnos</Text>
          <Text style={styles.emptyText}>¡Reserva tu primer turno ahora!</Text>
          <TouchableOpacity
            style={styles.bookButton}
            onPress={() => navigation.navigate('Reservar')}
          >
            <Text style={styles.bookButtonText}>Reservar Turno</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={appointments}
          renderItem={renderAppointment}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          contentContainerStyle={styles.listContainer}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  appointmentCard: {
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#eee',
    elevation: 2,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  appointmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  appointmentDate: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    flex: 1,
    textTransform: 'capitalize',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 10,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  appointmentDetails: {
    marginBottom: 15,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  detailValue: {
    fontSize: 14,
    color: '#000',
    fontWeight: '500',
    flex: 1,
    textAlign: 'right',
  },
  upcomingBadge: {
    backgroundColor: '#e3f2fd',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
  },
  upcomingText: {
    color: '#1565c0',
    fontSize: 14,
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: '#f44336',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyIcon: {
    fontSize: 60,
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 10,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
  },
  bookButton: {
    backgroundColor: '#000',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 10,
  },
  bookButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default MisTurnosScreen;
