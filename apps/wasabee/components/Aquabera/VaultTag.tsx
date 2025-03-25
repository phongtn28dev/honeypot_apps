import { Tooltip } from '@nextui-org/react';
import { observer } from 'mobx-react-lite';

export const VaultTagContent = observer(
  ({
    tag,
    color,
    tooltip,
  }: {
    tag: string;
    color: string;
    tooltip?: string;
  }) => {
    return (
      <div
        className="flex items-center gap-2 rounded-full px-2 cursor-pointer"
        style={{ backgroundColor: color }}
      >
        <span className="text-sm">{tag}</span>
      </div>
    );
  }
);

export const VaultTag = observer(
  ({
    tag,
    color,
    tooltip,
  }: {
    tag: string;
    color: string;
    tooltip?: string;
  }) => {
    return (
      <div className="flex items-center gap-2 relative mb-2">
        <Tooltip
          content={tooltip}
          showArrow
          placement="top"
          delay={0}
          closeDelay={0}
        >
          <div className="cursor-pointer">
            <VaultTagContent tag={tag} color={color} />
          </div>
        </Tooltip>
      </div>
    );
  }
);
