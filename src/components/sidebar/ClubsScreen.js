import { Picker } from '@react-native-picker/picker';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const CLUBS = [
  { label: 'Sports Club', value: 'sports' },
  { label: 'Academic Club', value: 'academic' },
  { label: 'Music Club', value: 'music' },
  { label: 'Entrepreneur Club', value: 'entrepreneur' },
];

const CLUB_NEWS = {
  sports: [
    'Sports Club: Inter-college football tournament this Saturday!',
    'Join our weekly basketball practice every Wednesday.'
  ],
  academic: [
    'Academic Club: Math Olympiad registration open.',
    'Guest lecture on AI this Friday.'
  ],
  music: [
    'Music Club: Auditions for band members next week.',
    'Open mic night on Thursday!'
  ],
  entrepreneur: [
    'Entrepreneur Club: Startup pitch event coming soon.',
    'Workshop: How to build your first business.'
  ]
};

const ClubsScreen = ({ onGoBack }) => {
  const [selectedClub, setSelectedClub] = useState('sports');

  return (
    <LinearGradient colors={['#f8fafc', '#e0e7ff']} style={{ flex: 1 }}>
      <SafeAreaView style={styles.container}>
        <TouchableOpacity onPress={onGoBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Clubs</Text>
        <View style={styles.pickerContainer}>
          <Text style={styles.label}>Select a Club</Text>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={selectedClub}
              onValueChange={setSelectedClub}
              style={styles.picker}
              dropdownIconColor="#4f46e5"
            >
              {CLUBS.map(club => (
                <Picker.Item key={club.value} label={club.label} value={club.value} />
              ))}
            </Picker>
          </View>
        </View>
        <View style={styles.newsContainer}>
          <Text style={styles.newsTitle}>Latest News</Text>
          {CLUB_NEWS[selectedClub].map((news, idx) => (
            <View key={idx} style={styles.newsCard}>
              <Text style={styles.newsText}>{news}</Text>
            </View>
          ))}
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', paddingTop: 60 },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 24, color: '#4f46e5', letterSpacing: 1 },
  backButton: { position: 'absolute', top: 50, left: 20, backgroundColor: '#fff', borderRadius: 20, padding: 8, elevation: 2 },
  backButtonText: { fontSize: 18, color: '#4f46e5', fontWeight: 'bold' },
  pickerContainer: { width: '85%', marginBottom: 24 },
  label: { fontSize: 16, color: '#64748b', marginBottom: 6, marginLeft: 4 },
  pickerWrapper: { 
    borderRadius: 12, 
    overflow: 'hidden', 
    borderWidth: 1, 
    borderColor: '#c7d2fe',
    backgroundColor: '#fff',
    minHeight: 48,
    justifyContent: 'center',
    marginBottom: 4,
  },
  picker: { width: '100%', height: 48, color: '#4f46e5', fontSize: 18, backgroundColor: 'transparent' },
  newsContainer: { width: '90%', marginTop: 10 },
  newsTitle: { fontSize: 20, fontWeight: '600', color: '#1e293b', marginBottom: 10 },
  newsCard: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 12, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 4, elevation: 2 },
  newsText: { fontSize: 16, color: '#334155' },
});

export default ClubsScreen;
