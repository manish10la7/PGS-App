import { Feather, FontAwesome, FontAwesome5, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useContext, useEffect, useState } from 'react';
import { Alert, Animated, Dimensions, Image, Modal, Platform, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { Calendar } from 'react-native-calendars';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { WebView } from 'react-native-webview';
import { UserContext } from '../../utils/UserContext';
import { getUserProfile } from '../utils/firestore';

const { width, height } = Dimensions.get('window');
const scale = (size) => Math.round((Math.min(width, height) / 375) * size);


const getToday = () => {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const PRIMARY = '#ff6600';
const WHITE = '#F5F5F5';
const DEEPBLUE = '#1c107a';
const SIDEBAR_BG = '#f7f8fa';
const SIDEBAR_GRADIENT = ['#ffb347', '#e0e7ff']; // orange to light blue

const HomeMenuScreen = ({
  onLogout,
  onTasksPress,
  onBookMeetingPress,
  onProfilePress,
  onClassesPress,
  onClubsPress,
  onSettingsPress,
  onAboutPress,
  onRemindersPress,
  onStudentExperiencePress,
  onHoroscopePress,
  onJobOffersPress,
}) => {
  const { user, setUser } = useContext(UserContext);
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  // Set initial date to today's date
  const todayString = getToday();
  const [selected, setSelected] = useState(todayString);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarAnim] = useState(new Animated.Value(-width * 0.7));
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notificationAnim] = useState(new Animated.Value(-width));
  const [webViewVisible, setWebViewVisible] = useState(false);
  const [webViewUrl, setWebViewUrl] = useState('');
  const [isReminderModalVisible, setReminderModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [reminderTitle, setReminderTitle] = useState('');
  const [reminderDescription, setReminderDescription] = useState('');
  const [isTimePickerVisible, setTimePickerVisible] = useState(false);
  const [reminderTime, setReminderTime] = useState(null);
  const [isComingSoonModalVisible, setComingSoonModalVisible] = useState(false);


    useEffect(() => {
        const fetchProfile = async () => {
            if (user && user.uid) {
                setIsLoading(true);
                // Fetch user profile from Firestore.
                const data = await getUserProfile(user.uid, user.email);
                if (data) {
                    // Set the fetched data to the profile state.
                    setProfile(data);
                    // Update the user context with the new data.
                    setUser(prev => ({ ...prev, ...data }));
                }
                setIsLoading(false);
            }
        };
        fetchProfile();
    }, [user.uid]); // The effect depends on user.uid.

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const dueReminders = user.reminders.filter(
        (r) => new Date(r.datetime) <= now && !r.notified
      );

      if (dueReminders.length > 0) {
        const newNotifications = dueReminders.map((r) => ({
          id: `notif-${r.id}`,
          title: r.title,
          message: `Your reminder for "${r.title}" is due.`,
          time: new Date().toISOString(),
          read: false,
        }));

        setUser((currentUser) => ({
          ...currentUser,
          notifications: [...newNotifications, ...currentUser.notifications],
          reminders: currentUser.reminders.map((r) =>
            dueReminders.find((due) => due.id === r.id)
              ? { ...r, notified: true }
              : r
          ),
        }));
      }
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [user.reminders, setUser]);

  const handleDayPress = (day) => {
    setSelectedDate(day.dateString);
    setReminderModalVisible(true);
  };

  const handleSaveReminder = () => {
    if (!reminderTitle || !reminderTime) {
      Alert.alert('Missing Information', 'Please provide a title and a time for the reminder.');
      return;
    }

    const [year, month, day] = selectedDate.split('-').map(Number);
    const finalDate = new Date(reminderTime);
    finalDate.setFullYear(year, month - 1, day);

    const newReminder = {
      id: Date.now().toString(),
      datetime: finalDate.toISOString(),
      title: reminderTitle,
      description: reminderDescription,
      notified: false,
    };

    setUser(currentUser => ({
      ...currentUser,
      reminders: [...currentUser.reminders, newReminder],
    }));

    setReminderModalVisible(false);
    setReminderTitle('');
    setReminderDescription('');
    setReminderTime(null);
  };

  const showTimePicker = () => {
    setTimePickerVisible(true);
  };

  const hideTimePicker = () => {
    setTimePickerVisible(false);
  };

  const handleConfirmTime = (time) => {
    setReminderTime(time);
    hideTimePicker();
  };

  const openWebView = (url) => {
    setWebViewUrl(url);
    setWebViewVisible(true);
  };

  const closeWebView = () => {
    setWebViewVisible(false);
    setWebViewUrl('');
  };

  const handleLogout = () => {
    Alert.alert(
      'Confirm Logout',
      'Do you want to log out?',
      [
        {
          text: 'No',
          style: 'cancel',
        },
        { text: 'Yes', onPress: onLogout },
      ],
      { cancelable: true }
    );
  };

  const openSidebar = () => {
    if (notificationsOpen) {
      closeNotifications();
    }
    setSidebarOpen(true);
    Animated.timing(sidebarAnim, {
      toValue: 0,
      duration: 250,
      useNativeDriver: false,
    }).start();
  };

  const closeSidebar = () => {
    Animated.timing(sidebarAnim, {
      toValue: -width * 0.7,
      duration: 200,
      useNativeDriver: false,
    }).start(() => setSidebarOpen(false));
  };

  const openNotifications = () => {
    if (sidebarOpen) {
      closeSidebar();
    }
    setNotificationsOpen(true);
    Animated.timing(notificationAnim, {
      toValue: scale(10),
      duration: 300,
      useNativeDriver: false,
    }).start();

    // Mark all as read when opening
    setUser(currentUser => ({
        ...currentUser,
        notifications: currentUser.notifications.map(n => ({ ...n, read: true })),
    }));
  };

  const closeNotifications = () => {
    Animated.timing(notificationAnim, {
      toValue: -width,
      duration: 250,
      useNativeDriver: false,
    }).start(() => setNotificationsOpen(false));
  };

  const unreadCount = user.notifications.filter(n => !n.read).length;

  // Helper for sidebar icons
  const sidebarIcons = {
    Profile: <MaterialIcons name="person" size={scale(22)} color={WHITE} />,
    Classes: <Ionicons name="school" size={scale(22)} color={WHITE} />,
    Clubs: <FontAwesome5 name="users" size={scale(20)} color={WHITE} />,
    Reminders: <Ionicons name="alarm" size={scale(22)} color={WHITE} />,
    'Student Experience': <Feather name="star" size={scale(22)} color={WHITE} />,
    'Job Offers': <MaterialIcons name="work" size={scale(22)} color={WHITE} />,
    Horoscope: <MaterialIcons name="auto-awesome" size={scale(22)} color={WHITE} />,
    Settings: <Ionicons name="settings" size={scale(22)} color={WHITE} />,
    About: <Ionicons name="information-circle" size={scale(22)} color={WHITE} />,
    Logout: <MaterialIcons name="logout" size={scale(22)} color={PRIMARY} />,
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={[styles.container, { minHeight: height }]}> 
        {/* Overlay */}
        {(sidebarOpen || notificationsOpen) && (
          <TouchableWithoutFeedback onPress={sidebarOpen ? closeSidebar : closeNotifications}>
            <View style={styles.sidebarOverlay} />
          </TouchableWithoutFeedback>
        )}
        {/* Sidebar Drawer */}
        <Animated.View style={[styles.sidebar, { left: sidebarAnim }]}> 
          <LinearGradient colors={SIDEBAR_GRADIENT} style={styles.sidebarGradient}>
            {/* Profile Section */}
            <View style={styles.sidebarProfileSection}>
              <Image source={user.profileImage} style={styles.sidebarProfilePic} />
              <Text style={styles.sidebarProfileName}>{profile?.name || user.name}</Text>
              <Text style={styles.sidebarProfileGapId}>GAP ID: {profile?.gapID || user.gapID}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <View style={styles.sidebarHeader}>
                <Text style={styles.sidebarTitle}>Menu</Text>
                <TouchableOpacity onPress={closeSidebar}>
                  <Text style={styles.sidebarClose}>✕</Text>
                </TouchableOpacity>
              </View>
              <ScrollView showsVerticalScrollIndicator={false}>
                <TouchableOpacity style={styles.sidebarItem} onPress={onProfilePress}>
                  {sidebarIcons.Profile}
                  <Text style={styles.sidebarItemText}>Profile</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.sidebarItem} onPress={onClassesPress}>
                  {sidebarIcons.Classes}
                  <Text style={styles.sidebarItemText}>Classes</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.sidebarItem} onPress={onClubsPress}>
                  {sidebarIcons.Clubs}
                  <Text style={styles.sidebarItemText}>Clubs</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.sidebarItem} onPress={onRemindersPress}>
                  {sidebarIcons.Reminders}
                  <Text style={styles.sidebarItemText}>Reminders</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.sidebarItem} onPress={onStudentExperiencePress}>
                  {sidebarIcons['Student Experience']}
                  <Text style={styles.sidebarItemText}>Student Experience</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.sidebarItem} onPress={onJobOffersPress}>
                  {sidebarIcons['Job Offers']}
                  <Text style={styles.sidebarItemText}>Job Offers</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.sidebarItem} onPress={onHoroscopePress}>
                  {sidebarIcons.Horoscope}
                  <Text style={styles.sidebarItemText}>Horoscope</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.sidebarItem} onPress={onSettingsPress}>
                  {sidebarIcons.Settings}
                  <Text style={styles.sidebarItemText}>Settings</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.sidebarItem} onPress={onAboutPress}>
                  {sidebarIcons.About}
                  <Text style={styles.sidebarItemText}>About</Text>
                </TouchableOpacity>
              </ScrollView>
            </View>
            <TouchableOpacity style={styles.sidebarLogoutButton} onPress={handleLogout}>
              {sidebarIcons.Logout}
              <Text style={styles.sidebarLogoutText}>Logout</Text>
            </TouchableOpacity>
          </LinearGradient>
        </Animated.View>

        {/* Notifications Panel */}
        <Animated.View style={[styles.notificationPanel, { right: notificationAnim }]}>
          <View style={styles.notificationHeader}>
            <Text style={styles.notificationTitle}>Recent Notifications</Text>
            <TouchableOpacity onPress={closeNotifications}>
              <Text style={styles.sidebarClose}>✕</Text>
            </TouchableOpacity>
          </View>
          <ScrollView>
            {user.notifications.length > 0 ? (
              user.notifications.map((notification) => (
                <View key={notification.id} style={styles.notificationItem}>
                  <Text style={styles.notificationTitleText}>{notification.title}</Text>
                  <Text style={styles.notificationText}>{notification.message}</Text>
                  <Text style={styles.notificationTime}>
                    {new Date(notification.time).toLocaleString()}
                  </Text>
                </View>
              ))
            ) : (
              <Text style={styles.notificationText}>No new notifications.</Text>
            )}
          </ScrollView>
        </Animated.View>

        <Modal
          visible={isReminderModalVisible}
          onRequestClose={() => setReminderModalVisible(false)}
          transparent={true}
          animationType="slide"
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Set a Reminder</Text>
              <TextInput
                style={styles.input}
                placeholder="Reminder Title"
                value={reminderTitle}
                onChangeText={setReminderTitle}
              />
              <TextInput
                style={[styles.input, { height: 100 }]}
                placeholder="Description (optional)"
                value={reminderDescription}
                onChangeText={setReminderDescription}
                multiline
              />
              <TouchableOpacity style={styles.timeButton} onPress={showTimePicker}>
                <Text style={styles.timeButtonText}>{reminderTime ? reminderTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Select Time'}</Text>
              </TouchableOpacity>
              <DateTimePickerModal
                isVisible={isTimePickerVisible}
                mode="time"
                onConfirm={handleConfirmTime}
                onCancel={hideTimePicker}
              />
              <View style={styles.modalButtonContainer}>
                <TouchableOpacity style={[styles.modalButton, styles.saveButton]} onPress={handleSaveReminder}>
                  <Text style={styles.modalButtonText}>Save</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.modalButton, styles.cancelButton]} onPress={() => setReminderModalVisible(false)}>
                  <Text style={styles.modalButtonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* Coming Soon Modal */}
        <Modal
          visible={isComingSoonModalVisible}
          onRequestClose={() => setComingSoonModalVisible(false)}
          transparent={true}
          animationType="fade"
        >
          <View style={styles.modalContainer}>
            <View style={styles.comingSoonModalContent}>
              <Text style={styles.comingSoonModalTitle}>Coming Soon!</Text>
              <Text style={styles.comingSoonModalText}>
                Our AI-powered features are under construction. Get ready for something amazing!
              </Text>
              <TouchableOpacity
                style={styles.comingSoonOkButton}
                onPress={() => setComingSoonModalVisible(false)}
              >
                <Text style={styles.comingSoonOkButtonText}>OK</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <Modal
          visible={webViewVisible}
          onRequestClose={closeWebView}
          animationType="slide"
        >
          <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.webViewHeader}>
              <TouchableOpacity onPress={closeWebView}>
                <Text style={styles.webViewCloseButton}>✕</Text>
              </TouchableOpacity>
            </View>
            <WebView source={{ uri: webViewUrl }} style={{ flex: 1 }} />
          </SafeAreaView>
        </Modal>

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={openSidebar} style={styles.hamburgerButton}>
            <Text style={styles.headerIcon}>☰</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={openNotifications} style={styles.hamburgerButton}>
            <Image source={require('../assets/notif.png')} style={[styles.navIconImg, { marginBottom: 0 }]} accessibilityLabel="Notifications" />
            {unreadCount > 0 && (
              <View style={styles.notificationBadge}>
                <Text style={styles.notificationBadgeText}>{unreadCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
        <ScrollView style={styles.mainContent} contentContainerStyle={{ paddingBottom: scale(100), minHeight: height - Math.max(scale(70), 60) }}>
          {/* Welcome */}
          <View style={styles.welcomeMessage}>
            <Image source={user.profileImage} style={styles.profilePic} />
            <View style={styles.welcomeTextContainer}>
              <Text style={styles.welcomeText}>Welcome,</Text>
              <Text style={styles.welcomeText}>{profile?.name || user.name }</Text>
            </View>
          </View>
          {/* Calendar */}
          <View style={styles.calendarWrapper}>
            <Calendar
              current={todayString}
              onDayPress={handleDayPress}
              markedDates={{
                [selected]: {selected: true, selectedColor: PRIMARY, selectedTextColor: WHITE},
                [todayString]: {selected: selected !== todayString, selectedColor: '#ff0000', selectedTextColor: WHITE, today: true},
              }}
              style={[styles.calendar, { width: width * 0.97, minHeight: width * 0.75 }]}
              theme={{
                backgroundColor: WHITE,
                calendarBackground: WHITE,
                textSectionTitleColor: DEEPBLUE,
                selectedDayBackgroundColor: PRIMARY,
                selectedDayTextColor: WHITE,
                todayTextColor: WHITE,
                todayBackgroundColor: '#ff0000',
                dayTextColor: DEEPBLUE,
                textDisabledColor: '#ccc',
                arrowColor: PRIMARY,
                monthTextColor: DEEPBLUE,
                indicatorColor: PRIMARY,
                textDayFontWeight: '500',
                textMonthFontWeight: '700',
                textDayHeaderFontWeight: '600',
                textDayFontSize: scale(15),
                textMonthFontSize: scale(16),
                textDayHeaderFontSize: scale(13),
              }}
            />
          </View>
          {/* Ongoing Events */}
          <View style={styles.eventsSection}>
            <Text style={styles.eventsHeader}>Ongoing Events</Text>
            <View style={[styles.eventCard, { minHeight: scale(60) }]}>
              <View style={styles.eventAccent} />
              <View style={styles.eventContent}>
                <Text style={styles.eventTitle}>Research Seminar</Text>
                <Text style={styles.eventTime}>10:00 AM - 11:00 AM</Text>
              </View>
            </View>
            <View style={[styles.eventCard, { minHeight: scale(60) }]}>
              <View style={styles.eventAccent} />
              <View style={styles.eventContent}>
                <Text style={styles.eventTitle}>Faculty Meeting</Text>
                <Text style={styles.eventTime}>11:30 AM - 12:30 PM</Text>
              </View>
            </View>
          </View>
          {/* Upcoming Events */}
          <View style={styles.eventsSection}>
            <Text style={styles.eventsHeader}>Upcoming Events</Text>
            <View style={[styles.eventCard, { minHeight: scale(60) }]}>
              <View style={styles.eventAccent} />
              <View style={styles.eventContent}>
                <Text style={styles.eventTitle}>Graduate Student Conference</Text>
                <Text style={styles.eventTime}>October 25, 2024</Text>
              </View>
            </View>
            <View style={[styles.eventCard, { minHeight: scale(60) }]}>
              <View style={styles.eventAccent} />
              <View style={styles.eventContent}>
                <Text style={styles.eventTitle}>Alumni Networking Event</Text>
                <Text style={styles.eventTime}>November 10, 2024</Text>
              </View>
            </View>
          </View>
        </ScrollView>
        <View style={[styles.bottomNav, { height: Math.max(scale(70), 60) }]}>
          <TouchableOpacity style={[styles.navItem, styles.activeNavItem]}>
            <Image source={require('../assets/home.png')} style={styles.navIconImg} />
            <Text style={[styles.navText, styles.activeNavText]}>Home</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem} onPress={onTasksPress}>
            <Image source={require('../assets/plus.png')} style={styles.navIconImg} />
            <Text style={styles.navText}>Task</Text>
          </TouchableOpacity>
          <View style={styles.navItem} />
          <TouchableOpacity style={styles.navItem} onPress={() => openWebView('https://gap.westcliff.edu/')}>
            <Image source={require('../assets/westcliff_logo.png')} style={styles.navIconImg} />
            <Text style={styles.navText}>GAP</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem} onPress={onBookMeetingPress}>
            <Image source={require('../assets/bell.png')} style={styles.navIconImg} />
            <Text style={styles.navText}>Book Meeting</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.qrButton}>
          <FontAwesome name="qrcode" size={scale(30)} color={DEEPBLUE} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.aiButton} onPress={() => setComingSoonModalVisible(true)}>
          <LinearGradient
            colors={SIDEBAR_GRADIENT}
            style={styles.aiButtonGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <FontAwesome5 name="brain" size={scale(28)} color={DEEPBLUE} />
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: PRIMARY,
    paddingTop: Platform.OS === 'android' ? scale(32) : 0, // Add top padding for Android status bar
  },
  container: {
    flex: 1,
    backgroundColor: WHITE,
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: '100%',
  },
  header: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: scale(20),
    backgroundColor: PRIMARY,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: scale(2) },
    shadowOpacity: 0.08,
    shadowRadius: scale(6),
    elevation: 4,
    height: scale(56),
  },
  headerTitle: {
    fontSize: scale(22),
    fontWeight: '800',
    color: WHITE,
    letterSpacing: scale(1),
  },
  headerIcon: {
    fontSize: scale(24),
    color: WHITE,
  },
  headerLogo: {
    width: scale(44),
    height: scale(44),
    marginRight: scale(8),
  },
  mainContent: {
    flex: 1,
    width: '100%',
    paddingHorizontal: scale(10),
  },
  welcomeMessage: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: scale(20),
    paddingHorizontal: scale(4),
  },
  profilePic: {
    width: scale(54),
    height: scale(54),
    borderRadius: scale(27),
    marginRight: scale(14),
    backgroundColor: '#eee',
  },
  welcomeTextContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  welcomeText: {
    fontSize: scale(24),
    fontWeight: '700',
    color: DEEPBLUE,
    lineHeight: scale(30),
    textAlign: 'left',
  },
  welcomeSubText: {
    fontSize: scale(14),
    color: '#888',
    marginTop: scale(4),
    textAlign: 'center',
  },
  calendarWrapper: {
    backgroundColor: WHITE,
    borderRadius: scale(16),
    marginBottom: scale(18),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: scale(2) },
    shadowOpacity: 0.07,
    shadowRadius: scale(8),
    elevation: 2,
    alignSelf: 'center',
  },
  calendar: {
    width: width * 0.97,
    minHeight: width * 0.75,
    borderRadius: scale(16),
    alignSelf: 'center',
    backgroundColor: WHITE,
  },
  eventsSection: {
    marginBottom: scale(15),
  },
  eventsHeader: {
    fontSize: scale(16),
    fontWeight: '700',
    marginBottom: scale(8),
    color: PRIMARY,
    letterSpacing: scale(0.5),
  },
  eventCard: {
    backgroundColor: WHITE,
    borderRadius: scale(10),
    padding: 0,
    marginBottom: scale(10),
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: scale(2) },
    shadowOpacity: 0.05,
    shadowRadius: scale(4),
    elevation: 1,
  },
  eventAccent: {
    width: scale(6),
    height: '100%',
    backgroundColor: PRIMARY,
    borderTopLeftRadius: scale(10),
    borderBottomLeftRadius: scale(10),
  },
  eventContent: {
    flex: 1,
    padding: scale(12),
  },
  eventTitle: {
    fontWeight: '700',
    color: DEEPBLUE,
    marginBottom: scale(2),
    fontSize: scale(15),
  },
  eventTime: {
    fontSize: scale(12),
    color: '#666',
  },
  qrButton: {
    position: 'absolute',
    bottom: scale(35),
    left: '50%',
    marginLeft: -scale(30),
    width: scale(60),
    height: scale(60),
    borderRadius: scale(30),
    backgroundColor: WHITE,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    borderWidth: 2,
    borderColor: PRIMARY,
  },
  aiButton: {
    position: 'absolute',
    bottom: scale(95),
    right: scale(20),
    width: scale(60),
    height: scale(60),
    borderRadius: scale(30),
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    borderWidth: 2,
    borderColor: DEEPBLUE,
  },
  aiButtonGradient: {
    width: '100%',
    height: '100%',
    borderRadius: scale(30),
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: WHITE,
    borderTopWidth: scale(1),
    borderTopColor: '#eee',
    height: Math.max(scale(70), 60),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: scale(-2) },
    shadowOpacity: 0.05,
    shadowRadius: scale(4),
    elevation: 5,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    paddingVertical: scale(8),
  },
  navIcon: {
    fontSize: scale(24),
    marginBottom: scale(2),
    color: DEEPBLUE,
  },
  navText: {
    fontSize: scale(12),
    fontWeight: '500',
    color: DEEPBLUE,
  },
  navIconImg: {
    width: scale(24),
    height: scale(24),
    marginBottom: scale(2),
    resizeMode: 'contain',
  },
  activeNavItem: {},
  activeNavIcon: {
    color: PRIMARY,
    fontWeight: 'bold',
  },
  activeNavText: {
    color: PRIMARY,
    fontWeight: 'bold',
  },
  hamburgerButton: {
    padding: scale(6),
  },
  sidebarOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: width,
    height: height,
    backgroundColor: 'rgba(0,0,0,0.3)',
    zIndex: 10,
  },
  sidebar: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: width * 0.7,
    height: height,
    backgroundColor: 'transparent',
    zIndex: 20,
    paddingTop: Platform.OS === 'ios' ? scale(48) : scale(28),
    paddingHorizontal: 0,
    shadowColor: '#000',
    shadowOffset: { width: scale(2), height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: scale(8),
    elevation: 8,
    justifyContent: 'flex-start',
    paddingBottom: 0,
    borderTopRightRadius: scale(30),
    borderBottomRightRadius: scale(30),
  },
  sidebarGradient: {
    flex: 1,
    borderTopRightRadius: scale(30),
    borderBottomRightRadius: scale(30),
    paddingHorizontal: scale(18),
    paddingBottom: scale(40),
    paddingTop: Platform.OS === 'ios' ? scale(48) : scale(28),
  },
  sidebarProfileSection: {
    alignItems: 'center',
    marginBottom: scale(18),
    marginTop: scale(8),
  },
  sidebarProfilePic: {
    width: scale(64),
    height: scale(64),
    borderRadius: scale(32),
    backgroundColor: '#eee',
    marginBottom: scale(8),
    borderWidth: 2,
    borderColor: WHITE,
  },
  sidebarProfileName: {
    color: WHITE,
    fontWeight: '700',
    fontSize: scale(18),
  },
  sidebarProfileGapId: {
    color: WHITE,
    fontSize: scale(14),
    marginTop: 4,
  },
  sidebarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: scale(10),
  },
  sidebarTitle: {
    fontSize: scale(20),
    fontWeight: 'bold',
    color: DEEPBLUE,
  },
  sidebarClose: {
    fontSize: scale(22),
    color: '#888',
    padding: scale(4),
  },
  sidebarItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: scale(14),
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(255,255,255,0.15)',
    paddingLeft: scale(4),
    borderRadius: scale(10),
    marginBottom: scale(2),
  },
  sidebarItemText: {
    fontSize: scale(16),
    color: DEEPBLUE,
    marginLeft: scale(16),
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  sidebarLogoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: WHITE,
    borderRadius: scale(12),
    paddingVertical: scale(12),
    justifyContent: 'center',
    marginTop: scale(18),
    marginBottom: scale(8),
  },
  sidebarLogoutText: {
    color: PRIMARY,
    fontWeight: 'bold',
    fontSize: scale(16),
    marginLeft: scale(10),
  },
  notificationPanel: {
    position: 'absolute',
    top: scale(70),
    width: width * 0.85,
    maxHeight: height * 0.5,
    backgroundColor: '#fff',
    zIndex: 20,
    paddingTop: scale(10),
    paddingHorizontal: scale(18),
    shadowColor: '#000',
    shadowOffset: { width: scale(-2), height: scale(2) },
    shadowOpacity: 0.15,
    shadowRadius: scale(8),
    elevation: 9,
    borderRadius: scale(12),
  },
  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: scale(10),
    paddingBottom: scale(10),
    borderBottomWidth: scale(1),
    borderBottomColor: '#eee',
  },
  notificationTitle: {
    fontSize: scale(18),
    fontWeight: 'bold',
    color: DEEPBLUE,
  },
  notificationItem: {
    paddingVertical: scale(14),
    borderBottomWidth: scale(1),
    borderBottomColor: '#f0f0f0',
  },
  notificationTitleText: {
    fontSize: scale(16),
    fontWeight: 'bold',
    color: DEEPBLUE,
    marginBottom: scale(4),
  },
  notificationText: {
    fontSize: scale(14),
    color: DEEPBLUE,
    marginBottom: scale(4),
  },
  notificationTime: {
    fontSize: scale(11),
    color: '#777',
    textAlign: 'right',
  },
  notificationBadge: {
    position: 'absolute',
    right: -scale(2),
    top: -scale(2),
    backgroundColor: 'red',
    borderRadius: scale(10),
    width: scale(20),
    height: scale(20),
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationBadgeText: {
    color: 'white',
    fontSize: scale(12),
    fontWeight: 'bold',
  },
  webViewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: scale(10),
    backgroundColor: '#f0f0f0',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  webViewCloseButton: {
    fontSize: scale(20),
    color: '#333',
    marginRight: scale(15),
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
  timeButton: {
    width: '100%',
    padding: 15,
    backgroundColor: PRIMARY,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 20,
  },
  timeButtonText: {
    color: WHITE,
    fontWeight: 'bold',
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    padding: 10,
    borderRadius: 5,
    width: '48%',
    alignItems: 'center',
  },
  saveButton: {
    backgroundColor: DEEPBLUE,
  },
  cancelButton: {
    backgroundColor: '#aaa',
  },
  comingSoonModalContent: {
    backgroundColor: WHITE,
    padding: scale(25),
    borderRadius: 20,
    width: '85%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
        width: 0,
        height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#eee',
  },
  comingSoonModalTitle: {
    fontSize: scale(22),
    fontWeight: 'bold',
    color: DEEPBLUE,
    marginBottom: scale(15),
  },
  comingSoonModalText: {
    fontSize: scale(16),
    color: '#444',
    textAlign: 'center',
    marginBottom: scale(25),
    lineHeight: scale(24),
  },
  comingSoonOkButton: {
    backgroundColor: PRIMARY,
    borderRadius: 25,
    paddingVertical: scale(12),
    paddingHorizontal: scale(35),
    elevation: 2,
  },
  comingSoonOkButtonText: {
    color: WHITE,
    fontWeight: 'bold',
    fontSize: scale(16),
  },
});

export default HomeMenuScreen;