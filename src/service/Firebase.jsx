import { initializeApp } from 'firebase/app';
import { getFirestore, deleteDoc, doc } from 'firebase/firestore';
import { getStorage, ref, deleteObject } from 'firebase/storage';
import { collection, getDocs } from "firebase/firestore";



const firebaseConfig = {
  apiKey: "AIzaSyDRzJCRu_jl97Ug_l2lKl8A2Kp78WbOPXo",
  authDomain: "talonario-laravel.firebaseapp.com",
  projectId: "talonario-laravel",
  storageBucket: "talonario-laravel.appspot.com",
  messagingSenderId: "688583042940",
  appId: "1:688583042940:web:4a19d97c39282de86526f9"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

const deleteDocument = async (collection, docId) => {
  try {
    await deleteDoc(doc(db, collection, docId));
    console.log('Documento eliminado correctamente');
  } catch (error) {
    console.error('Error al eliminar el documento:', error);
  }
};

const deleteFile = async (path) => {
  try {
    await deleteObject(ref(storage, path));
    console.log('Archivo eliminado correctamente');
  } catch (error) {
    console.error('Error al eliminar el archivo:', error);
  }
};

export { db, storage, deleteDocument, deleteFile };
