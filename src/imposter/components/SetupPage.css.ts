import { style } from "@vanilla-extract/css";
import { vars } from "../../styles.css";

export const setupPanel = style({
  display: "flex",
  flexDirection: "column",
  gap: 22,
  paddingBlock: 4,
});

export const labelText = style({
  color: vars.color.text,
  fontSize: vars.font.size.secondary,
  fontWeight: 800,
});

export const fieldLabel = style({
  display: "flex",
  flexDirection: "column",
  gap: 8,
  color: vars.color.text,
  fontSize: vars.font.size.secondary,
  fontWeight: 800,
});

export const errorMessage = style({
  margin: 0,
  padding: "12px 14px",
  borderRadius: 8,
  background: vars.color.dangerSoft,
  color: vars.color.danger,
  fontWeight: 800,
});

export const section = style({
  display: "flex",
  flexDirection: "column",
  width: "100%",
  minWidth: 0,
  gap: 12,
});

export const stepper = style({
  display: "grid",
  gridTemplateColumns: "44px minmax(0, 1fr) 44px",
  gap: 8,
});

export const stepperButton = style({ padding: 0 });

export const stepperValue = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: 44,
  padding: 11,
  border: `1px solid ${vars.color.border}`,
  borderRadius: 8,
  background: vars.color.surfaceAlt,
  color: vars.color.text,
  fontSize: vars.font.size.body,
  fontWeight: 800,
  lineHeight: "20px",
});

export const themeFieldset = style({
  display: "flex",
  flexDirection: "column",
  gap: 10,
  minWidth: 0,
  margin: 0,
  padding: 0,
  border: 0,
  color: vars.color.text,
  fontSize: vars.font.size.secondary,
});

export const themeHeader = style({
  display: "flex",
  flexWrap: "wrap",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 12,
});

export const themeSummary = style({
  flex: "1 1 0",
});

export const themeTitle = style({
  whiteSpace: "nowrap",
});

export const selectedCount = style({
  display: "block",
  marginTop: 6,
  color: vars.color.muted,
  fontSize: vars.font.size.caption,
  fontWeight: 700,
  whiteSpace: "nowrap",
});

export const themeActions = style({
  display: "flex",
  flex: "1 1 272px",
  flexWrap: "wrap",
  gap: 8,
  maxWidth: "100%",
  marginLeft: "auto",
});

export const smallButton = style({
  flex: "1 1 auto",
  fontSize: vars.font.size.caption,
  whiteSpace: "nowrap",
});

export const themeGrid = style({
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
  gridAutoRows: "1fr",
  gap: 8,
  padding: 2,
});

export const themeOption = style({
  display: "flex",
  alignItems: "center",
  minHeight: 44,
  padding: 11,
  border: `1px solid ${vars.color.border}`,
  borderRadius: 8,
  background: vars.color.surfaceAlt,
  color: vars.color.text,
  cursor: "pointer",
  gap: 10,
  lineHeight: "20px",
});

export const selectedOption = style({
  borderColor: vars.color.brand,
  background: vars.color.brandSoft,
  color: vars.color.brandHover,
});

export const headingReset = style({ margin: 0 });

export const controlOption = style({
  display: "flex",
  alignItems: "center",
  minHeight: 44,
  padding: 11,
  border: `1px solid ${vars.color.border}`,
  borderRadius: 8,
  background: vars.color.surfaceAlt,
  gap: 10,
  color: vars.color.text,
  cursor: "pointer",
  lineHeight: "20px",
});

export const inputControl = style({
  flex: "0 0 auto",
  width: 18,
  height: 18,
  minHeight: 0,
  margin: 0,
  padding: 0,
  accentColor: vars.color.brand,
});
