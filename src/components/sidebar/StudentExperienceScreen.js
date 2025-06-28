import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Alert, KeyboardAvoidingView, Platform, SafeAreaView } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

const StudentExperienceScreen = ({ onGoBack }) => {
  const [teacherName, setTeacherName] = useState('');
  const [majorLearnings, setMajorLearnings] = useState('');
  const [suggestions, setSuggestions] = useState('');

  const handleSubmit = () => {
    // Basic validation
    if (!teacherName.trim() || !majorLearnings.trim()) {
      Alert.alert('Incomplete Form', "Please fill out the teacher's name and your major learnings.");
      return;
    }

    // For now, we'll just show an alert with the submitted data.
    // In a real app, you would send this data to a server.
    Alert.alert(
      'Feedback Submitted',
      `Teacher: ${teacherName}\nMajor Learnings: ${majorLearnings}\nSuggestions: ${suggestions}`
    );

    // Clear the form
    setTeacherName('');
    setMajorLearnings('');
    setSuggestions('');
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#1c107a'}}>
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView 
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        keyboardShouldPersistTaps="handled"
      >
        <TouchableOpacity onPress={onGoBack} style={styles.backButton}>
          <FontAwesome name="arrow-left" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        
        <View style={styles.header}>
          <Text style={styles.title}>Student Experience</Text>
          <Text style={styles.description}>
            We value your feedback! Please share your experience to help us improve.
          </Text>
        </View>

        <View style={styles.formContainer}>
          <View style={styles.inputGroup}>
            <FontAwesome name="user" size={20} color="#999" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Enter the teacher's name"
              placeholderTextColor="#999"
              value={teacherName}
              onChangeText={setTeacherName}
            />
          </View>

          <View style={styles.inputGroup}>
            <FontAwesome name="graduation-cap" size={20} color="#999" style={styles.inputIcon} />
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="What were your major learnings?"
              placeholderTextColor="#999"
              value={majorLearnings}
              onChangeText={setMajorLearnings}
              multiline
            />
          </View>

          <View style={styles.inputGroup}>
            <FontAwesome name="lightbulb-o" size={20} color="#999" style={styles.inputIcon} />
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Any suggestions for the teacher or course?"
              placeholderTextColor="#999"
              value={suggestions}
              onChangeText={setSuggestions}
              multiline
            />
          </View>

          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>Submit Feedback</Text>
            <FontAwesome name="send" size={18} color="#FFFFFF" style={{ marginLeft: 10 }} />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1c107a', // Deep blue background
  },
  contentContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  backButton: {
    position: 'absolute',
    top: Platform.OS === 'android' ? 40 : 60,
    left: 20,
    zIndex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
    padding: 8,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#FFFFFF',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    color: '#E0E0E0',
    paddingHorizontal: 20,
  },
  formContainer: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 10,
  },
  inputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    marginBottom: 20,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#DDD',
  },
  inputIcon: {
    marginRight: 10,
  },
  label: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    flex: 1,
    paddingVertical: 15,
    fontSize: 16,
    color: '#333',
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
    paddingTop: 15, // Align icon with the first line of text
  },
  submitButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ff6600', // Orange accent color
    borderRadius: 10,
    paddingVertical: 15,
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default StudentExperienceScreen;
