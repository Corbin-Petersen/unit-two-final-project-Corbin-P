import { use, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function NewImage ( props) {
    const { 
        list, 
        formInfo, 
        setFormInfo, 
        isLoading, 
        setIsLoading, 
        selectedImage, 
        setSelectedImage, 
        itemImages, 
        setItemImages 
    } = props;

    const getItemImages = async (url) => {
        setSelectedImage(null);
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

    const chooseImage = (image) => {
        setFormInfo((d) => ({
            ...d, 
            imageUrl: image 
        }))    
    }

    useEffect(() => {
        setItemImages(null)
    }, []);
    useEffect(() => {
        console.log(formInfo.itemUrl);
        console.log(!itemImages);
        if (formInfo.itemUrl !== "" && !itemImages) {
            getItemImages(formInfo.itemUrl);
        }
    }, [formInfo]);
    useEffect(() => {
        if (selectedImage) {
            chooseImage(selectedImage);
        } 
    }, [selectedImage]);

    return (
        <div id="new-image" >
            { formInfo.imageUrl === "" && !itemImages ? (
                isLoading ? (
                    <FontAwesomeIcon icon="fa-solid fa-gear" spin size="2xl" />
                ) : (
                    <img src="/default-img.png" className="img-new" />
                )
            ) : (
            <>
                <div id="scraped-imgs" >
                    { itemImages.map(image => (
                        <div 
                            key={itemImages.indexOf(image) + 1} 
                            className="scraped-img" 
                            style={{ backgroundImage: `url(${image})` }}
                            onClick={() => setSelectedImage(image)} 
                        />
                    ))}
                </div>
                <div className="selected-img">
                    <img src={selectedImage ? selectedImage : "/default-img.png"} className="img-new" />
                </div>
            </>
            )} 
        </div>
    )
}