/* Hanzi 2.5.2 — Explore cumulative review */
(()=>{
'use strict';
const S=()=>window.HanziStore;
const state=()=>S()?.state||{};
const all=()=>S()?.ALL||[];
const shuffle=a=>{a=[...a];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
function seenChars(){return all().filter(c=>state().seen?.[c.h])}
function weakness(c){const s=S().skill?.(c.h)||{};return (s.mistakes||0)*5+(5-(s.recognition||0))*2+(5-(s.meaning||0))+(5-(s.sound||0))+(state().mastered?.[c.h]?-5:0)}
function pickTen(){
  const pool=seenChars(); if(pool.length<=10)return shuffle(pool);
  const ranked=[...pool].sort((a,b)=>weakness(b)-weakness(a));
  const weak=shuffle(ranked.slice(0,Math.min(12,ranked.length))).slice(0,4);
  return [...weak,...shuffle(pool.filter(c=>!weak.some(w=>w.h===c.h))).slice(0,6)];
}
function ensureUI(){
  if(document.getElementById('exploreTestBtn'))return;
  const filters=document.querySelector('#exploreScreen .filters'); if(!filters)return;
  const wrap=document.createElement('div');wrap.className='exploreTestWrap';
  wrap.innerHTML='<button id="exploreTestBtn" class="exploreTestBtn">Test all seen · 10 questions</button>';
  filters.insertAdjacentElement('afterend',wrap);
  document.getElementById('exploreTestBtn').onclick=start;
}
function ensureStyles(){if(document.getElementById('exploreReviewStyles'))return;const s=document.createElement('style');s.id='exploreReviewStyles';s.textContent=`
.exploreTestWrap{margin:2px 0 11px}.exploreTestBtn{width:100%;height:46px;border:1px solid var(--line);border-radius:9px;background:var(--ink);color:var(--bg);font-size:13px;font-weight:760}
.erOverlay{position:fixed;z-index:320;inset:0;background:var(--bg);color:var(--ink);display:flex;flex-direction:column;padding:calc(12px + env(safe-area-inset-top)) 16px calc(18px + env(safe-area-inset-bottom))}.erTop{height:42px;display:flex;align-items:center;justify-content:space-between}.erTop b{font-size:12px;color:var(--muted)}.erClose{width:40px;height:40px;border:0;background:transparent;color:var(--muted);font-size:25px}.erCard{flex:1;min-height:0;background:var(--paper);border:1px solid var(--line);border-radius:16px;padding:20px 18px;display:flex;flex-direction:column;overflow:auto}.erEyebrow{font-size:10px;letter-spacing:.09em;font-weight:800;color:var(--green);text-transform:uppercase}.erTitle{font-size:29px;line-height:1.03;letter-spacing:-.04em;margin:7px 0 7px}.erSub{font-size:14px;color:var(--muted);line-height:1.4}.erHero{text-align:center;margin:34px 0 26px;font-family:"Songti SC","PingFang SC",serif;font-size:94px;line-height:1}.erHero.word{font-family:inherit;font-size:30px;font-weight:780}.erChoices{display:grid;grid-template-columns:1fr 1fr;gap:9px}.erChoice{min-height:58px;border:1px solid var(--line);background:var(--paper);border-radius:10px;padding:9px;font-weight:680}.erChoice.hanzi{font-family:"Songti SC","PingFang SC",serif;font-size:31px}.erChoice.correct{background:#d8fae8;color:#145c46;border-color:#7ed8b8}.erChoice.wrong{background:#fde8ec;color:#8b2744;border-color:#ef9eb4}.erChoice.dim{opacity:.38}.erAnswer{display:none;align-items:center;justify-content:center;gap:12px;margin-top:18px}.erAnswer.on{display:flex}.erAnswerH{font-family:"Songti SC","PingFang SC",serif;font-size:46px}.erAnswerText{display:flex;flex-direction:column}.erAnswerText b{font-size:16px}.erAnswerText span{font-size:13px;color:var(--muted)}.erNext{margin-top:auto;width:100%;min-height:50px;border:0;border-radius:10px;background:var(--ink);color:var(--bg);font-weight:780}.erNext[disabled]{opacity:.25}.erScore{font-size:56px;font-weight:800;letter-spacing:-.05em;margin:30px 0 5px}.erMissed{display:flex;flex-wrap:wrap;gap:8px;margin:14px 0}.erMiss{border:1px solid var(--line);border-radius:9px;padding:8px 10px;background:var(--soft)}
`;document.head.appendChild(s)}
function close(){document.getElementById('exploreReviewOverlay')?.remove()}
function shell(label){close();ensureStyles();const o=document.createElement('div');o.id='exploreReviewOverlay';o.className='erOverlay';o.innerHTML=`<div class="erTop"><button class="erClose" aria-label="Close">⌄</button><b>${label}</b><span style="width:40px"></span></div><div class="erCard"></div>`;o.querySelector('.erClose').onclick=close;document.body.appendChild(o);return o.querySelector('.erCard')}
function distractors(c,n=3){return shuffle(all().filter(x=>x.h!==c.h&&x.contextMeaning!==c.contextMeaning)).slice(0,n)}
function qType(c,i){const s=S().skill?.(c.h)||{};if(i%3===0)return'pinyin';if(i%3===1)return'meaning';return'hanzi'}
let session=null;
function start(){const list=pickTen();if(!list.length){const c=shell('Cumulative review');c.innerHTML='<div class="erEyebrow">Explore review</div><div class="erTitle">Nothing to test yet</div><div class="erSub">Learn a few characters first, then come back here.</div>';return}session={list,score:0,missed:[]};render(0)}
function render(i){if(!session)return;if(i>=session.list.length)return results();const c=session.list[i],type=qType(c,i),opts=shuffle([c,...distractors(c)]),card=shell(`Question ${i+1} of ${session.list.length}`);let hero,renderOpt,fields,cls='';
 if(type==='pinyin'){hero=c.h;renderOpt=x=>x.p;fields=['recognition','sound']}
 else if(type==='meaning'){hero=c.h;renderOpt=x=>x.contextMeaning;fields=['recognition','meaning']}
 else{hero=c.contextMeaning;renderOpt=x=>x.h;fields=['recognition','meaning'];cls='word'}
 card.innerHTML=`<div class="erEyebrow">Cumulative review</div><div class="erTitle">Keep everything alive</div><div class="erSub">Randomly drawn from characters you have already seen.</div><div class="erHero ${cls}">${hero||''}</div><div class="erChoices">${opts.map(x=>`<button class="erChoice ${type==='hanzi'?'hanzi':''}" data-h="${x.h}">${renderOpt(x)||''}</button>`).join('')}</div><div class="erAnswer"><div class="erAnswerH">${c.h}</div><div class="erAnswerText"><b>${c.p||''}</b><span>${c.contextMeaning||''}</span></div></div><button class="erNext" disabled>${i===session.list.length-1?'See results':'Next'}</button>`;
 const next=card.querySelector('.erNext');card.querySelectorAll('.erChoice').forEach(b=>b.onclick=()=>{if(card.dataset.answered)return;card.dataset.answered='1';const ok=b.dataset.h===c.h;if(ok)session.score++;else session.missed.push(c);card.querySelectorAll('.erChoice').forEach(x=>{if(x.dataset.h===c.h)x.classList.add('correct');else if(x===b)x.classList.add('wrong');else x.classList.add('dim')});card.querySelector('.erAnswer').classList.add('on');next.disabled=false;S().mark?.(c,fields,ok)});next.onclick=()=>render(i+1)}
function results(){const card=shell('Review complete'),n=session.list.length;card.innerHTML=`<div class="erEyebrow">Cumulative review complete</div><div class="erTitle">${session.score===n?'Perfect recall':session.score>=Math.ceil(n*.8)?'Strong recall':'Useful check-in'}</div><div class="erScore">${session.score}/${n}</div><div class="erSub">These results update the same learning history used by Hanzi, so missed characters become more likely to reappear later.</div>${session.missed.length?`<div class="erMissed">${session.missed.map(c=>`<div class="erMiss"><b>${c.h}</b> · ${c.p}</div>`).join('')}</div>`:''}<button class="erNext">Done</button>`;card.querySelector('.erNext').onclick=close}
window.addEventListener('hanzi:data-ready',ensureUI);document.addEventListener('DOMContentLoaded',()=>setTimeout(ensureUI,100));
})();