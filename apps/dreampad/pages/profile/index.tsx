import { truncate } from '@/lib/format';
import { wallet } from '@honeypot/shared/lib/wallet';
import { observer } from 'mobx-react-lite';
import Link from 'next/link';
import CardContainer from '@/components/CardContianer/v3';
import Image from 'next/image';
import Copy from '@/components/Copy/v3';

export const Profile = observer(() => {
  return (
    <div className="w-full max-w-[1200px] mx-auto px-4 xl:px-0 font-gliker">
      <div className="flex flex-col gap-6">
        {wallet.isInit && (
          <div className="space-y-16">
            <CardContainer showBottomBorder={false}>
              <div className="flex justify-between items-start w-full py-5 px-8">
                <div className="flex flex-col gap-8">
                  <div className="flex items-center gap-4">
                    <Image
                      width={72}
                      height={72}
                      alt="avatar"
                      src="/images/v3/avatar.svg"
                      className="stroke-1 stroke-black drop-shadow-[0_1px_0_#000]"
                    />
                    <div className="flex flex-col gap-1">
                      <p className="text-3xl text-[#0D0D0D] text-shadow-[1px_2px_0_#AF7F3D] text-stroke-0.5 text-stroke-white">
                        My Account
                      </p>
                      <div className="flex items-center justify-between w-full text-[#4D4D4D]">
                        <Link
                          target="_blank"
                          className="text-[#4D4D4D] hover:text-[#0D0D0D] hover:underline decoration-2 transition-colors"
                          href={`https://bartio.beratrail.io/address/${wallet.account}`}
                        >
                          {truncate(wallet.account, 10)}
                        </Link>
                        <Copy value={wallet.account} copyTip="Copy address" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContainer>
          </div>
        )}
      </div>
    </div>
  );
});

export default Profile;
