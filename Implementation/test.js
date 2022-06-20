const { Block, Transaction, Blockchain } = require('./index'); 

const EC = require('elliptic').ec;
var ec = new EC('secp256k1');

// Generate keys
var key = ec.genKeyPair();
const privateKey = key.getPrivate("hex");
const walletNumber = key.getPublic("hex"); 

const josscoin = new Blockchain(); 

const tx1 = new Transaction(walletNumber, 'randomAddress', 100); 
tx1.signTransaction(key);
josscoin.addTransaction(tx1); 

josscoin.minePendingTransaction(walletNumber); 
console.log(josscoin.getBalanceOfAddress(walletNumber));

josscoin.minePendingTransaction(walletNumber); 
console.log(josscoin.getBalanceOfAddress(walletNumber));

console.log(josscoin.getBalanceOfAddress("randomAddress"));
console.log(josscoin.isBlockchainValid());