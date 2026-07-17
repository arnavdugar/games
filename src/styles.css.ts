import {
  assignVars,
  createGlobalTheme,
  globalStyle,
  style,
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

export const page = style({
  display: "flex",
  flexDirection: "column",
  gap: 20,
});

export const panel = style({
  padding: 18,
  border: `1px solid ${vars.color.border}`,
  borderRadius: 8,
  background: vars.color.surface,
  boxShadow: vars.shadow.panel,
});

export const panelStack = style({
  display: "flex",
  flexDirection: "column",
  gap: 18,
});

export const pageTitle = style({
  margin: 0,
  color: vars.color.text,
  fontSize: vars.font.size.display,
  lineHeight: 1.04,
});

export const mutedText = style({
  margin: 0,
  color: vars.color.muted,
  lineHeight: 1.6,
});

export const strongText = style({ color: vars.color.text });

export const labelText = style({
  color: vars.color.text,
  fontSize: vars.font.size.secondary,
  fontWeight: 800,
});

export const fieldLabel = style([
  labelText,
  {
    display: "flex",
    flexDirection: "column",
    gap: 8,
  },
]);

export const sectionHeader = style({
  display: "flex",
  alignItems: "center",
  flexDirection: "row",
  justifyContent: "space-between",
  gap: 12,
  color: vars.color.muted,
  fontSize: vars.font.size.secondary,
  fontWeight: 700,
});

export const errorMessage = style({
  margin: 0,
  padding: "12px 14px",
  borderRadius: 8,
  background: vars.color.dangerSoft,
  color: vars.color.danger,
  fontWeight: 800,
});

export const warningMessage = style({
  margin: 0,
  padding: "12px 14px",
  borderRadius: 8,
  background: vars.color.warningSoft,
  color: vars.color.warning,
  fontWeight: 800,
});

export const actionStack = style({
  display: "flex",
  flexDirection: "column",
  gap: 10,
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
  fontFamily:
    "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif",
  fontSynthesis: "none",
  textRendering: "optimizeLegibility",
  userSelect: "none",
  WebkitFontSmoothing: "antialiased",
  WebkitUserSelect: "none",
});

globalStyle("#root", {
  boxSizing: "border-box",
  width: "100%",
  maxWidth: 680,
  marginInline: "auto",
  padding: "76px 18px 18px",
  fontSize: vars.font.size.body,
});

globalStyle("button, input, select, textarea", {
  boxSizing: "border-box",
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
  minHeight: 44,
  padding: "0 12px",
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
