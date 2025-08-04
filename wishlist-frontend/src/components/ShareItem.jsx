import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { toast } from "react-toastify";

export default function ShareItem( props ) {
    
    // get params, refs, states, & props
    const { userID, listID } = useParams();
    const confirmDialog = useRef(null);
    const [ confirmOpen, setConfirmOpen ] = useState(false);
    const { item, handleModal, manageClaimed, claimToken, claimed, setClaimed } = props;

    useEffect(() => {
        if (item.isClaimed) setClaimed(true);
    }, [claimed]);

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