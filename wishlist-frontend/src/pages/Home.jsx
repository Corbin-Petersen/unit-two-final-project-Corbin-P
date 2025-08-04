import { useRef, useState, useContext } from "react";
import { useNavigate } from "react-router";
import { toast } from 'react-toastify';
import Error from "../components/Error";
import NewUser from "../components/NewUser";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';

export default function Home( props ) {
    
    // set up states & variables
    const { saveUser } = props;
    const [ loginUser, setLoginUser ] = useState(null);
    const [ loginPass, setLoginPass ] = useState(null);
    const [ modalDiv, setModalDiv ] = useState(null);
    const [ isLoading, setIsLoading ] = useState(false);
    // const loginError = useRef(0);  ---------> (I don't think I need this anymore)
    const registerUser = useRef(0);
    const navigate = useNavigate();
        
    // functions to handle modal fade-in and fade-out
    const openModal = (divRef) => {
        setModalDiv(divRef);
        divRef.current.style.display = "flex";
        setTimeout(() => {
            divRef.current.style.opacity = "1";
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
    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        let response;
        let data;

        try {
            // login API
            response = await fetch(`http://localhost:8080/api/user/login`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username: loginUser, password: loginPass })
            });
            if (response.ok) {
                // handle successful login
                data = await response.json();
                saveUser(data);
                navigate(`/${data.id}/lists`);
            } else {
                // handle error response
                toast.error("Oops! Incorrect Username or Password. Please try again.", { theme: "colored" });
            }
        } catch (error) {
            toast.error(error);
        } finally {
            setIsLoading(false);
        }
    }

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
                        <input type="email" id="login-user" name="loginUser" placeholder="valid@email.com" onChange={setUser} />
                    </label>
                    <label>PASSWORD
                        <input type="password" id="login-pass" name="loginPass" autoComplete="current password" onChange={setPass} />
                    </label>
                    <button type="submit" disabled={isLoading}>
                        {isLoading ? "LOADING..." : "LOGIN"}
                    </button>
                </form>
                <div>
                    <p>Don't have an account? <span className="emphasis" style={{cursor: "pointer"}} onClick={() => openModal(registerUser)}>Sign up here!</span></p>
                </div>
                {/* ---------> (I don't think I need this anymore)
                <div id="modal-error" className="modal-bg" ref={loginError}>
                    <Error closeModal={closeModal} />
                </div> 
                */}
                <div className="modal-bg" ref={registerUser}>
                    <NewUser closeModal={closeModal} modalDiv={modalDiv} />
                </div>
            </div>
        </div>
    )
}