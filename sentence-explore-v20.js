(()=>{
const BUILD='20260908.20';
const css=document.createElement('style');css.textContent=`
/* Explore: vibrant modern gradients */
#wall .wt.ex-unseen{background:linear-gradient(145deg,#f8fafc,#edf1f5)!important;color:#2f3437!important;border-color:#e0e5ea!important}
#wall .wt.ex-learning{background:linear-gradient(145deg,#f0eaff 0%,#d7c8ff 55%,#c8b6ff 100%)!important;color:#4b2a9b!important;border-color:#bda8ff!important}
#wall .wt.ex-mastered{background:linear-gradient(145deg,#ddffe9 0%,#a9f7c8 55%,#7de7aa 100%)!important;color:#086b39!important;border-color:#74d99d!important}
#wall .wt.ex-struggle{background:linear-gradient(145deg,#ffe7f2 0%,#ffc4db 55%,#ffabc9 100%)!important;color:#96294f!important;border-color:#f597ba!important}
[data-theme=dark] #wall .wt.ex-unseen{background:linear-gradient(145deg,#24272d,#30343c)!important;color:#f2f3f5!important;border-color:#3c414a!important}
[data-theme=dark] #wall .wt.ex-learning{background:linear-gradient(145deg,#302550,#4a347d)!important;color:#e1d5ff!important;border-color:#644b9c!important}
[data-theme=dark] #wall .wt.ex-mastered{background:linear-gradient(145deg,#173e2a,#17663c)!important;color:#c2f8d6!important;border-color:#2b8b58!important}
[data-theme=dark] #wall .wt.ex-struggle{background:linear-gradient(145deg,#482233,#6b2b47)!important;color:#ffd0df!important;border-color:#88425f!important}
/* Sentence recall: one single implementation, no layered reveal states. */
.sentenceRecall{display:block;width:100%;border:0;background:transparent;padding:0;margin:0;text-align:left;font:inherit;color:inherit;-webkit-tap-highlight-color:transparent;touch-action:manipulation}.sentenceRecall .exPy,.sentenceRecall .exEn{transition:filter .15s ease,opacity .15s ease}.sentenceRecall.is-hidden .exPy,.sentenceRecall.is-hidden .exEn{filter:blur(6px);opacity:.34}.sentenceRecallHint{display:block;margin-top:5px;font-size:10px;font-weight:650;color:var(--muted)}
`;
document.head.appendChild(css);
function bindSentence(x){
  if(!x||x.dataset.recallV20)return;
  const py=x.querySelector(':scope > .exPy'),en=x.querySelector(':scope > .exEn');
  if(!py||!en)return;
  x.dataset.recallV20='1';
  const b=document.createElement('button');
  b.type='button';b.className='sentenceRecall is-hidden';
  py.before(b);b.append(py,en);
  const hint=document.createElement('span');hint.className='sentenceRecallHint';hint.textContent='Tap to reveal pinyin + meaning';b.appendChild(hint);
  b.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();const hidden=b.classList.toggle('is-hidden');hint.textContent=hidden?'Tap to reveal pinyin + meaning':'Tap to hide pinyin + meaning'});
}
function bindAll(root=document){root.querySelectorAll?.('.sentenceExample').forEach(bindSentence)}
new MutationObserver(ms=>ms.forEach(m=>m.addedNodes.forEach(n=>{if(n.nodeType!==1)return;if(n.matches?.('.sentenceExample'))bindSentence(n);bindAll(n)}))).observe(document.body,{childList:true,subtree:true});
/* When the sentence cycles, the existing patch updates exPy/exEn in place. Put recall back into hidden mode. */
document.addEventListener('click',e=>{const n=e.target.closest?.('[data-next-sentence]');if(!n)return;setTimeout(()=>{const x=n.closest('.fp')?.querySelector('.sentenceExample'),b=x?.querySelector('.sentenceRecall');if(b){b.classList.add('is-hidden');const h=b.querySelector('.sentenceRecallHint');if(h)h.textContent='Tap to reveal pinyin + meaning'}},0)},false);
bindAll();
const vr=document.querySelector('#settingsSheet .versionRow b');if(vr)vr.textContent='v '+BUILD;window.__hanziBuild=BUILD;
})();