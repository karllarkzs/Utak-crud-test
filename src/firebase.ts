import { initializeApp } from 'firebase/app';
import {
  getDatabase,
  ref,
  onValue,
  off,
  remove,
  push,
  update,
} from 'firebase/database';

const firebaseConfig = {
  apiKey: 'AIzaSyBgdZLpc4wSTI1HVUml-jbjxfxow2i6pp8',
  authDomain: 'utak-test-17e1b.firebaseapp.com',
  projectId: 'utak-test-17e1b',
  storageBucket: 'utak-test-17e1b.appspot.com',
  messagingSenderId: '1038745084694',
  appId: '1:1038745084694:web:58f1f10ae525a3474a6637',
  measurementId: 'G-98BDFHP9MJ',
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { database, ref, onValue, off, remove, push, update };
