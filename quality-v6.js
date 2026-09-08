(()=>{
const BUILD='20260908.6';
const SPECIAL={
'的':[['这是我的书。','zhè shì wǒ de shū','This is my book.'],['那是他的手机。','nà shì tā de shǒujī','That is his phone.']],
'了':[['我吃饭了。','wǒ chīfàn le','I ate.'],['下雨了。','xià yǔ le','It started raining.']],
'和':[['我和你一起去。','wǒ hé nǐ yìqǐ qù','You and I will go together.'],['茶和咖啡都可以。','chá hé kāfēi dōu kěyǐ','Tea and coffee are both fine.']],
'也':[['我也喜欢。','wǒ yě xǐhuan','I like it too.'],['他也是学生。','tā yě shì xuésheng','He is also a student.']],
'都':[['我们都来了。','wǒmen dōu lái le','We all came.'],['他们都很好。','tāmen dōu hěn hǎo','They are all well.']],
'很':[['今天很好。','jīntiān hěn hǎo','Today is very good.'],['她很忙。','tā hěn máng','She is very busy.']],
'太':[['太好了！','tài hǎo le','Great!'],['今天太热了。','jīntiān tài rè le','It is too hot today.']],
'再':[['明天再说。','míngtiān zài shuō','We can talk about it tomorrow.'],['请再说一次。','qǐng zài shuō yí cì','Please say it again.']],
'没':[['我没时间。','wǒ méi shíjiān','I do not have time.'],['他没来。','tā méi lái','He did not come.']],
'会':[['我会说中文。','wǒ huì shuō Zhōngwén','I can speak Chinese.'],['明天会下雨。','míngtiān huì xià yǔ','It will rain tomorrow.']],
'能':[['我能进去吗？','wǒ néng jìnqù ma','Can I go in?'],['你能帮我吗？','nǐ néng bāng wǒ ma','Can you help me?']],
'请':[['请坐。','qǐng zuò','Please sit.'],['请给我一杯水。','qǐng gěi wǒ yì bēi shuǐ','Please give me a glass of water.']],
'这':[['这是我的。','zhè shì wǒ de','This is mine.'],['这个很好。','zhège hěn hǎo','This one is good.']],
'那':[['那是我朋友。','nà shì wǒ péngyou','That is my friend.'],['那个多少钱？','nàge duōshao qián','How much is that one?']],
'哪':[['你去哪儿？','nǐ qù nǎr','Where are you going?'],['你喜欢哪个？','nǐ xǐhuan nǎge','Which one do you like?']],
'谁':[['他是谁？','tā shì shéi','Who is he?'],['你在等谁？','nǐ zài děng shéi','Who are you waiting for?']],
'什么':[['你想吃什么？','nǐ xiǎng chī shénme','What do you want to eat?']],
'几':[['你几岁？','nǐ jǐ suì','How old are you?'],['现在几点？','xiànzài jǐ diǎn','What time is it now?']],
'多':[['这里人很多。','zhèlǐ rén hěn duō','There are many people here.'],['你多大？','nǐ duō dà','How old are you?']],
'少':[['今天人很少。','jīntiān rén hěn shǎo','There are few people today.'],['少一点儿。','shǎo yìdiǎnr','A little less.']],
'上':[['书在桌子上。','shū zài zhuōzi shàng','The book is on the table.'],['我八点上班。','wǒ bā diǎn shàngbān','I start work at eight.']],
'下':[['猫在桌子下。','māo zài zhuōzi xià','The cat is under the table.'],['我下午回家。','wǒ xiàwǔ huí jiā','I go home in the afternoon.']],
'里':[['我在家里。','wǒ zài jiālǐ','I am at home.'],['包里有水。','bāo lǐ yǒu shuǐ','There is water in the bag.']],
'前':[['我在你前面。','wǒ zài nǐ qiánmiàn','I am in front of you.']],
'后':[['他在我后面。','tā zài wǒ hòumiàn','He is behind me.']],
'中':[['我住在中国。','wǒ zhù zài Zhōngguó','I live in China.'],['杯子在中间。','bēizi zài zhōngjiān','The cup is in the middle.']],
'国':[['他是中国人。','tā shì Zhōngguó rén','He is Chinese.']],
'家':[['我在家。','wǒ zài jiā','I am at home.'],['我家有三个人。','wǒ jiā yǒu sān ge rén','There are three people in my family.']],
'书':[['我晚上看书。','wǒ wǎnshang kàn shū','I read in the evening.'],['这本书很好。','zhè běn shū hěn hǎo','This book is good.']],
'钱':[['这个多少钱？','zhège duōshao qián','How much is this?']],
'茶':[['我喜欢喝茶。','wǒ xǐhuan hē chá','I like drinking tea.']],
'饭':[['我们去吃饭吧。','wǒmen qù chīfàn ba','Let’s go eat.']],
'车':[['我坐车去公司。','wǒ zuò chē qù gōngsī','I go to work by car.']],
'店':[['这家店很好。','zhè jiā diàn hěn hǎo','This shop is good.']],
'天':[['今天天气很好。','jīntiān tiānqì hěn hǎo','The weather is very nice today.']],
'年':[['我去年去了中国。','wǒ qùnián qù le Zhōngguó','I went to China last year.']],
'月':[['下个月见。','xià ge yuè jiàn','See you next month.']],
'日':[['今天是八月八日。','jīntiān shì bā yuè bā rì','Today is August 8.']],
'点':[['现在几点？','xiànzài jǐ diǎn','What time is it now?']],
'时':[['你什么时候来？','nǐ shénme shíhou lái','When are you coming?']]
};
const previousExamples=window.examples;
function smartFallback(c){
  if(c.context&&c.context!==c.h)return [[c.context,c.contextPinyin||c.p,c.contextMeaning||'']];
  const m=(c.contextMeaning||'').trim();
  const low=m.toLowerCase();
  if(/^to\s+/.test(low)){
    const verb=m.replace(/^to\s+/i,'');
    return [[`我想${c.h}。`,`wǒ xiǎng ${c.p}.`,`I want to ${verb}.`],[`你会${c.h}吗？`,`nǐ huì ${c.p} ma`,`Can you ${verb}?`]];
  }
  const ADJ='大小多少好坏冷热高低快慢长短新老白黑红忙累近远贵便宜难容易'.split('');
  if(ADJ.includes(c.h))return [[`这个很${c.h}。`,`zhège hěn ${c.p}.`,`This is very ${m}.`],[`今天不${c.h}。`,`jīntiān bù ${c.p}.`,`Today it is not ${m}.`]];
  return [[`这是${c.h}。`,`zhè shì ${c.p}.`,`This is ${m}.`],[`我有${c.h}。`,`wǒ yǒu ${c.p}.`,`I have ${m}.`]];
}
window.examples=function(c){
  if(SPECIAL[c.h])return SPECIAL[c.h];
  const old=previousExamples?previousExamples(c):null;
  if(old&&old.length&&!(old.length===1&&/^我认识/.test(old[0][0]||'')))return old;
  return smartFallback(c);
};

const css=document.createElement('style');
css.textContent=`
.canvas{transition:box-shadow .18s ease,transform .18s ease}
.canvas.strokePulse{box-shadow:0 0 0 6px color-mix(in srgb,var(--green) 16%,transparent),0 0 24px color-mix(in srgb,var(--green) 18%,transparent)}
.canvas.charPulse{box-shadow:0 0 0 8px color-mix(in srgb,var(--green) 22%,transparent),0 0 34px color-mix(in srgb,var(--green) 26%,transparent);transform:scale(1.012)}
`;
document.head.appendChild(css);
function pulse(done=false){const c=document.querySelector('#strokePane .canvas');if(!c)return;c.classList.remove('strokePulse','charPulse');void c.offsetWidth;c.classList.add(done?'charPulse':'strokePulse');setTimeout(()=>c.classList.remove('strokePulse','charPulse'),done?520:260)}
window.strokeQuiz=function(c){
  const t=document.getElementById('target'),box=t.parentElement;t.innerHTML='';
  if(typeof HanziWriter==='undefined'){document.getElementById('strokeStatus').textContent='Stroke data needs internet.';return}
  const z=Math.floor(box.clientWidth);
  writer=HanziWriter.create(t,c.h,{width:z,height:z,padding:26,showOutline:true,showCharacter:false,drawingWidth:7});
  document.getElementById('strokeStatus').textContent='Start with the first stroke.';
  writer.quiz({showHintAfterMisses:1,highlightOnComplete:true,onCorrectStroke:d=>{document.getElementById('strokeStatus').textContent=d.strokesRemaining?`${d.strokesRemaining} stroke${d.strokesRemaining===1?'':'s'} left`:'Finishing…';pulse(false)},onComplete:()=>{document.getElementById('strokeStatus').textContent='Character complete ✓';pulse(true);bump(c,'writing',true)}})
};

let sx=0,sy=0,startInCanvas=false;
const pane=document.getElementById('strokePane');
if(pane){
  pane.addEventListener('touchstart',e=>{const t=e.touches[0];if(!t)return;sx=t.clientX;sy=t.clientY;startInCanvas=!!e.target.closest?.('.canvas')},{passive:true});
  pane.addEventListener('touchend',e=>{if(startInCanvas)return;const t=e.changedTouches[0];if(!t)return;const dx=t.clientX-sx,dy=t.clientY-sy;if(dy>65&&Math.abs(dy)>Math.abs(dx)*1.2){pane.classList.remove('on');const target=document.getElementById('target');if(target)target.innerHTML=''}},{passive:true});
}

let lastTouch=0;
function changeSentence(btn){const fp=btn.closest('.fp[data-h]');if(!fp)return;const c=byH[fp.dataset.h];if(!c)return;const list=examples(c);if(!list||list.length<2)return;const wrap=fp.querySelector('.sentenceExample');if(!wrap)return;const idx=(Number(wrap.dataset.sentenceIndex||0)+1)%list.length,ex=list[idx];wrap.dataset.sentenceIndex=idx;wrap.querySelector('.exCn').textContent=ex[0]||'';wrap.querySelector('.exPy').textContent=ex[1]||'';wrap.querySelector('.exEn').textContent=ex[2]||'';}
function activate(e){const sentence=e.target.closest?.('[data-next-sentence]');const stroke=e.target.closest?.('[data-stroke]');if(!sentence&&!stroke)return false;e.preventDefault();e.stopPropagation();if(sentence)changeSentence(sentence);if(stroke){const fp=stroke.closest('.fp[data-h]'),c=fp&&byH[fp.dataset.h];if(c)openStroke(c)}return true}
document.addEventListener('touchend',e=>{if(activate(e))lastTouch=Date.now()},{capture:true,passive:false});
document.addEventListener('click',e=>{if(Date.now()-lastTouch<650)return;activate(e)},true);

const vr=document.querySelector('#settingsSheet .versionRow b');if(vr)vr.textContent='v '+BUILD;
window.__hanziBuild=BUILD;
})();