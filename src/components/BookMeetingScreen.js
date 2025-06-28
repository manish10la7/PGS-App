import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Platform,
  Dimensions,
  Alert,
  KeyboardAvoidingView,
  SafeAreaView,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const scale = (size) => (width / 375) * size;

// --- Color and Style Constants ---
const COLORS = {
  primary: '#6c63ff',
  white: '#FFFFFF',
  background: '#f9f9ff',
  border: '#e6e6ff',
  dark: '#343a40',
  light: '#f8f9fa',
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

export default function BookMeetingScreen({ onGoBack }) {
  const [name, setName] = useState('');
  const [professor, setProfessor] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = () => {
    if (!name.trim() || !professor.trim() || !description.trim()) {
      Alert.alert('Missing Information', 'Please fill out all fields before submitting.');
      return;
    }
    // Handle the submission logic (e.g., send to a server, store locally)
    Alert.alert(
      'Appointment Booked',
      `Your meeting with ${professor} has been requested.`,
      [{ text: 'OK', onPress: onGoBack }]
    );
    // Clear fields after submission
    setName('');
    setProfessor('');
    setDescription('');
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <View style={styles.appHeader}>
          <TouchableOpacity onPress={onGoBack}>
            <FontAwesome name="arrow-left" size={scale(24)} color={COLORS.white} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Book a Meeting</Text>
          <View style={{ width: scale(24) }} />
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.label}>Your Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your full name"
            value={name}
            onChangeText={setName}
            placeholderTextColor="#999"
          />

          <Text style={styles.label}>Professor for Appointment</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter the professor's name"
            value={professor}
            onChangeText={setProfessor}
            placeholderTextColor="#999"
          />

          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Briefly describe the reason for your appointment"
            value={description}
            onChangeText={setDescription}
            multiline={true}
            placeholderTextColor="#999"
          />

          <TouchableOpacity style={[styles.submitButton, STYLES.shadow]} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>Submit Request</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingTop: Platform.OS === 'android' ? scale(32) : 0, // Add top padding for Android status bar
  },
  appHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    padding: scale(20),
    paddingTop: scale(15),
    borderBottomLeftRadius: scale(20),
    borderBottomRightRadius: scale(20),
  },
  headerTitle: {
    fontSize: scale(22),
    fontWeight: 'bold',
    color: COLORS.white,
  },
  formContainer: {
    flex: 1,
    padding: scale(20),
  },
  label: {
    fontSize: scale(16),
    fontWeight: '600',
    color: COLORS.dark,
    marginBottom: scale(8),
    marginTop: scale(15),
  },
  input: {
    backgroundColor: COLORS.white,
    padding: scale(14),
    borderRadius: STYLES.borderRadius,
    borderWidth: 1,
    borderColor: COLORS.border,
    fontSize: scale(16),
    color: COLORS.dark,
  },
  textArea: {
    height: scale(120),
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: COLORS.primary,
    padding: scale(16),
    borderRadius: STYLES.borderRadius,
    alignItems: 'center',
    marginTop: scale(30),
  },
  submitButtonText: {
    color: COLORS.white,
    fontSize: scale(18),
    fontWeight: 'bold',
  },
});
