import { Fragment } from "react";
import Item from "./Item";

export default function ListItem ( props ) {
    const { list, setList, items, setItems, userList, item, handleModal, isVisible, thisItem, getThisList } = props;

    return (
        <Fragment key={`${item.id}`}>
            <div id={`${item.id}`} className="item col" onClick={(e) => handleModal(e.currentTarget.nextElementSibling)} style={{pointerEvents: isVisible ? "none" : "auto"}}>
                <div className="item-block-img" style={{backgroundImage: item.imageUrl == "" ? "/src/assets/default-img.png" : `url(${item.imageUrl})`}} title={item.imageUrl == "" ? "default image" : item.name}>
                {item.quantity > 1 && 
                    <p className="list-need">QUANTITY: <span className="list-need-num">{item.quantity}</span></p>
                }
                </div>
                <div className="item-block-text">
                    <h4>{item.name}</h4>
                    <p className="price">${item.cost.toFixed(2)}</p>
                </div>
            </div>
            <div id={`${item.id}-view`} className="modal-bg" >
                <Item list={list} setList={setList} items={items} setItems={setItems} userList={userList} item={item} handleModal={handleModal} thisItem={thisItem} getThisList={getThisList} />
            </div>
        </Fragment>
    )
}