const EC = require('elliptic').ec;
const cryptoHash = require('./crypto-hash');

// sec: standards of efficient cryptography
// p: prime 256 bits (prime number of 256 bits)
// uses a prime number to generate the curve
// k1: koblitz 1: first implementation
const ec = new EC('secp256k1');
const verifySignature = ({ publicKey, data, signature }) => {
  const keyFromPublic = ec.keyFromPublic(publicKey, 'hex');

  return keyFromPublic.verify(cryptoHash(data), signature);
};

module.exports = { ec, verifySignature, cryptoHash };
