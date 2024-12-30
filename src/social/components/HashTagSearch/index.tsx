import React, { useMemo, useState, useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import axios from 'axios';

import CommunityHeader from '~/social/components/community/Header';
import UserHeader from '~/social/components/UserHeader';
import { PageTypes } from '~/social/constants';

import useCommunitiesList from '~/social/hooks/useCommunitiesList';
import { useNavigation } from '~/social/providers/NavigationProvider';
import {
  HashTagSearchContainer,
  HashTagSearchInput,
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
import { exact } from 'prop-types';

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

interface HashTagSearchProps {
  className?: string;
  hashTag?: string;
  setContents: (content: any) => void;
  contents: any;
  setSearching: (searching: boolean) => void;
}

const HashTagSearch = ({
  hashTag,
  className,
  contents,
  setContents,
  setSearching,
}: HashTagSearchProps) => {
  const [searchValue, setSearchValue] = useState(hashTag || '');
  const { onChangePage, page } = useNavigation();

  useEffect(() => {
    if (hashTag) {
      setSearchValue(hashTag);
      fetchNumberOfPosts(hashTag);
    }
  }, [hashTag]);

  // useEffect(() => {
  //   console.log('contents', contents);
  // }, [contents]);

  const fetchNumberOfPosts = async (hashTag?: string) => {
    onChangePage(PageTypes.HashTag);
    try {
      setSearching(true);
      console.log('searching for:', searchValue);
      const response = await axios.get('https://dev-backend.we-say.com/api/posts/search-posts', {
        headers: {
          Authorization: `Bearer ${getCookie('token')}`,
        },
        params: {
          query: hashTag || searchValue,
          exactMatch: true,
        },
      });

      if (response.data.data.posts) {
        setContents(response.data.data.posts);
        console.log(response.data.data.posts);
        console.log('new content', contents, response.data.data.posts);
      } else {
        console.log('response', response.data);
        setContents([]);
        console.log('new null content', contents);
      }
      setSearching(false);
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
    <HashTagSearchContainer className={className}>
      <FormattedMessage id="exploreHeader.searchCommunityPlaceholder">
        {(placeholder) => (
          <Container className="flex space-y-2" style={{ marginBottom: '5px' }}>
            <input
              data-qa-anchor="social-search-input"
              value={searchValue}
              placeholder="Search for posts with hashtags"
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
    </HashTagSearchContainer>
  );
};

export default (props: HashTagSearchProps) => {
  const CustomComponentFn = useCustomComponent<HashTagSearchProps>('HashTagSearch');

  if (CustomComponentFn) return CustomComponentFn(props);

  return <HashTagSearch {...props} />;
};
