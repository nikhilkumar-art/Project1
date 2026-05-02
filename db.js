import mockData from '../data/kaggleMockData.json';
import { db } from '../firebase';
import { collection, addDoc, getDocs, updateDoc, doc, query, where, orderBy, setDoc, getDoc } from 'firebase/firestore';

const VIOLATIONS_COLLECTION = 'violations';
const USERS_COLLECTION = 'users';
const DB_KEY = 'traffic_violations_db';
const USERS_DB_KEY = 'traffic_users_db';

// Admins are hardcoded
const ADMINS = [
  { email: 'asif@admin.com', password: 'asif934' },
  { email: 'pabitra@admin.com', password: 'pabitra123' },
  { email: 'nikhil@admin.com', password: 'nikhil123' }
];

// --- Users DB Functions (Firestore) ---

export const registerUser = async (email, password) => {
  try {
    if (!db) return { success: true, user: { email, role: 'user' } }; // Mock fallback
    
    if (ADMINS.some(admin => admin.email === email)) return { success: false, message: 'Cannot register admin email.' };
    
    const userRef = doc(db, USERS_COLLECTION, email);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      return { success: false, message: 'User already exists.' };
    }
    
    const newUser = { email, password, role: 'user', createdAt: Date.now() };
    console.log("Registering new cloud user:", email);
    await setDoc(userRef, newUser);
    return { success: true, user: { email, role: 'user' } };
  } catch (error) {
    console.error("Error registering user:", error);
    return { success: false, message: error.message };
  }
};

export const verifyUser = async (email, password) => {
  try {
    const admin = ADMINS.find(a => a.email === email && a.password === password);
    if (admin) {
      return { success: true, user: { email, role: 'admin' } };
    }
    
    if (!db) return { success: false, message: 'Cloud DB not connected.' };
    
    const userRef = doc(db, USERS_COLLECTION, email);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      const userData = userSnap.data();
      if (userData.password === password) {
        console.log("Cloud user verified successfully:", email);
        return { success: true, user: { email: userData.email, role: 'user' } };
      } else {
        console.warn("Cloud user password mismatch:", email);
      }
    }
    console.warn("User not found in Cloud DB:", email);
    return { success: false, message: 'Invalid credentials.' };
  } catch (error) {
    console.error("Error verifying user:", error);
    return { success: false, message: error.message };
  }
};

// --- Violations DB Functions (Firestore) ---

const migrateLocalStorageToFirestore = async () => {
  try {
    const localData = localStorage.getItem(DB_KEY);
    if (localData && db) {
      const violations = JSON.parse(localData);
      console.log(`Migrating ${violations.length} reports from LocalStorage to Firestore...`);
      for (const v of violations) {
        const id = v.id || Date.now().toString() + Math.random().toString(36).substr(2, 9);
        await setDoc(doc(db, VIOLATIONS_COLLECTION, id), {
          ...v,
          timestamp: v.timestamp || (new Date(v.date + 'T' + v.time).getTime()) || Date.now()
        }, { merge: true });
      }
      localStorage.removeItem(DB_KEY);
    }
  } catch (error) {
    console.error("Error migrating data: ", error);
  }
};

const seedMockDataIfNeeded = async () => {
  try {
    if (!db) return;
    const querySnapshot = await getDocs(collection(db, VIOLATIONS_COLLECTION));
    if (querySnapshot.empty) {
      console.log("Firestore is empty. Seeding mock data...");
      for (const violation of mockData) {
        await setDoc(doc(db, VIOLATIONS_COLLECTION, violation.id), {
          ...violation,
          timestamp: new Date(violation.date + 'T' + violation.time).getTime() || Date.now()
        });
      }
    }
  } catch (error) {
    console.error("Error seeding mock data: ", error);
  }
};

export const initDB = async () => {
  if (db) {
    await migrateLocalStorageToFirestore();
    await seedMockDataIfNeeded();
  }
};

export const getViolations = async () => {
  try {
    if (!db) return mockData;
    const q = query(collection(db, VIOLATIONS_COLLECTION), orderBy('timestamp', 'desc'));
    const querySnapshot = await getDocs(q);
    const violations = [];
    querySnapshot.forEach((doc) => {
      violations.push({ id: doc.id, ...doc.data() });
    });
    if (violations.length === 0) {
        const fallbackSnapshot = await getDocs(collection(db, VIOLATIONS_COLLECTION));
        fallbackSnapshot.forEach((doc) => {
            violations.push({ id: doc.id, ...doc.data() });
        });
    }
    return violations;
  } catch (error) {
    if (!db) return mockData;
    const fallbackSnapshot = await getDocs(collection(db, VIOLATIONS_COLLECTION));
    const violations = [];
    fallbackSnapshot.forEach((doc) => {
        violations.push({ id: doc.id, ...doc.data() });
    });
    return violations;
  }
};

export const getUserViolations = async (email) => {
  try {
    if (!db) return [];
    const q = query(collection(db, VIOLATIONS_COLLECTION), where("userEmail", "==", email));
    const querySnapshot = await getDocs(q);
    const violations = [];
    querySnapshot.forEach((doc) => {
      violations.push({ id: doc.id, ...doc.data() });
    });
    return violations;
  } catch (error) {
    return [];
  }
};

export const addViolation = async (violation, userEmail) => {
  try {
    if (!db) throw new Error("Database not initialized");
    const newViolation = {
      ...violation,
      status: 'Pending',
      userEmail: userEmail || 'anonymous',
      evidenceUrl: violation.evidenceUrl || 'https://images.unsplash.com/photo-1605810230434-7631ac76ec81?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      timestamp: Date.now()
    };
    const docRef = await addDoc(collection(db, VIOLATIONS_COLLECTION), newViolation);
    return { id: docRef.id, ...newViolation };
  } catch (error) {
    alert("Database Error: " + error.message);
    throw error;
  }
};

export const updateViolationStatus = async (id, newStatus) => {
  try {
    if (!db) return false;
    const violationRef = doc(db, VIOLATIONS_COLLECTION, id);
    await updateDoc(violationRef, { status: newStatus });
    return true;
  } catch (error) {
    return false;
  }
};
