import { createContext, useContext, useState } from 'react';
import { Route, Routes } from "react-router";
import { Footer, Header, Item, NavBlock, NewItem, NewList, ShareItem } from './components/exports';
import { Home, Lists, ViewList, ShareList } from './pages/exports';
import { ToastContainer } from 'react-toastify';
import presetData from './data/userData.json';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';

library.add(fas);

export const AppContext = createContext();

function App() {
  const [ loggedIn, setLoggedIn ] = useState(null);
  const [ isLoggedIn, setIsLoggedIn ] = useState(false);
  // const [ userData, setUserData ] = useState(false);
  const [ userID, setUserID ] = useState(null);
  const [ isLoading, setIsLoading ] = useState(false);
  const [ userInfo, setUserInfo ] = useState(null);
  const contextValue = {
    isLoggedIn, setIsLoggedIn,
    userData, setUserData,
    userID, setUserID,
    isLoading, setIsLoading,
    userInfo, setUserInfo
  }
  
  // send dummy data to local storage
  // const data = JSON.parse(localStorage.getItem('fakeData'));
  // !data && localStorage.setItem('fakeData', JSON.stringify(presetData));

  // fetch Users
  // const fetchLists = async () => {
  //   let lists = [];
  //   let response;
  //   let data;
  //   try {
  //     response = await fetch(`http://localhost:8080/api/${userId}/lists`);
  //     data = await response.json();
  //   } catch (error) {
  //     console.error("Error fetching users:", error);
  //     // TODO: maybe use state variable to handle error state
  //   }
  //   return users.map(user => ({
  //     userID: user.id,
  //     name: user.name,
  //     email: user.email,
  //     lists: []
  //   }));
  // }
    
  return (
    <AppContext.Provider value={contextValue}>
      <ToastContainer />
      <Header loggedIn={loggedIn} setLoggedIn={setLoggedIn} data={data} />
        <Routes>
          <Route path="/" element={
            <Home 
              userID={userID} 
              setUserID={setUserID} 
              userInfo={userInfo}
              setUserInfo={setUserInfo}
              isLoggedIn={isLoggedIn}
              setIsLoggedIn={setIsLoggedIn} />
          } />
          <Route path=":userID">
            <Route path="lists">
              <Route index element={<Lists userID={userID} userInfo={userInfo} isLoggedIn={isLoggedIn} />} />
              <Route path=":listID">
                <Route index element={<ViewList data={data} c={loggedIn} setLoggedIn={setLoggedIn} />} />
                <Route path=":itemID" element={<Item data={data} />} />
                <Route path="new" element={<NewItem />} />
              </Route>
              <Route path="new" element={<NewList data={data} />} />
            </Route>
            <Route path="shared">
              <Route path=":sharedID" element={<ShareList data={data} />} />
            </Route>
          </Route>
        </Routes>
      <Footer />
    </AppContext.Provider>
  )
}

export default App
