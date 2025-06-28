// components/SplashScreen.js
import React from 'react';
import { StyleSheet, View, Image, SafeAreaView, Platform } from 'react-native';

const SplashScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Image
        source={require('../assets/logo.png')}
        style={styles.logo}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF', // White background for the splash screen
    justifyContent: 'center', // Center content vertically
    alignItems: 'center',    // Center content horizontally
    paddingTop: Platform.OS === 'android' ? 32 : 0, // Add top padding for Android status bar
  },
  logo: {
    width: 200, // Adjust size as needed
    height: 200, // Adjust size as needed
    resizeMode: 'contain', // Ensures the whole image is visible within the bounds without cropping
  },
});

export default SplashScreen;
