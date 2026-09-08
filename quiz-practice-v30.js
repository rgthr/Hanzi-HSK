(()=>{
const BUILD='20260908.30';
const css=document.createElement('style');css.textContent=`
/* Explore: keep tile interiors neutral; encode progress only in a gradient rim. */
#wall .wt.ex-unseen,#wall .wt.ex-learning,#wall .wt.ex-mastered,#wall .wt.ex-struggle{color:var(--ink)!important;text-shadow:none!important;border:2px solid transparent!important;background:linear-gradient(var(--paper),var(--paper)) padding-box,linear-gradient(135deg,#d9dee7,#eef1f5) border-box!important}
#wall .wt.ex-learning{background:linear-gradient(var(--paper),var(--paper)) padding-box,linear-gradient(135deg,#22d3ee,#818cf8,#a855f7) border-box!important}
#wall .wt.ex-mastered{background:linear-gradient(var(--paper),var(--paper)) padding-box,linear-gradient(135deg,#34d399,#2dd4bf,#38bdf8) border-box!important}
#wall .wt.ex-struggle{background:linear-gradient(var(--paper),var(--paper)) padding-box,linear-gradient(135deg,#fb7185,#ec4899,#c026d3) border-box!important}
/* Writing quiz now visually matches the proven card-practice surface. */
.v26write .writeCanvas{background:var(--paper)!important}
.v26write .writeFlash{display:none!important}
`;
document.head.appendChild(css);

/* Reuse the exact stroke-practice engine for quiz question 6.
   We temporarily point its expected DOM ids at the quiz surface, call strokeQuiz,
   then restore the practice pane ids immediately. This keeps one writer implementation. */
function wirePracticeWriter(slide){
  if(!slide||slide.dataset.v30Writer)return;slide.dataset.v30Writer='1';
  const target=slide.querySelector('.writeTarget'),canvas=slide.querySelector('.writeCanvas'),status=slide.querySelector('.writeStatus');
  if(!target||!canvas||!status)return;
  const c=(()=>{try{const set=window.focusSet||[];const meaning=slide.querySelector('.writePrompt .meaning')?.textContent;const py=slide.querySelector('.writePrompt .pinyin')?.textContent;return set.find(x=>x.contextMeaning===meaning&&x.p===py)||set[0]}catch{return null}})();
  if(!c)return;
  const practiceTarget=document.getElementById('target'),practiceStatus=document.getElementById('strokeStatus');
  function start(){
    target.innerHTML='';slide.classList.remove('done');
    const oldTargetId=practiceTarget?.id,oldStatusId=practiceStatus?.id,oldCanvasId=canvas.id;
    if(practiceTarget)practiceTarget.id='practiceTargetParked';if(practiceStatus)practiceStatus.id='practiceStatusParked';
    target.id='target';status.id='strokeStatus';canvas.id='v30QuizCanvas';
    try{window.strokeQuiz?.(c)}finally{target.id='';status.id='';canvas.id=oldCanvasId||'';if(practiceTarget)practiceTarget.id=oldTargetId||'target';if(practiceStatus)practiceStatus.id=oldStatusId||'strokeStatus'}
    /* strokeQuiz's callbacks look up strokeStatus later, so keep a stable alias local to the quiz while active. */
    status.id='strokeStatus';
    const observer=new MutationObserver(()=>{if(/Character complete/i.test(status.textContent)){slide.dataset.answered='1';slide.classList.add('done');observer.disconnect()}});observer.observe(status,{childList:true,subtree:true,characterData:true});
  }
  slide._start=start;slide.dataset.started='';slide.dataset.preloaded='';
  const restart=slide.querySelector('[data-restart]');if(restart)restart.onclick=e=>{e.preventDefault();e.stopPropagation();start()};
  const model=slide.querySelector('[data-model]');if(model){model.textContent='Show model';model.onclick=e=>{e.preventDefault();e.stopPropagation();try{writer?.showOutline?.()}catch{};model.textContent='Model visible'}}
}
function upgrade(){document.querySelectorAll('.v26write').forEach(wirePracticeWriter)}
const prev=window.openFocus;window.openFocus=function(set,start=0){const out=prev(set,start);requestAnimationFrame(()=>requestAnimationFrame(()=>requestAnimationFrame(upgrade)));return out};
const vr=document.querySelector('#settingsSheet .versionRow b');if(vr)vr.textContent='v '+BUILD;window.__hanziBuild=BUILD;
})();