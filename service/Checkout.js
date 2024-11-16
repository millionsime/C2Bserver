const title = "add your own title here"; // Replace with your desired title
const amount = "add your own amount here"; // Replace with your desired amount

function startPay() {
  window.handleinitDataCallback = function () {
    window.location.href = window.location.origin;
  };
  if (!amount) {
    return;
  }

  window
    .fetch(baseUrl + "/create/order", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: title,
        amount: amount,
      }),
    })
    .then((res) => {
      res
        .text()
        .then((rawRequest) => {
          let obj = JSON.stringify({
            functionName: "js_fun_start_pay",
            params: {
              rawRequest: rawRequest.trim(),
              functionCallBackName: "handleinitDataCallback",
            },
          });

          if (typeof rawRequest === undefined || rawRequest === null) return;
          if (window.consumerapp === undefined || window.consumerapp === null) {
            console.log("This is not opened in app!");
            return;
          }
          window.consumerapp.evaluate(obj);
        })
        .catch((error) => {
          console.log("error occur", error);
        })
        .finally(() => {});
    });
}
