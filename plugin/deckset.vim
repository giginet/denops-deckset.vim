function! deckset#wrapper() range
  let first = a:firstline
  let last = a:lastline
  call denops#request('deckset', 'insertCodeHighlight', [first, last])
endfunction

command! -range InsertCodeHighlight :<line1>,<line2>call deckset#wrapper() 

let g:deckset#show_slide_numbers=0
let g:deckset#show_slide_count=0
let g:deckset#slide_dividers="#"
let g:deckset#autoscale=0
let g:deckset#slide_transition=0
let g:deckset#footer=""
let g:deckset#theme=""
