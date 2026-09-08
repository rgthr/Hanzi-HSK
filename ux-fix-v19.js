(()=>{
const BUILD='20260908.19';
const css=document.createElement('style');css.textContent=`
/* Modern Explore palette: neutral -> purple -> green -> pink/red. */
#wall .wt.ex-unseen{background:linear-gradient(145deg,#f8f9fb,#eef0f4)!important;color:#30323a!important;border-color:#e1e4e9!important}
#wall .wt.ex-learning{background:linear-gradient(145deg,#eee9ff 0%,#d8ccff 100%)!important;color:#4d2aa8!important;border-color:#c5b4ff!important}
#wall .wt.ex-mastered{background:linear-gradient(145deg,#dfffea 0%,#a9f2c4 100%)!important;color:#08733c!important;border-color:#8be4ad!important}
#wall .wt.ex-struggle{background:linear-gradient(145deg,#ffe7f0 0%,#ffc4d8 100%)!important;color:#9b2850!important;border-color:#f6a8c3!important}
[data-theme=dark] #wall .wt.ex-unseen{background:linear-gradient(145deg,#24262b,#30333a)!important;color:#f1f2f4!important;border-color:#3b3f47!important}
[data-theme=dark] #wall .wt.ex-learning{background:linear-gradient(145deg,#30264e,#49357c)!important;color:#ddd0ff!important;border-color:#604b93!important}
[data-theme=dark] #wall .wt.ex-mastered{background:linear-gradient(145deg,#173c2a,#17613a)!important;color:#b9f6d0!important;border-color:#278653!important}
[data-theme=dark] #wall .wt.ex-struggle{background:linear-gradient(145deg,#482333,#6a2b45)!important;color:#ffc6d9!important;border-color:#87405d!important}
/* One reveal system only. Older reveal layers are neutralised below. */
.sentenceExample .exPy,.sentenceExample .exEn{filter:none!important;opacity:1!important;pointer-events:auto!important}.sentenceExample.sentence-hidden .exPy,.sentenceExample.sentence-hidden .exEn{filter:none!important;opacity:1!important}.sentenceExample>.sentenceReveal,.sentenceMaskHint{display:none!important}.sentenceMask{display:block!important;width:100%!important;border:0!important;background:transparent!important;padding:0!important;margin:0!important;text-align:left!important;color:inherit!important}.sentenceMask .exPy,.sentenceMask .exEn{filter:none!important;opacity:1!important}.sentenceMask.isHidden .exPy,.sentenceMask.isHidden .exEn{filter:blur(6px)!important;opacity:.34!important}
`;
document.head.appendChild(css);
function prepare(x){if(!x)return;let mask=x.querySelector('.sentenceMask');let py=x.querySelector('.exPy'),en=x.querySelector('.exEn');if(!py||!en)return;if(!mask){mask=document.createElement('button');mask.type='button';mask.className='sentenceMask';py.before(mask);mask.append(py,en)}x.classList.remove('sentence-hidden');mask.classList.add('isHidden');mask.onclick=null;mask.addEventListener('click',function reveal(e){e.preventDefault();e.stopImmediatePropagation();this.classList.toggle('isHidden')},true)}
function scan(root=document){root.querySelectorAll?.('.sentenceExample').forEach(prepare)}
new MutationObserver(ms=>ms.forEach(m=>m.addedNodes.forEach(n=>{if(n.nodeType===1){if(n.matches?.('.sentenceExample'))prepare(n);scan(n)}}))).observe(document.body,{childList:true,subtree:true});
/* Prevent old capture listeners from seeing taps on the reveal area. */
document.addEventListener('pointerup',e=>{const m=e.target.closest?.('.sentenceMask');if(!m)return;e.stopImmediatePropagation()},true);
scan();const vr=document.querySelector('#settingsSheet .versionRow b');if(vr)vr.textContent='v '+BUILD;window.__hanziBuild=BUILD;
})();