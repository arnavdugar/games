import { style } from "@vanilla-extract/css";
import { vars } from "../../../styles.css";
import { selectableOption } from "../NightPage.css";

export const directionGrid = style({
  display: "grid",
  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
  gap: 8,
});

export const directionChoice = style([
  selectableOption,
  {
    flexDirection: "column",
    justifyContent: "center",
    gap: 5,
    minHeight: 88,
    padding: 10,
    fontSize: vars.font.size.caption,
    textAlign: "center",
  },
]);

export const directionIcon = style({
  color: vars.color.brand,
  fontSize: 28,
});
