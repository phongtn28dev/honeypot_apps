export const LiquidityBootstrapPoolABI = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_sablier",
        type: "address",
      },
      {
        internalType: "address",
        name: "_uniswap_v2_router",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [],
    name: "AmountInTooLarge",
    type: "error",
  },
  {
    inputs: [],
    name: "AmountOutTooLarge",
    type: "error",
  },
  {
    inputs: [],
    name: "AssetsInExceeded",
    type: "error",
  },
  {
    inputs: [],
    name: "CallerDisallowed",
    type: "error",
  },
  {
    inputs: [],
    name: "CancelDisallowed",
    type: "error",
  },
  {
    inputs: [],
    name: "CannotLowerLPCommitment",
    type: "error",
  },
  {
    inputs: [],
    name: "ClosingDisallowed",
    type: "error",
  },
  {
    inputs: [],
    name: "EnforcedPause",
    type: "error",
  },
  {
    inputs: [],
    name: "InvalidAssetsIn",
    type: "error",
  },
  {
    inputs: [],
    name: "InvalidPoolCreationTime",
    type: "error",
  },
  {
    inputs: [],
    name: "LPCreationDelayInEffect",
    type: "error",
  },
  {
    inputs: [],
    name: "LPPercentTooHigh",
    type: "error",
  },
  {
    inputs: [],
    name: "NotEnoughAssets",
    type: "error",
  },
  {
    inputs: [],
    name: "NotEnoughPurchasedShares",
    type: "error",
  },
  {
    inputs: [],
    name: "PoolCancelled",
    type: "error",
  },
  {
    inputs: [],
    name: "RedeemingDisallowed",
    type: "error",
  },
  {
    inputs: [],
    name: "SellingDisallowed",
    type: "error",
  },
  {
    inputs: [],
    name: "SharesOutExceeded",
    type: "error",
  },
  {
    inputs: [],
    name: "SlippageExceeded",
    type: "error",
  },
  {
    inputs: [],
    name: "TradingDisallowed",
    type: "error",
  },
  {
    inputs: [],
    name: "WhitelistProof",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "caller",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "recipient",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "assets",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "shares",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "swapFee",
        type: "uint256",
      },
    ],
    name: "Buy",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "assets",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "shares",
        type: "uint256",
      },
    ],
    name: "Cancelled",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "assets",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "platformFees",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "swapFeesAsset",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "swapFeesShare",
        type: "uint256",
      },
    ],
    name: "Close",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "platformFees",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "swapFeesAsset",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "swapFeesShare",
        type: "uint256",
      },
    ],
    name: "FeesPaid",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "totalPurchased",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "totalAssetsIn",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "totalSwapFeesAsset",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "totalSwapFeesShare",
        type: "uint256",
      },
    ],
    name: "MaxRaiseReached",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    name: "Paused",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "caller",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "streamID",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "shares",
        type: "uint256",
      },
    ],
    name: "Redeem",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "caller",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "assets",
        type: "uint256",
      },
    ],
    name: "Refunded",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "caller",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "recipient",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "shares",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "assets",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "swapFee",
        type: "uint256",
      },
    ],
    name: "Sell",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "lp",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "lpReceiver",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "lpToken",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "addedLpAssets",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "addedshares",
        type: "uint256",
      },
    ],
    name: "V2LPCreated",
    type: "event",
  },
  {
    inputs: [],
    name: "SABLIER",
    outputs: [
      {
        internalType: "contract ISablierV2LockupLinear",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "UNISWAP_V2_FACTORY",
    outputs: [
      {
        internalType: "contract IUniswapV2Factory",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "UNISWAP_V2_ROUTER",
    outputs: [
      {
        internalType: "contract IUniswapV2Router01",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "args",
    outputs: [
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
            internalType: "uint256",
            name: "assets",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "shares",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "virtualAssets",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "weightStart",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "weightEnd",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "saleStart",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "saleEnd",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "totalPurchased",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "maxSharePrice",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "maxTotalSharesOut",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "maxTotalAssetsIn",
            type: "uint256",
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
            internalType: "uint256",
            name: "maxTotalAssetsInDeviation",
            type: "uint256",
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
            internalType: "uint256",
            name: "minPercAssetsSeeding",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "minSharesSeeding",
            type: "uint256",
          },
        ],
        internalType: "struct Pool",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "asset",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "assetsContributed",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "cancelLBP",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "cancelled",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "close",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "updatedMinSharesSeeding",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "updatedMinPercAssetsSeeding",
            type: "uint256",
          },
        ],
        internalType: "struct LBPCloseParams",
        name: "_params",
        type: "tuple",
      },
    ],
    name: "close",
    outputs: [
      {
        internalType: "uint256",
        name: "actualAssetsSeeding",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "actualSharesSeeding",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "closed",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "percAssetsSeeding",
        type: "uint256",
      },
    ],
    name: "getAssets",
    outputs: [
      {
        internalType: "uint256",
        name: "totalAssets",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "totalAssetsMinusFees",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "platformFees",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "assetsSeeding",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_percToLP",
        type: "uint256",
      },
    ],
    name: "getAssetsSeeding",
    outputs: [
      {
        internalType: "uint256",
        name: "assetsSeeding",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "requiredNewAssets",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "leftoverAssets",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "platformFees",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_remainingShares",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_sharesSeeding",
        type: "uint256",
      },
    ],
    name: "getSharesSeeding",
    outputs: [
      {
        internalType: "uint256",
        name: "requiredNewShares",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "leftoverShares",
        type: "uint256",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [],
    name: "initialAssets",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_initialAssets",
        type: "uint256",
      },
    ],
    name: "initializeAssets",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "isInGraceTime",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "lpRollover",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [],
    name: "manager",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [],
    name: "maxSharePrice",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [],
    name: "maxTotalAssetsIn",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [],
    name: "maxTotalAssetsInDeviation",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [],
    name: "maxTotalSharesOut",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [],
    name: "minAssetsIn",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [],
    name: "minPercAssetsSeeding",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [],
    name: "minSharesSeeding",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [],
    name: "paused",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "platform",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [],
    name: "platformFee",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "sharesOut",
        type: "uint256",
      },
    ],
    name: "previewAssetsIn",
    outputs: [
      {
        internalType: "uint256",
        name: "assetsIn",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "sharesIn",
        type: "uint256",
      },
    ],
    name: "previewAssetsOut",
    outputs: [
      {
        internalType: "uint256",
        name: "assetsOut",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "assetsOut",
        type: "uint256",
      },
    ],
    name: "previewSharesIn",
    outputs: [
      {
        internalType: "uint256",
        name: "sharesIn",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "assetsIn",
        type: "uint256",
      },
    ],
    name: "previewSharesOut",
    outputs: [
      {
        internalType: "uint256",
        name: "sharesOut",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "purchasedShares",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "redeem",
    outputs: [
      {
        internalType: "uint256",
        name: "shares",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "redemptionDelay",
    outputs: [
      {
        internalType: "uint40",
        name: "",
        type: "uint40",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [],
    name: "reservesAndWeights",
    outputs: [
      {
        internalType: "uint256",
        name: "assetReserve",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "shareReserve",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "assetWeight",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "shareWeight",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "saleEnd",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [],
    name: "saleEndTimestamp",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "saleStart",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [],
    name: "sellingAllowed",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [],
    name: "share",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "sharesOut",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "maxAssetsIn",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "recipient",
        type: "address",
      },
    ],
    name: "swapAssetsForExactShares",
    outputs: [
      {
        internalType: "uint256",
        name: "assetsIn",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "sharesOut",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "maxAssetsIn",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "recipient",
        type: "address",
      },
      {
        internalType: "bytes32[]",
        name: "proof",
        type: "bytes32[]",
      },
    ],
    name: "swapAssetsForExactShares",
    outputs: [
      {
        internalType: "uint256",
        name: "assetsIn",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "assetsIn",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "minSharesOut",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "recipient",
        type: "address",
      },
    ],
    name: "swapExactAssetsForShares",
    outputs: [
      {
        internalType: "uint256",
        name: "sharesOut",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "assetsIn",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "minSharesOut",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "recipient",
        type: "address",
      },
      {
        internalType: "bytes32[]",
        name: "proof",
        type: "bytes32[]",
      },
    ],
    name: "swapExactAssetsForShares",
    outputs: [
      {
        internalType: "uint256",
        name: "sharesOut",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "sharesIn",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "minAssetsOut",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "recipient",
        type: "address",
      },
    ],
    name: "swapExactSharesForAssets",
    outputs: [
      {
        internalType: "uint256",
        name: "assetsOut",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "sharesIn",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "minAssetsOut",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "recipient",
        type: "address",
      },
      {
        internalType: "bytes32[]",
        name: "proof",
        type: "bytes32[]",
      },
    ],
    name: "swapExactSharesForAssets",
    outputs: [
      {
        internalType: "uint256",
        name: "assetsOut",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "swapFee",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "assetsOut",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "maxSharesIn",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "recipient",
        type: "address",
      },
    ],
    name: "swapSharesForExactAssets",
    outputs: [
      {
        internalType: "uint256",
        name: "sharesIn",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "assetsOut",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "maxSharesIn",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "recipient",
        type: "address",
      },
      {
        internalType: "bytes32[]",
        name: "proof",
        type: "bytes32[]",
      },
    ],
    name: "swapSharesForExactAssets",
    outputs: [
      {
        internalType: "uint256",
        name: "sharesIn",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "togglePause",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "totalAssetsIn",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalPurchased",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalSwapFeesAsset",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalSwapFeesShare",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "vestCliff",
    outputs: [
      {
        internalType: "uint40",
        name: "",
        type: "uint40",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [],
    name: "vestEnd",
    outputs: [
      {
        internalType: "uint40",
        name: "",
        type: "uint40",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [],
    name: "vestShares",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [],
    name: "virtualAssets",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [],
    name: "weightEnd",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [],
    name: "weightStart",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [],
    name: "whitelistMerkleRoot",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [],
    name: "whitelisted",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
] as const;
