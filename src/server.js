const encpass = require("./encpass");
const express = require("express");
const app = express();
const port = 3000;

// Parse JSON bodies (as sent by API clients)
app.use(express.json());
// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded({ extended: false }));

// Access the parse results as request.body
app.post("/encpass", function (request, response) {
  var data = request.body.data;
  var pwd = data.pwd;
  var timeStamp = data.timeStamp;
  var publicKey = data.publicKey;
  var keyId = data.keyId;

  // console.log(data, pwd, timeStamp, publicKey, keyId);
  encpass(pwd, timeStamp, publicKey, keyId).then((encrypted) => {
    response.send(`{"encrypted":"${encrypted}"}`);
  });
});

//处理其他
app.post("*", function (request, response) {
  response.send("Access denied.");
});

app.get("*", function (request, response) {
  response.send("Access denied.");
});

app.listen(port, () => {
  console.log(`encpassHttpServer listening on port ${port}`);
});
