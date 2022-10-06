const client = require("./client");

const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const multer = require('multer');
const upload = multer();



const app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


//router.post('/upload', upload.array("file", 10), FileInfo.upload);
app.post("/upload", upload.single('file'), (req, res) => {
    const dataSend = {
        tid: req.headers.tid,
        uid: req.headers.uid,
        fileName: req.file.originalname,
        fileContent: req.file.buffer.toString('utf8'),
        folderName: req.headers.foldername,
        folderID: req.headers.folderid,
    };

    client.insert(dataSend, (err, data) => {
        if (err){
            res.json( { "message": err});
            return;
        } 
        res.json({"Status" : data})
    });
});

app.get("/userdata", (req, res) => {
    const dataSend = {
        tid: req.headers.tid,
        uid: req.headers.uid
    };


    client.getAll(dataSend, (err, data) => {
        if (err) {
            res.json( { "message": err});
            return;
        }
        res.json({"Data" : data})
    });
});


app.get("/folderview", (req, res) => {
    const dataSend = {
        tid: req.headers.tid,
        uid: req.headers.uid,
        fldrid: req.headers.fldrid,
    };


    client.get(dataSend, (err, data) => {
        if (err) {
            res.json( { "message": err});
            return;
        }
        res.json({"Data" : data})
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log("Server running at port %d", PORT);
});
