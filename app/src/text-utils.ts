// Tiny text helpers shared across the WS3 tool-comparison exercise.

export function slugify(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function truncate(input: string, maxLength: number, suffix = "..."): string {
  if (maxLength <= 0) {
    return "";
  }

  if (input.length <= maxLength) {
    return input;
  }

  if (suffix.length >= maxLength) {
    return suffix.slice(0, maxLength);
  }

  return input.slice(0, maxLength - suffix.length) + suffix;
}

export function parseTags(input: string): string[] {
  const tags = input
    .split(/[,#]/)
    .map((tag) => tag.trim().toLowerCase())
    .filter((tag) => tag.length > 0);

  return Array.from(new Set(tags));
}

export function wordCount(input: string): number {
  return input.trim().split(/\s+/).filter((word) => word.length > 0).length;
}

export function capitalizeWords(input: string): string {
  // Match runs of non-whitespace only, so the original whitespace (count,
  // position, leading/trailing) is preserved verbatim — never collapsed.
  // charAt(0) (not word[0]) keeps this total under noUncheckedIndexedAccess.
  return input.replace(/\S+/g, (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase());
}
