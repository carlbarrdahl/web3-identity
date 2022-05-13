import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import Layout from "./Layout";

export default {
  title: "Components/Layout",
  component: Layout,
  parameters: {
    // More on Story layout: https://storybook.js.org/docs/react/configure/story-layout
    layout: "fullscreen",
  },
} as ComponentMeta<typeof Layout>;

const Template: ComponentStory<typeof Layout> = () => <Layout>content</Layout>;

export const Default = Template.bind({});
