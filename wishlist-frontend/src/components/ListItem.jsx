import Item from "./Item";

export default function ListItem ( props ) {
    const { userList, item, handleModal, isVisible, thisItem, getThisList } = props;

    return (
        <div key={`${item.id}`}>
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
                <Item userList={userList} item={item} handleModal={handleModal} thisItem={thisItem} getThisList={getThisList} />
            </div>
        </div>
    )
}