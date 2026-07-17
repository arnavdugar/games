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
  color: vars.color.muted,
  justifySelf: "end",
});

export const roleHeader = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 12,
});

export const headingReset = style({
  margin: 0,
  fontSize: vars.font.size.secondary,
});

export const selectedCount = style({
  display: "block",
  marginTop: 3,
  color: vars.color.muted,
  fontSize: vars.font.size.caption,
  fontWeight: 700,
});

export const recommendButton = style({
  width: "auto",
  minHeight: 38,
  padding: "0 12px",
  fontSize: vars.font.size.caption,
});

export const roleList = style({
  display: "flex",
  flexDirection: "column",
  gap: 8,
});

export const roleCard = style({
  display: "grid",
  gridTemplateColumns: "minmax(0, 1fr) auto",
  alignItems: "center",
  gap: 12,
  padding: 12,
  border: `1px solid ${vars.color.border}`,
  borderRadius: 8,
  background: vars.color.surfaceAlt,
});

export const selectedRoleCard = style({
  borderColor: vars.color.brand,
  background: vars.color.brandSoft,
  color: vars.color.brandHover,
});

export const roleDetails = style({ minWidth: 0 });

export const roleSummary = style({
  margin: "7px 0 0",
  color: vars.color.muted,
  fontSize: vars.font.size.caption,
  lineHeight: 1.4,
});

export const stepper = style({
  display: "grid",
  gridTemplateColumns: "36px 28px 36px",
  alignItems: "center",
  gap: 5,
});

export const stepperButton = style({
  width: 36,
  minHeight: 36,
  padding: 0,
});

export const stepperValue = style({
  color: vars.color.text,
  fontWeight: 900,
  textAlign: "center",
});
