import { useRef, useState } from "react";
import { useParams } from "react-router";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';

export default function Item( props ) {
    
    // get params, refs, states, & props
    const { userID, listID } = useParams();
    const confirmDialog = useRef(null);
    const [ confirmOpen, setConfirmOpen ] = useState(false);
    const { data, userInfo, userList, item, handleModal, thisItem, setThisItem } = props;

    // function to handle confirm popup
    const handleConfirm = () => {
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
    const deleteItem = () => {
        
        // capture indexes of current item, listItems, and userInfo
        const itemIndex = userList.listItems.findIndex((i) => i.itemID === item.itemID);
        const listIndex = userInfo.lists.findIndex((i) => i.listID === userList.listID);
        const userIndex = data.findIndex((i) => i.userID === userInfo.userID);

        // remove item from userList inside userInfo inside data
        data[userIndex].lists[listIndex].listItems.splice(itemIndex, 1);

        // update localStorage
        localStorage.setItem('fakeData', JSON.stringify(data));

        handleConfirm();
        handleModal(thisItem);
    }

    return (
        <div id="view-item" className="modal col" >
            <button className="close square" onClick={(e) => handleModal(e.currentTarget.closest(".modal-bg"))}><i className="fa-solid fa-xmark"></i></button>
            <div id="item-container" className="col" style={{pointerEvents: confirmOpen ? "none" : "auto"}}>
                <div id="item-img">
                    <img src={item.itemImg == "" ? "/default-img.png" : item.itemImg} className="img-reg" alt={`${item.itemName}`} />
                </div>
                <div id="item-details">
                    <h2>{item.itemName}</h2>
                    <h3 className="price">${item.itemCost}</h3><br/>
                <div id="item-btns" className="row">
                    {item.quantity > 1 && 
                        <p className="needed">QUANTITY: <span className="num-needed">{item.quantity}</span></p>
                    }
                    <button id="delete-item-btn" className="delete-item square" title="delete item" onClick={handleConfirm}><i className="fa-solid fa-trash-can"></i></button>
                    <button id="go-to-item" className="square" title="link to item" onClick={() => window.open(item.itemURL, '_blank')}><i className="fa-solid fa-up-right-from-square"></i></button>
                </div>
                </div>
            </div>
            <div className="confirm-it" ref={confirmDialog}>
                <h2>Are you sure you want to delete this?</h2>
                <div className="confirm-btns">
                    <button className="confirm" title="confirm delete" onClick={deleteItem}>CONFIRM</button>
                    <button className="cancel" title="cancel delete" onClick={handleConfirm}>CANCEL</button>
                </div>
            </div>
        </div>
    );
}