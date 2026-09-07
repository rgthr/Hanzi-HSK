(()=>{
const BUILD='20260908.4';
const LESSON_SIZE=12;
let quizMistakes=new Set();
let quizAnswered=0;
let quizSessionActive=false;
let previousSix=[];

function lessonInfo(){
  if(!Array.isArray(ALL)||!ALL.length)return null;
  const totalLessons=Math.ceil(ALL.length/LESSON_SIZE);
  let current=1;
  for(let l=1;l<=totalLessons;l++){
    const chars=ALL.slice((l-1)*LESSON_SIZE,l*LESSON_SIZE);
    if(!chars.every(c=>state.mastered[c.h])){current=l;break}
    current=l;
  }
  const chars=ALL.slice((current-1)*LESSON_SIZE,current*LESSON_SIZE);
  const mastered=chars.filter(c=>state.mastered[c.h]).length;
  const completedLessons=Array.from({length:totalLessons},(_,i)=>ALL.slice(i*LESSON_SIZE,(i+1)*LESSON_SIZE).every(c=>state.mastered[c.h])).filter(Boolean).length;
  return {current,totalLessons,chars,mastered,total:chars.length,completedLessons};
}

function renderLessonProgress(){
  const info=lessonInfo();
  if(!info)return;
  const pLabel=document.getElementById('pLabel');
  const pCount=document.getElementById('pCount');
  const pBar=document.getElementById('pBar');
  if(pLabel)pLabel.textContent=`Lesson ${info.current} · ${info.mastered}/${info.total} mastered`;
  if(pCount)pCount.textContent=`HSK 1 · ${Object.keys(state.mastered||{}).length}/${ALL.length}`;
  if(pBar)pBar.style.width=(info.total?Math.round(info.mastered/info.total*100):0)+'%';

  const progressScreen=document.getElementById('progressScreen');
  if(progressScreen){
    let card=progressScreen.querySelector('.lessonProgressCard');
    if(!card){
      card=document.createElement('div');
      card.className='map lessonProgressCard';
      const map=progressScreen.querySelector('.map');
      if(map)map.insertAdjacentElement('beforebegin',card); else progressScreen.appendChild(card);
    }
    const pct=info.total?Math.round(info.mastered/info.total*100):0;
    card.innerHTML=`<div class="lessonRow"><div><span class="lessonEyebrow">CURRENT LESSON</span><b>Lesson ${info.current} of ${info.totalLessons}</b></div><strong>${info.mastered}/${info.total}</strong></div><div class="lessonMiniBar"><i style="width:${pct}%"></i></div><div class="lessonMeta">${info.completedLessons} lesson${info.completedLessons===1?'':'s'} completed · ${pct}% of this lesson mastered</div>`;
  }
}

const style=document.createElement('style');
style.textContent=`
.lessonProgressCard{margin-top:10px!important}.lessonRow{display:flex;align-items:flex-end;justify-content:space-between;gap:12px}.lessonRow>div{display:flex;flex-direction:column;gap:3px}.lessonEyebrow{font-size:9px;letter-spacing:.09em;color:var(--muted);font-weight:750}.lessonRow b{font-size:17px}.lessonRow strong{font-size:22px}.lessonMiniBar{height:7px;background:var(--soft);border-radius:99px;overflow:hidden;margin-top:12px}.lessonMiniBar i{display:block;height:100%;background:var(--green);border-radius:99px;transition:width .25s ease}.lessonMeta{font-size:11px;color:var(--muted);margin-top:8px}
`;
document.head.appendChild(style);

// Track quiz answers without depending on private variables inside patch.js.
document.addEventListener('click',e=>{
  const btn=e.target.closest?.('.quizChoice[data-choice]');
  if(!btn)return;
  const slide=btn.closest('.quizSlide');
  if(!slide||slide.dataset.flowTracked)return;
  slide.dataset.flowTracked='1';
  quizSessionActive=true;
  quizAnswered++;
  const isCorrect=btn.dataset.ok==='true';
  if(!isCorrect){
    const correct=slide.querySelector('.quizChoice[data-ok="true"]');
    if(correct)quizMistakes.add(correct.dataset.choice);
  }
  if(quizAnswered>=4){
    state.lastQuizMistakes=[...quizMistakes];
    state.lastQuizCompletedAt=Date.now();
    save();
  }
},{capture:true});

const originalOpenFocus=window.openFocus;
window.openFocus=function(set,start=0){
  previousSix=(set||[]).slice(0,6).map(c=>c.h);
  quizMistakes=new Set();
  quizAnswered=0;
  quizSessionActive=false;
  return originalOpenFocus(set,start);
};

function buildPostQuizBoard(){
  const missed=[...quizMistakes].map(h=>byH[h]).filter(Boolean);
  const exclude=new Set([...previousSix,...missed.map(c=>c.h)]);
  // A genuinely fresh mix first: unseen characters, then other learning/review chars if needed.
  const unseen=ALL.filter(c=>!state.seen[c.h]&&!exclude.has(c.h)).sort((a,b)=>(a.index||0)-(b.index||0));
  const other=ALL.filter(c=>!exclude.has(c.h)&&!unseen.includes(c)).sort((a,b)=>priority(b)-priority(a));
  const fill=[...unseen,...other].slice(0,Math.max(0,6-missed.length));
  return [...missed,...fill].slice(0,6);
}

const originalNextBoard=window.nextBoard;
window.nextBoard=function(){
  if(quizSessionActive&&quizAnswered>=4){
    const next=buildPostQuizBoard();
    quizSessionActive=false;
    quizAnswered=0;
    quizMistakes=new Set();
    state.board=next.map(c=>c.h);
    save();
    boardFromChars(next,true);
    renderLessonProgress();
    return;
  }
  const out=originalNextBoard();
  renderLessonProgress();
  return out;
};

const originalProgress=window.progress;
window.progress=function(){
  const out=originalProgress();
  renderLessonProgress();
  return out;
};

setTimeout(renderLessonProgress,250);
})();
