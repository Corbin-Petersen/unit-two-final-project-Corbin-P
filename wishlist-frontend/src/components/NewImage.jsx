import { use, useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function NewImage ( props) {
    const { list, formInfo, setFormInfo, isLoading, setIsLoading } = props;
    const [ itemImages, setItemImages ] = useState([]);

    const getItemImages = async (url) => {
        setIsLoading(true);
        try {
            const response = await fetch(`http://localhost:8080/api/items/scrape-img?url=${url}`, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error("Failed to fetch item images");
            }
            setItemImages(data);
        } catch (error) {
            console.error("Error fetching item images:", error);
            toast.error("Failed to fetch item images: \n" + error.message, { theme: "colored" });
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        if (formInfo.itemUrl !== "") {
            getItemImages(formInfo.itemUrl);
        }
    }, [formInfo]);

    return (
        <div id="new-image" className="row">
            { itemImages.length < 1 ? (
                <img src={formInfo.imageUrl == "" ? "/default-img.png" : formInfo.itemImg} className="img-new" />
            ) : isLoading ? (
                <i class="fa-solid fa-spinner fa-spin fa-2xl" />
            ) : itemImages.map(image => (
                <div 
                    key={itemImages.indexOf(image) + 1} 
                    className="img-small" 
                    style={{ backgroundImage: `url(${image})` }}
                    onClick={() => {
                        setFormInfo((d) => ({
                            ...d, 
                            imageUrl: image 
                        })) 
                    }} 
                />
            ))}
        </div>
    )
}