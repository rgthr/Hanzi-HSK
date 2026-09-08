(()=>{
const p=document.getElementById('strokePane'),card=p&&p.querySelector('.strokeCard'),canvas=p&&p.querySelector('.canvas'),st=p&&p.querySelector('.strokeStatus');
const s=document.createElement('style');s.textContent=`
.strokePane .strokeCard{will-change:transform;transition:transform .22s cubic-bezier(.2,.8,.2,1),opacity .18s ease}
.canvas.stroke-ok{box-shadow:0 0 0 5px rgba(47,111,94,.14)}
.canvas.character-ok{box-shadow:0 0 0 8px rgba(47,111,94,.20)}
`;
document.head.appendChild(s);
if(st&&canvas){let old=st.textContent;new MutationObserver(()=>{const n=st.textContent;if(n!==old){const cls=/complete|✓/i.test(n)?'character-ok':'stroke-ok';canvas.classList.remove('stroke-ok','character-ok');void canvas.offsetWidth;canvas.classList.add(cls);setTimeout(()=>canvas.classList.remove(cls),350);old=n}}).observe(st,{childList:true,subtree:true,characterData:true})}
if(!p||!card)return;
let sy=0,sx=0,drag=false,blocked=false,dy=0;
function reset(){card.style.transition='transform .22s cubic-bezier(.2,.8,.2,1),opacity .18s ease';card.style.transform='';card.style.opacity='';drag=false;dy=0}
p.addEventListener('touchstart',e=>{const t=e.touches[0];if(!t)return;blocked=!!e.target.closest?.('.canvas');if(blocked)return;sx=t.clientX;sy=t.clientY;dy=0;drag=true;card.style.transition='none'},{capture:true,passive:true});
p.addEventListener('touchmove',e=>{if(!drag||blocked)return;const t=e.touches[0];if(!t)return;const dx=t.clientX-sx;dy=Math.max(0,t.clientY-sy);if(dy<2||Math.abs(dx)>dy*1.15)return;e.preventDefault();e.stopImmediatePropagation();card.style.transform=`translateY(${dy}px)`;card.style.opacity=String(Math.max(.72,1-dy/850))},{capture:true,passive:false});
p.addEventListener('touchend',e=>{if(!drag||blocked){drag=false;return}const t=e.changedTouches[0],dx=t?t.clientX-sx:0;const shouldClose=dy>92&&Math.abs(dx)<dy*1.25;if(dy>2){e.preventDefault();e.stopImmediatePropagation()}if(shouldClose){card.style.transition='transform .24s cubic-bezier(.2,.8,.2,1),opacity .2s ease';card.style.transform='translateY(105%)';card.style.opacity='.45';setTimeout(()=>{p.classList.remove('on');const target=document.getElementById('target');if(target)target.innerHTML='';reset()},220)}else reset()},{capture:true,passive:false});
})();