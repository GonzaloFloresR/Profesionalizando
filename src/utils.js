const multer = require("multer");
const crypto = require("crypto");

const storage = multer.diskStorage({
    destination:(request, file, cb) => {
        cb(null, __dirname+'/public/img');
    },
    filename:(request, file, cb) => {
        cb(null, file.originalname);
    }
});

const SECRET = "CoderCoder123";
const generaHash = password => crypto.createHmac("sha256", SECRET).update(password).digest("hex");

const uploader = multer({storage: storage});

module.exports = {uploader, generaHash};