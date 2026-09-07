(()=>{
const BUILD='20260908.3';
const css=`
.buildTag{display:none!important}
#settingsSheet.sheet{align-items:flex-start!important;justify-content:flex-end!important;background:transparent!important;padding:calc(54px + env(safe-area-inset-top)) 10px 0!important}
#settingsSheet .sheetCard{width:252px!important;background:var(--paper)!important;border:1px solid var(--line)!important;border-radius:13px!important;padding:9px 12px 11px!important;box-shadow:0 14px 38px rgba(0,0,0,.16)!important}
#settingsSheet .sheetCard h2{display:none!important}
#settingsSheet .setting{padding:10px 0!important;gap:10px!important}
#settingsSheet .setting>b{font-size:13px!important}
#settingsSheet .seg{flex-shrink:0!important}
#settingsSheet #doneSettings{display:none!important}
#settingsSheet .versionRow{display:flex;align-items:center;justify-content:space-between;padding:10px 0 2px;border-top:1px solid var(--line);font-size:12px;color:var(--muted)}
#settingsSheet .versionRow b{color:var(--ink);font-weight:650}
.learnBody>.section:nth-of-type(3){flex:1!important;min-height:0!important;display:flex!important;flex-direction:column!important;overflow:hidden!important;padding-bottom:8px!important}
.learnBody>.section:nth-of-type(3)>.family{flex:1!important;min-height:0!important;overflow-y:auto!important;overscroll-behavior:contain!important;-webkit-overflow-scrolling:touch!important;touch-action:pan-y!important;padding-right:2px!important;align-content:start!important}
.learnBody>.stroke{flex:none!important;margin-top:8px!important;position:relative!important;z-index:2!important}
`;
const style=document.createElement('style');style.textContent=css;document.head.appendChild(style);
const sheet=document.getElementById('settingsSheet');
if(sheet){
  const card=sheet.querySelector('.sheetCard');
  if(card&&!card.querySelector('.versionRow')){
    const row=document.createElement('div');row.className='versionRow';row.innerHTML='<span>Version</span><b>v '+BUILD+'</b>';card.appendChild(row);
  }
  sheet.addEventListener('click',e=>{if(e.target===sheet)sheet.classList.remove('on')});
}
function toggleSettings(e){e?.preventDefault?.();e?.stopPropagation?.();if(sheet)sheet.classList.toggle('on')}
const settings=document.getElementById('settings');
const fMenu=document.getElementById('fMenu');
if(settings)settings.onclick=toggleSettings;
if(fMenu)fMenu.onclick=toggleSettings;
})();
