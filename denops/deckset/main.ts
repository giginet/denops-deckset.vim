import { Denops } from "https://deno.land/x/denops_std@v1.0.0/mod.ts";
import {
  traverseAllCodeBlocks,
  getCurrentCodeBlock,
  buildInsertingInfo,
} from './code_block.ts'

export async function main(denops: Denops): Promise<void> {
  console.log("Hello Denops!");

  denops.dispatcher = {
    async insertCodeHighlight(pos: number): Promise<void> {
      const text = await getWholeText();
      const blocks = traverseAllCodeBlocks(text);
      const currentLine = await getCurrentLine();
      const currentBlock = getCurrentCodeBlock(currentLine, blocks);
      if (currentBlock != null) {
        const result = buildInsertingInfo(currentBlock, currentLine);
        if (result != null) {
          let [tag, line] = result;
          await insertTexts([tag], line);
        } else {
          sayError();
        }
      } else {
          sayError();
      }
    }
  };

  function sayError() {
    console.error("Cursors must be in a code block.");
  }

  async function getWholeText(): Promise<string[]> {
    const lines = await denops.call("getline", 1, "$");
    return lines;
  }

  async function getCurrentLine(): Promise<number> {
    const line = await denops.call("line", ".");
    return line;
  }

  async function insertTexts(texts: string[], line: Line): Promise<void> {
    await denops.call('append', line, texts)
  }

  await denops.cmd(`command! InsertCodeHighlight call denops#request('${denops.name}', 'insertCodeHighlight', [])`);
};