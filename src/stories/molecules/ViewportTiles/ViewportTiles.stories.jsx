import React from 'react';

import { CredentialCard } from './CredentialCard';

export default {
  title: 'Organisms/CredentialCard',
  component: CredentialCard,
  parameters: {
    // More on Story layout: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'fullscreen',
  },
};

const Template = (args) => <CredentialCard {...args} />;

export const Primary = Template.bind({});
Primary.args = { };
