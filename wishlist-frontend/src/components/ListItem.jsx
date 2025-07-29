import Item from "./Item";

export default function ListItem ( props ) {
    const { itemID, quantity, itemName, itemCost, itemImg, handleModal, isVisible } = props;

    return (
        <div key={`${itemID}`}>
            <div id={`${itemID}`} className="item col" onClick={(e) => handleModal(e.currentTarget.nextElementSibling)} style={{pointerEvents: isVisible ? "none" : "auto"}}>
                <div className="item-block-img" style={{backgroundImage: itemImg == "" ? "/src/assets/default-img.png" : `url(${itemImg})`}}>
                {quantity > 1 && 
                    <p className="list-need">QUANTITY: <span className="list-need-num">{quantity}</span></p>
                }
                </div>
                <div className="item-block-text">
                    <h4>{itemName}</h4>
                    <p className="price">${itemCost}</p>
                </div>
            </div>
            <div id={`${itemID}-view`} className="modal-bg" >
                <Item data={data} userInfo={userInfo} userList={userList} item={item} handleModal={handleModal} viewItemModal={viewItemModal} thisItem={thisItem} setThisItem={setThisItem} />
            </div>
        </div>
    )
}