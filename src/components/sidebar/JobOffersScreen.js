import { LinearGradient } from 'expo-linear-gradient';
import {
    Dimensions,
    FlatList,
    Platform,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

const { width } = Dimensions.get('window');
const scale = (size) => (width / 375) * size;

const JOB_OFFERS = [
  {
    id: '1',
    title: 'Frontend Developer',
    company: 'Tech Solutions Inc.',
    location: 'San Francisco, CA',
    description:
      'We are looking for a skilled Frontend Developer to join our team. Experience with React is a must.',
  },
  {
    id: '2',
    title: 'Backend Engineer',
    company: 'Data Systems LLC',
    location: 'New York, NY',
    description:
      'Join our backend team to work on scalable and robust systems. Proficiency in Node.js and databases required.',
  },
  {
    id: '3',
    title: 'UI/UX Designer',
    company: 'Creative Minds',
    location: 'Remote',
    description:
      'We are seeking a creative UI/UX Designer to design intuitive and engaging user experiences.',
  },
  {
    id: '4',
    title: 'Product Manager',
    company: 'Innovate Co.',
    location: 'Austin, TX',
    description:
      'Lead our product development team and help shape the future of our innovative products.',
  },
];

const JobOffersScreen = ({ onGoBack }) => {
  const renderJobCard = ({ item }) => (
    <View style={styles.jobCard}>
      <Text style={styles.jobTitle}>{item.title}</Text>
      <Text style={styles.jobCompany}>{item.company}</Text>
      <Text style={styles.jobLocation}>{item.location}</Text>
      <Text style={styles.jobDescription}>{item.description}</Text>
    </View>
  );

  return (
    <LinearGradient colors={['#f0f4f8', '#d9e2ec']} style={{ flex: 1 }}>
      <SafeAreaView style={styles.container}>
        <TouchableOpacity onPress={onGoBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Job Offers</Text>
        <FlatList
          data={JOB_OFFERS}
          renderItem={renderJobCard}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
        />
        <Text style={styles.footerText}>
          Reach out to college management to apply.
        </Text>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: Platform.OS === 'android' ? scale(40) : 60,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 24,
    color: '#2c3e50',
    letterSpacing: 1,
  },
  backButton: {
    position: 'absolute',
    top: Platform.OS === 'android' ? scale(40) : 50,
    left: 20,
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
    color: '#2c3e50',
    fontWeight: 'bold',
  },
  listContainer: {
    width: '100%',
    paddingHorizontal: 20,
  },
  jobCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  jobTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#34495e',
    marginBottom: 6,
  },
  jobCompany: {
    fontSize: 16,
    fontWeight: '600',
    color: '#7f8c8d',
    marginBottom: 4,
  },
  jobLocation: {
    fontSize: 14,
    color: '#95a5a6',
    marginBottom: 12,
  },
  jobDescription: {
    fontSize: 14,
    color: '#34495e',
    lineHeight: 20,
  },
  footerText: {
    fontSize: 14,
    color: '#34495e',
    textAlign: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
});

export default JobOffersScreen;
