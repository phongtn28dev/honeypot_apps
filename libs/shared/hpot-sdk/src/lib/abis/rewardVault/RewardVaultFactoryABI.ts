export const RewardVaultFactoryABI = [
  { inputs: [], stateMutability: 'nonpayable', type: 'constructor' },
  { inputs: [], name: 'AccessControlBadConfirmation', type: 'error' },
  {
    inputs: [
      { internalType: 'address', name: 'account', type: 'address' },
      { internalType: 'bytes32', name: 'neededRole', type: 'bytes32' },
    ],
    name: 'AccessControlUnauthorizedAccount',
    type: 'error',
  },
  {
    inputs: [{ internalType: 'address', name: 'target', type: 'address' }],
    name: 'AddressEmptyCode',
    type: 'error',
  },
  { inputs: [], name: 'AmountLessThanMinIncentiveRate', type: 'error' },
  { inputs: [], name: 'CannotRecoverIncentiveToken', type: 'error' },
  { inputs: [], name: 'CannotRecoverRewardToken', type: 'error' },
  { inputs: [], name: 'CannotRecoverStakingToken', type: 'error' },
  { inputs: [], name: 'CommissionChangeAlreadyQueued', type: 'error' },
  { inputs: [], name: 'CommissionNotQueuedOrDelayNotPassed', type: 'error' },
  { inputs: [], name: 'DepositNotMultipleOfGwei', type: 'error' },
  { inputs: [], name: 'DepositValueTooHigh', type: 'error' },
  { inputs: [], name: 'DonateAmountLessThanPayoutAmount', type: 'error' },
  {
    inputs: [
      { internalType: 'address', name: 'implementation', type: 'address' },
    ],
    name: 'ERC1967InvalidImplementation',
    type: 'error',
  },
  { inputs: [], name: 'ERC1967NonPayable', type: 'error' },
  { inputs: [], name: 'FailedCall', type: 'error' },
  { inputs: [], name: 'IncentiveRateTooHigh', type: 'error' },
  { inputs: [], name: 'IndexOutOfRange', type: 'error' },
  { inputs: [], name: 'InsolventReward', type: 'error' },
  { inputs: [], name: 'InsufficientDelegateStake', type: 'error' },
  { inputs: [], name: 'InsufficientDeposit', type: 'error' },
  { inputs: [], name: 'InsufficientIncentiveTokens', type: 'error' },
  { inputs: [], name: 'InsufficientSelfStake', type: 'error' },
  { inputs: [], name: 'InsufficientStake', type: 'error' },
  { inputs: [], name: 'InvalidActivateBoostDelay', type: 'error' },
  { inputs: [], name: 'InvalidArray', type: 'error' },
  { inputs: [], name: 'InvalidBaseRate', type: 'error' },
  { inputs: [], name: 'InvalidBoostMultiplier', type: 'error' },
  { inputs: [], name: 'InvalidCommissionChangeDelay', type: 'error' },
  { inputs: [], name: 'InvalidCommissionValue', type: 'error' },
  { inputs: [], name: 'InvalidCredentialsLength', type: 'error' },
  { inputs: [], name: 'InvalidDistribution', type: 'error' },
  { inputs: [], name: 'InvalidDropBoostDelay', type: 'error' },
  { inputs: [], name: 'InvalidInitialization', type: 'error' },
  { inputs: [], name: 'InvalidMaxIncentiveTokensCount', type: 'error' },
  { inputs: [], name: 'InvalidMerkleRoot', type: 'error' },
  { inputs: [], name: 'InvalidMinBoostedRewardRate', type: 'error' },
  { inputs: [], name: 'InvalidProof', type: 'error' },
  { inputs: [], name: 'InvalidPubKeyLength', type: 'error' },
  { inputs: [], name: 'InvalidRewardAllocationWeights', type: 'error' },
  { inputs: [], name: 'InvalidRewardClaimDelay', type: 'error' },
  { inputs: [], name: 'InvalidRewardConvexity', type: 'error' },
  { inputs: [], name: 'InvalidRewardRate', type: 'error' },
  { inputs: [], name: 'InvalidSignatureLength', type: 'error' },
  { inputs: [], name: 'InvalidStartBlock', type: 'error' },
  { inputs: [], name: 'InvalidToken', type: 'error' },
  { inputs: [], name: 'InvalidateDefaultRewardAllocation', type: 'error' },
  { inputs: [], name: 'InvariantCheckFailed', type: 'error' },
  { inputs: [], name: 'MaxNumWeightsPerRewardAllocationIsZero', type: 'error' },
  { inputs: [], name: 'MinIncentiveRateIsZero', type: 'error' },
  { inputs: [], name: 'NotAContract', type: 'error' },
  { inputs: [], name: 'NotApprovedSender', type: 'error' },
  { inputs: [], name: 'NotBGT', type: 'error' },
  { inputs: [], name: 'NotBlockRewardController', type: 'error' },
  { inputs: [], name: 'NotDelegate', type: 'error' },
  { inputs: [], name: 'NotDistributor', type: 'error' },
  { inputs: [], name: 'NotEnoughBalance', type: 'error' },
  { inputs: [], name: 'NotEnoughBoostedBalance', type: 'error' },
  { inputs: [], name: 'NotEnoughTime', type: 'error' },
  { inputs: [], name: 'NotFactoryVault', type: 'error' },
  { inputs: [], name: 'NotFeeCollector', type: 'error' },
  { inputs: [], name: 'NotIncentiveManager', type: 'error' },
  { inputs: [], name: 'NotInitializing', type: 'error' },
  { inputs: [], name: 'NotNewOperator', type: 'error' },
  { inputs: [], name: 'NotOperator', type: 'error' },
  { inputs: [], name: 'NotWhitelistedVault', type: 'error' },
  { inputs: [], name: 'OperatorAlreadySet', type: 'error' },
  { inputs: [], name: 'PayoutAmountIsZero', type: 'error' },
  { inputs: [], name: 'RewardAllocationAlreadyQueued', type: 'error' },
  { inputs: [], name: 'RewardAllocationBlockDelayTooLarge', type: 'error' },
  { inputs: [], name: 'RewardCycleNotEnded', type: 'error' },
  { inputs: [], name: 'RewardInactive', type: 'error' },
  { inputs: [], name: 'RewardsDurationIsZero', type: 'error' },
  { inputs: [], name: 'StakeAmountIsZero', type: 'error' },
  { inputs: [], name: 'TimestampAlreadyProcessed', type: 'error' },
  { inputs: [], name: 'TokenAlreadyWhitelistedOrLimitReached', type: 'error' },
  { inputs: [], name: 'TokenNotWhitelisted', type: 'error' },
  { inputs: [], name: 'TooManyWeights', type: 'error' },
  { inputs: [], name: 'TotalSupplyOverflow', type: 'error' },
  { inputs: [], name: 'UUPSUnauthorizedCallContext', type: 'error' },
  {
    inputs: [{ internalType: 'bytes32', name: 'slot', type: 'bytes32' }],
    name: 'UUPSUnsupportedProxiableUUID',
    type: 'error',
  },
  { inputs: [], name: 'WithdrawAmountIsZero', type: 'error' },
  { inputs: [], name: 'ZeroAddress', type: 'error' },
  { inputs: [], name: 'ZeroOperatorOnFirstDeposit', type: 'error' },
  { inputs: [], name: 'ZeroPercentageWeight', type: 'error' },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'newBGTIncentiveDistributor',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'oldBGTIncentiveDistributor',
        type: 'address',
      },
    ],
    name: 'BGTIncentiveDistributorSet',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint64',
        name: 'version',
        type: 'uint64',
      },
    ],
    name: 'Initialized',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'bytes32', name: 'role', type: 'bytes32' },
      {
        indexed: true,
        internalType: 'bytes32',
        name: 'previousAdminRole',
        type: 'bytes32',
      },
      {
        indexed: true,
        internalType: 'bytes32',
        name: 'newAdminRole',
        type: 'bytes32',
      },
    ],
    name: 'RoleAdminChanged',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'bytes32', name: 'role', type: 'bytes32' },
      {
        indexed: true,
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'sender',
        type: 'address',
      },
    ],
    name: 'RoleGranted',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'bytes32', name: 'role', type: 'bytes32' },
      {
        indexed: true,
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'sender',
        type: 'address',
      },
    ],
    name: 'RoleRevoked',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'implementation',
        type: 'address',
      },
    ],
    name: 'Upgraded',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'stakingToken',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'vault',
        type: 'address',
      },
    ],
    name: 'VaultCreated',
    type: 'event',
  },
  {
    inputs: [],
    name: 'DEFAULT_ADMIN_ROLE',
    outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'UPGRADE_INTERFACE_VERSION',
    outputs: [{ internalType: 'string', name: '', type: 'string' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'VAULT_MANAGER_ROLE',
    outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'VAULT_PAUSER_ROLE',
    outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    name: 'allVaults',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'allVaultsLength',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'beacon',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'beaconDepositContract',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'bgt',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'bgtIncentiveDistributor',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'stakingToken', type: 'address' },
    ],
    name: 'createRewardVault',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'distributor',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'bytes32', name: 'role', type: 'bytes32' }],
    name: 'getRoleAdmin',
    outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'stakingToken', type: 'address' },
    ],
    name: 'getVault',
    outputs: [{ internalType: 'address', name: 'vault', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'bytes32', name: 'role', type: 'bytes32' },
      { internalType: 'address', name: 'account', type: 'address' },
    ],
    name: 'grantRole',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'bytes32', name: 'role', type: 'bytes32' },
      { internalType: 'address', name: 'account', type: 'address' },
    ],
    name: 'hasRole',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: '_bgt', type: 'address' },
      { internalType: 'address', name: '_distributor', type: 'address' },
      {
        internalType: 'address',
        name: '_beaconDepositContract',
        type: 'address',
      },
      { internalType: 'address', name: '_governance', type: 'address' },
      { internalType: 'address', name: '_vaultImpl', type: 'address' },
    ],
    name: 'initialize',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'stakingToken', type: 'address' },
    ],
    name: 'predictRewardVaultAddress',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'proxiableUUID',
    outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'bytes32', name: 'role', type: 'bytes32' },
      { internalType: 'address', name: 'callerConfirmation', type: 'address' },
    ],
    name: 'renounceRole',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'bytes32', name: 'role', type: 'bytes32' },
      { internalType: 'address', name: 'account', type: 'address' },
    ],
    name: 'revokeRole',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_bgtIncentiveDistributor',
        type: 'address',
      },
    ],
    name: 'setBGTIncentiveDistributor',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'bytes4', name: 'interfaceId', type: 'bytes4' }],
    name: 'supportsInterface',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'newImplementation', type: 'address' },
      { internalType: 'bytes', name: 'data', type: 'bytes' },
    ],
    name: 'upgradeToAndCall',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
] as const;
