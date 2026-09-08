/* HANZI CONSOLIDATED LESSON COMPLETION
   Version: CONSOLIDATED 2.4.0
   Owns only post-checkpoint remediation + lesson summary/advance.
*/
(()=>{
'use strict';
const LESSON_SIZE=12;
const S=()=>window.HanziStore;
const st=()=>S()?.state||{};
const all=()=>S()?.ALL||[];
const byH=h=>S()?.byH?.[h];
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
const unique=xs=>{const out=[],seen=new Set();for(const x of xs||[]){const h=typeof x==='string'?x:x?.h;if(h&&!seen.has(h)){seen.add(h);out.push(typeof x==='string'?byH(h):x)}}return out.filter(Boolean)};
const shuffled=list=>{const a=[...(list||[])];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
function info(lesson=Number(st().currentLesson||1)){
  const totalLessons=Math.max(1,Math.ceil(all().length/LESSON_SIZE));
  lesson=clamp(lesson,1,totalLessons);
  return{lesson,totalLessons,chars:all().slice((lesson-1)*LESSON_SIZE,lesson*LESSON_SIZE)};
}
function checkpoint(lesson){return Number(st().lessonCheckpoints?.[lesson]||0)}
function misses(lesson){
  const ids=[...(st().lessonMissed?.[lesson]||[]),...(st().lessonExtraMissed?.[lesson]||[])];
  const allowed=new Set(info(lesson).chars.map(c=>c.h));
  return unique(ids).filter(c=>allowed.has(c.h));
}
function save(){S().save?.()}
function ensureStyles(){
  if(document.getElementById('lessonCompletionStyles'))return;
  const x=document.createElement('style');x.id='lessonCompletionStyles';x.textContent=`
  .lcOverlay{position:fixed;z-index:250;inset:0;background:var(--bg);color:var(--ink);display:flex;flex-direction:column;padding:calc(12px + env(safe-area-inset-top)) 16px calc(18px + env(safe-area-inset-bottom));font-family:-apple-system,BlinkMacSystemFont,"SF Pro Text","Inter","PingFang SC",sans-serif}
  .lcTop{height:42px;display:flex;align-items:center;justify-content:space-between;flex:none}.lcTop b{font-size:12px;color:var(--muted)}.lcClose{width:40px;height:40px;border:0;background:transparent;border-radius:9px;font-size:25px;color:var(--muted)}
  .lcCard{flex:1;min-height:0;background:var(--paper);border:1px solid var(--line);border-radius:16px;box-shadow:var(--shadow);padding:20px 18px;display:flex;flex-direction:column;overflow:auto}
  .lcEyebrow{font-size:10px;letter-spacing:.09em;font-weight:800;color:var(--green);text-transform:uppercase}.lcTitle{font-size:29px;line-height:1.03;letter-spacing:-.04em;margin:7px 0 7px}.lcSub{font-size:14px;color:var(--muted);line-height:1.4;margin-bottom:18px}
  .lcQHero{text-align:center;margin:25px 0 22px;font-family:"Songti SC","PingFang SC",serif;font-size:92px;line-height:1}.lcQHero.word{font-family:inherit;font-size:30px;font-weight:780;line-height:1.15}
  .lcChoices{display:grid;grid-template-columns:1fr 1fr;gap:9px}.lcChoice{min-height:58px;border:1px solid var(--line);background:var(--paper);border-radius:10px;padding:9px;font-weight:680}.lcChoice.hanzi{font-family:"Songti SC","PingFang SC",serif;font-size:31px}.lcChoice.correct{background:#d8fae8;color:#145c46;border-color:#7ed8b8}.lcChoice.wrong{background:#fde8ec;color:#8b2744;border-color:#ef9eb4}.lcChoice.dim{opacity:.38}
  .lcAnswer{display:none;align-items:center;justify-content:center;gap:12px;margin-top:18px}.lcAnswer.on{display:flex}.lcAnswerH{font-family:"Songti SC","PingFang SC",serif;font-size:46px}.lcAnswerText{display:flex;flex-direction:column}.lcAnswerText b{font-size:16px}.lcAnswerText span{font-size:13px;color:var(--muted)}
  .lcNext,.lcValidate{margin-top:auto;width:100%;min-height:50px;border:0;border-radius:10px;background:var(--ink);color:var(--bg);font-weight:780;font-size:14px}.lcNext[disabled]{opacity:.25}
  .lcSummary{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:6px 0 18px}.lcItem{border:1px solid var(--line);border-radius:10px;padding:8px 9px;display:grid;grid-template-columns:42px 1fr;grid-template-rows:auto auto;column-gap:8px;min-height:63px;align-items:center}.lcHz{font-family:"Songti SC","PingFang SC",serif;font-size:36px;grid-row:1/3}.lcPy{font-size:13px;color:var(--green);font-weight:750;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.lcMeaning{font-size:11.5px;color:var(--muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
  .lcValidated{display:inline-flex;align-items:center;gap:7px;background:var(--greenSoft);color:var(--green);border-radius:99px;padding:7px 10px;font-size:12px;font-weight:800;margin:3px 0 15px;align-self:flex-start}
  `;document.head.appendChild(x);
}
function close(){document.getElementById('lessonCompletionOverlay')?.remove()}
function shell(lesson,label){
  close();ensureStyles();const o=document.createElement('div');o.className='lcOverlay';o.id='lessonCompletionOverlay';o.innerHTML=`<div class="lcTop"><button class="lcClose" aria-label="Close">⌄</button><b>${label||`Lesson ${lesson}`}</b><span style="width:40px"></span></div><div class="lcCard"></div>`;o.querySelector('.lcClose').onclick=close;document.body.appendChild(o);return o.querySelector('.lcCard')
}
function distractors(c,n=3){return shuffled(all().filter(x=>x.h!==c.h&&x.contextMeaning!==c.contextMeaning)).slice(0,n)}
function questionType(c,i){const s=S().skill?.(c.h)||{};if((s.sound||0)<(s.meaning||0))return'pinyin';return i%3===1?'hanzi':'meaning'}
function renderReview(lesson,list,index=0){
  if(index>=list.length){renderSummary(lesson,list.length);return}
  const c=list[index],type=questionType(c,index),card=shell(lesson,`Review ${index+1} of ${list.length}`),opts=shuffled([c,...distractors(c)]);let prompt,hero,render,fields,heroClass='';
  if(type==='pinyin'){prompt='Which pinyin matches this character?';hero=c.h;render=x=>x.p;fields=['recognition','sound']}
  else if(type==='hanzi'){prompt='Which character means this?';hero=c.contextMeaning;render=x=>x.h;fields=['recognition','meaning'];heroClass='word'}
  else{prompt='What does this character mean?';hero=c.h;render=x=>x.contextMeaning;fields=['recognition','meaning']}
  card.innerHTML=`<div class="lcEyebrow">Quick review</div><div class="lcTitle">One more look</div><div class="lcSub">Only characters missed in the two checkpoints are reviewed.</div><div class="lcQHero ${heroClass}">${hero||''}</div><div class="lcChoices">${opts.map(x=>`<button class="lcChoice ${type==='hanzi'?'hanzi':''}" data-h="${x.h}">${render(x)||''}</button>`).join('')}</div><div class="lcAnswer"><div class="lcAnswerH">${c.h}</div><div class="lcAnswerText"><b>${c.p||''}</b><span>${c.contextMeaning||''}</span></div></div><button class="lcNext" disabled>${index===list.length-1?'See lesson summary':'Next'}</button>`;
  const next=card.querySelector('.lcNext');
  card.querySelectorAll('.lcChoice').forEach(b=>b.onclick=()=>{if(card.dataset.answered)return;card.dataset.answered='1';const ok=b.dataset.h===c.h;card.querySelectorAll('.lcChoice').forEach(x=>{if(x.dataset.h===c.h)x.classList.add('correct');else if(x===b)x.classList.add('wrong');else x.classList.add('dim')});card.querySelector('.lcAnswer').classList.add('on');next.disabled=false;S().mark?.(c,fields,ok)});
  next.onclick=()=>renderReview(lesson,list,index+1);
}
function validateLesson(lesson){
  const state=st(),i=info(lesson);state.lessonPassed=state.lessonPassed||{};state.lessonPassed[lesson]=1;state.lessonReviewHistory=state.lessonReviewHistory||{};state.lessonReviewHistory[lesson]=misses(lesson).map(c=>c.h);state.lessonMissed=state.lessonMissed||{};state.lessonExtraMissed=state.lessonExtraMissed||{};state.lessonMissed[lesson]=[];state.lessonExtraMissed[lesson]=[];
  if(lesson<i.totalLessons)state.currentLesson=lesson+1;save();
  if(lesson<i.totalLessons)location.reload();else{close();window.dispatchEvent(new CustomEvent('hanzi:state'))}
}
function renderSummary(lesson,reviewed=0){
  const i=info(lesson),card=shell(lesson,'Lesson summary');card.innerHTML=`<div class="lcEyebrow">Lesson ${lesson} complete</div><div class="lcTitle">Your 12 characters</div><div class="lcSub">${reviewed?`${reviewed} missed character${reviewed===1?' was':'s were'} reviewed. `:''}Here is the full lesson before you move on.</div><div class="lcValidated">✓ Level validated</div><div class="lcSummary">${i.chars.map(c=>`<div class="lcItem"><div class="lcHz">${c.h}</div><div class="lcPy">${c.p||''}</div><div class="lcMeaning">${c.contextMeaning||''}</div></div>`).join('')}</div><button class="lcValidate">${lesson<i.totalLessons?`Start lesson ${lesson+1}`:'HSK 1 complete ✓'}</button>`;card.querySelector('.lcValidate').onclick=()=>validateLesson(lesson)
}
function openCompletion(lesson){const list=misses(lesson);if(list.length)renderReview(lesson,list,0);else renderSummary(lesson,0)}

/* Capture Connect-the-Three mismatches so they can participate in remediation too. */
document.addEventListener('click',e=>{if(!e.target.closest('.matchItem'))return;const lesson=Number(st().currentLesson||1);setTimeout(()=>{const wrong=[...document.querySelectorAll('.matchItem.wrong')].map(x=>x.dataset.h).filter(Boolean);if(!wrong.length)return;st().lessonExtraMissed=st().lessonExtraMissed||{};st().lessonExtraMissed[lesson]=[...new Set([...(st().lessonExtraMissed[lesson]||[]),...wrong])];save()},0)},true);

/* After the second six-character checkpoint, replace the old generic review with targeted remediation or the summary. */
document.addEventListener('click',e=>{const b=e.target.closest('.finishQuiz');if(!b)return;const lesson=Number(st().currentLesson||1),cp=checkpoint(lesson);if(cp!==1)return;setTimeout(()=>openCompletion(lesson),120)},true);

/* If the user closed the completion flow, the Review button reopens this exact targeted flow instead of the legacy six-card review. */
document.addEventListener('click',e=>{const b=e.target.closest('#continue');if(!b)return;const lesson=Number(st().currentLesson||1);if(checkpoint(lesson)<2)return;e.preventDefault();e.stopImmediatePropagation();openCompletion(lesson)},true);

window.HanziLessonCompletion={open:()=>openCompletion(Number(st().currentLesson||1)),summary:()=>renderSummary(Number(st().currentLesson||1),0)};
})();
