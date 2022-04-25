type Line = number;

export interface CodeBlock {
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

export function traverseAllCodeBlocks(lines: string[]): CodeBlock[] {
  let codeBlocks: CodeBlock[] = [];
  const startPattern = /```(.+)?/;
  const endPattern = /```/;

  let currentCodeBlock: CodeBlock | null = null;
  lines.forEach((text, index) => { 
    let startMatch = text.match(startPattern);
    if (currentCodeBlock == null && startMatch) {
      currentCodeBlock = {start: index + 1, end: -1, language: startMatch[1], contents: []};
    } else if (currentCodeBlock != null && text.match(endPattern)) {
      let codeBlock: CodeBlock = {
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

export async function getCurrentCodeBlock(line: Line, codeBlocks: CodeBlock[]): Promise<CodeBlock | null> {
  for (const codeBlock of codeBlocks) {
    if (codeBlock.start >= line && line <= codeBlock.end) {
      return codeBlock;
    }
  }
  return null;
}

function buildTag(pos: HighlightedPosition): string {
  return `[.code-highlight: 1]`;
}

function convertGlobalToCodeBlockLine(line: number, codeBlock: CodeBlock): number {
  return line - codeBlock.start;
}