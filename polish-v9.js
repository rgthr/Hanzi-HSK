(()=>{
const BUILD='20260908.9';
const css=document.createElement('style');css.textContent=`
/* Related shapes: denser without shrinking the useful information */
.family{gap:6px!important}.family button{min-height:56px!important;height:56px!important;padding:5px 8px!important;column-gap:7px!important;border-radius:9px!important}.family .fh{font-size:34px!important;line-height:1!important}.family .fpinyin{font-size:14px!important;line-height:1.05!important}.family .fmeaning{font-size:12px!important;line-height:1.05!important}
/* Explore progress colours — actual explore tiles are .wt */
.wt.ex-unseen{background:var(--paper)!important;color:var(--muted)!important}.wt.ex-learning{background:#fff4cf!important;color:var(--ink)!important;border-color:#ead9a5!important}.wt.ex-mastered{background:var(--greenSoft)!important;color:var(--green)!important;border-color:color-mix(in srgb,var(--green) 24%,var(--line))!important}.wt.ex-struggle{background:#fbe8e3!important;color:#93483a!important;border-color:#edc5bb!important}
`;
document.head.appendChild(css);

/* Replace unsafe generic sentence fallbacks with grammatically safe examples. */
const pronouns={
'他':[['他是我的朋友。','tā shì wǒ de péngyou','He is my friend.'],['他今天不在。','tā jīntiān bú zài','He is not here today.']],
'她':[['她是我的朋友。','tā shì wǒ de péngyou','She is my friend.'],['她在北京工作。','tā zài Běijīng gōngzuò','She works in Beijing.']],
'它':[['它很小。','tā hěn xiǎo','It is small.']],
'我们':[['我们一起去。','wǒmen yìqǐ qù','Let’s go together.']],
'你们':[['你们好吗？','nǐmen hǎo ma','How are you all?']],
'他们':[['他们都是学生。','tāmen dōu shì xuésheng','They are all students.']],
'她们':[['她们都来了。','tāmen dōu lái le','They all came.']]
};
const prevExamples=window.examples;
window.examples=function(c){
  if(pronouns[c.h])return pronouns[c.h];
  const old=prevExamples?prevExamples(c):null;
  if(old&&old.length){
    const bad=old.some(ex=>/^我有(?:他|她|它|你|我|我们|你们|他们|她们)[。！？，]?/.test(ex?.[0]||''));
    if(!bad)return old;
  }
  if(c.context&&c.context!==c.h)return [[c.context,c.contextPinyin||c.p,c.contextMeaning||'']];
  return [[`这个字是“${c.h}”。`,`zhège zì shì “${c.p}”.`,`This character is ${c.h}.`]];
};

function recolorExplore(){
  document.querySelectorAll('#wall .wt[data-w]').forEach(el=>{
    const h=el.dataset.w,s=state.skills?.[h]||{};el.classList.remove('ex-unseen','ex-learning','ex-mastered','ex-struggle');
    if(state.mastered?.[h])el.classList.add('ex-mastered');
    else if((s.mistakes||0)>=2)el.classList.add('ex-struggle');
    else if(state.seen?.[h])el.classList.add('ex-learning');
    else el.classList.add('ex-unseen');
  });
}
const wall=document.getElementById('wall');if(wall)new MutationObserver(recolorExplore).observe(wall,{childList:true,subtree:true});setTimeout(recolorExplore,200);

/* Hanzi Writer: drawingWidth belongs on the writer config, not quiz config. Make the user's trace nearly as substantial as the model strokes. */
window.strokeQuiz=function(c){
  const t=document.getElementById('target'),box=t&&t.parentElement;if(!t||!box)return;t.innerHTML='';
  if(typeof HanziWriter==='undefined'){document.getElementById('strokeStatus').textContent='Stroke data needs internet.';return}
  const z=Math.floor(box.clientWidth);
  writer=HanziWriter.create(t,c.h,{width:z,height:z,padding:26,showOutline:true,showCharacter:false,drawingWidth:22});
  document.getElementById('strokeStatus').textContent='Start with the first stroke.';
  writer.quiz({showHintAfterMisses:1,highlightOnComplete:true,onCorrectStroke:d=>{document.getElementById('strokeStatus').textContent=d.strokesRemaining?`${d.strokesRemaining} stroke${d.strokesRemaining===1?'':'s'} left`:'Finishing…'},onComplete:()=>{document.getElementById('strokeStatus').textContent='Character complete ✓';bump(c,'writing',true)}});
};

const vr=document.querySelector('#settingsSheet .versionRow b');if(vr)vr.textContent='v '+BUILD;window.__hanziBuild=BUILD;
})();