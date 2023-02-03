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

  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'tokenIn',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'tokenOut',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amountIn',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amountOut',
        type: 'uint256',
      },
    ],
    name: 'Swapped',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'tokenIn',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'tokenOut',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amountIn',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amountOut',
        type: 'uint256',
      },
    ],
    name: 'SwappedWith1Inch',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'tokenIn',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'tokenOut',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amountIn',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amountOut',
        type: 'uint256',
      },
    ],
    name: 'SwappedWithParaswap',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'tokenIn',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'tokenOut',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amountIn',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amountOut',
        type: 'uint256',
      },
    ],
    name: 'SwappedWithUniswap',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'tokenIn',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'tokenOut',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amountIn',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amountOut',
        type: 'uint256',
      },
    ],
    name: 'SwappedWithZeroX',
    type: 'event',
  },
  {
    inputs: [
      { internalType: 'uint256', name: 'decimalsIn_', type: 'uint256' },
      { internalType: 'uint256', name: 'decimalsOut_', type: 'uint256' },
      { internalType: 'uint256', name: 'amount_', type: 'uint256' },
      { internalType: 'uint256', name: 'unitAmt_', type: 'uint256' },
    ],
    name: 'calculateSlippage',
    outputs: [{ internalType: 'uint256', name: 'slippage_', type: 'uint256' }],
    stateMutability: 'pure',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'uint256[]', name: 'dexs', type: 'uint256[]' },
      { internalType: 'address', name: 'tokenIn_', type: 'address' },
      { internalType: 'address', name: 'tokenOut_', type: 'address' },
      { internalType: 'uint256', name: 'amtIn_', type: 'uint256' },
      { internalType: 'uint256', name: 'unitAmt_', type: 'uint256' },
      { internalType: 'bytes', name: 'callData_', type: 'bytes' },
    ],
    name: 'swap',
    outputs: [{ internalType: 'uint256', name: 'amtOut_', type: 'uint256' }],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'tokenIn_', type: 'address' },
      { internalType: 'address', name: 'tokenOut_', type: 'address' },
      { internalType: 'uint256', name: 'amtIn_', type: 'uint256' },
      { internalType: 'uint256', name: 'unitAmt_', type: 'uint256' },
      { internalType: 'bytes', name: 'callData_', type: 'bytes' },
    ],
    name: 'swapWithOneInch',
    outputs: [
      { internalType: 'uint256', name: 'amtOut_', type: 'uint256' },
      { internalType: 'bool', name: 'success_', type: 'bool' },
    ],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'tokenIn_', type: 'address' },
      { internalType: 'address', name: 'tokenOut_', type: 'address' },
      { internalType: 'uint256', name: 'amtIn_', type: 'uint256' },
      { internalType: 'uint256', name: 'unitAmt_', type: 'uint256' },
      { internalType: 'bytes', name: 'callData_', type: 'bytes' },
    ],
    name: 'swapWithParaswap',
    outputs: [
      { internalType: 'uint256', name: 'amtOut_', type: 'uint256' },
      { internalType: 'bool', name: 'success_', type: 'bool' },
    ],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'tokenIn_', type: 'address' },
      { internalType: 'address', name: 'tokenOut_', type: 'address' },
      { internalType: 'uint256', name: 'amtIn_', type: 'uint256' },
      { internalType: 'uint256', name: 'unitAmt_', type: 'uint256' },
      { internalType: 'bytes', name: 'callData_', type: 'bytes' },
    ],
    name: 'swapWithUniswapV2',
    outputs: [
      { internalType: 'uint256', name: 'amtOut_', type: 'uint256' },
      { internalType: 'bool', name: 'success_', type: 'bool' },
    ],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'tokenIn_', type: 'address' },
      { internalType: 'address', name: 'tokenOut_', type: 'address' },
      { internalType: 'uint256', name: 'amtIn_', type: 'uint256' },
      { internalType: 'uint256', name: 'unitAmt_', type: 'uint256' },
      { internalType: 'bytes', name: 'callData_', type: 'bytes' },
    ],
    name: 'swapWithZeroX',
    outputs: [
      { internalType: 'uint256', name: 'amtOut_', type: 'uint256' },
      { internalType: 'bool', name: 'success_', type: 'bool' },
    ],
    stateMutability: 'payable',
    type: 'function',
  },
];

export const erc20Abi = [
  {
    constant: true,
    inputs: [],
    name: 'name',
    outputs: [
      {
        name: '',
        type: 'string',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {
        name: '_spender',
        type: 'address',
      },
      {
        name: '_value',
        type: 'uint256',
      },
    ],
    name: 'approve',
    outputs: [
      {
        name: '',
        type: 'bool',
      },
    ],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'totalSupply',
    outputs: [
      {
        name: '',
        type: 'uint256',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {
        name: '_from',
        type: 'address',
      },
      {
        name: '_to',
        type: 'address',
      },
      {
        name: '_value',
        type: 'uint256',
      },
    ],
    name: 'transferFrom',
    outputs: [
      {
        name: '',
        type: 'bool',
      },
    ],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'decimals',
    outputs: [
      {
        name: '',
        type: 'uint8',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [
      {
        name: '_owner',
        type: 'address',
      },
    ],
    name: 'balanceOf',
    outputs: [
      {
        name: 'balance',
        type: 'uint256',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'symbol',
    outputs: [
      {
        name: '',
        type: 'string',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {
        name: '_to',
        type: 'address',
      },
      {
        name: '_value',
        type: 'uint256',
      },
    ],
    name: 'transfer',
    outputs: [
      {
        name: '',
        type: 'bool',
      },
    ],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: true,
    inputs: [
      {
        name: '_owner',
        type: 'address',
      },
      {
        name: '_spender',
        type: 'address',
      },
    ],
    name: 'allowance',
    outputs: [
      {
        name: '',
        type: 'uint256',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    payable: true,
    stateMutability: 'payable',
    type: 'fallback',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: 'owner',
        type: 'address',
      },
      {
        indexed: true,
        name: 'spender',
        type: 'address',
      },
      {
        indexed: false,
        name: 'value',
        type: 'uint256',
      },
    ],
    name: 'Approval',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: 'from',
        type: 'address',
      },
      {
        indexed: true,
        name: 'to',
        type: 'address',
      },
      {
        indexed: false,
        name: 'value',
        type: 'uint256',
      },
    ],
    name: 'Transfer',
    type: 'event',
  },
];
