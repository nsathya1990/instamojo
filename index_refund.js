const request = require("request");

/**
 * Template function for Instamojo refund
 */
function ConfigRefund(config) {
    if(typeof config.api_key !== 'undefined' ||
        typeof config.auth_token !== 'undefined' ||
        typeof config.redirect_url !== 'undefined') {
            this.api_key = config.api_key;
            this.auth_token = config.auth_token;
        }
}

/**
 * Template function for Instamojo refund transaction
 */
function RefundTransaction(txn) {
    this.refund_amount = txn.refund_amount || 0 ;
    this.body = txn.body || 'Refund';
    if (typeof txn.payment_id !== 'undefined' ||
        typeof txn.type !== 'undefined') {
            this.payment_id = txn.payment_id;
            this.type = txn.body;
    }
}

function InstamojoRefund(config, transaction) {
    this.data = {
        refund_amount: transaction.refund_amount,
        body: transaction.body,
        payment_id: transaction.payment_id,
        type: transaction.type
    }
    this.header = {
        'X-Api-Key' : config.api_key,
        'X-Auth-Token' : config.auth_token
    }
    this.config = {
        CREATE_REFUND_URL : 'https://www.instamojo.com/api/1.1/refunds/'
    }
}

InstamojoRefund.prototype.initiateRefund = function(cb) {
    console.log("this.data", this.data);
    console.log("this.header", this.header);
    request.post(this.config.CREATE_REFUND_URL, {
        form: this.data,
        headers: this.header
    },cb);
}

module.exports = {
    InstamojoRefund : InstamojoRefund,
    ConfigRefund : ConfigRefund,
    TxnRefund : RefundTransaction
}