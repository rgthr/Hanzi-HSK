(()=>{
const BUILD='20260908.11';
const css=document.createElement('style');css.textContent=`
/* Explore progression: readable tonal gradients instead of flat yellow/green/red fills. */
#wall .wt{position:relative;overflow:hidden;isolation:isolate;transition:transform .16s ease,border-color .16s ease,background .16s ease,color .16s ease}
#wall .wt:before{content:'';position:absolute;inset:0;z-index:-1;pointer-events:none}
#wall .wt.ex-unseen{background:linear-gradient(145deg,var(--paper) 0%,color-mix(in srgb,var(--soft) 72%,var(--paper)) 100%)!important;color:var(--ink)!important;border-color:var(--line)!important}
#wall .wt.ex-unseen:before{background:linear-gradient(135deg,transparent 58%,color-mix(in srgb,var(--muted) 7%,transparent) 100%)}
#wall .wt.ex-learning{background:linear-gradient(145deg,#fff8ee 0%,#f1e4ca 100%)!important;color:#5c4522!important;border-color:#d9c39b!important}
#wall .wt.ex-learning:before{background:linear-gradient(135deg,rgba(255,255,255,.36) 0%,transparent 48%,rgba(148,103,38,.07) 100%)}
#wall .wt.ex-mastered{background:linear-gradient(145deg,#eff8f4 0%,#cfe5db 100%)!important;color:#1f5848!important;border-color:#a8cfc0!important}
#wall .wt.ex-mastered:before{background:linear-gradient(135deg,rgba(255,255,255,.38) 0%,transparent 48%,rgba(47,111,94,.08) 100%)}
#wall .wt.ex-struggle{background:linear-gradient(145deg,#fff1ee 0%,#efd2ca 100%)!important;color:#7d382e!important;border-color:#dfb2a8!important}
#wall .wt.ex-struggle:before{background:linear-gradient(135deg,rgba(255,255,255,.35) 0%,transparent 48%,rgba(147,72,58,.08) 100%)}
[data-theme=dark] #wall .wt.ex-unseen{background:linear-gradient(145deg,#232323 0%,#2b2b2b 100%)!important;color:#deddda!important;border-color:#383838!important}
[data-theme=dark] #wall .wt.ex-learning{background:linear-gradient(145deg,#3a3225 0%,#4a3c27 100%)!important;color:#f1d9a8!important;border-color:#5f4e31!important}
[data-theme=dark] #wall .wt.ex-mastered{background:linear-gradient(145deg,#20312b 0%,#29483e 100%)!important;color:#a9d7c4!important;border-color:#365d50!important}
[data-theme=dark] #wall .wt.ex-struggle{background:linear-gradient(145deg,#3a2825 0%,#4e312d 100%)!important;color:#efb5aa!important;border-color:#684039!important}
`;
document.head.appendChild(css);
const vr=document.querySelector('#settingsSheet .versionRow b');if(vr)vr.textContent='v '+BUILD;window.__hanziBuild=BUILD;
})();