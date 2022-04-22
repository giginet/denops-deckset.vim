import { Denops } from "https://deno.land/x/denops_std@v1.0.0/mod.ts";

export async function main(denops: Denops): Promise<void> {
  console.log("Hello Denops!");

  denops.dispatcher = {
    async insertCodeHighlight(pos: number): Promise<void> {
      const text = await getWholeText(denops);
      const blocks = traverseAllCodeBlocks(text);
      console.log(blocks[0].contents);
    }
  };
  await denops.cmd(`command! IH call denops#request('${denops.name}', 'insertCodeHighlight', [])`);
};

type Line = number;

interface FencedCodeBlock {
  start: Line;
  end: Line;
  language?: string;
  contents: string[];
}

interface Range {
  start: Line,
  end: Line,
}

type HighlightedPosition = Line | Range | Array<Line>

function traverseAllCodeBlocks(lines: string[]): FencedCodeBlock[] {
  let codeBlocks: FencedCodeBlock[] = [];
  const startPattern = /```(.+)?/;
  const endPattern = /```/;

  interface CurrentCodeBlock {
    start: Line;
    language?: string;
    contents: string[];
  }

  let currentCodeBlock: CurrentCodeBlock = null;
  lines.forEach((text, index) => { 
    let startMatch = text.match(startPattern);
    if (currentCodeBlock == null && startMatch) {
      currentCodeBlock = {start: index + 1, language: startMatch[1], contents: []};
    } else if (currentCodeBlock != null && text.match(endPattern)) {
      let codeBlock: FencedCodeBlock = {
        start: currentCodeBlock.start,
        end: index + 1,
        language: currentCodeBlock.language,
        contents: currentCodeBlock.contents,
      }
      currentCodeBlock = null;
      codeBlocks.push(codeBlock);
    } else if (currentCodeBlock != null) {
      currentCodeBlock.contents.push(text); 
    }
  });
  return codeBlocks;
}

async function getWholeText(denops: Denops): Promise<string[]> {
  const lines = await denops.call("getline", 1, "$");
  return lines;
}

async function getCurrentCodeBlock(): Promise<FencedCodeBlock> {
  return null;
}

function buildTag(pos: HighlightedPosition): string {
  return `[.code-highlight: 1]`;
}

function insertTag(block: FencedCodeBlock, pos: HighlightedPosition): Promise<void> {
  const tag = buildTag(pos);
  let startLine = block.start;
  let beforeLine = startLine - 1;
  // await insert();
}

function convertGlobalToCodeBlockLine(line: number, codeBlock: FencedCodeBlock): number {
  return line - codeBlock.start;
}