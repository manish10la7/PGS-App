// components/HomeScreen.js
import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Linking, ImageBackground } from 'react-native';

// FIXED: Changed prop from `onSignInPress` to `onLoginPress` to match App.js
const HomeScreen = ({ onLoginPress, onSignUpPress }) => {
  const handleEnrollMe = () => {
    Linking.openURL('https://presidential.edu.np/enquiry');
  };

  return (
    <ImageBackground
      source={require('../assets/Welcome_BGM.png')}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.mainContent}>
        <Text style={styles.mainText}> </Text>
        <Text style={styles.mainText}> </Text>
        <Text style={styles.mainText}> </Text>

        <Text style={styles.mainText}> Welcome</Text>

        <TouchableOpacity style={styles.enrollButton} onPress={handleEnrollMe}>
          <Text style={styles.enrollButtonText}>Enroll Me</Text>
        </TouchableOpacity>

        <View style={styles.authContainer}>
          {/* FIXED: `onPress` now correctly calls `onLoginPress` */}
          <TouchableOpacity style={styles.authButton} onPress={onLoginPress}>
            {/* Changed text for consistency */}
            <Text style={styles.authButtonText}>Login</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.authButton} onPress={onSignUpPress}>
            <Text style={styles.authButtonText}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Text style={styles.footerText}>
        Copyright © Presidential Graduate School 2025
      </Text>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    paddingHorizontal: 20,
  },
  mainContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  mainText: {
    fontSize: 72,
    fontWeight: 'bold',
    marginBottom: 50,
    color: '#ffffff',
    textShadowColor: 'rgba(255, 255, 255, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  enrollButton: {
    backgroundColor: '#ff6600',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 10,
    marginBottom: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  enrollButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  authContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '80%',
    marginTop: 20,
  },
  authButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.2)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  authButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: 'bold',
  },
  footerText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    paddingBottom: 30,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});

export default HomeScreen;