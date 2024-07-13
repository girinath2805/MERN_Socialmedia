import { ChangeEvent, useState } from "react";
import useShowToast from "./UseShowToast";

const UsePreviewImg = () => {
    const { showToast } = useShowToast()
    const [imgUrl, setImgUrl] = useState<string>("");
    const [file, setFile] = useState<File | null>(null)
    
    const handleImgChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && file.type.startsWith("image/")) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImgUrl(reader.result as string);
            };
            reader.readAsDataURL(file);
            setFile(file)
        }
        else{
            showToast({
                description:"Invalid file type. Please select an image file",
                status:"error"
            })
            setImgUrl("")
            setFile(null)
        }
        console.log(imgUrl)
    };

    return { handleImgChange, imgUrl, file };
};

export default UsePreviewImg;
