import React from 'react';

import UiKitSocialAllSearch from '.';
import { useArgs } from '@storybook/client-api';

export default {
  title: 'SDK Connected/Social/Community',
};

export const SDKAllSearch = {
  render: () => {
    const [props] = useArgs();
    return <UiKitSocialAllSearch {...props} />;
  },
  name: 'Search bar',

  args: {
    placeholder: 'Search posts',
  },

  argTypes: {
    placeholder: { control: { type: 'text' } },
    onSearchResultCommunityClick: { action: 'onSearchResultCommunityClick()' },
  },
};
