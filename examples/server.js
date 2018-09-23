var express = require('express');
var bodyParser = require('body-parser');

const { Instamojo, Config, Buyer, Transaction } = require('../');
const { InstamojoRefund, ConfigRefund, TxnRefund } = require('../index_refund');

const app = express();
app.use (bodyParser.json());
app.use (bodyParser.urlencoded({
    extended: true
}));

var instamojoConfig = new Config ({
    api_key: 'test_606409d6df72720e7e1498b053f',
    auth_token: 'test_1a129d6209e9a4392703fe4597b',
    redirect_url: 'http://localhost:3000/payment/status'
});

var txn = new Transaction ({
    amount: 100,
    purpose: 'Testing plugin',
    send_sms: true,
    send_email: true
})

var buyer = new Buyer({
    name: 'Sathyapriyan',
    email: 'nsathya1990@gmail.com',
    phone: '7358646578'
});

app.get('/', function (req, res) {
    var instamojo = new Instamojo (instamojoConfig, txn, buyer);

    console.log("inside ---> app.get()");
    instamojo.initiatePayment(function(error, response, body) {
        if(!error && response.statusCode == 201) {
            console.log("response.statusCode - 201");
            res.json(JSON.parse(body));
        }
        else if (!error) {
            console.log("!error");
            response.json(response);
        }
        else {
            console.log("else");
            response.send(error)
        }
    });
});

app.get('/payment/status', function (req, res) {
    res.send('We got it');
});

/**
 * begin refund code
 */
var instamojoConfigRefund = new ConfigRefund ({
    api_key: '3a2042ba725019601253607a5e80470e',
    auth_token: '5852e6c1365a570a01bb99c22c5f270c'
});

var txnRefund = new TxnRefund ({
    refund_amount: 100,
    body: 'Customer isn\'t satisfied with the quality',
    payment_id: "c43e03201ccc4785a61365415e5813be",
    type: 'QFL'
})

app.get('/refund', function (req, res) {
    var instamojoRefund = new InstamojoRefund (instamojoConfigRefund, txnRefund);

    console.log("inside ---> app.get(/refund)");
    instamojoRefund.initiateRefund(function(error, response, body) {
        if(!error && response.statusCode == 201) {
            console.log("response.statusCode - 201");
            res.json(JSON.parse(body));
        }
        else if (!error) {
            console.log("!error");
            res.json(response);
        }
        else {
            console.log("else");
            res.send(error)
        }
    });
});
 /**
 * end refund code
 */

app.listen('3000', function () {
    console.log('Server at 3000')
});