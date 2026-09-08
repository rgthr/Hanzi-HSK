(()=>{
const BUILD='20260908.39';
function pulse(done=false,box=null){const c=box||document.querySelector('#strokePane .canvas');if(!c)return;c.classList.remove('strokePulse','charPulse');void c.offsetWidth;c.classList.add(done?'charPulse':'strokePulse');setTimeout(()=>c.classList.remove('strokePulse','charPulse'),done?520:260)}
window.strokeQuiz=function(c,opts={}){
  const t=opts.target||document.getElementById('target'),box=opts.box||(t&&t.parentElement),status=opts.status||document.getElementById('strokeStatus');if(!t||!box||!status)return null;t.innerHTML='';
  if(typeof HanziWriter==='undefined'){status.textContent='Stroke data needs internet.';return null}
  const z=Math.floor(box.clientWidth||300),drawingWidth=opts.drawingWidth||13;
  const w=HanziWriter.create(t,c.h,{width:z,height:z,padding:26,showOutline:true,showCharacter:false});
  status.textContent='Start with the first stroke.';
  w.quiz({showHintAfterMisses:1,highlightOnComplete:true,drawingWidth,
    onCorrectStroke:d=>{status.textContent=d.strokesRemaining?`${d.strokesRemaining} stroke${d.strokesRemaining===1?'':'s'} left`:'Finishing…';pulse(false,box)},
    onComplete:()=>{status.textContent='Character complete ✓';pulse(true,box);try{bump(c,'writing',true)}catch{}}
  });
  try{window.writer=w}catch{}
  return w;
};
const vr=document.querySelector('#settingsSheet .versionRow b');if(vr)vr.textContent='v '+BUILD;window.__hanziBuild=BUILD;
})();