import styled, { css } from 'styled-components';
import { SecondaryButton } from '~/core/components/Button';

const actionItemActiveStyles = css<{ active?: boolean }>`
  ${({ active, theme }) =>
    active &&
    `
      & > .actionItemChild {
        color: white;
      }
    `}
`;

const actionItemContainerStyles = css<{ active?: boolean }>`
  display: flex;
  align-items: center;
  padding: 5px 8px;
  color: ${({ active }) => (active ? 'white' : 'gray')};
  justify-content: left;
  &:hover:not(:disabled) {
    color: ${({ active }) => (active ? 'white' : 'gray')};
    border-bottom: ${({ active }) => (active ? '2px solid red' : 'none')};
  }

  &:disabled {
    color: ${({ theme }) => theme.palette.neutral.shade2};
    background-color: transparent;
  }

  ${actionItemActiveStyles}
`;

export const ButtonActionItem = styled(SecondaryButton)`
  ${actionItemContainerStyles};
  width: 100%;
`;

export const AnchorActionItem = styled.a<{ active?: boolean }>`
  cursor: pointer;
  ${actionItemContainerStyles}
  ${({ theme }) => theme.typography.bodyBold}
   ${({ active, theme }) =>
    active &&
    css`
      color: ${theme.palette.primary.main};
      border-bottom: 2px solid red;
    `};
`;
