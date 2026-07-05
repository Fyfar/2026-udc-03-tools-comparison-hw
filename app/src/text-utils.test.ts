import { describe, expect, it } from "vitest";
import { capitalizeWords, parseTags, slugify, truncate, wordCount } from "./text-utils.js";

describe("slugify", () => {
  it("lowercases and hyphenates a plain title", () => {
    expect(slugify("Hello World")).toBe("hello-world");
  });

  it("collapses punctuation and extra spaces into single hyphens", () => {
    expect(slugify("  AI Tools: A Comparison!! ")).toBe("ai-tools-a-comparison");
  });
});

describe("parseTags", () => {
  it("splits on commas and hashes, trims, lowercases, and dedupes", () => {
    expect(parseTags("#AI, Tools,#ai, dev ")).toEqual(["ai", "tools", "dev"]);
  });

  it("returns an empty array for blank input", () => {
    expect(parseTags("   ")).toEqual([]);
  });
});

describe("wordCount", () => {
  it("counts words separated by whitespace", () => {
    expect(wordCount("hello world from tests")).toBe(4);
  });

  it("returns 0 for blank input", () => {
    expect(wordCount("   ")).toBe(0);
  });
});

describe("capitalizeWords", () => {
  it("capitalizes the first letter of each word and lowercases the rest", () => {
    expect(capitalizeWords("WIRELESS mouse")).toBe("Wireless Mouse");
  });

  it("preserves multiple spaces between words without collapsing them", () => {
    expect(capitalizeWords("red   t-shirt")).toBe("Red   T-shirt");
  });

  it("preserves leading and trailing spaces", () => {
    expect(capitalizeWords("  hello world  ")).toBe("  Hello World  ");
  });

  it("leaves already Title Case input unchanged", () => {
    expect(capitalizeWords("already Title Case")).toBe("Already Title Case");
  });

  it("returns an empty string for empty input", () => {
    expect(capitalizeWords("")).toBe("");
  });

  it("returns a whitespace-only string unchanged (no letters to recase)", () => {
    expect(capitalizeWords("   ")).toBe("   ");
    expect(capitalizeWords(" \t \n ")).toBe(" \t \n ");
  });
});

// Task E hardening: cases the ticket left implicit, but which its own rule
// ("word" = whitespace-delimited run; rest of the word lowercased) fully
// determines. These lock the behavior of the \S+ approach so a future
// "smarter" rewrite (splitting on hyphens/apostrophes) can't silently change it.
describe("capitalizeWords — characterization / edge cases", () => {
  it("treats a hyphenated token as ONE word (hyphen does not start a new word)", () => {
    expect(capitalizeWords("wi-FI ROUTER")).toBe("Wi-fi Router");
  });

  it("treats an apostrophe token as ONE word (only the leading letter is upper)", () => {
    expect(capitalizeWords("O'BRIEN's CAFE")).toBe("O'brien's Cafe");
  });

  it("recases accented / non-ASCII letters correctly", () => {
    expect(capitalizeWords("café DÉJÀ vu")).toBe("Café Déjà Vu");
  });

  it("splits on ANY whitespace and preserves it — tabs and newlines included", () => {
    expect(capitalizeWords("hello\tWORLD\nfoo")).toBe("Hello\tWorld\nFoo");
  });

  it("leaves digit-led tokens intact while still recasing letters", () => {
    expect(capitalizeWords("iPHONE 12 pro-MAX")).toBe("Iphone 12 Pro-max");
  });

  it("handles single-character words", () => {
    expect(capitalizeWords("a B c")).toBe("A B C");
  });
});

describe("truncate", () => {
  it("returns the input unchanged when it is already within maxLength", () => {
    expect(truncate("hello", 10)).toBe("hello");
  });

  it("truncates long input and appends the suffix", () => {
    const result = truncate("hello world", 5);
    expect(result.length).toBeLessThan("hello world".length);
    expect(result.endsWith("...")).toBe(true);
  });

  it("BUG-101 regression: counts the suffix within maxLength (materials/task-bug-fix.md)", () => {
    const input = "a long sentence here";
    const result = truncate(input, 10, "...");
    expect(result).toBe("a long ...");
    expect(result.length).toBe(10);
  });

  it("handles edge case where suffix.length >= maxLength by returning sliced suffix", () => {
    expect(truncate("hello world", 2, "...")).toBe("..");
    expect(truncate("hello world", 3, "...")).toBe("...");
  });

  it("returns an empty string if maxLength is 0 or negative", () => {
    expect(truncate("hello world", 0)).toBe("");
    expect(truncate("hello world", -5)).toBe("");
  });
});
