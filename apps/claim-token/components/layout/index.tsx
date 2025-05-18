/* eslint-disable @next/next/no-before-interactive-script-outside-document */
import { useEffect, useState } from 'react';
import { Header } from './header/v3';
import { useRouter } from 'next/router';
import { cn } from '@nextui-org/theme';
import ConfettiComponent from '@honeypot/shared/components/effects/Confetti/Confetti';
import { Footer } from './footer';
import _ from 'lodash';
import { wallet } from '@honeypot/shared/lib/wallet';

export const Layout = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  const router = useRouter();
  const currentChain = wallet.currentChain;
  const [showInviteModal, setShowInviteModal] = useState(false);

  return (
    <div
      className={cn(
        "flex flex-col min-h-screen w-full overflow-x-hidden bg-[url('/images/icons/bg-honey.png')]",
        className
      )}
    >
      {/* {showInviteModal && (
        <InvitationCodeModal onSubmit={handleInviteCodeSubmit} />
      )} */}

      <ConfettiComponent />
      <div className="flex flex-col min-h-screen w-screen justify-between">
        <Header showProfile={false} />
        {!showInviteModal ? (
          wallet.currentChain && <div className="flex-1 flex">{children}</div>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <p className="text-lg">
                {showInviteModal
                  ? 'Please enter invitation code to continue'
                  : 'Coming soon check back later'}
              </p>
            </div>
          </div>
        )}
        <Footer />
      </div>
    </div>
  );
};
