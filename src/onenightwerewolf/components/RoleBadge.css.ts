import { style, styleVariants } from "@vanilla-extract/css";
import { vars } from "../../styles.css";

const badgeBase = style({
  display: "inline-flex",
  alignItems: "center",
  flexShrink: 0,
  width: "fit-content",
  padding: "5px 9px",
  borderRadius: 8,
  fontSize: vars.font.size.caption,
  fontWeight: 900,
  whiteSpace: "nowrap",
});

export const badge = styleVariants({
  village: [
    badgeBase,
    {
      background: vars.color.brandSoft,
      color: vars.color.brandHover,
    },
  ],
  werewolf: [
    badgeBase,
    {
      background: vars.color.dangerSoft,
      color: vars.color.danger,
    },
  ],
  tanner: [
    badgeBase,
    {
      background: vars.color.warningSoft,
      color: vars.color.warning,
    },
  ],
});
