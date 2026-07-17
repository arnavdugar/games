import { style } from "@vanilla-extract/css";
import { vars } from "../../styles.css";

export const setupPanel = style({
  display: "flex",
  flexDirection: "column",
  gap: 22,
  paddingBlock: 4,
});

export const sectionHeader = style({
  display: "flex",
  flexWrap: "wrap",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 12,
  color: vars.color.muted,
  fontSize: vars.font.size.secondary,
  fontWeight: 700,
});

export const sectionTitle = style({
  margin: 0,
  color: vars.color.text,
  fontSize: vars.font.size.secondary,
  fontWeight: 800,
});

export const sectionSummary = style({
  flex: "1 1 0",
});

export const warningMessage = style({
  margin: 0,
  padding: "12px 14px",
  borderRadius: 8,
  background: vars.color.warningSoft,
  color: vars.color.warning,
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

export const roleCount = style({
  display: "block",
  marginTop: 6,
  fontSize: vars.font.size.caption,
  whiteSpace: "nowrap",
});

export const roleActions = style({
  display: "flex",
  flex: "1 1 272px",
  flexWrap: "wrap",
  gap: 8,
  maxWidth: "100%",
  marginLeft: "auto",
});

export const roleActionButton = style({
  flex: "1 1 auto",
  fontSize: vars.font.size.caption,
  whiteSpace: "nowrap",
});

export const roleList = style({
  display: "flex",
  flexDirection: "column",
  gap: 8,
  margin: 0,
  padding: 0,
  listStyle: "none",
});

export const roleCard = style({
  display: "flex",
  position: "relative",
  alignItems: "center",
  gap: 12,
  padding: 12,
  border: `1px solid ${vars.color.border}`,
  borderRadius: 8,
  background: vars.color.surfaceAlt,
  selectors: {
    "&:has(input:checked)": {
      borderColor: vars.color.brand,
      background: vars.color.brandSoft,
      color: vars.color.brandHover,
    },
    "&:has(input:focus)": {
      borderColor: vars.color.brand,
      boxShadow: vars.shadow.focus,
    },
  },
});

export const roleSelection = style({
  display: "grid",
  gridTemplateColumns: "auto minmax(0, 1fr)",
  flex: "1 1 auto",
  alignSelf: "stretch",
  alignItems: "center",
  minWidth: 0,
  gap: 12,
  cursor: "pointer",
  selectors: {
    "&::after": {
      content: "",
      position: "absolute",
      inset: 0,
      borderRadius: "inherit",
    },
    '&:has(input[type="checkbox"]:focus)': {
      boxShadow: "none",
    },
  },
});

export const roleDetails = style({ minWidth: 0 });

export const roleName = style({
  margin: 0,
  fontSize: vars.font.size.caption,
  fontWeight: 900,
});

export const roleSummary = style({
  margin: "6px 0 0",
  color: vars.color.muted,
  fontSize: vars.font.size.caption,
});

export const stepper = style({
  display: "grid",
  gridTemplateColumns: "44px 28px 44px",
  flex: "0 0 auto",
  position: "relative",
  zIndex: 1,
  alignItems: "center",
  gap: 5,
});

export const stepperButton = style({
  padding: 0,
});

export const stepperValue = style({
  color: vars.color.text,
  fontWeight: 900,
  textAlign: "center",
});
