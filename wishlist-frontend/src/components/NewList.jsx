import { useState } from "react";
import { useNavigate } from "react-router";

export default function NewList( props ) {
    
    // destructure props, set states and variables
    const { data, handlePopup, userInfo, newListRef } = props;
    const [ formData, setFormData ] = useState({
        listID: "",
        listName: "",
        listDesc: "",
        listItems: []
    });
    const navigate = useNavigate();

    // set input handlers
    const handleChange = (e) => {
        const { name, value } = e.target;
        // console.log(`Updating ${name}:`, value);
        setFormData((d) => ({
            ...d,
            [name]: value,
        }));
    };

    // submit new list to local storage
    const submitNewList = (e) => {
        e.preventDefault();

        // capture index of current user inside data
        const userIndex = data.findIndex((i) => i.userID === userInfo.userID);

        // add randomly-generated listID to new list
        formData.listID = `${userInfo.firstName}${Math.floor(Math.random() * 900) + 100}`;

        // add new list to the lists array inside current user
        data[userIndex].lists.push(formData);

        // push to localStorage
        localStorage.setItem('fakeData', JSON.stringify(data));

        handlePopup(newListRef);
        // navigate(formData.listID);
    }

    return (
        <div className="modal make-new col">
            <button className="close square" onClick={() => handlePopup(newListRef)}><i className="fa-solid fa-xmark"></i></button>
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