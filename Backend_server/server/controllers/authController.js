const ethers = require('ethers')
const UserModel = require('../models/User')
const jwt = require('jsonwebtoken')
const {JWT_SECRETKEY} = require('../config/serverConfig')

async function authController(req,res,next){

    try {
        const {signature} = req.body;
        const {address} = req.query

        if(!signature){
            throw new Error("Signature is invalid")
        }
        const recoveredAddress = ethers.utils.verifyMessage("Welcome to Crypto Vault Website",signature)
        if(address.toLowerCase() === recoveredAddress.toLowerCase()){
            const address = recoveredAddress.toLowerCase();
            const User = await UserModel.findOne({UserAddress:address})
            if(!User){
                const userData = await UserModel.create({UserAddress:address})
                console.log(userData)
            }
            const token = jwt.sign({
                address
            },JWT_SECRETKEY)
            res.status(200).json({message : "Authentication Successful",token})
        }else{
            res.status(400).json({message : "Authentication Failed"})
        }
        
    } catch (error) {
        console.log(error)
        res.status(500).json({message : "Internal Server Error"})
    }
    
}

module.exports = {authController}