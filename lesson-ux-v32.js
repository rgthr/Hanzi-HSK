(()=>{
const BUILD='20260908.32',LESSON=12;
const css=document.createElement('style');css.textContent=`
/* One clear action; lesson deck is two horizontal pages of six. */
#mix{display:none!important}.foot{height:48px!important}.foot #continue{width:100%!important;flex:1!important;font-size:14px!important}
#board.lessonDeck{display:flex!important;overflow:hidden!important;position:relative!important;touch-action:none!important;gap:0!important;background:transparent}.lessonBoardPage{position:absolute;inset:0;display:grid;grid-template-columns:1fr 1fr;grid-template-rows:repeat(3,1fr);gap:8px;transition:transform .22s cubic-bezier(.2,.82,.2,1);will-change:transform}.lessonDeckDots{height:15px;display:flex;justify-content:center;align-items:center;gap:6px}.lessonDeckDots i{width:5px;height:5px;border-radius:50%;background:var(--line)}.lessonDeckDots i.on{width:14px;border-radius:9px;background:var(--ink)}
/* Connect: use the screen, larger type and airier rows. */
.v26connect .quizBody{padding:12px 14px 8px!important}.v26connect .tripleTitle{font-size:23px!important}.v26connect .tripleSub{font-size:13px!important;margin:5px 0 13px!important}.v26connect .tripleGrid{gap:9px!important;grid-template-columns:.72fr 1fr 1.28fr!important}.v26connect .tripleCol{gap:9px!important}.v26connect .tripleLabel{font-size:10px!important;margin-bottom:2px}.v26connect .matchItem{min-height:50px!important;padding:6px!important;font-size:13px!important;line-height:1.15!important}.v26connect .matchItem.hanzi{font-size:29px!important}.v26connect .matchItem.pinyin{font-size:14px!important}.v26connect .tripleStatus{font-size:12px!important;margin-top:10px!important}
`;
document.head.appendChild(css);

function lessonChars(){let n=0;try{for(let i=0;i<ALL.length;i+=LESSON){const a=ALL.slice(i,i+LESSON);if(!a.every(c=>state.mastered?.[c.h])){n=i;break}n=i}return ALL.slice(n,n+LESSON)}catch{return[]}}
function tile(c){const b=document.createElement('button');b.className='tile';b.dataset.h=c.h;const s=state.skills?.[c.h]||{};let tag='NEW';if(state.mastered?.[c.h])tag='MASTERED';else if(state.seen?.[c.h])tag=(s.mistakes||0)>1?'REVIEW':'LEARNING';b.innerHTML=`<span class="tag">${tag}</span><span class="hz">${c.h}</span>${state.seen?.[c.h]?'<i class="dot"></i>':''}`;b.onclick=()=>openFocus([c],0);return b}
function renderLessonDeck(){const board=document.getElementById('board');if(!board)return;const chars=lessonChars();if(chars.length<1)return;board.classList.add('lessonDeck');board.innerHTML='';const pages=[chars.slice(0,6),chars.slice(6,12)];pages.forEach((arr,i)=>{const p=document.createElement('div');p.className='lessonBoardPage';p.dataset.page=i;arr.forEach(c=>p.appendChild(tile(c)));board.appendChild(p)});let dots=board.parentElement.querySelector('.lessonDeckDots');if(!dots){dots=document.createElement('div');dots.className='lessonDeckDots';board.insertAdjacentElement('afterend',dots)}dots.innerHTML='<i class="on"></i><i></i>';let active=0,g=null;const paint=(dx=0,anim=true)=>{[...board.children].forEach((p,i)=>{p.style.transition=anim?'transform .22s cubic-bezier(.2,.82,.2,1)':'none';p.style.transform=`translate3d(calc(${(i-active)*100}% + ${dx}px),0,0)`});[...dots.children].forEach((d,i)=>d.classList.toggle('on',i===active))};paint(0,false);board.onpointerdown=e=>{if(e.target.closest('.tile'))g={id:e.pointerId,x:e.clientX,y:e.clientY,drag:false};else g={id:e.pointerId,x:e.clientX,y:e.clientY,drag:false}};board.onpointermove=e=>{if(!g||g.id!==e.pointerId)return;const dx=e.clientX-g.x,dy=e.clientY-g.y;if(!g.drag&&Math.abs(dx)>8&&Math.abs(dx)>Math.abs(dy)*1.15){g.drag=true;try{board.setPointerCapture(e.pointerId)}catch{}}if(g.drag){paint(dx,false);e.preventDefault()}};board.onpointerup=e=>{if(!g||g.id!==e.pointerId)return;const x=g;g=null;if(!x.drag)return;const dx=e.clientX-x.x;if(dx<-55)active=1;else if(dx>55)active=0;paint()};board.onpointercancel=()=>{g=null;paint()}}

/* Always expose exactly three useful examples. Existing curated/context examples come first;
   these natural fallbacks are only used when the source has fewer than three. */
const oldExamples=window.examples;
const fallback=(c)=>[
 [`我在学“${c.h}”这个字。`,`wǒ zài xué “${c.p}” zhège zì.`,`I’m learning the character ${c.h}.`],
 [`你认识“${c.h}”这个字吗？`,`nǐ rènshi “${c.p}” zhège zì ma?`,`Do you recognize the character ${c.h}?`],
 [`老师写了“${c.h}”这个字。`,`lǎoshī xiě le “${c.p}” zhège zì.`,`The teacher wrote the character ${c.h}.`]
];
window.examples=function(c){let a=[];try{a=(oldExamples?.(c)||[]).filter(x=>x&&x[0]&&x[0].includes(c.h))}catch{}const seen=new Set(),out=[];for(const x of [...a,...fallback(c)]){if(!x?.[0]||seen.has(x[0]))continue;seen.add(x[0]);out.push(x);if(out.length===3)break}return out};

/* Connect must contain six distinct Hanzi. */
const oldOpen=window.openFocus;window.openFocus=function(set,start=0){const uniq=[];for(const c of (set||[])){if(c&&!uniq.some(x=>x.h===c.h))uniq.push(c)}const out=oldOpen(uniq,start);requestAnimationFrame(()=>{document.querySelectorAll('.v26connect').forEach(sl=>{const hs=[...sl.querySelectorAll('.matchItem.hanzi')].map(x=>x.dataset.h);if(new Set(hs).size!==hs.length){/* rebuild next time rather than allowing duplicate quiz data */sl.remove()}})});return out};

/* Continue learning intentionally feeds new characters frequently: at least 3 unseen from the current lesson when available. */
const cont=document.getElementById('continue');if(cont){cont.textContent='Continue learning';cont.onclick=e=>{e.preventDefault();const lesson=lessonChars(),unseen=lesson.filter(c=>!state.seen?.[c.h]),learning=lesson.filter(c=>state.seen?.[c.h]&&!state.mastered?.[c.h]),mastered=lesson.filter(c=>state.mastered?.[c.h]);const pick=[];for(const c of unseen.slice(0,3))if(!pick.includes(c))pick.push(c);for(const c of [...learning,...unseen.slice(3),...mastered])if(pick.length<6&&!pick.some(x=>x.h===c.h))pick.push(c);if(pick.length)openFocus(pick.slice(0,6),0)}}
const mix=document.getElementById('mix');if(mix){mix.onclick=null;mix.remove()}
const oldProgress=window.progress;window.progress=function(){const r=oldProgress?.();renderLessonDeck();return r};setTimeout(renderLessonDeck,180);
const vr=document.querySelector('#settingsSheet .versionRow b');if(vr)vr.textContent='v '+BUILD;window.__hanziBuild=BUILD;
})();