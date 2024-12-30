import React from 'react';

import UiKitSocialHashTagSearch from '.';
import { useArgs } from '@storybook/client-api';

export default {
  title: 'SDK Connected/Social/Community',
};

export const SDKHashTagSearch = {
  render: () => {
    const [props] = useArgs();
    return <UiKitSocialHashTagSearch {...props} />;
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
