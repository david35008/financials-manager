// require("http").createServer(function (req, res) {
//     res.end("Hello from server started by Electron app!");
// }).listen(9000)


const app = require("./app");
const port = process.env.PORT || 9000;

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));
