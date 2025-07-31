import { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import NewImage from "./NewImage";

export default function NewItem( props ) {
    const { userInfo, list, closeModal, setHasItems, handleModal, newItemModal } = props;
    const [ isLoading, setIsLoading ] = useState(false);
    const [ formInfo, setFormInfo ] = useState({
        name: "",
        cost: "",
        itemUrl: "",
        imageUrl: "",
        quantity: 1,
        listId: list.id
    });
    
    // set input handlers
    const handleChange = (e) => {
        const { name, value } = e.target;
        // console.log(`Updating ${name}:`, value);
        setFormInfo((d) => ({
            ...d,
            [name]: value,
        }));
    };

    const cancelAdd = (ref) => {
        setFormData({
            name: "",
            cost: "",
            itemUrl: "",
            imageUrl: "",
            quantity: 1,
            listId: list.id
        });
        handleModal(ref);
    }
    
    // submit new item to page
    const submitNewItem = (e) => {
        e.preventDefault();

        // capture indexes of current list inside listItems array and current user inside data
        const listIndex = userInfo.lists.findIndex((i) => i.listID === userList.listID);
        const userIndex = data.findIndex((i) => i.userID === userInfo.userID);

        // add itemID to new item object
        formInfo.id = `${userList.listID}-${Math.floor(Math.random() * 900) + 100}`;

        // convert cost and quantity values from strings to numbers
        formInfo.cost = +formInfo.cost;
        formInfo.quantity = +formInfo.quantity;

        // add new item to the list inside userInfo inside data
        data[userIndex].lists[listIndex].listItems.push(formInfo);

        // update localStorage
        localStorage.setItem('fakeData', JSON.stringify(data));

        setHasItems(true);

        // reset formInfo
        setFormInfo({ itemID: "", itemName: "", itemCost: "", itemURL: "", itemImg: "/default-img.png", quantity: 1 });

        handleModal(newItemModal.current);
    }


    return (
        <div className="modal make-new col">
            <button className="close square" onClick={() => cancelAdd(newItemModal.current)}><i className="fa-solid fa-xmark"></i></button>
            <div id="new-item-header">
                <h2>Create New Item</h2>
            </div>
            <form name="new-item" id="new-item" className="col" method="post" onSubmit={submitNewItem}>
                <label>ITEM NAME
                    <input type="text" id="item-name" name="name" value={formInfo.itemName} onChange={handleChange} autoFocus required/>
                </label>
                <label>ITEM URL
                    <input type="url" id="item-URL" name="itemUrl" value={formInfo.itemURL} onChange={handleChange} required/>
                </label>
                <div id="cost-count-inputs" className="row">
                    <label className="grow">COST
                        <input type="number" step="0.01" id="cost" name="itemCost" value={formInfo.itemCost} onChange={handleChange} required/>
                    </label>
                    <label className="grow">QUANTITY
                        <input type="number" id="item-count" name="quantity" value={formInfo.quantity} onChange={handleChange} />
                    </label>
                </div>
                <div id="new-image">
                    <NewImage formInfo={formInfo} setFormInfo={setFormInfo} isLoading={isLoading} setIsLoading={setIsLoading} />
                </div>
                <button className="submit-btn" >SUBMIT</button>
            </form>
        </div>
    );
}