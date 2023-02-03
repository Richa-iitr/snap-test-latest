export const multisigFactoryAbi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'module_',
        type: 'address',
      },
    ],
    name: 'Initialized',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'clone',
        type: 'address',
      },
    ],
    name: 'SafeCreated',
    type: 'event',
  },
  {
    inputs: [
      { internalType: 'address', name: '_implementation', type: 'address' },
      { internalType: 'address[]', name: 'owners', type: 'address[]' },
      { internalType: 'uint256', name: 'threshold', type: 'uint256' },
      { internalType: 'address', name: 'to', type: 'address' },
      { internalType: 'bytes', name: 'calldata_', type: 'bytes' },
      { internalType: 'address', name: 'fallbackHandler', type: 'address' },
      { internalType: 'address', name: 'paymentToken', type: 'address' },
      { internalType: 'uint256', name: 'payment', type: 'uint256' },
      {
        internalType: 'address payable',
        name: 'paymentReceiver',
        type: 'address',
      },
    ],
    name: 'createSafe',
    outputs: [{ internalType: 'address', name: 'instance', type: 'address' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
];
