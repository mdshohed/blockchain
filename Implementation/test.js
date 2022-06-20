const { Block, Transaction, Blockchain } = require('./index'); 

const EC = require('elliptic').ec;
var ec = new EC('secp256k1');

// Generate keys
var key1 = ec.genKeyPair();
const privateKey1 = key1.getPrivate("hex");
const walletNumber1 = key1.getPublic("hex"); 

var key2 = ec.genKeyPair();
const privateKey2 = key2.getPrivate("hex");
const walletNumber2 = key2.getPublic("hex"); 

const josscoin = new Blockchain(); 

const tx1 = new Transaction(walletNumber1, walletNumber2, 100); 
tx1.signTransaction(key1);
josscoin.addTransaction(tx1);

josscoin.minePendingTransaction(walletNumber1);

const tx2 = new Transaction(walletNumber2, walletNumber1, 50); 
tx2.signTransaction(key2);
josscoin.addTransaction(tx2); 

console.log(josscoin.getBalanceOfAddress(walletNumber1));
console.log(josscoin.getBalanceOfAddress(walletNumber2));

josscoin.minePendingTransaction(walletNumber1); 
console.log(josscoin.getBalanceOfAddress(walletNumber1));
console.log(josscoin.getBalanceOfAddress(walletNumber2));

console.log(josscoin.isBlockchainValid());