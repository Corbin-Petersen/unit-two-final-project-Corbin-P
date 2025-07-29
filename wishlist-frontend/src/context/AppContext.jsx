import { createContext, useState } from "react";

export const AppContext = createContext();

export const AppContextProvider = (props) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userData, setUserData] = useState(false);
    const [userID, setUserID] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [userInfo, setUserInfo] = useState(null);

    const contextValue = {
        isLoggedIn, setIsLoggedIn,
        userData, setUserData,
        userID, setUserID,
        isLoading, setIsLoading,
        userInfo, setUserInfo
    }
    
    return (
        <AppContext.Provider value={contextValue}>
            {props.children}
        </AppContext.Provider>
    );
}