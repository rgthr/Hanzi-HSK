(()=>{
const BUILD='20260908.13';
const style=document.createElement('style');style.textContent=`
.sentenceExample{position:relative;cursor:pointer;-webkit-tap-highlight-color:transparent}.sentenceExample .exPy,.sentenceExample .exEn{transition:filter .18s ease,opacity .18s ease}.sentenceExample.sentence-hidden .exPy,.sentenceExample.sentence-hidden .exEn{filter:blur(6px);opacity:.38;user-select:none}.sentenceExample.sentence-hidden:after{content:'Tap to reveal pinyin + meaning';display:block;margin-top:5px;font-size:10px;color:var(--muted);letter-spacing:.01em}.sentenceExample:not(.sentence-hidden):after{content:'Tap to hide';display:block;margin-top:5px;font-size:10px;color:var(--muted);opacity:.65}
`;
document.head.appendChild(style);
function hideAll(root=document){root.querySelectorAll('.sentenceExample').forEach(x=>{x.classList.add('sentence-hidden');x.setAttribute('role','button');x.setAttribute('tabindex','0');x.setAttribute('aria-label','Reveal pinyin and translation')})}
document.addEventListener('click',e=>{const x=e.target.closest('.sentenceExample');if(!x||e.target.closest('[data-next-sentence]'))return;e.preventDefault();e.stopImmediatePropagation();x.classList.toggle('sentence-hidden');x.setAttribute('aria-label',x.classList.contains('sentence-hidden')?'Reveal pinyin and translation':'Hide pinyin and translation')},true);
document.addEventListener('keydown',e=>{const x=e.target.closest?.('.sentenceExample');if(!x||(e.key!=='Enter'&&e.key!==' '))return;e.preventDefault();x.classList.toggle('sentence-hidden')});
const observer=new MutationObserver(m=>{m.forEach(r=>r.addedNodes.forEach(n=>{if(n.nodeType===1){if(n.matches?.('.sentenceExample'))hideAll(n.parentElement);else hideAll(n)}}))});observer.observe(document.body,{childList:true,subtree:true});
/* Cycling to another sentence should always return to recall mode. */
document.addEventListener('click',e=>{if(!e.target.closest('[data-next-sentence]'))return;setTimeout(()=>{const fp=e.target.closest('.fp'),x=fp&&fp.querySelector('.sentenceExample');if(x)x.classList.add('sentence-hidden')},0)},true);
hideAll();const vr=document.querySelector('#settingsSheet .versionRow b');if(vr)vr.textContent='v '+BUILD;window.__hanziBuild=BUILD;
})();