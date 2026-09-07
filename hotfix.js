(()=>{
const BUILD='20260908.2';
const tag=document.querySelector('.buildTag');if(tag)tag.textContent='v '+BUILD;
let lastTouch=0;
function cardFor(el){const fp=el.closest('.fp[data-h]');return fp&&window.byH?byH[fp.dataset.h]:null}
function changeSentence(btn){const fp=btn.closest('.fp[data-h]');if(!fp)return;const c=byH[fp.dataset.h];if(!c)return;const list=(window.examples?examples(c):[example(c)]);if(!list||list.length<2)return;const wrap=fp.querySelector('.sentenceExample');if(!wrap)return;const idx=(Number(wrap.dataset.sentenceIndex||0)+1)%list.length,ex=list[idx];wrap.dataset.sentenceIndex=idx;const cn=wrap.querySelector('.exCn'),py=wrap.querySelector('.exPy'),en=wrap.querySelector('.exEn');if(cn)cn.textContent=ex[0]||'';if(py)py.textContent=ex[1]||'';if(en)en.textContent=ex[2]||'';wrap.animate?.([{opacity:.35,transform:'translateY(3px)'},{opacity:1,transform:'translateY(0)'}],{duration:180,easing:'ease-out'});btn.animate?.([{transform:'rotate(0)'},{transform:'rotate(180deg)'}],{duration:220});}
function activate(e){const sentence=e.target.closest?.('[data-next-sentence]');const stroke=e.target.closest?.('[data-stroke]');if(!sentence&&!stroke)return false;e.preventDefault();e.stopPropagation();e.stopImmediatePropagation?.();if(sentence)changeSentence(sentence);if(stroke){const c=cardFor(stroke);if(c)openStroke(c)}return true}
document.addEventListener('touchend',e=>{if(activate(e))lastTouch=Date.now()},{capture:true,passive:false});
document.addEventListener('click',e=>{if(Date.now()-lastTouch<700)return;activate(e)},true);
// iOS can occasionally settle the pager without firing the expected scroll callback.
// Re-dispatch after a completed swipe so the inline quiz creator always sees card 6.
const pager=document.querySelector('#pager');if(pager){pager.addEventListener('touchend',()=>setTimeout(()=>{if(!document.querySelector('.quizSlide')&&window.focusSet?.length>=6){const i=Math.round(pager.scrollLeft/Math.max(1,pager.clientWidth));if(i>=focusSet.length-1)pager.dispatchEvent(new Event('scroll'))}},60),{passive:true});}
window.__hanziBuild=BUILD;
})();