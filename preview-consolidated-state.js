/* HANZI CONSOLIDATED STATE
   Version: CONSOLIDATED 2.2.0
   Branch: clean-consolidation
   Sole responsibilities: dataset loading, persisted state, mastery helpers, theme/audio state.
   Storage keys are intentionally identical to main so progress is preserved.
*/
(()=>{
'use strict';
const STATE_KEY='hanzi_v1_state';
const DATA_KEY='hanzi_hsk1_dataset_v1';
const DATA_URL='https://raw.githubusercontent.com/rgthr/Hanzi-HSK/935c9a7580e08663a69682c1c004209b688bc88f/index.html';
const defaults={skills:{},seen:{},mastered:{},theme:'system',audio:true,board:[],learnedSinceQuiz:0,lessonCheckpoints:{}};
let state;
try{state=Object.assign({},defaults,JSON.parse(localStorage.getItem(STATE_KEY)||'{}'))}catch{state={...defaults}}
state.skills=state.skills||{};state.seen=state.seen||{};state.mastered=state.mastered||{};
let ALL=[],byH={};
function save(){localStorage.setItem(STATE_KEY,JSON.stringify(state))}
function skill(h){return state.skills[h]||(state.skills[h]={recognition:0,meaning:0,sound:0,writing:0,exposures:0,mistakes:0,last:0,due:0})}
function mastery(c){const s=skill(c.h);if(s.recognition>=3&&s.meaning>=3)state.mastered[c.h]=1}
function mark(c,fields=[],ok=true){if(!c)return;state.seen[c.h]=1;const s=skill(c.h);s.exposures=(s.exposures||0)+1;s.last=Date.now();if(ok){for(const f of fields)s[f]=Math.min(5,(s[f]||0)+1)}else{s.mistakes=(s.mistakes||0)+1}mastery(c);save();window.dispatchEvent(new CustomEvent('hanzi:state'))}
function expose(c){if(!c)return;if(!state.seen[c.h]){state.seen[c.h]=1;state.learnedSinceQuiz=(state.learnedSinceQuiz||0)+1}const s=skill(c.h);s.exposures=(s.exposures||0)+1;s.last=Date.now();save();window.dispatchEvent(new CustomEvent('hanzi:state'))}
function level(c){if(state.mastered[c.h])return'mastered';if(state.seen[c.h])return'learning';return'new'}
function resolvedTheme(){return state.theme==='system'?(matchMedia('(prefers-color-scheme:dark)').matches?'dark':'light'):state.theme}
function applyTheme(){document.documentElement.dataset.theme=resolvedTheme()}
function migrateLessonCheckpoints(){if(state.lessonCheckpoints&&Object.keys(state.lessonCheckpoints).length)return;state.lessonCheckpoints={};for(let i=0;i<ALL.length;i+=12){const lesson=i/12+1,block=ALL.slice(i,i+12),first=block.slice(0,6),second=block.slice(6,12);let cp=0;if(first.length&&first.every(c=>state.seen?.[c.h]))cp=1;if(second.length&&second.every(c=>state.seen?.[c.h]))cp=2;if(cp)state.lessonCheckpoints[lesson]=cp}save()}
async function loadDataset(){
  let raw=localStorage.getItem(DATA_KEY);
  if(raw){try{ALL=JSON.parse(raw)}catch{raw=null}}
  if(!raw){
    const text=await fetch(DATA_URL,{cache:'force-cache'}).then(r=>{if(!r.ok)throw new Error('dataset '+r.status);return r.text()});
    const m=text.match(/const ALL=(\[[\s\S]*?\]);\s*const TOTAL/);if(!m)throw new Error('dataset parse');
    ALL=JSON.parse(m[1]);localStorage.setItem(DATA_KEY,JSON.stringify(ALL));
  }
  byH=Object.fromEntries(ALL.map(c=>[c.h,c]));
  migrateLessonCheckpoints();
  API.ALL=ALL;API.byH=byH;
  window.dispatchEvent(new CustomEvent('hanzi:data-ready'));
  return ALL;
}
function speak(c){if(!state.audio||!c)return;try{const u=new SpeechSynthesisUtterance(c.h);u.lang='zh-CN';u.rate=.72;speechSynthesis.cancel();speechSynthesis.speak(u);mark(c,['sound'],true)}catch{}}
const API={STATE_KEY,DATA_KEY,state,ALL,byH,save,skill,mastery,mark,expose,level,applyTheme,resolvedTheme,loadDataset,speak,getChar:h=>byH[h]};
window.HanziStore=API;applyTheme();
})();