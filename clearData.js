require('dotenv').config();
const { initializeApp, getApps } = require('firebase/app');
const { getFirestore, collection, getDocs, deleteDoc, doc } = require('firebase/firestore');

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

const clearCollections = async () => {
  const collections = ['locations', 'barbers', 'rewards', 'appointments'];
  
  for (const collectionName of collections) {
    try {
      const querySnapshot = await getDocs(collection(db, collectionName));
      console.log(`Deleting ${querySnapshot.docs.length} documents from ${collectionName}...`);
      
      for (const document of querySnapshot.docs) {
        await deleteDoc(doc(db, collectionName, document.id));
      }
      
      console.log(`✅ Cleared ${collectionName}`);
    } catch (error) {
      console.error(`Error clearing ${collectionName}:`, error);
    }
  }
  
  console.log('🧹 All collections cleared!');
};

clearCollections();