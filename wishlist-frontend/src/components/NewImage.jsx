import { use, useEffect, useState } from "react";
import { toast } from "react-toastify";

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
        setIsLoading(true);
        setSelectedImage("");
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

    const selectImage = (image) => {
        setFormInfo((d) => ({
            ...d, 
            imageUrl: image 
        }))    
    }
    useEffect(() => {
        setSelectedImage("");
        setItemImages([]);
    }, []);
    useEffect(() => {
        if (formInfo.itemUrl !== "" && formInfo.imageUrl === "") {
            getItemImages(formInfo.itemUrl);
        }
    }, [formInfo]);
    useEffect(() => {
        if (selectedImage !== "") {
            selectImage(selectedImage);
        } 
    }, [selectedImage]);

    return (
        <div id="new-image" className="col">
            { formInfo.imageUrl === "" && itemImages.length < 1 ? (
                <img src={"/default-img.png"} className="img-new" />
            ) : isLoading ? (
                <i class="fa-solid fa-spinner fa-spin fa-2xl" />
            ) : (
            <>
                <div id="scraped-imgs" className="row">
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
                    <img src={selectedImage !== "" ? selectedImage : "/default-img.png"} className="img-new" />
                </div>
            </>
            )}
        </div>
    )
}