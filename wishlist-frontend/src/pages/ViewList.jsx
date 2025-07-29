import { useEffect, useRef, useState, Fragment } from "react";
import { Link, useNavigate, useParams } from "react-router";
import NewItem from "../components/NewItem";
import Item from "../components/Item";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';

export default function ViewList( props ) {
    // pull in params and set variables
    const { listID } = useParams();
    const { userInfo, userLists, isLoggedIn } = props;
    const newItemModal = useRef(null);
    const viewItemModal = useRef(null);
    const [ isVisible, setIsVisible ] = useState(false);
    const [ hasItems, setHasItems ] = useState(true);
    const [ thisItem, setThisItem ] = useState(null);
    const [ copied, setCopied ] = useState(false);
    const [ list, setList ] = useState(null);
    const navigate = useNavigate();
        
    // const userInfo = data.find(user => user.userID == userID);
    const thisList = () => {
        setList(userLists.find(list => list.id === listID));
    }
   
    useEffect(() => {
        thisList();
        list.length < 1 && setHasItems(false);
    }, []);

    // identify if list needs an added spacer
    const hasSpace = !hasItems ? 0 : list.items.length % 3;

    const sharedID = `${listID}${Math.floor(Math.random() * 90) + 10}share`;

    // function to total cost of all items
    const listCost = () => {
        let total = 0;
        list.items.map(item => (
            item.quantity 
            ? total += (item.cost * item.quantity)
            : total += item.cost
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

    // function to convert list to text for simple sharing
    const saveToText = () => {
        let text = "";
        list.items.map((item) => {
            text += `${item.name} - $${item.cost}: ${item.itemURL} \n \n`;
        });
        return text;
    }
    // variable to hold the text
    const textList = saveToText();

    // handle copy onclick and trigger feedback thumbs up
    const confirmCopy = (e) => {
        navigator.clipboard.writeText(textList);
        
        setCopied(true);
    }    
    
    useEffect(() => {
        setTimeout(() => {
            setCopied(false);
        }, 1000)
    }, [copied]);

    return (
        <div className="component col">
            <div className="listview-header">
                <h2>{list.name}</h2>
                <p>{list.description}</p>
            </div>
            <div className="listview col">
                <div className="list-btns row">
                    <button className="new-item-btn square" style={{pointerEvents: isVisible ? "none" : "auto"}} title="add item" onClick={() => handleModal(newItemModal.current)} ><i className="fa-solid fa-plus"></i></button>
                    <button className="copy square" title="copy to clipboard" onClick={confirmCopy}>
                    { copied ? (
                       <span style={{color: '#008000'}}><FontAwesomeIcon icon="fa-solid fa-thumbs-up" /></span>
                    ) : (
                       <span><FontAwesomeIcon icon="fa-solid fa-copy" /></span>
                    )}
                    </button>
                    <button className="share-list-btn square" style={{pointerEvents: isVisible ? "none" : "auto"}} title="share list" ><Link to={`../../shared/${sharedID}`} target="_blank" className="no-decorate"><i className="fa-solid fa-share"></i></Link></button>
                </div>
                <div className="list-totals row">
                    <span id="item-count">ITEMS: <b>{userList.listItems.length}</b></span>
                    <span id="cost-total">TOTAL: <b>${listCost()}</b></span>
                </div>
                <div className="list-display row">
                    { hasItems ? list.items.map(item => (
                    <Fragment key={`${item.id}`}>
                        <div id={`${item.id}`} className="item col" onClick={(e) => handleModal(e.currentTarget.nextElementSibling)} style={{pointerEvents: isVisible ? "none" : "auto"}}>
                            <div className="item-block-img" style={{backgroundImage: item.imageUrl == "" ? "/src/assets/default-img.png" : `url(${item.imageUrl})`}}>
                            {item.quantity > 1 && 
                                <p className="list-need">QUANTITY: <span className="list-need-num">{item.quantity}</span></p>
                            }
                            </div>
                            <div className="item-block-text">
                                <h4>{item.name}</h4>
                                <p className="price">${item.cost}</p>
                            </div>
                        </div>
                        <div id={`${item.id}-view`} className="modal-bg" >
                            <Item userInfo={userInfo} list={list} item={item} handleModal={handleModal} viewItemModal={viewItemModal} thisItem={thisItem} setThisItem={setThisItem} />
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
            <div className="modal-bg" ref={newItemModal}>
                <NewItem data={data} userInfo={userInfo} list={list} handleModal={handleModal} setHasItems={setHasItems} newItemModal={newItemModal} />
            </div>
        </div>
    );
}