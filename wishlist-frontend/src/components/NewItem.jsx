import { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import NewImage from "./NewImage";
import { toast } from "react-toastify";

export default function NewItem( props ) {
    const { userInfo, items, setItems, list, setList, closeModal, setHasItems, handleModal, newItemModal } = props;
    const [ isLoading, setIsLoading ] = useState(false);
    const [ selectedImage, setSelectedImage ] = useState(null);
    const [ itemImages, setItemImages ] = useState(null);
    const [ formInfo, setFormInfo ] = useState({
        name: "",
        cost: "",
        itemUrl: "",
        imageUrl: "",
        quantity: 1,
        listId: list.id
    });
    
    // set input handlers
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormInfo((d) => ({
            ...d,
            [name]: value,
        }));
    };
    const handleChangeNum = (e) => {
        const { name, value } = e.target;
        setFormInfo((d) => ({
            ...d,
            [name]: parseFloat(value),
        }));
    };


    const resetForm = (ref) => {
        setFormInfo({
            name: "",
            cost: 0,
            itemUrl: "",
            imageUrl: "",
            quantity: 1,
            listId: list.id
        });
        setSelectedImage("");
        setItemImages([]);
        handleModal(ref);
    }
    
    // submit new item to page
    const submitNewItem = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const response = await fetch(`http://localhost:8080/api/items/add`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formInfo)
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error("Failed to create new item");
            }
            toast.success("New item created successfully!", { theme: "colored" });
            const updatedItems = items.push(data);
            setItems(updatedItems);
        } catch (error) {
            console.error("Error creating new item:", error);
            toast.error("Failed to create new item: \n" + error.message, { theme: "colored" });
        } finally {
            setIsLoading(false);
            resetForm(newItemModal.current);
        }
    }


    return (
        <div className="modal make-new col">
            <button className="close square" onClick={() => resetForm(newItemModal.current)}>
                <FontAwesomeIcon icon="fa-solid fa-xmark" />
            </button>
            <div id="new-item-header">
                <h2>Create New Item</h2>
            </div>
            <form name="new-item" id="new-item" className="col" method="post" onSubmit={submitNewItem}>
                <label>ITEM NAME
                    <input type="text" id="item-name" name="name" value={formInfo.name} onChange={handleChange} autoFocus required/>
                </label>
                <div id="cost-count-inputs" className="row">
                    <label className="grow">COST
                        <input type="number" step="0.01" id="cost" name="cost" value={formInfo.cost} onChange={handleChangeNum} required/>
                    </label>
                    <label className="grow">QUANTITY
                        <input type="number" id="item-count" name="quantity" value={formInfo.quantity} onChange={handleChangeNum} />
                    </label>
                </div>
                <label>ITEM URL
                    <input type="url" id="item-URL" name="itemUrl" value={formInfo.itemUrl} onChange={handleChange} required/>
                </label>
                <label>IMAGE URL
                    <input type="url" id="image-URL" name="imageUrl" value={formInfo.imageUrl} placeholder="choose an image" onChange={handleChange} readOnly={selectedImage && itemImages} />
                </label>

                <NewImage formInfo={formInfo} setFormInfo={setFormInfo} isLoading={isLoading} setIsLoading={setIsLoading} selectedImage={selectedImage} setSelectedImage={setSelectedImage} itemImages={itemImages} setItemImages={setItemImages} />
                <button className="submit-btn" >SUBMIT</button>
            </form>
        </div>
    );
}