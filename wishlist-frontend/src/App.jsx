import { useState } from 'react';
import { Route, Routes } from "react-router";
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './components/Home';
import Item from './components/Item';
import Lists from './components/Lists';
import NewItem from './components/NewItem';
import NewList from './components/NewList';
import ViewList from './components/ViewList';
import ShareList from './components/ShareList';
import presetData from './data/userData.json';
// import fontawesome icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
library.add(fas);

function App() {
  const [ loggedIn, setLoggedIn ] = useState(null);
  
  // send dummy data to local storage
  const data = JSON.parse(localStorage.getItem('fakeData'));
  !data && localStorage.setItem('fakeData', JSON.stringify(presetData));
    
  return (
    <>
      <Header loggedIn={loggedIn} setLoggedIn={setLoggedIn} data={data} />
        <Routes>
          <Route path="/" element={<Home loggedIn={loggedIn} setLoggedIn={setLoggedIn} data={data} />} />
          <Route path=":userID">
            <Route path="lists">
              <Route index element={<Lists data={data} loggedIn={loggedIn} setLoggedIn={setLoggedIn} />} />
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
    </>
  )
}

export default App
