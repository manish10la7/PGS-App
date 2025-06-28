import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ImageBackground, // If the top orange part is an image
  SafeAreaView, // To handle notches and safe areas
  Platform, // For platform-specific styling if needed
} from 'react-native';
// You'd typically import icons from a library like react-native-vector-icons
// import Icon from 'react-native-vector-icons/FontAwesome'; // Example

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleLogin = () => {
    // Implement your login logic here
    console.log('Logging in with:', email, password);
    // e.g., make an API call
  };

  const handleGoogleLogin = () => {
    // Implement Google login logic here (e.g., using @react-native-google-signin/google-signin)
    console.log('Continuing with Google');
  };

  const handleForgotPassword = () => {
    // Navigate to forgot password screen
    console.log('Forgot Password?');
  };

  const handleSignUp = () => {
    // Navigate to sign up screen
    console.log('Sign Up');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Orange Section */}
      <View style={styles.topSection}>
        {/* If it's an image background */}
        {/* <ImageBackground source={require('./path/to/your/orange-pattern.png')} style={styles.topSection}> */}
        <Text style={styles.title}>Sign in to your Account</Text>
        <Text style={styles.subtitle}>Enter your email and password to log in</Text>
        {/* </ImageBackground> */}
      </View>

      {/* White Card Section */}
      <View style={styles.card}>
        {/* Continue with Google Button */}
        <TouchableOpacity style={styles.googleButton} onPress={handleGoogleLogin}>
          {/* You'd place a Google icon here, possibly using react-native-vector-icons */}
          {/* <Icon name="google" size={20} color="#4285F4" /> */}
          <Text style={styles.googleButtonText}>Continue with Google</Text>
        </TouchableOpacity>

        <Text style={styles.orLoginWith}>Or login with</Text>

        {/* Email Input */}
        <TextInput
          style={styles.input}
          placeholder="Your Email here"
          placeholderTextColor="#999"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />

        {/* Password Input */}
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="********"
            placeholderTextColor="#999"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.passwordToggle}>
            {/* Replace with an actual eye icon */}
            <Text style={{ color: '#888', fontSize: 18 }}>{showPassword ? '👁️' : '🔒'}</Text>
          </TouchableOpacity>
        </View>

        {/* Remember Me and Forgot Password */}
        <View style={styles.checkboxContainer}>
          <TouchableOpacity onPress={() => setRememberMe(!rememberMe)} style={styles.checkbox}>
            {/* Simple checkbox representation */}
            <View style={[styles.checkboxBox, rememberMe && styles.checkboxBoxChecked]}>
              {rememberMe && <Text style={styles.checkboxCheck}>✓</Text>}
            </View>
            <Text style={styles.checkboxText}>Remember me</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleForgotPassword}>
            <Text style={styles.forgotPasswordText}>Forgot Password ?</Text>
          </TouchableOpacity>
        </View>

        {/* Log In Button */}
        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>Log In</Text>
        </TouchableOpacity>

        {/* Don't have an account? Sign Up */}
        <View style={styles.signUpContainer}>
          <Text style={styles.signUpText}>Don't have an account? </Text>
          <TouchableOpacity onPress={handleSignUp}>
            <Text style={styles.signUpLink}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5E0E0', // Light pink background
  },
  topSection: {
    backgroundColor: '#FF6F00', // Orange color
    paddingVertical: 50,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomLeftRadius: 50, // To mimic the curve, adjust as needed
    borderBottomRightRadius: 50, // To mimic the curve, adjust as needed
    // If you use ImageBackground, ensure it covers the area
    // width: '100%',
    // height: 250, // Adjust height as needed
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 5,
    marginTop: Platform.OS === 'android' ? 20 : 0, // Adjust for Android status bar
  },
  subtitle: {
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginTop: -80, // Pulls the card up over the orange section
    borderRadius: 10,
    padding: 20,
    elevation: 5, // Shadow for Android
    shadowColor: '#000', // Shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DDDDDD',
    borderRadius: 5,
    paddingVertical: 12,
    marginBottom: 15,
  },
  googleButtonText: {
    fontSize: 16,
    color: '#555555',
    marginLeft: 10,
  },
  orLoginWith: {
    textAlign: 'center',
    color: '#AAAAAA',
    marginVertical: 15,
  },
  input: {
    height: 50,
    borderColor: '#DDDDDD',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#DDDDDD',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    height: 50,
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: 15,
    fontSize: 16,
  },
  passwordToggle: {
    padding: 10,
  },
  checkboxContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  checkbox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkboxBox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: '#DDDDDD',
    borderRadius: 3,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  checkboxBoxChecked: {
    backgroundColor: '#FF6F00', // Orange
    borderColor: '#FF6F00',
  },
  checkboxCheck: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  checkboxText: {
    fontSize: 14,
    color: '#555555',
  },
  forgotPasswordText: {
    fontSize: 14,
    color: '#FF6F00', // Orange
    fontWeight: 'bold',
  },
  loginButton: {
    backgroundColor: '#FF6F00', // Orange
    borderRadius: 5,
    paddingVertical: 15,
    alignItems: 'center',
    marginBottom: 20,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  signUpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  signUpText: {
    fontSize: 14,
    color: '#555555',
  },
  signUpLink: {
    fontSize: 14,
    color: '#FF6F00', // Orange
    fontWeight: 'bold',
  },
});

export default LoginScreen;