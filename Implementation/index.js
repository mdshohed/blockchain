const sha256 = require("crypto-js/sha256"); 

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
}

class Transactions{
  constructor(fromAddress, toAddress, amount) {
    this.fromAddress = fromAddress; 
    this.toAddress = toAddress; 
    this.amount = amount; 
  }
}

class Blockchain {
  constructor(){
    this.chain = [this.generateGenesisBlock()];
    this.difficulty = 4; 
  }

  generateGenesisBlock() {
    return new Block('2019-01-01', "GENESIS", "0000"); 
  }
  
  getLatestBlock() {
    return this.chain[this.chain.length - 1]; 
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
    }
    return true; 
  }
}

const josscoin = new Blockchain(); 
const block1 = new Block('2019-01-01', {amount: 5} ); 

josscoin.addBlock(block1); 
console.log(josscoin);

const block2 = new Block('2019-01-02', {amount: 10} ); 
josscoin.addBlock(block2); 
console.log(josscoin);
