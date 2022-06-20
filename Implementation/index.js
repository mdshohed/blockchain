const sha256 = require("crypto-js/sha256"); 
const EC = require('elliptic').ec;
var ec = new EC('secp256k1');

class Block{
  constructor(timestamp, transactions, previousHash = ""){
    this.timestamp = timestamp; 
    this.transactions = transactions; 
    this.previousHash = previousHash;
    this.hash = this.calculateHash(); 
    this.nonce = 0; 
  }

  mineBlock(difficulty) {
    while(
      this.hash.substring(0,difficulty)!==Array(difficulty+1).join("0")
    ) {
      this.nonce++; 
      this.hash = this.calculateHash(); 
    }
    console.log("Mining done: " + this.hash); 
  }

  calculateHash(){
    return sha256(
      this.timestamp + 
      JSON.stringify(this.transactions) + 
      this.previousHash + 
      this.nonce
    ).toString(); 
  }

  hasValidTransactions() {
    for (const tx of this.transactions) {
      if( !tx.isValid()){
        return false; 
      }
    }
    return true; 
  }
}

class Transaction{
  constructor(fromAddress, toAddress, amount) {
    this.fromAddress = fromAddress; 
    this.toAddress = toAddress; 
    this.amount = amount; 
  }

  calculateHash() {
    return sha256(this.fromAddress + this.toAddress + this.amount).toString(); 
  }

  signTransaction(key) {
    if(key.getPublic('hex') !== this.fromAddress) {
      throw new Error('You do not have access'); 
    }
    const hashTx = this.calculateHash();
    const signature = key.sign(hashTx, 'base64'); 
    this.signature = signature.toDER(); 
  }

  isValid() {
    if(this.fromAddress === null) true; 
    if( !this.signature || this.signature.length === 0) {
      throw new Error('No signature found'); 
    }
    const key = ec.keyFromPublic(this.fromAddress, 'hex'); 
    return key.verify(this.calculateHash(), this.signature);
  }
}

class Blockchain {
  constructor(){
    this.chain = [this.generateGenesisBlock()];
    this.difficulty = 4; 

    this.pendingTransactions = []; 
    this.miningReward = 10;
  }

  generateGenesisBlock() {
    return new Block('2019-01-01', "GENESIS", "0000"); 
  }
  
  getLatestBlock() {
    return this.chain[this.chain.length - 1]; 
  }

  createTransaction(transaction) {
    this.pendingTransactions.push(transaction); 
  }

  addTransaction(transaction){

    if( !transaction.fromAddress || !transaction.toAddress) {
      throw new Error('Cannot process transaction'); 
    }

    if( !transaction.isValid()) {
      throw new Error('Invalid transaction'); 
    }

    if(transaction.amount < 0) {
      throw new Error("Invalid transaction amount"); 
    }
    // if(transaction.amount > this.getBalanceOfAddress(transaction.fromAddress)){
    //   throw new Error("Not enough balance"); 
    // }

    this.pendingTransactions.push(transaction); 
  }

  minePendingTransaction(minerAddress) {
    let block = new Block(Date.now(), this.pendingTransactions); 
    block.mineBlock(this.difficulty); 
    this.chain.push(block); 
    this.pendingTransactions = [
      new Transaction(null, minerAddress, this.miningReward)
    ]; 
    
  }

  addBlock(newBlock){
    newBlock.previousHash = this.getLatestBlock().hash; 
    newBlock.mineBlock(this.difficulty); 
    this.chain.push(newBlock); 
  }

  isBlockchainValid() {
    for(let i = 1; i<this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i-1]; 
      if(currentBlock.hash!==currentBlock.calculateHash()){
        return false; 
      }
      if( currentBlock.previousHash !== previousBlock.hash) {
        return false; 
      }
      if(!currentBlock.hasValidTransactions()){
        return false; 
      }
    }
    return true; 
  }

  getBalanceOfAddress(address) {
    let balance = 0;
    for (const  block of this.chain) {
      for (const trans of block.transactions) {
        
        if(trans.fromAddress === address) {
          balance -= trans.amount; 
        }
        if( trans.toAddress === address) {
          balance += trans.amount; 
        }
      }
    }
    return balance; 
  }
}

module.exports = {
  Block, 
  Transaction, 
  Blockchain
}