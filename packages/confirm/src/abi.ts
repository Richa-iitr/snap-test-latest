export const factoryAbi = [
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
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'module_',
        type: 'address',
      },
    ],
    name: 'moduleAdded',
    type: 'event',
  },
  {
    inputs: [
      { internalType: 'address', name: '_implementation', type: 'address' },
      { internalType: 'address[]', name: 'modules_', type: 'address[]' },
      { internalType: 'bytes4[][]', name: 'sigs_', type: 'bytes4[][]' },
    ],
    name: 'createClone',
    outputs: [{ internalType: 'address', name: 'instance', type: 'address' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
];

export const acctAbi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'new_',
        type: 'address',
      },
      { indexed: false, internalType: 'bool', name: 'enabled', type: 'bool' },
    ],
    name: 'AuthsUpdated',
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
    inputs: [],
    name: 'factory',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
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
    inputs: [
      { internalType: 'address', name: 'factory_', type: 'address' },
      { internalType: 'address', name: 'owner_', type: 'address' },
    ],
    name: 'initialize',
    outputs: [],
    stateMutability: 'nonpayable',
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
    inputs: [{ internalType: 'address', name: 'auth_', type: 'address' }],
    name: 'removeAuth',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: 'newAuth_', type: 'address' }],
    name: 'setAuth',
    outputs: [],
    stateMutability: 'nonpayable',
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
