/* HANZI CONSOLIDATED CONTROLLER
   Version: CONSOLIDATED 1.0.0
   Branch: clean-consolidation
   Design rule: one controller owns lesson paging, focus paging, quiz flow and writing.
   No interaction-v*, app-v*, lesson-ux-v* or quiz-practice-v* dependency.
*/
(()=>{
'use strict';
const VERSION='CONSOLIDATED 1.0.0';
const LESSON_SIZE=12, PAGE_SIZE=6;
const q=s=>document.querySelector(s), qa=s=>[...document.querySelectorAll(s)];
const uniq=a=>{const out=[];for(const x of a||[])if(x&&!out.some(y=>y.h===x.h))out.push(x);return out};
const shuffle=a=>[...(a||[])].sort(()=>Math.random()-.5);
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
const now=()=>performance.now();

// ---------- build marker ----------
function markBuild(){
  const brand=q('.brand');if(brand&&!brand.querySelector('.consolidated-badge')){const s=document.createElement('span');s.className='consolidated-badge';s.textContent='Consolidated';brand.appendChild(s)}
  const vr=q('#settingsSheet .versionRow b');if(vr)vr.textContent=VERSION;
  window.__hanziBuild=VERSION;
}

// ---------- state helpers ----------
function skill(h){try{return window.state?.skills?.[h]||{}}catch{return{}}}
function markExposure(c,fields=[],ok=true){
  if(!c)return;
  try{
    state.seen[c.h]=1;const s=typeof sk==='function'?sk(c.h):(state.skills[c.h]||(state.skills[c.h]={}));
    s.exposures=(s.exposures||0)+1;s.last=Date.now();
    if(ok)for(const f of fields)s[f]=Math.min(5,(s[f]||0)+1);else s.mistakes=(s.mistakes||0)+1;
    if(typeof mastery==='function')mastery(c);if(typeof save==='function')save();refreshProgressOnly();
  }catch{}
}
function lessonChars(){
  const all=window.ALL||[];if(!all.length)return[];
  let start=0;
  for(let i=0;i<all.length;i+=LESSON_SIZE){const block=all.slice(i,i+LESSON_SIZE);start=i;if(!block.length||!block.every(c=>state?.mastered?.[c.h]))break}
  return all.slice(start,start+LESSON_SIZE);
}
function tileState(c){const s=skill(c.h);if(state?.mastered?.[c.h])return'MASTERED';if(state?.seen?.[c.h])return(s.mistakes||0)>1?'REVIEW':'LEARNING';return'NEW'}

// ---------- sentences ----------
const curatedFallback=c=>[
 [`我在学“${c.h}”这个字。`,`wǒ zài xué “${c.p}” zhège zì.`,`I’m learning the character ${c.h}.`],
 [`你认识“${c.h}”这个字吗？`,`nǐ rènshi “${c.p}” zhège zì ma?`,`Do you recognize the character ${c.h}?`],
 [`老师写了“${c.h}”这个字。`,`lǎoshī xiě le “${c.p}” zhège zì.`,`The teacher wrote the character ${c.h}.`]
];
function threeExamples(c){
  let base=[];try{base=typeof window.examples==='function'?(window.examples(c)||[]):[]}catch{}
  const out=[],seen=new Set();
  for(const ex of [...base,...curatedFallback(c)]){if(!ex?.[0]||seen.has(ex[0]))continue;seen.add(ex[0]);out.push(ex);if(out.length===3)break}
  return out;
}
function related(c){
  const raw=c.relatedShapes||c.related||c.family||c.similar||[];const arr=[];
  for(const r of Array.isArray(raw)?raw:[]){const x=typeof r==='string'?(window.byH?.[r]):r;if(x&&x.h&&x.h!==c.h&&!arr.some(y=>y.h===x.h))arr.push(x)}
  if(arr.length)return arr.slice(0,5);
  // safe fallback: neighboring HSK characters, not presented as linguistic relation if data has none
  const all=window.ALL||[],i=all.findIndex(x=>x.h===c.h);return all.slice(Math.max(0,i-2),i).concat(all.slice(i+1,i+4)).slice(0,5);
}

// ---------- lesson board ----------
let lessonPage=0, boardGesture=null, boardSuppress=0;
function currentLessonPages(){const chars=lessonChars();return[chars.slice(0,6),chars.slice(6,12)].filter(x=>x.length)}
function renderLessonBoard(page=lessonPage){
  const board=q('#board');if(!board)return;const pages=currentLessonPages();if(!pages.length)return;
  lessonPage=clamp(page,0,pages.length-1);board.className='board consolidated-board';board.dataset.lessonPage=String(lessonPage);board.replaceChildren(...pages[lessonPage].map((c,i)=>makeTile(c,pages[lessonPage],i)));
  let dots=board.parentElement.querySelector('.lessonDeckDots');if(!dots){dots=document.createElement('div');dots.className='lessonDeckDots';board.insertAdjacentElement('afterend',dots)}dots.innerHTML=pages.map((_,i)=>`<i class="${i===lessonPage?'on':''}"></i>`).join('');
  board.onpointerdown=boardPointerDown;board.onpointermove=boardPointerMove;board.onpointerup=boardPointerUp;board.onpointercancel=()=>{boardGesture=null};
  board.onclick=e=>{if(now()<boardSuppress){e.preventDefault();e.stopImmediatePropagation()}};
}
function makeTile(c,set,idx){const b=document.createElement('button');b.className='tile';b.dataset.h=c.h;const tag=tileState(c);if(tag==='REVIEW')b.classList.add('review');b.innerHTML=`<span class="tag">${tag}</span><span class="hz">${c.h}</span>${state?.seen?.[c.h]?'<i class="dot"></i>':''}`;b.onclick=e=>{if(now()<boardSuppress)return;e.preventDefault();e.stopPropagation();openFocusConsolidated(set,idx)};return b}
function boardPointerDown(e){if(e.button!=null&&e.button!==0)return;boardGesture={id:e.pointerId,x:e.clientX,y:e.clientY,axis:null,drag:false}}
function boardPointerMove(e){const g=boardGesture;if(!g||g.id!==e.pointerId)return;const dx=e.clientX-g.x,dy=e.clientY-g.y,ax=Math.abs(dx),ay=Math.abs(dy);if(!g.axis){if(ax<8&&ay<8)return;if(ax>ay*1.18)g.axis='x';else{g.axis='y';return}}if(g.axis!=='x')return;g.drag=true;e.preventDefault()}
function boardPointerUp(e){const g=boardGesture;boardGesture=null;if(!g||g.id!==e.pointerId||!g.drag)return;const pages=currentLessonPages(),dx=e.clientX-g.x;boardSuppress=now()+320;if(dx<-48&&lessonPage<pages.length-1)renderLessonBoard(lessonPage+1);else if(dx>48&&lessonPage>0)renderLessonBoard(lessonPage-1);e.preventDefault()}
function refreshLessonLabels(){const board=q('#board.consolidated-board');if(!board)return;board.querySelectorAll('.tile[data-h]').forEach(b=>{const c=window.byH?.[b.dataset.h]||(window.ALL||[]).find(x=>x.h===b.dataset.h);if(!c)return;const tag=tileState(c),t=b.querySelector('.tag');if(t)t.textContent=tag;b.classList.toggle('review',tag==='REVIEW');let d=b.querySelector('.dot');if(state?.seen?.[c.h]&&!d){d=document.createElement('i');d.className='dot';b.appendChild(d)}else if(!state?.seen?.[c.h]&&d)d.remove()})}
function continueLearning(){const lesson=lessonChars(),unseen=lesson.filter(c=>!state?.seen?.[c.h]),learning=lesson.filter(c=>state?.seen?.[c.h]&&!state?.mastered?.[c.h]),mastered=lesson.filter(c=>state?.mastered?.[c.h]),pick=[];for(const c of unseen.slice(0,3))if(!pick.some(x=>x.h===c.h))pick.push(c);for(const c of [...learning,...unseen.slice(3),...mastered])if(pick.length<6&&!pick.some(x=>x.h===c.h))pick.push(c);if(pick.length)openFocusConsolidated(pick,0)}

// ---------- focus cards + quiz ----------
let focusSet=[],focusSlides=[],focusActive=0,focusLearnCount=0,focusGesture=null,focusSuppress=0,focusTimer=null;
function learnSlide(c,index){
  const slide=document.createElement('div');slide.className='fp';slide.dataset.h=c.h;const ex=threeExamples(c),rel=related(c),memory=(c.keyContext||c.memory||c.context||'').trim();
  slide.innerHTML=`<div class="card"><div class="cHead"></div><div class="heroChar"><div class="big">${c.h}</div><div class="mainRecall hidden"><div class="py">${c.p||''}</div><div class="meaning">${c.contextMeaning||''}</div></div><button class="audio" data-audio>◖</button></div><div class="learnBody"><div class="section"><div class="lab">KEY CONTEXT</div><div class="memory">${memory||`Recognize ${c.h} as ${c.contextMeaning||'this character'}.`}</div></div><div class="section"><div class="lab">IN A SENTENCE</div><div class="sentenceExample hidden" data-sentence="0"><div class="exCn">${ex[0]?.[0]||''}</div><div class="exPy">${ex[0]?.[1]||''}</div><div class="exEn">${ex[0]?.[2]||''}</div></div><div class="sentenceTools"><button data-next-sentence>${ex.length>1?'1 / 3 · next':'1 / 1'}</button></div></div><div class="section"><div class="lab">RELATED SHAPES</div><div class="relatedList">${rel.map(r=>`<button data-related="${r.h}"><span class="rh">${r.h}</span><span class="rp">${r.p||''}</span><span class="rm">${r.contextMeaning||''}</span></button>`).join('')}</div></div><button class="stroke" data-practice>✍️ Practice stroke order</button></div></div>`;
  const recall=slide.querySelector('.mainRecall');recall.onclick=e=>{e.preventDefault();e.stopPropagation();recall.classList.toggle('hidden')};
  const sentence=slide.querySelector('.sentenceExample');sentence.onclick=e=>{e.preventDefault();e.stopPropagation();sentence.classList.toggle('hidden')};
  const next=slide.querySelector('[data-next-sentence]');if(next)next.onclick=e=>{e.preventDefault();e.stopPropagation();let i=(Number(sentence.dataset.sentence)||0)+1;i%=ex.length||1;sentence.dataset.sentence=i;sentence.querySelector('.exCn').textContent=ex[i]?.[0]||'';sentence.querySelector('.exPy').textContent=ex[i]?.[1]||'';sentence.querySelector('.exEn').textContent=ex[i]?.[2]||'';sentence.classList.add('hidden');next.textContent=`${i+1} / ${ex.length} · next`};
  slide.querySelector('[data-audio]').onclick=e=>{e.preventDefault();e.stopPropagation();try{window.speak?.(c)}catch{}};
  slide.querySelector('[data-practice]').onclick=e=>{e.preventDefault();e.stopPropagation();openPractice(c)};
  slide.querySelectorAll('[data-related]').forEach(b=>b.onclick=e=>{e.preventDefault();e.stopPropagation();const r=window.byH?.[b.dataset.related];if(r)openFocusConsolidated([r],0)});
  return slide;
}
function distractors(c,n=3){return shuffle((window.ALL||[]).filter(x=>x.h!==c.h&&x.contextMeaning!==c.contextMeaning)).slice(0,n)}
function recallQuiz(c,type,n){const slide=document.createElement('div');slide.className='fp quizSlide';const opts=shuffle([c,...distractors(c)]);let prompt,hero,render,fields;if(type==='meaning'){prompt='What does this character mean?';hero=c.h;render=x=>x.contextMeaning;fields=['recognition','meaning']}else if(type==='pinyin'){prompt='Which pinyin matches this character?';hero=c.h;render=x=>x.p;fields=['recognition','sound']}else{prompt='Which character means this?';hero=c.contextMeaning;render=x=>x.h;fields=['recognition','meaning']}
  slide.innerHTML=`<div class="card"><div class="quizTop">TEST · ${n}/6</div><div class="quizBody"><div class="quizPrompt">${prompt}</div><div class="quizHero ${type==='hanzi'?'word':'char'}">${hero||''}</div><div class="quizChoices">${opts.map(x=>`<button class="quizChoice ${type==='hanzi'?'charChoice':''}" data-h="${x.h}">${render(x)||''}</button>`).join('')}</div><div class="quizFeedback"><div class="feedbackChar">${c.h}</div><div class="feedbackText"><b>${c.p||''}</b><span>${c.contextMeaning||''}</span></div></div><div class="quizHint">Choose an answer</div></div></div>`;
  slide.querySelectorAll('.quizChoice').forEach(b=>b.onclick=e=>{e.preventDefault();e.stopPropagation();if(slide.dataset.answered)return;slide.dataset.answered='1';const ok=b.dataset.h===c.h;slide.querySelectorAll('.quizChoice').forEach(x=>{if(x.dataset.h===c.h)x.classList.add('correct');else if(x===b)x.classList.add('wrong');else x.classList.add('dim')});slide.querySelector('.quizFeedback')?.classList.add('on');slide.querySelector('.quizHint').textContent='Swipe to continue';markExposure(c,fields,ok)});return slide}
function connectQuiz(set){const chosen=uniq([...shuffle((window.ALL||[]).filter(c=>state?.seen?.[c.h])).slice(0,3),...shuffle(set).slice(0,3),...set]).slice(0,6);const slide=document.createElement('div');slide.className='fp quizSlide connectSlide';const hz=shuffle(chosen),py=shuffle(chosen),en=shuffle(chosen);slide.innerHTML=`<div class="card"><div class="quizTop">TEST · 5/6</div><div class="quizBody"><div class="connectTitle">Connect the three</div><div class="connectSub">Match each Hanzi, pinyin and meaning.</div><div class="connectGrid"><div class="connectCol"><div class="connectLabel">Hanzi</div>${hz.map(c=>`<button class="matchItem hanzi" data-k="h" data-h="${c.h}">${c.h}</button>`).join('')}</div><div class="connectCol"><div class="connectLabel">Pinyin</div>${py.map(c=>`<button class="matchItem pinyin" data-k="p" data-h="${c.h}">${c.p||''}</button>`).join('')}</div><div class="connectCol"><div class="connectLabel">Meaning</div>${en.map(c=>`<button class="matchItem" data-k="m" data-h="${c.h}">${c.contextMeaning||''}</button>`).join('')}</div></div><div class="connectStatus">Tap one item in each column</div></div></div>`;let sel={};slide.onclick=e=>{const b=e.target.closest('.matchItem');if(!b||b.classList.contains('matched'))return;e.preventDefault();e.stopPropagation();slide.querySelectorAll(`.matchItem[data-k="${b.dataset.k}"]`).forEach(x=>x.classList.remove('selected'));b.classList.add('selected');sel[b.dataset.k]=b;if(!(sel.h&&sel.p&&sel.m))return;const trio=[sel.h,sel.p,sel.m],ok=trio.every(x=>x.dataset.h===trio[0].dataset.h),status=slide.querySelector('.connectStatus');if(ok){trio.forEach(x=>{x.classList.remove('selected');x.classList.add('matched')});const c=chosen.find(x=>x.h===trio[0].dataset.h);markExposure(c,['recognition','sound','meaning'],true);sel={};status.textContent=slide.querySelector('.matchItem:not(.matched)')?'Correct — keep going':'All 6 connected ✓ · swipe to continue'}else{trio.forEach(x=>x.classList.remove('selected'));sel={};status.textContent='Not quite — try again'}};return slide}

// ---------- shared writing engine ----------
function createWriter(target,status,c,opts={}){
  if(typeof HanziWriter==='undefined'){status.textContent='Stroke data unavailable.';return null}
  target.innerHTML='';const box=target.parentElement,z=Math.max(240,Math.floor(box.clientWidth||300));
  const drawingWidth=opts.drawingWidth??26;
  const writer=HanziWriter.create(target,c.h,{width:z,height:z,padding:24,showOutline:true,showCharacter:false,drawingWidth,strokeAnimationSpeed:5,strokeHighlightSpeed:5,delayBetweenStrokes:0,drawingFadeDuration:0});
  status.textContent='Start with the first stroke.';
  writer.quiz({showHintAfterMisses:1,highlightOnComplete:false,onCorrectStroke:d=>{status.textContent=d.strokesRemaining?`${d.strokesRemaining} stroke${d.strokesRemaining===1?'':'s'} left`:'Finishing…';try{writer.animateStroke?.(d.strokeNum,{onComplete:()=>{}})}catch{}},onComplete:()=>{status.textContent='Character complete ✓';try{if(typeof bump==='function')bump(c,'writing',true);else markExposure(c,['writing'],true)}catch{}}});
  return writer;
}
function writingQuiz(c){const slide=document.createElement('div');slide.className='fp quizSlide writeSlide';slide.innerHTML=`<div class="card"><div class="quizTop">TEST · 6/6</div><div class="quizBody"><div class="writePrompt">Write <b>${c.h}</b> in stroke order · ${c.p||''} · ${c.contextMeaning||''}</div><div class="writeSurface"><div class="writeTarget"></div></div><div class="writeStatus">Preparing stroke practice…</div><button class="finishQuiz">Finish quiz</button></div></div>`;const target=slide.querySelector('.writeTarget'),status=slide.querySelector('.writeStatus'),surface=slide.querySelector('.writeSurface');surface.addEventListener('pointerdown',e=>e.stopPropagation());surface.addEventListener('pointermove',e=>e.stopPropagation());surface.addEventListener('pointerup',e=>e.stopPropagation());surface.addEventListener('touchstart',e=>e.stopPropagation(),{passive:true});surface.addEventListener('touchmove',e=>e.stopPropagation(),{passive:true});surface.addEventListener('touchend',e=>e.stopPropagation(),{passive:true});slide._startWriter=()=>createWriter(target,status,c,{drawingWidth:26});slide.querySelector('.finishQuiz').onclick=e=>{e.preventDefault();e.stopPropagation();closeFocusConsolidated();renderLessonBoard(lessonPage)};return slide}
function openPractice(c){
  const pane=q('#strokePane'),target=q('#target'),status=q('#strokeStatus');if(!pane||!target||!status)return;pane.classList.add('on');const sh=pane.querySelector('.sh');if(sh)sh.textContent=c.h;createWriter(target,status,c,{drawingWidth:22});
}

function buildQuizSlides(set){const base=uniq(set),seq=[];const picks=shuffle(base);for(let i=0;i<4;i++){const c=picks[i%picks.length]||base[0];seq.push(recallQuiz(c,['meaning','pinyin','hanzi'][i%3],i+1))}seq.push(connectQuiz(base));seq.push(writingQuiz(base[base.length-1]||base[0]));return seq}
function openFocusConsolidated(set,start=0){
  const clean=uniq(set).slice(0,6);if(!clean.length)return;focusSet=clean;focusLearnCount=clean.length;focusActive=clamp(start,0,clean.length-1);
  const focus=q('#focus'),pager=q('#pager'),count=q('#count');if(!focus||!pager)return;focus.classList.add('on');pager.className='pager consolidated-pager';pager.innerHTML='';
  focusSlides=[...clean.map(learnSlide),...buildQuizSlides(clean)];const track=document.createElement('div');track.className='consolidated-track';focusSlides.forEach(s=>track.appendChild(s));pager.appendChild(track);pager._track=track;
  pager.onpointerdown=focusPointerDown;pager.onpointermove=focusPointerMove;pager.onpointerup=focusPointerUp;pager.onpointercancel=()=>{focusGesture=null;settleFocus(focusActive)};pager.onclick=e=>{if(now()<focusSuppress){e.preventDefault();e.stopImmediatePropagation()}};
  if(count)count.textContent=`${focusActive+1} of ${focusLearnCount}`;positionFocus(0,false);announceFocus();
}
function positionFocus(px=0,animate=false){const pager=q('#pager'),track=pager?._track;if(!pager||!track)return;pager.classList.toggle('settling',animate);track.style.transform=`translate3d(calc(${-focusActive*100}% + ${px}px),0,0)`}
function announceFocus(){const count=q('#count');if(focusActive<focusLearnCount){if(count)count.textContent=`${focusActive+1} of ${focusLearnCount}`;window.focusLastIndex=focusActive;try{state.seen[focusSet[focusActive].h]=1;save?.();refreshLessonLabels()}catch{}}else{const qi=focusActive-focusLearnCount+1;if(count)count.textContent=`Test ${Math.min(qi,6)} of 6`;if(qi===6){const slide=focusSlides[focusActive];if(slide&&!slide.dataset.writerStarted){slide.dataset.writerStarted='1';requestAnimationFrame(()=>requestAnimationFrame(()=>slide._startWriter?.()))}}}}
function settleFocus(to,v=0){const pager=q('#pager');focusActive=clamp(to,0,focusSlides.length-1);const ms=clamp(275-Math.abs(v)*65,220,315);pager?.style.setProperty('--settle',ms+'ms');positionFocus(0,true);clearTimeout(focusTimer);focusTimer=setTimeout(()=>pager?.classList.remove('settling'),ms+20);announceFocus()}
function focusPointerDown(e){if(e.button!=null&&e.button!==0)return;if(e.target.closest('input,.writeSurface,.writeTarget')){focusGesture={blocked:true,id:e.pointerId};return}focusGesture={id:e.pointerId,x:e.clientX,y:e.clientY,lastX:e.clientX,lastT:now(),vx:0,axis:null,drag:false}}
function focusPointerMove(e){const g=focusGesture;if(!g||g.blocked||g.id!==e.pointerId)return;const dx=e.clientX-g.x,dy=e.clientY-g.y,ax=Math.abs(dx),ay=Math.abs(dy);if(!g.axis){if(ax<7&&ay<7)return;if(ax>ay*1.12)g.axis='x';else if(ay>ax*1.16){g.axis='y';g.blocked=true;return}else return}if(g.axis!=='x')return;g.drag=true;const t=now(),dt=Math.max(1,t-g.lastT),iv=(e.clientX-g.lastX)/dt;g.vx=.72*g.vx+.28*iv;g.lastX=e.clientX;g.lastT=t;let move=dx;if((focusActive===0&&dx>0)||(focusActive===focusSlides.length-1&&dx<0))move=Math.sign(dx)*Math.min(20,Math.abs(dx)*.1);positionFocus(move,false);e.preventDefault()}
function focusPointerUp(e){const g=focusGesture;focusGesture=null;if(!g||g.id!==e.pointerId||g.blocked||!g.drag)return;focusSuppress=now()+360;const dx=e.clientX-g.x,w=q('#pager')?.clientWidth||innerWidth,proj=dx+g.vx*120;let to=focusActive;if(proj<-w*.16&&focusActive<focusSlides.length-1)to++;else if(proj>w*.16&&focusActive>0)to--;e.preventDefault();settleFocus(to,g.vx)}
function closeFocusConsolidated(){q('#focus')?.classList.remove('on');focusGesture=null;clearTimeout(focusTimer)}

// ---------- Explore ----------
function recolorExplore(){qa('#wall .wt').forEach(el=>{const h=el.dataset.w||el.dataset.h||el.textContent.trim(),s=skill(h);el.classList.remove('ex-unseen','ex-learning','ex-mastered','ex-struggle');if(state?.mastered?.[h])el.classList.add('ex-mastered');else if((s.mistakes||0)>=2)el.classList.add('ex-struggle');else if(state?.seen?.[h])el.classList.add('ex-learning');else el.classList.add('ex-unseen')})}
function refreshProgressOnly(){refreshLessonLabels();recolorExplore();try{window.__coreProgress?.()}catch{}}

// ---------- take ownership of shell ----------
function install(){
  markBuild();
  // preserve core progress function before replacing side-effectful wrappers
  if(!window.__coreProgress&&typeof window.progress==='function')window.__coreProgress=window.progress.bind(window);
  window.progress=()=>{try{window.__coreProgress?.()}catch{}refreshLessonLabels();recolorExplore()};
  window.openFocus=openFocusConsolidated;
  const close=q('#close');if(close)close.onclick=e=>{e.preventDefault();closeFocusConsolidated()};
  const cont=q('#continue');if(cont){cont.textContent='Continue learning';cont.onclick=e=>{e.preventDefault();continueLearning()}}q('#mix')?.remove();
  const strokeClose=q('#strokeClose');if(strokeClose)strokeClose.onclick=e=>{e.preventDefault();q('#strokePane')?.classList.remove('on')};
  // stop old focus swipe-down handler by replacing node with clone and re-binding only our close button if feasible
  const focus=q('#focus');if(focus){focus.ontouchstart=null;focus.ontouchend=null;focus.onpointerdown=null;focus.onpointerup=null}
  renderLessonBoard(0);recolorExplore();
  const wall=q('#wall');if(wall)new MutationObserver(recolorExplore).observe(wall,{childList:true,subtree:true});
}

if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(install,0),{once:true});else setTimeout(install,0);
})();
