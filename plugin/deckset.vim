function! deckset#wrapper() range
  let first = a:firstline
  let last = a:lastline
  call denops#request('deckset', 'insertCodeHighlight', [first, last])
endfunction

command! -range InsertCodeHighlight :<line1>,<line2>call deckset#wrapper() 

function! s:define(name, default) abort
  let g:{a:name} = get(g:, a:name, a:default)
endfunction

call s:define('deckset#show_slide_numbers', 0)
call s:define('deckset#show_slide_count', 0)
call s:define('deckset#slide_dividers', '#')
call s:define('deckset#autoscale', 0)
call s:define('deckset#slide_transition', 0)
call s:define('deckset#footer', "")
call s:define('deckset#theme', "")
