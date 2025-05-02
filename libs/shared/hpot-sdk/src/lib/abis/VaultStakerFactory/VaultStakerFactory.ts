export const VaultStakerFactoryABI = [
  {
    type: 'constructor',
    inputs: [
      {
        name: '_lbgt',
        type: 'address',
        internalType: 'address',
      },
      {
        name: '_operatorAddress',
        type: 'address',
        internalType: 'address',
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'createMiniVaultStaker',
    inputs: [
      {
        name: '_lbgtReceiver',
        type: 'address',
        internalType: 'address',
      },
      {
        name: '_rewardVault',
        type: 'address',
        internalType: 'address',
      },
      {
        name: 'n',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'getRewardVaults',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'address[]',
        internalType: 'address[]',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'getStakers',
    inputs: [
      {
        name: '_rewardVault',
        type: 'address',
        internalType: 'address',
      },
    ],
    outputs: [
      {
        name: '',
        type: 'address[]',
        internalType: 'address[]',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'implementation',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'address',
        internalType: 'address',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'isRewardVaultExist',
    inputs: [
      {
        name: '',
        type: 'address',
        internalType: 'address',
      },
    ],
    outputs: [
      {
        name: '',
        type: 'bool',
        internalType: 'bool',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'lbgt',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'address',
        internalType: 'address',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'mintLBGT',
    inputs: [
      {
        name: 'stakerIndexes',
        type: 'uint256[]',
        internalType: 'uint256[]',
      },
      {
        name: '_rewardVault',
        type: 'address',
        internalType: 'address',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'operatorAddress',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'address',
        internalType: 'address',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'owner',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'address',
        internalType: 'address',
      },
    ],
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
    name: 'rewardVaults',
    inputs: [
      {
        name: '',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    outputs: [
      {
        name: '',
        type: 'address',
        internalType: 'address',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'stake',
    inputs: [
      {
        name: 'stakerIndexes',
        type: 'uint256[]',
        internalType: 'uint256[]',
      },
      {
        name: 'amounts',
        type: 'uint256[]',
        internalType: 'uint256[]',
      },
      {
        name: '_rewardVault',
        type: 'address',
        internalType: 'address',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'stakerByRewardVault',
    inputs: [
      {
        name: '',
        type: 'address',
        internalType: 'address',
      },
      {
        name: '',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    outputs: [
      {
        name: '',
        type: 'address',
        internalType: 'address',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'transferOwnership',
    inputs: [
      {
        name: 'newOwner',
        type: 'address',
        internalType: 'address',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'unStake',
    inputs: [
      {
        name: '_rewardVault',
        type: 'address',
        internalType: 'address',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'updateLbgt',
    inputs: [
      {
        name: '_newLbgt',
        type: 'address',
        internalType: 'address',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'updateOperatorAddress',
    inputs: [
      {
        name: '_newOperator',
        type: 'address',
        internalType: 'address',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'event',
    name: 'BgtHandled',
    inputs: [
      {
        name: 'rewardVault',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: 'stakerIndex',
        type: 'uint256',
        indexed: true,
        internalType: 'uint256',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'LbgtUpdated',
    inputs: [
      {
        name: 'oldLbgt',
        type: 'address',
        indexed: false,
        internalType: 'address',
      },
      {
        name: 'newLbgt',
        type: 'address',
        indexed: false,
        internalType: 'address',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'MiniVaultStakerCreated',
    inputs: [
      {
        name: 'rewardVault',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: 'staker',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: 'index',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'OperatorAddressUpdated',
    inputs: [
      {
        name: 'oldOperator',
        type: 'address',
        indexed: false,
        internalType: 'address',
      },
      {
        name: 'newOperator',
        type: 'address',
        indexed: false,
        internalType: 'address',
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
    name: 'Staked',
    inputs: [
      {
        name: 'rewardVault',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: 'stakerIndex',
        type: 'uint256',
        indexed: true,
        internalType: 'uint256',
      },
      {
        name: 'amount',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'UnStaked',
    inputs: [
      {
        name: 'rewardVault',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: 'stakerIndex',
        type: 'uint256',
        indexed: true,
        internalType: 'uint256',
      },
    ],
    anonymous: false,
  },
  {
    type: 'error',
    name: 'FailedDeployment',
    inputs: [],
  },
  {
    type: 'error',
    name: 'InsufficientBalance',
    inputs: [
      {
        name: 'balance',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'needed',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
  },
  {
    type: 'error',
    name: 'OwnableInvalidOwner',
    inputs: [
      {
        name: 'owner',
        type: 'address',
        internalType: 'address',
      },
    ],
  },
  {
    type: 'error',
    name: 'OwnableUnauthorizedAccount',
    inputs: [
      {
        name: 'account',
        type: 'address',
        internalType: 'address',
      },
    ],
  },
] as const;
