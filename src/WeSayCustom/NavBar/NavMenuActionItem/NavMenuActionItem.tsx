import React from 'react';
import { ButtonActionItem, AnchorActionItem } from './styles';

export const ALLOWED_ELEMENTS = ['button', 'a'];

interface NavMenuActionItemProps {
  'data-qa-anchor'?: string;
  element?: 'button' | 'a';
  children?: React.ReactNode;
  active?: boolean;
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
}

const NavMenuActionItem = ({
  'data-qa-anchor': dataQaAnchor = '',
  children,
  active,
  className,
  onClick,
  element = 'a',
  disabled,
}: NavMenuActionItemProps) => {
  if (element === 'a') {
    return (
      <AnchorActionItem
        data-qa-anchor={dataQaAnchor}
        className={className}
        onClick={onClick}
        active={active}
      >
        <span className="actionItemChild">{children}</span>
      </AnchorActionItem>
    );
  }

  return (
    <ButtonActionItem
      data-qa-anchor={dataQaAnchor}
      className={className}
      active={active}
      disabled={disabled}
      onClick={onClick}
    >
      <span className="actionItemChild">{children}</span>
    </ButtonActionItem>
  );
};

export default NavMenuActionItem;
