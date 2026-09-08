(()=>{
const BUILD='20260908.31';
const css=document.createElement('style');css.textContent=`
/* Explore: neutral interiors; gradient only on the rim. */
#wall .wt.ex-unseen,#wall .wt.ex-learning,#wall .wt.ex-mastered,#wall .wt.ex-struggle{color:var(--ink)!important;text-shadow:none!important;border:2px solid transparent!important;background:linear-gradient(var(--paper),var(--paper)) padding-box,linear-gradient(135deg,#d9dee7,#eef1f5) border-box!important}
/* Learning = purple only. */
#wall .wt.ex-learning{background:linear-gradient(var(--paper),var(--paper)) padding-box,linear-gradient(135deg,#7c3aed,#a855f7,#c084fc) border-box!important}
/* Mastered = green only, no blue. */
#wall .wt.ex-mastered{background:linear-gradient(var(--paper),var(--paper)) padding-box,linear-gradient(135deg,#16a34a,#34d399,#86efac) border-box!important}
#wall .wt.ex-struggle{background:linear-gradient(var(--paper),var(--paper)) padding-box,linear-gradient(135deg,#fb7185,#ec4899,#c026d3) border-box!important}
.v31write .quizBody{display:flex!important;flex-direction:column!important;align-items:center!important;justify-content:center!important;gap:14px!important;text-align:center!important}
.v31write .practiceHero{font-size:82px;line-height:1;font-family:"Songti SC","STSong",serif}
.v31write .practicePrompt{font-size:13px;color:var(--muted);max-width:290px;line-height:1.4}
.v31write .stroke{width:min(100%,340px);margin-top:4px!important}
.v31write .finishQuiz{display:block!important;margin-top:4px!important}
`;
document.head.appendChild(css);

function makeExactPractice(slide,set){
  if(!slide||slide.dataset.v31Exact)return;slide.dataset.v31Exact='1';
  const meaning=slide.querySelector('.writePrompt .meaning')?.textContent||'';
  const py=slide.querySelector('.writePrompt .pinyin')?.textContent||'';
  const c=(set||[]).find(x=>x.contextMeaning===meaning&&x.p===py)||(set||[])[0];
  if(!c)return;
  slide.classList.add('v31write');
  const body=slide.querySelector('.quizBody');if(!body)return;
  body.innerHTML=`<div class="practiceHero">${c.h}</div><div class="practicePrompt">Use the same writing practice as on the learning card.</div><button type="button" class="stroke" data-v31-practice>✍️ Practice stroke order</button><button type="button" class="finishQuiz" data-v31-finish>Finish quiz</button>`;
  slide._start=()=>{};slide.dataset.started='1';slide.dataset.preloaded='1';
  body.querySelector('[data-v31-practice]').onclick=e=>{e.preventDefault();e.stopPropagation();openStroke(c)};
  body.querySelector('[data-v31-finish]').onclick=e=>{e.preventDefault();e.stopPropagation();closeFocus();nextBoard()};
}
const prev=window.openFocus;
window.openFocus=function(set,start=0){
  const out=prev(set,start);
  const slide=document.querySelector('.v26write');
  if(slide)makeExactPractice(slide,set);
  return out;
};
const vr=document.querySelector('#settingsSheet .versionRow b');if(vr)vr.textContent='v '+BUILD;window.__hanziBuild=BUILD;
})();