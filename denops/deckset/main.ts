import { Denops } from "https://deno.land/x/denops_std@v1.0.0/mod.ts";

export async function main(denops: Denops): Promise<void> {
  console.log("Hello Denops!");

  denops.dispatcher = {
    async insertCodeHighlight(pos: number): Promise<void> {
      const text = await getWholeText(denops);
      const blocks = traverseAllCodeBlocks(text);
      const currentLine = await getCurrentLine(denops);
      const currentBlock = getCurrentCodeBlock(currentLine, blocks);
      if (currentBlock != null) {
        console.log(currentBlock.language);
        await insertTag(currentBlock, 0);
      }
    }
  };
  await denops.cmd(`command! IH call denops#request('${denops.name}', 'insertCodeHighlight', [])`);
};

async function getWholeText(denops: Denops): Promise<string[]> {
  const lines = await denops.call("getline", 1, "$");
  return lines;
}

async function getCurrentLine(denops: Denops): Promise<number> {
  const line = await denops.call("line", ".");
  return line;
}

async function insertTag(block: CodeBlock, pos: HighlightedPosition): Promise<void> {
  const tag = buildTag(pos);
  let startLine = block.start;
  let beforeLine = startLine - 1;
  // await insert();
}