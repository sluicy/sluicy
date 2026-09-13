import type { Meta, StoryObj } from "@storybook/react-vite";
import { Alert, AlertDescription, AlertTitle } from "./alert";

const meta = { title: "ui/Alert", component: Alert } satisfies Meta<typeof Alert>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Alert className="w-96">
      <AlertTitle>Check your email</AlertTitle>
      <AlertDescription>If founder@example.com can sign in, a link is on its way. It works once and expires in 15 minutes.</AlertDescription>
    </Alert>
  ),
};
export const Destructive: Story = {
  render: () => (
    <Alert variant="destructive" className="w-96">
      <AlertTitle>That link has expired</AlertTitle>
      <AlertDescription>Request a new one.</AlertDescription>
    </Alert>
  ),
};
