const ethers = require('ethers')
const UserModel = require('../models/User')
const {PINATA_APIKEY,PINATA_SECRETKEY} = require('../config/serverConfig')
const {generateEncryptionKey} = require('../utils/generateKey')
const {encryptFile} = require('../utils/encryption')

async function uploadImageController(req,res,next){

    try {
        // console.log(req.file)
        const address = req.address;
        const userAddress = address.toLowerCase()
        const user = await UserModel.findOne({UserAddress: userAddress});
        if(!user){
            throw new Error("User does not exist");
        }
        if(user.encryptionKey===null){
            const encryptionKey = generateEncryptionKey(32);
            user.encryptionKey = encryptionKey;
            await user.save();
        }
        
        const {encryptedData, iv} = encryptFile(req.file.buffer,user.encryptionKey);
        console.log(encryptedData);

        // Use the api keys by specifying your api key and api secret
        const pinataSDK = require('@pinata/sdk');
        const pinata = new pinataSDK({ pinataApiKey: PINATA_APIKEY, pinataSecretApiKey: PINATA_SECRETKEY }); 
        const resPinata = await pinata.pinJSONToIPFS({encryptedData,iv})
        // console.log(resPinata)
    
        // const res = await pinata.testAuthentication()
        // console.log(res)
        // "message": "Congratulations! You are communicating with the Pinata API"!"

        res.status(200).json({ipfsHash:resPinata.IpfsHash , message : "Image Uploaded"})
       
    } catch (error) {
        console.error("Error in uploadImageController:", error);
        res.status(500).json({message : "Internal Server error"})
    }
    
}

module.exports = {uploadImageController}