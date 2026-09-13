import type { Meta, StoryObj } from "@storybook/react-vite";
import { Spinner } from "./spinner";

const meta = { title: "ui/Spinner", component: Spinner } satisfies Meta<typeof Spinner>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const WithText: Story = {
  render: () => (
    <p className="flex items-center gap-2 text-muted-foreground">
      <Spinner /> Signing you in…
    </p>
  ),
};
