(()=>{
const BUILD='20260908.8';
function pulse(done=false){const c=document.querySelector('#strokePane .canvas');if(!c)return;c.classList.remove('strokePulse','charPulse');void c.offsetWidth;c.classList.add(done?'charPulse':'strokePulse');setTimeout(()=>c.classList.remove('strokePulse','charPulse'),done?520:260)}
window.strokeQuiz=function(c){
  const t=document.getElementById('target'),box=t&&t.parentElement;if(!t||!box)return;t.innerHTML='';
  if(typeof HanziWriter==='undefined'){document.getElementById('strokeStatus').textContent='Stroke data needs internet.';return}
  const z=Math.floor(box.clientWidth);
  writer=HanziWriter.create(t,c.h,{width:z,height:z,padding:26,showOutline:true,showCharacter:false});
  document.getElementById('strokeStatus').textContent='Start with the first stroke.';
  writer.quiz({
    showHintAfterMisses:1,
    highlightOnComplete:true,
    drawingWidth:13,
    onCorrectStroke:d=>{document.getElementById('strokeStatus').textContent=d.strokesRemaining?`${d.strokesRemaining} stroke${d.strokesRemaining===1?'':'s'} left`:'Finishing…';pulse(false)},
    onComplete:()=>{document.getElementById('strokeStatus').textContent='Character complete ✓';pulse(true);bump(c,'writing',true)}
  });
};
const vr=document.querySelector('#settingsSheet .versionRow b');if(vr)vr.textContent='v '+BUILD;
window.__hanziBuild=BUILD;
})();