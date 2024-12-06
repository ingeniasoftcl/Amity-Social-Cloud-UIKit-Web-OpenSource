import React from 'react';
import {
  NavbarContainer,
  LeftSection,
  CenterSection,
  RightSection,
  NavbarLogo,
  SearchContainer,
} from './styles';

import { FaSignOutAlt, FaComments, FaHome, FaBell } from 'react-icons/fa';

import NavMenuActionItem from './NavMenuActionItem/NavMenuActionItem';
import { PageTypes } from '~/social/constants';
import { useNavigation } from '~/social/providers/NavigationProvider';
import { FormattedMessage } from 'react-intl';
import SocialSearch from '~/social/components/SocialSearch';

interface NavbarProps {
  view: 'home' | 'chat';
  setView: React.Dispatch<React.SetStateAction<'home' | 'chat'>>;
  shouldHideExplore?: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ view, setView, shouldHideExplore }) => {
  const { onChangePage, page } = useNavigation();
  const handleLogout = () => {
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    window.location.href = '/';
  };

  return (
    <NavbarContainer>
      <LeftSection>
        <NavbarLogo
          src="https://s3.us-east-1.amazonaws.com/we-say.com-assets/social-plus-wrap/WeSay_Logo_White.svg"
          alt="WeSay Logo"
        />
      </LeftSection>
      <CenterSection>
        <NavMenuActionItem
          data-qa-anchor="side-section-community-side-menu-action-item-news-feed-button"
          active={page.type === PageTypes.NewsFeed}
          onClick={() => onChangePage(PageTypes.NewsFeed)}
        >
          <FormattedMessage id="sidesectioncommunity.newfeed" />
        </NavMenuActionItem>

        {!shouldHideExplore && (
          <NavMenuActionItem
            data-qa-anchor="side-section-community-side-menu-action-item-explore-button"
            active={page.type === PageTypes.Explore}
            onClick={() => onChangePage(PageTypes.Explore)}
          >
            <FormattedMessage id="sidesectioncommunity.explore" />
          </NavMenuActionItem>
        )}
        <NavMenuActionItem
          data-qa-anchor="side-section-community-side-menu-action-item-explore-button"
          active={page.type === PageTypes.Search}
          onClick={() => onChangePage(PageTypes.Search)}
        >
          <FormattedMessage id="sidesectioncommunity.search" />
        </NavMenuActionItem>
      </CenterSection>
      <RightSection>
        <SearchContainer>
          <SocialSearch searchBy="communities" sticky={false} />
        </SearchContainer>
        <img src="https://via.placeholder.com/40" alt="User Avatar" />
        <button
          onClick={() => setView(view === 'home' ? 'chat' : 'home')}
          className="flex items-center gap-2 text-white"
        >
          {view === 'chat' ? (
            <>
              <FaHome size={24} aria-label="Home" />
            </>
          ) : (
            <>
              <FaComments size={24} aria-label="Chat" />
            </>
          )}
        </button>
        <button onClick={handleLogout} className="flex items-center gap-2 text-white">
          <FaSignOutAlt size={24} aria-label="Logout" />
        </button>
      </RightSection>
    </NavbarContainer>
  );
};

export default Navbar;
