import { Ionicons } from '@expo/vector-icons'; // Assuming you are using expo and have installed vector-icons
import { LinearGradient } from 'expo-linear-gradient';
import { useContext, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Image, Modal, Platform, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { UserContext } from '../../../utils/UserContext';
import { getUserProfile, updateUserProfile } from '../../utils/firestore';

// Define color constants for styling the component.
const PRIMARY = '#ff6600';
const DEEPBLUE = '#1c107a';
const WHITE = '#fff';
const GRADIENT = ['#ffb347', '#e0e7ff']; // A gradient from orange to light blue for the background.

// The main component for the profile screen.
const ProfileScreen = ({ onGoBack }) => {
    // Use UserContext to get and set user data globally.
    const { user, setUser } = useContext(UserContext);
    // State to control the visibility of the modal for editing the profile.
    const [modalVisible, setModalVisible] = useState(false);
    // Temporary state to hold user data while editing in the modal.
    const [tempUser, setTempUser] = useState(user);
    // State to show a loading indicator while fetching data.
    const [isLoading, setIsLoading] = useState(true);
    // State to hold the fetched user profile data.
    const [profile, setProfile] = useState(null);

    // useEffect hook to fetch the user's profile data when the component mounts or user.uid changes.
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

    // Function to handle the "Edit" button press, which opens the modal.
    const handleEdit = () => {
        // Initialize the temporary user state with the current user data.
        setTempUser(user);
        setModalVisible(true);
    };

    // Function to handle saving the changes made in the edit profile modal.
    const handleSave = async () => {
        try {
            // Update the user profile in Firestore.
            await updateUserProfile(user.uid, tempUser);
            // Update the user context and local state with the new data.
            setUser(tempUser);
            setProfile(tempUser);
            setModalVisible(false);
            Alert.alert('Success', 'Profile updated successfully.');
        } catch (error) {
            Alert.alert('Error', 'Failed to update profile.');
        }
    };

    // Function to handle changes in the input fields of the modal.
    const handleInputChange = (field, value) => {
        // Update the temporary user state with the new value for the given field.
        setTempUser({ ...tempUser, [field]: value });
    };

    // If data is still loading, display an activity indicator.
    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={PRIMARY} />
            </View>
        );
    }

    // Render the main profile screen UI.
    return (
        <LinearGradient colors={GRADIENT} style={{ flex: 1 }}>
            <SafeAreaView style={styles.container}>
                {/* Add padding for the Android status bar. */}
                {Platform.OS === 'android' && <View style={{ height: StatusBar.currentHeight || 32 }} />}
                <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
                    {/* Profile header section with gradient background. */}
                    <View style={styles.profileHeaderGradient}>
                        <TouchableOpacity onPress={onGoBack} style={styles.backButton}>
                            <Ionicons name="arrow-back" size={28} color={WHITE} />
                        </TouchableOpacity>
                        <View style={styles.profileHeaderContent}>
                            <Image
                                style={styles.profileImage}
                                source={user.profileImage}
                            />
                            {/* Display user's name and role, falling back to context data if profile is not loaded. */}
                            <Text style={styles.userName}>{profile?.name || user.name}</Text>
                            <Text style={styles.userRole}>{profile?.role || user.role}</Text>
                        </View>
                    </View>

                    {/* Card for displaying contact information. */}
                    <View style={styles.infoSectionCard}>
                        <View style={styles.infoRow}>
                            <Ionicons name="mail-outline" size={24} color={PRIMARY} />
                            <Text style={styles.infoText}>{profile?.email || user.email}</Text>
                        </View>
                        <View style={styles.infoRow}>
                            <Ionicons name="call-outline" size={24} color={PRIMARY} />
                            <Text style={styles.infoText}>{profile?.phone || user.phone}</Text>
                        </View>
                        <View style={styles.infoRow}>
                            <Ionicons name="location-outline" size={24} color={PRIMARY} />
                            <Text style={styles.infoText}>{profile?.address || user.address}</Text>
                        </View>
                    </View>

                    {/* Card for displaying academic information. */}
                    <View style={styles.infoSectionCard}>
                        <Text style={styles.sectionTitle}>Academic Information</Text>
                        <View style={styles.infoRow}>
                            <Ionicons name="id-card-outline" size={24} color={DEEPBLUE} />
                            <Text style={styles.infoText}>GAP ID: {profile?.gapID || user.gapID}</Text>
                        </View>
                        <View style={styles.infoRow}>
                            <Ionicons name="school-outline" size={24} color={DEEPBLUE} />
                            <Text style={styles.infoText}>Enrolled Year: {profile?.enrolledYear || user.enrolledYear}</Text>
                        </View>
                        <View style={styles.infoRow}>
                            <Ionicons name="calendar-outline" size={24} color={DEEPBLUE} />
                            <Text style={styles.infoText}>Current Trimester: {profile?.currentTrimester || user.currentTrimester}</Text>
                        </View>
                    </View>

                    {/* Card for displaying job information. */}
                    <View style={styles.infoSectionCard}>
                        <Text style={styles.sectionTitle}>Job Information</Text>
                        <View style={styles.infoRow}>
                            <Ionicons name="briefcase-outline" size={24} color={PRIMARY} />
                            <Text style={styles.infoText}>{profile?.job || user.job}</Text>
                        </View>
                    </View>

                    {/* Card for displaying clubs information. */}
                    <View style={styles.infoSectionCard}>
                        <Text style={styles.sectionTitle}>Clubs</Text>
                        {/* Map through the user's clubs and display them. */}
                        {(profile?.clubs || user.clubs) && (profile?.clubs || user.clubs).map((club, index) => (
                            <View style={styles.infoRow} key={index}>
                                <Ionicons name="game-controller-outline" size={24} color={DEEPBLUE} />
                                <Text style={styles.infoText}>{club}</Text>
                            </View>
                        ))}
                    </View>

                    {/* Button to open the edit profile modal. */}
                    <TouchableOpacity style={styles.editProfileButton} onPress={handleEdit}>
                        <Text style={styles.editProfileButtonText}>Edit Profile</Text>
                    </TouchableOpacity>

                    {/* Modal for editing the user's profile. */}
                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={modalVisible}
                        onRequestClose={() => {
                            setModalVisible(!modalVisible);
                        }}>
                        <View style={styles.centeredView}>
                            <View style={styles.modalView}>
                                <Text style={styles.modalTitle}>Edit Profile</Text>
                                {/* Input fields for all editable profile attributes. */}
                                <TextInput style={styles.input} placeholder="Name" value={tempUser.name} onChangeText={(val) => handleInputChange('name', val)} />
                                <TextInput style={styles.input} placeholder="Role" value={tempUser.role} onChangeText={(val) => handleInputChange('role', val)} />
                                <TextInput style={styles.input} placeholder="Email" value={tempUser.email} onChangeText={(val) => handleInputChange('email', val)} />
                                <TextInput style={styles.input} placeholder="GAP ID" value={tempUser.gapID} onChangeText={(val) => handleInputChange('gapID', val)} />
                                <TextInput style={styles.input} placeholder="Phone" value={tempUser.phone} onChangeText={(val) => handleInputChange('phone', val)} />
                                <TextInput style={styles.input} placeholder="Address" value={tempUser.address} onChangeText={(val) => handleInputChange('address', val)} />
                                <TextInput style={styles.input} placeholder="Enrolled Year" value={tempUser.enrolledYear} onChangeText={(val) => handleInputChange('enrolledYear', val)} />
                                <TextInput style={styles.input} placeholder="Current Trimester" value={tempUser.currentTrimester} onChangeText={(val) => handleInputChange('currentTrimester', val)} />
                                <TextInput style={styles.input} placeholder="Job" value={tempUser.job} onChangeText={(val) => handleInputChange('job', val)} />
                                {/* Special handling for the clubs array, joining and splitting by comma. */}
                                <TextInput style={styles.input} placeholder="Clubs (comma separated)" value={tempUser.clubs ? tempUser.clubs.join(', ') : ''} onChangeText={(val) => handleInputChange('clubs', val.split(',').map(s => s.trim()))} />
                                <View style={styles.modalButtons}>
                                    {/* Button to save the changes. */}
                                    <TouchableOpacity style={[styles.button, styles.buttonSave]} onPress={handleSave}>
                                        <Text style={styles.textStyle}>Save</Text>
                                    </TouchableOpacity>
                                    {/* Button to cancel editing and close the modal. */}
                                    <TouchableOpacity style={[styles.button, styles.buttonCancel]} onPress={() => setModalVisible(false)}>
                                        <Text style={styles.textStyle}>Cancel</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </Modal>
                </ScrollView>
            </SafeAreaView>
        </LinearGradient>
    );
};

// StyleSheet for all the styles used in this component.
const styles = StyleSheet.create({
    container: { flex: 1 },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    profileHeaderGradient: {
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        paddingBottom: 30,
        paddingTop: 40,
        alignItems: 'center',
        marginBottom: 10,
        minHeight: 220,
        position: 'relative',
    },
    profileHeaderContent: {
        alignItems: 'center',
        marginTop: 10,
    },
    backButton: {
        position: 'absolute',
        top: 18,
        left: 18,
        zIndex: 2,
        backgroundColor: 'rgba(255,255,255,0.15)',
        borderRadius: 20,
        padding: 6,
    },
    profileImage: {
        width: 120,
        height: 120,
        borderRadius: 60,
        marginBottom: 10,
        borderWidth: 4,
        borderColor: '#fff',
        backgroundColor: '#eee',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 6,
    },
    userName: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#fff',
        marginTop: 6,
        letterSpacing: 0.5,
    },
    userRole: {
        fontSize: 16,
        color: '#f7f8fa',
        marginTop: 2,
    },
    infoSectionCard: {
        backgroundColor: '#fff',
        borderRadius: 18,
        marginHorizontal: 18,
        marginTop: 18,
        padding: 18,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 2,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        color: DEEPBLUE,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    infoText: {
        fontSize: 16,
        marginLeft: 15,
        color: '#222',
    },
    editProfileButton: {
        backgroundColor: PRIMARY,
        padding: 15,
        borderRadius: 10,
        margin: 24,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.12,
        shadowRadius: 6,
        elevation: 2,
    },
    editProfileButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
        letterSpacing: 0.5,
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: 'rgba(0,0,0,0.5)'
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 30,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 8,
        elevation: 5,
        width: '92%'
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 18,
        color: PRIMARY,
    },
    input: {
        width: '100%',
        height: 44,
        borderColor: '#eee',
        borderWidth: 1,
        borderRadius: 8,
        marginBottom: 14,
        paddingHorizontal: 12,
        backgroundColor: '#fafbfc',
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%'
    },
    button: {
        borderRadius: 10,
        padding: 12,
        elevation: 2,
        width: '48%'
    },
    buttonSave: {
        backgroundColor: PRIMARY,
    },
    buttonCancel: {
        backgroundColor: DEEPBLUE,
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
    }
});

// Export the component for use in other parts of the app.
export default ProfileScreen;
