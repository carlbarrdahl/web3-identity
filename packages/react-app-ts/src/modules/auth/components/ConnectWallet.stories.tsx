import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import ConnectWallet from "./ConnectWallet";
import NetworkSelector from "./NetworkSelector";
import { HStack } from "@chakra-ui/react";

export default {
  title: "Features/ConnectWallet",
  component: ConnectWallet,
  parameters: {
    // More on Story layout: https://storybook.js.org/docs/react/configure/story-layout
    // layout: "fullscreen",
  },
} as ComponentMeta<typeof ConnectWallet>;

const Template: ComponentStory<typeof ConnectWallet> = () => (
  <HStack>
    <NetworkSelector />
    <ConnectWallet />
  </HStack>
);

export const Default = Template.bind({});
