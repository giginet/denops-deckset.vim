import { assertEquals } from "https://deno.land/std/testing/asserts.ts";
import {
  CodeBlock,
  buildTag,
  traverseAllCodeBlocks,
  getCurrentCodeBlock
} from "../denops/deckset/code_block.ts"

Deno.test("can traverse code blocks", () => {
  const text = `
Hello

\`\`\`javascript
console.log("hello");
\`\`\`

\`\`\`swift
print("hello")
\`\`\`

\`\`\`
hello!
how are you?
\`\`\`
  `.trim()

  const lines = text.split("\n");
  const codeBlocks = traverseAllCodeBlocks(lines);
  assertEquals(codeBlocks.length, 3);

  const [javascriptBlock, swiftBlock, unknownBlock] = codeBlocks;
  assertEquals(javascriptBlock.start, 3);
  assertEquals(javascriptBlock.end, 5);
  assertEquals(javascriptBlock.contents, ["console.log(\"hello\");"]);
  assertEquals(javascriptBlock.language, "javascript");

  assertEquals(swiftBlock.start, 7);
  assertEquals(swiftBlock.end, 9);
  assertEquals(swiftBlock.contents, ["print(\"hello\")"]);
  assertEquals(swiftBlock.language, "swift");

  assertEquals(unknownBlock.start, 11);
  assertEquals(unknownBlock.end, 14);
  assertEquals(unknownBlock.contents, ["hello!", "how are you?"]);
  assertEquals(unknownBlock.language, undefined);

});

Deno.test("can build tags", () => {
  assertEquals(buildTag(42), "[.code-highlight: 42]");
  assertEquals(buildTag({start: 42, end: 45}), "[.code-highlight: 42-45]");
  assertEquals(buildTag([2, 5, 9]), "[.code-highlight: 2,5,9]");
});