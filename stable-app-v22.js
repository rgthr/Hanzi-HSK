(()=>{
const BUILD='20260908.22';
const css=document.createElement('style');css.textContent=`
/* Explore palette */
#wall .wt.ex-unseen{background:linear-gradient(145deg,#f8fafc,#edf1f5)!important;color:#2f3437!important;border-color:#e0e5ea!important}
#wall .wt.ex-learning{background:linear-gradient(145deg,#f0eaff 0%,#d7c8ff 55%,#c8b6ff 100%)!important;color:#4b2a9b!important;border-color:#bda8ff!important}
#wall .wt.ex-mastered{background:linear-gradient(145deg,#ddffe9 0%,#a9f7c8 55%,#7de7aa 100%)!important;color:#086b39!important;border-color:#74d99d!important}
#wall .wt.ex-struggle{background:linear-gradient(145deg,#ffe7f2 0%,#ffc4db 55%,#ffabc9 100%)!important;color:#96294f!important;border-color:#f597ba!important}
[data-theme=dark] #wall .wt.ex-unseen{background:linear-gradient(145deg,#24272d,#30343c)!important;color:#f2f3f5!important;border-color:#3c414a!important}
[data-theme=dark] #wall .wt.ex-learning{background:linear-gradient(145deg,#302550,#4a347d)!important;color:#e1d5ff!important;border-color:#644b9c!important}
[data-theme=dark] #wall .wt.ex-mastered{background:linear-gradient(145deg,#173e2a,#17663c)!important;color:#c2f8d6!important;border-color:#2b8b58!important}
[data-theme=dark] #wall .wt.ex-struggle{background:linear-gradient(145deg,#482233,#6b2b47)!important;color:#ffd0df!important;border-color:#88425f!important}
/* Sentence recall: one class, one delegated click, no wrapper/button. */
.sentenceExample{cursor:pointer;touch-action:manipulation;-webkit-tap-highlight-color:transparent}.sentenceExample .exPy,.sentenceExample .exEn{transition:filter .13s ease,opacity .13s ease}.sentenceExample.sentence-hidden-v22 .exPy,.sentenceExample.sentence-hidden-v22 .exEn{filter:blur(6px)!important;opacity:.34!important;user-select:none!important}.sentenceExample:not(.sentence-hidden-v22) .exPy,.sentenceExample:not(.sentence-hidden-v22) .exEn{filter:none!important;opacity:1!important}
/* Integrated six-card quiz */
.quizV22Slide .quizBody{padding-top:14px}.quizV22Slide button{touch-action:manipulation}.quizV22Slide .quizTop{font-weight:750}.quizV22Slide .quizChoice.correct{background:var(--greenSoft)!important;color:var(--green)!important;outline:2px solid color-mix(in srgb,var(--green) 45%,transparent)}.quizV22Slide .quizChoice.wrong{background:#fdeae6!important;outline:2px solid #b85c4a}.quizV22Slide .quizChoice.dim{opacity:.38}
.quizV22Connect .tripleTitle{font-size:20px;font-weight:780}.quizV22Connect .tripleSub{font-size:12px;color:var(--muted);margin:4px 0 13px}.quizV22Connect .tripleGrid{display:grid;grid-template-columns:.75fr 1fr 1.25fr;gap:7px}.quizV22Connect .tripleCol{display:flex;flex-direction:column;gap:7px}.quizV22Connect .tripleLabel{text-align:center;font-size:9px;letter-spacing:.08em;text-transform:uppercase;color:var(--muted);font-weight:750}.quizV22Connect .matchItem{min-height:55px;border:1px solid var(--line);background:var(--paper);border-radius:10px;padding:7px 5px;display:grid;place-items:center;text-align:center;font-size:12px;line-height:1.15}.quizV22Connect .matchItem.hanzi{font-family:"PingFang SC","Noto Sans CJK SC",sans-serif;font-size:30px}.quizV22Connect .matchItem.pinyin{font-size:13px;font-weight:700;color:var(--green)}.quizV22Connect .matchItem.selected{outline:2px solid #7557d6;background:#f0eaff}.quizV22Connect .matchItem.matched{background:var(--greenSoft);border-color:transparent;opacity:.58}.quizV22Connect .matchItem.wrong{background:#fdeae6;animation:q22shake .2s ease}@keyframes q22shake{25%{transform:translateX(-3px)}75%{transform:translateX(3px)}}.quizV22Connect .tripleStatus{text-align:center;font-size:11px;color:var(--muted);margin-top:11px;min-height:16px}
.quizV22Write .quizBody{justify-content:flex-start;padding-top:9px}.quizV22Write .writePrompt{text-align:center}.quizV22Write .writePrompt .meaning{font-size:28px;font-weight:780;line-height:1.08}.quizV22Write .writePrompt .pinyin{font-size:17px;color:var(--green);font-weight:700;margin-top:4px}.quizV22Write .writeCanvas{width:min(69vw,290px);aspect-ratio:1;margin:11px auto 8px;border:1px solid var(--line);border-radius:14px;background:var(--paper);position:relative;overflow:hidden;touch-action:none!important;-webkit-user-select:none;user-select:none}.quizV22Write .writeCanvas:before,.quizV22Write .writeCanvas:after{content:'';position:absolute;background:var(--line);opacity:.65;pointer-events:none;z-index:0}.quizV22Write .writeCanvas:before{width:1px;height:100%;left:50%}.quizV22Write .writeCanvas:after{height:1px;width:100%;top:50%}.quizV22Write .writeTarget{position:absolute;inset:0;z-index:1;touch-action:none!important}.quizV22Write .writeTarget svg{touch-action:none!important}.quizV22Write .writeActions{display:flex;justify-content:center;gap:8px}.quizV22Write .writeActions button{min-height:40px;border:1px solid var(--line);background:var(--paper);border-radius:9px;padding:0 13px;font:inherit;font-size:12px;font-weight:700}.quizV22Write .writeStatus{text-align:center;color:var(--muted);font-size:11px;margin-top:7px;min-height:16px}.quizV22Write .finishQuiz{display:none;margin:8px auto 0;min-height:40px;border:0;border-radius:9px;padding:0 18px;background:var(--ink);color:var(--bg);font-weight:750}.quizV22Write.done .finishQuiz{display:block}
`;
document.head.appendChild(css);

/* ---------------- Sentence reveal ---------------- */
function bindSentence(x){if(!x||x.dataset.sentenceV22)return;x.dataset.sentenceV22='1';x.classList.add('sentence-hidden-v22')}
function scanSentences(root=document){root.querySelectorAll?.('.sentenceExample').forEach(bindSentence)}
scanSentences();
new MutationObserver(ms=>ms.forEach(m=>m.addedNodes.forEach(n=>{if(n.nodeType!==1)return;if(n.matches?.('.sentenceExample'))bindSentence(n);scanSentences(n)}))).observe(document.body,{childList:true,subtree:true});
document.addEventListener('click',e=>{
  const next=e.target.closest?.('[data-next-sentence]');
  if(next){setTimeout(()=>{const x=next.closest('.fp')?.querySelector('.sentenceExample');if(x)x.classList.add('sentence-hidden-v22')},0);return}
  const x=e.target.closest?.('.sentenceExample');if(!x)return;
  e.preventDefault();e.stopPropagation();x.classList.toggle('sentence-hidden-v22');
},false);

/* ---------------- Quiz state helpers ---------------- */
function chars(){try{return focusSet.slice(0,6).filter(Boolean)}catch{return []}}
function shuffle(a){return [...a].sort(()=>Math.random()-.5)}
function record(c,fields,ok){if(!c)return;try{const s=sk(c.h);state.seen[c.h]=1;s.exposures=(s.exposures||0)+1;s.last=Date.now();if(ok)fields.forEach(f=>s[f]=Math.min(5,(s[f]||0)+1));else s.mistakes=(s.mistakes||0)+1;mastery(c);save();progress()}catch{}}
function distractors(c,n=3){try{return shuffle(ALL.filter(x=>x.h!==c.h&&x.contextMeaning!==c.contextMeaning)).slice(0,n)}catch{return []}}
function feedback(slide,c){const fb=slide.querySelector('.quizFeedback');if(fb){fb.classList.add('on');fb.querySelector('.feedbackChar').textContent=c.h;fb.querySelector('.feedbackText b').textContent=c.p||'';fb.querySelector('.feedbackText span').textContent=c.contextMeaning||''}}

function recallSlide(c,type,i){
 const slide=document.createElement('div');slide.className='fp quizSlide quizV22Slide';slide.dataset.quizV22='recall';
 const opts=shuffle([c,...distractors(c)]);let prompt,hero,heroClass,render,fields;
 if(type==='meaning'){prompt='What does this character mean?';hero=c.h;heroClass='char';render=x=>x.contextMeaning;fields=['recognition','meaning']}
 else if(type==='pinyin'){prompt='Which pinyin matches this character?';hero=c.h;heroClass='char';render=x=>x.p;fields=['recognition','sound']}
 else{prompt='Which character means this?';hero=c.contextMeaning;heroClass='word';render=x=>x.h;fields=['recognition','meaning']}
 slide.innerHTML=`<div class="card"><div class="quizTop">TEST · ${i+1}/6</div><div class="quizBody"><div class="quizPrompt">${prompt}</div><div class="quizHero ${heroClass}">${hero}</div><div class="quizChoices">${opts.map(x=>`<button class="quizChoice ${type==='hanzi'?'charChoice':''}" data-h="${x.h}" data-ok="${x.h===c.h}">${render(x)}</button>`).join('')}</div><div class="quizFeedback"><div class="feedbackChar"></div><div class="feedbackText"><b></b><span></span></div></div><div class="quizHint">Choose an answer</div></div></div>`;
 slide.addEventListener('click',e=>{const b=e.target.closest('.quizChoice');if(!b||slide.dataset.answered)return;e.preventDefault();e.stopPropagation();const ok=b.dataset.ok==='true';slide.dataset.answered='1';slide.querySelectorAll('.quizChoice').forEach(x=>{if(x.dataset.ok==='true')x.classList.add('correct');else if(x===b)x.classList.add('wrong');else x.classList.add('dim')});feedback(slide,c);slide.querySelector('.quizHint').textContent='Swipe to continue';record(c,fields,ok)},false);
 return slide;
}

function connectSlide(set){
 const chosen=shuffle(set).slice(0,3),hz=shuffle(chosen),py=shuffle(chosen),en=shuffle(chosen);const slide=document.createElement('div');slide.className='fp quizSlide quizV22Slide quizV22Connect';slide.dataset.quizV22='connect';
 slide.innerHTML=`<div class="card"><div class="quizTop">TEST · 5/6</div><div class="quizBody"><div class="tripleTitle">Connect the three</div><div class="tripleSub">Match 3 Hanzi with their pinyin and meaning.</div><div class="tripleGrid"><div class="tripleCol"><div class="tripleLabel">Hanzi</div>${hz.map(c=>`<button class="matchItem hanzi" data-h="${c.h}" data-k="h">${c.h}</button>`).join('')}</div><div class="tripleCol"><div class="tripleLabel">Pinyin</div>${py.map(c=>`<button class="matchItem pinyin" data-h="${c.h}" data-k="p">${c.p}</button>`).join('')}</div><div class="tripleCol"><div class="tripleLabel">Meaning</div>${en.map(c=>`<button class="matchItem" data-h="${c.h}" data-k="m">${c.contextMeaning||''}</button>`).join('')}</div></div><div class="tripleStatus">Tap one item in each column</div></div></div>`;
 let selected={};const status=slide.querySelector('.tripleStatus');
 slide.addEventListener('click',e=>{const b=e.target.closest('.matchItem');if(!b||b.classList.contains('matched'))return;e.preventDefault();e.stopPropagation();slide.querySelectorAll(`.matchItem[data-k="${b.dataset.k}"]`).forEach(x=>x.classList.remove('selected'));b.classList.add('selected');selected[b.dataset.k]=b;if(!(selected.h&&selected.p&&selected.m))return;const a=[selected.h,selected.p,selected.m],ok=a.every(x=>x.dataset.h===a[0].dataset.h);if(ok){a.forEach(x=>{x.classList.remove('selected');x.classList.add('matched')});const c=chosen.find(x=>x.h===a[0].dataset.h);record(c,['recognition','sound','meaning'],true);selected={};if(!slide.querySelector('.matchItem:not(.matched)')){slide.dataset.answered='1';status.textContent='All 3 connected ✓ · swipe to continue'}else status.textContent='Correct — keep going';}else{const hs=[...new Set(a.map(x=>x.dataset.h))];hs.forEach(h=>record(chosen.find(x=>x.h===h),[],false));a.forEach(x=>{x.classList.add('wrong');setTimeout(()=>x.classList.remove('wrong','selected'),240)});selected={};status.textContent='Not quite — try again'}},false);
 return slide;
}

function writingSlide(c){
 const slide=document.createElement('div');slide.className='fp quizSlide quizV22Slide quizV22Write';slide.dataset.quizV22='write';slide.innerHTML=`<div class="card"><div class="quizTop">TEST · 6/6</div><div class="quizBody"><div class="writePrompt"><div class="meaning">${c.contextMeaning||''}</div><div class="pinyin">${c.p||''}</div></div><div class="writeCanvas"><div class="writeTarget"></div></div><div class="writeActions"><button type="button" data-model>Show model</button><button type="button" data-restart>Start over</button></div><div class="writeStatus">Write the character from memory in the correct stroke order.</div><button type="button" class="finishQuiz">Finish quiz</button></div></div>`;
 const box=slide.querySelector('.writeCanvas'),target=slide.querySelector('.writeTarget'),status=slide.querySelector('.writeStatus'),modelBtn=slide.querySelector('[data-model]');let model=false,writerLocal=null;
 ['touchstart','touchmove','touchend','pointerdown','pointermove','pointerup'].forEach(t=>box.addEventListener(t,e=>{e.stopPropagation();if(t==='touchmove')e.preventDefault()},{passive:false}));
 function start(){target.innerHTML='';slide.classList.remove('done');if(typeof HanziWriter==='undefined'){status.textContent='Stroke practice needs internet the first time it loads.';return}const z=Math.floor(box.getBoundingClientRect().width);if(!z){setTimeout(start,60);return}writerLocal=HanziWriter.create(target,c.h,{width:z,height:z,padding:24,showOutline:model,showCharacter:false,drawingWidth:22});status.textContent=model?'Model visible — follow the correct order.':'Write the character from memory in the correct stroke order.';writerLocal.quiz({showHintAfterMisses:1,highlightOnComplete:true,onCorrectStroke:d=>status.textContent=d.strokesRemaining?`${d.strokesRemaining} stroke${d.strokesRemaining===1?'':'s'} left`:'Finishing…',onComplete:()=>{slide.dataset.answered='1';slide.classList.add('done');status.textContent='Correct stroke order ✓';record(c,['writing'],true)}})}
 modelBtn.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();model=!model;modelBtn.textContent=model?'Hide model':'Show model';start()});slide.querySelector('[data-restart]').addEventListener('click',e=>{e.preventDefault();e.stopPropagation();start()});slide.querySelector('.finishQuiz').addEventListener('click',e=>{e.preventDefault();e.stopPropagation();try{closeFocus();nextBoard()}catch{}});slide._initWriting=()=>requestAnimationFrame(()=>setTimeout(start,50));return slide;
}

function installQuiz(){
 const pager=document.getElementById('pager');if(!pager||pager.dataset.buildingV22==='1')return;if(pager.querySelector('.quizV22Slide'))return;
 const base=[...pager.querySelectorAll('.quizSlide')];if(base.length<4)return;const set=chars();if(set.length<6)return;
 pager.dataset.buildingV22='1';base.forEach(x=>x.remove());
 const order=shuffle(set),slides=[recallSlide(order[0],'meaning',0),recallSlide(order[1],'hanzi',1),recallSlide(order[2],'pinyin',2),recallSlide(order[3],'meaning',3),connectSlide(set),writingSlide(order[4])];slides.forEach(s=>pager.appendChild(s));slides[5]._initWriting?.();pager.dataset.buildingV22='0';
}
const pager=document.getElementById('pager');if(pager){new MutationObserver(()=>setTimeout(installQuiz,0)).observe(pager,{childList:true});pager.addEventListener('scroll',()=>{requestAnimationFrame(()=>{const i=Math.round(pager.scrollLeft/Math.max(1,pager.clientWidth));if(i>=chars().length){const c=document.getElementById('count');if(c)c.textContent=`Quiz ${i-chars().length+1} of 6`}})},{passive:true})}
setTimeout(installQuiz,500);
const vr=document.querySelector('#settingsSheet .versionRow b');if(vr)vr.textContent='v '+BUILD;window.__hanziBuild=BUILD;
})();