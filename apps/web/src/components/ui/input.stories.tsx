import type { Meta, StoryObj } from "@storybook/react-vite";
import { Input } from "./input";
import { Label } from "./label";

const meta = {
  title: "ui/Input",
  component: Input,
  args: { type: "email", placeholder: "you@yourproduct.com" },
} satisfies Meta<typeof Input>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const WithLabel: Story = {
  render: (args) => (
    <div className="grid w-80 gap-2">
      <Label htmlFor="email">Email</Label>
      <Input id="email" {...args} />
    </div>
  ),
};
export const Invalid: Story = { args: { "aria-invalid": true, defaultValue: "not-an-email" } };
export const Disabled: Story = { args: { disabled: true } };
