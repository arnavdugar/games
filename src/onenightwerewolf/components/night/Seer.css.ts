import { style } from "@vanilla-extract/css";
import { vars } from "../../../styles.css";
import { selectableOption } from "../NightPage.css";

export const modeSwitch = style({
  display: "grid",
  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
  gap: 8,
});

export const modeOption = style([
  selectableOption,
  {
    justifyContent: "center",
    padding: 11,
    fontSize: vars.font.size.caption,
    textAlign: "center",
  },
]);
