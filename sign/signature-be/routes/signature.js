var express = require('express');
var router = express.Router();
var Web3 = require('web3');
var web3 = new Web3(process.env.RPC_URL);

router.post('/verify', function(req, res) {
  try {
    const { address, message, signedMessage } = req.body;
    let signedAddress = web3.eth.accounts.recover(message, signedMessage);
    if(signedAddress === address) {
      res.status(200).json({success: true, message: 'Verification success & Signed by '+signedAddress});
    } else {
      res.status(400).json({success: false, message: 'Not verified'});
    }
  } catch(err) {
    res.status(500).json({success: false, message: err.message});
  }
});

module.exports = router;
