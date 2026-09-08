(()=>{
const BUILD='20260908.17';
const style=document.createElement('style');style.textContent=`
/* Reveal is deliberately 100% local: no fetch, audio or Hanzi Writer dependency. */
.sentenceExample{cursor:pointer;touch-action:manipulation}.sentenceExample .exPy,.sentenceExample .exEn{transition:filter .16s ease,opacity .16s ease}.sentenceExample.sentence-hidden .exPy,.sentenceExample.sentence-hidden .exEn{filter:blur(6px)!important;opacity:.34!important;pointer-events:none!important;user-select:none!important}.sentenceExample:not(.sentence-hidden) .exPy,.sentenceExample:not(.sentence-hidden) .exEn{filter:none!important;opacity:1!important}.sentenceReveal{touch-action:manipulation;-webkit-user-select:none;user-select:none}
`;document.head.appendChild(style);
function sync(x){if(!x)return;let b=x.querySelector('.sentenceReveal');if(!b){b=document.createElement('button');b.type='button';b.className='sentenceReveal';x.appendChild(b)}const hidden=x.classList.contains('sentence-hidden');b.textContent=hidden?'Reveal pinyin + meaning':'Hide pinyin + meaning';b.setAttribute('aria-expanded',String(!hidden));}
function ensure(x){if(!x)return;if(!x.dataset.offlineReveal){x.dataset.offlineReveal='1';x.classList.add('sentence-hidden')}sync(x)}
function toggle(x){ensure(x);x.classList.toggle('sentence-hidden');sync(x)}
function bindAll(root=document){root.querySelectorAll?.('.sentenceExample').forEach(ensure)}
/* Capture-phase tap makes this reliable on iOS/PWA and works fully offline once the card is rendered. */
document.addEventListener('click',e=>{const x=e.target.closest?.('.sentenceExample');if(!x)return;if(e.target.closest('[data-next-sentence]'))return;e.preventDefault();e.stopImmediatePropagation();toggle(x)},true);
document.addEventListener('keydown',e=>{const x=e.target.closest?.('.sentenceExample');if(!x||(e.key!=='Enter'&&e.key!==' '))return;e.preventDefault();toggle(x)},true);
const mo=new MutationObserver(ms=>ms.forEach(m=>m.addedNodes.forEach(n=>{if(n.nodeType!==1)return;if(n.matches?.('.sentenceExample'))ensure(n);bindAll(n)})));mo.observe(document.body,{childList:true,subtree:true});
/* New sentence = hidden again, without needing any network call. */
document.addEventListener('click',e=>{const n=e.target.closest?.('[data-next-sentence]');if(!n)return;setTimeout(()=>{const x=n.closest('.fp')?.querySelector('.sentenceExample');if(x){x.classList.add('sentence-hidden');sync(x)}},0)},true);
bindAll();const vr=document.querySelector('#settingsSheet .versionRow b');if(vr)vr.textContent='v '+BUILD;window.__hanziBuild=BUILD;
})();