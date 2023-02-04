export const batchAbi = [
  {
    anonymous: false,
    inputs: [
      { indexed: false, internalType: 'address', name: 'to_', type: 'address' },
      { indexed: false, internalType: 'bytes', name: 'data_', type: 'bytes' },
    ],
    name: 'TransactionComplete',
    type: 'event',
  },
  {
    inputs: [
      { internalType: 'address[]', name: '_address', type: 'address[]' },
      { internalType: 'bytes[]', name: '_data', type: 'bytes[]' },
    ],
    name: 'sendBatchedTransactions',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
];
