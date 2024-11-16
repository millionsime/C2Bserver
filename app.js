const express = require("express");
const bodyParser = require("body-parser");
var app = express();
const { signString } = require("./utils/tools");
const createOrder = require("./service/createOrderService");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// allow cross-origin
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Authorization,X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method"
  );
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PATCH, PUT, DELETE"
  );
  res.header("Allow", "GET, POST, PATCH, OPTIONS, PUT, DELETE");
  next();
});

app.post("/create/order", function (req, res) {
  createOrder.createOrder(req, res);
});

// start server
let serverPort = 8081;
var app = app.listen(serverPort, function () {
  console.log("server started, port:" + serverPort);
});
