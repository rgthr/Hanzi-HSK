(()=>{
const BUILD='20260908.16';
const style=document.createElement('style');style.textContent=`
.sentenceExample{position:relative;-webkit-tap-highlight-color:transparent}.sentenceExample .exPy,.sentenceExample .exEn{transition:filter .18s ease,opacity .18s ease}.sentenceExample.sentence-hidden .exPy,.sentenceExample.sentence-hidden .exEn{filter:blur(6px);opacity:.34;user-select:none;pointer-events:none}.sentenceReveal{margin-top:6px;min-height:34px;padding:0 10px;border:1px solid var(--line);border-radius:8px;background:var(--paper);color:var(--muted);font:inherit;font-size:10px;font-weight:650}.sentenceReveal:active{transform:scale(.98)}.sentenceExample:not(.sentence-hidden) .sentenceReveal{opacity:.68}
`;
document.head.appendChild(style);
function setHidden(x,hidden){x.classList.toggle('sentence-hidden',hidden);const b=x.querySelector('.sentenceReveal');if(b){b.textContent=hidden?'Reveal pinyin + meaning':'Hide pinyin + meaning';b.setAttribute('aria-expanded',String(!hidden))}}
function bindOne(x){if(!x||x.dataset.revealBound)return;x.dataset.revealBound='1';let b=x.querySelector('.sentenceReveal');if(!b){b=document.createElement('button');b.type='button';b.className='sentenceReveal';x.appendChild(b)}setHidden(x,true);
const toggle=e=>{e.preventDefault();e.stopPropagation();setHidden(x,!x.classList.contains('sentence-hidden'))};
b.addEventListener('click',toggle);
/* Also make the blurred pinyin/translation area itself tappable on iOS. */
x.addEventListener('pointerup',e=>{if(e.target.closest('.sentenceReveal'))return;if(e.target.closest('.exPy,.exEn'))toggle(e)});
}
function bindAll(root=document){root.querySelectorAll?.('.sentenceExample').forEach(bindOne)}
const observer=new MutationObserver(m=>{m.forEach(r=>r.addedNodes.forEach(n=>{if(n.nodeType!==1)return;if(n.matches?.('.sentenceExample'))bindOne(n);bindAll(n)}))});observer.observe(document.body,{childList:true,subtree:true});
/* A new example always starts hidden again. */
document.addEventListener('click',e=>{const n=e.target.closest('[data-next-sentence]');if(!n)return;setTimeout(()=>{const fp=n.closest('.fp'),x=fp&&fp.querySelector('.sentenceExample');if(x){bindOne(x);setHidden(x,true)}},0)},true);
bindAll();const vr=document.querySelector('#settingsSheet .versionRow b');if(vr)vr.textContent='v '+BUILD;window.__hanziBuild=BUILD;
})();