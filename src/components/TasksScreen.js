import { FontAwesome } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Dimensions,
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import DateTimePickerModal from "react-native-modal-datetime-picker";

const { width } = Dimensions.get('window');
const scale = (size) => (width / 375) * size;

// --- Color and Style Constants (from your CSS :root) ---
const COLORS = {
  primary: '#ff8800', // deep orange
  secondary: '#ffe5b4', // light orange
  accent: '#ff6584',
  light: '#f8f9fa',
  dark: '#343a40',
  success: '#28a745',
  warning: '#ffc107',
  danger: '#dc3545',
  white: '#FFFFFF',
  background: '#fff8f0', // very light orange
  border: '#ffe5b4',
  priority: {
    low: { bg: '#fffbe6', text: '#ff8800' }, // light orange bg, deep orange text
    medium: { bg: '#fff2e0', text: '#ff8800' }, // pale orange bg, deep orange text
    high: { bg: '#fff2f0', text: '#f5222d' },
  },
};

const STYLES = {
  shadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: scale(4) },
    shadowOpacity: 0.1,
    shadowRadius: scale(6),
    elevation: 5,
  },
  borderRadius: scale(12),
};

// Use a gradient from deep orange to white
const GRADIENT = ['#ff8800', '#fff']; // deep orange to white


export default function TasksScreen({ onGoBack }) {
  const [tasks, setTasks] = useState([]);
  const [newTaskText, setNewTaskText] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState('medium');
  const [newTaskDeadline, setNewTaskDeadline] = useState(null);
  const [isDeadlinePickerVisible, setDeadlinePickerVisible] = useState(false);
  
  // State for the edit modal
  const [isModalVisible, setModalVisible] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [editedText, setEditedText] = useState('');

  // --- Data Persistence ---
  useEffect(() => {
    // Load tasks from storage when the app starts
    const loadTasks = async () => {
      try {
        const storedTasks = await AsyncStorage.getItem('tasks');
        if (storedTasks !== null) {
          setTasks(JSON.parse(storedTasks));
        }
      } catch (e) {
        console.error("Failed to load tasks.", e);
      }
    };
    loadTasks();
  }, []);

  useEffect(() => {
    // Save tasks to storage whenever they change
    const saveTasks = async () => {
      try {
        await AsyncStorage.setItem('tasks', JSON.stringify(tasks));
      } catch (e) {
        console.error("Failed to save tasks.", e);
      }
    };
    saveTasks();
  }, [tasks]);
  
  // --- Deadline Picker Handlers ---
  const showDeadlinePicker = () => setDeadlinePickerVisible(true);
  const hideDeadlinePicker = () => setDeadlinePickerVisible(false);

  const handleConfirmDeadline = (date) => {
    setNewTaskDeadline(date);
    hideDeadlinePicker();
  };

  // --- Task Handlers ---
  const handleAddTask = useCallback(() => {
    if (newTaskText.trim() === '') return;
    
    const newTask = {
      id: Date.now().toString(),
      text: newTaskText.trim(),
      completed: false,
      priority: newTaskPriority,
      createdAt: new Date().toISOString(),
      deadline: newTaskDeadline ? newTaskDeadline.toISOString() : null,
    };
    
    setTasks(prevTasks => [newTask, ...prevTasks]);
    setNewTaskText('');
    setNewTaskDeadline(null);
  }, [newTaskText, newTaskPriority, newTaskDeadline]);

  const toggleTaskStatus = (id) => {
    setTasks(prevTasks => {
      const updatedTasks = prevTasks.map(task =>
        task.id === id ? { ...task, completed: !task.completed } : task
      );
      // Sort to move completed tasks to the bottom
      return updatedTasks.sort((a, b) => a.completed - b.completed);
    });
  };

  const handleDeleteTask = (id) => {
    Alert.alert(
      "Delete Task",
      "Are you sure you want to delete this task?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", style: "destructive", onPress: () => {
            setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
        }},
      ]
    );
  };

  const openEditModal = (task) => {
    setEditingTask(task);
    setEditedText(task.text);
    setModalVisible(true);
  };
  
  const handleEditTask = () => {
    if (!editingTask) return;
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === editingTask.id ? { ...task, text: editedText.trim() } : task
      )
    );
    setModalVisible(false);
    setEditingTask(null);
  };

  // --- Memoized Stats Calculation ---
  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter(task => task.completed).length;
    return {
      total,
      completed,
      pending: total - completed,
    };
  }, [tasks]);
  
  const renderTaskItem = ({ item }) => {
    const isOverdue = item.deadline && !item.completed && new Date(item.deadline) < new Date();

    return (
      <View style={[styles.taskItem, STYLES.shadow]}>
        <TouchableOpacity onPress={() => toggleTaskStatus(item.id)} style={styles.checkbox}>
          <FontAwesome 
            name={item.completed ? "check-square" : "square-o"} 
            size={scale(24)} 
            color={item.completed ? COLORS.success : COLORS.primary} 
          />
        </TouchableOpacity>
        <View style={styles.taskContent}>
          <Text style={[styles.taskTitle, item.completed && styles.taskTitleCompleted]}>{item.text}</Text>
          <View style={styles.metaContainer}>
            <View style={[styles.priorityBadge, { backgroundColor: COLORS.priority[item.priority].bg }]}
            >
              <Text style={[styles.priorityText, { color: COLORS.priority[item.priority].text }]}>
                {item.priority.charAt(0).toUpperCase() + item.priority.slice(1)}
              </Text>
            </View>
            {item.deadline && (
              <View style={[styles.deadlineBadge, isOverdue && styles.overdueBadge]}>
                <FontAwesome name="clock-o" size={scale(12)} color={isOverdue ? COLORS.white : COLORS.dark} style={{ marginRight: scale(4) }}/>
                <Text style={[styles.deadlineText, isOverdue && styles.overdueText]}>
                  {new Date(item.deadline).toLocaleDateString()}
                </Text>
              </View>
            )}
          </View>
          <Text style={styles.createdAtText}>
            Created: {new Date(item.createdAt).toLocaleString()}
          </Text>
        </View>
        <View style={styles.taskActions}>
          <TouchableOpacity onPress={() => openEditModal(item)}>
            <FontAwesome name="edit" size={scale(22)} color={COLORS.dark} style={{opacity: 0.6}}/>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleDeleteTask(item.id)}>
            <FontAwesome name="trash" size={scale(22)} color={COLORS.danger} style={{opacity: 0.7}}/>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <LinearGradient colors={GRADIENT} style={{ flex: 1 }}>
      <SafeAreaView style={{flex: 1, paddingTop: Platform.OS === 'android' ? scale(32) : 0}}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.container}
        >
          <View style={styles.appHeader}>
              <TouchableOpacity onPress={onGoBack}>
                  <FontAwesome name="arrow-left" size={scale(24)} color={COLORS.white} />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Tasks</Text>
              <View style={{width: scale(24)}} />
          </View>

          <View style={styles.statsContainer}>
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>{stats.total}</Text>
              <Text style={styles.statLabel}>Total</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>{stats.completed}</Text>
              <Text style={styles.statLabel}>Completed</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>{stats.pending}</Text>
              <Text style={styles.statLabel}>Pending</Text>
            </View>
          </View>

          <FlatList
            data={tasks}
            renderItem={renderTaskItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.taskList}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <FontAwesome name="check-circle" size={scale(60)} color={COLORS.light} />
                <Text style={styles.emptyText}>No tasks yet. Well done!</Text>
              </View>
            }
          />

          <View style={styles.inputSection}>
            <Text style={styles.priorityLabel}>Set Task Priority</Text>
            <View style={styles.prioritySelector}>
              <TouchableOpacity onPress={() => setNewTaskPriority('low')} style={[styles.priorityButton, newTaskPriority === 'low' && styles.priorityButtonSelected]}>
                <Text style={[styles.priorityButtonText, newTaskPriority === 'low' && styles.priorityButtonTextSelected]}>Low</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setNewTaskPriority('medium')} style={[styles.priorityButton, newTaskPriority === 'medium' && styles.priorityButtonSelected]}>
                <Text style={[styles.priorityButtonText, newTaskPriority === 'medium' && styles.priorityButtonTextSelected]}>Medium</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setNewTaskPriority('high')} style={[styles.priorityButton, newTaskPriority === 'high' && styles.priorityButtonSelected]}>
                <Text style={[styles.priorityButtonText, newTaskPriority === 'high' && styles.priorityButtonTextSelected]}>High</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.inputContainer}>
              <View style={styles.textInputContainer}>
                  <TextInput
                    style={styles.textInput}
                    placeholder="Add a new task..."
                    placeholderTextColor="#99a"
                    value={newTaskText}
                    onChangeText={setNewTaskText}
                    onSubmitEditing={handleAddTask}
                  />
                  <TouchableOpacity onPress={showDeadlinePicker} style={styles.deadlineButton}>
                    <FontAwesome name="calendar" size={scale(22)} color={newTaskDeadline ? COLORS.primary : COLORS.dark} />
                  </TouchableOpacity>
              </View>
              <TouchableOpacity style={styles.addButton} onPress={handleAddTask}>
                <FontAwesome name="plus" size={scale(20)} color={COLORS.white} />
              </TouchableOpacity>
            </View>
            
            {newTaskDeadline && (
              <View style={styles.deadlineInfoContainer}>
                <Text style={styles.deadlineInfoText}>
                  Deadline: {newTaskDeadline.toLocaleDateString()}
                </Text>
                <TouchableOpacity onPress={() => setNewTaskDeadline(null)}>
                  <FontAwesome name="times-circle" size={scale(18)} color={COLORS.danger} />
                </TouchableOpacity>
              </View>
            )}
          </View>
        </KeyboardAvoidingView>

        {/* Edit Task Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={isModalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <KeyboardAvoidingView 
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.modalContainer}
          >
            <View style={styles.modalView}>
              <Text style={styles.modalTitle}>Edit Task</Text>
              <TextInput
                style={styles.modalInput}
                value={editedText}
                onChangeText={setEditedText}
                autoFocus={true}
              />
              <View style={styles.modalButtonContainer}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.modalButtonSave]}
                  onPress={handleEditTask}
                >
                  <Text style={styles.modalButtonText}>Save</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.modalButtonCancel]}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.modalButtonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
        </Modal>

        <DateTimePickerModal
          isVisible={isDeadlinePickerVisible}
          mode="date"
          onConfirm={handleConfirmDeadline}
          onCancel={hideDeadlinePicker}
          minimumDate={new Date()}
        />
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  appHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.primary,
    paddingHorizontal: scale(20),
    paddingVertical: scale(15),
  },
  headerTitle: {
    color: COLORS.white,
    fontSize: scale(22),
    fontWeight: 'bold',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: COLORS.primary,
    paddingBottom: scale(20),
    borderBottomLeftRadius: STYLES.borderRadius,
    borderBottomRightRadius: STYLES.borderRadius,
  },
  statBox: {
    alignItems: 'center',
  },
  statNumber: {
    color: COLORS.white,
    fontSize: scale(24),
    fontWeight: 'bold',
  },
  statLabel: {
    color: COLORS.light,
    fontSize: scale(14),
    opacity: 0.8,
  },
  taskList: {
    padding: scale(20),
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: STYLES.borderRadius,
    padding: scale(15),
    marginBottom: scale(15),
  },
  checkbox: {
    marginRight: scale(15),
  },
  taskContent: {
    flex: 1,
    gap: scale(5),
  },
  taskTitle: {
    fontSize: scale(16),
    color: COLORS.dark,
  },
  taskTitleCompleted: {
    textDecorationLine: 'line-through',
    color: '#aaa',
  },
  metaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(8),
  },
  priorityBadge: {
    marginTop: scale(5),
    paddingHorizontal: scale(8),
    paddingVertical: scale(3),
    borderRadius: scale(8),
    alignSelf: 'flex-start',
  },
  deadlineBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: scale(10),
    paddingHorizontal: scale(8),
    paddingVertical: scale(4),
    marginTop: scale(5),
  },
  overdueBadge: {
    backgroundColor: COLORS.danger,
  },
  deadlineText: {
    fontSize: scale(12),
    color: COLORS.dark,
    fontWeight: '500',
  },
  overdueText: {
    color: COLORS.white,
  },
  createdAtText: {
    fontSize: scale(11),
    color: '#aaa',
    fontStyle: 'italic',
    marginTop: scale(4),
  },
  priorityText: {
    fontSize: scale(12),
    fontWeight: 'bold',
  },
  taskActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(15),
  },
  inputSection: {
    padding: scale(15),
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    backgroundColor: COLORS.white,
  },
  priorityLabel: {
    fontSize: scale(14),
    fontWeight: '600',
    color: COLORS.dark,
    marginBottom: scale(10),
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderRadius: STYLES.borderRadius,
    marginRight: scale(10),
  },
  textInput: {
    flex: 1,
    height: scale(45),
    paddingHorizontal: scale(15),
    fontSize: scale(16),
  },
  deadlineButton: {
    paddingHorizontal: scale(10),
  },
  prioritySelector: {
    flexDirection: 'row',
    backgroundColor: COLORS.background,
    borderRadius: STYLES.borderRadius,
    marginBottom: scale(15),
    overflow: 'hidden',
  },
  priorityButton: {
    flex: 1,
    paddingVertical: scale(12),
    alignItems: 'center',
  },
  priorityButtonSelected: {
    backgroundColor: COLORS.primary,
  },
  priorityButtonText: {
    color: COLORS.dark,
    fontWeight: '600',
  },
  priorityButtonTextSelected: {
    color: COLORS.white,
  },
  addButton: {
    width: scale(45),
    height: scale(45),
    backgroundColor: COLORS.primary,
    borderRadius: STYLES.borderRadius,
    justifyContent: 'center',
    alignItems: 'center',
    ...STYLES.shadow,
  },
  deadlineInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: scale(8),
    marginTop: scale(12),
  },
  deadlineInfoText: {
    color: COLORS.dark,
    fontSize: scale(14),
    fontWeight: '500',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: scale(50),
  },
  emptyText: {
    marginTop: scale(20),
    fontSize: scale(18),
    color: '#aaa',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    width: '85%',
    backgroundColor: 'white',
    borderRadius: STYLES.borderRadius,
    padding: scale(25),
    alignItems: 'center',
    ...STYLES.shadow,
  },
  modalTitle: {
    fontSize: scale(20),
    fontWeight: 'bold',
    marginBottom: scale(20),
  },
  modalInput: {
    width: '100%',
    height: scale(50),
    backgroundColor: COLORS.background,
    borderRadius: STYLES.borderRadius,
    paddingHorizontal: scale(15),
    marginBottom: scale(20),
    fontSize: scale(16),
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    flex: 1,
    padding: scale(15),
    borderRadius: STYLES.borderRadius,
    alignItems: 'center',
  },
  modalButtonSave: {
    backgroundColor: COLORS.primary,
    marginRight: scale(10),
  },
  modalButtonCancel: {
    backgroundColor: COLORS.danger,
    marginLeft: scale(10),
  },
  modalButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: scale(16),
  },
});