import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';

const AboutScreen = ({ onGoBack }) => (
  <SafeAreaView style={styles.safeArea}>
    <View style={styles.header}>
        <TouchableOpacity onPress={onGoBack} style={styles.backButton}>
            <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>About Us</Text>
    </View>
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Text style={styles.title}>ABOUT PRESIDENTIAL GRADUATE SCHOOL</Text>
      <Text style={styles.paragraph}>
        Situated in New Baneshwor, Kathmandu, the Presidential Graduate School was founded in 2011, with the mission to establish itself as a benchmark for quality education in Nepal.
      </Text>

      <Text style={styles.subtitle}>Accreditation and Affiliation:</Text>
      <Text style={styles.paragraph}>
        Presidential Graduate School proudly affiliates with Westcliff University, USA (www.westcliff.edu). Westcliff University is accredited by the WASC Senior College and University Commission (WSCUC), 1080 Marina Village Parkway, Suite 500, Alameda, CA 94501 510.748.9797, an institutional accrediting body recognized by the U.S. Department of Education (ED), and the Council on Higher Education Accreditation (CHEA), a private nonprofit national organization that serves its members, students, and society through advocacy for the value and independence of accreditation, recognition of accrediting organizations, and commitment to quality in higher education.
      </Text>
      <Text style={styles.paragraph}>
        Westcliff University College of Business programs are globally accredited by the Accreditation Council for Business Schools and Programs (ACBSP), a standard of excellence with an accreditation process based on the Baldrige Education Criteria for Performance Excellence. The accreditation focuses on recognizing teaching excellence, determining student learning outcomes, and a continuous improvement model. Institutions with programs accredited by ACBSP are committed to continuous improvement that ensures their business program will give students the skills employers want.
      </Text>

      <Text style={styles.subtitle}>Commitment to Excellence:</Text>
      <Text style={styles.paragraph}>
        Presidential Graduate School distinguishes itself by promoting innovative managerial philosophies and inspiring individuals to become responsible managers, entrepreneurs, leaders, and researchers in the fields of Management and Information Technology. The institution is steadfast in delivering international degrees in Business and Information Technology, addressing concerns about the outflow of talent seeking foreign degrees.
      </Text>

      <Text style={styles.subtitle}>Academic Focus:</Text>
      <Text style={styles.paragraph}>
        The school actively fosters critical thinking and decision-making skills through practical, research-based academic programs. Committed to contributing to the nation's development, the Presidential Graduate School actively promotes entrepreneurship, innovation, and the creation of employment opportunities.
      </Text>

      <Text style={styles.subtitle}>Exceptional Resources:</Text>
      <Text style={styles.paragraph}>
        With exceptional human resources, including a cadre of brilliant faculty and visionary management, the school provides state-of-the-art facilities and international exposure, along with exclusive access to corporate practices. Students receive significant support from leaders in reputable local businesses and corporate houses. By facilitating seamless access through LIRN to scholarly journals and research materials, we empower our students, researchers, and educators to explore and engage with authoritative content across various disciplines.
      </Text>

      <Text style={styles.subtitle}>Future Vision:</Text>
      <Text style={styles.paragraph}>
        While presently focusing on the School of Business and the School of Technology, the Presidential Graduate School envisions future expansion by establishing diverse departments that adhere to global standards and offer accredited degrees. Collaboration with businesses, corporate houses, international agencies, and other partners remains crucial for realizing this vision and expanding the scope of the academic project.
      </Text>

      <Text style={styles.title}>VISION STATEMENT</Text>
      <Text style={styles.paragraph}>
        Presidential Graduate School aspires to become one of the best Academic Institution in the South Asia, known for providing experiential learning environment to build the next generation human resources that would lead, inspire and innovate.
      </Text>

      <Text style={styles.title}>OUR MISSION STATEMENT</Text>
      <Text style={styles.paragraph}>
        To provide learning environment where individuals are inspired and empowered to become responsible managers, entrepreneurs, leaders and researchers in different management fields.
      </Text>
      <Text style={styles.paragraph}>
        To enhance critical thinking and decision making skills of students through practical, research based and innovative academic programs.
      </Text>
      <Text style={styles.paragraph}>
        To promote entrepreneurship through innovation and contribute in nation’s development by creating employments.
      </Text>

      <Text style={styles.title}>Contact Us</Text>
      <Text style={styles.paragraph}>
        Contact us: 01-5244306, 01-5245006, 9767658631, 9851343705{
          '\n'
        }
        info@presidential.edu.np{
          '\n'
        }
        Bhakti Thapa Sadak, Thapagaun, New Baneshwor, Kathmandu 44600
      </Text>
    </ScrollView>
  </SafeAreaView>
);

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: '#ff6600',
    position: 'relative',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  backButton: {
    position: 'absolute',
    left: 20,
  },
  backButtonText: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1c107a',
    marginBottom: 15,
    marginTop: 10,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ff6600',
    marginTop: 15,
    marginBottom: 10,
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
    marginBottom: 15,
    textAlign: 'justify',
  },
});

export default AboutScreen;
