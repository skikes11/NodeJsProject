const multer = require('multer');
const uuid = require('uuid').v4;

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public/images/avatar")
    },
    filename: (req, file, cb) => {

        cb(null, `avt-image-${uuid()}.jpg`);
    }
})
const uploadAvatar = multer({ storage }).single("avatar")
module.exports = {
    uploadAvatar
}