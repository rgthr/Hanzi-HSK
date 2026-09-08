(()=>{
const BUILD='20260908.21';
const css=document.createElement('style');css.textContent=`
/* Stable sentence recall: no nested button, one tap, every card. */
.sentenceRecall{display:contents!important}.sentenceRecallHint{display:none!important}.sentenceExample .exPy,.sentenceExample .exEn{transition:filter .12s ease,opacity .12s ease}.sentenceExample.recall-hidden .exPy,.sentenceExample.recall-hidden .exEn{filter:blur(6px)!important;opacity:.34!important}.sentenceExample:not(.recall-hidden) .exPy,.sentenceExample:not(.recall-hidden) .exEn{filter:none!important;opacity:1!important}.sentenceExample{cursor:pointer;-webkit-tap-highlight-color:transparent;touch-action:manipulation}
/* Quiz interaction owns its gestures; parent pager must not steal taps/writing. */
.quizSlide button,.quizSixConnect .matchItem,.quizSixWrite .writeCanvas{position:relative;z-index:20}.quizSixWrite .writeCanvas,.quizSixWrite .writeTarget,.quizSixWrite .writeTarget svg{touch-action:none!important;-webkit-user-select:none!important;user-select:none!important}.quizSixConnect .matchItem{touch-action:manipulation}
`;
document.head.appendChild(css);
/* Unwrap v20 sentence buttons so iOS is not handling a button inside a swipe surface. */
function sentence(x){if(!x)return;const old=x.querySelector('.sentenceRecall');if(old){const py=old.querySelector('.exPy'),en=old.querySelector('.exEn');if(py)x.appendChild(py);if(en)x.appendChild(en);old.remove()}x.classList.add('recall-hidden');x.dataset.stableRecall='1'}
function scan(root=document){root.querySelectorAll?.('.sentenceExample').forEach(sentence)}
scan();new MutationObserver(ms=>ms.forEach(m=>m.addedNodes.forEach(n=>{if(n.nodeType===1){if(n.matches?.('.sentenceExample'))sentence(n);scan(n)}}))).observe(document.body,{childList:true,subtree:true});
/* pointerup fires once on iOS; click is intentionally not used, avoiding the old double-toggle. */
document.addEventListener('pointerup',e=>{const x=e.target.closest?.('.sentenceExample');if(!x||e.target.closest('[data-next-sentence]'))return;e.preventDefault();e.stopPropagation();x.classList.toggle('recall-hidden')},true);
document.addEventListener('click',e=>{if(e.target.closest?.('.sentenceExample')&&!e.target.closest('[data-next-sentence]')){e.preventDefault();e.stopImmediatePropagation()}},true);
/* Freeze the six-question quiz after it is first built. The previous observer was rebuilding it on mutations. */
function freezeQuiz(){const pager=document.getElementById('pager');if(!pager)return;const slides=[...pager.querySelectorAll('.quizSlide')];if(slides.length<6)return;pager.dataset.q14sig='LOCKED-'+[...pager.querySelectorAll('.fp[data-h]')].slice(0,6).map(x=>x.dataset.h).join('');}
setTimeout(freezeQuiz,700);
/* Stop pager swipe handlers only while interacting with quiz controls/canvas. */
['touchstart','touchmove','touchend','pointerdown','pointermove','pointerup'].forEach(type=>document.addEventListener(type,e=>{if(e.target.closest?.('.quizSlide button,.quizSixWrite .writeCanvas,.quizSixWrite .writeTarget'))e.stopPropagation()},true));
const vr=document.querySelector('#settingsSheet .versionRow b');if(vr)vr.textContent='v '+BUILD;window.__hanziBuild=BUILD;
})();