import { useRef, useState } from "react";
import { useParams } from "react-router";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { toast } from "react-toastify";

export default function Item( props ) {
    
    // get params, refs, states, & props
    const confirmDialog = useRef(null);
    const [ confirmOpen, setConfirmOpen ] = useState(false);
    const { list, setList, items, setItems, item, handleModal, thisItem, getThisList } = props;

    // function to handle confirm popup
    const handleConfirm = () => {
        console.log(list);
        !confirmOpen ? (
            confirmDialog.current.style.display = "flex",
            setTimeout(() => {
                confirmDialog.current.style.opacity = "1",
                confirmDialog.current.style.transform = "scale(1)"
            }, 1)
        ) : (
            confirmDialog.current.style.opacity = "0",
            confirmDialog.current.style.transform = "scale(.9)",
            setTimeout(() => {
                confirmDialog.current.style.display = "none"
            }, 250)
        );
        setConfirmOpen(!confirmOpen);
    }

    // function to delete item
    const deleteItem = async (itemId) => {
        //capture index of current item
        const itemIndex = items.findIndex((i) => i.id === itemId);

        try {
            const response = await fetch(`http://localhost:8080/api/items/${itemId}/delete`, {
                method: 'DELETE',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (response.status !== 204) {
                throw new Error("Failed to delete item");
            }
            let refreshList = items.splice(itemIndex, 1);
            setList(refreshList);
            toast.success("Item deleted successfully");
        } catch (error) {
            console.error(error.message);
            toast.error(error.message);
        }
        handleConfirm();
        handleModal(thisItem);
    }
        
        // // capture indexes of current item, listItems, and userInfo
        // const itemIndex = userList.listItems.findIndex((i) => i.itemID === item.itemID);
        // const listIndex = userInfo.lists.findIndex((i) => i.listID === userList.listID);
        // const userIndex = data.findIndex((i) => i.userID === userInfo.userID);

        // // remove item from userList inside userInfo inside data
        // data[userIndex].lists[listIndex].listItems.splice(itemIndex, 1);

        // // update localStorage
        // localStorage.setItem('fakeData', JSON.stringify(data));

    

    return (
        <div id="view-item" className="modal col" >
            <button className="close square" onClick={(e) => handleModal(e.currentTarget.closest(".modal-bg"))}><i className="fa-solid fa-xmark"></i></button>
            <div id="item-container" className="col" style={{pointerEvents: confirmOpen ? "none" : "auto"}}>
                <div id="item-img">
                    <img src={item.imageUrl == "" ? "/default-img.png" : item.imageUrl} className="img-reg" alt={`${item.name}`} />
                </div>
                <div id="item-details">
                    <h2>{item.name}</h2>
                    <h3 className="price">${item.cost}</h3><br/>
                <div id="item-btns" className="row">
                    {item.quantity > 1 && 
                        <p className="needed">QUANTITY: <span className="num-needed">{item.quantity}</span></p>
                    }
                    <button id="delete-item-btn" className="delete-item square" title="delete item" onClick={handleConfirm}><i className="fa-solid fa-trash-can"></i></button>
                    <button id="go-to-item" className="square" title="link to item" onClick={() => window.open(item.itemUrl, '_blank')}><i className="fa-solid fa-up-right-from-square"></i></button>
                </div>
                </div>
            </div>
            <div className="confirm-it" ref={confirmDialog}>
                <h2>Are you sure you want to delete this?</h2>
                <div className="confirm-btns">
                    <button className="confirm" title="confirm delete" onClick={() => deleteItem(item.id)}>CONFIRM</button>
                    <button className="cancel" title="cancel delete" onClick={handleConfirm}>CANCEL</button>
                </div>
            </div>
        </div>
    );
}