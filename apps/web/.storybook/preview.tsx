import type { Preview } from "@storybook/react-vite";
import "../src/styles.css";

// The app has one theme (dark); stories render on the same background and fonts.
const preview: Preview = {
  parameters: {
    backgrounds: { options: { app: { name: "app", value: "#0A0D12" } } },
    a11y: { test: "error" },
  },
  initialGlobals: { backgrounds: { value: "app" } },
};
export default preview;
