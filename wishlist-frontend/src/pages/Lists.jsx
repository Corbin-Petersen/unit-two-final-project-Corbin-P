import { Fragment, useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import NewList from "../components/NewList";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { toast } from "react-toastify";

export default function Lists( props ) {
    // pull in params and set variables
    const { userId } = useParams();
    const { userID, setUserID, userInfo, isLoggedIn, saveUserLists, getCurrentUser, setCurrentUser } = props;
    const [ isVisible, setIsVisible ] = useState(false);
    const [ hasLists, setHasLists ] = useState(true);
    const [ lists, setLists ] = useState([]);
    const [ thisModal, setThisModal ] = useState(null);
    const newListRef = useRef(0);
    
    // fetch user lists
    const getUserLists = async () => {
        try {
            const response = await fetch(`http://localhost:8080/api/${userId}/lists`, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const data = await response.json();
            if (response.status === 404) {
                throw new Error("No lists were found");
            } else if (response.status !== 404 && !response.ok) {
                throw new Error("Error fetching lists");
            }
            saveUserLists(data);
            setLists(data);
        } catch (error) {
            toast.error(error.message);
        }
    }

    useEffect(() => {
        getUserLists();
    }, []);
    useEffect(() => {
        lists.length < 1 ? setHasLists(false) : setHasLists(true);
    }, [lists]);
    useEffect(() => {
        if (!userID) {
            setUserID(userId);
        }
    }, [userID]);

    // function to delete lists
    const deleteList = async (id) => {
        // capture indexes of current list
        const listIndex = lists.findIndex((i) => i.id === id);

        try {
            const response = await fetch(`http://localhost:8080/api/${userId}/lists/${id}/delete`, {
                method: 'DELETE',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (response.status === 204) {
                // remove list from userLists state
                let updateList = (lists) => lists.filter((list, index) => index !== listIndex);
                setLists(updateList);
                saveUserLists(updateList);
                toast.success("List deleted successfully!", { theme: "colored" });
            } 
        } catch (error) {
            toast.error(error.response.data.message);
        }

        handlePopup(thisModal);
    }
    
    // functions to handle modals
    const handlePopup = (refs) => {
        setThisModal(refs);
        !isVisible ? (
            document.body.style.overflow = "hidden",
            refs.style.display = "flex",
            setTimeout(() => {
                refs.style.opacity = "1",
                refs.lastElementChild.style.transform = "translateY(0px)"
            }, 1)
        ) : (
            refs.style.opacity = "0",
            refs.lastElementChild.style.transform = "translateY(-25px)",
            document.body.style.overflow = "visible",
            setTimeout(() => {
                refs.style.display = "none";
            }, 250)
        );
        setIsVisible(!isVisible);
    }

    return (
        <div className="component col">
            <div id="list-welcome">
                {!userInfo ? (
                    <h2>Hello User!</h2>
                ) : (
                    <h2>Hello {userInfo.firstName}!</h2>
                )}
            </div>
            <div id="lists-list" className="col">
                <div id="lists-header" className="row">
                    <h3>YOUR LISTS</h3>
                    <button id="new-list-btn" className="square" title="new list" onClick={() => handlePopup(newListRef.current)}>
                        <FontAwesomeIcon icon="fa-solid fa-plus" />
                    </button>
                </div>
            {hasLists ? lists.map(list => (
                <Fragment key={list.id} >
                    <div className="list-block row" id={list.id}>
                        <Link to={`/${userId}/lists/${list.id}`} className="no-decorate row grow" >
                            <img src={list.items.length === 0 ? "/default-img.png" : list.items[0].imageUrl} className="img-small" />
                            <div className="list-block-text grow">
                                <h4>{list.name}</h4>
                                <p>{!list.items ? "0" : list.items.length} {list.items.length === 1 ? "Item" : "Items"}</p>
                            </div>
                        </Link>
                        <button className="delete-list square-bg" onClick={(e) => handlePopup(e.currentTarget.parentElement.nextElementSibling)}>
                            <FontAwesomeIcon icon="fa-solid fa-trash-can" />
                        </button>
                    </div> 
                    <div id={`delete-${list.id}`} className="modal-bg">
                        <div className="modal confirm-delete" >
                            <h3>Are you sure you want to delete this list?</h3>
                            <h4>This cannot be undone.</h4>
                            <div className="confirm-btns">
                                <button className="confirm" title="confirm delete" onClick={() => deleteList(list.id)}>CONFIRM</button>
                                <button className="cancel" title="cancel delete" onClick={(e) => handlePopup(e.currentTarget.closest(".modal-bg"))}>CANCEL</button>
                            </div>
                        </div>
                    </div>
                </Fragment>
            )) : (
                <div className="no-lists col">
                    <h4>You have no lists</h4>
                    <p>Create a list to get started!</p>
                </div>
            )}
            </div>
            <div className="modal-bg" ref={newListRef}>
                <NewList handlePopup={handlePopup} userInfo={userInfo} newListRef={newListRef} />
            </div>
        </div>
    );
}