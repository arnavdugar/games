import { centerLabel } from "../center";
import type { CenterSlot } from "../types";

import * as styles from "./CenterPicker.css";

export function CenterPicker({
  centerSlots,
  maxSelections,
  onChange,
  selected,
}: {
  centerSlots: CenterSlot[];
  maxSelections: number;
  onChange: (selected: CenterSlot[]) => void;
  selected: CenterSlot[];
}) {
  return (
    <>
      <div className={styles.centerGrid}>
        {centerSlots.map((slot) => (
          <label className={styles.centerChoice} key={slot}>
            <input
              checked={selected.includes(slot)}
              className={styles.hiddenInput}
              onChange={() => {
                if (selected.includes(slot)) {
                  onChange(selected.filter((selection) => selection !== slot));
                } else if (maxSelections === 1) {
                  onChange([slot]);
                } else if (selected.length < maxSelections) {
                  onChange([...selected, slot]);
                }
              }}
              type="checkbox"
            />
            <span>{centerLabel(slot)}</span>
          </label>
        ))}
      </div>
      {centerSlots.length === 0 ? (
        <p className={styles.emptyNotice}>No eligible targets are available.</p>
      ) : null}
    </>
  );
}
