import { useRef, useState } from "react";
import { useParams } from "react-router";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';

export default function ShareItem( props ) {
    
    // get params, refs, states, & props
    const { userID, listID } = useParams();
    const confirmDialog = useRef(null);
    const [ confirmOpen, setConfirmOpen ] = useState(false);
    const { list, items, item, handleModal } = props;


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
                    <button id="go-to-item" className="square" title="link to item" onClick={() => window.open(item.itemUrl, '_blank')}><i className="fa-solid fa-up-right-from-square"></i></button>
                </div>
                </div>
            </div>
        </div>
    );
}