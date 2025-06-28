// App.js
import { StatusBar } from 'expo-status-bar';
import { useContext, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeContext, ThemeProvider } from './utils/ThemeContext';
import { UserContext, UserProvider } from './utils/UserContext';

// Import all necessary screen components
import BookMeetingScreen from './src/components/BookMeetingScreen';
import HomeMenuScreen from './src/components/HomeMenuScreen'; // The React Native version
import HomeScreen from './src/components/HomeScreen';
import LoginScreen from './src/components/LoginScreen';
import AboutScreen from './src/components/sidebar/AboutScreen';
import ClassesScreen from './src/components/sidebar/ClassesScreen';
import ClubsScreen from './src/components/sidebar/ClubsScreen';
import HoroscopeScreen from './src/components/sidebar/HoroscopeScreen';
import JobOffersScreen from './src/components/sidebar/JobOffersScreen';
import ProfileScreen from './src/components/sidebar/ProfileScreen';
import RemindersScreen from './src/components/sidebar/RemindersScreen';
import SettingsScreen from './src/components/sidebar/SettingsScreen';
import StudentExperienceScreen from './src/components/sidebar/StudentExperienceScreen';
import SignUpMessageScreen from './src/components/SignUpMessageScreen';
import SplashScreen from './src/components/SplashScreen';
import TasksScreen from './src/components/TasksScreen';

// --- Main App Component ---
const AppContent = () => {
  // State to manage which screen is currently visible
  const [currentScreen, setCurrentScreen] = useState('splash');
  const { theme, themeStyles } = useContext(ThemeContext);
  const { user, setUser } = useContext(UserContext);

  // Control the splash screen duration
  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentScreen('home'); // Transition to HomeScreen after splash
    }, 2400); // 2.4 seconds
    return () => clearTimeout(timer);
  }, []); // Empty dependency array ensures this effect runs only once

  const handleLoginSuccess = (loginData) => {
    const userPayload = {
      uid: loginData.localId,
      email: loginData.email,
      name: loginData.name || '',
      reminders: [],
      notifications: [],
      profileImage: require('./src/assets/profile.png'),
    };
    setUser(userPayload);
    navigateToHomeMenu();
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentScreen('home');
  };

  // --- Navigation Functions ---
  const navigateToLogin = () => setCurrentScreen('login');
  const navigateToSignUpMessage = () => setCurrentScreen('signupMessage');
  const navigateToHomeMenu = () => setCurrentScreen('homemenu');
  const navigateBackToHome = () => {
    setCurrentScreen('home');
  }
  const navigateToTasks = () => setCurrentScreen('tasks');
  const navigateToBookMeeting = () => setCurrentScreen('bookMeeting');
  const navigateToProfile = () => setCurrentScreen('profile');
  const navigateToClasses = () => setCurrentScreen('classes');
  const navigateToClubs = () => setCurrentScreen('clubs');
  const navigateToSettings = () => setCurrentScreen('settings');
  const navigateToAbout = () => setCurrentScreen('about');
  const navigateToReminders = () => setCurrentScreen('reminders');
  const navigateToStudentExperience = () => setCurrentScreen('studentExperience');
  const navigateToHoroscope = () => setCurrentScreen('horoscope');
  const navigateToJobOffers = () => setCurrentScreen('jobOffers');

  // Render the current screen based on the state
  const renderScreen = () => {
    switch (currentScreen) {
      case 'splash':
        return <SplashScreen />;
      case 'login':
        return <LoginScreen onGoBack={navigateBackToHome} onSignUpPress={navigateToSignUpMessage} onLoginSuccess={handleLoginSuccess} />;
      case 'signupMessage':
        return <SignUpMessageScreen onGoBack={navigateToLogin} />;
      case 'homemenu':
        return (
          <HomeMenuScreen
            onLogout={handleLogout}
            onTasksPress={navigateToTasks}
            onBookMeetingPress={navigateToBookMeeting}
            onProfilePress={navigateToProfile}
            onClassesPress={navigateToClasses}
            onClubsPress={navigateToClubs}
            onSettingsPress={navigateToSettings}
            onAboutPress={navigateToAbout}
            onRemindersPress={navigateToReminders}
            onStudentExperiencePress={navigateToStudentExperience}
            onHoroscopePress={navigateToHoroscope}
            onJobOffersPress={navigateToJobOffers}
          />
        );
      case 'tasks':
        return <TasksScreen onGoBack={navigateToHomeMenu} />;
      case 'bookMeeting':
        return <BookMeetingScreen onGoBack={navigateToHomeMenu} />;
      case 'profile':
        return <ProfileScreen onGoBack={navigateToHomeMenu} />;
      case 'classes':
        return <ClassesScreen onGoBack={navigateToHomeMenu} />;
      case 'clubs':
        return <ClubsScreen onGoBack={navigateToHomeMenu} />;
      case 'settings':
        return <SettingsScreen onGoBack={navigateToHomeMenu} />;
      case 'about':
        return <AboutScreen onGoBack={navigateToHomeMenu} />;
      case 'reminders':
        return <RemindersScreen onGoBack={navigateToHomeMenu} />;
      case 'studentExperience':
        return <StudentExperienceScreen onGoBack={navigateToHomeMenu} />;
      case 'horoscope':
        return <HoroscopeScreen onGoBack={navigateToHomeMenu} />;
      case 'jobOffers':
        return <JobOffersScreen onGoBack={navigateToHomeMenu} />;
      case 'home':
      default: // Fallback to the home screen if the state is unexpected
        return <HomeScreen onLoginPress={navigateToLogin} onSignUpPress={navigateToSignUpMessage} />;
    }
  };

  return (
    <View style={[styles.container, themeStyles.container]}>
      <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
      {renderScreen()}
    </View>
  );
};

// --- Main App Container ---
const App = () => (
  <SafeAreaProvider>
    <UserProvider>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </UserProvider>
  </SafeAreaProvider>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
