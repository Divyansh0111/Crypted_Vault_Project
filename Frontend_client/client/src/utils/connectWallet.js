import { ethers } from "ethers"
import contractAbi from "../constants/contractAbi.json"
import toast from "react-hot-toast"
import axios from "axios"

export const connectWallet = async() => {

    try {
        if (!window.ethereum){
            throw new error ("Metamask is not installed")
        }
    
        const accounts = await window.ethereum.request({
            method : "eth_requestAccounts"
        })
    
        const selectedAccount = accounts[0];
        
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();

        const message = "Welcome to Crypto Vault Website";
        const signature = await signer.signMessage(message)
        // console.log(signature)

        const dataSignature = {
            signature
        }

        const url = `http://localhost:3000/api/authentication?address=${selectedAccount}`
        const res = await axios.post(url,dataSignature)
        const token = res.data.token

        localStorage.setItem("token",token)

        const contractAddress = "0x7C7825162531fa43cC582F2057b030CaD433EF47"
        const contractInstance = new ethers.Contract(contractAddress,contractAbi,signer)
    
        return {contractInstance,selectedAccount}
    } catch (error) {
        toast.error("Wallet connection is ")
        console.error(error);
    }
    
}