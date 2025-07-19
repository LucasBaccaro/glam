
require('dotenv').config();
const { initializeApp, getApps } = require('firebase/app');
const { getFirestore, collection, addDoc } = require('firebase/firestore');

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
};

// Verificar si Firebase ya está inicializado
let app;
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

const db = getFirestore(app);

const initialData = {
  locations: [
    {
      name: "Peluquería Mitre",
      address: "Mitre 123, Buenos Aires",
      phone: "+54911111111",
      photo: "https://example.com/mitre.jpg",
      workingHours: {
        monday: { start: "10:00", end: "18:00" },
        tuesday: { start: "10:00", end: "18:00" },
        wednesday: { start: "10:00", end: "18:00" },
        thursday: { start: "10:00", end: "18:00" },
        friday: { start: "10:00", end: "18:00" },
        saturday: null,
        sunday: null
      }
    },
    {
      name: "Peluquería Gerli",
      address: "Gerli 456, Buenos Aires", 
      phone: "+54922222222",
      photo: "https://example.com/gerli.jpg",
      workingHours: {
        monday: { start: "10:00", end: "18:00" },
        tuesday: { start: "10:00", end: "18:00" },
        wednesday: { start: "10:00", end: "18:00" },
        thursday: { start: "10:00", end: "18:00" },
        friday: { start: "10:00", end: "18:00" },
        saturday: null,
        sunday: null
      }
    },
    {
      name: "Peluquería Lavalle",
      address: "Lavalle 789, Buenos Aires",
      phone: "+54933333333", 
      photo: "https://example.com/lavalle.jpg",
      workingHours: {
        monday: { start: "10:00", end: "18:00" },
        tuesday: { start: "10:00", end: "18:00" },
        wednesday: { start: "10:00", end: "18:00" },
        thursday: { start: "10:00", end: "18:00" },
        friday: { start: "10:00", end: "18:00" },
        saturday: null,
        sunday: null
      }
    }
  ],
  barbers: [
    // Peluquería Mitre
    { name: "Lautaro", locationName: "Peluquería Mitre", photo: "url" },
    { name: "Carlos", locationName: "Peluquería Mitre", photo: "url" },
    { name: "Juan", locationName: "Peluquería Mitre", photo: "url" },
    // Peluquería Gerli  
    { name: "Nicolas", locationName: "Peluquería Gerli", photo: "url" },
    { name: "Pedro", locationName: "Peluquería Gerli", photo: "url" },
    { name: "Luis", locationName: "Peluquería Gerli", photo: "url" },
    // Peluquería Lavalle
    { name: "Franco", locationName: "Peluquería Lavalle", photo: "url" },
    { name: "Toto", locationName: "Peluquería Lavalle", photo: "url" },
    { name: "Matias", locationName: "Peluquería Lavalle", photo: "url" }
  ],
  rewards: [
    { 
      title: "20% Descuento", 
      description: "Obtén un 20% de descuento en tu próximo corte",
      pointsCost: 50, 
      discountPercent: 20,
      isActive: true
    },
    { 
      title: "Corte Gratis", 
      description: "Un corte de cabello completamente gratis",
      pointsCost: 100, 
      discountPercent: 100,
      isActive: true
    },
    { 
      title: "Tratamiento Capilar", 
      description: "Tratamiento capilar profesional incluido",
      pointsCost: 150, 
      discountPercent: 100,
      isActive: true
    }
  ]
};

const uploadData = async () => {
  try {
    console.log('Uploading locations...');
    for (const location of initialData.locations) {
      const docRef = await addDoc(collection(db, 'locations'), {
        ...location,
        isOpen: true
      });
      console.log('Added location with ID: ', docRef.id);

      const barbersInLocation = initialData.barbers.filter(b => b.locationName === location.name);
      for (const barber of barbersInLocation) {
        await addDoc(collection(db, 'barbers'), { 
          ...barber, 
          locationId: docRef.id,
          rating: 4.5,
          totalRatings: 15,
          isActive: true
        });
        console.log(`Added barber ${barber.name} to ${location.name}`);
      }
    }

    console.log('Uploading rewards...');
    for (const reward of initialData.rewards) {
      await addDoc(collection(db, 'rewards'), reward);
      console.log(`Added reward: ${reward.title}`);
    }

    console.log('Data upload complete.');
  } catch (e) {
    console.error("Error adding document: ", e);
  }
};

uploadData();
