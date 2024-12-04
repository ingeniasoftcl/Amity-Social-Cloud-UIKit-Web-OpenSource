import React, { useEffect, useState } from 'react';
import Feed from '~/social/components/Feed';
import { PageTypes } from '~/social/constants';
import { useNavigation } from '~/social/providers/NavigationProvider';
import { FeedScrollContainer } from '~/social/components/Feed/styles';
import axios from 'axios';
import LoadMoreWrapper from '~/social/components/LoadMoreWrapper';
import Post from '~/social/components/post/Post';
import DefaultPostRenderer from '~/social/components/post/Post/DefaultPostRenderer';
import SocialAllSearch from '~/social/components/SocialAllSearch';
import { Wrapper } from './styles';
import ClipLoader from 'react-spinners/ClipLoader';
import { Grid } from '../UserFeed/Followers/styles';
import EmptyFeedIcon from '~/icons/EmptyFeed';
import { ListEmptyState } from '~/social/pages/UserFeed/Followers/styles';
// import { AmityStoryRepository } from '@amityco/ts-sdk';

const SearchFeed = () => {
  const { onChangePage } = useNavigation();

  const [contents, setContents] = useState<{ postId: string }[] | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [loadMoreHasBeenCalled, setLoadMoreHasBeenCalled] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [searching, setSearching] = useState(false);

  // const fetchMore = async () => {
  //   try {
  //     const response = await axios.get('http://localhost:3001/api/posts/search-posts', {
  //       headers: {
  //         Authorization: `Bearer ${getCookie('token')}`,
  //       },
  //     });
  //     console.log('response', response);
  //     setContents(response.data.data.posts);
  //   } catch (error) {
  //     console.error('Failed to fetch User Posts:', error);
  //   }
  // };

  // useEffect(() => {
  //   fetchMore();
  //   console.log('content', contents);
  // }, []);

  const getCookie = (name: string) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    console.log(parts[1]);
    if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
    return null;
  };

  function renderLoadingSkeleton() {
    return new Array(3).fill(3).map((_, index) => <DefaultPostRenderer key={index} loading />);
  }

  const loadMore = () => {
    setLoadMoreHasBeenCalled(true);
    if (hasMore && !isLoading) {
      // fetchMore();
    }
  };

  return (
    <Wrapper data-qa-anchor="news-feed">
      <SocialAllSearch setContent={setContents} setSearching={setSearching} />
      {!searching && contents !== undefined && contents !== null && contents.length > 0 ? (
        <LoadMoreWrapper
          hasMore={hasMore}
          // loadMore={loadMore}
          className="load-more no-border"
          contentSlot={contents.map((content) => (
            <Post
              key={content.postId}
              postId={content.postId}
              hidePostTarget={false}
              // readonly={readonly}
              // onDeleted={(postId) => removeItem(postId)}
            />
          ))}
        />
      ) : (
        <div>
          {searching ? (
            <ClipLoader
              color="#b5b5b5"
              loading={searching}
              size={20}
              cssOverride={{ display: 'block', margin: '0 auto' }}
            />
          ) : contents !== null ? (
            // <p>Post not found</p>
            <Grid>
              <ListEmptyState
                icon={<EmptyFeedIcon width={48} height={48} />}
                title="It's empty here..."
                description={'Posts not found'}
              />
            </Grid>
          ) : (
            <p
              style={{
                display: 'flex',
                justifyContent: 'center',
                fontWeight: 'bold',
                textAlign: 'center',
                padding: '20px',
                color: '#b5b5b5',
              }}
            >
              Search
            </p>
          )}
        </div>
      )}
    </Wrapper>
  );

  return <div>Search</div>;
  // return (
  //   <FeedScrollContainer dataLength={contents.length} next={loadMore} hasMore={false} loader={null}>
  //     {/* {!isHiddenProfile ? ( */}
  //     <>
  //       {isLoading && !loadMoreHasBeenCalled ? renderLoadingSkeleton() : null}

  //       {(!isLoading || loadMoreHasBeenCalled) && contents.length > 0 && (
  //         <LoadMoreWrapper
  //           hasMore={hasMore}
  //           // loadMore={loadMore}
  //           className="load-more no-border"
  //           contentSlot={contents.map((content) => (
  //             <Post
  //               key={content.postId}
  //               postId={content.postId}
  //               hidePostTarget={false}
  //               // readonly={readonly}
  //               // onDeleted={(postId) => removeItem(postId)}
  //             />
  //           ))}
  //         />
  //       )}

  //       {/* {!isLoading && contents.length === 0 && <div>Search</div>} */}

  //       {/* {isLoading && loadMoreHasBeenCalled ? renderLoadingSkeleton() : null} */}
  //     </>
  //     {/* ) : (
  //       <PrivateFeed />
  //     )} */}
  //   </FeedScrollContainer>
  // );
};
export default SearchFeed;
