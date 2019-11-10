const cryptoHash = require('./crypto-hash');

describe('cryptoHash()', () => {

  it('generates a SHA-256 hashed output', () => {
    expect(cryptoHash('Wang Dang Doo')).toEqual('9de0f758ff637fc4e458e1d33400ce48e028e5fbe872fab038e6cfd521dd952d');
  });

  it('produces the same hash with the same input arguments in any order', () => {
    expect(cryptoHash('one', 'two', 'three')).toEqual(cryptoHash('three', 'one', 'two'));
  });

  it('produces an unique hash when the properties have changed on an input', () => {
    const dummy = {};
    const originalHash = cryptoHash(dummy);
    dummy['a'] = 'a';

    expect(cryptoHash(dummy)).not.toEqual(originalHash);
  });

});

// f63c1812c148b61f7118bfe93985981c664b7cf746eaf48a426c3cef284d64cc
