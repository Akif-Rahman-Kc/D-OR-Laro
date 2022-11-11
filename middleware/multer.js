const multer = require('multer')
const path = require('path')

const storage = multer.diskStorage({
    destination:(req,file,cb)=>{
      cb(null,'./public/img/')
      
    },
    filename:(req,file,cb)=>{
        cb(null,file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
})

const maxSize = 82428800;

exports.upload= multer({
    storage:storage,
    limits: { fileSize: maxSize }
})