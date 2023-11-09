import express from "express"

const app = express();
const port = 3000;

app.use(express.static('public'));

app.get('/', function (req, res) {
    console.log("Here!");
    res.status(200).json({ ok: true, msg: "here" });
});

app.listen(port, () => {
    console.log(`Server listening on port http://localhost:${port}`);
});