import { useState } from "react";

export default function NewUser( props ) {
    const { closeModal } = props;
    const [ formData, setFormData ] = useState({
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
    const registerUser = (e) => {
        e.preventDefault();

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