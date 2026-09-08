/* Hanzi 2.5 — sentence renderer. Replaces generic metalinguistic fallbacks with semantic beginner examples. */
(()=>{
'use strict';
const getStore=()=>window.HanziStore;
const lib=()=>window.HanziSentenceLibrary||{};
const punctuation=/[，。！？、,.!?]/;
const neutral={们:'men',么:'me',吗:'ma',呢:'ne',的:'de',个:'ge',些:'xie',了:'le',子:'zi',友:'you',师:'shi',生:'sheng',候:'hou',欢:'huan',觉:'jiao',系:'xi'};
function pinyin(zh){
  const S=getStore(), map=S?.byH||{};
  const out=[];
  for(const ch of zh){
    if(/\s/.test(ch)||punctuation.test(ch)) continue;
    const p=neutral[ch]||map[ch]?.p||'';
    if(p) out.push(p);
  }
  return out.join(' ');
}
function rowsFor(h){
  const rows=lib()[h];
  if(!rows||!rows.length) return null;
  return rows.slice(0,3).map(([zh,py,en])=>[zh,py||pinyin(zh),en||'']);
}
function applySlide(fp){
  if(!fp?.dataset?.h||fp.dataset.semanticSentences==='1') return;
  const rows=rowsFor(fp.dataset.h), box=fp.querySelector('.sentenceExample'), next=fp.querySelector('.sentenceCycle');
  if(!rows||!box||!next) return;
  fp.dataset.semanticSentences='1';
  fp._semanticRows=rows;
  const paint=i=>{
    const r=rows[i%rows.length];
    box.dataset.i=String(i%rows.length);
    const cn=box.querySelector('.exCn'),py=box.querySelector('.exPy'),en=box.querySelector('.exEn');
    if(cn)cn.textContent=r[0]; if(py)py.textContent=r[1]; if(en)en.textContent=r[2];
    box.classList.add('hidden');
  };
  paint(0);
  next.addEventListener('click',e=>{
    e.preventDefault();e.stopImmediatePropagation();
    paint((Number(box.dataset.i)||0)+1);
  },true);
}
function scan(root=document){root.querySelectorAll?.('.fp[data-h]').forEach(applySlide)}
const obs=new MutationObserver(ms=>{for(const m of ms)for(const n of m.addedNodes)if(n.nodeType===1){if(n.matches?.('.fp[data-h]'))applySlide(n);scan(n)}});
function start(){scan();obs.observe(document.body,{childList:true,subtree:true});setTimeout(()=>{
  const S=getStore();if(!S?.ALL)return;
  const missing=[...new Set(S.ALL.map(c=>c.h))].filter(h=>!lib()[h]);
  window.HanziSentenceCoverage={total:new Set(S.ALL.map(c=>c.h)).size,missing};
  if(missing.length)console.warn('[Hanzi sentences] missing semantic examples:',missing.join(' '));
},1200)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();