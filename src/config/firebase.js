// src/config/firebase.js
// Configuração do Firebase

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyAwql7q-ONJ01-ONWYZ3d2-s1jcMSO-dnQ",
  authDomain: "football-coach-platform.firebaseapp.com",
  databaseURL: "https://football-coach-platform-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "football-coach-platform",
  storageBucket: "football-coach-platform.firebasestorage.app",
  messagingSenderId: "800887208166",
  appId: "1:800887208166:web:12b23de83521260c4ba327"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Exportar serviços
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
