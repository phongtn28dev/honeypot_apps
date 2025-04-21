import React, { HTMLAttributes } from 'react';
import { VscCopy } from 'react-icons/vsc';
import { cn, Tooltip } from '@nextui-org/react';
import { IconType } from 'react-icons/lib';
import { observer, useLocalObservable } from 'mobx-react-lite';
import clsx from 'clsx';
import { CopyToClipboard as CopyToClipboardComponent } from 'react-copy-to-clipboard';

interface CopyButtonProps {
  value: string;
  label?: string;
  className?: string;
  copyTip?: string;
}

export const CopyButton: React.FC<CopyButtonProps> = ({
  value,
  label,
  className,
  copyTip = 'Copy',
}) => {
  return (
    <div className={cn('space-y-0.5 sm:space-y-2', className)}>
      {label && (
        <div className="text-white text-sm font-medium leading-[normal]">
          {label}
        </div>
      )}
      <Copy
        className="w-full"
        content={copyTip}
        value={value}
        displayContent={
          <div className="size-5 sm:size-6 cursor-pointer flex items-center justify-center bg-white text-[#202020] border border-[#202020] rounded-md drop-shadow-[1px_1px_0px_#000] [stroke-width:0.75px] stroke-[#202020] hover:bg-[#FFCD4D]">
            <VscCopy className="size-3 sm:size-4" />
          </div>
        }
      />
    </div>
  );
};

export const CopyTrigger = observer(
  ({
    state,
    className,
    content,
    displayContent,
    copiedContent,
    ...props
  }: {
    state: {
      copied: boolean;
      isTooltipOpen: boolean;
      setTooltipOpen(value: boolean): void;
      setCopied(value: boolean): void;
    };
    displayContent?: React.ReactNode;
    content?: string;
    copiedContent?: string;
  } & Partial<IconType> &
    Partial<HTMLAttributes<any>>) => {
    return (
      <Tooltip
        isOpen={state.isTooltipOpen}
        content={state.copied ? copiedContent ?? 'Copied' : content ?? 'Copy'}
        classNames={{
          base: '',
          content: 'bg-[#6B4311]',
        }}
      >
        <span
          onMouseEnter={() => {
            state.setTooltipOpen(true);
          }}
          onMouseLeave={() => {
            state.setTooltipOpen(false);
            state.setCopied(false);
          }}
          className={clsx(
            'inline-block cursor-pointer hover:text-primary',
            className
          )}
          {...props}
        >
          {displayContent ? (
            displayContent
          ) : (
            <VscCopy className="w-full h-full"></VscCopy>
          )}
        </span>
      </Tooltip>
    );
  }
);

export const Copy = observer(
  ({
    value,
    displayContent,
    ...props
  }: { value: string; displayContent?: React.ReactNode } & Partial<IconType> &
    Partial<HTMLAttributes<any>>) => {
    const state = useLocalObservable(() => ({
      copied: false,
      isTooltipOpen: false,
      setTooltipOpen(value: boolean) {
        this.isTooltipOpen = value;
      },
      setCopied(value: boolean) {
        this.copied = value;
      },
    }));
    return (
      <CopyToClipboardComponent
        text={value}
        onCopy={() => {
          console.log('copied');
          state.setCopied(true);
        }}
      >
        <CopyTrigger
          displayContent={displayContent}
          state={state}
          {...props}
        ></CopyTrigger>
      </CopyToClipboardComponent>
    );
  }
);
