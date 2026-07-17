import { roleById } from "../roles";
import type { RoleId } from "../types";

import * as styles from "./RoleBadge.css";

export function RoleBadge({ role }: { role: RoleId }) {
  const definition = roleById[role];
  return (
    <span className={`${styles.badge} ${styles[definition.team]}`}>
      {definition.name}
    </span>
  );
}
