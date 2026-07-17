import { style } from "@vanilla-extract/css";
import { vars } from "../../styles.css";

export const gameList = style({
  display: "flex",
  flexDirection: "column",
  gap: 12,
  margin: 0,
  padding: 0,
  listStyle: "none",
});

export const gameCard = style({
  display: "flex",
  alignItems: "center",
  gap: 16,
  padding: 18,
  border: `1px solid ${vars.color.border}`,
  borderRadius: 12,
  background: vars.color.surface,
  boxShadow: vars.shadow.panel,
  color: vars.color.text,
  textDecoration: "none",
  transition: "border-color .16s ease, box-shadow .16s ease",
  selectors: {
    "&:hover": {
      borderColor: vars.color.brand,
    },
    "&:focus-visible": {
      borderColor: vars.color.brand,
      boxShadow: vars.shadow.focus,
      outline: "none",
    },
  },
});

export const gameIcon = style({
  display: "inline-flex",
  flex: "0 0 auto",
  alignItems: "center",
  justifyContent: "center",
  width: 54,
  height: 54,
  borderRadius: 12,
  background: vars.color.brandSoft,
  color: vars.color.brand,
});

export const gameIconGlyph = style({ fontSize: 30 });

export const gameDetails = style({
  display: "flex",
  flex: "1 1 auto",
  flexDirection: "column",
  minWidth: 0,
});

export const gameName = style({
  fontSize: vars.font.size.emphasis,
  fontWeight: 900,
});

export const gameDescription = style({
  marginTop: 4,
  color: vars.color.muted,
  fontSize: vars.font.size.secondary,
  lineHeight: 1.45,
});

export const gameMeta = style({
  display: "inline-flex",
  alignItems: "center",
  gap: 5,
  marginTop: 12,
  color: vars.color.brand,
  fontSize: vars.font.size.caption,
  fontWeight: 800,
});

export const metaIconGlyph = style({ fontSize: 18 });

export const playAction = style({
  display: "inline-flex",
  flex: "0 0 auto",
  alignItems: "center",
  justifyContent: "center",
  width: 38,
  height: 38,
  borderRadius: "50%",
  background: vars.color.brand,
  color: vars.color.onBrand,
});
