import type { CenterSlot } from "./types";

export function centerLabel(slot: CenterSlot) {
  switch (slot) {
    case "left":
      return "Left";
    case "middle":
      return "Middle";
    case "right":
      return "Right";
    case "alpha-wolf":
      return "Alpha Wolf";
  }
}
