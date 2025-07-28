import { createContext } from "react";

export const AppContext = createContext();

export const AppContextProvider = (props) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userData, setUserData] = useState(false);
    const [userID, setUserID] = useState(null);

    const contextValue = {
        isLoggedIn, setIsLoggedIn,
        userData, setUserData,
        userID, setUserID
    }
    
    return (
        <AppContext.Provider value={contextValue}>
            {props.children}
        </AppContext.Provider>
    );
}