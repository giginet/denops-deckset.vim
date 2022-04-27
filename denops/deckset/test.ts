import { assertEquals } from "https://deno.land/std/testing/asserts.ts";
import {
  buildTag,
  traverseAllCodeBlocks,
  getCurrentCodeBlock,
  buildInsertingInfo,
} from "./code_block.ts"

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

Deno.test("can traverse code blocks", () => {
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

Deno.test("can get a current code block", () => {
  const lines = text.split("\n");
  const codeBlocks = traverseAllCodeBlocks(lines);

  const block1 = getCurrentCodeBlock(1, codeBlocks);
  assertEquals(block1, null);
  
  const block3 = getCurrentCodeBlock(3, codeBlocks);
  assertEquals(block3?.start, 3);
  
  const block4 = getCurrentCodeBlock(4, codeBlocks);
  assertEquals(block4?.start, 3);

  const block5 = getCurrentCodeBlock(5, codeBlocks);
  assertEquals(block5?.start, 3);

  const block7 = getCurrentCodeBlock(7, codeBlocks);
  assertEquals(block7?.start, 7);
  assertEquals(block7?.language, "swift");
});

Deno.test("can build tags", () => {
  assertEquals(buildTag(42), "[.code-highlight: 42]");
  assertEquals(buildTag({start: 42, end: 45}), "[.code-highlight: 42-45]");
  assertEquals(buildTag([2, 5, 9]), "[.code-highlight: 2,5,9]");
});

Deno.test("can build inserting info", () => {
  const lines = text.split("\n");
  const codeBlocks = traverseAllCodeBlocks(lines);
  const codeBlock = codeBlocks[2];

  const result = buildInsertingInfo(codeBlock, 12, 13);
  if (result != null) {
    const [tag, line] = result;
    assertEquals(tag, "[.code-highlight: 1-2]");
    assertEquals(line, 10);
  }
});
