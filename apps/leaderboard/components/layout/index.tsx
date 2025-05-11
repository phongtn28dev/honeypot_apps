import { Header } from './header/v3';
import { cn } from '@nextui-org/react';
import ConfettiComponent from '@honeypot/shared/components/atoms/Confetti/Confetti';
import { Footer } from './footer';
import _ from 'lodash';

export const Layout = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "flex flex-col min-h-screen w-full overflow-x-hidden overflow-y-auto bg-[url('/images/icons/bg-honey.png')]",
        className
      )}
    >
      <ConfettiComponent />
      <Header />
      <div className="flex-1 flex">{children}</div>
      <Footer />
    </div>
  );
};
