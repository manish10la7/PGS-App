import { Picker } from '@react-native-picker/picker';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const SIGNS = [
  { label: 'Aries', value: 'aries' },
  { label: 'Taurus', value: 'taurus' },
  { label: 'Gemini', value: 'gemini' },
  { label: 'Cancer', value: 'cancer' },
  { label: 'Leo', value: 'leo' },
  { label: 'Virgo', value: 'virgo' },
  { label: 'Libra', value: 'libra' },
  { label: 'Scorpio', value: 'scorpio' },
  { label: 'Sagittarius', value: 'sagittarius' },
  { label: 'Capricorn', value: 'capricorn' },
  { label: 'Aquarius', value: 'aquarius' },
  { label: 'Pisces', value: 'pisces' },
];

const HOROSCOPES = {
  aries: 'Today is a great day to start something new. Trust your instincts and take action.',
  taurus: 'Focus on your goals and don’t let distractions get in your way. Patience will pay off.',
  gemini: 'Communication is key today. Reach out to friends and share your ideas.',
  cancer: 'Take care of yourself and your loved ones. Home and family bring comfort.',
  leo: 'Your confidence shines. Take the lead and inspire others around you.',
  virgo: 'Pay attention to details and stay organized. Your hard work will be noticed.',
  libra: 'Seek balance in your relationships. Cooperation brings harmony.',
  scorpio: 'Trust your intuition. A mystery may be revealed today.',
  sagittarius: 'Adventure awaits! Be open to new experiences and learning.',
  capricorn: 'Stay focused on your ambitions. Persistence will bring results.',
  aquarius: 'Embrace your uniqueness. Innovative ideas will come to you.',
  pisces: 'Let your creativity flow. Express yourself through art or music.',
};

const HoroscopeScreen = ({ onGoBack }) => {
  const [selectedSign, setSelectedSign] = useState('aries');

  return (
    <LinearGradient colors={['#fdf6e3', '#e0e7ff']} style={{ flex: 1 }}>
      <SafeAreaView style={styles.container}>
        <TouchableOpacity onPress={onGoBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Horoscope</Text>
        <View style={styles.pickerContainer}>
          <Text style={styles.label}>Select Your Sign</Text>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={selectedSign}
              onValueChange={setSelectedSign}
              style={styles.picker}
              dropdownIconColor="#eab308"
            >
              {SIGNS.map(sign => (
                <Picker.Item key={sign.value} label={sign.label} value={sign.value} />
              ))}
            </Picker>
          </View>
        </View>
        <View style={styles.horoscopeContainer}>
          <Text style={styles.horoscopeTitle}>{SIGNS.find(s => s.value === selectedSign).label} Horoscope</Text>
          <View style={styles.horoscopeCard}>
            <Text style={styles.horoscopeText}>{HOROSCOPES[selectedSign]}</Text>
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', paddingTop: 60 },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 24, color: '#eab308', letterSpacing: 1 },
  backButton: { position: 'absolute', top: 50, left: 20, backgroundColor: '#fff', borderRadius: 20, padding: 8, elevation: 2 },
  backButtonText: { fontSize: 18, color: '#eab308', fontWeight: 'bold' },
  pickerContainer: { width: '85%', marginBottom: 24 },
  label: { fontSize: 16, color: '#a16207', marginBottom: 6, marginLeft: 4 },
  pickerWrapper: { borderRadius: 12, overflow: 'hidden', borderWidth: 1, borderColor: '#fde68a', backgroundColor: '#fff', minHeight: 48, justifyContent: 'center', marginBottom: 4 },
  picker: { width: '100%', height: 48, color: '#eab308', fontSize: 18, backgroundColor: 'transparent' },
  horoscopeContainer: { width: '90%', marginTop: 10 },
  horoscopeTitle: { fontSize: 20, fontWeight: '600', color: '#a16207', marginBottom: 10, textAlign: 'center' },
  horoscopeCard: { backgroundColor: '#fffbe6', borderRadius: 12, padding: 20, marginBottom: 12, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 4, elevation: 2 },
  horoscopeText: { fontSize: 16, color: '#a16207', textAlign: 'center' },
});

export default HoroscopeScreen;
