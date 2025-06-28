import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { useEffect, useState } from 'react';
import {
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const { width, height } = Dimensions.get('window');

const GOOGLE_CLIENT_ID = '873881775686-qd96ic843ek8vomjcikkuvgmm17enjr9.apps.googleusercontent.com';
WebBrowser.maybeCompleteAuthSession();

const LoginScreen = ({ onGoBack, onSignUpPress, onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId: GOOGLE_CLIENT_ID,
    androidClientId: GOOGLE_CLIENT_ID,
    iosClientId: GOOGLE_CLIENT_ID,
    webClientId: GOOGLE_CLIENT_ID,
  });

  const FIREBASE_API_KEY = 'AIzaSyBrYwpeb9cBUhpcFo4tRw9i1B1FiLl_0FQ';

  const handleLogin = async () => {
    setLoginError('');
    setIsLoading(true);

    if (!email || !password) {
      setLoginError('Please enter both email and password.');
      setIsLoading(false);
      return;
    }

    try {
      // Firebase REST API endpoint for signInWithPassword
      const response = await fetch(
        `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${FIREBASE_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: email.trim(),
            password,
            returnSecureToken: true,
          }),
        }
      );
      const data = await response.json();
      if (response.ok) {
        setLoginError('');
        if (onLoginSuccess) {
          onLoginSuccess(data);
        }
      } else {
        setLoginError(data.error?.message || 'Login failed.');
      }
    } catch (error) {
      setLoginError(error.message || 'Login failed.');
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (response?.type === 'success') {
      const { authentication } = response;
      // You can use authentication.accessToken to fetch user info from Google if needed
      if (onLoginSuccess) {
        onLoginSuccess({ google: true, ...authentication });
      }
    }
  }, [response]);

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.topSection}>
            {onGoBack && (
              <TouchableOpacity style={styles.backButton} onPress={onGoBack}>
                <Text style={styles.backButtonText}>←</Text>
              </TouchableOpacity>
            )}
            <Image
              source={require('../assets/png_logo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={styles.title}>Login</Text>
            <Text style={styles.subtitle}>Welcome to Presidential Graduate School</Text>
          </View>

          <View style={styles.centerContent}>
            <View style={styles.card}>
              <TouchableOpacity
                style={styles.googleButton}
                onPress={() => promptAsync()}
                disabled={!request || isLoading}
              >
                <Image
                  source={require('../assets/google_logo.png')}
                  style={styles.googleLogo}
                  resizeMode="contain"
                />
                <Text style={styles.googleButtonText}>Sign in with Google</Text>
              </TouchableOpacity>

              <View style={styles.orContainer}>
                <View style={styles.line} />
                <Text style={styles.orText}>or</Text>
                <View style={styles.line} />
              </View>

              {loginError ? <Text style={styles.errorText}>{loginError}</Text> : null}

              <TextInput
                style={styles.input}
                placeholder="Student Email"
                placeholderTextColor="#999"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
                editable={!isLoading}
              />

              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.passwordInput}
                  placeholder="********"
                  placeholderTextColor="#999"
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={setPassword}
                  editable={!isLoading}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.passwordToggle} disabled={isLoading}>
                  <Text style={{ color: '#888', fontSize: 18 }}>{showPassword ? '👁️' : '🔒'}</Text>
                </TouchableOpacity>
              </View>

              {/* Remember Me */}
              <View style={styles.rememberMeContainer}>
                <TouchableOpacity
                  style={styles.rememberMeBox}
                  onPress={() => setRememberMe(!rememberMe)}
                  disabled={isLoading}
                >
                  <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]}>
                    {rememberMe && <Text style={styles.checkboxTick}>✓</Text>}
                  </View>
                  <Text style={styles.rememberMeText}>Remember Me</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity style={styles.loginButton} onPress={handleLogin} disabled={isLoading}>
                <Text style={styles.loginButtonText}>
                  {isLoading ? 'Logging In...' : 'Log In'}
                </Text>
              </TouchableOpacity>

              <View style={styles.signUpContainer}>
                <Text style={styles.signUpText}>Don't have an account? </Text>
                <TouchableOpacity onPress={() => onSignUpPress()} disabled={isLoading}>
                  <Text style={styles.signUpLink}>Sign Up</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
        <View style={styles.footerContainer}>
          <Text style={styles.footerText}>Copyright © Presidential Graduate School 2025</Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5E0E0',
    paddingTop: Platform.OS === 'android' ? 32 : 0, // Add top padding for Android status bar
  },
  topSection: {
    paddingVertical: height * 0.08,
    paddingHorizontal: width * 0.05,
    alignItems: 'center',
    justifyContent: 'flex-end',
    borderBottomLeftRadius: width * 0.12,
    borderBottomRightRadius: width * 0.12,
    backgroundColor: '#FF6F00',
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  footerContainer: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: height * 0.015,
  },
  backButton: {
    position: 'absolute',
    top: Platform.OS === 'android' ? height * 0.04 : height * 0.06,
    left: width * 0.05,
    zIndex: 1,
    padding: width * 0.02,
  },
  backButtonText: {
    fontSize: width * 0.06,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  title: {
    fontSize: width * 0.08,
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginBottom: height * 0.012,
  },
  subtitle: {
    fontSize: width * 0.04,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  logo: {
    width: width * 0.3,
    height: width * 0.3,
    marginBottom: height * 0.02,
  },
  card: {
    width: width * 0.9,
    backgroundColor: '#FFFFFF',
    borderRadius: width * 0.05,
    padding: width * 0.06,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 8,
    marginTop: -height * 0.06,
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: width * 0.03,
    paddingVertical: height * 0.015,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    marginBottom: height * 0.02,
  },
  googleLogo: {
    width: width * 0.06,
    height: width * 0.06,
    marginRight: width * 0.03,
  },
  googleButtonText: {
    fontSize: width * 0.04,
    color: '#333',
    fontWeight: '600',
  },
  orContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: height * 0.02,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#E0E0E0',
  },
  orText: {
    marginHorizontal: width * 0.03,
    color: '#888',
    fontSize: width * 0.035,
  },
  errorText: {
    color: '#D32F2F',
    textAlign: 'center',
    marginBottom: height * 0.015,
    fontSize: width * 0.035,
  },
  input: {
    backgroundColor: '#F7F7F7',
    borderRadius: width * 0.03,
    padding: height * 0.018,
    fontSize: width * 0.04,
    color: '#333',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    marginBottom: height * 0.02,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7F7F7',
    borderRadius: width * 0.03,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    marginBottom: height * 0.015,
  },
  passwordInput: {
    flex: 1,
    padding: height * 0.018,
    fontSize: width * 0.04,
    color: '#333',
  },
  passwordToggle: {
    padding: width * 0.03,
  },
  rememberMeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: height * 0.025,
  },
  rememberMeBox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: width * 0.05,
    height: width * 0.05,
    borderRadius: width * 0.015,
    borderWidth: 2,
    borderColor: '#FF6F00',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: width * 0.02,
  },
  checkboxChecked: {
    backgroundColor: '#FF6F00',
  },
  checkboxTick: {
    color: '#FFFFFF',
    fontSize: width * 0.03,
  },
  rememberMeText: {
    color: '#555',
    fontSize: width * 0.038,
  },
  loginButton: {
    backgroundColor: '#FF6F00',
    borderRadius: width * 0.03,
    paddingVertical: height * 0.018,
    alignItems: 'center',
    marginBottom: height * 0.025,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: width * 0.045,
    fontWeight: 'bold',
  },
  signUpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signUpText: {
    color: '#555',
    fontSize: width * 0.038,
  },
  signUpLink: {
    color: '#FF6F00',
    fontWeight: 'bold',
    fontSize: width * 0.038,
  },
  footerText: {
    fontSize: width * 0.03,
    color: '#888',
    textAlign: 'center',
  },
});

export default LoginScreen;