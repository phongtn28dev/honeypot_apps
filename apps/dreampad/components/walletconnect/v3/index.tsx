import { ConnectButton } from "@usecapsule/rainbowkit";
import { ButtonHTMLAttributes } from "react";
import Image from "next/image";
import { useConnect, useConnectors } from "wagmi";
import { BiWallet } from "react-icons/bi";
import { BsPerson } from "react-icons/bs";
import Link from "next/link";

const ConnectButtonCustom = (props: ButtonHTMLAttributes<any>) => {
  return (
    <button
      type="button"
      className="flex h-10 px-4 justify-center items-center gap-2 bg-white rounded-[100px] text-black font-medium shadow-sm hover:opacity-90 transition-opacity"
      {...props}
    ></button>
  );
};
export const WalletConnect = () => {
  const { connect } = useConnect();
  const connectors = useConnectors();

  const mockConnector = connectors.find((connector) => connector.id === "mock");
  return (
    <div className="flex flex-col items-center">
      <Image
        src="/images/header/hanging-rope.svg"
        alt="hanging rope"
        width={139}
        height={66}
        className="mb-[-20px]"
      />
      <div className="bg-[#FFCD4D] rounded-xl pb-8 bg-[url('/images/card-container/dark/bottom-border.svg')] bg-left-bottom bg-repeat-x bg-clip-padding pt-4 px-2.5">
        <div className="flex items-center gap-x-2 justify-center mb-2">
          <Link
            href="/profile"
            className="flex flex-col items-center justify-center bg-white rounded-full p-2"
          >
            <BsPerson size={30} color="#202020" />
          </Link>
        </div>
        <ConnectButton.Custom>
          {({
            account,
            chain,
            openAccountModal,
            openChainModal,
            openConnectModal,
            authenticationStatus,
            mounted,
          }) => {
            // Note: If your app doesn't use authentication, you
            // can remove all 'authenticationStatus' checks
            const ready = mounted && authenticationStatus !== "loading";
            const connected =
              ready &&
              account &&
              chain &&
              (!authenticationStatus ||
                authenticationStatus === "authenticated");
            return (
              <div
                {...(!ready && {
                  "aria-hidden": true,
                  style: {
                    opacity: 0,
                    pointerEvents: "none",
                    userSelect: "none",
                  },
                })}
              >
                {(() => {
                  if (!connected) {
                    return (
                      <div className="flex items-center gap-x-2">
                        {/* <NetworkSelect /> */}
                        <ConnectButtonCustom
                          onClick={() => {
                            if (process.env.NEXT_PUBLIC_MOCK === "true") {
                              connect({ connector: mockConnector! });
                            } else {
                              openConnectModal();
                            }
                          }}
                        >
                          <BiWallet size={20} />
                          Connect Wallet
                        </ConnectButtonCustom>
                      </div>
                    );
                  }
                  if (chain.unsupported) {
                    return (
                      <ConnectButtonCustom onClick={openChainModal}>
                        Wrong network
                      </ConnectButtonCustom>
                    );
                  }
                  return (
                    <div className="flex flex-col sm:flex-row gap-[12px] items-center relative">
                      <button
                        onClick={openChainModal}
                        type="button"
                        className="flex min-w-[126px] cursor-pointer bg-[#202020] text-white px-4 py-2 rounded-2xl gap-2 items-center"
                      >
                        <Image
                          src={"/images/empty-logo.png"}
                          alt="icon"
                          width={20}
                          height={20}
                        />

                        <div className="text-nowrap text-white">
                          {account.displayBalance ? (
                            `${account.displayBalance}`
                          ) : (
                            <div className="h-4 w-20 bg-gray-700 animate-pulse rounded"></div>
                          )}
                        </div>
                      </button>

                      <ConnectButtonCustom
                        onClick={openAccountModal}
                        type="button"
                      >
                        <BiWallet size={20} />
                        {account.displayName}
                      </ConnectButtonCustom>
                    </div>
                  );
                })()}
              </div>
            );
          }}
        </ConnectButton.Custom>
      </div>
    </div>
  );
};
