import { cn } from "@/lib/tailwindcss";
import { useReadAlgebraPositionManagerTokenUri } from "@/wagmi-generated";
import { useEffect, useRef } from "react";

export const FarmingPositionImg = ({
  positionId,
  size,
  className,
}: {
  positionId: bigint;
  size: number;
  className?: string;
}) => {
  const { data: uri } = useReadAlgebraPositionManagerTokenUri({
    args: [positionId],
  });

  const imgRef = useRef<any>();

  const json =
    uri && JSON.parse(atob(uri.slice("data:application/json;base64,".length)));

  useEffect(() => {
    if (!imgRef?.current || !json) return;

    imgRef.current.src = json.image;
  }, [imgRef, json]);

  return (
    <div
      className={cn(
        "rounded-full flex items-center justify-center overflow-hidden w-12",
        className
      )}
      style={{
        background: "linear-gradient(181.1deg, #686EFF 0.93%, #141520 99.07%)",
        width: `${size / 4}rem`,
      }}
    >
      {json ? (
        <img ref={imgRef} className="scale-[2]" />
      ) : (
        <p>{positionId.toString()}</p>
      )}
    </div>
  );
};
