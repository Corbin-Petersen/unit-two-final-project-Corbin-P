import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function NewUser( props ) {
    const { closeModal, modalDiv } = props;
    const [ matches, setMatches ] = useState(false);
    const [ retypedPass, setRetypedPass ] = useState("");
    const [ newUser, setNewUser ] = useState({
        firstName: "",
        lastName: "",
        email: "",
        userPass: ""
    });

    useEffect(() => {
        if (retypedPass === newUser.userPass) {
            setMatches(true);
        };
    }, [retypedPass]);

    // set input handlers
    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewUser((d) => ({
            ...d,
            [name]: value,
        }));
    };

    // Password match feedback
    const confirmPass = (e) => {
        const x = e.target.value;
        const y = e.target.className;
        setRetypedPass(() => x);
    };

    // cancel registration
    const cancelReg = () => {
        closeModal();
        setNewUser({
            firstName: "",
            lastName: "",
            email: "",
            userPass: ""
        })
        setRetypedPass("");
        setMatches(false);
    }

    // register new user
    const registerUser = async (e) => {
        e.preventDefault();
        if (!matches) {
            return toast.error("Password fields must match.", {theme: "colored"});
        } 
        try {
            // register API
            const response = await fetch(`http://localhost:8080/api/user/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newUser)
            });
            if (response.ok) {
                // handle successful registration
                closeModal();
                toast.success("Registration successful! You can now log in.");
            } else if (response.status === 403 ){
                // handle error response
                toast.error("Oops! Something went wrong. Please try again.");
            } else {
                // handle error response
                toast.error("Oops! That email is already registered. Please try again.");
            }
        } catch (error) {
            toast.error(error.response.data.message);
        }
    }

    return (
        <div id="new-user" className="modal col">
            <button className="close square" onClick={cancelReg}>
                <FontAwesomeIcon icon="fa-solid fa-xmark" />
            </button>
            <h2 id="register-h1">Sign up to get started!</h2>
            <form name="registration-form" id="register" className="col" method="post" onSubmit={registerUser}>
                <h3>USER DETAILS</h3>
                <div id="register-fields">
                    <label>FIRST NAME
                        <input type="text" id="new-fname" name="firstName" placeholder="First Name" value={newUser.firstName} onChange={handleChange} required />
                    </label>
                    <label>LAST NAME
                        <input type="text" id="new-lname" name="lastName" placeholder="Last Name" value={newUser.lastName} onChange={handleChange} required />
                    </label>
                    <label>EMAIL
                        <input type="email" id="new-email" name="email" placeholder="valid@email.com" value={newUser.email} onChange={handleChange} required/>
                    </label>
                    <label>PASSWORD
                        <input type="password" id="new-pass" name="userPass" placeholder="set password" value={newUser.userPass} onChange={handleChange} required />
                    </label>
                    <label>RETYPE PASSWORD
                        <input type="password" id="login-pass2" name="loginPass2" className={matches ? "match" : "no-match"} placeholder="password must match" value={retypedPass} onChange={confirmPass} required />
                    </label>
                </div>
                <button className="login-btn">REGISTER</button>
            </form>        
        </div>
    );
}