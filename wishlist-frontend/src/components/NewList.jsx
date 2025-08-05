import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { toast } from "react-toastify";

export default function NewList( props ) {
    
    // destructure props, set states and variables
    const { userId } = useParams();
    const { handlePopup, userInfo, newListRef } = props;
    const [ formData, setFormData ] = useState({
        name: "",
        description: "",
        useClaimed: false,
        userId: userId
    });
    const navigate = useNavigate();

    // useEffect(() => {
    //     console.log(userId);
    // }, []);

    // set input handlers
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((d) => ({
            ...d,
            [name]: value,
        }));
    };

    // clear form if modal is closed
    const cancelAdd = (ref) => {
        setFormData({
            name: "",
            description: "",
            useClaimed: false,
            userId: userId
        });
        handlePopup(ref);
    }

    // submit new list to local storage
    const submitNewList = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:8080/api/${userId}/lists/add`, {
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
            navigate(`/${userId}/lists/${data.id}`);
        } catch (error) {
            console.error("Error creating new list:", error);
            toast.error("Error creating a new list: \n" + error.message, { theme: "colored" });
        }
        
    }

    return (
        <div className="modal make-new col">
            <button className="close square" onClick={() => cancelAdd(newListRef.current)}>
                <FontAwesomeIcon icon="fa-solid fa-xmark" />
            </button>
            <div id="new-list-header">
                <h2>Create New List</h2>
            </div>
            <form name="new-list" id="new-list" className="col" method="post" onSubmit={submitNewList}>
                <label>LIST NAME
                    <input type="text" id="list-name" name="name" value={formData.name} onChange={handleChange} autoFocus required />
                </label>
                <label>DESCRIPTION
                    <textarea id="list-info" name="description" rows="5" value={formData.description} onChange={handleChange} required />
                </label>
                <button className="submit-btn">SUBMIT</button>
            </form>
        </div>
    );
}