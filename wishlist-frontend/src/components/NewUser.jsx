import { useState } from "react";
import { toast } from "react-toastify";

export default function NewUser( props ) {
    const { closeModal, modalDiv } = props;
    const [ newUser, setNewUser ] = useState({
        firstName: "",
        lastName: "",
        email: "",
        userPass: ""
    });

    // set input handlers
    const handleChange = (e) => {
        const { name, value } = e.target;
        console.log(`Updating ${name}:`, value);
        setNewUser((d) => ({
            ...d,
            [name]: value,
        }));
    };

    // register new user
    const registerUser = async (e) => {
        e.preventDefault();
        console.log(newUser);
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
            <button className="close square" onClick={closeModal}><i className="fa-solid fa-xmark"></i></button>
            <h2 id="register-h1">Sign up to get started!</h2>
            <form name="registration-form" id="register" className="col" method="post" onSubmit={registerUser}>
                <h3>USER DETAILS</h3>
                <div id="register-fields">
                    <label>FIRST NAME
                        <input type="text" id="new-fname" name="firstName" placeholder="First Name" onChange={handleChange} />
                    </label>
                    <label>LAST NAME
                        <input type="text" id="new-lname" name="lastName" placeholder="Last Name" onChange={handleChange} />
                    </label>
                    <label>EMAIL
                        <input type="email" id="new-email" name="email" placeholder="valid@email.com" onChange={handleChange} />
                    </label>
                    <label>PASSWORD
                        <input type="password" id="new-pass" name="userPass" autoComplete="set password" onChange={handleChange} />
                    </label>
                </div>
                <button className="submit-btn">REGISTER</button>
            </form>        
        </div>
    );
}