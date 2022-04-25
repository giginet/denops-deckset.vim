import { assertEquals } from "https://deno.land/std/testing/asserts.ts";
import {
  CodeBlock,
  traverseAllCodeBlocks,
  getCurrentCodeBlock
} from "../denops/deckset/code_block.ts"

Deno.test("can traverse code blocks", async () => {
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
  const codeBlocks = await traverseAllCodeBlocks(lines);
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