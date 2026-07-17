import { style } from "@vanilla-extract/css";
import { vars } from "../../styles.css";

export const setupPanel = style({
  display: "flex",
  flexDirection: "column",
  gap: 22,
});

export const section = style({
  display: "flex",
  flexDirection: "column",
  width: "100%",
  minWidth: 0,
  gap: 12,
});

export const playerList = style({
  display: "flex",
  flexDirection: "column",
  gap: 8,
});

export const playerRow = style({
  display: "grid",
  gridTemplateColumns: "28px minmax(0, 1fr) auto",
  gap: 8,
  alignItems: "center",
});

export const playerNumber = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: 42,
  borderRadius: 8,
  background: vars.color.brandSoft,
  color: vars.color.brandHover,
  fontWeight: 800,
});

export const removeButton = style({
  width: 42,
  minWidth: 42,
  minHeight: 42,
  padding: 0,
  border: `1px solid ${vars.color.border}`,
  background: vars.color.surfaceAlt,
  color: vars.color.muted,
  justifySelf: "end",
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
  border: `1px solid ${vars.color.border}`,
  borderRadius: 8,
  background: vars.color.surfaceAlt,
  color: vars.color.text,
  fontSize: vars.font.size.body,
  fontWeight: 800,
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
  alignItems: "center",
  justifyContent: "space-between",
  gap: 12,
});

export const selectedCount = style({
  color: vars.color.muted,
  fontSize: vars.font.size.caption,
  fontWeight: 700,
});

export const themeActions = style({ display: "flex", gap: 8 });

export const smallButton = style({
  width: "auto",
  minHeight: 34,
  padding: "0 10px",
  fontSize: vars.font.size.caption,
});

export const themeGrid = style({
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
  gap: 8,
  padding: 2,
});

export const themeOption = style({
  display: "grid",
  gridTemplateColumns: "20px minmax(0, 1fr)",
  alignItems: "center",
  minHeight: 42,
  padding: "6px 10px",
  border: `1px solid ${vars.color.border}`,
  borderRadius: 8,
  background: vars.color.surfaceAlt,
  color: vars.color.text,
  cursor: "pointer",
  gap: 10,
});

export const selectedOption = style({
  borderColor: vars.color.brand,
  background: vars.color.brandSoft,
  color: vars.color.brandHover,
});

export const headingReset = style({ margin: 0 });

export const controlOption = style({
  display: "grid",
  gridTemplateColumns: "20px minmax(0, 1fr)",
  alignItems: "center",
  minHeight: 44,
  padding: "10px 12px",
  border: `1px solid ${vars.color.border}`,
  borderRadius: 8,
  background: vars.color.surfaceAlt,
  gap: 10,
  color: vars.color.text,
  cursor: "pointer",
});

export const inputControl = style({
  width: 18,
  height: 18,
  minHeight: 0,
  padding: 0,
  accentColor: vars.color.brand,
});
