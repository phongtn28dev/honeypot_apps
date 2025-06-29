export const BGTMarketABI = [
  { type: 'constructor', inputs: [], stateMutability: 'nonpayable' },
  {
    type: 'function',
    name: 'BASE_RATIO',
    inputs: [],
    outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'MIN_AMOUNT',
    inputs: [],
    outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'UPGRADE_INTERFACE_VERSION',
    inputs: [],
    outputs: [{ name: '', type: 'string', internalType: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'bgt',
    inputs: [],
    outputs: [{ name: '', type: 'address', internalType: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'bgtOrders',
    inputs: [
      { name: 'seller', type: 'address', internalType: 'address' },
      { name: 'vault', type: 'address', internalType: 'address' },
    ],
    outputs: [
      { name: 'lastOrderId', type: 'uint256', internalType: 'uint256' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'closeOrder',
    inputs: [{ name: 'orderId', type: 'uint256', internalType: 'uint256' }],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'feeAddress',
    inputs: [],
    outputs: [{ name: '', type: 'address', internalType: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'feeRatio',
    inputs: [],
    outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'fillOrder',
    inputs: [
      { name: 'orderId', type: 'uint256', internalType: 'uint256' },
      { name: 'vaultAddress', type: 'address', internalType: 'address' },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'fillOrder',
    inputs: [{ name: 'orderId', type: 'uint256', internalType: 'uint256' }],
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    name: 'initialize',
    inputs: [
      { name: '_feeAddress', type: 'address', internalType: 'address' },
      {
        name: '_initialOwner',
        type: 'address',
        internalType: 'address',
      },
      { name: '_bgt', type: 'address', internalType: 'address' },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'orders',
    inputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    outputs: [
      { name: 'dealer', type: 'address', internalType: 'address' },
      { name: 'price', type: 'uint256', internalType: 'uint256' },
      { name: 'balance', type: 'uint256', internalType: 'uint256' },
      {
        name: 'spentBalance',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'vaultAddress',
        type: 'address',
        internalType: 'address',
      },
      { name: 'height', type: 'uint256', internalType: 'uint256' },
      {
        name: 'orderType',
        type: 'uint8',
        internalType: 'enum IBgtMarket.OrderType',
      },
      {
        name: 'status',
        type: 'uint8',
        internalType: 'enum IBgtMarket.OrderStatus',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'owner',
    inputs: [],
    outputs: [{ name: '', type: 'address', internalType: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'postOrder',
    inputs: [{ name: 'price', type: 'uint256', internalType: 'uint256' }],
    outputs: [{ name: 'orderId', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    name: 'postOrder',
    inputs: [
      { name: 'price', type: 'uint256', internalType: 'uint256' },
      { name: 'vaultAddress', type: 'address', internalType: 'address' },
    ],
    outputs: [{ name: 'orderId', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'proxiableUUID',
    inputs: [],
    outputs: [{ name: '', type: 'bytes32', internalType: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'renounceOwnership',
    inputs: [],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'setFeeAddress',
    inputs: [{ name: '_feeAddress', type: 'address', internalType: 'address' }],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'setFeeRatio',
    inputs: [{ name: '_feeRatio', type: 'uint256', internalType: 'uint256' }],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'transferOwnership',
    inputs: [{ name: 'newOwner', type: 'address', internalType: 'address' }],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'upgradeToAndCall',
    inputs: [
      {
        name: 'newImplementation',
        type: 'address',
        internalType: 'address',
      },
      { name: 'data', type: 'bytes', internalType: 'bytes' },
    ],
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'event',
    name: 'Initialized',
    inputs: [
      {
        name: 'version',
        type: 'uint64',
        indexed: false,
        internalType: 'uint64',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'OrderClosed',
    inputs: [
      {
        name: 'orderId',
        type: 'uint256',
        indexed: true,
        internalType: 'uint256',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'OrderFilled',
    inputs: [
      {
        name: 'orderId',
        type: 'uint256',
        indexed: true,
        internalType: 'uint256',
      },
      {
        name: 'taker',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: 'price',
        type: 'uint256',
        indexed: true,
        internalType: 'uint256',
      },
      {
        name: 'vaultAddress',
        type: 'address',
        indexed: false,
        internalType: 'address',
      },
      {
        name: 'payment',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
      {
        name: 'bgtAmount',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'OrderPosted',
    inputs: [
      {
        name: 'orderId',
        type: 'uint256',
        indexed: true,
        internalType: 'uint256',
      },
      {
        name: 'dealer',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: 'price',
        type: 'uint256',
        indexed: true,
        internalType: 'uint256',
      },
      {
        name: 'vaultAddress',
        type: 'address',
        indexed: false,
        internalType: 'address',
      },
      {
        name: 'balance',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
      {
        name: 'orderType',
        type: 'uint8',
        indexed: false,
        internalType: 'enum IBgtMarket.OrderType',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'OwnershipTransferred',
    inputs: [
      {
        name: 'previousOwner',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: 'newOwner',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'Upgraded',
    inputs: [
      {
        name: 'implementation',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
    ],
    anonymous: false,
  },
  {
    type: 'error',
    name: 'AddressEmptyCode',
    inputs: [{ name: 'target', type: 'address', internalType: 'address' }],
  },
  {
    type: 'error',
    name: 'ERC1967InvalidImplementation',
    inputs: [
      {
        name: 'implementation',
        type: 'address',
        internalType: 'address',
      },
    ],
  },
  { type: 'error', name: 'ERC1967NonPayable', inputs: [] },
  { type: 'error', name: 'FailedCall', inputs: [] },
  { type: 'error', name: 'InvalidInitialization', inputs: [] },
  { type: 'error', name: 'NotInitializing', inputs: [] },
  {
    type: 'error',
    name: 'OwnableInvalidOwner',
    inputs: [{ name: 'owner', type: 'address', internalType: 'address' }],
  },
  {
    type: 'error',
    name: 'OwnableUnauthorizedAccount',
    inputs: [{ name: 'account', type: 'address', internalType: 'address' }],
  },
  { type: 'error', name: 'ReentrancyGuardReentrantCall', inputs: [] },
  { type: 'error', name: 'UUPSUnauthorizedCallContext', inputs: [] },
  {
    type: 'error',
    name: 'UUPSUnsupportedProxiableUUID',
    inputs: [{ name: 'slot', type: 'bytes32', internalType: 'bytes32' }],
  },
] as const;
