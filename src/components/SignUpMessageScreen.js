import { LinearGradient } from 'expo-linear-gradient';
import { addDoc, collection, getFirestore } from 'firebase/firestore';
import { useState } from 'react';
import { Alert, Image, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { app } from '../utils/firebase-config';

const db = getFirestore(app);

const PRIMARY = '#ff6600';
const DEEPBLUE = '#1c107a';
const WHITE = '#fff';
const GRADIENT = ['#ffb347', '#e0e7ff'];

const SignUpScreen = ({ onGoBack, onSignUpSuccess }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [gapID, setGapID] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [enrolledYear, setEnrolledYear] = useState('');
  const [currentTrimester, setCurrentTrimester] = useState('');
  const [clubs, setClubs] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSignUp = async () => {
    if (!name || !email || !gapID) {
      Alert.alert('Error', 'Please fill in at least your Name, Email, and GAP ID.');
      return;
    }
    setIsLoading(true);
    try {
      await addDoc(collection(db, 'users'), {
        name,
        email,
        gapID,
        phone,
        address,
        enrolledYear,
        currentTrimester,
        clubs: clubs ? clubs.split(',').map(s => s.trim()) : [],
        createdAt: new Date().toISOString(),
        approved: false,
      });
      setIsLoading(false);
      Alert.alert(
        'Request Sent',
        'Your sign up request has been sent. Please contact the administrator.',
        [
          { text: 'OK', onPress: onGoBack },
        ]
      );
    } catch (error) {
      setIsLoading(false);
      Alert.alert('Error', 'Failed to send sign up request.');
    }
  };

  return (
    <LinearGradient colors={GRADIENT} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.contentContainer}>
            <Image source={require('../assets/png_logo.png')} style={styles.logo} />
            <Text style={styles.title}>Create Your Account</Text>
            <Text style={styles.subtitle}>Join our community and get started.</Text>
            
            <TextInput
              style={styles.input}
              placeholder="Full Name"
              placeholderTextColor="#888"
              value={name}
              onChangeText={setName}
              editable={!isLoading}
            />
            <TextInput
              style={styles.input}
              placeholder="Email Address"
              placeholderTextColor="#888"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              editable={!isLoading}
            />
            <TextInput
              style={styles.input}
              placeholder="GAP ID"
              placeholderTextColor="#888"
              value={gapID}
              onChangeText={setGapID}
              editable={!isLoading}
            />
            <TextInput
              style={styles.input}
              placeholder="Phone"
              placeholderTextColor="#888"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              editable={!isLoading}
            />
            <TextInput
              style={styles.input}
              placeholder="Address"
              placeholderTextColor="#888"
              value={address}
              onChangeText={setAddress}
              editable={!isLoading}
            />
            <TextInput
              style={styles.input}
              placeholder="Enrolled Year"
              placeholderTextColor="#888"
              value={enrolledYear}
              onChangeText={setEnrolledYear}
              keyboardType="numeric"
              editable={!isLoading}
            />
            <TextInput
              style={styles.input}
              placeholder="Current Trimester"
              placeholderTextColor="#888"
              value={currentTrimester}
              onChangeText={setCurrentTrimester}
              editable={!isLoading}
            />
            <TextInput
              style={styles.input}
              placeholder="Clubs (comma-separated)"
              placeholderTextColor="#888"
              value={clubs}
              onChangeText={setClubs}
              editable={!isLoading}
            />
            
            <TouchableOpacity style={styles.button} onPress={handleSignUp} disabled={isLoading}>
              <Text style={styles.buttonText}>{isLoading ? 'Submitting...' : 'Submit Request'}</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.backButton} onPress={onGoBack} disabled={isLoading}>
              <Text style={styles.backButtonText}>Go Back to Login</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  contentContainer: {
    width: '90%',
    maxWidth: 400,
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  logo: {
    width: 120,
    height: 120,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: DEEPBLUE,
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#555',
    marginBottom: 30,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: WHITE,
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  button: {
    backgroundColor: PRIMARY,
    paddingVertical: 15,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  buttonText: {
    color: WHITE,
    fontSize: 18,
    fontWeight: 'bold',
  },
  backButton: {
    marginTop: 20,
  },
  backButtonText: {
    color: DEEPBLUE,
    fontSize: 16,
    fontWeight: '500',
  },
});

export default SignUpScreen;
