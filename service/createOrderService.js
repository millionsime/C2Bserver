const applyFabricToken = require("./applyFabricTokenService");
const tools = require("../utils/tools");
const config = require("../config/config");
const https = require("http");
var request = require("request");

exports.createOrder = async (req, res) => {
  let title = req.body.title;
  let amount = req.body.amount;
  console.log(`Titlt: ${title} Amount: ${amount}`);
  let applyFabricTokenResult = await applyFabricToken();
  let fabricToken = applyFabricTokenResult.token;
  console.log("fabricToken =", fabricToken);
  let createOrderResult = await exports.requestCreateOrder(
    fabricToken,
    title,
    amount
  );
  console.log(createOrderResult);
  let prepayId = createOrderResult.biz_content.prepay_id;
  let rawRequest = createRawRequest(prepayId);
  console.log("Assembled URL");
  console.log(
    config.webBaseUrl + rawRequest + "&version=1.0&trade_type=Checkout"
  );
  res.send(config.webBaseUrl + rawRequest + "&version=1.0&trade_type=Checkout");
};

exports.requestCreateOrder = async (fabricToken, title, amount) => {
  return new Promise((resolve) => {
    let reqObject = createRequestObject(title, amount);
    var options = {
      method: "POST",
      url: config.baseUrl + "/payment/v1/merchant/preOrder",
      headers: {
        "Content-Type": "application/json",
        "X-APP-Key": config.fabricAppId,
        Authorization: fabricToken,
      },
      rejectUnauthorized: false, //add when working with https sites
      requestCert: false, //add when working with https sites
      agent: false, //add when working with https sites
      body: JSON.stringify(reqObject),
    };

    request(options, function (error, response) {
      console.log("Error:", error);
      if (error) throw new Error(error);
      let result = JSON.parse(response.body);
      resolve(result);
    });
  });
};

function createRequestObject(title, amount) {
  let req = {
    timestamp: tools.createTimeStamp(),
    nonce_str: tools.createNonceStr(),
    method: "payment.preorder",
    version: "1.0",
  };
  let biz = {
    notify_url: "http://197.156.68.29:5050/v2/api/order-v2/mini/payment",
    appid: config.merchantAppId,
    merch_code: config.merchantCode,
    merch_order_id: createMerchantOrderId(),
    trade_type: "Checkout",
    title: title,
    total_amount: amount,
    trans_currency: "ETB",
    timeout_express: "120m",
  };
  req.biz_content = biz;
  req.sign = tools.signRequestObject(req);
  req.sign_type = "SHA256WithRSA";
  console.log(req);
  return req;
}

function createMerchantOrderId() {
  return new Date().getTime() + "";
}

function createRawRequest(prepayId) {
  let map = {
    appid: config.merchantAppId,
    merch_code: config.merchantCode,
    nonce_str: tools.createNonceStr(),
    prepay_id: prepayId,
    timestamp: tools.createTimeStamp(),
  };
  let sign = tools.signRequestObject(map);
  // order by ascii in array
  let rawRequest = [
    "appid=" + map.appid,
    "merch_code=" + map.merch_code,
    "nonce_str=" + map.nonce_str,
    "prepay_id=" + map.prepay_id,
    "timestamp=" + map.timestamp,
    "sign=" + sign,
    "sign_type=SHA256WithRSA",
  ].join("&");
  return rawRequest;
}

// module.exports = createOrder;
