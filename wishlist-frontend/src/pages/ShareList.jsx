import { useEffect, useRef, useState, Fragment } from "react";
import { useParams } from "react-router";
import ShareItem from "../components/ShareItem";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { toast } from "react-toastify";

export default function ShareList( props ) {
    // pull in params and set variables
    const { sharedID } = useParams();
    const viewItemModal = useRef(null);
    const [ isVisible, setIsVisible ] = useState(false);
    const [ hasItems, setHasItems ] = useState(false);
    const [ thisItem, setThisItem ] = useState(null);
    const [ list, setList ] = useState(null);
    const [ items, setItems ] = useState(null);
    const [ isLoading, setIsLoading ] = useState(false);
    const [ userInfo, setUserInfo] = useState(null);

    
    const listID = sharedID.slice(0, sharedID.indexOf("l"));
    const userID = sharedID.slice(sharedID.indexOf("u") + 1, sharedID.indexOf("s"));

    console.log(listID);
    console.log(userID);

    // Get current list from database
    const getSharedList = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`http://localhost:8080/api/shared/list/${listID}info`, {
                method: 'GET',
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
        } finally {
            setIsLoading(false);
        }
    }

    // get list owner's name for display
    const getUser = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`http://localhost:8080/api/shared/user/${userID}info`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const data = await response.json();
            if (response.status !== 200) {
                throw new Error("Failed to fetch list owner");
            }
            setUserInfo(data);
        } catch (error) {
            console.error(error.message);
            toast.error(error.message, {theme: "colored"});
        } finally {
            setIsLoading(false);
        }
    }
    

    useEffect(() => {
        if (!userInfo)
        getUser();
    }, [userInfo]);
    useEffect(() => {
        if (!list)
        getThisList();
    }, [list]);
    useEffect(() => {
        if (items && items.length > 0) {
            setHasItems(true);
        } 
    }, [items]);

    const hasSpace = !hasItems ? 0 : items.length % 3;

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

    // display total number of items, if items exist
    const listTotal = () => {
        let zero = 0;
        if (!hasItems) return zero;
        let total = items.length;
        return total;
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
                {isLoading ? (
                    <h1><FontAwesomeIcon icon="fa-solid fa-gear" spin size="2xl" /> loading list information</h1>
                ) : (
                    userInfo && list ? (
                        <>
                            <h1>{userInfo.firstName} {userInfo.lastName}'s Shared List</h1>
                            <hr></hr>
                            <h2>{list.name}</h2>
                            <p>{list.description}</p>
                        </>
                    ) : (
                        <h1>List information not found</h1>
                    )
                )}
            </div>
            <div className="listview col">
                <div className="list-totals row">
                    <span id="item-count">ITEMS: <b>{listTotal()}</b></span>
                    <span id="cost-total">TOTAL: <b>${listCost()}</b></span>
                </div>
                <div className="list-display row">
                    { hasItems ? items.map(item => (
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
                            <ShareItem list={list} items={items} item={item} handleModal={handleModal} thisItem={thisItem} getThisList={getThisList} />
                        </div>
                    </Fragment>
                    )) : (
                        <div id="no-items" className="col">
                            <h3>There are no items currently in this list.</h3>
                            <p>Check back again later to see new items!</p>
                        </div>
                    )}
                    { hasSpace === 2 && <div className="space2"></div> }
                    { hasSpace === 1 && <div className="space1 grow"></div> }
                </div>
            </div>
        </div>
    );
}