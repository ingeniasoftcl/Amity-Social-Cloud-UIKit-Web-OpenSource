import React, { memo, useEffect, useMemo, useRef, useState } from 'react';
import useFile from '~/core/hooks/useFile';
import { VideoFileStatus } from '~/social/constants';
import usePostByIds from '~/social/hooks/usePostByIds';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import AngleRight from '~/v4/icons/AngleRight';
import { ClearButton } from '~/v4/social/elements/ClearButton/ClearButton';
import styles from './VideoViewer.module.css';

import { VideoSize } from '@amityco/ts-sdk';

const VideoPlayer = memo(({ videoPost }: { videoPost?: Amity.Post<'video'> }) => {
  const videoFileId = useMemo(() => {
    return (
      videoPost?.data.videoFileId.high ||
      videoPost?.data.videoFileId.medium ||
      videoPost?.data.videoFileId.low ||
      videoPost?.data.videoFileId.original ||
      undefined
    );
  }, [videoPost]);

  const file: Amity.File<'video'> | undefined = useFile<Amity.File<'video'>>(videoFileId);
  const posterUrl = useFile(videoPost?.data.thumbnailFileId);

  const videoRef = useRef<HTMLVideoElement>(null);

  /*
   * It's possible that certain video formats uploaded by the user are not
   * playable by the browser. So it's best to use the transcoded video file
   * which is an mp4 format to play video.
   *
   * Note: the below logic needs to be smarter based on users bandwidth and also
   * should be switchable by the user, which would require a ui update
   */
  const url = useMemo(() => {
    if (file == null) return null;
    if (file.status === VideoFileStatus.Transcoded) {
      const { videoUrl } = file;

      return (
        videoUrl?.['1080p'] ||
        videoUrl?.['720p'] ||
        videoUrl?.['480p'] ||
        videoUrl?.['360p'] ||
        videoUrl?.original ||
        file.fileUrl
      );
    }
    return file.fileUrl;
  }, [file]);

  /*
  The video initially doesn't change because in essence you're only modifying the <source> element
  and React understands that <video> should remain unchanged,
  so it does not update it on the DOM and doesn't trigger a new load event for that source.
  A new load event should be triggered for <video>.

  ref: https://stackoverflow.com/a/47382850
  */
  useEffect(() => {
    videoRef.current?.load();
  }, [url]);

  if (url == null) return <></>;

  return (
    <video
      controls
      controlsList="nodownload"
      autoPlay
      className={styles.fullImage}
      ref={videoRef}
      poster={posterUrl?.fileUrl}
    >
      <source src={url} type="video/mp4" />
      <p>
        Your browser does not support this format of video. Please try again later once the server
        transcodes the video into an playable format(mp4).
      </p>
    </video>
  );
});

interface VideoViewerProps {
  pageId?: string;
  componentId?: string;
  elementId?: string;
  post: Amity.Post;
  onClose(): void;
  initialVideoIndex: number;
}

export function VideoViewer({
  pageId = '*',
  componentId = '*',
  elementId = '*',
  post,
  initialVideoIndex,
  onClose,
}: VideoViewerProps) {
  const { themeStyles } = useAmityElement({ pageId, componentId, elementId });

  const [selectedVideoIndex, setSelectedVideoIndex] = useState(initialVideoIndex);

  const posts = usePostByIds(post?.children || []);

  const videoPosts = posts.filter((post) => post.dataType === 'video');

  const videoPost = videoPosts[selectedVideoIndex];

  const hasNext = selectedVideoIndex < videoPosts.length - 1;
  const hasPrev = selectedVideoIndex > 0;

  const next = () => {
    if (!hasNext) {
      return;
    }
    setSelectedVideoIndex((prev) => prev + 1);
  };

  const prev = () => {
    if (!hasPrev) {
      return;
    }
    setSelectedVideoIndex((prev) => prev - 1);
  };

  return (
    <div style={themeStyles}>
      <div className={styles.modal} onClick={onClose}>
        <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
          <VideoPlayer videoPost={videoPost} />
          <div className={styles.overlayPanel}>
            {hasPrev && (
              <div className={styles.overlayPanel__prev} onClick={prev}>
                <AngleRight className={styles.overlayPanel__prevButton} />
              </div>
            )}
            <div className={styles.overlayPanel__middle} />
            {hasNext && (
              <div className={styles.overlayPanel__next} onClick={next}>
                <AngleRight className={styles.overlayPanel__nextButton} />
              </div>
            )}
          </div>
          <span className={styles.closeButton}>
            <ClearButton
              pageId={pageId}
              componentId={componentId}
              defaultClassName={styles.videoViewer__clearButton}
              imgClassName={styles.videoViewer__clearButton__img}
              onPress={onClose}
            />
          </span>
        </div>
      </div>
    </div>
  );
}