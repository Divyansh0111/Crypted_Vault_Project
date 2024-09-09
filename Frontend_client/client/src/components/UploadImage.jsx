import axios from "axios";
import { useState } from "react";
import { useWeb3Context } from "../contexts/useWeb3Context";
import toast from "react-hot-toast";
import {ImageUp} from "lucide-react"

const UploadImage = ({reloadEffect}) => {

    const [file,setFile] = useState(null);
    const {web3State} = useWeb3Context();
    const {selectedAccount,contractInstance} = web3State;
    const [loading,setLoading]= useState(false);

    const uploadImageHash = async (ipfsHash) =>{
        // Check if contractInstance and selectedAccount are defined
        if (!contractInstance || !selectedAccount) {
           toast.error("Web3 is not properly initialized. Please reconnect your wallet.");
           return;
        }

        // const tx = await contractInstance.uploadFile(selectedAccount,ipfsHash)
        try {
            await toast.promise(contractInstance.uploadFile(selectedAccount, ipfsHash), {
              loading: "Transaction is Pending",
              success: "Transaction is Successful",
              error: "Transaction Failed",
            });
          } catch (error) {
            console.error("Error uploading file to the blockchain:", error);
            toast.error("Transaction Failed");
          }
    }    
 
    const handleImageUpload = async() =>{
        try {
            setLoading(true)
            const formData = new FormData()
            formData.append("file",file)

            const url = 'http://localhost:3000/api/uploadImage'
            const token = localStorage.getItem("token")
            
            const config={
              headers:{
                "x-access-token":token
              },
            };

            // Use toast.promise correctly
            const res = await toast.promise(
                axios.post(url, formData, config),{
                    loading: "Uploading Image...",
                    success: "Image Uploaded Successfully!",
                    error: "Image Upload Failed"
                }
            );

            // const res = await axios.post(url,formData,config);
            // toast.success("Image Uploaded")
            await uploadImageHash(res.data.ipfsHash)  
            setLoading(false)       
            reloadEffect()   
        } catch (error) {
            console.error(error)
            toast.error("Image Upload Failed")            
        }finally{
            setLoading(false)
        }    
    }

    // const handleImageUpload = async() =>{
    //     try {
    //         const formData = new FormData()
    //         formData.append("file",file)

    //         const url = 'http://localhost:3000/api/uploadImage'
    //         //const res = await axios.post(url,formData)
    //         await toast.promise(axios.post(url,formData),{
    //             loading : "Image is uploading",
    //             success : async(res)=>{
    //                 await uploadImageHash(res.data.ipfsHash)  
    //                 return "Image upload Successful"
    //             },
    //             error : "Image uplaod Failed"
    //         })
    //         //toast.success("Image Uploaded")
                      
    //     } catch (error) {
    //         console.error(error)
    //         toast.error("Image Upload Failed")            
    //     }        
    // }

    //console.log(file)

    return ( 
        
        <div className="h-full w-screen flex flex-col justify-center items-center gap-6">
        <p className="font-semibold md:text-[24px]">
           Upload file with Web3s Security
        </p>
         <div className="w-full flex justify-center items-center">
        <input
           type="file"
           accept=".jpg, .jpeg, .png"
           onChange={(e) => setFile(e.target.files[0])}
           className="w-[200px] md:w-[210px]"
        />
        </div>
        {file ? (
            <button
            onClick={handleImageUpload}
            disabled={loading}
            className="border-sky-400 border-dotted p-2 border-2 rounded-md flex flex-col justify-center items-center hover:bg-sky-200"
        >
        <ImageUp />
        {loading ? "Uploading..." : "Upload"}
      </button>
    ) : (
      <p className="text-[20px] font-semibold text-red-500">
        Choose a File To Upload
      </p>
    )}

    <br />
  </div>    );
}
 
export default UploadImage;


    {/* <>
      <input type="file" onChange={(e)=>setFile(e.target.files[0])} disabled ={loading}></input>
      <button onClick={handleImageUpload} disabled ={loading || !file}>Upload Image</button>
    </>  */}   