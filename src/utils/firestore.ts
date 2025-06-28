import { collection, doc, getDoc, getDocs, getFirestore, query, setDoc, updateDoc, where } from 'firebase/firestore';
import { app } from './firebase-config';

const db = getFirestore(app);

export interface UserProfile {
  uid?: string;
  email: string;
  name?: string;
  createdAt: string;
  approved?: boolean;
}

export const getOrCreateUserProfile = async (uid: string, email: string, name?: string): Promise<UserProfile> => {
  const userRef = doc(db, 'users', uid);
  const userSnap = await getDoc(userRef);
  if (!userSnap.exists()) {
    const profile: UserProfile = {
      uid,
      email,
      name: name || '',
      createdAt: new Date().toISOString(),
      approved: false, // New users start as not approved
    };
    await setDoc(userRef, profile);
    return profile;
  }
  return userSnap.data() as UserProfile;
};

export const getUserProfile = async (uid: string, email: string): Promise<UserProfile | null> => {
  // First, try to get the document by UID, which is the most efficient way.
  const userRef = doc(db, 'users', uid);
  const userSnap = await getDoc(userRef);
  if (userSnap.exists()) {
    return userSnap.data() as UserProfile;
  }

  // If that fails, try to find the user by email.
  const usersRef = collection(db, 'users');
  const q = query(usersRef, where("email", "==", email));
  const querySnapshot = await getDocs(q);

  if (!querySnapshot.empty) {
    const userDoc = querySnapshot.docs[0];
    const userProfile = userDoc.data() as UserProfile;

    // If the document was found by email, update it with the auth UID for future lookups.
    if (!userProfile.uid) {
        await updateDoc(userDoc.ref, { uid: uid });
        userProfile.uid = uid;
    }
    return userProfile;
  }

  return null; // User not found by UID or email.
};

export const updateUserProfile = async (uid: string, profileData: Partial<UserProfile>): Promise<void> => {
  const userRef = doc(db, 'users', uid);
  await updateDoc(userRef, profileData);
};
