function! deckset#wrapper() range
  let first = a:firstline
  let last = a:lastline
  call denops#request('deckset', 'insertCodeHighlight', [first, last])
endfunction

command! -range InsertCodeHighlight :<line1>,<line2>call deckset#wrapper() 
