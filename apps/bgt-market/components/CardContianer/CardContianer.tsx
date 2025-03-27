import { cn } from '@/lib/tailwindcss';
import { globalService } from '@/services/global';
import { useObserver } from 'mobx-react-lite';

interface CardContianer {
  children: React.ReactNode;
  autoSize?: boolean;
  addtionalClassName?: string;
  childrenAutoSize?: boolean;
}

export default function CardContianer(props: CardContianer) {
  const bgtMarketBaseToken = useObserver(
    () => globalService.BgtMarketBaseToken
  );
  return (
    <div
      className={cn(
        'flex-1 flex w-full justify-center items-center gap-[1rem] bg-[var(--card-color,#271A0C)] pl-3 pr-4 py-3 rounded-2xl  border-3 border-solid border-[#F7931A10] hover:border-[#F7931A] transition-all',
        props.autoSize ? ' w-full h-full' : '',
        props.childrenAutoSize ? '*:w-full *:h-full' : '',
        props.addtionalClassName,
        bgtMarketBaseToken === 'BERA' && 'bg-[#453100] text-white',
        bgtMarketBaseToken === 'HONEY' && 'bg-[#FFCD4D] text-black'
      )}
    >
      {props.children}
    </div>
  );
}
