import { LinearGradient } from 'expo-linear-gradient';
import { useContext, useState } from 'react';
import { Alert, FlatList, Modal, Platform, SafeAreaView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { UserContext } from '../../../utils/UserContext';

const PRIMARY = '#ff6600';
const WHITE = '#F5F5F5';
const DEEPBLUE = '#1c107a';

const RemindersScreen = ({ onGoBack }) => {
  const { user, setUser } = useContext(UserContext);
  const [isEditModalVisible, setEditModalVisible] = useState(false);
  const [editingReminder, setEditingReminder] = useState(null);
  const [reminderTitle, setReminderTitle] = useState('');
  const [reminderDescription, setReminderDescription] = useState('');
  const [isTimePickerVisible, setTimePickerVisible] = useState(false);
  const [reminderTime, setReminderTime] = useState(null);

  const now = new Date();

  const upcomingReminders = user.reminders
    .filter(r => new Date(r.datetime) >= now)
    .sort((a, b) => new Date(a.datetime) - new Date(b.datetime));

  const pastReminders = user.reminders
    .filter(r => new Date(r.datetime) < now)
    .sort((a, b) => new Date(b.datetime) - new Date(a.datetime));

  const handleEdit = (reminder) => {
    setEditingReminder(reminder);
    setReminderTitle(reminder.title);
    setReminderDescription(reminder.description || '');
    setReminderTime(new Date(reminder.datetime));
    setEditModalVisible(true);
  };

  const handleDelete = (id) => {
    Alert.alert(
      'Delete Reminder',
      'Are you sure you want to delete this reminder?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setUser((currentUser) => ({
              ...currentUser,
              reminders: currentUser.reminders.filter((r) => r.id !== id),
            }));
          },
        },
      ]
    );
  };

  const handleUpdateReminder = () => {
    if (!reminderTitle || !reminderTime) {
      Alert.alert('Missing Information', 'Please provide a title and a time.');
      return;
    }

    const updatedReminder = {
      ...editingReminder,
      title: reminderTitle,
      description: reminderDescription,
      datetime: reminderTime.toISOString(),
    };

    setUser((currentUser) => ({
      ...currentUser,
      reminders: currentUser.reminders.map((r) =>
        r.id === editingReminder.id ? updatedReminder : r
      ),
    }));

    setEditModalVisible(false);
    setEditingReminder(null);
  };

  const showTimePicker = () => setTimePickerVisible(true);
  const hideTimePicker = () => setTimePickerVisible(false);
  const handleConfirmTime = (time) => {
    setReminderTime(time);
    hideTimePicker();
  };

  const renderItem = ({ item, index }) => {
    const isPast = new Date(item.datetime) < now;
    const date = new Date(item.datetime);
    const dateString = date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    const timeString = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    return (
      <View style={styles.timelineItem}>
        <View style={styles.timelineIconContainer}>
          <View style={[styles.timelineIcon, isPast && styles.pastTimelineIcon]} />
        </View>
        <View style={[styles.reminderCard, isPast && styles.pastReminderCard]}>
          <Text style={[styles.reminderTitle, isPast && styles.pastText]}>{item.title}</Text>
          <Text style={[styles.reminderDate, isPast && styles.pastText]}>{dateString} at {timeString}</Text>
          {item.description ? <Text style={[styles.reminderDescription, isPast && styles.pastText]}>{item.description}</Text> : null}
          {!isPast && (
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.editButton} onPress={() => handleEdit(item)}>
                <Text style={styles.buttonText}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(item.id)}>
                <Text style={styles.buttonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    );
  };

  return (
    <LinearGradient colors={['#fdf6e3', '#e0e7ff']} style={{ flex: 1 }}>
      <SafeAreaView style={styles.safeArea}>
        {/* Add space for Android status bar */}
        {Platform.OS === 'android' && <View style={{ height: StatusBar.currentHeight || 32 }} />}
        <View style={styles.headerContainer}>
          <TouchableOpacity onPress={onGoBack} style={styles.backButton}>
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.header}>Your Reminders</Text>
        </View>
        <FlatList
          data={[...upcomingReminders, ...pastReminders]}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={<Text style={styles.emptyText}>You have no reminders.</Text>}
          contentContainerStyle={styles.listContainer}
          ListHeaderComponent={() => (
            <>
              {upcomingReminders.length > 0 && <Text style={styles.sectionHeader}>Upcoming</Text>}
              {upcomingReminders.length === 0 && pastReminders.length > 0 && <Text style={styles.sectionHeader}>Past</Text>}
            </>
          )}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
        <Modal
          visible={isEditModalVisible}
          onRequestClose={() => setEditModalVisible(false)}
          transparent={true}
          animationType="slide"
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Edit Reminder</Text>
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
                <Text style={styles.timeButtonText}>
                  {reminderTime ? reminderTime.toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Select Time'}
                </Text>
              </TouchableOpacity>
              <DateTimePickerModal
                isVisible={isTimePickerVisible}
                mode="datetime"
                onConfirm={handleConfirmTime}
                onCancel={hideTimePicker}
                date={reminderTime || new Date()}
              />
              <View style={styles.modalButtonContainer}>
                <TouchableOpacity style={[styles.modalButton, styles.saveButton]} onPress={handleUpdateReminder}>
                  <Text style={styles.modalButtonText}>Save</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.modalButton, styles.cancelButton]} onPress={() => setEditModalVisible(false)}>
                  <Text style={styles.modalButtonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  container: {
    flex: 1,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    paddingHorizontal: 60, // To ensure title is centered with absolute back button
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    left: 20,
    top: 20,
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  backButtonText: {
    fontSize: 18,
    color: '#eab308',
    fontWeight: 'bold',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#eab308',
    letterSpacing: 1,
    textAlign: 'center',
  },
  listContainer: {
    paddingHorizontal: 20,
  },
  sectionHeader: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#a16207',
    marginBottom: 15,
    marginTop: 10,
  },
  timelineItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  timelineIconContainer: {
    alignItems: 'center',
    marginRight: 15,
    paddingTop: 5,
  },
  timelineIcon: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#eab308',
  },
  pastTimelineIcon: {
    backgroundColor: '#c7c7c7',
  },
  reminderCard: {
    backgroundColor: '#fffbe6',
    borderRadius: 12,
    padding: 18,
    flex: 1,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  pastReminderCard: {
    backgroundColor: '#f5f5f5',
  },
  reminderTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#a16207',
  },
  pastText: {
    color: '#888',
  },
  reminderDate: {
    fontSize: 14,
    color: '#b98900',
    marginTop: 5,
  },
  reminderDescription: {
    fontSize: 16,
    color: '#a16207',
    marginTop: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#fde68a',
    paddingTop: 10,
  },
  editButton: {
    backgroundColor: '#eab308',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginRight: 10,
  },
  deleteButton: {
    backgroundColor: '#d9534f',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  buttonText: {
    color: WHITE,
    fontWeight: 'bold',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: '#a16207',
  },
  separator: {
    height: 0, // Remove separator, margin is on timelineItem
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '85%',
    backgroundColor: '#fffbe6',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#a16207',
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#fde68a',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
    color: '#a16207',
  },
  timeButton: {
    width: '100%',
    padding: 15,
    backgroundColor: '#eab308',
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  timeButtonText: {
    color: WHITE,
    fontWeight: 'bold',
    fontSize: 16,
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    paddingVertical: 12,
    borderRadius: 8,
    width: '48%',
    alignItems: 'center',
  },
  saveButton: {
    backgroundColor: '#a16207',
  },
  cancelButton: {
    backgroundColor: '#c7c7c7',
  },
  modalButtonText: {
    color: WHITE,
    fontWeight: 'bold',
  },
});

export default RemindersScreen;
