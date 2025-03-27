/* eslint-disable @next/next/no-before-interactive-script-outside-document */
import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import { Header } from './header/v3';
import { useRouter } from 'next/router';
import { cn } from '@/lib/tailwindcss';
import ConfettiComponent from '../atoms/Confetti/Confetti';
import PopOverModal from '../PopOverModal/PopOverModal';
import { trpcClient } from '@/lib/trpc';
import { popmodal } from '@/services/popmodal';
import { metadata } from '@/config/metadata';
import AnnouncementBar from './AnnouncementBar';
import Link from 'next/link';
import ChatWidget from '../ServiceChat';
import { Footer } from './footer';
import { chatService, questionTitles } from '@/services/chat';
import _ from 'lodash';
import { notificationService } from '@/services/notification';
import { wallet } from '@/services/wallet';
import { InvitationCodeModal } from '../InvitationCodeModal/InvitationCodeModal';

export const Layout = observer(
  ({
    children,
    className,
  }: {
    children: React.ReactNode;
    className?: string;
  }) => {
    const [showInviteModal, setShowInviteModal] = useState(false);

    useEffect(() => {
      const inviteCode = localStorage.getItem('inviteCode');
      if (!inviteCode) {
        setShowInviteModal(true);
      }
    }, []);

    const handleInviteCodeSubmit = async (code: string) => {
      try {
        const response = await fetch('/api/verify-invitation-code', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ code }),
        });

        const data = await response.json();

        if (data.success) {
          localStorage.setItem('inviteCode', code);
          setShowInviteModal(false);
        } else {
          throw new Error(data.message || 'Invalid invitation code');
        }
      } catch (error) {
        throw new Error('Invalid invitation code');
      }
    };

    return (
      <div
        className={cn(
          "flex flex-col min-h-screen w-full overflow-x-hidden overflow-y-auto bg-[url('/images/icons/bg-honey.png')]",
          className
        )}
      >
        {/* {showInviteModal && (
          <InvitationCodeModal onSubmit={handleInviteCodeSubmit} />
        )} */}
        <ConfettiComponent />
        <PopOverModal />
        <Header />

        <div className="flex-1 flex">{children}</div>

        <Footer />
      </div>
    );
  }
);
