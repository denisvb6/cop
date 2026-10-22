import { createContext, useContext, useState } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(() => {
        const profiles = JSON.parse(localStorage.getItem('profiles')) || [];

        const loggedInProfile = profiles.find((profile) => profile.isLogined === true);

        return loggedInProfile ? loggedInProfile.username : null;
    });

    return (
        <UserContext.Provider value={{ currentUser, setCurrentUser }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    return useContext(UserContext);
};