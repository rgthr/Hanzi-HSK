/* HANZI PROGRESS BACKUP — 2.4.1
   Local-first export/import for hanzi_v1_state.
*/
(()=>{
'use strict';
const STATE_KEY='hanzi_v1_state';
const FORMAT='hanzi-progress';
const FORMAT_VERSION=1;

function getState(){
  try{return JSON.parse(localStorage.getItem(STATE_KEY)||'{}')}catch{return {}}
}
function validState(x){
  return !!x && typeof x==='object' && !Array.isArray(x) &&
    (!('skills' in x)||typeof x.skills==='object') &&
    (!('seen' in x)||typeof x.seen==='object') &&
    (!('mastered' in x)||typeof x.mastered==='object');
}
function backupPayload(){
  return {
    format:FORMAT,
    formatVersion:FORMAT_VERSION,
    exportedAt:new Date().toISOString(),
    state:getState()
  };
}
function filename(){
  const d=new Date(),p=n=>String(n).padStart(2,'0');
  return `hanzi-progress-${d.getFullYear()}-${p(d.getMonth()+1)}-${p(d.getDate())}.json`;
}
async function exportProgress(status){
  try{
    const text=JSON.stringify(backupPayload(),null,2);
    const file=new File([text],filename(),{type:'application/json'});
    if(navigator.share && navigator.canShare?.({files:[file]})){
      await navigator.share({files:[file],title:'Hanzi progress backup'});
      status.textContent='Backup ready — save it to Files or another safe place.';
      return;
    }
    const url=URL.createObjectURL(file),a=document.createElement('a');
    a.href=url;a.download=file.name;document.body.appendChild(a);a.click();a.remove();
    setTimeout(()=>URL.revokeObjectURL(url),1500);
    status.textContent='Progress exported.';
  }catch(e){
    if(e?.name==='AbortError')return;
    status.textContent='Could not export progress.';
  }
}
async function importFile(file,status){
  try{
    const raw=await file.text(),parsed=JSON.parse(raw);
    const incoming=parsed?.format===FORMAT?parsed.state:parsed;
    if(!validState(incoming))throw new Error('invalid backup');
    localStorage.setItem(STATE_KEY,JSON.stringify(incoming));
    status.textContent='Progress restored. Reloading…';
    setTimeout(()=>location.reload(),450);
  }catch{
    status.textContent='That file is not a valid Hanzi progress backup.';
  }
}
function install(){
  const sheet=document.querySelector('#settingsSheet .sheetCard');
  const done=document.querySelector('#doneSettings');
  if(!sheet||!done||document.querySelector('#hanziBackupSetting'))return;

  const wrap=document.createElement('div');
  wrap.id='hanziBackupSetting';
  wrap.className='setting backupSetting';
  wrap.innerHTML=`
    <div class="backupHead"><b>Progress backup</b><span>Stored on this device</span></div>
    <div class="backupActions">
      <button type="button" id="exportProgress">Export</button>
      <button type="button" id="importProgress">Import</button>
    </div>
    <div class="backupStatus" id="backupStatus" aria-live="polite"></div>
    <input id="backupFile" type="file" accept="application/json,.json" hidden>`;
  done.before(wrap);

  const style=document.createElement('style');
  style.textContent=`
    .backupSetting{display:grid!important;grid-template-columns:1fr auto;gap:9px 12px;align-items:center}
    .backupHead{display:flex;flex-direction:column;gap:3px}.backupHead span{font-size:11px;color:var(--muted)}
    .backupActions{display:flex;gap:6px}.backupActions button{height:34px;padding:0 11px;border:1px solid var(--line);background:var(--paper);border-radius:7px;font-size:11px;font-weight:700}
    .backupActions button:active{background:var(--soft)}
    .backupStatus{grid-column:1/-1;min-height:14px;font-size:10px;color:var(--muted);line-height:1.3}
  `;
  document.head.appendChild(style);

  const input=wrap.querySelector('#backupFile'),status=wrap.querySelector('#backupStatus');
  wrap.querySelector('#exportProgress').onclick=()=>exportProgress(status);
  wrap.querySelector('#importProgress').onclick=()=>input.click();
  input.onchange=()=>{const f=input.files?.[0];if(f)importFile(f,status);input.value=''};
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install,{once:true});else install();
})();