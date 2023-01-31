export const createAbi = [
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
    name: 'cloneCreated',
    type: 'event',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_implementation',
        type: 'address',
      },
    ],
    name: 'createClone',
    outputs: [
      {
        internalType: 'address',
        name: 'instance',
        type: 'address',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
];

export const acctAbi = [
  { inputs: [], stateMutability: 'nonpayable', type: 'constructor' },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'module_',
        type: 'address',
      },
      { indexed: false, internalType: 'bytes4', name: 'sig_', type: 'bytes4' },
    ],
    name: 'ModuleAdded',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'module_',
        type: 'address',
      },
      { indexed: false, internalType: 'bytes4', name: 'sig_', type: 'bytes4' },
    ],
    name: 'ModuleUpdated',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'new_',
        type: 'address',
      },
    ],
    name: 'OwnerUpdated',
    type: 'event',
  },
  { stateMutability: 'payable', type: 'fallback' },
  {
    inputs: [
      { internalType: 'address', name: 'to_', type: 'address' },
      { internalType: 'bytes', name: 'data_', type: 'bytes' },
    ],
    name: '_delegateCall',
    outputs: [{ internalType: 'bool', name: 'success', type: 'bool' }],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'bytes4[]', name: 'sig_', type: 'bytes4[]' },
      { internalType: 'address', name: 'module_', type: 'address' },
    ],
    name: 'addModule',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'bytes4', name: 'sig_', type: 'bytes4' }],
    name: 'getModule',
    outputs: [{ internalType: 'address', name: 'module_', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'owner',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: 'newOwner_', type: 'address' }],
    name: 'setOwner',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'bytes4', name: 'sig_', type: 'bytes4' },
      { internalType: 'address', name: 'module_', type: 'address' },
    ],
    name: 'updateModule',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address[]', name: 'contracts_', type: 'address[]' },
      { internalType: 'uint256[]', name: 'durations_', type: 'uint256[]' },
    ],
    name: 'whitelistContracts',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  { stateMutability: 'payable', type: 'receive' },
];
