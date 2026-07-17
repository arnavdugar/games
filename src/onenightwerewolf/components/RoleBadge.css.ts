import { style } from "@vanilla-extract/css";
import { vars } from "../../styles.css";

export const badge = style({
  display: "inline-flex",
  alignItems: "center",
  width: "fit-content",
  padding: "5px 9px",
  borderRadius: 999,
  fontSize: vars.font.size.caption,
  fontWeight: 900,
});

export const village = style({
  background: vars.color.brandSoft,
  color: vars.color.brandHover,
});

export const werewolf = style({
  background: vars.color.dangerSoft,
  color: vars.color.danger,
});

export const tanner = style({
  background: vars.color.warningSoft,
  color: vars.color.warning,
});
