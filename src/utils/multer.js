import path from 'path';
import multer from 'multer';
import __dirname from '../utils.js';

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(`${__dirname}/public/uploads/${folderName}`));
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`);
    }, 
    onError: function (err, next) {
        next();
    }
})

const uploader = (folderName) => {
    return multer({
        storage : multer.diskStorage({
            destination: function (req, file, cb) {
                cb(null, path.join(`${__dirname}/public/uploads/${folderName}`));
            },
            filename: function (req, file, cb) {
                cb(null, `${Date.now()}-${file.originalname}`);
            }, 
        }),
        onError: function (err, next) {
                next();
        }
    })
}

export default uploader;