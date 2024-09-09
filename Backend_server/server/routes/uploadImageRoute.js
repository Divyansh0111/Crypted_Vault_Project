const express = require('express')
const router = express.Router()
const {uploadImageController} = require('../controllers/uploadImageController')
const {uploadUserImage} = require('../middlewares/multer')
const {authenticateToken} = require('../middlewares/authenticateToken')

router.post('/uploadImage',authenticateToken,uploadUserImage,uploadImageController)

module.exports = router