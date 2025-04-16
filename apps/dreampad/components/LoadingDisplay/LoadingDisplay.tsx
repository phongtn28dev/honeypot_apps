import { PeddingSvg } from "../svg/Pedding";
import { RocketSvg } from "../svg/Rocket";

export default function LoadingDisplay() {
  return (
    <div className="w-full flex flex-col items-center">
      <div className="relative">
        <PeddingSvg />
        <div className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2">
          <RocketSvg />
        </div>
      </div>
      <div className="text-gold-primary mt-[59px] font-bold">Loading...</div>
    </div>
  );
}

export const LoadingContainer = ({
  isLoading,
  children,
  text,
}: {
  children: React.ReactNode;
  isLoading: boolean;
  text?: string;
}) => {
  return isLoading ? (
    <div className="w-full flex flex-col items-center">
      <div className="relative">
        <PeddingSvg />
        <div className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2">
          <RocketSvg />
        </div>
      </div>
      <div className="text-gold-primary mt-[59px] font-bold">Loading...</div>
    </div>
  ) : (
    children
  );
};
