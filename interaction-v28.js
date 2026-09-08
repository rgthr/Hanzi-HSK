(()=>{
const BUILD='20260908.28';
const css=document.createElement('style');css.textContent=`
/* One composited track = smoother iOS motion than transforming every card separately. */
#pager.v28pager{position:relative!important;display:block!important;overflow:hidden!important;scroll-snap-type:none!important;touch-action:none!important;-webkit-overflow-scrolling:auto!important;overscroll-behavior:none!important}
#pager.v28pager>.v28track{height:100%;width:100%;display:flex;will-change:transform;transform:translate3d(0,0,0);backface-visibility:hidden}
#pager.v28pager>.v28track>.fp{position:relative!important;inset:auto!important;flex:0 0 100%!important;width:100%!important;min-width:100%!important;height:100%!important;transform:none!important;transition:none!important;will-change:auto!important}
#pager.v28pager.v28-settling>.v28track{transition:transform .34s cubic-bezier(.22,1,.36,1)!important}
/* Main-character recall: Hanzi stays visible; pinyin + meaning reveal together. */
.mainRecall{display:flex;flex-direction:column;align-items:center;cursor:pointer;touch-action:none;-webkit-tap-highlight-color:transparent;min-width:150px;padding:2px 14px 4px;border-radius:10px}
.mainRecall .py,.mainRecall .meaning{transition:filter .10s ease,opacity .10s ease}
.mainRecall.main-hidden .py,.mainRecall.main-hidden .meaning{filter:blur(7px)!important;opacity:.30!important;user-select:none!important}
.mainRecall:not(.main-hidden) .py,.mainRecall:not(.main-hidden) .meaning{filter:none!important;opacity:1!important}
/* Keep the writing surface completely isolated from card navigation / swipe-to-close. */
.v26write .writeCanvas,.v26write .writeTarget,.v26write .writeTarget svg{touch-action:none!important;-webkit-user-select:none!important;user-select:none!important}
`;
document.head.appendChild(css);

/* Stable writer defaults. Keep SVG on iOS; do not use the canvas renderer. */
if(window.HanziWriter&&HanziWriter.create&&!HanziWriter.__v28){
  HanziWriter.__v28=true;
  const rawCreate=HanziWriter.create.bind(HanziWriter);
  HanziWriter.create=function(el,ch,opts={}){
    const clean={...opts};delete clean.renderer;
    clean.drawingFadeDuration=120;
    clean.strokeAnimationSpeed=4;
    clean.strokeHighlightSpeed=4;
    clean.delayBetweenStrokes=0;
    const w=rawCreate(el,ch,clean);
    const rawQuiz=w.quiz.bind(w);
    w.quiz=function(q={}){return rawQuiz({...q,highlightOnComplete:false,showHintAfterMisses:false})};
    return w;
  };
}

function installMainRecall(slide){
  if(!slide?.matches?.('.fp[data-h]'))return;
  const hero=slide.querySelector('.heroChar'),py=hero?.querySelector(':scope > .py'),meaning=hero?.querySelector(':scope > .meaning');
  if(!hero||!py||!meaning||hero.querySelector('.mainRecall'))return;
  const recall=document.createElement('div');recall.className='mainRecall main-hidden';
  hero.insertBefore(recall,py);recall.append(py,meaning);
  recall.onclick=e=>{e.preventDefault();e.stopPropagation();recall.classList.toggle('main-hidden')};
}
function isolateWriter(slide){
  const box=slide?.querySelector?.('.writeCanvas');if(!box||box.dataset.v28Isolated)return;box.dataset.v28Isolated='1';
  /* Hanzi Writer receives the event first on its target. Stop it at the canvas before it can reach #focus's downward-swipe close listener. */
  ['touchstart','touchmove','touchend','touchcancel','pointerdown','pointermove','pointerup','pointercancel'].forEach(type=>box.addEventListener(type,e=>e.stopPropagation(),{passive:true}));
}

function installTrackPager(p,start,learnCount){
  if(!p)return;
  /* unwrap an earlier v28 track on repeat openings */
  const old=p.querySelector(':scope > .v28track');if(old){while(old.firstChild)p.insertBefore(old.firstChild,old);old.remove()}
  const slides=[...p.children].filter(x=>x.classList?.contains('fp'));if(!slides.length)return;
  slides.forEach(installMainRecall);slides.forEach(isolateWriter);
  const track=document.createElement('div');track.className='v28track';slides.forEach(s=>track.appendChild(s));p.appendChild(track);
  p.classList.remove('v26pager','v27-settling');p.classList.add('v28pager');p.onscroll=null;p.scrollLeft=0;
  let active=Math.max(0,Math.min(start,slides.length-1)),g=null,settleTimer=null;
  const W=()=>p.getBoundingClientRect().width||innerWidth;
  function position(px=0,animate=false){
    if(animate)p.classList.add('v28-settling');else p.classList.remove('v28-settling');
    track.style.transform=`translate3d(calc(${-active*100}% + ${px}px),0,0)`;
  }
  function announce(){
    if(active<learnCount){window.focusLastIndex=active;try{visit(active)}catch{}}
    else{const count=document.getElementById('count');if(count)count.textContent=`Test ${Math.min(active-learnCount+1,6)} of 6`;const ws=slides[learnCount+5];
      /* app-v26 preloads the writer. Never recreate it merely because the writing card became visible. */
      if(active===learnCount+5&&ws&&!ws.dataset.preloaded&&!ws.dataset.started){ws.dataset.started='1';ws._start?.()}
    }
  }
  function settle(to,velocity=0){
    active=Math.max(0,Math.min(to,slides.length-1));
    /* Slightly faster for a flick, slower for a deliberate drag. */
    const ms=Math.max(250,Math.min(360,330-Math.abs(velocity)*90));
    track.style.transitionDuration=ms+'ms';position(0,true);clearTimeout(settleTimer);settleTimer=setTimeout(()=>p.classList.remove('v28-settling'),ms+25);announce();
  }
  position(0,false);announce();
  p.onpointerdown=e=>{
    if(e.button!=null&&e.button!==0)return;
    if(e.target.closest('button,input,.writeCanvas,.sentenceExample,.mainRecall')){g={blocked:true,id:e.pointerId};return}
    g={id:e.pointerId,x:e.clientX,y:e.clientY,lastX:e.clientX,lastT:performance.now(),vx:0,axis:null,drag:false,dx:0};
  };
  p.onpointermove=e=>{
    if(!g||g.blocked||g.id!==e.pointerId)return;
    const dx=e.clientX-g.x,dy=e.clientY-g.y,adx=Math.abs(dx),ady=Math.abs(dy);
    if(!g.axis){if(adx<6&&ady<6)return;if(adx>ady*1.12)g.axis='x';else if(ady>adx*1.18){g.axis='y';g.blocked=true;return}else return}
    if(g.axis!=='x')return;
    if(!g.drag){g.drag=true;p.classList.remove('v28-settling');track.style.transition='none';try{p.setPointerCapture(e.pointerId)}catch{}}
    const now=performance.now(),dt=Math.max(1,now-g.lastT),instant=(e.clientX-g.lastX)/dt;g.vx=g.vx*.68+instant*.32;g.lastX=e.clientX;g.lastT=now;g.dx=dx;
    let move=dx;if((active===0&&dx>0)||(active===slides.length-1&&dx<0)){const sign=Math.sign(dx);move=sign*Math.pow(Math.abs(dx),.82)*1.7}
    position(move,false);e.preventDefault();
  };
  p.onpointerup=e=>{
    if(!g||g.id!==e.pointerId){g=null;return}const x=g;g=null;if(x.blocked||!x.drag)return;
    const dx=e.clientX-x.x,w=W(),projected=dx+x.vx*120;let to=active;
    if(projected<-w*.20&&active<slides.length-1)to=active+1;else if(projected>w*.20&&active>0)to=active-1;
    e.preventDefault();settle(to,x.vx);
  };
  p.onpointercancel=()=>{g=null;settle(active,0)};
}

const previousOpen=window.openFocus;
window.openFocus=function(set,start=0){
  const out=previousOpen(set,start);
  /* app-v26 installs its pager on the first RAF; replace it on the following frame. */
  requestAnimationFrame(()=>requestAnimationFrame(()=>{const p=document.getElementById('pager');if(p)installTrackPager(p,start,(window.focusSet||[]).length)}));
  return out;
};

const vr=document.querySelector('#settingsSheet .versionRow b');if(vr)vr.textContent='v '+BUILD;window.__hanziBuild=BUILD;
})();