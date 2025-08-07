import { Fragment, useEffect, useState } from "react";
import Item from "./Item";

export default function ListItem ( props ) {
    const { items, setItems, item, handleModal, isVisible, thisItem } = props;
    const [ claimed, setClaimed ] = useState(null);

    useEffect(() => {
        if (item.isClaimed) {
            setClaimed(true);
        } else {
            setClaimed(false);
        }
    }, [claimed])

    // PUT request - Mark item as Claimed
    const manageClaimedAdmin = async (itemId) => {
        //capture index of current item
        const itemIndex = items.findIndex((i) => i.id === itemId);

        try {
            const response = await fetch(`http://localhost:8080/api/shared/${itemId}/admin`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' }
            });    
            const data = await response.json();
            if (response.status !== 200) {
                throw new Error("Unable to update item status.");
            }
            // update claimed status and saved token
            items[itemIndex].isClaimed = data.isClaimed;
            setClaimed(!claimed);
        } catch (error) {
            console.error(error);
            toast.error(error.message, {theme: "colored"});
        }    
    }        

    return (
        <Fragment key={`${item.id}`}>
            <div id={`${item.id}`} className="item col" onClick={(e) => handleModal(e.currentTarget.nextElementSibling)} style={{pointerEvents: isVisible ? "none" : "auto"}}>
                <div className="item-block-img" style={{backgroundImage: item.imageUrl == "" ? "/src/assets/default-img.png" : `url(${item.imageUrl})`}} title={item.imageUrl == "" ? "default image" : item.name}>
                    {item.isClaimed && 
                        <p className="claimed-item">CLAIMED!</p>
                    }
                </div>
                <div className="item-block-text">
                    <h4>{item.name}</h4>
                    <div className="row">
                        <p className="price">${item.cost.toFixed(2)}</p> <p className="list-need-num">QUANTITY: &nbsp;<span className="num-needed">{item.quantity}</span></p>
                    </div>
                </div>
            </div>
            <div id={`${item.id}-view`} className="modal-bg" >
                <Item items={items} setItems={setItems} item={item} handleModal={handleModal} thisItem={thisItem} claimed={claimed} setClaimed={setClaimed} manageClaimedAdmin={manageClaimedAdmin} />
            </div>
        </Fragment>
    )
}