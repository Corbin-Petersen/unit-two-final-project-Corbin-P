import { useEffect, useRef, useState, Fragment } from "react";
import { useParams } from "react-router";
import ShareItem from "./ShareItem";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';

export default function ShareList( props ) {
    // pull in params and set variables
    const { userID, sharedID } = useParams();
    const { data } = props;
    const viewItemModal = useRef(null);
    const [ isVisible, setIsVisible ] = useState(false);
    const [ hasItems, setHasItems ] = useState(true);
    const [ thisItem, setThisItem ] = useState(null);
    
    const userInfo = data.find(user => user.userID == userID);
    const listID = sharedID.slice(0, -7);
    const userList = userInfo.lists.find(list => list.listID == listID);

    useEffect(() => {
        userList.listItems.length < 1 && setHasItems(false);
    }, []);

    const hasSpace = !hasItems ? 0 : userList.listItems.length % 3;

    // function to total cost of all items
    const listCost = () => {
        let total = 0;
        userList.listItems.map(item => (
            item.quantity 
            ? total += (item.itemCost * item.quantity)
            : total += item.itemCost
        ));
        return total.toFixed(2);
    }    

    // function to handle modals
    const handleModal = (divRef) => {
        !isVisible ? (
            setThisItem(divRef), 
            divRef.style.display = "flex",
            setTimeout(() => {
                document.body.style.overflow = "hidden",
                divRef.style.opacity = "1",
                divRef.lastElementChild.style.transform = "translateY(0px)"
            }, 1)
        ) : (
            document.body.style.overflow = "visible",
            divRef.style.opacity = "0",
            divRef.lastElementChild.style.transform = "translateY(-25px)",
            setTimeout(() => {
                divRef.style.display = "none"
            }, 250)
        );
        setIsVisible(!isVisible);
    }


    return (
        <div className="component col">
            <div className="listview-header">
                <h1>{userInfo.firstName} {userInfo.lastName}'s Shared List</h1>
                <hr></hr>
                <h2>{userList.listName}</h2>
                <p>{userList.listDesc}</p>
            </div>
            <div className="listview col">
                <div className="list-totals row">
                    <span id="item-count">ITEMS: <b>{userList.listItems.length}</b></span>
                    <span id="cost-total">TOTAL: <b>${listCost()}</b></span>
                </div>
                <div className="list-display row">
                    { hasItems ? userList.listItems.map(item => (
                    <Fragment key={`${item.itemID}`}>
                        <div id={`${item.itemID}`} className="item col" onClick={(e) => handleModal(e.currentTarget.nextElementSibling)} style={{pointerEvents: isVisible ? "none" : "auto"}}>
                            <div className="item-block-img" style={{backgroundImage: item.itemImg == "" ? "/src/assets/default-img.png" : `url(${item.itemImg})`}}>
                            {item.quantity > 1 && 
                                <p className="list-need">QUANTITY: <span className="list-need-num">{item.quantity}</span></p>
                            }
                            </div>
                            <div className="item-block-text">
                                <h4>{item.itemName}</h4>
                                <p className="price">${item.itemCost}</p>
                            </div>
                        </div>
                        <div id={`${item.itemID}-view`} className="modal-bg" >
                            <ShareItem data={data} userInfo={userInfo} userList={userList} item={item} handleModal={handleModal} viewItemModal={viewItemModal} thisItem={thisItem} setThisItem={setThisItem} />
                        </div>
                    </Fragment>
                    )) : (
                        <div id="no-items" className="col">
                            <h3>This list is empty</h3>
                            <p>Add an item to get started!</p>
                        </div>
                    )}
                    { hasSpace === 2 && <div className="space2"></div> }
                    { hasSpace === 1 && <div className="space1 grow"></div> }
                </div>
            </div>
        </div>
    );
}