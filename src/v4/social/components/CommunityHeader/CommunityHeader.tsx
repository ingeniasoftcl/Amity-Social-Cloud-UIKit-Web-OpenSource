import React from 'react';
import styles from './CommunityHeader.module.css';
import { StoryTab } from '~/v4/social/components/StoryTab';
import { CommunityPendingPost } from '~/v4/social/elements/CommunityPendingPost';
import { CommunityProfileTab } from '~/v4/social/elements/CommunityProfileTab';
import { CommunityCover } from '~/v4/social/elements/CommunityCover';
import { CommunityJoinButton } from '~/v4/social/elements/CommunityJoinButton';
import { useCommunityInfo } from '~/v4/social/hooks/useCommunityInfo';
import { useCommunityTabContext } from '~/v4/core/providers/CommunityTabProvider';
import { useNavigation } from '~/v4/core/providers/NavigationProvider';
import { CommunityVerifyBadge } from '~/v4/social/elements/CommunityVerifyBadge';
import { CommunityDescription } from '~/v4/social/elements/CommunityDescription';
import { CommunityName } from '~/v4/social/elements/CommunityName';
import { CommunityInfo } from '~/v4/social/elements/CommunityInfo';
import { CommunityCategories } from '~/v4/social/internal-components/CommunityCategories/CommunityCategories';
import Lock from '~/v4/icons/Lock';

interface CommunityProfileHeaderProps {
  pageId?: string;
  community: Amity.Community;
}

export const CommunityHeader: React.FC<CommunityProfileHeaderProps> = ({
  pageId = '*',
  community,
}) => {
  const componentId = 'community_header';
  const { onBack, onEditCommunity } = useNavigation();
  const { activeTab, setActiveTab } = useCommunityTabContext();

  const {
    communityCategories,
    avatarFileUrl,
    joinCommunity,
    pendingPostsCount,
    canReviewCommunityPosts,
  } = useCommunityInfo(community.communityId);

  const handleTabChange = (tab: 'community_feed' | 'community_pin') => {
    setActiveTab(tab);
  };

  const isShowPendingPost =
    community.isJoined && community.postSetting && canReviewCommunityPosts && pendingPostsCount > 0;

  return (
    <div className={styles.container}>
      <CommunityCover
        pageId={pageId}
        componentId={componentId}
        image={avatarFileUrl}
        onBack={onBack}
        onClickMenu={() => onEditCommunity(community.communityId)}
      />
      <div className={styles.content}>
        <div className={styles.name}>
          {!community.isPublic && <Lock className={styles.communityProfile__privateIcon} />}
          <CommunityName pageId={pageId} componentId={componentId} name={community.displayName} />
          {community.isOfficial && <CommunityVerifyBadge />}
        </div>

        <div className={styles.communityProfile__communityCategories}>
          <CommunityCategories
            pageId={pageId}
            componentId={componentId}
            community={community}
            minCategoryCharacters={10}
          />
        </div>

        <CommunityDescription
          pageId={pageId}
          componentId={componentId}
          description={community.description || ''}
        />

        <div className={styles.communityProfile__communityInfo__container}>
          <CommunityInfo
            pageId={pageId}
            componentId={componentId}
            count={community.postsCount}
            text="posts"
          />
          <div className={styles.divider}></div>
          <CommunityInfo
            pageId={pageId}
            componentId={componentId}
            count={community.membersCount}
            text="members"
            onClick={() => onEditCommunity(community.communityId, 'MEMBERS')}
          />
        </div>

        {!community.isJoined && community.isPublic && (
          <div className={styles.communityProfile__joinButton__container}>
            <CommunityJoinButton
              pageId={pageId}
              componentId={componentId}
              onClick={joinCommunity}
            />
          </div>
        )}
        <div>
          <StoryTab type="communityFeed" pageId={pageId} communityId={community.communityId} />
        </div>
        {/* {isShowPendingPost && (
          <div className={styles.communityProfile__pendingPost__container}>
            <CommunityPendingPost pageId={pageId} componentId={componentId}  />
          </div>
        )} */}
        <CommunityProfileTab pageId={pageId} activeTab={activeTab} onTabChange={handleTabChange} />
      </div>
      <div className={styles.communityProfile__divider} />
    </div>
  );
};
