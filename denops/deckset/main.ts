import { Denops } from "https://deno.land/x/denops_std@v1.0.0/mod.ts";
import {
  traverseAllCodeBlocks,
  getCurrentCodeBlock,
  buildInsertingInfo,
} from './code_block.ts'
import {
  wrapURL,
} from './link.ts'
import {
  defaultConfiguration,
  buildConfigurationTag,
} from './configuration.ts'

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
          sayCodeBlockError();
        }
      } else {
          sayCodeBlockError();
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
    },
    async insertConfiguration(): Promise<void> {
      const configuration = defaultConfiguration;
      const metadata = buildConfigurationTag(configuration);
      await insertToTop(metadata);
    }
  };

  await denops.cmd(`command! InsertLink call denops#request('${denops.name}', 'linkURLs', [])`);
  await denops.cmd(`command! InsertConfiguration call denops#request('${denops.name}', 'insertConfiguration', [])`);

  function sayCodeBlockError() {
    console.error("Cursors must be in a code block.");
  }

  async function insertToTop(texts: string[]): Promise<void> {
    await denops.call("append", 0, texts)
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