import React from 'react';
import styled from 'styled-components';
import SideMenu from '~/core/components/SideMenu';
import SideSectionCommunity from '~/social/components/SideSectionCommunity';
import SideSectionMyCommunity from '~/social/components/SideSectionMyCommunity';
import UiKitSocialSearch from '~/social/components/SocialSearch';
import UiKitSocialAllSearch from '~/social/components/SocialAllSearch';
import Button from '~/core/components/Button';
import { PageTypes } from '~/social/constants';
import { useNavigation } from '~/social/providers/NavigationProvider';

const SocialSearch = styled(UiKitSocialSearch)`
  background: ${({ theme }) => theme.palette.system.background};
  padding: 0.5rem;
`;

const SocialAllSearch = styled(UiKitSocialAllSearch)`
  background: ${({ theme }) => theme.palette.system.background};
  padding: 0.5rem;
`;

export interface CommunitySideMenuProps {
  className?: string;
  activeCommunity?: string;
}

// const { onChangePage } = useNavigation();

const CommunitySideMenu = ({ className, activeCommunity }: CommunitySideMenuProps) => (
  <SideMenu data-qa-anchor="community-side-menu" className={className}>
    <SocialSearch sticky searchBy="communities" />
    {/* <SocialAllSearch /> */}
    {/* <Button className="bg-blue-400" onClick={() => onChangePage(PageTypes.Search)}>
      Buscar
    </Button> */}

    <SideSectionCommunity />

    <SideSectionMyCommunity activeCommunity={activeCommunity} />
  </SideMenu>
);

export default CommunitySideMenu;
