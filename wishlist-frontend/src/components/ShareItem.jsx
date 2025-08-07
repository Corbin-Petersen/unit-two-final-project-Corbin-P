import { useEffect, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { toast } from "react-toastify";

export default function ShareItem( props ) {
    
    // set states & get props
    const [ confirmOpen, setConfirmOpen ] = useState(false);
    const [ claimed, setClaimed ] = useState(null);
    const { items, item, handleModal, claimToken } = props;

    // USE EFFECT
    useEffect(() => {
        if (item.isClaimed) {
            setClaimed(true);
        } else {
            setClaimed(false);
        }
    }, [claimed]);

    // PUT - Mark item as Claimed
    const manageClaimed = async (itemId) => {
        //capture index of current item
        const itemIndex = items.findIndex((i) => i.id === itemId);

        try {
            const response = await fetch(`http://localhost:8080/api/shared/${itemId}/update`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ claimToken })
            });    
            const data = await response.json();
            if (response.status !== 200) {
                throw new Error("Unable to update item status.");
            }
            // update claimed status and saved token
            items[itemIndex].isClaimed = data.isClaimed;
            items[itemIndex].claimToken = data.claimToken;
            setClaimed(!claimed);
        } catch (error) {
            console.error(error);
            toast.error(error.message, {theme: "colored"});
        }    
    }        

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
                    <p className="needed">QUANTITY: <span className="num-needed">{item.quantity}</span></p>
                    {!claimed ? (
                            <button id="claim-item" className="claim-btn row" title="claim item" onClick={() => manageClaimed(item.id)}>
                                <FontAwesomeIcon icon="fa-solid fa-user-tag" /><span>CLAIM ITEM</span>
                            </button>
                        ) : (
                            item.claimToken === claimToken ? (
                                <button id="claim-item" className="claimed-btn row" title="claim item" onClick={() => manageClaimed(item.id)}>
                                    <FontAwesomeIcon icon="fa-solid fa-tag" /><span>CLAIMED!</span>
                                </button>
                            ) : (
                                <button id="claim-item" className="claimed-disabled row" title="claim item" onClick={() => toast.info("Sorry, this item has already been claimed by someone else.", {theme: "colored"})}>
                                    <FontAwesomeIcon icon="fa-solid fa-tag" /><span>CLAIMED!</span>
                                </button>
                            )
                        )
                    }
                    <button id="go-to-item" className="square" title="link to item" onClick={() => window.open(item.itemUrl, '_blank')}>
                        <FontAwesomeIcon icon="fa-solid fa-up-right-from-square" />
                    </button>
                </div>
                </div>
            </div>
        </div>
    );
}