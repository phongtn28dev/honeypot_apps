import clsx from "clsx";
import { observer } from "mobx-react-lite";
import React from "react";
import Countdown from "react-countdown";
import { Button } from "../button/button-next";
import { shortenAddress } from "@/lib/format";
import { Address } from "viem";
import Link from "next/link";
import { DynamicFormatAmount } from "@/lib/algebra/utils/common/formatAmount";

type ILaunchPadProjectCard = {
  status: string;
  coverImg: string | null;
  isShowCoverImage?: boolean;
  endDate: number;
  startDate: number;
  tokenName: string;
  projectAuthor: string;
  fundsRaised: number;
  assetTokenSymbol?: string;
  shareTokenSymbol?: string;
  pairAddress: Address;
  variant?: "list" | "grid";
};

const ProjectCardStatus = observer(({ status }: { status: string }) => {
  return (
    <div className="flex items-center ">
      <div
        className={clsx(
          "flex justify-center items-center w-[18px] h-[18px] rounded-full",
          {
            "bg-[#F7941D1A]": status === "comming",
            "bg-[#43d9a3]/10": status === "live",
          }
        )}
      >
        <div
          className={clsx(
            "flex justify-center items-center w-[8px] h-[8px] rounded-full",
            {
              "bg-[#F7941D]": status === "comming",
              "bg-[#43d9a3]": status === "live",
            }
          )}
        ></div>
      </div>
      <div className="font-bold text-white text-[1rem] leading-[1.3rem] min-w-[110px] text-center">
        {status != "ended" && (
          <div>{status == "live" ? "Live now" : "Coming Soon"}</div>
        )}
      </div>
    </div>
  );
});

type ITokenInfo = {
  symbol: string;
  name: string;
  author: string;
  description?: string;
};

const TokenInfo = observer(
  ({ symbol, name, author, description }: ITokenInfo) => {
    return (
      <div className="flex flex-col gap-[6px]">
        <div className="flex gap-[5px] items-center">
          <div className="w-[52px] h-[52px] rounded-full overflow-hidden relative">
            <img
              src={symbol}
              alt={name}
              className="w-full h-full object-cover rounded-full"
              onError={({ currentTarget }) => {
                currentTarget.onerror = null;
                currentTarget.src =
                  "/images/icons/tokens/thpot-token-yellow-icon.png";
              }}
            />
          </div>
          <div className="">
            <div className="text-base leading-[20px] font-bold text-white">
              {name}
            </div>
            <div className="text-base leading-[20px] font-bold text-[#FFFFFF8C]">
              {shortenAddress(author as Address)}
            </div>
          </div>
        </div>
        {description && (
          <p className="line-clamp-2 text-sm leading-[18px] text-[#FFFFFF8C]">
            {description}
          </p>
        )}
      </div>
    );
  }
);

type ILaunchPadProjectBody = {
  status: string;
  symbol?: string;
  endDate: number;
  startDate: number;
  fundsRaised: number;
};

const LaunchPadProjectBody = observer(
  ({
    status,
    endDate,
    startDate,
    symbol = "tHpot",
    fundsRaised,
  }: ILaunchPadProjectBody) => {
    console.log("end date: ", endDate);

    return (
      <div className="my-[10px] py-[8px] flex items-center flex-col justify-between w-full bg-[#31220C] rounded-2xl gap-[18px]">
        <ProjectCardStatus status={status} />

        <Countdown
          date={status == "live" ? endDate : startDate}
          renderer={({ days, hours, minutes, seconds, completed }) => {
            if (completed) {
              return (
                <div className="text-center font-bold ">
                  <div className="text-xl leading-[26px] ">
                    <div className="w-48 overflow-hidden text-ellipsis whitespace-nowrap ">
                      {fundsRaised} {symbol}
                    </div>
                  </div>
                  <div className="mt-[5px] text-[9px] leading-[11px] text-[#FFFFFF70] ">
                    Total Raised
                  </div>
                </div>
              );
            } else {
              return (
                <div className="font-bold text-lg flex items-center gap-[14px]">
                  <div className="flex flex-col text-center gap-[5px]">
                    <span className="leading-[26px]">
                      {days > 0 ? days : "00"}
                    </span>
                    <span className="text-[9px] leading-3 text-[#FFFFFF70]">
                      {days > 1 ? "Days" : "Day"}
                    </span>
                  </div>
                  <div>:</div>
                  <div className="flex flex-col text-center gap-[5px]">
                    <span className="leading-[26px]">
                      {hours > 0 ? hours : "00"}
                    </span>
                    <span className="text-[9px] leading-3 text-[#FFFFFF70]">
                      {hours > 1 ? "Hours" : "Hour"}
                    </span>
                  </div>
                  <div>:</div>
                  <div className="flex flex-col text-center gap-[5px]">
                    <span className="leading-[26px]">
                      {minutes > 0 ? minutes : "00"}
                    </span>
                    <span className="text-[9px] leading-3 text-[#FFFFFF70]">
                      {minutes > 1 ? "Minutes" : "Minute"}
                    </span>
                  </div>
                  <div>:</div>
                  <div className="flex flex-col text-center gap-[5px]">
                    <span className="leading-[26px]">
                      {seconds > 0 ? seconds : "00"}
                    </span>
                    <span className="text-[9px] leading-3 text-[#FFFFFF70]">
                      {seconds > 1 ? "Secs" : "Sec"}
                    </span>
                  </div>
                </div>
              );
            }
          }}
        />
      </div>
    );
  }
);

const LaunchPadProjectCard = observer(
  ({
    status,
    coverImg,
    endDate,
    startDate,
    isShowCoverImage = false,
    tokenName,
    projectAuthor,
    fundsRaised,
    assetTokenSymbol,
    shareTokenSymbol,
    pairAddress,
    variant = "grid",
  }: ILaunchPadProjectCard) => {
    if (variant === "grid") {
      return (
        <div
          className={clsx(
            "min-w-[18.5rem]   rounded-[20px] bg-[#202020] border border-[#F7931A0D] overflow-hidden"
          )}
        >
          {isShowCoverImage && (
            <div className="h-[78px] relative w-full bg-[radial-gradient(at_center,#FFCD4D,#83C2E9)]">
              {!!coverImg && coverImg?.length > 0 && (
                <img
                  alt="Cover Image"
                  src={coverImg}
                  className="object-cover h-[78px] w-full"
                  onError={({ currentTarget }) => {
                    currentTarget.onerror = null;
                    currentTarget.className = "hidden";
                  }}
                />
              )}
            </div>
          )}
          <div className="p-[15px] pb-0">
            <TokenInfo
              symbol={
                shareTokenSymbol ||
                "/images/icons/tokens/thpot-token-yellow-icon.png"
              }
              name={tokenName}
              author={projectAuthor}
              // description="Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum is simply dummy text of the printing and typesetting industry."
            />
            <LaunchPadProjectBody
              fundsRaised={fundsRaised}
              endDate={endDate}
              startDate={startDate}
              status={status}
              symbol={assetTokenSymbol}
            />
          </div>
          <div className="p-[10px]">
            {status === "live" ? (
              <Link href={`/lbp-detail/${pairAddress}`}>
                <Button className="w-full outline-2">
                  <span className="font-bold text-[12px]">Buy Token</span>
                </Button>
              </Link>
            ) : (
              <Link href={`/lbp-detail/${pairAddress}`}>
                <Button className="w-full outline-2">
                  <span className="font-bold text-[12px]">View Token</span>
                </Button>
              </Link>
            )}
          </div>
        </div>
      );
    } else if (variant === "list") {
      return (
        <>
          <td className="flex items-center gap-2 p-2">
            <div className="w-[52px] h-[52px] rounded-full overflow-hidden relative">
              <img
                src={
                  shareTokenSymbol ||
                  "/images/icons/tokens/thpot-token-yellow-icon.png"
                }
                alt={tokenName}
                className="w-full h-full object-cover rounded-full"
                onError={({ currentTarget }) => {
                  if (currentTarget.src.includes(shareTokenSymbol ?? "")) {
                    currentTarget.src =
                      "/images/icons/tokens/thpot-token-yellow-icon.png";
                  }
                }}
              />
            </div>
            <span className="text-base leading-[20px] font-bold text-white">
              {tokenName}
            </span>
          </td>

          <td className="">
            <div className="flex items-center justify-center text-base leading-[20px] font-bold text-white">
              {status}
            </div>
          </td>

          <td className="">
            <div className="flex items-center justify-center text-base leading-[20px] font-bold text-white">
              {assetTokenSymbol}
            </div>
          </td>

          <td className="">
            <div className="flex items-center justify-center text-base leading-[20px] font-bold text-white">
              <span className="text-[#F7941D] mr-1">Raised: </span>{" "}
              <span>
                {DynamicFormatAmount({
                  amount: fundsRaised,
                  decimals: 5,
                  endWith: assetTokenSymbol,
                })}
              </span>
            </div>
          </td>

          <td className="">
            <div className="text-base leading-[20px] font-bold text-white">
              <Link href={`/lbp-detail/${pairAddress}`}>
                <Button className="w-full outline-2">
                  <span className="font-bold text-[12px]">View</span>
                </Button>
              </Link>
            </div>
          </td>
        </>
      );
    }
  }
);

export default LaunchPadProjectCard;
