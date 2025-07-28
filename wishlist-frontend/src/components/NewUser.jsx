import { useState } from "react";
import { toast } from "react-toastify";

export default function NewUser( props ) {
    const { closeModal } = props;
    const [ newUser, setNewUser ] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: ""
    });

    // set input handlers
    const handleChange = (e) => {
        const { name, value } = e.target;
        // console.log(`Updating ${name}:`, value);
        setFormData((d) => ({
            ...d,
            [name]: value,
        }));
    };

    // register new user
    const registerUser = async (e) => {
        e.preventDefault();

        let response;
        
        try {
            // register API
            response = await fetch(`http://localhost:8080/api/user/register`, {
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
            } else {
                // handle error response
                toast.error("Oops! That email is already registered. Please try again.");
            }
        } catch (error) {
            toast.error(error.response.data.message);
        }
    }

    return (
        <div className="modal make-new col">
            <button className="close square" onClick={closeModal}><i className="fa-solid fa-xmark"></i></button>
            <div id="">
                <h2>Sign up to get started!</h2>
            </div>
            <form name="registration-form" id="register" method="post" onSubmit={registerUser}>
                <h3>USER DETAILS</h3>
                <label>FIRST NAME
                    <input type="text" id="login-user" name="firstName" placeholder="First Name" onChange={handleChange} />
                </label>
                <label>LAST NAME
                    <input type="text" id="login-user" name="lastName" placeholder="Last Name" onChange={handleChange} />
                </label>
                <label>EMAIL
                    <input type="email" id="login-user" name="email" placeholder="valid@email.com" onChange={handleChange} />
                </label>
                <label>PASSWORD
                    <input type="password" id="login-pass" name="password" autoComplete="set password" onChange={handleChange} />
                </label>
                <button type="submit">REGISTER</button>
            </form>        
        </div>
    );
}