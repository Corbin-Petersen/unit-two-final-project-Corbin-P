import { useState } from 'react';
import { Route, Routes } from "react-router";
import { Footer, Header, Item, NavBlock, NewItem, NewList, ShareItem } from './components/exports';
import { Home, Lists, ViewList, ShareList } from './pages/exports';
import { ToastContainer } from 'react-toastify';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
library.add(fas);

function App() {
  const [ isLoggedIn, setIsLoggedIn ] = useState(false);
  const [ userID, setUserID ] = useState(null);
  const [ userInfo, setUserInfo ] = useState(null);
  const [ userLists, setUserLists ] = useState([]);

  // callback from Home
  const saveUser = async (x) => {
    setUserID(x.id);
    setUserInfo(x);
    setIsLoggedIn(true);
  }
  // callback from Lists
  const saveUserLists = async (x) => {
    setUserLists(x);
  }

  // FUTURE FEATURE: compare logged in user with current jwt token
  const getCurrentUser = async (currentID) => {   
    const response = await fetch(`http://localhost:8080/api/user/auth/${currentID}`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const data = await response.json();
    if (response.ok) {
      saveUser(data); 
    } 
  };
  // FUTURE FEATURE: get user info based on valid jwt token
  const setCurrentUser = async () => {
    const res = await fetch(`http://localhost:8080/api/user/profile`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const data = await res.json();
    if (res.ok) {
      setUserInfo(data);
    }
  }
    
  return (
    <>
      <ToastContainer />
      <Header userID={userID} userInfo={userInfo} isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
        <Routes>
          <Route path="/" element={<Home saveUser={saveUser} />} />
          <Route path=":userId">
            <Route path="lists">
              <Route index element={
                <Lists 
                  userID={userID}
                  setUserID={setUserID} 
                  userInfo={userInfo} 
                  saveUserLists={saveUserLists}
                />
              } />
              <Route path=":listID" element={<ViewList setUserID={setUserID} userID={userID} userInfo={userInfo} userLists={userLists} isLoggedIn={isLoggedIn} />} />
            </Route>
          </Route>
          <Route path="shared">
            <Route path=":sharedID" element={<ShareList userID={userID} userInfo={userInfo} />} />
          </Route>
        </Routes>
      <Footer />
    </>
  )
}

export default App
