import { MantineProvider, type MantineThemeOverride } from "@mantine/core";
import React from "react";

const theme: MantineThemeOverride = {
  black: "#212529",
  fontFamily: "Helvetica Neue, Arial, sans-serif",
};

export default function ThemeRegistry({ children }: React.PropsWithChildren) {
  return (
    <MantineProvider withGlobalStyles withNormalizeCSS theme={theme}>
      {children}
    </MantineProvider>
  );
}
