import { Denops } from "https://deno.land/x/denops_std@v1.0.0/mod.ts";
import {
  traverseAllCodeBlocks,
  getCurrentCodeBlock,
  buildInsertingInfo,
} from './code_block.ts'
import {
  wrapURL,
} from './link.ts'

export async function main(denops: Denops): Promise<void> {
  console.log("Hello Denops!");

  denops.dispatcher = {
    async insertCodeHighlight(firstLine: Line, lastLine: Line): Promise<void> {
      const text = await getWholeText();
      const blocks = traverseAllCodeBlocks(text);
      const currentBlock = getCurrentCodeBlock(firstLine, blocks);
      if (currentBlock != null) {
        const result = buildInsertingInfo(currentBlock, firstLine, lastLine);
        if (result != null) {
          let [tag, line] = result;
          await insertTexts([tag], line);
        } else {
          sayError();
        }
      } else {
          sayError();
      }
    },
    async linkURLs(): Promise<void> {
      const currentLine = await getCurrentLineText();
      const wrapped = wrapURL(currentLine);
      if (currentLine != wrapped) {
        await replaceCurrentLine(wrapped);
      } else {
        console.error("There are no links.");
      }
    }
  };

  await denops.cmd(`command! InsertLink call denops#request('${denops.name}', 'linkURLs', [])`);

  function sayError() {
    console.error("Cursors must be in a code block.");
  }

  async function getWholeText(): Promise<string[]> {
    const lines = await denops.call("getline", 1, "$");
    return lines;
  }

  async function replaceCurrentLine(text: string): Promise<void> {
    await denops.call('setline', '.', text);
  }

  async function getCurrentLineText(): Promise<string> {
    const line = await denops.call("getline", ".");
    return line;
  }

  async function insertTexts(texts: string[], line: Line): Promise<void> {
    await denops.call('append', line, texts);
  }
}