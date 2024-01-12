
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyBpX9Avr0rnivCIWXhfXLcdfKzLQ9Ywvuw",
  authDomain: "fir-auth-ab796.firebaseapp.com",
  projectId: "fir-auth-ab796",
  storageBucket: "fir-auth-ab796.appspot.com",
  messagingSenderId: "905111380907",
  appId: "1:905111380907:web:1334e7d3f14cc5581a28ee"
};
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

const authPersistence = getReactNativePersistence(ReactNativeAsyncStorage);

export { db, authPersistence};