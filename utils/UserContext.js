import { createContext, useState } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState({
        name: 'Manish Shrestha',
        role: 'Student',
        email: 'manish@presidemtial',
        phone: '+9898989898',
        address: '123 Main St, Anytown, USA',
        enrolledYear: '2022',
        currentTrimester: '3rd',
        job: 'ASRA at xyzpal',
        profileImage: require('../src/assets/profile.png'), // Replace with a valid image path
        clubs: ['Coding Club', 'Art Club'],
        reminders: [],
        notifications: [],
    });

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
};
