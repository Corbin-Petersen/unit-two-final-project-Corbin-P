import { useEffect, useRef, useState, Fragment } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import NewItem from "../components/NewItem";
import ListItem from "../components/ListItem";
import Item from "../components/Item";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { toast } from "react-toastify";

export default function ViewList( props ) {
    // pull in params and set variables
    const { userId, listID } = useParams();
    const { setUserID, userInfo } = props;
    const newItemModal = useRef(null);
    const viewItemModal = useRef(null);
    const [ isVisible, setIsVisible ] = useState(false);
    const [ hasItems, setHasItems ] = useState(false);
    const [ thisItem, setThisItem ] = useState(null);
    const [ copied, setCopied ] = useState(false);
    const [ list, setList ] = useState(null);
    const [ items, setItems ] = useState(null);
    const [ isLoading, setIsLoading ] = useState(false);
    const navigate = useNavigate();
    
    // USE EFFECT BLOCKS
    useEffect(() => {
        setUserID(userId);
    }, [])
    useEffect(() => {
        if (!list) {
            getThisList();
        }
    }, [list]);
    useEffect(() => {
        if (items && items.length > 0) {
            setHasItems(true);
        } 
    }, [items]);
    useEffect(() => {
        setTimeout(() => {
            setCopied(false);
        }, 1000)
    }, [copied]);
        
    // Get current list from database
    const getThisList = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`http://localhost:8080/api/${userId}/lists/${listID}`, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const data = await response.json();
            if (response.status !== 200) {
                throw new Error("Failed to fetch list");
            }
            setList(data);
            setItems(data.items);
        } catch (error) {
            console.error(error.message);
            toast.error(error.message);
        }
        setIsLoading(false);
    }


    // function to check if items need extra spacers
    const hasSpace = !hasItems ? 0 : items.length % 3;

    const listTotal = () => {
        let zero = 0;
        if (!hasItems) return zero;
        let total = items.length;
        return total;
    }

    // function to total cost of all items
    const listCost = () => {
        if (hasItems) {
            let total = 0;
            items.map(item => (
                total += (item.cost * item.quantity)
            ));
            return total.toFixed(2);
        } else {
            return "0.00";
        }
    }    
    
    // function to convert list to text for simple sharing
    const saveToText = () => {
        if (hasItems) {
            let text = "";
            items.map(item => {
                text += `${item.name} - $${item.cost.toFixed(2)}: ${item.itemURL} \n \n`;
            });
            toast.success("List successfully copied as text to your clipboard!", {theme: "colored"})
            return text;
        } else {
            return "This list is empty";
        }
    }
    
    // handle copy onclick and trigger feedback thumbs up
    const confirmCopy = (e) => {
        const textList = saveToText();
        navigator.clipboard.writeText(textList);
        setCopied(true);
    }    

    const sharedID = `${listID}l${Math.floor(Math.random() * 90) + 10}u${userId}share`;


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
    

    if (!list) {
        return (
            <div className="loading col">
                <h2>Loading...</h2>
                <div className="loader"></div>
            </div>
        );
    }

    return (
        <div className="component col">
            <div className="listview-header">
                <h2>{list.name}</h2>
                <p>{list.description}</p>
            </div>
            <div className="listview col">
                <div className="list-btns row">
                    <button className="new-item-btn square" style={{pointerEvents: isVisible ? "none" : "auto"}} title="add item" onClick={() => handleModal(newItemModal.current)} >
                        <FontAwesomeIcon icon="fa-solid fa-plus" />
                    </button>
                    <button className="copy square" title="copy to clipboard" onClick={confirmCopy}>
                    { copied ? (
                        <span style={{color: '#008000'}}>
                            <FontAwesomeIcon icon="fa-solid fa-thumbs-up" />
                        </span>
                    ) : (
                        <span><FontAwesomeIcon icon="fa-solid fa-copy" /></span>
                    )}
                    </button>
                    <button className="share-list-btn square" style={{pointerEvents: isVisible ? "none" : "auto"}} title="share list" >
                        <Link to={`../../../shared/${sharedID}`} target="_blank" className="no-decorate">
                            <FontAwesomeIcon icon="fa-solid fa-share" />
                        </Link>
                    </button>
                </div>
                <div className="list-totals row">
                    <span id="item-count">ITEMS: <b>{listTotal()}</b></span>
                    <span id="cost-total">TOTAL: <b>${listCost()}</b></span>
                </div>
                <div className="list-display">
                    { hasItems ? items.map(item => (
                        <ListItem 
                            key={`${item.id}`}
                            list={list} 
                            setList={setList} 
                            items={items}
                            setItems={setItems}
                            item={item} 
                            handleModal={handleModal} 
                            isVisible={isVisible} 
                            thisItem={thisItem}
                            getThisList={getThisList}
                        />
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
                <NewItem userInfo={userInfo} items={items} setItems={setItems} list={list} setList={setList} handleModal={handleModal} setHasItems={setHasItems} newItemModal={newItemModal} />
            </div>
        </div>
    );
}