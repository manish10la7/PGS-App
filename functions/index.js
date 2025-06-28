
const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

exports.createUser = functions.firestore
  .document('users/{userId}')
  .onCreate(async (snap, context) => {
    const newUser = snap.data();
    const { email, name } = newUser;

    try {
      // Create user in Firebase Authentication
      const userRecord = await admin.auth().createUser({
        email: email,
        emailVerified: false,
        password: 'admin1', // Set default password
        displayName: name,
        disabled: false,
      });

      console.log('Successfully created new user:', userRecord.uid);

      // Optionally, you can update the Firestore document with the new UID
      return snap.ref.set({ uid: userRecord.uid }, { merge: true });

    } catch (error) {
      console.error('Error creating new user:', error);
      // Optionally, you can add error handling here, like deleting the Firestore document
      // if the auth user creation fails.
    }
  });
