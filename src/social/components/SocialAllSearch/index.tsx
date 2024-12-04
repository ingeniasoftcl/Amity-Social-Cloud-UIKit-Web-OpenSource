import React, { useMemo, useState, useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import axios from 'axios';

import CommunityHeader from '~/social/components/community/Header';
import UserHeader from '~/social/components/UserHeader';
import { PageTypes } from '~/social/constants';

import useCommunitiesList from '~/social/hooks/useCommunitiesList';
import { useNavigation } from '~/social/providers/NavigationProvider';
import {
  SocialSearchContainer,
  SocialSearchInput,
  SearchIcon,
  SearchIconContainer,
} from './styles';
import { useUserQueryByDisplayName } from '~/core/hooks/useUserQuery';
import { isNonNullable } from '~/helpers/utils';
import Tabs from '~/core/components/Tabs';
import styled from 'styled-components';
import Menu from '~/core/components/Menu';
import { useInputAutocomplete } from '~/core/components/InputAutocomplete';
import InputText from '~/core/components/InputText';
import Suggestions from '~/core/components/Suggestions';
import Button from '~/core/components/Button';
import { useCustomComponent } from '~/core/providers/CustomComponentsProvider';
import useCommunitiesCollection from '~/social/hooks/collections/useCommunitiesCollection';
import { Handle } from 'vaul';

const Container = styled.div`
  position: relative;
`;

const SuggestionsMenu = styled(Menu)`
  z-index: 10;
  position: absolute;
  top: calc(100% + 0.25rem);
  width: 100%;
  color: ${({ theme }) => theme.palette.base.main};
`;

// const CommunitySocialSearchTab = ({
//   searchValue,
//   isOpen,
// }: {
//   searchValue: string;
//   isOpen?: boolean;
// }) => {
//   const { onClickCommunity } = useNavigation();
//   const { communities, hasMore, loadMore } = useCommunitiesCollection({
//     displayName: searchValue,
//   });

//   const filteredCommunities = communities.filter(isNonNullable);

//   const filteredCommunityItems = filteredCommunities.map((community) => community.displayName);

//   if (!isOpen) return null;

//   return (
//     <SuggestionsMenu>
//       <Suggestions
//         items={filteredCommunityItems}
//         append={
//           hasMore && loadMore ? (
//             <Button fullWidth onClick={loadMore}>
//               <FormattedMessage id="loadMore" />
//             </Button>
//           ) : null
//         }
//         onPick={(index) =>
//           filteredCommunities[index]
//             ? onClickCommunity(filteredCommunities[index].communityId)
//             : null
//         }
//         renderItem={(displayName) => {
//           const community = communities.find((community) => community.displayName === displayName);

//           return community && <CommunityHeader communityId={community.communityId} />;
//         }}
//       />
//     </SuggestionsMenu>
//   );
// };

// const AccountSocialSearchTab = ({
//   searchValue,
//   isOpen,
// }: {
//   searchValue: string;
//   isOpen?: boolean;
// }) => {
//   const { onClickUser } = useNavigation();
//   const { users, hasMore, loadMore } = useUserQueryByDisplayName(searchValue);

//   const filteredUsers = users.filter(isNonNullable);

//   const filteredUserItems = filteredUsers.map((user) => user.displayName);

//   if (!isOpen) return null;

//   return (
//     <SuggestionsMenu>
//       <Suggestions
//         items={filteredUserItems}
//         append={
//           hasMore && loadMore ? (
//             <Button fullWidth onClick={loadMore}>
//               <FormattedMessage id="loadMore" />
//             </Button>
//           ) : null
//         }
//         onPick={(index) => (filteredUsers[index] ? onClickUser(filteredUsers[index].userId) : null)}
//         renderItem={(displayName) => {
//           const user = users.find((user) => user.displayName === displayName);

//           return user && <UserHeader userId={user.userId} isBanned={user?.isGlobalBanned} />;
//         }}
//       />
//     </SuggestionsMenu>
//   );
// };

interface SocialAllSearchProps {
  className?: string;
  setContent?: (content: any) => void;
  setSearching?: (searching: boolean) => void;
}

const SocialAllSearch = ({ className, setContent, setSearching }: SocialAllSearchProps) => {
  const [searchValue, setSearchValue] = useState('');
  const { onChangePage, page } = useNavigation();
  // const { open, close, isOpen, containerRef } = useInputAutocomplete({
  //   value: searchValue,
  // });

  // function onClear() {
  //   setSearchValue('');
  // }

  const fetchNumberOfPosts = async () => {
    onChangePage(PageTypes.Search);
    console.log('Fetching Search All');
    try {
      setSearching?.(true);
      console.log(searchValue);
      const response = await axios.get('https://dev-backend.we-say.com/api/posts/search-posts', {
        headers: {
          Authorization: `Bearer ${getCookie('token')}`,
        },
        params: {
          query: searchValue,
        },
      });
      console.log(response.data);
      if (response.data) {
        setContent?.(response.data.data.posts);
      } else {
        setContent?.([]);
      }
      setSearching?.(false);
    } catch (error) {
      console.error('Failed to fetch Search All:', error);
    }
  };

  const getCookie = (name: string) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    console.log(parts[1]);
    if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
    return null;
  };

  // useEffect(() => {
  //   const handleKeyDown = (e: { key: string }) => {
  //     console.log(e.key);
  //     if (e.key === 'Enter') {
  //       fetchNumberOfPosts();
  //     }
  //   };
  //   document.addEventListener('keydown', handleKeyDown);

  //   return () => {
  //     document.removeEventListener('keydown', handleKeyDown);
  //   };
  // }, []);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      fetchNumberOfPosts();
    }
  };

  return (
    <SocialSearchContainer className={className}>
      <FormattedMessage id="exploreHeader.searchCommunityPlaceholder">
        {(placeholder) => (
          <Container className="flex space-y-2" style={{ marginBottom: '5px' }}>
            <input
              data-qa-anchor="social-search-input"
              value={searchValue}
              placeholder="Search for posts"
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              style={{
                width: '100%',
                padding: '0.5rem',
                borderRadius: '5px',
              }}
            />
            <Button onClick={fetchNumberOfPosts}>
              <SearchIcon />
            </Button>
          </Container>
        )}
      </FormattedMessage>
    </SocialSearchContainer>
  );
};

export default (props: SocialAllSearchProps) => {
  const CustomComponentFn = useCustomComponent<SocialAllSearchProps>('SocialSearch');

  if (CustomComponentFn) return CustomComponentFn(props);

  return <SocialAllSearch {...props} />;
};
