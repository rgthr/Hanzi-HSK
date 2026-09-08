(()=>{
const BUILD='20260908.12';
const css=document.createElement('style');css.textContent=`
/* Related shapes: compact, centered, no dead space */
.learnBody>.section:nth-of-type(3){padding-top:8px!important;padding-bottom:6px!important}
.learnBody>.section:nth-of-type(3)>.lab{margin-bottom:5px!important}
.learnBody>.section:nth-of-type(3)>.family{display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:5px!important;align-content:start!important;padding-right:0!important}
.family button{min-width:0!important;min-height:48px!important;height:48px!important;padding:3px 7px!important;display:grid!important;grid-template-columns:38px minmax(0,1fr)!important;grid-template-rows:18px 18px!important;column-gap:6px!important;align-items:center!important;justify-items:start!important;text-align:left!important;border-radius:8px!important;overflow:hidden!important}
.family .fh{grid-column:1!important;grid-row:1/3!important;width:38px!important;display:flex!important;align-items:center!important;justify-content:center!important;font-size:32px!important;line-height:1!important;margin:0!important;padding:0!important}
.family .fpinyin{grid-column:2!important;grid-row:1!important;align-self:end!important;width:100%!important;font-size:13px!important;line-height:1!important;margin:0!important;padding:0!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important}
.family .fmeaning{grid-column:2!important;grid-row:2!important;align-self:start!important;width:100%!important;font-size:11.5px!important;line-height:1!important;margin:1px 0 0!important;padding:0!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important}
@media(max-height:820px){.family button{height:44px!important;min-height:44px!important;grid-template-columns:35px minmax(0,1fr)!important;grid-template-rows:17px 17px!important}.family .fh{width:35px!important;font-size:30px!important}.family .fpinyin{font-size:12.5px!important}.family .fmeaning{font-size:11px!important}}
`;
document.head.appendChild(css);
const vr=document.querySelector('#settingsSheet .versionRow b');if(vr)vr.textContent='v '+BUILD;window.__hanziBuild=BUILD;
})();