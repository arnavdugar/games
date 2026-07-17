import * as typescriptPlugin from "prettier/plugins/typescript";

const importPattern = /^import(?:\s+type)?\s+[\s\S]*?;\s*/gm;
const moduleSpecifierPattern =
  /from\s+["']([^"']+)["']|import\s+["']([^"']+)["']/;
const styleImportPattern = /^import \* as styles from ["']\.\/.*\.css["'];$/;

function getModuleSpecifier(importText) {
  const match = moduleSpecifierPattern.exec(importText);

  return match?.[1] ?? match?.[2] ?? "";
}

function isStyleImport(importText) {
  return styleImportPattern.test(importText);
}

function getImportGroup(importText) {
  if (isStyleImport(importText)) {
    return 2;
  }

  return getModuleSpecifier(importText).startsWith(".") ? 1 : 0;
}

function compareImports(left, right) {
  const leftGroup = getImportGroup(left);
  const rightGroup = getImportGroup(right);

  if (leftGroup !== rightGroup) {
    return leftGroup - rightGroup;
  }

  return (
    getModuleSpecifier(left).localeCompare(getModuleSpecifier(right)) ||
    left.localeCompare(right)
  );
}

function formatImportBlock(importTexts) {
  const sortedImports = [...importTexts].sort(compareImports);
  const styleImports = sortedImports.filter(isStyleImport);
  const otherImports = sortedImports.filter(
    (importText) => !isStyleImport(importText),
  );
  const importGroups = [];

  if (otherImports.length > 0) {
    importGroups.push(otherImports.join("\n"));
  }

  if (styleImports.length > 0) {
    importGroups.push(styleImports.join("\n"));
  }

  return `${importGroups.join("\n\n")}\n\n`;
}

function sortImports(source) {
  const imports = [];
  let cursor = 0;

  for (const match of source.matchAll(importPattern)) {
    if (match.index !== cursor) {
      break;
    }

    imports.push(match[0].trim());
    cursor = match.index + match[0].length;
  }

  if (imports.length === 0) {
    return source;
  }

  return formatImportBlock(imports) + source.slice(cursor).trimStart();
}

const typescriptParser = typescriptPlugin.parsers.typescript;

export const parsers = {
  typescript: {
    ...typescriptParser,
    preprocess(source, options) {
      const nextSource =
        typescriptParser.preprocess?.(source, options) ?? source;

      return sortImports(nextSource);
    },
  },
};
