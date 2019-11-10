// sender: publish message on specific channels
// receiver: listen to messages on those channels
// do not have to know addresses of other nodes in the network

/*
idea is to broadcast the new chain to any subscribed node any time a new block
is added to the chain
*/
const redis = require('redis');

const CHANNELS = {
  TEST: 'TEST',
  BLOCKCHAIN: 'BLOCKCHAIN',
  TRANSACTION: 'TRANSACTION'
};

class PubSub {
  constructor({ blockchain, transactionPool, redisUrl }) {
    // this.blockchain is equal to the incoming blockchain
    this.blockchain = blockchain;
    this.transactionPool = transactionPool;


    this.publisher = redis.createClient(redisUrl);
    this.subscriber = redis.createClient(redisUrl);

    // make a generic
    this.subscribeToChannels();

    this.subscriber.on(
      'message',
     (channel, message) => this.handleMessage(channel, message)
   );
  }

  handleMessage(channel, message) {
    console.log(`Message received. Channel: ${channel}. Message: ${message}.`);

    const parseMessage = JSON.parse(message);

    switch(channel) {
      case CHANNELS.BLOKCHAIN:
        this.blockchain.replaceChain(parseMessage, true, () => {
          this.transactionPool.clearBlockchainTransactions({
            chain: parseMessage
          });
        });
        break;

      case CHANNELS.TRANSACTION:
        this.transactionPool.setTransaction(parseMessage);
        break;

      default:
        return;
    }
  }

  /*
  this.subscriber.subscribe(CHANNELS.TEST);
  this.subscriber.subscribe(CHANNELS.BLOCKCHAIN);
  replaced by following function, it is kind a loop for every added element
  */
  subscribeToChannels() {
    Object.values(CHANNELS).forEach(channel => {
      this.subscriber.subscribe(channel);
    });
  }

  publish({ channel, message }) {
    this.subscriber.unsubscribe(channel, () => {
      this.publisher.publish(channel, message, () => {
        this.subscriber.subscribe(channel);
      });
    });

  }

  broadcastChain() {
    this.publish({
      channel: CHANNELS.BLOCKCHAIN, // array, but string is required
      message: JSON.stringify(this.blockchain.chain)
    });
  }

  broadcastTransaction(transaction) {
    this.publish({
      channel: CHANNELS.TRANSACTION,
      message: JSON.stringify(transaction)
    })
  }
}

/*
const testPubSub = new PubSub();
setTimeout(() => testPubSub.publisher.publish(CHANNELS.TEST, 'hello'), 1000);
*/

module.exports = PubSub;
