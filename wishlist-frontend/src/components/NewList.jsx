import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { toast } from "react-toastify";

export default function NewList( props ) {
    
    // destructure props, set states and variables
    const { userID } = useParams();
    const { data, handlePopup, userInfo, newListRef } = props;
    const [ formData, setFormData ] = useState({
        name: "",
        description: "",
        useClaimed: false,
        userID: userID
    });
    const navigate = useNavigate();

    // set input handlers
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((d) => ({
            ...d,
            [name]: value,
        }));
    };

    // submit new list to local storage
    const submitNewList = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:8080/api/${userID}lists`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            const data = await response.json();
            if (response.status !== 201) {
                throw new Error("Failed to create new list");
            }
            toast.success("New list created successfully!", { theme: "colored" });
            handlePopup(newListRef.current);
            navigate(`/${userID}/lists/${data.id}`);
        } catch (error) {
            console.error("Error creating new list:", error);
            toast.error("Error creating a new list: \n" + error.message, { theme: "colored" });
        }
        
    }

    return (
        <div className="modal make-new col">
            <button className="close square" onClick={() => handlePopup(newListRef.current)}><i className="fa-solid fa-xmark"></i></button>
            <div id="new-list-header">
                <h2>Create New List</h2>
            </div>
            <form name="new-list" id="new-list" className="col" method="post" onSubmit={submitNewList}>
                <label>LIST NAME
                    <input type="text" id="list-name" name="listName" onChange={handleChange} autoFocus required/>
                </label>
                <label>DESCRIPTION
                    <textarea id="list-info" name="listDesc" rows="5" onChange={handleChange} required />
                </label>
                <button className="submit-btn">SUBMIT</button>
            </form>
        </div>
    );
}