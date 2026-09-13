import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "./button";

const meta = {
  title: "ui/Button",
  component: Button,
  args: { children: "Email me a sign-in link" },
  argTypes: {
    variant: { control: "select", options: ["default", "outline", "secondary", "ghost", "destructive", "link"] },
    size: { control: "select", options: ["xs", "sm", "default", "lg"] },
  },
} satisfies Meta<typeof Button>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {};
export const Outline: Story = { args: { variant: "outline" } };
export const Link: Story = { args: { variant: "link", children: "Try another" } };
export const Disabled: Story = { args: { disabled: true, children: "Sending…" } };
export const Sizes: Story = {
  render: (args) => (
    <div className="flex items-center gap-3">
      <Button {...args} size="xs">xs</Button>
      <Button {...args} size="sm">sm</Button>
      <Button {...args}>default</Button>
      <Button {...args} size="lg">lg</Button>
    </div>
  ),
};
