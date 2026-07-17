import {
  assignVars,
  createGlobalTheme,
  globalStyle,
} from "@vanilla-extract/css";

const lightTheme = {
  color: {
    canvas: "#f4f7f6",
    surface: "#ffffff",
    surfaceAlt: "#f8fafc",
    text: "#111827",
    muted: "#64748b",
    border: "#d7e0dd",
    header: "#0f766ef2",
    onHeader: "#ffffff",
    headerActionHover: "#ffffff1f",
    brand: "#0f766e",
    brandHover: "#115e59",
    brandSoft: "#ccfbf1",
    onBrand: "#ffffff",
    danger: "#be123c",
    dangerSoft: "#ffe4e6",
    dangerBorder: "#be123c47",
    warning: "#92400e",
    warningSoft: "#fef3c7",
  },
  font: {
    size: {
      caption: "0.875rem",
      secondary: "0.9375rem",
      body: "1rem",
      emphasis: "1.125rem",
      heading: "1.25rem",
      display: "2rem",
    },
  },
  shadow: {
    panel: "0 18px 45px rgb(17 24 39 / 12%)",
    header: "0 2px 8px rgb(17 24 39 / 18%)",
    sticky: "0 14px 34px rgb(17 24 39 / 16%)",
    focus: "0 0 0 4px #0f766e29",
  },
};

export const vars = createGlobalTheme(":root", lightTheme);

const darkTheme = {
  color: {
    canvas: "#080c12",
    surface: "#111821",
    surfaceAlt: "#0d141d",
    text: "#f4f7fb",
    muted: "#9aa8ba",
    border: "#2b3949",
    header: "#0d141df2",
    onHeader: "#f4f7fb",
    headerActionHover: "#f4f7fb1f",
    brand: "#2dd4bf",
    brandHover: "#5eead4",
    brandSoft: "#123a38",
    onBrand: "#062c2a",
    danger: "#fb7185",
    dangerSoft: "#3d1824",
    dangerBorder: "#fb718566",
    warning: "#fbbf24",
    warningSoft: "#3d2b0c",
  },
  shadow: {
    panel: "0 18px 48px rgb(0 0 0 / 42%)",
    header: "0 8px 24px rgb(0 0 0 / 24%)",
    sticky: "0 14px 34px rgb(0 0 0 / 32%)",
    focus: "0 0 0 4px #2dd4bf33",
  },
};

globalStyle(":root", {
  "@media": {
    "(prefers-color-scheme: dark)": {
      vars: assignVars({ color: vars.color, shadow: vars.shadow }, darkTheme),
    },
  },
});

globalStyle("*, *::before, *::after", {
  boxSizing: "border-box",
});

globalStyle("html", {
  background: vars.color.canvas,
  colorScheme: "light dark",
  overscrollBehaviorX: "none",
});

globalStyle("body", {
  overflowX: "clip",
  minWidth: 320,
  margin: 0,
  color: vars.color.text,
  fontFamily: '"Noto Sans", sans-serif',
  fontSynthesis: "none",
  textRendering: "optimizeLegibility",
  textWrapStyle: "pretty",
  userSelect: "none",
  WebkitFontSmoothing: "antialiased",
  WebkitUserSelect: "none",
});

globalStyle("strong", {
  color: vars.color.text,
});

globalStyle("#root", {
  width: "100%",
  maxWidth: 680,
  marginInline: "auto",
  padding: "76px 18px 18px",
  fontSize: vars.font.size.body,
});

globalStyle("button, input, select, textarea", {
  font: "inherit",
});

globalStyle("button", { border: 0 });

globalStyle("button:focus", {
  borderColor: vars.color.brand,
  boxShadow: vars.shadow.focus,
  outline: "none",
});

globalStyle("button:disabled, input:disabled", {
  cursor: "not-allowed",
  opacity: 0.55,
});

globalStyle("input, select, textarea", {
  width: "100%",
  border: `1px solid ${vars.color.border}`,
  borderRadius: 8,
  background: vars.color.surfaceAlt,
  color: vars.color.text,
  fontWeight: 400,
  outline: "none",
  transition: "border-color .16s ease, box-shadow .16s ease",
});

globalStyle("input, textarea", {
  userSelect: "text",
  WebkitUserSelect: "text",
});

globalStyle("input, select", {
  height: 44,
  padding: 11,
  lineHeight: "20px",
});

globalStyle("textarea", {
  minHeight: 116,
  padding: 12,
  resize: "vertical",
});

globalStyle("input:focus, select:focus, textarea:focus", {
  borderColor: vars.color.brand,
  boxShadow: vars.shadow.focus,
});

globalStyle("input::placeholder, textarea::placeholder", {
  color: vars.color.muted,
  opacity: 0.72,
});

globalStyle("::selection", {
  background: vars.color.brandSoft,
  color: vars.color.text,
});

globalStyle(
  'label:has(input[type="checkbox"]:focus), label:has(input[type="radio"]:focus)',
  {
    borderColor: vars.color.brand,
    boxShadow: vars.shadow.focus,
  },
);

globalStyle('input[type="checkbox"]:focus, input[type="radio"]:focus', {
  boxShadow: "none",
});
