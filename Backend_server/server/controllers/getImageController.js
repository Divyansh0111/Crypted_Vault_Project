const axios = require('axios')
const UserModel = require('../models/User')
const {decryptData} = require('../utils/decryption')
const PINATA_GATEWAY_URL = "https://gateway.pinata.cloud/ipfs/"

async function returnIpfsResponse(ipfsHash){
    const res = await axios(`${PINATA_GATEWAY_URL}${ipfsHash}`)
    return res.data
}

async function getImageController(req,res,next){

    try {
        const address = req.address;
        const userAddress = address.toLowerCase()
        const user = await UserModel.findOne({UserAddress: userAddress});

        if(!user){
            throw new Error("User does not exist");
        }

        const {page,limit} = req.query;
        // console.log(page,limit)
        const pageNumber = parseInt(page) || 1;
        const limitNumber = parseInt(limit) || 1;
        // console.log(pageNumber,limitNumber)

        if(pageNumber<1 || limitNumber<1){
            throw new Error("Pagination Issue");
        }      

        const startIndex = (pageNumber - 1) * limitNumber;
        const endIndex = pageNumber * limitNumber;

        const ipfsHashArray = req.body.slice(startIndex,Math.min(req.body.length,endIndex))
        // console.log(ipfsHashArray)
        const decryptedImageArr = []

        if(ipfsHashArray.length!==0){
            const encryptedDataArr = await Promise.all(ipfsHashArray.map(async(ipfsHash)=>{
                const res = await returnIpfsResponse(ipfsHash)
                return res
            }))

            for(const img of encryptedDataArr){
                const decryptedImgData = decryptData(img.encryptedData,img.iv,user.encryptionKey)
                decryptedImageArr.push(decryptedImgData.toString('base64'))
            }
        }
        console.log(decryptedImageArr)
  
        res.status(200).json({message : "Image sent",decryptedImageArr})
       
    } catch (error) {
        console.error("Error in uploadImageController:", error);
        res.status(500).json({message : "Internal Server error"})
    }
    
}

module.exports = {getImageController}