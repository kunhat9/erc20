const express = require('express');
const app = express();
const port = 3000 || process.env.PORT;
const Web3 = require('web3');
const truffle_connect = require('./connection/app.js');
const bodyParser = require('body-parser');
const { report } = require('process');
const { valHooks } = require('jquery');
const { resolve } = require('path');
const { rejects } = require('assert');
const { utils } = require('aes-js');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.use('/', express.static('public_static'));

app.get('/getAccounts', (req, res) => {
  console.log("**** GET /getAccounts ****");
  truffle_connect.start(function (answer) {
    res.send(answer);
  })
});
// getALl account
app.get('/api/getAccounts', (req, res) => {
  console.log("**** GET /api/getAccounts ****");
  truffle_connect.start(function (answer) {
    res.status(200).send({
      susscess: "true",
      answer: answer
    });
  })
});
// get Account by Id
app.get('/api/getAccounts/:id', (req, res) => {
  console.log("**** GET /api/getAccounts ****");
  truffle_connect.start(function (answer) {
    res.status(200).send({
      susscess: "true",
      answer: answer[req.params.id]
    });
  })
});
// get account balance 
app.get('/api/balance/:id', (req, res) => {
  console.log("connect to web3.js");
  var web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:7545"));
  truffle_connect.start(function (answer) {
    console.log("Id parameter :" + answer[req.params.id]);
    var balance = web3.eth.getBalance(answer[req.params.id]);
    res.status(200).send({
      susscess: "true",
      answer: answer[req.params.id],
      balance: balance
    });
  })
});
// get account balance in ether
app.get('/api/transaction/number/:id', (req, res) => {
  console.log("connect to web3.js");
  var web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:7545"));
  truffle_connect.start(function (answer) {
    console.log("Id parameter :" + answer[req.params.id]);
    var transactionCount = web3.eth.getTransactionCount(answer[req.params.id]);
    res.status(200).send({
      susscess: "true",
      answer: answer[req.params.id],
      total_transaction: transactionCount
    });
  })
});
// get transaction number
app.get('/api/balance/ether/:id', (req, res) => {
  console.log("connect to web3.js");
  var web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:7545"));
  truffle_connect.start(function (answer) {
    console.log("Id parameter :" + answer[req.params.id]);

    var balance = web3.utils.fromWei(web3.eth.getBalance(answer[req.params.id]), 'ether');
    res.status(200).send({
      susscess: "true",
      answer: answer[req.params.id],
      // balance : balance
    });
  })
});
// get tx hash, gas
app.get('/api/transaction/txHash/:id', (req, res) => {
  console.log("connect to web3.js");
  var web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:7545"));
  truffle_connect.start(function (answer) {
    console.log("Id parameter :" + answer[req.params.id]);
    var transaction = web3.eth.getTransaction('0x2984dc0c1c22a7c813d66b11fb9dd3b17fc0dd6a5e7b5e5553da305f6d1e7f8b');
    // var gasPrice = web3.eth.getGasPrice(function(gas){gasPrice = gas});
    res.status(200).send({
      susscess: "true",
      answer: answer[req.params.id],
      transaction: transaction,
      from: transaction.from,
      to: transaction.to
      // gasPrice : gasPrice
    });
  })
});

// private key
app.get('/api/private_key/:id', (req, res) => {

  truffle_connect.start(async function (answer) {
    console.log("Id parameter :" + answer[req.params.id]);
    var web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:7545"));
    var b = web3.eth.getBalance(answer[req.params.id]);
    
    const balaneWei = await web3.eth.getBalance(answer[req.params.id]);

    var balance = await web3.utils.fromWei(balaneWei,'ether');
    console.log("balance "+balance);
    var accountPrivateKey = web3.eth.accounts.privateKeyToAccount("ef1ddf5bcb26fc1975dea450571193d06d62529beb62fe406d71c38cdcec6419");
    res.status(200).send({
      susscess: "true",
      answer: answer[req.params.id],
      accountPrivateKey: accountPrivateKey,
      // eth : eth
    });
  })
});


app.post('/getBalance', (req, res) => {
  console.log("**** GET /getBalance ****");
  console.log(req.body);
  let currentAcount = req.body.account;

  truffle_connect.refreshBalance(currentAcount, (answer) => {
    let account_balance = answer;
    truffle_connect.start(function (answer) {
      // get list of all accounts and send it along with the response
      let all_accounts = answer;
      response = [account_balance, all_accounts]
      res.send(response);
    });
  });
});

app.post('/sendCoin', (req, res) => {
  console.log("**** GET /sendCoin ****");
  console.log(req.body);

  let amount = req.body.amount;
  let sender = req.body.sender;
  let receiver = req.body.receiver;

  truffle_connect.sendCoin(amount, sender, receiver, (balance) => {
    res.send(balance);
  });
});

app.listen(port, () => {

  // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
  truffle_connect.web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:7545"));

  console.log("Express Listening at http://localhost:" + port);

});
