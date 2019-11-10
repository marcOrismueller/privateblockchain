import React from 'react';

// stateless functional style
const Transaction = ({ transaction }) => {

  const { input, outputMap } = transaction;
  const recipients = Object.keys(outputMap);

  return (
    <div className='Transaction'>
      <div>From: {`${input.address.substring(0, 15)}...`} | Balance: {input.amount}</div>
      {
        recipients.map(recipient => (
          <div key={recipient}>
            To: {`${recipient.substring(0, 15)}...`} | Sent: {outputMap[recipient]}
          </div>
        ))
      }
    </div>
  );
}

export default Transaction;
