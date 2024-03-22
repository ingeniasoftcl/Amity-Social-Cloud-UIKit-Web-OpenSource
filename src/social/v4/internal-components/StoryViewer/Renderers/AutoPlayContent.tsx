import React, { useEffect } from 'react';
import { Renderer, Tester } from 'react-insta-stories/dist/interfaces';

export const renderer: Renderer = (props) => {
  useEffect(() => {
    props.action('play');
  }, [props.story]);
  const Content = props.story.originalContent;
  return <Content {...props} />;
};

export const tester: Tester = (story) => {
  return {
    condition: !!story.content,
    priority: 2,
  };
};

export default {
  renderer,
  tester,
};