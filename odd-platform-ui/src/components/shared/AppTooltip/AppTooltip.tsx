import React from 'react';
import type { Theme, TooltipProps } from '@mui/material';
import type { SxProps } from '@mui/system';
import * as S from './AppTooltipStyles';

interface AppTooltipProps
  extends Pick<TooltipProps, 'placement' | 'followCursor' | 'componentsProps'> {
  title: React.ReactElement | string | undefined;
  type?: S.TooltipColorTypes;
  checkForOverflow?: boolean;
  children?: React.ReactNode | React.ReactElement | string;
  childSx?: SxProps<Theme>;
}

const AppTooltip: React.FC<AppTooltipProps> = ({
  placement = 'bottom-start',
  children,
  followCursor = true,
  title,
  type = 'light',
  checkForOverflow = true,
  childSx,
  componentsProps,
}) => {
  const [isOverflowed, setIsOverflow] = React.useState(checkForOverflow);
  const childrenRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (childrenRef.current && checkForOverflow) {
      const element = childrenRef.current.firstElementChild || childrenRef.current;
      const { scrollWidth, clientWidth } = element;
      setIsOverflow(scrollWidth > clientWidth);
    }
  }, [childrenRef.current, childrenRef.current?.firstElementChild, checkForOverflow]);

  return (
    <S.AppTooltip
      $type={type}
      title={title || ''}
      placement={placement}
      followCursor={followCursor}
      disableInteractive
      disableHoverListener={checkForOverflow ? !isOverflowed : false}
      componentsProps={componentsProps}
    >
      <S.ChildrenContainer
        $isCursorPointer={checkForOverflow ? isOverflowed : true}
        $isOverflowed={isOverflowed}
        ref={childrenRef}
        sx={childSx}
      >
        {children}
      </S.ChildrenContainer>
    </S.AppTooltip>
  );
};
export default AppTooltip;
