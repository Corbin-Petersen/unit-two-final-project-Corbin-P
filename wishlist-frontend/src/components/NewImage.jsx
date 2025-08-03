import { use, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function NewImage ( props) {
    const { 
        list, 
        formInfo, setFormInfo, 
        isLoading, setIsLoading, 
        hasImages, setHasImages,
        selectedImage, setSelectedImage, 
        itemImages, setItemImages 
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
            if (data.length < 1) {
                toast.error("Unable to fetch images from item URL. \nIf you'd like to add an image to the item, please input the image URL manually.", {theme: "colored"});
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
        if (formInfo.itemUrl !== "") {
            getItemImages(formInfo.itemUrl);
        }
    }, [formInfo.itemUrl]);
    useEffect(() => {
        if (selectedImage) {
            chooseImage(selectedImage);
        } 
    }, [selectedImage]);
    useEffect(() => {
        if (itemImages) {
            if (itemImages.length > 0 || itemImages[0] !== ""){
                setHasImages(true);
            }
        }
    }, [itemImages])

    return (
        <div id="new-image" >
            { !hasImages ? (
                isLoading ? (
                    <FontAwesomeIcon icon="fa-solid fa-gear" spin size="2xl" />
                ) : (
                    <img src={formInfo.imageUrl !== "" ? formInfo.imageUrl : "/default-img.png"} className="img-new" />
                )
            ) : (
            <>
                <div id="scraped-imgs" >
                    { itemImages.map((image, index) => (
                        <div 
                            key={(index + 1)} 
                            className="scraped-img" 
                            style={{ backgroundImage: `url(${image})` }}
                            onClick={() => setSelectedImage(image)} 
                        />
                    ))}
                </div>
                <div className="selected-img">
                    <img src={selectedImage 
                        ? selectedImage 
                        : formInfo.imageUrl !== "" 
                        ? formInfo.imageUrl
                        : "/default-img.png"} className="img-new" />
                </div>
            </>
            )} 
        </div>
    )
}