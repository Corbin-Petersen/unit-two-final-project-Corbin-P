import { useRef, useState } from "react";
import { useNavigate } from "react-router";
import Error from "../components/Error";
import NewUser from "../components/NewUser";
import { ToastContainer, toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';

export default function Home( props ) {
    
    // set up states & variables
    const { loggedIn, setLoggedIn, data } = props;
    const [ loginUser, setLoginUser ] = useState(null);
    const [ loginPass, setLoginPass ] = useState(null);
    const [ modalDiv, setModalDiv ] = useState(null);
    const loginError = useRef(0);
    const registerUser = useRef(0);
    const navigate = useNavigate();
    
    // functions to handle modal fade-in and fade-out
    const openModal = (modalDiv) => {
        modalDiv.current.style.display = "flex";
        setTimeout(() => {
            modalDiv.current.style.opacity = "1";
        }, 1);
    }
    const closeModal = () => {
        modalDiv.current.style.opacity = "0";
        setTimeout(() => {
            modalDiv.current.style.display = "none";
        }, 250);
    }

    // get values from form
    const setUser = (e) => {
        const x = e.target.value;
        setLoginUser(x);
    }
    const setPass = (e) => {
        const x = e.target.value;
        setLoginPass(x);
    }

    // function to handle login and set user and isLoggedIn
    const handleLogin = (e) => {
        // prevent reload
        e.preventDefault();
        
        // validate submission, show error (if applicable), nav to Lists component
        let myID = "";
        let login = false; // set local false variable b/c state does not update inside functions
        for (let users of data) {
            if (loginUser == users.userName && loginPass == users.pass) {
                myID = users.userID;
                login = true;
                setLoggedIn(users.userID);
            }
        }
        login ? navigate(`${myID}/lists`) : openModal(loginError);
    }

    // useEffect(() => {
    //     setLoggedIn(clickedIn);
    // }, [clickedIn]);

    return (
        <div className="home-component">
            <div id="about-info">
                <h2>Welcome to WistLish!</h2>
                <span className="emphasis">What is WistLish?</span><br/>
                <p>WistLish is your way to easily build wish lists from items you find <i>all over</i> the interwebs! </p>
                <p>Simply create a list for anything you want - like favorite spatulas or supplies for puppy shower - and either track your list yourself, or share your list with others that might want to know what items you or your new puppy wishes for!</p>
                <p>The worldwide web is your oyster, with <span className="emphasis">WistLish</span>. </p>
            </div>
            <div id="login-info" className="col">
                <div id="login-text">
                    <h2>Login to get started!</h2>
                </div>
                <form name="login-form" id="login" method="post" onSubmit={handleLogin}>
                    <h3>LOGIN</h3>
                    <label>EMAIL
                        <input type="email" id="login-user" name="user" placeholder="valid@email.com" onChange={setUser} />
                    </label>
                    <label>PASSWORD
                        <input type="password" id="login-pass" name="password" autoComplete="current password" onChange={setPass} />
                    </label>
                    <button type="submit">LOGIN</button>
                </form>
                <div>
                    <p>Don't have an account? <span className="emphasis" onClick={() => navigate("/signup")}>Sign up here!</span></p>
                </div>
                <div id="modal-error" className="modal-bg" ref={loginError}>
                    <Error closeModal={closeModal} />
                </div>
                <div className="modal-bg" ref={registerUser}>
                    <NewUser closeModal={closeModal} />
                </div>
            </div>
        </div>
    )
}