(()=>{
const BUILD='20260908.27';
const css=document.createElement('style');css.textContent=`
#pager.v26pager>.fp{transition:none!important;will-change:transform;transform-style:preserve-3d}
#pager.v27-settling>.fp{transition:transform .28s cubic-bezier(.22,.78,.24,1)!important}
.v26write .writeTarget svg{touch-action:none!important;-webkit-user-select:none;user-select:none}
`;
document.head.appendChild(css);

/* ---- Stable writer defaults for iOS ----
Canvas was fast but unreliable after the first accepted stroke on iOS Home Screen.
Keep SVG, but remove the expensive completion animation and keep a short natural drawing fade. */
if(window.HanziWriter&&HanziWriter.create&&!HanziWriter.__v27){
  HanziWriter.__v27=true;
  const rawCreate=HanziWriter.create.bind(HanziWriter);
  HanziWriter.create=function(el,ch,opts={}){
    const clean={...opts};delete clean.renderer;
    clean.drawingFadeDuration=140;
    clean.strokeAnimationSpeed=4;
    clean.strokeHighlightSpeed=4;
    clean.delayBetweenStrokes=0;
    const w=rawCreate(el,ch,clean);
    const rawQuiz=w.quiz.bind(w);
    w.quiz=function(q={}){return rawQuiz({...q,highlightOnComplete:false,showHintAfterMisses:false})};
    return w;
  };
}

/* ---- Smooth pager ----
Use one moving track model instead of independently transitioning every card.
Only activate horizontal drag after a clear axis lock; taps remain untouched. */
const previousOpen=window.openFocus;
window.openFocus=function(set,start=0){
  const out=previousOpen(set,start);
  requestAnimationFrame(()=>requestAnimationFrame(()=>{
    const p=document.getElementById('pager');if(!p)return;
    const slides=[...p.children];if(!slides.length)return;
    let active=Math.max(0,Math.min(start,slides.length-1));
    let g=null,settleTimer=null;
    const width=()=>p.getBoundingClientRect().width||window.innerWidth;
    function render(px=0){slides.forEach((s,i)=>s.style.transform=`translate3d(${(i-active)*100}%,0,0) translate3d(${px}px,0,0)`)}
    function announce(){const learn=(window.focusSet||[]).length;if(active<learn){window.focusLastIndex=active;try{visit(active)}catch{}}else{const c=document.getElementById('count');if(c)c.textContent=`Test ${Math.min(active-learn+1,6)} of 6`;const ws=slides[learn+5];if(active===learn+5&&ws&&!ws.dataset.started){ws.dataset.started='1';ws._start?.()}}}
    function settle(to){active=Math.max(0,Math.min(to,slides.length-1));p.classList.add('v27-settling');render(0);clearTimeout(settleTimer);settleTimer=setTimeout(()=>p.classList.remove('v27-settling'),300);announce()}
    p.onpointerdown=e=>{
      if(e.button!=null&&e.button!==0)return;
      if(e.target.closest('button,input,.writeCanvas,.sentenceExample')){g={blocked:true,id:e.pointerId};return}
      g={id:e.pointerId,x:e.clientX,y:e.clientY,lastX:e.clientX,lastT:performance.now(),vx:0,axis:null,drag:false};
    };
    p.onpointermove=e=>{
      if(!g||g.blocked||g.id!==e.pointerId)return;
      const dx=e.clientX-g.x,dy=e.clientY-g.y,adx=Math.abs(dx),ady=Math.abs(dy);
      if(!g.axis){if(adx<7&&ady<7)return;if(adx>ady*1.15)g.axis='x';else if(ady>adx*1.15){g.axis='y';g.blocked=true;return}else return}
      if(g.axis!=='x')return;
      if(!g.drag){g.drag=true;p.classList.remove('v27-settling');try{p.setPointerCapture(e.pointerId)}catch{}}
      const now=performance.now(),dt=Math.max(1,now-g.lastT);g.vx=(e.clientX-g.lastX)/dt;g.lastX=e.clientX;g.lastT=now;
      let resisted=dx;if((active===0&&dx>0)||(active===slides.length-1&&dx<0))resisted=dx*.28;
      render(resisted);e.preventDefault();
    };
    p.onpointerup=e=>{
      if(!g||g.id!==e.pointerId){g=null;return}const x=g;g=null;if(x.blocked||!x.drag)return;
      const dx=e.clientX-x.x,w=width(),goNext=dx<-(w*.18)||x.vx<-.38,goPrev=dx>(w*.18)||x.vx>.38;
      e.preventDefault();if(goNext&&active<slides.length-1)settle(active+1);else if(goPrev&&active>0)settle(active-1);else settle(active);
    };
    p.onpointercancel=()=>{g=null;settle(active)};
    render(0);announce();
  }));
  return out;
};

const vr=document.querySelector('#settingsSheet .versionRow b');if(vr)vr.textContent='v '+BUILD;window.__hanziBuild=BUILD;
})();