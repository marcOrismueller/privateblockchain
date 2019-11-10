const crypto = require('crypto');
// const hexToBinary = require('hex-to-binary');

const cryptoHash = (...inputs) => {
  const hash = crypto.createHash('sha256');

  // just turns all internal items into their stringified form
  hash.update(inputs.map(input => JSON.stringify(input)).sort().join(' '));
  return hash.digest('hex');
};

module.exports = cryptoHash;
