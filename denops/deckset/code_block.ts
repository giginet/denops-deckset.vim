type Line = number;

export interface CodeBlock {
  start: Line;
  end: Line;
  language?: string;
  contents: string[];
}

export interface Range {
    start: Line,
    end: Line,
}

type HighlightedPosition = Line | Range | Array<Line>

export function traverseAllCodeBlocks(lines: string[]): CodeBlock[] {
  let codeBlocks: CodeBlock[] = [];
  const startPattern = /^```(.+)?$/;
  const endPattern = /^```$/;

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

export function getCurrentCodeBlock(line: Line, codeBlocks: CodeBlock[]): CodeBlock | null {
  for (const codeBlock of codeBlocks) {
    if (line >= codeBlock.start && line <= codeBlock.end) {
      return codeBlock;
    }
  }
  return null;
}

export function buildTag(pos: HighlightedPosition): string {
    if (typeof pos === 'number') {
        return `[.code-highlight: ${pos}]`;
    } else if ('start' in pos && 'end' in pos) {
        return `[.code-highlight: ${pos.start}-${pos.end}]`;
    } else if (pos instanceof Array) {
        return `[.code-highlight: ${pos.join(',')}]`;
    } else {
        throw "unknown";
    }
}

export function buildInsertingInfo(codeBlock: CodeBlock, globalLine: Line): [string, Line] | null {
    if (codeBlock.start == globalLine || codeBlock.end == globalLine) {
        return null;
    }
    const lineToInsert = codeBlock.start - 1;
    const blockLine = globalLine - codeBlock.start;
    const tag = buildTag(blockLine);
    return [tag, lineToInsert];
}