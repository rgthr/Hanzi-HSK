(()=>{
const BUILD='20260908.24';
const st=document.createElement('style');st.textContent=`
/* Actual Explore DOM uses .wallTile + state classes. */
#wall .wallTile.unseen{background:linear-gradient(135deg,#f8fafc,#e8edf5)!important;color:#172033!important;border-color:#d9e0ea!important}
#wall .wallTile.learning{background:linear-gradient(135deg,#22d3ee 0%,#818cf8 52%,#a855f7 100%)!important;color:#101827!important;border-color:rgba(16,24,39,.12)!important;text-shadow:0 1px rgba(255,255,255,.3)}
#wall .wallTile.mastered{background:linear-gradient(135deg,#34d399 0%,#2dd4bf 48%,#38bdf8 100%)!important;color:#082f2b!important;border-color:rgba(8,47,43,.12)!important;text-shadow:0 1px rgba(255,255,255,.28)}
#wall .wallTile.struggle,#wall .wallTile.needsWork{background:linear-gradient(135deg,#fb7185 0%,#ec4899 48%,#c026d3 100%)!important;color:#351020!important;border-color:rgba(53,16,32,.12)!important;text-shadow:0 1px rgba(255,255,255,.22)}
#wall .wallTile.learning:after,#wall .wallTile.mastered:after,#wall .wallTile.struggle:after,#wall .wallTile.needsWork:after{background:rgba(17,24,39,.38)!important}
/* One interaction surface for sentence + sentence swap. */
.sentenceExample .exPy,.sentenceExample .exEn{transition:filter .11s ease,opacity .11s ease}.sentenceExample[data-revealed="0"] .exPy,.sentenceExample[data-revealed="0"] .exEn{filter:blur(6px)!important;opacity:.34!important}.sentenceExample[data-revealed="1"] .exPy,.sentenceExample[data-revealed="1"] .exEn{filter:none!important;opacity:1!important}
`;
document.head.appendChild(st);

/* Disable v22/v23 sentence listeners by replacing their DOM nodes with clean clones.
   A single capture pointerup handler now owns BOTH reveal and ↻, so scroll-snap cannot eat a click. */
function cleanFocus(){document.querySelectorAll('.fp[data-h]').forEach(fp=>{
 const old=fp.querySelector('.sentenceExample');if(old&&!old.dataset.v24){const x=old.cloneNode(true);x.dataset.v24='1';x.dataset.revealed='0';x.classList.remove('sentence-hidden-v22');old.replaceWith(x)}
 const oldN=fp.querySelector('[data-next-sentence]');if(oldN&&!oldN.dataset.v24){const n=oldN.cloneNode(true);n.dataset.v24='1';oldN.replaceWith(n)}
})}
cleanFocus();new MutationObserver(cleanFocus).observe(document.getElementById('pager')||document.body,{childList:true,subtree:true});
let down=null,lastHandled=0;
document.addEventListener('pointerdown',e=>{const target=e.target.closest?.('.sentenceExample,[data-next-sentence]');if(!target)return;down={target,x:e.clientX,y:e.clientY,id:e.pointerId}},true);
document.addEventListener('pointerup',e=>{if(!down||down.id!==e.pointerId)return;const d=down;down=null;if(Math.hypot(e.clientX-d.x,e.clientY-d.y)>14)return;const next=e.target.closest?.('[data-next-sentence]');const sentence=e.target.closest?.('.sentenceExample');if(!next&&!sentence)return;e.preventDefault();e.stopImmediatePropagation();lastHandled=Date.now();if(next){const fp=next.closest('.fp'),c=window.byH?.[fp?.dataset.h],wrap=fp?.querySelector('.sentenceExample');if(!c||!wrap)return;const list=window.examples?.(c)||[];if(!list.length)return;const idx=(Number(wrap.dataset.sentenceIndex||0)+1)%list.length,ex=list[idx];wrap.dataset.sentenceIndex=idx;wrap.querySelector('.exCn').textContent=ex[0]||'';wrap.querySelector('.exPy').textContent=ex[1]||'';wrap.querySelector('.exEn').textContent=ex[2]||'';wrap.dataset.revealed='0';return}sentence.dataset.revealed=sentence.dataset.revealed==='1'?'0':'1'},true);
document.addEventListener('click',e=>{if(Date.now()-lastHandled>600)return;if(e.target.closest?.('.sentenceExample,[data-next-sentence]')){e.preventDefault();e.stopImmediatePropagation()}},true);

/* Hanzi Writer's default highlight animation makes accepted strokes feel delayed.
   Patch quiz options before v22 creates future writers: immediate accepted-stroke feedback, no highlight animation. */
if(window.HanziWriter&&HanziWriter.create&&!HanziWriter.__v24){HanziWriter.__v24=true;const create=HanziWriter.create.bind(HanziWriter);HanziWriter.create=function(el,ch,opts={}){const w=create(el,ch,{...opts,strokeAnimationSpeed:3,delayBetweenStrokes:20});const q=w.quiz.bind(w);w.quiz=function(qopts={}){let statusTimer=0;const userCorrect=qopts.onCorrectStroke;return q({...qopts,showHintAfterMisses:1,highlightOnComplete:false,onCorrectStroke:d=>{clearTimeout(statusTimer);userCorrect?.(d)}})};return w}}
/* Existing writing canvas: remove costly status repaint after every stroke visually; completion remains immediate. */
const qstyle=document.createElement('style');qstyle.textContent=`.quizV22Write .writeTarget svg{transform:translateZ(0);backface-visibility:hidden}.quizV22Write .writeStatus{contain:content}`;document.head.appendChild(qstyle);
const vr=document.querySelector('#settingsSheet .versionRow b');if(vr)vr.textContent='v '+BUILD;document.querySelectorAll('.buildTag').forEach(x=>x.textContent='v '+BUILD);window.__hanziBuild=BUILD;
})();