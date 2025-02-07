import React, { useEffect, useState } from 'react';
import Truncate from 'react-truncate-markup';
import millify from 'millify';
import { FormattedMessage, useIntl } from 'react-intl';

import Button, { PrimaryButton } from '~/core/components/Button';

import { backgroundImage as UserImage } from '~/icons/User';

import BanIcon from '~/icons/Ban';

import axios from 'axios';

import {
  Avatar,
  Container,
  ProfileName,
  Header,
  Description,
  PlusIcon,
  PencilIcon,
  PendingIcon,
  OptionMenu,
  CountContainer,
  ClickableCount,
  PendingNotification,
  NotificationTitle,
  NotificationBody,
  TitleEllipse,
  PendingIconContainer,
  ActionButtonContainer,
  ProfileNameWrapper,
} from './styles';

import { isNonNullable } from '~/helpers/utils';
import useUser from '~/core/hooks/useUser';
import { UserRepository } from '@amityco/ts-sdk';
import useFollowersList from '~/core/hooks/useFollowersList';
import { useCustomComponent } from '~/core/providers/CustomComponentsProvider';
import useUserFlaggedByMe from '~/social/hooks/useUserFlaggedByMe';
import useFollowersCollection from '~/core/hooks/collections/useFollowersCollection';
import { useConfirmContext } from '~/core/providers/ConfirmProvider';
import getStories from '@amityco/ts-sdk';
import { StoryRepository } from '@amityco/ts-sdk';
import { getActiveStoriesByTarget } from '@amityco/ts-sdk/dist/storyRepository/observers/getActiveStoriesByTarget';

interface UIUserInfoProps {
  userId?: string | null;
  currentUserId?: string | null;
  fileUrl?: string;
  displayName?: string;
  description?: string;
  isMyProfile?: boolean;
  onEditUser?: (userId: string) => void;
  onFollowRequest?: () => void;
  onUnFollow?: () => void;
  onFollowDecline?: () => void | Promise<void>;
  isFollowPending?: boolean;
  isFollowNone?: boolean;
  isFollowAccepted?: boolean;
  onPendingNotificationClick?: () => void;
  onFollowingCountClick?: () => void;
  onFollowerCountClick?: () => void;
  OnPostCountClick?: () => void;
  onReportClick?: () => void;
  postCount?: number;
  followerCount?: number;
  followingCount?: number;
  isPrivateNetwork?: boolean;
  isFlaggedByMe?: boolean;
}

const UIUserInfo = ({
  userId,
  currentUserId,
  fileUrl,
  displayName,
  description,
  isMyProfile,
  onEditUser,
  onFollowRequest,
  onFollowDecline,
  onUnFollow,
  onPendingNotificationClick,
  onFollowingCountClick,
  onFollowerCountClick,
  OnPostCountClick,
  onReportClick,
  isFollowPending,
  isFollowNone,
  isFollowAccepted,
  followerCount = 0,
  followingCount = 0,
  isPrivateNetwork,
}: UIUserInfoProps) => {
  const user = useUser(userId);
  const { formatMessage } = useIntl();
  const { isFlaggedByMe } = useUserFlaggedByMe(userId || undefined);
  const { confirm } = useConfirmContext();
  const [numberOfPosts, setNumberOfPosts] = useState<number>(0);
  const [stories, setStories] = useState([]);

  // Added to count users posts

  useEffect(() => {
    const fetchNumberOfPosts = async () => {
      console.log('Fetching number of posts');
      try {
        const response = await axios.get('http://localhost:3001/api/posts/number-of-posts', {
          headers: {
            Authorization: `Bearer ${getCookie('token')}`,
          },
        });
        console.log(response.data);
        setNumberOfPosts(response.data.numberOfPosts);
      } catch (error) {
        console.error('Failed to fetch User Posts:', error);
      }
    };

    fetchNumberOfPosts();

    const unsubscribe = StoryRepository.getStoriesByTargetIds(
      {
        targets: [
          {
            targetType: 'community',
            targetId: '670d18dcf3aab15fe22ee7f9',
          },
        ],
        options: {
          orderBy: 'asc', // or desc
        },
      },
      ({ data: storiesData, loading, error }) => {
        // Pagination is not supported in this function
        if (error) {
          console.log('error', error);
          // Handle any errors that occur during retrieving data
        }
        if (loading) {
          console.log('loading', loading);
          // Handle the loading state, e.g., show a loading spinner
        }
        if (storiesData) {
          // Process the data
          console.log('data', storiesData);
        }
      },
    );
    // Call to unsubscribe live collection
    unsubscribe();
  }, []);

  const getCookie = (name: string) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    console.log(parts[1]);
    if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
    return null;
  };

  //

  const { followers: pendingUsers } = useFollowersCollection({
    userId: currentUserId,
    status: 'pending',
  });

  // const storyRepository = StoryRepository;

  // console.log('storyRepository', storyRepository);

  const title = user?.displayName
    ? formatMessage({ id: 'user.unfollow.confirm.title' }, { displayName: user.displayName })
    : formatMessage({ id: 'user.unfollow.confirm.title.thisUser' });

  const content = user?.displayName
    ? formatMessage({ id: 'user.unfollow.confirm.body' }, { displayName: user.displayName })
    : formatMessage({ id: 'user.unfollow.confirm.body.thisUser' });

  const allOptions: Array<{ name: string; action: () => void }> = [
    isFollowAccepted && !isMyProfile
      ? {
          name: formatMessage({ id: 'user.unfollow' }),
          action: () =>
            confirm({
              title,
              content,
              cancelText: formatMessage({ id: 'buttonText.cancel' }),
              okText: formatMessage({ id: 'buttonText.unfollow' }),
              onOk: async () => {
                await onUnFollow?.();
              },
            }),
        }
      : undefined,
    !isMyProfile
      ? {
          name: isFlaggedByMe
            ? formatMessage({ id: 'report.unreportUser' })
            : formatMessage({ id: 'report.reportUser' }),
          action: () => {
            onReportClick?.();
          },
        }
      : undefined,
  ].filter(isNonNullable);

  return (
    <Container data-qa-anchor="user-info">
      <Header>
        <Avatar
          data-qa-anchor="user-info-profile-image"
          avatar={fileUrl}
          backgroundImage={UserImage}
        />
        <ActionButtonContainer>
          {isMyProfile ? (
            <Button
              data-qa-anchor="user-info-edit-profile-button"
              onClick={() => user?.userId && onEditUser?.(user.userId)}
            >
              <PencilIcon /> <FormattedMessage id="user.editProfile" />
            </Button>
          ) : (
            <>
              {isPrivateNetwork && isFollowPending && (
                <Button onClick={() => onFollowDecline?.()}>
                  <PendingIconContainer>
                    <PendingIcon />
                  </PendingIconContainer>
                  <FormattedMessage id="user.cancel_follow" />
                </Button>
              )}
              {isFollowNone && (
                <PrimaryButton onClick={() => onFollowRequest?.()}>
                  <PlusIcon /> <FormattedMessage id="user.follow" />
                </PrimaryButton>
              )}
            </>
          )}
        </ActionButtonContainer>
        <OptionMenu options={allOptions} pullRight={false} />
      </Header>
      <ProfileNameWrapper>
        <Truncate lines={3}>
          <ProfileName data-qa-anchor="user-info-profile-name">{displayName}</ProfileName>
        </Truncate>

        {user?.isGlobalBanned ? (
          <BanIcon style={{ marginLeft: '0.265rem', marginTop: '1px' }} />
        ) : null}
      </ProfileNameWrapper>
      <CountContainer>
        {/* This is the counter for the number of posts */}

        <ClickableCount
          onClick={() => {
            OnPostCountClick?.();
            // setActiveTab(UserFeedTabs.FOLLOWERS);
            // setTimeout(() => setFollowActiveTab(FollowersTabs.FOLLOWERS), 250);
          }}
        >
          {millify(numberOfPosts)} <FormattedMessage id="posts" />
        </ClickableCount>

        {/*  */}

        <ClickableCount
          onClick={() => {
            // setActiveTab(UserFeedTabs.FOLLOWERS);
            // setTimeout(() => setFollowActiveTab(FollowersTabs.FOLLOWINGS), 250);
            onFollowingCountClick?.();
          }}
        >
          {millify(followingCount)} <FormattedMessage id="counter.followings" />
        </ClickableCount>
        <ClickableCount
          onClick={() => {
            onFollowerCountClick?.();
            // setActiveTab(UserFeedTabs.FOLLOWERS);
            // setTimeout(() => setFollowActiveTab(FollowersTabs.FOLLOWERS), 250);
          }}
        >
          {millify(followerCount)} <FormattedMessage id="counter.followers" />
        </ClickableCount>
      </CountContainer>
      <Description data-qa-anchor="user-info-description">{description}</Description>

      {isMyProfile && pendingUsers.length > 0 && isPrivateNetwork && (
        <PendingNotification
          onClick={() => {
            onPendingNotificationClick?.();
            // setActiveTab(UserFeedTabs.FOLLOWERS);
            // setTimeout(() => setFollowActiveTab(PENDING_TAB), 250);
          }}
        >
          <NotificationTitle>
            <TitleEllipse />
            <FormattedMessage id="follow.pendingNotification.title" />
          </NotificationTitle>
          <NotificationBody>
            <FormattedMessage id="follow.pendingNotification.body" />
          </NotificationBody>
        </PendingNotification>
      )}
    </Container>
  );
};

export default (props: UIUserInfoProps) => {
  const CustomComponentFn = useCustomComponent<UIUserInfoProps>('UIUserInfo');

  if (CustomComponentFn) return CustomComponentFn(props);

  return <UIUserInfo {...props} />;
};
