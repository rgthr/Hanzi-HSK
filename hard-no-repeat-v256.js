/* Hanzi 2.5.6 — persistent no-repeat scheduler for Extra Hard */
(()=>{
'use strict';
const S=()=>window.HanziStore;
const state=()=>S()?.state||{};
const all=()=>S()?.ALL||[];
const lib=()=>window.HanziSentenceLibrary||{};
const han=/[\u3400-\u9fff]/;
const shuffle=a=>{a=[...a];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
function charStatus(h){if(state().mastered?.[h])return'mastered';if(!state().seen?.[h])return'unseen';const s=S().skill?.(h)||{};return(s.mistakes||0)>1?'needs-work':'learning'}
function eligible(zh){for(const ch of zh){if(!han.test(ch))continue;if(!S()?.byH?.[ch])return false;const x=charStatus(ch);if(x!=='mastered'&&x!=='learning')return false}return true}
function pinyin(zh){const out=[];for(const ch of zh){if(!han.test(ch))continue;const p=S()?.byH?.[ch]?.p;if(p)out.push(p)}return out.join(' ')}
function pool(){const out=[],seen=new Set();for(const [h,rows] of Object.entries(lib())){if(!['mastered','learning'].includes(charStatus(h)))continue;for(const row of rows||[]){const zh=(row?.[0]||'').trim(),en=(row?.[2]||'').trim();if(!zh||!en||seen.has(zh)||!eligible(zh))continue;seen.add(zh);out.push({h,zh,en,py:row?.[1]||pinyin(zh)})}}return out}
function history(){state().hardSentenceHistory=Array.isArray(state().hardSentenceHistory)?state().hardSentenceHistory:[];return state().hardSentenceHistory}
function pickFive(){
  const p=pool(); if(p.length<5)return[];
  const h=history(), used=new Set(h), fresh=shuffle(p.filter(x=>!used.has(x.zh)));
  let chosen=fresh.slice(0,5);
  if(chosen.length<5){
    const pos=new Map();h.forEach((z,i)=>pos.set(z,i));
    const recycled=p.filter(x=>!chosen.some(c=>c.zh===x.zh)).sort((a,b)=>(pos.get(a.zh)??-1)-(pos.get(b.zh)??-1));
    chosen=[...chosen,...recycled.slice(0,5-chosen.length)];
  }
  const selected=new Set(chosen.map(x=>x.zh));
  state().hardSentenceHistory=[...h.filter(z=>!selected.has(z)),...chosen.map(x=>x.zh)].slice(-500);
  S().save?.();
  return chosen;
}
function normZh(s){return String(s||'').replace(/[\s，。！？、,.!?]/g,'')}
function normEn(s){return String(s||'').toLowerCase().replace(/[’]/g,"'").replace(/[^a-z0-9' ]/g,'').replace(/\s+/g,' ').trim()}
function close(){document.getElementById('exploreReviewOverlay')?.remove()}
function shell(label){close();const o=document.createElement('div');o.id='exploreReviewOverlay';o.className='erOverlay';o.innerHTML=`<div class="erTop"><button class="erClose" aria-label="Close">⌄</button><b>${label}</b><span style="width:40px"></span></div><div class="erCard"></div>`;o.querySelector('.erClose').onclick=close;document.body.appendChild(o);return o.querySelector('.erCard')}
let session=null;
function start(){const list=pickFive();if(list.length<5)return;const dirs=shuffle(['zh-en','zh-en','zh-en','en-zh','en-zh']);session={list:list.map((x,i)=>({...x,direction:dirs[i]})),score:0,missed:[]};render(0)}
function render(i){if(i>=session.list.length)return results();const item=session.list[i],z2e=item.direction==='zh-en',card=shell(`Hard ${i+1} of 5`);card.innerHTML=`<div class="erEyebrow">Extra hard</div><div class="erTitle">Translate from memory</div><div class="erSub">No hints. Sentences do not repeat until the eligible pool has been exhausted.</div><div class="erDirection">${z2e?'CHINESE → ENGLISH':'ENGLISH → CHINESE'}</div><div class="erTranslatePrompt ${z2e?'zh':''}">${z2e?item.zh:item.en}</div><textarea class="erInput" autocomplete="off" autocorrect="off" spellcheck="false" placeholder="Type your translation"></textarea><button class="erSubmit">Check answer</button><div class="erCorrection"><b>Correct answer</b><span>${z2e?item.en:item.zh}</span><span class="erPy">${item.py}</span></div><button class="erNext" style="display:none">${i===4?'See results':'Next'}</button>`;const input=card.querySelector('.erInput'),submit=card.querySelector('.erSubmit'),next=card.querySelector('.erNext');input.focus();submit.onclick=()=>{if(card.dataset.answered)return;card.dataset.answered='1';const ok=z2e?normEn(input.value)===normEn(item.en):normZh(input.value)===normZh(item.zh);if(ok)session.score++;else session.missed.push(item);input.style.borderColor=ok?'#22c55e':'#ec4899';card.querySelector('.erCorrection').classList.add('on');submit.style.display='none';next.style.display='block';const c=S()?.byH?.[item.h];if(c)S().mark?.(c,['recognition','meaning'],ok)};next.onclick=()=>render(i+1)}
function results(){const card=shell('Hard test complete');card.innerHTML=`<div class="erEyebrow">Extra hard complete</div><div class="erTitle">${session.score===5?'Perfect translation':session.score>=4?'Excellent':'Keep building sentences'}</div><div class="erScore">${session.score}/5</div><div class="erSub">Future Extra Hard tests will avoid these five sentences until the eligible pool has been cycled through.</div>${session.missed.length?`<div class="erMissed">${session.missed.map(x=>`<div class="erMiss">${x.zh}<br><span style="color:var(--green);font-weight:700">${x.py}</span><br><span style="color:var(--muted)">${x.en}</span></div>`).join('')}</div>`:''}<button class="erNext">Done</button>`;card.querySelector('.erNext').onclick=close}
function bind(){const b=document.getElementById('exploreHardBtn');if(!b||b.dataset.noRepeat==='1')return;b.dataset.noRepeat='1';b.onclick=e=>{e.preventDefault();e.stopPropagation();start()}}
window.addEventListener('hanzi:data-ready',()=>setTimeout(bind,0));window.addEventListener('hanzi:state',()=>setTimeout(bind,0));document.addEventListener('DOMContentLoaded',()=>setTimeout(bind,150));
})();