import React, { useRef, useState } from 'react';
import styles from './SelectPostTargetPage.module.css';
import { useAmityPage } from '~/v4/core/hooks/uikit';
import { CloseButton } from '~/v4/social/elements/CloseButton/CloseButton';
import { Title } from '~/v4/social/elements/Title/Title';
import { MyTimelineAvatar } from '~/v4/social/elements/MyTimelineAvatar';
import { MyTimelineText } from '~/v4/social/elements/MyTimelineText';
import { useNavigation } from '~/v4/core/providers/NavigationProvider';
import { CommunityOfficialBadge } from '~/v4/social/elements/CommunityOfficialBadge';
import useCommunitiesCollection from '~/v4/social/hooks/collections/useCommunitiesCollection';
import { CommunityPrivateBadge } from '~/v4/social/elements/CommunityPrivateBadge';
import { CommunityDisplayName } from '~/v4/social/elements/CommunityDisplayName';
import { CommunityAvatar } from '~/v4/social/elements/CommunityAvatar';
import useIntersectionObserver from '~/v4/core/hooks/useIntersectionObserver';
import { useUser } from '~/v4/core/hooks/objects/useUser';
import { usePageBehavior } from '~/v4/core/providers/PageBehaviorProvider';
import useSDK from '~/v4/core/hooks/useSDK';
import { Mode } from '~/v4/social/pages/PostComposerPage/';
import { Button } from '~/v4/core/natives/Button';
import { canCreatePostCommunity } from '~/v4/social/utils';

export function SelectPostTargetPage() {
  const { client } = useSDK();

  const pageId = 'select_post_target_page';
  const { themeStyles } = useAmityPage({
    pageId,
  });
  const { onBack } = useNavigation();
  const { communities, hasMore, loadMore, isLoading } = useCommunitiesCollection({
    queryParams: { sortBy: 'displayName', limit: 20, membership: 'member' },
  });
  const { AmityPostTargetSelectionPage } = usePageBehavior();
  const [intersectionNode, setIntersectionNode] = useState<HTMLDivElement | null>(null);
  const { currentUserId } = useSDK();
  const { user } = useUser({ userId: currentUserId });
  useIntersectionObserver({
    onIntersect: () => {
      if (hasMore && isLoading === false) {
        loadMore();
      }
    },
    node: intersectionNode,
  });

  const renderCommunity = communities
    .filter((community) => canCreatePostCommunity(client, community))
    .map((community) => {
      return (
        <div
          onClick={() => {
            AmityPostTargetSelectionPage?.goToPostComposerPage?.({
              targetId: community.communityId,
              targetType: 'community',
              mode: Mode.CREATE,
              community: community,
            });
          }}
          key={community.communityId}
          className={styles.selectPostTargetPage__timeline}
        >
          <div className={styles.selectPostTargetPage__communityAvatar}>
            <CommunityAvatar pageId={pageId} community={community} />
          </div>
          <CommunityDisplayName pageId={pageId} community={community} />
          <div>
            {community.isOfficial && <CommunityOfficialBadge />}
            {!community.isPublic && <CommunityPrivateBadge />}
          </div>
        </div>
      );
    });

  return (
    <div className={styles.selectPostTargetPage} style={themeStyles}>
      <div className={styles.selectPostTargetPage__topBar}>
        <CloseButton
          imgClassName={styles.selectPostTargetPage__closeButton}
          pageId={pageId}
          onPress={onBack}
        />
        <Title pageId={pageId} titleClassName={styles.selectPostTargetPage__title} />
        <div />
      </div>
      <Button
        onPress={() => {
          AmityPostTargetSelectionPage?.goToPostComposerPage?.({
            mode: Mode.CREATE,
            targetId: null,
            targetType: 'user',
            community: undefined,
          });
        }}
        className={styles.selectPostTargetPage__timeline}
      >
        <MyTimelineAvatar pageId={pageId} userId={user?.userId} />
        <MyTimelineText pageId={pageId} />
      </Button>
      <div className={styles.selectPostTargetPage__line} />
      <div className={styles.selectPostTargetPage__myCommunities}>My Communities</div>
      {renderCommunity}
      <div ref={(node) => setIntersectionNode(node)} />
    </div>
  );
}
