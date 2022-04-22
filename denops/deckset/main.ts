import { Denops } from "https://deno.land/x/denops_std@v1.0.0/mod.ts";

export async function main(denops: Denops): Promise<void> {
  console.log("Hello Denops!");

  denops.dispatcher = {
    async insertCodeHighlight(pos: number): Promise<void> {

    }
  };
  await denops.cmd(`command! IH call denops#request('${denops.name}', 'insertCodeHighlight', [])`);
};

interface FencedCodeBlock {
  start: number;
  end: number;
  language?: string;
  content: string;
}