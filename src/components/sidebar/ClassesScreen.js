import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { FlatList, Modal, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const teachers = [
  { name: 'Suresh Pokharel', course: 'Cloud Computing Essentials' },
  { name: 'Ashwin Kumar Satyal', course: 'Introduction to Cybersecurity' },
  { name: 'Dolma Kumari Sherpa', course: 'Data Structures and Algorithms' },
  { name: 'Rajesh Basnet', course: 'Digital Marketing for IT Professionals' },
  { name: 'Prabhat Koirala', course: 'IT Project Management' },
  { name: 'Dronacharya Ghimire', course: 'Enterprise Resource Planning (ERP)' },
  { name: 'Bibek Ropakheti', course: 'Machine Learning Basics' },
  { name: 'Bibek Khanal', course: 'Artificial Intelligence Fundamentals' },
  { name: 'Lekhnath Timalsena', course: 'Web Development with JavaScript' },
  { name: 'Anupama Poudel', course: 'Technical Writing for IT' },
  { name: 'Sabina Bhattarai', course: 'Database Management Systems' },
  { name: 'Shrijana Basnet', course: 'Network Administration' },
  { name: 'Mona Shrestha', course: 'Information Systems in Business' },
  { name: 'Himani Rijal', course: 'Social Media Analytics' },
];

const floors = [
    { floor: 1, classes: ['102', '103'] },
    { floor: 2, classes: ['201', '202', '203', '204'] },
    { floor: 3, classes: ['301', '302', '303', '304', '305'] },
    { floor: 4, classes: ['401', '402', '403', '404', '405'] },
    { floor: 5, classes: ['501', '502'] },
    { floor: 6, classes: ['Hall'] },
];

const getRandomTeacher = () => teachers[Math.floor(Math.random() * teachers.length)];

const ClassesScreen = ({ onGoBack }) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedClass, setSelectedClass] = useState(null);

    const handleClassPress = (classId) => {
        if (classId === 'Hall') {
            setSelectedClass({
                id: 'Hall',
                events: ['Event 1', 'Event 2'],
            });
        } else {
            setSelectedClass({
                id: classId,
                currentTeacher: getRandomTeacher(),
                upcomingTeacher: getRandomTeacher(),
            });
        }
        setModalVisible(true);
    };

    const numColumns = 3;
    const listData = [];
    floors.forEach(floor => {
        listData.push({ type: 'header', title: `Floor ${floor.floor}`, id: `floor-${floor.floor}` });
        const classes = floor.classes;
        for (let i = 0; i < classes.length; i += numColumns) {
            const rowItems = classes.slice(i, i + numColumns);
            while (rowItems.length < numColumns) {
                rowItems.push(null);
            }
            listData.push({ type: 'row', items: rowItems, id: `row-${floor.floor}-${i}` });
        }
    });

    return (
        <LinearGradient colors={['#f8fafc', '#e0e7ff']} style={{ flex: 1 }}>
            <SafeAreaView style={styles.container}>
                <TouchableOpacity onPress={onGoBack} style={styles.backButton}>
                    <Text style={styles.backButtonText}>← Back</Text>
                </TouchableOpacity>
                <Text style={styles.title}>Classes</Text>
                <FlatList
                    data={listData}
                    style={styles.scrollView}
                    keyExtractor={item => item.id}
                    renderItem={({ item }) => {
                        if (item.type === 'header') {
                            return (
                                <View style={styles.floorContainer}>
                                    <Text style={styles.floorTitle}>{item.title}</Text>
                                </View>
                            );
                        }
                        return (
                            <View style={{ flexDirection: 'row', paddingHorizontal: 5 }}>
                                {item.items.map((classId, index) => {
                                    if (!classId) {
                                        return <View key={`empty-${index}`} style={[styles.classButton, styles.emptyClassButton]} />;
                                    }
                                    return (
                                        <TouchableOpacity key={classId} style={styles.classButton} onPress={() => handleClassPress(classId)}>
                                            <Text style={styles.classButtonText}>{classId}</Text>
                                        </TouchableOpacity>
                                    );
                                })}
                            </View>
                        );
                    }}
                />
                {selectedClass && (
                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={modalVisible}
                        onRequestClose={() => {
                            setModalVisible(!modalVisible);
                        }}
                    >
                        <View style={styles.centeredView}>
                            <View style={styles.modalView}>
                                {selectedClass.id === 'Hall' ? (
                                    <>
                                        <Text style={styles.modalTitle}>Hall Events</Text>
                                        {selectedClass.events.map((event, index) => (
                                            <Text key={index} style={styles.modalText}>{event}</Text>
                                        ))}
                                    </>
                                ) : (
                                    <>
                                        <Text style={styles.modalTitle}>Class {selectedClass.id}</Text>
                                        <Text style={styles.modalText}>Current Teacher: {selectedClass.currentTeacher.name} ({selectedClass.currentTeacher.course})</Text>
                                        <Text style={styles.modalText}>Upcoming Teacher: {selectedClass.upcomingTeacher.name} ({selectedClass.upcomingTeacher.course})</Text>
                                    </>
                                )}
                                <TouchableOpacity
                                    style={[styles.button, styles.buttonClose]}
                                    onPress={() => setModalVisible(!modalVisible)}
                                >
                                    <Text style={styles.textStyle}>Back</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Modal>
                )}
            </SafeAreaView>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, alignItems: 'center', paddingTop: 60 },
    title: { fontSize: 28, fontWeight: 'bold', marginBottom: 24, color: '#4f46e5', letterSpacing: 1 },
    backButton: { position: 'absolute', top: 50, left: 20, backgroundColor: '#fff', borderRadius: 20, padding: 8, elevation: 2 },
    backButtonText: { fontSize: 18, color: '#4f46e5', fontWeight: 'bold' },
    scrollView: { width: '100%' },
    floorContainer: { marginBottom: 20, paddingHorizontal: 10 },
    floorTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 10, color: '#64748b' },
    classButton: { backgroundColor: '#fff', borderRadius: 12, padding: 18, margin: 5, flex: 1, alignItems: 'center', borderWidth: 1, borderColor: '#c7d2fe' },
    classButtonText: { color: '#4f46e5', fontSize: 18, fontWeight: 'bold' },
    emptyClassButton: { backgroundColor: 'transparent', borderWidth: 0 },
    centeredView: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 22 },
    modalView: { margin: 20, backgroundColor: '#fff', borderRadius: 20, padding: 35, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 4, elevation: 5 },
    button: { borderRadius: 20, padding: 10, elevation: 2 },
    buttonClose: { backgroundColor: '#4f46e5' },
    textStyle: { color: 'white', fontWeight: 'bold', textAlign: 'center' },
    modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 15, textAlign: 'center', color: '#4f46e5' },
    modalText: { marginBottom: 15, textAlign: 'center', color: '#334155', fontSize: 16 },
});

export default ClassesScreen;
