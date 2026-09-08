(()=>{
const BUILD='20260908.15';
const CURATED={
'呢':[['你呢？','nǐ ne','And you?'],['你在做什么呢？','nǐ zài zuò shénme ne','What are you doing?']],
'吗':[['你好吗？','nǐ hǎo ma','How are you?'],['你喜欢喝茶吗？','nǐ xǐhuan hē chá ma','Do you like drinking tea?']],
'吧':[['我们走吧。','wǒmen zǒu ba','Let’s go.'],['你先坐吧。','nǐ xiān zuò ba','Have a seat first.']],
'得':[['他说得很快。','tā shuō de hěn kuài','He speaks very quickly.'],['你做得很好。','nǐ zuò de hěn hǎo','You did very well.']],
'地':[['他慢慢地走。','tā mànmàn de zǒu','He walks slowly.']],
'过':[['我去过北京。','wǒ qù guo Běijīng','I have been to Beijing.'],['你吃过这个吗？','nǐ chī guo zhège ma','Have you eaten this before?']],
'着':[['门开着。','mén kāi zhe','The door is open.'],['他坐着看书。','tā zuò zhe kàn shū','He is reading while sitting.']],
'给':[['请给我一杯水。','qǐng gěi wǒ yì bēi shuǐ','Please give me a glass of water.'],['我给你打电话。','wǒ gěi nǐ dǎ diànhuà','I’ll call you.']],
'从':[['我从巴黎来。','wǒ cóng Bālí lái','I come from Paris.'],['从这里走。','cóng zhèlǐ zǒu','Go from here.']],
'到':[['我八点到公司。','wǒ bā diǎn dào gōngsī','I get to the office at eight.'],['你什么时候到？','nǐ shénme shíhou dào','When will you arrive?']],
'对':[['你说得对。','nǐ shuō de duì','You are right.'],['这个对我很重要。','zhège duì wǒ hěn zhòngyào','This is very important to me.']],
'比':[['他比我高。','tā bǐ wǒ gāo','He is taller than me.'],['今天比昨天冷。','jīntiān bǐ zuótiān lěng','Today is colder than yesterday.']],
'被':[['我的手机被他拿走了。','wǒ de shǒujī bèi tā ná zǒu le','My phone was taken away by him.']],
'才':[['我十点才到家。','wǒ shí diǎn cái dào jiā','I didn’t get home until ten.']],
'就':[['我马上就来。','wǒ mǎshàng jiù lái','I’ll come right away.']],
'还':[['我还没吃饭。','wǒ hái méi chīfàn','I haven’t eaten yet.'],['他还在工作。','tā hái zài gōngzuò','He is still working.']],
'又':[['他又来了。','tā yòu lái le','He came again.']],
'最':[['这个最好。','zhège zuì hǎo','This one is the best.']],
'因为':[['因为下雨，我没去。','yīnwèi xià yǔ, wǒ méi qù','I didn’t go because it was raining.']],
'所以':[['下雨了，所以我没去。','xià yǔ le, suǒyǐ wǒ méi qù','It was raining, so I didn’t go.']],
'但是':[['我很累，但是我还要工作。','wǒ hěn lèi, dànshì wǒ hái yào gōngzuò','I’m tired, but I still have to work.']],
'如果':[['如果你有时间，我们一起吃饭。','rúguǒ nǐ yǒu shíjiān, wǒmen yìqǐ chīfàn','If you have time, we can eat together.']]
};
const prev=window.examples;
function badGenerated(ex,c){const zh=(ex?.[0]||'').trim();if(!zh)return true;return zh===`这是${c.h}。`||zh===`我有${c.h}。`||/^这是[^。]{1,2}。$/.test(zh)&&zh.includes(c.h)||/^我有[^。]{1,2}。$/.test(zh)&&zh.includes(c.h)||/^这个很[^。]{1,2}。$/.test(zh)&&zh.includes(c.h)||/^今天不[^。]{1,2}。$/.test(zh)&&zh.includes(c.h)}
window.examples=function(c){
  if(CURATED[c.h])return CURATED[c.h];
  const list=prev?prev(c):[];
  const clean=(list||[]).filter(ex=>!badGenerated(ex,c)&&ex?.[0]?.includes(c.h));
  if(clean.length)return clean;
  const ctx=(c.context||'').trim();
  if(ctx&&ctx!==c.h&&ctx.length>=3&&/[。！？?!]$/.test(ctx)&&ctx.includes(c.h))return [[ctx,c.contextPinyin||'',c.contextMeaning||'']];
  return [[`这个句子里有“${c.h}”这个字。`,`zhège jùzi lǐ yǒu “${c.p}” zhège zì.`,`This sentence contains the character ${c.h}.`]];
};
const vr=document.querySelector('#settingsSheet .versionRow b');if(vr)vr.textContent='v '+BUILD;window.__hanziBuild=BUILD;
})();