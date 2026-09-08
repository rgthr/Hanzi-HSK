/* HANZI CONSOLIDATED CONTROLLER
   Version: CONSOLIDATED 1.1.0 — AUDITED BASELINE
   Branch: clean-consolidation
   Architecture: core.html is data/state/shell only; this file is the sole owner of
   lesson paging, focus paging, quiz flow, writing practice and interaction state.
   Legacy interaction handlers are physically discarded by cloning their DOM hosts.
*/
(()=>{
'use strict';
const VERSION='CONSOLIDATED 1.1.0';
const LESSON_SIZE=12,PAGE_SIZE=6;
const q=s=>document.querySelector(s),qa=s=>[...document.querySelectorAll(s)];
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
const now=()=>performance.now();
const chars=()=>{try{return typeof ALL!=='undefined'&&Array.isArray(ALL)?ALL:[]}catch{return[]}};
const getChar=h=>{try{return typeof byH!=='undefined'&&byH?.[h]?byH[h]:chars().find(c=>c.h===h)}catch{return chars().find(c=>c.h===h)}};
function unique(list){const out=[],seen=new Set();for(const c of list||[])if(c?.h&&!seen.has(c.h)){seen.add(c.h);out.push(c)}return out}
function shuffled(list){const a=[...(list||[])];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
function getSkill(h){try{return state?.skills?.[h]||{}}catch{return{}}}
function saveState(){try{if(typeof save==='function')save()}catch{}}

/* ---------- build marker ---------- */
function markBuild(){
  const brand=q('.brand');
  if(brand&&!brand.querySelector('.consolidated-badge')){const b=document.createElement('span');b.className='consolidated-badge';b.textContent='Consolidated';brand.appendChild(b)}
  const card=q('#settingsSheet .sheetCard');
  if(card&&!card.querySelector('.consolidated-version')){const row=document.createElement('div');row.className='consolidated-version';row.innerHTML=`<b>Build</b><span>${VERSION}</span>`;card.insertBefore(row,q('#doneSettings'))}
  window.__hanziBuild=VERSION;
}

/* ---------- data/state ---------- */
function markExposure(c,fields=[],ok=true){
  if(!c)return;
  try{
    state.seen[c.h]=1;
    const s=typeof sk==='function'?sk(c.h):(state.skills[c.h]||(state.skills[c.h]={}));
    s.exposures=(s.exposures||0)+1;s.last=Date.now();
    if(ok){for(const f of fields)s[f]=Math.min(5,(s[f]||0)+1)}else{s.mistakes=(s.mistakes||0)+1}
    if(typeof mastery==='function')mastery(c);saveState();refreshProgressOnly();
  }catch{}
}
function lessonChars(){
  const all=chars();if(!all.length)return[];
  for(let i=0;i<all.length;i+=LESSON_SIZE){const block=all.slice(i,i+LESSON_SIZE);if(!block.every(c=>state?.mastered?.[c.h]))return block}
  return all.slice(Math.max(0,all.length-LESSON_SIZE));
}
function tileState(c){const s=getSkill(c.h);if(state?.mastered?.[c.h])return'MASTERED';if(state?.seen?.[c.h])return(s.mistakes||0)>1?'REVIEW':'LEARNING';return'NEW'}

/* ---------- content ---------- */
const genericExamples=c=>[
 [`我在学“${c.h}”这个字。`,`wǒ zài xué “${c.p}” zhège zì.`,`I’m learning the character ${c.h}.`],
 [`你认识“${c.h}”这个字吗？`,`nǐ rènshi “${c.p}” zhège zì ma?`,`Do you recognize the character ${c.h}?`],
 [`老师写了“${c.h}”这个字。`,`lǎoshī xiě le “${c.p}” zhège zì.`,`The teacher wrote the character ${c.h}.`]
];
function threeExamples(c){
  const candidates=[];
  try{if(typeof examples==='function')candidates.push(...(examples(c)||[]))}catch{}
  try{if(typeof example==='function'){const ex=example(c);if(ex?.[0])candidates.push(ex)}}catch{}
  if(c.context&&c.context!==c.h&&c.context.includes(c.h))candidates.push([c.context,c.contextPinyin||'',c.contextMeaning||'']);
  candidates.push(...genericExamples(c));
  const out=[],seen=new Set();for(const ex of candidates){if(!ex?.[0]||seen.has(ex[0]))continue;seen.add(ex[0]);out.push(ex);if(out.length===3)break}return out;
}
function related(c){
  const raw=c.relatedShapes||c.related||c.family||c.similar||[],out=[];
  for(const r of Array.isArray(raw)?raw:[]){const x=typeof r==='string'?getChar(r):r;if(x?.h&&x.h!==c.h&&!out.some(y=>y.h===x.h))out.push(x)}
  return out.slice(0,5);
}

/* ---------- legacy-listener isolation ---------- */
function replaceHost(selector,deep=true){const old=q(selector);if(!old)return null;const fresh=old.cloneNode(deep);old.replaceWith(fresh);return fresh}
function isolateLegacyInteractions(){
  /* core.html attaches touch listeners with addEventListener. Assigning ontouch*=null
     cannot remove them. Replacing these two hosts guarantees those listeners are gone. */
  replaceHost('#board',false);
  replaceHost('#focus',true);
}

/* ---------- lesson board ---------- */
let lessonPage=0,boardGesture=null,boardSuppressUntil=0;
function lessonPages(){const a=lessonChars();return[a.slice(0,PAGE_SIZE),a.slice(PAGE_SIZE,LESSON_SIZE)].filter(x=>x.length)}
function makeTile(c,set,index){
  const b=document.createElement('button');b.className='tile';b.dataset.h=c.h;
  const tag=tileState(c);b.classList.toggle('review',tag==='REVIEW');
  b.innerHTML=`<span class="tag">${tag}</span><span class="hz">${c.h}</span>${state?.seen?.[c.h]?'<i class="dot"></i>':''}`;
  b.onclick=e=>{e.preventDefault();e.stopPropagation();if(now()<boardSuppressUntil)return;openFocusConsolidated(set,index)};
  return b;
}
function renderLessonBoard(page=lessonPage){
  const board=q('#board'),pages=lessonPages();if(!board||!pages.length)return;
  lessonPage=clamp(page,0,pages.length-1);board.className='board consolidated-board';board.dataset.lessonPage=String(lessonPage);
  board.replaceChildren(...pages[lessonPage].map((c,i)=>makeTile(c,pages[lessonPage],i)));
  let dots=board.parentElement.querySelector('.lessonDeckDots');if(!dots){dots=document.createElement('div');dots.className='lessonDeckDots';board.insertAdjacentElement('afterend',dots)}
  dots.innerHTML=pages.map((_,i)=>`<i class="${i===lessonPage?'on':''}"></i>`).join('');
}
function installBoardGestures(){
  const board=q('#board');if(!board)return;
  board.addEventListener('click',e=>{if(now()<boardSuppressUntil){e.preventDefault();e.stopImmediatePropagation()}},true);
  board.onpointerdown=e=>{if(e.button!=null&&e.button!==0)return;boardGesture={id:e.pointerId,x:e.clientX,y:e.clientY,axis:null,drag:false}};
  board.onpointermove=e=>{const g=boardGesture;if(!g||g.id!==e.pointerId)return;const dx=e.clientX-g.x,dy=e.clientY-g.y,ax=Math.abs(dx),ay=Math.abs(dy);if(!g.axis){if(ax<8&&ay<8)return;if(ax>ay*1.18){g.axis='x';try{board.setPointerCapture(e.pointerId)}catch{}}else{g.axis='y';return}}if(g.axis!=='x')return;g.drag=true;e.preventDefault()};
  board.onpointerup=e=>{const g=boardGesture;boardGesture=null;if(!g||g.id!==e.pointerId||!g.drag)return;const dx=e.clientX-g.x,pages=lessonPages();boardSuppressUntil=now()+380;if(dx<-48&&lessonPage<pages.length-1)renderLessonBoard(lessonPage+1);else if(dx>48&&lessonPage>0)renderLessonBoard(lessonPage-1);e.preventDefault()};
  board.onpointercancel=()=>{boardGesture=null};
}
function refreshLessonLabels(){
  const board=q('#board.consolidated-board');if(!board)return;
  board.querySelectorAll('.tile[data-h]').forEach(b=>{const c=getChar(b.dataset.h);if(!c)return;const tag=tileState(c);b.querySelector('.tag').textContent=tag;b.classList.toggle('review',tag==='REVIEW');let d=b.querySelector('.dot');if(state?.seen?.[c.h]&&!d){d=document.createElement('i');d.className='dot';b.appendChild(d)}else if(!state?.seen?.[c.h]&&d)d.remove()});
}
function continueLearning(){
  const lesson=lessonChars(),unseen=lesson.filter(c=>!state?.seen?.[c.h]),learning=lesson.filter(c=>state?.seen?.[c.h]&&!state?.mastered?.[c.h]),mastered=lesson.filter(c=>state?.mastered?.[c.h]),pick=[];
  for(const c of unseen.slice(0,3))if(!pick.some(x=>x.h===c.h))pick.push(c);
  for(const c of [...learning,...unseen.slice(3),...mastered])if(pick.length<PAGE_SIZE&&!pick.some(x=>x.h===c.h))pick.push(c);
  if(pick.length)openFocusConsolidated(pick,0);
}

/* ---------- focus cards ---------- */
let focusSet=[],focusSlides=[],focusActive=0,focusLearnCount=0,focusGesture=null,focusSuppressUntil=0,focusTimer=null;
function learnSlide(c){
  const slide=document.createElement('div');slide.className='fp';slide.dataset.h=c.h;const ex=threeExamples(c),rel=related(c),memory=(c.keyContext||c.memory||c.context||'').trim();
  slide.innerHTML=`<div class="card"><div class="cHead"></div><div class="heroChar"><div class="big">${c.h}</div><div class="mainRecall hidden"><div class="py">${c.p||''}</div><div class="meaning">${c.contextMeaning||''}</div></div><button class="audio" data-audio>◖</button></div><div class="learnBody"><div class="section"><div class="lab">KEY CONTEXT</div><div class="memory">${memory||`Recognize ${c.h} as ${c.contextMeaning||'this character'}.`}</div></div><div class="section"><div class="lab">IN A SENTENCE</div><div class="sentenceExample hidden" data-sentence="0"><div class="exCn">${ex[0]?.[0]||''}</div><div class="exPy">${ex[0]?.[1]||''}</div><div class="exEn">${ex[0]?.[2]||''}</div></div><div class="sentenceTools"><button data-next-sentence>${ex.length>1?'1 / 3 · next':'1 / 1'}</button></div></div><div class="section"><div class="lab">RELATED SHAPES</div>${rel.length?`<div class="relatedList">${rel.map(r=>`<button data-related="${r.h}"><span class="rh">${r.h}</span><span class="rp">${r.p||''}</span><span class="rm">${r.contextMeaning||''}</span></button>`).join('')}</div>`:'<div class="none">No related shapes in the current dataset.</div>'}</div><button class="stroke" data-practice>✍️ Practice stroke order</button></div></div>`;
  const recall=slide.querySelector('.mainRecall');recall.onclick=e=>{e.preventDefault();e.stopPropagation();recall.classList.toggle('hidden')};
  const sentence=slide.querySelector('.sentenceExample');sentence.onclick=e=>{e.preventDefault();e.stopPropagation();sentence.classList.toggle('hidden')};
  const next=slide.querySelector('[data-next-sentence]');next.onclick=e=>{e.preventDefault();e.stopPropagation();let i=(Number(sentence.dataset.sentence)||0)+1;i%=Math.max(1,ex.length);sentence.dataset.sentence=i;sentence.querySelector('.exCn').textContent=ex[i]?.[0]||'';sentence.querySelector('.exPy').textContent=ex[i]?.[1]||'';sentence.querySelector('.exEn').textContent=ex[i]?.[2]||'';sentence.classList.add('hidden');next.textContent=`${i+1} / ${ex.length} · next`};
  slide.querySelector('[data-audio]').onclick=e=>{e.preventDefault();e.stopPropagation();try{if(typeof speak==='function')speak(c)}catch{}};
  slide.querySelector('[data-practice]').onclick=e=>{e.preventDefault();e.stopPropagation();openPractice(c)};
  slide.querySelectorAll('[data-related]').forEach(b=>b.onclick=e=>{e.preventDefault();e.stopPropagation();const r=getChar(b.dataset.related);if(r)openFocusConsolidated([r],0)});
  return slide;
}
function distractors(c,n=3){return shuffled(chars().filter(x=>x.h!==c.h&&x.contextMeaning!==c.contextMeaning)).slice(0,n)}
function recallQuiz(c,type,n){
  const slide=document.createElement('div');slide.className='fp quizSlide';const opts=shuffled([c,...distractors(c)]);let prompt,hero,render,fields;
  if(type==='meaning'){prompt='What does this character mean?';hero=c.h;render=x=>x.contextMeaning;fields=['recognition','meaning']}
  else if(type==='pinyin'){prompt='Which pinyin matches this character?';hero=c.h;render=x=>x.p;fields=['recognition','sound']}
  else{prompt='Which character means this?';hero=c.contextMeaning;render=x=>x.h;fields=['recognition','meaning']}
  slide.innerHTML=`<div class="card"><div class="quizTop">TEST · ${n}/6</div><div class="quizBody"><div class="quizPrompt">${prompt}</div><div class="quizHero ${type==='hanzi'?'word':'char'}">${hero||''}</div><div class="quizChoices">${opts.map(x=>`<button class="quizChoice ${type==='hanzi'?'charChoice':''}" data-h="${x.h}">${render(x)||''}</button>`).join('')}</div><div class="quizFeedback"><div class="feedbackChar">${c.h}</div><div class="feedbackText"><b>${c.p||''}</b><span>${c.contextMeaning||''}</span></div></div><div class="quizHint">Choose an answer</div></div></div>`;
  slide.querySelectorAll('.quizChoice').forEach(b=>b.onclick=e=>{e.preventDefault();e.stopPropagation();if(slide.dataset.answered)return;slide.dataset.answered='1';const ok=b.dataset.h===c.h;slide.querySelectorAll('.quizChoice').forEach(x=>{if(x.dataset.h===c.h)x.classList.add('correct');else if(x===b)x.classList.add('wrong');else x.classList.add('dim')});slide.querySelector('.quizFeedback')?.classList.add('on');slide.querySelector('.quizHint').textContent='Swipe to continue';markExposure(c,fields,ok)});
  return slide;
}
function connectSet(set){
  const current=unique(set),ids=new Set(current.map(c=>c.h));
  const recent=chars().filter(c=>state?.seen?.[c.h]&&!ids.has(c.h)).sort((a,b)=>(getSkill(b.h).last||0)-(getSkill(a.h).last||0));
  const out=[];for(const c of [...shuffled(recent.slice(0,18)).slice(0,3),...shuffled(current),...recent,...chars()])if(out.length<6&&!out.some(x=>x.h===c.h))out.push(c);
  return out.slice(0,6);
}
function connectQuiz(set){
  const chosen=connectSet(set),slide=document.createElement('div');slide.className='fp quizSlide connectSlide';const hz=shuffled(chosen),py=shuffled(chosen),en=shuffled(chosen);
  slide.innerHTML=`<div class="card"><div class="quizTop">TEST · 5/6</div><div class="quizBody"><div class="connectTitle">Connect the three</div><div class="connectSub">Match each Hanzi, pinyin and meaning.</div><div class="connectGrid"><div class="connectCol"><div class="connectLabel">Hanzi</div>${hz.map(c=>`<button class="matchItem hanzi" data-k="h" data-h="${c.h}">${c.h}</button>`).join('')}</div><div class="connectCol"><div class="connectLabel">Pinyin</div>${py.map(c=>`<button class="matchItem pinyin" data-k="p" data-h="${c.h}">${c.p||''}</button>`).join('')}</div><div class="connectCol"><div class="connectLabel">Meaning</div>${en.map(c=>`<button class="matchItem" data-k="m" data-h="${c.h}">${c.contextMeaning||''}</button>`).join('')}</div></div><div class="connectStatus">Tap one item in each column</div></div></div>`;
  let sel={};slide.onclick=e=>{const b=e.target.closest('.matchItem');if(!b||b.classList.contains('matched'))return;e.preventDefault();e.stopPropagation();slide.querySelectorAll(`.matchItem[data-k="${b.dataset.k}"]`).forEach(x=>x.classList.remove('selected'));b.classList.add('selected');sel[b.dataset.k]=b;if(!(sel.h&&sel.p&&sel.m))return;const trio=[sel.h,sel.p,sel.m],ok=trio.every(x=>x.dataset.h===trio[0].dataset.h),status=slide.querySelector('.connectStatus');if(ok){trio.forEach(x=>{x.classList.remove('selected');x.classList.add('matched')});markExposure(getChar(trio[0].dataset.h),['recognition','sound','meaning'],true);sel={};status.textContent=slide.querySelector('.matchItem:not(.matched)')?'Correct — keep going':'All 6 connected ✓ · swipe to continue'}else{trio.forEach(x=>x.classList.remove('selected'));sel={};status.textContent='Not quite — try again'}};
  return slide;
}

/* ---------- one shared writing engine ---------- */
let practiceCharacter=null,practiceWriter=null;
function createWriter(target,status,c,{drawingWidth=28}={}){
  if(!target||!status||!c)return null;if(typeof HanziWriter==='undefined'){status.textContent='Stroke data unavailable.';return null}
  target.innerHTML='';const box=target.parentElement,z=Math.max(240,Math.floor(box.clientWidth||300));
  const writer=HanziWriter.create(target,c.h,{width:z,height:z,padding:24,showOutline:true,showCharacter:false,drawingWidth,drawingFadeDuration:800,strokeAnimationSpeed:5,strokeHighlightSpeed:5,delayBetweenStrokes:0});
  status.textContent='Start with the first stroke.';
  /* Hanzi Writer already advances its internal expected-stroke index after a correct
     stroke. Do not call animateStroke here: that extra animation can intercept the
     next gesture and was the source of the apparent “tap to move forward” state. */
  writer.quiz({showHintAfterMisses:1,highlightOnComplete:true,onCorrectStroke:d=>{status.textContent=d.strokesRemaining?`${d.strokesRemaining} stroke${d.strokesRemaining===1?'':'s'} left`:'Finishing…'},onComplete:()=>{status.textContent='Character complete ✓';try{if(typeof bump==='function')bump(c,'writing',true);else markExposure(c,['writing'],true)}catch{}}});
  return writer;
}
function protectWriterSurface(surface){for(const type of ['pointerdown','pointermove','pointerup','pointercancel','touchstart','touchmove','touchend','touchcancel'])surface.addEventListener(type,e=>e.stopPropagation(),{passive:true})}
function writingQuiz(c){
  const slide=document.createElement('div');slide.className='fp quizSlide writeSlide';slide.innerHTML=`<div class="card"><div class="quizTop">TEST · 6/6</div><div class="quizBody"><div class="writePrompt">Write <b>${c.h}</b> in stroke order · ${c.p||''} · ${c.contextMeaning||''}</div><div class="writeSurface"><div class="writeTarget"></div></div><div class="writeStatus">Preparing stroke practice…</div><button class="finishQuiz">Finish quiz</button></div></div>`;
  const surface=slide.querySelector('.writeSurface');protectWriterSurface(surface);slide._startWriter=()=>createWriter(slide.querySelector('.writeTarget'),slide.querySelector('.writeStatus'),c,{drawingWidth:28});
  slide.querySelector('.finishQuiz').onclick=e=>{e.preventDefault();e.stopPropagation();closeFocusConsolidated();renderLessonBoard(lessonPage)};return slide;
}
function openPractice(c){
  const pane=q('#strokePane'),target=q('#target'),status=q('#strokeStatus');if(!pane||!target||!status)return;practiceCharacter=c;pane.classList.add('on');q('#strokeHz').textContent=c.h;q('#strokePy').textContent=`${c.p||''} · ${c.contextMeaning||''}`;practiceWriter=createWriter(target,status,c,{drawingWidth:28});
}
function retryPractice(){if(practiceCharacter)practiceWriter=createWriter(q('#target'),q('#strokeStatus'),practiceCharacter,{drawingWidth:28})}
function watchPractice(){
  if(!practiceCharacter||typeof HanziWriter==='undefined')return;const target=q('#target'),box=target?.parentElement,status=q('#strokeStatus');if(!target||!box||!status)return;target.innerHTML='';const z=Math.max(240,Math.floor(box.clientWidth||300));practiceWriter=HanziWriter.create(target,practiceCharacter.h,{width:z,height:z,padding:24,showOutline:true,showCharacter:true});status.textContent='Watching…';practiceWriter.animateCharacter({onComplete:()=>status.textContent='Tap Start over to practice.'});
}

function buildQuizSlides(set){const base=unique(set),picks=shuffled(base),seq=[];for(let i=0;i<4;i++){const c=picks[i%picks.length]||base[0];seq.push(recallQuiz(c,['meaning','pinyin','hanzi'][i%3],i+1))}seq.push(connectQuiz(base));seq.push(writingQuiz(base[base.length-1]||base[0]));return seq}
function openFocusConsolidated(set,start=0){
  const clean=unique(set).slice(0,PAGE_SIZE);if(!clean.length)return;focusSet=clean;focusLearnCount=clean.length;focusActive=clamp(start,0,clean.length-1);
  const focus=q('#focus'),pager=q('#pager'),count=q('#count');if(!focus||!pager)return;focus.classList.add('on');pager.className='pager consolidated-pager';pager.innerHTML='';
  focusSlides=[...clean.map(learnSlide),...buildQuizSlides(clean)];const track=document.createElement('div');track.className='consolidated-track';focusSlides.forEach(s=>track.appendChild(s));pager.appendChild(track);pager._track=track;
  installFocusGestures(pager);if(count)count.textContent=`${focusActive+1} of ${focusLearnCount}`;positionFocus(0,false);announceFocus();
}
function positionFocus(px=0,animate=false){const pager=q('#pager'),track=pager?._track;if(!pager||!track)return;pager.classList.toggle('settling',animate);track.style.transform=`translate3d(calc(${-focusActive*100}% + ${px}px),0,0)`}
function announceFocus(){
  const count=q('#count');if(focusActive<focusLearnCount){if(count)count.textContent=`${focusActive+1} of ${focusLearnCount}`;window.focusLastIndex=focusActive;try{state.seen[focusSet[focusActive].h]=1;saveState();refreshLessonLabels()}catch{}}
  else{const qi=focusActive-focusLearnCount+1;if(count)count.textContent=`Test ${Math.min(qi,6)} of 6`;if(qi===6){const slide=focusSlides[focusActive];if(slide&&!slide.dataset.writerStarted){slide.dataset.writerStarted='1';requestAnimationFrame(()=>requestAnimationFrame(()=>slide._startWriter?.()))}}}
}
function settleFocus(to,v=0){const pager=q('#pager');focusActive=clamp(to,0,focusSlides.length-1);const ms=clamp(275-Math.abs(v)*65,220,315);pager?.style.setProperty('--settle',ms+'ms');positionFocus(0,true);clearTimeout(focusTimer);focusTimer=setTimeout(()=>pager?.classList.remove('settling'),ms+20);announceFocus()}
function installFocusGestures(pager){
  if(pager._suppressCapture)pager.removeEventListener('click',pager._suppressCapture,true);
  pager._suppressCapture=e=>{if(now()<focusSuppressUntil){e.preventDefault();e.stopImmediatePropagation()}};pager.addEventListener('click',pager._suppressCapture,true);
  pager.onpointerdown=e=>{if(e.button!=null&&e.button!==0)return;if(e.target.closest('input,.writeSurface,.writeTarget')){focusGesture={blocked:true,id:e.pointerId};return}focusGesture={id:e.pointerId,x:e.clientX,y:e.clientY,lastX:e.clientX,lastT:now(),vx:0,axis:null,drag:false}};
  pager.onpointermove=e=>{const g=focusGesture;if(!g||g.blocked||g.id!==e.pointerId)return;const dx=e.clientX-g.x,dy=e.clientY-g.y,ax=Math.abs(dx),ay=Math.abs(dy);if(!g.axis){if(ax<7&&ay<7)return;if(ax>ay*1.12){g.axis='x';try{pager.setPointerCapture(e.pointerId)}catch{}}else if(ay>ax*1.16){g.axis='y';g.blocked=true;return}else return}if(g.axis!=='x')return;g.drag=true;const t=now(),dt=Math.max(1,t-g.lastT),iv=(e.clientX-g.lastX)/dt;g.vx=.72*g.vx+.28*iv;g.lastX=e.clientX;g.lastT=t;let move=dx;if((focusActive===0&&dx>0)||(focusActive===focusSlides.length-1&&dx<0))move=Math.sign(dx)*Math.min(20,Math.abs(dx)*.1);positionFocus(move,false);e.preventDefault()};
  pager.onpointerup=e=>{const g=focusGesture;focusGesture=null;if(!g||g.id!==e.pointerId||g.blocked||!g.drag)return;focusSuppressUntil=now()+420;const dx=e.clientX-g.x,w=pager.clientWidth||innerWidth,proj=dx+g.vx*120;let to=focusActive;if(proj<-w*.16&&focusActive<focusSlides.length-1)to++;else if(proj>w*.16&&focusActive>0)to--;e.preventDefault();settleFocus(to,g.vx)};
  pager.onpointercancel=()=>{focusGesture=null;settleFocus(focusActive)};
}
function closeFocusConsolidated(){q('#focus')?.classList.remove('on');focusGesture=null;clearTimeout(focusTimer)}

/* ---------- Explore/progress ---------- */
function recolorExplore(){qa('#wall .wt').forEach(el=>{const h=el.dataset.w||el.dataset.h||el.textContent.trim(),s=getSkill(h);el.classList.remove('ex-unseen','ex-learning','ex-mastered','ex-struggle');if(state?.mastered?.[h])el.classList.add('ex-mastered');else if((s.mistakes||0)>=2)el.classList.add('ex-struggle');else if(state?.seen?.[h])el.classList.add('ex-learning');else el.classList.add('ex-unseen')})}
let coreProgress=null;
function refreshProgressOnly(){refreshLessonLabels();recolorExplore();try{coreProgress?.()}catch{}}

/* ---------- install only after core data + init have completed ---------- */
function install(){
  if(!chars().length){setTimeout(install,40);return}
  /* Core init has now populated byH, rendered the board and attached its legacy
     listeners. Replace only the two interaction hosts, then take ownership once. */
  coreProgress=typeof progress==='function'?progress:null;
  isolateLegacyInteractions();markBuild();
  try{window.progress=()=>{try{coreProgress?.()}catch{}refreshLessonLabels();recolorExplore()}}catch{}
  try{window.openFocus=openFocusConsolidated}catch{}
  const cont=q('#continue');if(cont){cont.textContent='Continue learning';cont.onclick=e=>{e.preventDefault();continueLearning()}}q('#mix')?.remove();
  const close=q('#close');if(close)close.onclick=e=>{e.preventDefault();closeFocusConsolidated()};
  const menu=q('#fMenu');if(menu)menu.onclick=e=>{e.preventDefault();q('#settingsSheet')?.classList.add('on')};
  const closeStroke=q('#closeStroke');if(closeStroke)closeStroke.onclick=e=>{e.preventDefault();q('#strokePane')?.classList.remove('on');const t=q('#target');if(t)t.innerHTML=''};
  const retry=q('#retry');if(retry)retry.onclick=e=>{e.preventDefault();retryPractice()};
  const watch=q('#watch');if(watch)watch.onclick=e=>{e.preventDefault();watchPractice()};
  renderLessonBoard(0);installBoardGestures();recolorExplore();
  const wall=q('#wall');if(wall)new MutationObserver(recolorExplore).observe(wall,{childList:true,subtree:true});
}
setTimeout(install,0);
})();
