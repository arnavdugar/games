import { style, styleVariants } from "@vanilla-extract/css";
import { vars } from "../../styles.css";

export const track = style({
  width: "100%",
  height: 10,
  overflow: "hidden",
  borderRadius: 5,
  background: vars.color.border,
});

const fillBase = style({
  height: "100%",
  minWidth: 10,
  borderRadius: "inherit",
  transition: "width .18s ease",
});

export const fill = styleVariants({
  brand: [fillBase, { background: vars.color.brand }],
  danger: [fillBase, { background: vars.color.danger }],
});
