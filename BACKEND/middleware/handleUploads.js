const multer = require('multer')



const  fileStorageEngine = multer.diskStorage({ 
    destination: (req, file, callback) => {
      callback(null, './uploads')
    }, 
    filename: (req, file, cb)=>{
      cb(null, Date.now() + '--' + file.originalname)
    }
  })
  const upload = multer({storage: fileStorageEngine})

  module.exports = upload