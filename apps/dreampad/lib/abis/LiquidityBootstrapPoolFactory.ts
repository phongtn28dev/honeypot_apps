export const LiquidityBootstrapPoolFactoryABI = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_implementation",
        type: "address",
      },
      {
        internalType: "address",
        name: "_owner",
        type: "address",
      },
      {
        internalType: "address",
        name: "_feeRecipient",
        type: "address",
      },
      {
        internalType: "uint48",
        name: "_platformFee",
        type: "uint48",
      },
      {
        internalType: "uint48",
        name: "_swapFee",
        type: "uint48",
      },
      {
        internalType: "address",
        name: "_uniswapV2Router",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [],
    name: "AlreadyInitialized",
    type: "error",
  },
  {
    inputs: [],
    name: "InvalidAssetOrShare",
    type: "error",
  },
  {
    inputs: [],
    name: "InvalidAssetValue",
    type: "error",
  },
  {
    inputs: [],
    name: "InvalidDelay",
    type: "error",
  },
  {
    inputs: [],
    name: "InvalidFeeRecipient",
    type: "error",
  },
  {
    inputs: [],
    name: "InvalidLpSeedingConfig",
    type: "error",
  },
  {
    inputs: [],
    name: "InvalidMaxAssetsConfig",
    type: "error",
  },
  {
    inputs: [],
    name: "InvalidMaxSharePrice",
    type: "error",
  },
  {
    inputs: [],
    name: "InvalidMinRaiseConfig",
    type: "error",
  },
  {
    inputs: [],
    name: "InvalidPoolCreator",
    type: "error",
  },
  {
    inputs: [],
    name: "InvalidVestCliff",
    type: "error",
  },
  {
    inputs: [],
    name: "InvalidVestEnd",
    type: "error",
  },
  {
    inputs: [],
    name: "InvalidWeightConfig",
    type: "error",
  },
  {
    inputs: [],
    name: "LpRolloverNotSupported",
    type: "error",
  },
  {
    inputs: [],
    name: "MaxFeeExceeded",
    type: "error",
  },
  {
    inputs: [],
    name: "NewOwnerIsZeroAddress",
    type: "error",
  },
  {
    inputs: [],
    name: "NoHandoverRequest",
    type: "error",
  },
  {
    inputs: [],
    name: "SalePeriodLow",
    type: "error",
  },
  {
    inputs: [],
    name: "Unauthorized",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "recipient",
        type: "address",
      },
    ],
    name: "FeeRecipientSet",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "pendingOwner",
        type: "address",
      },
    ],
    name: "OwnershipHandoverCanceled",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "pendingOwner",
        type: "address",
      },
    ],
    name: "OwnershipHandoverRequested",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "oldOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "fee",
        type: "uint256",
      },
    ],
    name: "PlatformFeeSet",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "pool",
        type: "address",
      },
    ],
    name: "PoolCreated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "fee",
        type: "uint256",
      },
    ],
    name: "SwapFeeSet",
    type: "event",
  },
  {
    inputs: [],
    name: "UNISWAP_V2_ROUTER",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "cancelOwnershipHandover",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "pendingOwner",
        type: "address",
      },
    ],
    name: "completeOwnershipHandover",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "address",
            name: "asset",
            type: "address",
          },
          {
            internalType: "address",
            name: "share",
            type: "address",
          },
          {
            internalType: "address",
            name: "creator",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "virtualAssets",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "maxSharePrice",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "maxSharesOut",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "maxTotalAssetsIn",
            type: "uint256",
          },
          {
            internalType: "uint40",
            name: "maxTotalAssetsInDeviation",
            type: "uint40",
          },
          {
            internalType: "uint64",
            name: "weightStart",
            type: "uint64",
          },
          {
            internalType: "uint64",
            name: "weightEnd",
            type: "uint64",
          },
          {
            internalType: "uint40",
            name: "saleStart",
            type: "uint40",
          },
          {
            internalType: "uint40",
            name: "saleEnd",
            type: "uint40",
          },
          {
            internalType: "uint40",
            name: "vestCliff",
            type: "uint40",
          },
          {
            internalType: "uint40",
            name: "vestEnd",
            type: "uint40",
          },
          {
            internalType: "uint40",
            name: "redemptionDelay",
            type: "uint40",
          },
          {
            internalType: "bool",
            name: "sellingAllowed",
            type: "bool",
          },
          {
            internalType: "bytes32",
            name: "whitelistMerkleRoot",
            type: "bytes32",
          },
          {
            internalType: "uint256",
            name: "minAssetsIn",
            type: "uint256",
          },
          {
            internalType: "uint48",
            name: "minPercAssetsSeeding",
            type: "uint48",
          },
          {
            internalType: "uint256",
            name: "minSharesSeeding",
            type: "uint256",
          },
        ],
        internalType: "struct PoolSettings",
        name: "args",
        type: "tuple",
      },
      {
        internalType: "uint256",
        name: "shares",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "assets",
        type: "uint256",
      },
      {
        internalType: "bytes32",
        name: "salt",
        type: "bytes32",
      },
    ],
    name: "createLiquidityBootstrapPool",
    outputs: [
      {
        internalType: "address",
        name: "pool",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "factorySettings",
    outputs: [
      {
        internalType: "address",
        name: "feeRecipient",
        type: "address",
      },
      {
        internalType: "uint48",
        name: "platformFee",
        type: "uint48",
      },
      {
        internalType: "uint48",
        name: "swapFee",
        type: "uint48",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "feeRecipient",
        type: "address",
      },
      {
        internalType: "uint48",
        name: "platformFee",
        type: "uint48",
      },
      {
        internalType: "uint48",
        name: "swapFee",
        type: "uint48",
      },
    ],
    name: "modifySettings",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "result",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "pendingOwner",
        type: "address",
      },
    ],
    name: "ownershipHandoverExpiresAt",
    outputs: [
      {
        internalType: "uint256",
        name: "result",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "address",
            name: "asset",
            type: "address",
          },
          {
            internalType: "address",
            name: "share",
            type: "address",
          },
          {
            internalType: "address",
            name: "creator",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "virtualAssets",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "maxSharePrice",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "maxSharesOut",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "maxTotalAssetsIn",
            type: "uint256",
          },
          {
            internalType: "uint40",
            name: "maxTotalAssetsInDeviation",
            type: "uint40",
          },
          {
            internalType: "uint64",
            name: "weightStart",
            type: "uint64",
          },
          {
            internalType: "uint64",
            name: "weightEnd",
            type: "uint64",
          },
          {
            internalType: "uint40",
            name: "saleStart",
            type: "uint40",
          },
          {
            internalType: "uint40",
            name: "saleEnd",
            type: "uint40",
          },
          {
            internalType: "uint40",
            name: "vestCliff",
            type: "uint40",
          },
          {
            internalType: "uint40",
            name: "vestEnd",
            type: "uint40",
          },
          {
            internalType: "uint40",
            name: "redemptionDelay",
            type: "uint40",
          },
          {
            internalType: "bool",
            name: "sellingAllowed",
            type: "bool",
          },
          {
            internalType: "bytes32",
            name: "whitelistMerkleRoot",
            type: "bytes32",
          },
          {
            internalType: "uint256",
            name: "minAssetsIn",
            type: "uint256",
          },
          {
            internalType: "uint48",
            name: "minPercAssetsSeeding",
            type: "uint48",
          },
          {
            internalType: "uint256",
            name: "minSharesSeeding",
            type: "uint256",
          },
        ],
        internalType: "struct PoolSettings",
        name: "args",
        type: "tuple",
      },
      {
        internalType: "bytes32",
        name: "salt",
        type: "bytes32",
      },
    ],
    name: "predictDeterministicAddress",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "address",
            name: "asset",
            type: "address",
          },
          {
            internalType: "address",
            name: "share",
            type: "address",
          },
          {
            internalType: "address",
            name: "creator",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "virtualAssets",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "maxSharePrice",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "maxSharesOut",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "maxTotalAssetsIn",
            type: "uint256",
          },
          {
            internalType: "uint40",
            name: "maxTotalAssetsInDeviation",
            type: "uint40",
          },
          {
            internalType: "uint64",
            name: "weightStart",
            type: "uint64",
          },
          {
            internalType: "uint64",
            name: "weightEnd",
            type: "uint64",
          },
          {
            internalType: "uint40",
            name: "saleStart",
            type: "uint40",
          },
          {
            internalType: "uint40",
            name: "saleEnd",
            type: "uint40",
          },
          {
            internalType: "uint40",
            name: "vestCliff",
            type: "uint40",
          },
          {
            internalType: "uint40",
            name: "vestEnd",
            type: "uint40",
          },
          {
            internalType: "uint40",
            name: "redemptionDelay",
            type: "uint40",
          },
          {
            internalType: "bool",
            name: "sellingAllowed",
            type: "bool",
          },
          {
            internalType: "bytes32",
            name: "whitelistMerkleRoot",
            type: "bytes32",
          },
          {
            internalType: "uint256",
            name: "minAssetsIn",
            type: "uint256",
          },
          {
            internalType: "uint48",
            name: "minPercAssetsSeeding",
            type: "uint48",
          },
          {
            internalType: "uint256",
            name: "minSharesSeeding",
            type: "uint256",
          },
        ],
        internalType: "struct PoolSettings",
        name: "args",
        type: "tuple",
      },
    ],
    name: "predictInitCodeHash",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "requestOwnershipHandover",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "recipient",
        type: "address",
      },
    ],
    name: "setFeeRecipient",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint48",
        name: "fee",
        type: "uint48",
      },
    ],
    name: "setPlatformFee",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint48",
        name: "fee",
        type: "uint48",
      },
    ],
    name: "setSwapFee",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
] as const;
