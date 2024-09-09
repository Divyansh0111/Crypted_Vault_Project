const multer = require('multer')

const storage = () => multer.memoryStorage() ; // Store the file data for memory in encryption

module.exports = {uploadUserImage:multer({storage : storage()}).single('file')};