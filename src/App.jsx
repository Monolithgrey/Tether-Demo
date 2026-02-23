import { useState, useEffect, useRef, useMemo } from "react";

/* ═══════════════════════════════════════════
   TETHER — AI-Powered Access Intelligence
   V8 — Theatrical + Mobile-First
   ═══════════════════════════════════════════ */

/* Responsive hook */
function useM(){
  const[w,setW]=useState(typeof window!=='undefined'?window.innerWidth:1200);
  useEffect(()=>{const h=()=>setW(window.innerWidth);window.addEventListener('resize',h);return()=>window.removeEventListener('resize',h)},[]);
  return{mob:w<640,tab:w<900,w};
}

/* Global responsive CSS injection */
const RCSS=`
input[type=range]{-webkit-appearance:none;appearance:none;background:transparent;cursor:pointer}
input[type=range]::-webkit-slider-runnable-track{height:44px;background:transparent}
input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:44px;height:44px;background:transparent;cursor:pointer}
input[type=range]::-moz-range-track{height:44px;background:transparent}
input[type=range]::-moz-range-thumb{width:44px;height:44px;background:transparent;border:none;cursor:pointer}
`;

const C={
  bg:"#F1F5F9",sf:"#FFFFFF",sa:"#E2E8F0",sh:"#F8FAFC",
  b:"#CBD5E1",bl:"#E2E8F0",bd:"#94A3B8",
  k:"#0F172A",km:"#334155",ks:"#64748B",kf:"#94A3B8",kg:"#CBD5E1",
  t:"#0D9488",tb:"#F0FDFA",tc:"#99F6E4",td:"#115E59",
  a:"#D97706",ab:"#FFFBEB",ac:"#FDE68A",ad:"#92400E",
  r:"#DC2626",rb:"#FEF2F2",rc:"#FECACA",
  s:"#2563EB",sb:"#EFF6FF",sc:"#BFDBFE",
};
const sh1="0 1px 3px rgba(15,23,42,.06), 0 2px 6px rgba(15,23,42,.04)";
const sh2="0 2px 8px rgba(15,23,42,.06), 0 8px 24px rgba(15,23,42,.08)";
const sh3="0 4px 12px rgba(15,23,42,.06), 0 16px 40px rgba(15,23,42,.1)";

const dp=`'Instrument Serif','Georgia',serif`;
const bd=`'Plus Jakarta Sans','Helvetica Neue',sans-serif`;
const mn=`'JetBrains Mono','SF Mono',monospace`;
const FL="https://fonts.googleapis.com/css2?family=Instrument+Serif&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap";

/* Inject fonts + range CSS via useEffect (artifact sandbox blocks link tags) */
function useInjectStyles(){
  useEffect(()=>{
    if(document.getElementById('tether-styles'))return;
    const link=document.createElement('link');link.rel='stylesheet';link.href=FL;link.id='tether-font';document.head.appendChild(link);
    const style=document.createElement('style');style.id='tether-styles';style.textContent=RCSS;document.head.appendChild(style);
    return()=>{document.getElementById('tether-font')?.remove();document.getElementById('tether-styles')?.remove()};
  },[]);
}

const fmt=n=>{if(Math.abs(n)>=1e6)return`$${(n/1e6).toFixed(1)}M`;if(Math.abs(n)>=1e3)return`$${Math.round(n/1e3).toLocaleString()}K`;return`$${Math.round(n).toLocaleString()}`};
const fmtK=n=>n>=1000?`${(n/1000).toFixed(1)}K`:n.toLocaleString();

/* Tiered pricing: implementation + degressive per-provider */
function calcCost(prov,year){
  var impl=prov<25?100000:prov<50?175000:prov<100?275000:prov<200?400000:prov<350?550000:750000;
  var pp=prov<=20?4200:prov<=50?3600:prov<=100?3000:prov<=200?2400:1800;
  var annual=40000+prov*pp;
  if(!year||year===1)return impl+annual;
  return Math.round(annual*Math.pow(1.05,year-1));
}

const SPECS={
  primary:  {label:"Primary Care",       revPerVisit:185, slotsPerDay:22, downstream:1.4, color:"#0D9488",  benchUtil:81},
  ortho:    {label:"Orthopedics",         revPerVisit:340, slotsPerDay:16, downstream:2.8, color:"#D97706",  benchUtil:76},
  cardio:   {label:"Cardiology",          revPerVisit:410, slotsPerDay:14, downstream:3.2, color:"#DC2626",  benchUtil:74},
  womens:   {label:"Women's Health",      revPerVisit:245, slotsPerDay:20, downstream:1.6, color:"#9333EA", benchUtil:79},
  onc:      {label:"Oncology",            revPerVisit:520, slotsPerDay:12, downstream:4.1, color:"#2563EB",  benchUtil:72},
  gastro:   {label:"Gastroenterology",    revPerVisit:385, slotsPerDay:14, downstream:2.5, color:"#059669", benchUtil:75},
  neuro:    {label:"Neurology",           revPerVisit:370, slotsPerDay:14, downstream:2.2, color:"#7C3AED", benchUtil:73},
  multi:    {label:"Multi-Specialty Avg", revPerVisit:285, slotsPerDay:18, downstream:2.0, color:"#475569", benchUtil:78},
};

function AN({value,prefix="",suffix="",dur=900}){
  const[d,setD]=useState(0);const ref=useRef();const s=useRef(0);const t0=useRef(null);
  useEffect(()=>{s.current=d;t0.current=null;
    const tick=ts=>{if(!t0.current)t0.current=ts;const p=Math.min((ts-t0.current)/dur,1);
    setD(s.current+(value-s.current)*(1-Math.pow(1-p,3)));if(p<1)ref.current=requestAnimationFrame(tick)};
    ref.current=requestAnimationFrame(tick);return()=>cancelAnimationFrame(ref.current)},[value]);
  const f=Math.abs(d)>=1e6?`${(d/1e6).toFixed(1)}M`:Math.abs(d)>=1e3?`${Math.round(d/1e3).toLocaleString()}K`:Math.round(d).toLocaleString();
  return <span>{prefix}{f}{suffix}</span>;
}

function Fade({children,delay=0,show=true,style={}}){
  return <div style={{opacity:show?1:0,transform:show?"translateY(0)":"translateY(12px)",
    transition:`all 0.55s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,...style}}>{children}</div>;
}

function Card({children,pad,shadow=1,mb=20,style={}}){
  const{mob}=useM();
  const p=pad||(mob?"20px 18px":"28px 32px");
  return <div style={{padding:p,background:C.sf,border:`1px solid ${shadow>1?C.bd:C.b}`,borderRadius:12,
    boxShadow:shadow===0?"none":shadow===1?sh1:shadow===2?sh2:sh3,marginBottom:mb,...style}}>{children}</div>;
}

function SectionLabel({children}){
  return <div style={{fontSize:10,fontWeight:700,color:C.kf,letterSpacing:".12em",textTransform:"uppercase",fontFamily:bd,marginBottom:20}}>{children}</div>;
}

function PageHead({title,sub}){
  const{mob}=useM();
  return <div style={{marginBottom:mob?28:48}}>
    <h1 style={{fontSize:mob?26:38,fontWeight:400,color:C.k,fontFamily:dp,margin:"0 0 14px",lineHeight:1.12,letterSpacing:"-.015em"}}>{title}</h1>
    {sub&&<p style={{fontSize:mob?13:15,color:C.ks,lineHeight:1.75,margin:0,maxWidth:500,fontFamily:bd}}>{sub}</p>}
  </div>;
}

function Slider({label,value,onChange,min,max,step,format="num",note,accent}){
  const pct=((value-min)/(max-min))*100;
  const dv=format==="$"?fmt(value):format==="%"?`${value}%`:format==="d"?`${value} days`:value.toLocaleString();
  const[h,setH]=useState(false);
  const ac=accent||C.t;
  return(
    <div style={{marginBottom:36}} onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",marginBottom:14}}>
        <span style={{fontSize:12,fontWeight:600,color:C.km,letterSpacing:".02em",fontFamily:bd}}>{label}</span>
        <span style={{fontSize:24,fontWeight:500,color:h?ac:C.k,fontFamily:mn,letterSpacing:"-.03em",transition:"color .2s"}}>{dv}</span>
      </div>
      <div style={{position:"relative",height:44,display:"flex",alignItems:"center"}}>
        <div style={{position:"absolute",left:0,right:0,height:5,background:C.bl,borderRadius:3}}/>
        <div style={{position:"absolute",left:0,width:`${pct}%`,height:5,background:ac,borderRadius:3,transition:"width .08s"}}/>
        <input type="range" min={min} max={max} step={step} value={value} onChange={e=>onChange(+e.target.value)}
          style={{position:"absolute",width:"100%",height:44,opacity:0,cursor:"pointer",zIndex:2}}/>
        <div style={{position:"absolute",left:`${pct}%`,transform:"translateX(-50%)",
          width:20,height:20,borderRadius:"50%",background:C.sf,border:`2.5px solid ${ac}`,
          boxShadow:h?`0 0 0 5px ${ac}18, ${sh2}`:sh1,transition:"all .2s cubic-bezier(.16,1,.3,1)",pointerEvents:"none",zIndex:1}}/>
      </div>
      {note&&<div style={{fontSize:11,color:C.kf,marginTop:10,fontFamily:bd}}>{note}</div>}
    </div>
  );
}

function Logo(){return <svg width="20" height="20" viewBox="0 0 20 20"><rect width="20" height="20" rx="5" fill={C.k}/>
  <path d="M5 8L10 5L15 8L10 11Z" fill="none" stroke={C.t} strokeWidth="1.3" strokeLinejoin="round"/>
  <path d="M5 10.5L10 13.5L15 10.5" fill="none" stroke="#5EC4B6" strokeWidth="1" strokeLinejoin="round" opacity=".4"/></svg>}

function TopBar({onHome,ctx}){
  const{mob}=useM();
  return(
  <div style={{borderBottom:`1px solid ${C.b}`,padding:mob?"0 16px":"0 48px",height:mob?50:58,display:"flex",justifyContent:"space-between",alignItems:"center",
    background:"rgba(255,255,255,.85)",backdropFilter:"blur(16px)",WebkitBackdropFilter:"blur(16px)",position:"sticky",top:0,zIndex:100}}>
    <div onClick={onHome} style={{cursor:"pointer",display:"flex",alignItems:"center",gap:mob?8:12}}>
      <Logo/><span style={{fontSize:mob?11:13,fontWeight:800,letterSpacing:".14em",color:C.k,fontFamily:bd}}>TETHER</span>
      {ctx&&!mob&&<><div style={{width:1,height:18,background:C.bl,margin:"0 8px"}}/><span style={{fontSize:12,fontWeight:500,color:C.ks,fontFamily:bd}}>{ctx}</span></>}
    </div></div>)}

function Steps({steps,cur,go}){
  const{mob}=useM();
  return(
  <div style={{display:"flex",borderBottom:`1px solid ${C.b}`,background:C.sf,paddingLeft:mob?0:48,gap:0,overflowX:"auto",WebkitOverflowScrolling:"touch"}}>
    {steps.map((s,i)=>{
      const active=i===cur;const done=i<cur;
      return <div key={s} onClick={()=>i<=cur&&go(i)} style={{
        padding:mob?"12px 12px 10px":"15px 28px 14px",fontSize:mob?8:10,fontWeight:700,letterSpacing:".1em",fontFamily:bd,
        color:active?C.k:done?C.t:C.kf,whiteSpace:"nowrap",flexShrink:0,
        borderBottom:active?`2.5px solid ${C.t}`:"2.5px solid transparent",
        cursor:i<=cur?"pointer":"default",transition:"all .2s",marginBottom:-1}}>
        <span style={{display:"inline-flex",alignItems:"center",justifyContent:"center",
          width:mob?14:18,height:mob?14:18,borderRadius:"50%",fontSize:mob?7:9,fontWeight:700,fontFamily:mn,marginRight:mob?4:10,
          background:done?C.t:active?C.k:C.bl,color:done||active?"#fff":C.kf,
          transition:"all .25s"}}>{done?"✓":i+1}</span>{mob?s.split(" ")[0]:s}</div>})}</div>)}

function Btn({children,onClick,v="primary",disabled}){
  const[h,setH]=useState(false);
  const styles={
    primary:{padding:"13px 32px",borderRadius:8,border:"none",
      background:h?C.km:C.k,color:"#fff",fontSize:13,fontWeight:600,fontFamily:bd,cursor:"pointer",letterSpacing:".01em",
      boxShadow:h?`0 6px 20px rgba(15,23,42,.2)`:sh1,transition:"all .25s cubic-bezier(.16,1,.3,1)",
      transform:h?"translateY(-1px)":"none"},
    secondary:{padding:"12px 24px",borderRadius:8,border:`1.5px solid ${C.b}`,background:h?C.sa:C.sf,
      color:C.km,fontSize:13,fontWeight:600,fontFamily:bd,cursor:disabled?"default":"pointer",
      opacity:disabled?0.35:1,transition:"all .2s",transform:h&&!disabled?"translateY(-1px)":"none",
      boxShadow:h&&!disabled?sh1:"none"},
    accent:{padding:"12px 28px",borderRadius:8,border:`1.5px solid ${C.tc}`,background:h?C.tb:C.sf,
      color:C.td,fontSize:13,fontWeight:600,fontFamily:bd,cursor:"pointer",transition:"all .25s",
      transform:h?"translateY(-1px)":"none",boxShadow:h?`0 4px 12px ${C.t}15`:"none"}};
  return <button onClick={onClick} onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)} style={styles[v]}>{children}</button>;
}

function NavFoot({step,max,onBack,onNext,nextLabel,nextDisabled}){const{mob}=useM();return(
  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:mob?36:72,paddingTop:mob?20:28,borderTop:`1px solid ${C.bl}`}}>
    <Btn onClick={onBack} v="secondary" disabled={step===0}>{mob?"\u2190":"Back"}</Btn>
    {step<max?<Btn onClick={onNext} disabled={nextDisabled}>{nextLabel||"Continue"}</Btn>:null}
  </div>)}

function Stat({label,value,sub,color=C.k,bg=C.sf,border=C.b}){return(
  <div style={{padding:"24px 20px",background:bg,border:`1px solid ${border}`,borderRadius:12,boxShadow:sh1}}>
    <div style={{fontSize:10,fontWeight:700,color:bg===C.sf?C.kf:color,letterSpacing:".1em",textTransform:"uppercase",fontFamily:bd,marginBottom:14}}>{label}</div>
    <div style={{fontSize:32,fontWeight:500,color,fontFamily:mn,letterSpacing:"-.04em",lineHeight:1}}>{value}</div>
    {sub&&<div style={{fontSize:11,color:C.kf,marginTop:10,fontFamily:bd}}>{sub}</div>}
  </div>)}

/* Source tooltip — hover to see data source */
function Src({tip}){
  const[show,setShow]=useState(false);
  return <span style={{position:"relative",display:"inline-flex",alignItems:"center",marginLeft:4,cursor:"help"}}
    onMouseEnter={()=>setShow(true)} onMouseLeave={()=>setShow(false)}>
    <span style={{width:14,height:14,borderRadius:"50%",background:C.bl,display:"inline-flex",alignItems:"center",justifyContent:"center",
      fontSize:8,fontWeight:700,color:C.kf,fontFamily:bd,lineHeight:1}}>i</span>
    {show&&<div style={{position:"absolute",bottom:"calc(100% + 8px)",left:"50%",transform:"translateX(-50%)",
      padding:"10px 14px",background:C.k,color:"#fff",fontSize:10,lineHeight:1.5,borderRadius:8,
      whiteSpace:"nowrap",zIndex:50,fontFamily:bd,fontWeight:500,boxShadow:sh3,
      pointerEvents:"none",letterSpacing:".01em"}}>
      {tip}
      <div style={{position:"absolute",bottom:-4,left:"50%",transform:"translateX(-50%) rotate(45deg)",width:8,height:8,background:C.k}}/>
    </div>}
  </span>;
}

function MethodNote({sp,prov}){
  const{mob}=useM();
  const[open,setOpen]=useState(false);
  var pp=prov<=20?4200:prov<=50?3600:prov<=100?3000:prov<=200?2400:1800;
  return <div style={{marginTop:32,borderTop:`1px solid ${C.bl}`,paddingTop:24}}>
    <div onClick={()=>setOpen(!open)} style={{cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
      <span style={{fontSize:11,fontWeight:600,color:C.kf,letterSpacing:".06em"}}>METHODOLOGY & ASSUMPTIONS</span>
      <span style={{fontSize:10,color:C.kg,fontFamily:mn}}>{open?"−":"+"}</span>
    </div>
    {open&&<div style={{marginTop:16,fontSize:12,color:C.kf,lineHeight:1.8}}>
      <div style={{marginBottom:12}}>This analysis uses the following inputs and assumptions:</div>
      <div style={{display:"grid",gridTemplateColumns:mob?"1fr":"1fr 1fr",gap:"8px 32px",fontSize:11}}>
        <div>Specialty economics: <strong style={{color:C.ks}}>{sp.label}</strong></div>
        <div>Revenue per visit: <strong style={{color:C.ks}}>{fmt(sp.revPerVisit)}</strong></div>
        <div>Downstream multiplier: <strong style={{color:C.ks}}>{sp.downstream}×</strong></div>
        <div>Slots per day per provider: <strong style={{color:C.ks}}>{sp.slotsPerDay}</strong></div>
        <div>Operating weeks per year: <strong style={{color:C.ks}}>50</strong></div>
        <div>Provider count: <strong style={{color:C.ks}}>{prov}</strong></div>
        <div>No-show reduction assumption: <strong style={{color:C.ks}}>50%</strong></div>
        <div>Referral recovery rate: <strong style={{color:C.ks}}>25%</strong></div>
        <div>Downstream attribution factor: <strong style={{color:C.ks}}>35%</strong></div>
        <div>Implementation fee: <strong style={{color:C.ks}}>{fmt(calcCost(prov,1)-40000-prov*pp)}</strong></div>
        <div>Annual platform: <strong style={{color:C.ks}}>{fmt(40000+prov*pp)}/yr ({fmt(pp)}/prov)</strong></div>
        <div>Year-1 total investment: <strong style={{color:C.ks}}>{fmt(calcCost(prov,1))}</strong></div>
      </div>
      <div style={{marginTop:12,fontSize:10,color:C.kg}}>Revenue per visit reflects blended reimbursement across payer mix. Downstream multiplier accounts for referrals, procedures, imaging, and ancillary services generated per initial visit. All projections are illustrative and should be validated against your organization's actual financial data.</div>
    </div>}
  </div>;
}

/* PDF Export — generates a clean summary and triggers print dialog */
function exportPDF({title,subtitle,date,metrics,narrative,breakdown,methodology}){
  const w=window.open("","_blank","width=800,height=1100");
  if(!w)return alert("Please allow popups to export PDF.");
  w.document.write(`<!DOCTYPE html><html><head><title>${title}</title>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'Inter',sans-serif;color:#0F172A;padding:56px 64px;max-width:800px;margin:0 auto;-webkit-print-color-adjust:exact;print-color-adjust:exact}
.logo{display:flex;align-items:center;gap:10px;margin-bottom:4px}
.logo span{font-size:12px;font-weight:800;letter-spacing:.14em}
.sub{font-size:9px;color:#94A3B8}
.hdr{display:flex;justify-content:space-between;align-items:flex-start;padding-bottom:20px;border-bottom:2px solid #E2E8F0;margin-bottom:32px}
.date{font-size:9px;color:#94A3B8;text-align:right}
h1{font-size:22px;font-weight:400;margin-bottom:8px;letter-spacing:-.02em}
h2{font-size:10px;font-weight:700;letter-spacing:.1em;color:#94A3B8;margin-bottom:16px;text-transform:uppercase}
.metrics{display:flex;gap:32px;margin-bottom:36px;padding:24px 0;border-bottom:1px solid #E2E8F0}
.metric .val{font-size:28px;font-weight:500;font-family:'Inter',sans-serif}
.metric .lbl{font-size:8px;font-weight:700;letter-spacing:.08em;color:#94A3B8;margin-top:4px;text-transform:uppercase}
.teal{color:#0D9488}.red{color:#DC2626}.amber{color:#D97706}.sage{color:#16A34A}
.narrative{font-size:13px;line-height:1.85;color:#334155;margin-bottom:32px;padding:20px 24px;background:#F8FAFC;border-radius:8px;border:1px solid #E2E8F0}
.breakdown{margin-bottom:32px}
.row{display:flex;justify-content:space-between;padding:10px 0;border-bottom:1px solid #F1F5F9;font-size:12px}
.row .rlbl{color:#64748B}.row .rval{font-weight:600}
.method{font-size:9px;color:#94A3B8;line-height:1.7;margin-top:32px;padding-top:16px;border-top:1px solid #E2E8F0}
.footer{margin-top:40px;padding-top:16px;border-top:1px solid #E2E8F0;display:flex;justify-content:space-between;font-size:8px;color:#94A3B8;letter-spacing:.08em;font-weight:700}
@media print{body{padding:40px 48px}}
</style></head><body>
<div class="hdr">
  <div><div class="logo"><svg width="18" height="18" viewBox="0 0 20 20"><rect width="20" height="20" rx="5" fill="#1E293B"/><path d="M5 8L10 5L15 8L10 11Z" fill="none" stroke="#0D9488" stroke-width="1.3" stroke-linejoin="round"/></svg><span>TETHER</span></div>
  <div class="sub">Access Intelligence · Value Analysis</div></div>
  <div class="date">Prepared for: [Organization]<br>${date}</div>
</div>
<h1>${title}</h1>
<p style="font-size:13px;color:#64748B;margin-bottom:28px">${subtitle}</p>
<div class="metrics">${metrics.map(m=>`<div class="metric"><div class="val ${m.cls||'teal'}">${m.v}</div><div class="lbl">${m.l}</div></div>`).join("")}</div>
${narrative?`<h2>Executive Summary</h2><div class="narrative">${narrative}</div>`:""}
${breakdown?`<h2>Value Breakdown</h2><div class="breakdown">${breakdown.map(b=>`<div class="row"><span class="rlbl">${b.l}</span><span class="rval">${b.v}</span></div>`).join("")}</div>`:""}
${methodology?`<div class="method"><strong>Methodology:</strong> ${methodology}</div>`:""}
<div class="footer"><span>BUILT BY BRAD LARMIE</span><span>MONOLITH GREY · VALUE ENGINEERING</span></div>
</body></html>`);
  w.document.close();
  setTimeout(()=>{w.print();},400);
}

/* Cross-navigation — keeps them in the tool */
function CrossNav({current}){
  const{mob}=useM();
  const paths=[
    {k:"prospect",label:"Build Your Case",desc:"Model capacity for a new health system",color:C.t},
    {k:"customer",label:"Prove Your Value",desc:"Quantify achieved ROI for existing customers",color:C.a},
    {k:"casestudy",label:"See Real Results",desc:"Read documented outcomes",color:C.s},
  ].filter(p=>p.k!==current);
  return <div style={{marginTop:24,padding:"20px 24px",background:C.sa,borderRadius:6}}>
    <div style={{fontSize:9,fontWeight:700,color:C.kf,letterSpacing:".1em",marginBottom:16}}>CONTINUE EXPLORING</div>
    <div style={{display:"grid",gridTemplateColumns:mob?"1fr":"1fr 1fr",gap:12}}>
      {paths.map(p=>{
        const[h,setH]=useState(false);
        return <div key={p.k} onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}
          style={{padding:"14px 16px",background:h?C.sh:C.sf,border:`1px solid ${h?C.bd:C.b}`,borderRadius:6,cursor:"pointer",transition:"all .15s"}}>
          <div style={{fontSize:12,fontWeight:600,color:h?p.color:C.k,transition:"color .15s"}}>{p.label} →</div>
          <div style={{fontSize:10,color:C.kg,marginTop:4}}>{p.desc}</div>
        </div>;})}
    </div>
  </div>;
}

/* ═══ PROSPECT PATH — 5 STEPS ═══ */
function ProspectPath({onHome}){
  const{mob,tab}=useM();
  useInjectStyles();
  const[step,setStep]=useState(0);const[r,setR]=useState(false);
  const[spec,setSpec]=useState("multi");const[prov,setProv]=useState(45);const[daysPerWeek,setDaysPerWeek]=useState(5);
  const[orgName,setOrgName]=useState("");
  const[fillRate,setFillRate]=useState(72);const[noShow,setNoShow]=useState(16);const[leakPct,setLeakPct]=useState(20);
  const[targetLift,setTargetLift]=useState(10);
  const[showBreakdown,setShowBreakdown]=useState(false);
  const[showDetail,setShowDetail]=useState(false);
  const[custImpl,setCustImpl]=useState(null);
  const[custAnnual,setCustAnnual]=useState(null);
  useEffect(()=>{window.scrollTo(0,0);setR(false);setShowBreakdown(false);setShowDetail(false);setTimeout(()=>setR(true),30)},[step]);
  const sp=SPECS[spec];const weeksPerYear=50;
  const totalSlots=prov*sp.slotsPerDay*daysPerWeek*weeksPerYear;
  const filledSlots=Math.round(totalSlots*(fillRate/100));const emptySlots=totalSlots-filledSlots;
  const noShowSlots=Math.round(filledSlots*(noShow/100));const actualVisits=filledSlots-noShowSlots;
  const unrealizedSlots=emptySlots+noShowSlots;const unrealizedDirect=unrealizedSlots*sp.revPerVisit;
  const unrealizedDownstream=unrealizedSlots*sp.revPerVisit*(sp.downstream-1);const totalUnrealized=unrealizedDirect+unrealizedDownstream;
  const emptyPerProvPerMonth=Math.round(unrealizedSlots/prov/12);const lostPerProvPerMonth=Math.round(unrealizedDirect/prov/12);
  const leakedReferrals=Math.round(actualVisits*0.35*(leakPct/100));const leakageLoss=leakedReferrals*sp.revPerVisit*sp.downstream;
  const newFillRate=Math.min(fillRate+targetLift,98);const newNoShow=Math.max(noShow-Math.round(noShow*0.50),2);
  const newLeakPct=Math.max(Math.round(leakPct*0.60),5);
  const newFilledSlots=Math.round(totalSlots*(newFillRate/100));const newNoShowSlots=Math.round(newFilledSlots*(newNoShow/100));
  const newActualVisits=newFilledSlots-newNoShowSlots;const addlVisits=newActualVisits-actualVisits;
  const addlDirectRev=addlVisits*sp.revPerVisit;
  const downstreamAttr=0.35;/* only 35% of downstream is attributable to access improvements */
  const addlDownstream=Math.round(addlVisits*sp.revPerVisit*(sp.downstream-1)*downstreamAttr);
  const totalAddlValue=addlDirectRev+addlDownstream;
  const leakRecovery=Math.round(leakedReferrals*0.25*sp.revPerVisit*sp.downstream*downstreamAttr);/* 25% recapture, attributed */
  const totalTetherImpact=totalAddlValue+leakRecovery;
  /* Investment — user can override on step 3 */
  const defCost=calcCost(prov,1);
  const defPP=prov<=20?4200:prov<=50?3600:prov<=100?3000:prov<=200?2400:1800;
  const defImpl=defCost-(40000+prov*defPP);const defAnnual=40000+prov*defPP;
  const implCost=custImpl!==null?custImpl:defImpl;
  const annualPlatform=custAnnual!==null?custAnnual:defAnnual;
  const tetherCost=implCost+annualPlatform;
  const netImpact=totalTetherImpact-tetherCost;const roiPct=((totalTetherImpact-tetherCost)/tetherCost)*100;
  const paybackMo=Math.max(1,Math.round((tetherCost/totalTetherImpact)*12));
  const yr=[1,2,3].map(y=>({y,impact:totalTetherImpact*(1+(y-1)*0.12),cost:y===1?tetherCost:Math.round(annualPlatform*Math.pow(1.05,y-1))}));
  const threeYrNet=yr.reduce((a,b)=>a+(b.impact-b.cost),0);
  const pctUsed=((actualVisits/totalSlots)*100);

  return(
    <div style={{minHeight:"100vh",background:C.bg,fontFamily:bd}}>
      <TopBar onHome={onHome} ctx="Build Your Case"/>
      <Steps steps={["YOUR ORG","YOUR REALITY","THE RECOVERY","THE INVESTMENT","THE VERDICT"]} cur={step} go={setStep}/>
      <div style={{maxWidth:780,margin:"0 auto",padding:mob?"32px 20px 24px":"64px 48px 40px"}}>

        {/* -- STEP 0: Tell us about your organization -- */}
        {step===0&&<Fade show={r}>
          <PageHead title="Tell us about your organization." sub="We'll build a custom analysis with real economics — not a generic calculator."/>

          <Card shadow={2} pad={mob?"24px 20px":"32px 36px"} mb={20}>
            <div style={{marginBottom:24}}>
              <label style={{fontSize:12,fontWeight:600,color:C.km,fontFamily:bd,display:"block",marginBottom:10}}>What should we call your organization?</label>
              <input type="text" value={orgName} onChange={e=>setOrgName(e.target.value)} placeholder="e.g., Summit Health Partners"
                style={{width:"100%",padding:"14px 18px",fontSize:15,fontFamily:bd,fontWeight:500,color:C.k,border:`1.5px solid ${orgName?C.t:C.b}`,borderRadius:10,outline:"none",background:C.sf,transition:"border-color .2s",boxSizing:"border-box"}}/>
            </div>
            <div style={{fontSize:12,fontWeight:600,color:C.km,fontFamily:bd,marginBottom:10}}>Primary specialty mix</div>
          </Card>

          <div style={{display:"grid",gridTemplateColumns:mob?"1fr":"1fr 1fr",gap:12}}>
            {Object.entries(SPECS).map(([k,v])=>{
              const sel=spec===k;
              return <div key={k} onClick={()=>setSpec(k)} style={{
                padding:mob?"16px 18px":"20px 24px",borderRadius:14,cursor:"pointer",transition:"all .25s cubic-bezier(.16,1,.3,1)",
                border:`1.5px solid ${sel?v.color:C.b}`,background:sel?`${v.color}06`:C.sf,
                boxShadow:sel?`0 0 0 3px ${v.color}12, ${sh1}`:sh1,transform:sel?"translateY(-1px)":"none"}}>
                <div style={{fontSize:mob?13:14,fontWeight:sel?700:500,color:sel?v.color:C.k,marginBottom:6,fontFamily:bd}}>{v.label}</div>
                <div style={{display:"flex",gap:mob?12:20,fontSize:mob?10:11,color:C.kf,flexWrap:"wrap"}}>
                  <span>{fmt(v.revPerVisit)}/visit</span>
                  <span>{v.downstream}× downstream</span>
                  <span>{v.slotsPerDay} slots/day</span>
                </div>
              </div>;
            })}
          </div>

          {/* Provider count + days */}
          <Card shadow={1} pad={mob?"20px 18px":"28px 32px"} mb={16} style={{marginTop:20}}>
            <div style={{display:"grid",gridTemplateColumns:mob?"1fr":"1fr 1fr",gap:mob?"16px 0":"0 80px"}}>
              <Slider label="Active Providers" value={prov} onChange={setProv} min={5} max={500} step={5}
                note={`${prov<=20?'$4,200':prov<=50?'$3,600':prov<=100?'$3,000':prov<=200?'$2,400':'$1,800'}/provider/yr${prov>100?' (volume)':''}`}/>
              <Slider label="Clinic Days Per Week" value={daysPerWeek} onChange={setDaysPerWeek} min={3} max={6} step={1} note="Operating days across locations"/>
            </div>
          </Card>

          {/* Instant reveal: your specialty's economics */}
          <Fade delay={150} show={r}>
            <div style={{padding:mob?"20px 18px":"24px 28px",background:C.sf,borderRadius:12,border:"1px solid "+sp.color+"25",boxShadow:sh1}}>
              <div style={{fontSize:10,fontWeight:700,color:sp.color,letterSpacing:".12em",marginBottom:14}}>{sp.label.toUpperCase()} ECONOMICS</div>
              <div style={{display:"flex",gap:mob?16:40,flexWrap:"wrap"}}>
                {[{l:"Revenue / visit",v:fmt(sp.revPerVisit),c:sp.color,tip:"MGMA 2024"},{l:"Downstream multiplier",v:sp.downstream+"\u00d7",c:C.a,tip:"CMS claims 2023"},{l:"National median util.",v:sp.benchUtil+"%",c:C.k,tip:"MGMA 2024"}].map(function(x){return(
                  <div key={x.l} style={{minWidth:mob?80:0}}>
                    <div style={{fontSize:mob?20:28,fontWeight:500,color:x.c,fontFamily:mn,letterSpacing:"-.03em"}}>{x.v}</div>
                    <div style={{fontSize:10,color:C.kf,fontWeight:600,marginTop:4}}>{x.l} <Src tip={x.tip}/></div></div>)})}
              </div>
              <div style={{marginTop:16,fontSize:13,color:C.ks,lineHeight:1.7}}>
                {orgName?<><strong style={{color:C.k}}>{orgName}</strong> has</>:"With"} <strong>{prov} providers</strong> {"\u00d7"} {sp.slotsPerDay} slots/day {"\u00d7"} {daysPerWeek} days = <strong style={{color:C.k,fontFamily:mn}}>{totalSlots.toLocaleString()}</strong> annual patient slots.
              </div>
            </div>
          </Fade>
        </Fade>}

        {/* -- STEP 1: YOUR REALITY + CONTRAST -- */}
        {step===1&&<Fade show={r}>
          <PageHead title={orgName?`Here's what we see, ${orgName}.`:"What's your reality?"} sub="Drag each slider and watch the unrealized value accumulate in real time."/>

          {/* Running loss counter — sticks to the top of the content area, updates live */}
          <div style={{textAlign:"center",padding:"8px 0 36px"}}>
            <div style={{fontSize:10,fontWeight:700,color:C.r,letterSpacing:".14em",marginBottom:10}}>{orgName?orgName.toUpperCase()+" IS LEAVING":"YOU'RE LEAVING"}</div>
            <div style={{fontSize:mob?36:56,fontWeight:500,color:C.r,fontFamily:mn,letterSpacing:"-.04em",lineHeight:1,transition:"all .15s"}}>
              <AN value={totalUnrealized+leakageLoss} prefix="$" dur={300}/>
            </div>
            <div style={{fontSize:13,color:C.ks,marginTop:8}}>on the table every year</div>
          </div>

          <Card shadow={2} pad={mob?"24px 20px":"36px 36px"} mb={24}>
            <div style={{display:"grid",gridTemplateColumns:mob?"1fr":"1fr 1fr",gap:mob?"16px 0":"0 72px"}}>
              <Slider label="Schedule Fill Rate" value={fillRate} onChange={setFillRate} min={40} max={98} step={1} format="%"
                note={<>National {sp.label.toLowerCase()} median: {sp.benchUtil}% <Src tip="MGMA DataDive Practice Operations, 2024"/></>}
                accent={fillRate>=sp.benchUtil?C.t:C.r}/>
              <Slider label="No-Show Rate" value={noShow} onChange={setNoShow} min={2} max={40} step={1} format="%"
                note={<>Healthcare avg: 15–18% <Src tip="SCI Solutions Patient Access Report, 2023"/></>}
                accent={noShow<=15?C.t:C.r}/>
            </div>
            <Slider label="Referral Leakage" value={leakPct} onChange={setLeakPct} min={5} max={50} step={1} format="%"
              note={<>Average health system: 20–30% <Src tip="Advisory Board Patient Access Research, 2024"/></>}
              accent={leakPct<=15?C.t:C.r}/>

            {/* Capacity bar */}
            <div style={{marginTop:8}}>
              <div style={{height:10,borderRadius:5,background:C.bl,overflow:"hidden",display:"flex"}}>
                <div style={{width:`${pctUsed}%`,background:C.t,transition:"width .4s ease",borderRadius:5}}/>
                <div style={{width:`${(noShowSlots/totalSlots)*100}%`,background:C.a,transition:"width .4s ease"}}/>
              </div>
              <div style={{display:"flex",gap:mob?10:20,marginTop:10,flexWrap:"wrap"}}>
                {[{c:C.t,l:`Seen (${fmtK(actualVisits)})`},{c:C.a,l:`No-shows (${fmtK(noShowSlots)})`},{c:C.bl,l:`Empty (${fmtK(emptySlots)})`}].map(x=>(
                  <div key={x.l} style={{display:"flex",alignItems:"center",gap:6}}><div style={{width:10,height:10,borderRadius:3,background:x.c}}/><span style={{fontSize:11,color:C.ks}}>{x.l}</span></div>))}
              </div>
            </div>
          </Card>

          <Fade delay={200} show={r}>
            <div style={{display:"grid",gridTemplateColumns:mob?"1fr 1fr":"1fr 1fr 1fr",gap:mob?10:16}}>
              {[{l:"REALIZED",v:actualVisits*sp.revPerVisit+actualVisits*sp.revPerVisit*(sp.downstream-1),s:`${fmtK(actualVisits)} visits`,bg:C.tb,bc:C.tc,fc:C.t},
                {l:"UNREALIZED",v:totalUnrealized,s:`${fmtK(unrealizedSlots)} empty slots`,bg:C.rb,bc:C.rc,fc:C.r},
                {l:"LEAKED",v:leakageLoss,s:`${fmtK(leakedReferrals)} referrals`,bg:C.ab,bc:C.ac,fc:C.a}].map(x=>(
                <div key={x.l} style={{padding:24,background:x.bg,borderRadius:14,border:`1px solid ${x.bc}`,textAlign:"center"}}>
                  <div style={{fontSize:9,fontWeight:700,color:x.fc,letterSpacing:".1em",marginBottom:10}}>{x.l}</div>
                  <div style={{fontSize:26,fontWeight:500,color:x.fc,fontFamily:mn}}>{fmt(x.v)}</div>
                  <div style={{fontSize:11,color:C.kf,marginTop:6}}>{x.s}</div>
                </div>))}
            </div>
          </Fade>

          <Fade delay={400} show={r}>
            <div style={{padding:mob?"16px 18px":"24px 32px",background:C.sf,borderRadius:14,border:`1px solid ${C.b}`,borderLeft:`4px solid ${C.r}`,marginTop:20}}>
              <div style={{fontSize:14,color:C.km,lineHeight:1.8}}>
                Each of your <strong>{prov} providers</strong> has roughly <strong style={{color:C.r,fontFamily:mn}}>{emptyPerProvPerMonth} unfilled slots per month</strong> — that's
                <strong style={{color:C.r,fontFamily:mn}}> {fmt(lostPerProvPerMonth)}</strong> in unrealized direct revenue per provider, every month.
              </div>
            </div>
          </Fade>

          {/* TARGET IMPROVEMENT + CONTRAST */}
          <Fade delay={500} show={r}>
            <Card shadow={2} pad={mob?"24px 20px":"32px 36px"} mb={16} style={{marginTop:24}}>
              <Slider label="Target Fill Rate Improvement" value={targetLift} onChange={setTargetLift} min={3} max={25} step={1} format="%" accent={C.t}
                note={`Moving from ${fillRate}% to ${newFillRate}% fill rate`}/>
              <div style={{display:"grid",gridTemplateColumns:`repeat(${mob?Math.min(sp.slotsPerDay,10):Math.min(sp.slotsPerDay,20)}, 1fr)`,gap:4,marginBottom:16}}>
                {Array.from({length:Math.min(sp.slotsPerDay*daysPerWeek,100)}).map((_,i)=>{
                  const tot=sp.slotsPerDay*daysPerWeek;const bef=Math.round(tot*(fillRate/100));const aft=Math.round(tot*(newFillRate/100));
                  return <div key={i} style={{aspectRatio:"1",borderRadius:5,background:i<bef?C.t:i<aft?C.a:C.bl,opacity:i<bef?0.7:i<aft?0.9:0.3,transition:"all .3s ease",boxShadow:i<aft&&i>=bef?`0 0 8px ${C.a}30`:"none"}}/>;
                })}
              </div>
              <div style={{display:"flex",gap:mob?10:20,flexWrap:"wrap",marginBottom:20}}>
                {[{c:C.t,o:.7,l:"Currently filled"},{c:C.a,o:.9,l:"Recovered by Tether"},{c:C.bl,o:.3,l:"Remaining open"}].map(x=>(
                  <div key={x.l} style={{display:"flex",alignItems:"center",gap:6}}><div style={{width:10,height:10,borderRadius:3,background:x.c,opacity:x.o}}/><span style={{fontSize:11,color:C.ks}}>{x.l}</span></div>))}
              </div>
              {/* Before / After contrast */}
            </Card>
          </Fade>
          <Fade delay={200} show={r}>
            <Card shadow={2} pad="0" mb={20}>
              <div style={{display:"grid",gridTemplateColumns:mob?"1fr":"1fr 1fr"}}>
                <div style={{padding:mob?"24px 20px":"28px 28px",borderRight:mob?"none":"1px solid "+C.bl,borderBottom:mob?"1px solid "+C.bl:"none"}}>
                  <div style={{fontSize:10,fontWeight:700,color:C.r,letterSpacing:".12em",marginBottom:20}}>YOUR REALITY</div>
                  {[{l:"Fill Rate",v:fillRate+"%"},{l:"No-Shows",v:noShow+"%"},{l:"Leakage",v:leakPct+"%"}].map(function(x){return(
                    <div key={x.l} style={{display:"flex",justifyContent:"space-between",marginBottom:12}}>
                      <span style={{fontSize:12,color:C.ks}}>{x.l}</span><span style={{fontSize:16,fontWeight:600,color:C.r,fontFamily:mn}}>{x.v}</span></div>)})}
                  <div style={{borderTop:"1px solid "+C.bl,paddingTop:14,marginTop:8}}>
                    <div style={{fontSize:11,color:C.kf,marginBottom:4}}>Annual patients seen</div>
                    <div style={{fontSize:mob?24:32,fontWeight:500,color:C.kf,fontFamily:mn}}>{fmtK(actualVisits)}</div></div>
                </div>
                <div style={{padding:mob?"24px 20px":"28px 28px",background:C.sh}}>
                  <div style={{fontSize:10,fontWeight:700,color:C.t,letterSpacing:".12em",marginBottom:20}}>WITH TETHER</div>
                  {[{l:"Fill Rate",v:newFillRate+"%",d:"+"+targetLift+"pts"},{l:"No-Shows",v:newNoShow+"%",d:"-"+(noShow-newNoShow)+"pts"},{l:"Leakage",v:newLeakPct+"%",d:"-"+(leakPct-newLeakPct)+"pts"}].map(function(x){return(
                    <div key={x.l} style={{display:"flex",justifyContent:"space-between",marginBottom:12}}>
                      <span style={{fontSize:12,color:C.ks}}>{x.l}</span>
                      <div><span style={{fontSize:16,fontWeight:600,color:C.t,fontFamily:mn}}>{x.v}</span>
                        <span style={{fontSize:10,fontWeight:700,color:C.t,fontFamily:mn,marginLeft:8,background:C.t+"12",padding:"2px 6px",borderRadius:4}}>{x.d}</span></div></div>)})}
                  <div style={{borderTop:"1px solid "+C.tc+"30",paddingTop:14,marginTop:8}}>
                    <div style={{fontSize:11,color:C.ks,marginBottom:4}}>Annual patients seen</div>
                    <div style={{display:"flex",alignItems:"baseline",gap:10}}>
                      <span style={{fontSize:mob?24:32,fontWeight:500,color:C.t,fontFamily:mn}}>{fmtK(newActualVisits)}</span>
                      <span style={{fontSize:13,fontWeight:700,color:C.t}}>+{fmtK(addlVisits)}</span></div></div>
                </div>
              </div>
            </Card>
          </Fade>
        </Fade>}

        {/* -- STEP 2: THE RECOVERY -- */}
        {step===2&&<Fade show={r}>
          <div style={{textAlign:"center",marginBottom:mob?24:36}}>
            <div style={{fontSize:10,fontWeight:700,color:C.kf,letterSpacing:".12em",marginBottom:10}}>
              {orgName?orgName.toUpperCase():"YOUR ORGANIZATION"} · {sp.label.toUpperCase()} · {prov} PROVIDERS
            </div>
            <PageHead title="Here's where the recovery comes from." sub="Three mechanisms, each independently measurable."/>
          </div>

          <Fade delay={100} show={r}>
            <div style={{textAlign:"center",padding:mob?"16px 0 24px":"24px 0 32px"}}>
              <div style={{fontSize:mob?40:64,fontWeight:500,color:C.t,fontFamily:mn,letterSpacing:"-.05em",lineHeight:1}}>+<AN value={addlVisits}/></div>
              <div style={{fontSize:14,color:C.ks,marginTop:10}}>patient visits recovered annually</div>
            </div>
          </Fade>

          {[{label:"SCHEDULE OPTIMIZATION",color:C.t,desc:"Filling empty slots where demand existed but scheduling couldn't match patient to provider.",
             visits:Math.round((newFilledSlots-filledSlots)*(1-newNoShow/100)),rev:Math.round((newFilledSlots-filledSlots)*(1-newNoShow/100))*sp.revPerVisit},
            {label:"NO-SHOW PREVENTION",color:C.a,desc:"Predictive outreach converts cancellations and no-shows into kept appointments.",
             visits:Math.round(filledSlots*(noShow/100-newNoShow/100)),rev:Math.round(filledSlots*(noShow/100-newNoShow/100))*sp.revPerVisit},
            {label:"REFERRAL RECAPTURE",color:C.s,desc:"Closed-loop tracking ensures referrals don't leak to competitors.",
             visits:Math.round(Math.round(actualVisits*0.35*(leakPct/100))*0.25),rev:Math.round(Math.round(actualVisits*0.35*(leakPct/100))*0.25)*sp.revPerVisit}
          ].map((m,i)=>{var pct=addlVisits>0?Math.round(m.visits/addlVisits*100):0;return(
            <Fade key={m.label} delay={200+i*120} show={r}>
              <Card shadow={1} pad={mob?"20px 18px":"24px 28px"} mb={14} style={{borderLeft:`4px solid ${m.color}`}}>
                <div style={{fontSize:10,fontWeight:700,color:m.color,letterSpacing:".1em",marginBottom:10}}>{m.label}</div>
                <div style={{fontSize:mob?13:14,color:C.ks,lineHeight:1.7,marginBottom:14}}>{m.desc}</div>
                <div style={{display:"flex",alignItems:"baseline",justifyContent:"space-between",flexWrap:"wrap",gap:8}}>
                  <div><span style={{fontSize:mob?20:26,fontWeight:500,color:m.color,fontFamily:mn}}>+{fmtK(m.visits)}</span>
                    <span style={{fontSize:12,color:C.kf,marginLeft:6}}>visits</span>
                    <span style={{fontSize:12,color:C.kf,marginLeft:4}}>{"→"}</span>
                    <span style={{fontSize:mob?16:18,fontWeight:600,color:C.k,fontFamily:mn,marginLeft:6}}>{fmt(m.rev)}</span></div>
                  <span style={{fontSize:11,fontWeight:700,color:m.color,background:`${m.color}10`,padding:"4px 10px",borderRadius:5}}>{pct}%</span></div>
                <div style={{height:6,borderRadius:3,background:C.bl,marginTop:14}}><div style={{height:"100%",width:`${pct}%`,background:m.color,borderRadius:3,transition:"width .5s ease"}}/></div>
              </Card>
            </Fade>);})}

          <Fade delay={600} show={r}>
            <div style={{padding:mob?"20px 18px":"24px 28px",background:C.sf,borderRadius:12,border:`1px solid ${C.b}`,marginBottom:16}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",flexWrap:"wrap",gap:8,marginBottom:12}}>
                <span style={{fontSize:13,fontWeight:600,color:C.km}}>Direct revenue recovery</span>
                <span style={{fontSize:mob?22:28,fontWeight:500,color:C.t,fontFamily:mn}}>{fmt(addlDirectRev+leakRecovery)}</span></div>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",flexWrap:"wrap",gap:8,paddingTop:12,borderTop:`1px solid ${C.bl}`}}>
                <div><span style={{fontSize:13,fontWeight:600,color:C.km}}>Downstream value</span>
                  <span style={{fontSize:11,color:C.kf,marginLeft:8}}>(35% attribution)</span></div>
                <span style={{fontSize:mob?18:22,fontWeight:500,color:C.s,fontFamily:mn}}>{fmt(addlDownstream)}</span></div>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",flexWrap:"wrap",gap:8,paddingTop:12,borderTop:`1px solid ${C.bl}`,marginTop:12}}>
                <span style={{fontSize:14,fontWeight:700,color:C.k}}>Total Year-1 Impact</span>
                <span style={{fontSize:mob?24:32,fontWeight:500,color:C.t,fontFamily:mn}}>{fmt(totalTetherImpact)}</span></div>
            </div>
          </Fade>
        </Fade>}

        {/* -- STEP 3: THE INVESTMENT -- */}
        {step===3&&<Fade show={r}>
          <PageHead title="What does this investment look like?" sub="Confirm or adjust your implementation and platform costs. These drive the ROI on the next screen."/>

          <Fade delay={100} show={r}>
            <Card shadow={2} pad={mob?"24px 20px":"36px 36px"} mb={24}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",marginBottom:28,flexWrap:"wrap",gap:8}}>
                <div style={{fontSize:10,fontWeight:700,color:C.kf,letterSpacing:".12em"}}>IMPLEMENTATION</div>
                <div style={{fontSize:10,color:C.kf}}>One-time deployment, integration & onboarding</div>
              </div>
              <Slider label="Implementation Fee" value={implCost} onChange={setCustImpl} min={25000} max={1500000} step={25000} format="$"
                note={`Tether estimate for ${prov} providers: ${fmt(defImpl)}`} accent={C.t}/>
              <div style={{display:"grid",gridTemplateColumns:mob?"1fr":"1fr 1fr 1fr",gap:mob?10:16,marginTop:8}}>
                {[{l:"EHR Integration",d:"Epic, Cerner, or Athena deployment",v:"Included"},
                  {l:"Data Migration",d:"Historical scheduling & referral data",v:"Included"},
                  {l:"Staff Training",d:"Scheduling teams, clinical leadership",v:"Included"}].map(x=>(
                  <div key={x.l} style={{padding:mob?"14px 16px":"18px 20px",background:C.sh,borderRadius:10,border:`1px solid ${C.bl}`}}>
                    <div style={{fontSize:12,fontWeight:600,color:C.k,marginBottom:4}}>{x.l}</div>
                    <div style={{fontSize:10,color:C.kf,lineHeight:1.5,marginBottom:8}}>{x.d}</div>
                    <div style={{fontSize:11,fontWeight:700,color:C.t}}>{x.v}</div>
                  </div>))}
              </div>
            </Card>
          </Fade>

          <Fade delay={250} show={r}>
            <Card shadow={2} pad={mob?"24px 20px":"36px 36px"} mb={24}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",marginBottom:28,flexWrap:"wrap",gap:8}}>
                <div style={{fontSize:10,fontWeight:700,color:C.kf,letterSpacing:".12em"}}>ANNUAL PLATFORM</div>
                <div style={{fontSize:10,color:C.kf}}>Recurring license, support & optimization</div>
              </div>
              <Slider label="Annual Platform Cost" value={annualPlatform} onChange={setCustAnnual} min={20000} max={2500000} step={10000} format="$"
                note={`${prov} providers × ${fmt(defPP)}/provider/yr — volume pricing applied`} accent={C.a}/>
              <div style={{display:"grid",gridTemplateColumns:mob?"1fr":"1fr 1fr 1fr",gap:mob?10:16,marginTop:8}}>
                {[{l:"Predictive Engine",d:"No-show scoring, backfill optimization",ic:"⚡"},
                  {l:"Referral Tracking",d:"Closed-loop referral management",ic:"🔗"},
                  {l:"Access Analytics",d:"Real-time dashboards & reporting",ic:"📊"}].map(x=>(
                  <div key={x.l} style={{padding:mob?"14px 16px":"18px 20px",background:C.sh,borderRadius:10,border:`1px solid ${C.bl}`}}>
                    <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:4}}>
                      <span style={{fontSize:14}}>{x.ic}</span>
                      <span style={{fontSize:12,fontWeight:600,color:C.k}}>{x.l}</span>
                    </div>
                    <div style={{fontSize:10,color:C.kf,lineHeight:1.5}}>{x.d}</div>
                  </div>))}
              </div>
            </Card>
          </Fade>

          <Fade delay={400} show={r}>
            <div style={{padding:mob?"24px 20px":"32px 36px",background:C.k,borderRadius:14,marginBottom:24}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20,flexWrap:"wrap",gap:12}}>
                <div style={{fontSize:10,fontWeight:700,color:C.kf,letterSpacing:".12em"}}>YEAR-1 TOTAL</div>
                <div style={{fontSize:mob?32:44,fontWeight:500,color:C.tc,fontFamily:mn,letterSpacing:"-.04em"}}>{fmt(tetherCost)}</div>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:0,borderTop:`1px solid ${C.km}`,paddingTop:16}}>
                {[{l:"Implementation",v:fmt(implCost)},{l:"Annual Platform",v:fmt(annualPlatform)},{l:"Per Provider / Mo",v:fmt(Math.round(annualPlatform/prov/12))}].map(x=>(
                  <div key={x.l} style={{textAlign:"center"}}>
                    <div style={{fontSize:mob?14:18,fontWeight:500,color:"#fff",fontFamily:mn}}>{x.v}</div>
                    <div style={{fontSize:8,fontWeight:700,color:C.kf,letterSpacing:".08em",marginTop:4,textTransform:"uppercase"}}>{x.l}</div>
                  </div>))}
              </div>
            </div>
          </Fade>

          <Fade delay={550} show={r}>
            <div style={{padding:mob?"20px 18px":"24px 28px",background:C.sf,borderRadius:12,border:`1px solid ${C.b}`,borderLeft:`4px solid ${C.t}`}}>
              <p style={{fontSize:mob?13:14,color:C.km,lineHeight:1.85,margin:0}}>
                {orgName||"Your organization"} is leaving <strong style={{color:C.r}}>{fmt(totalUnrealized)}</strong> on the table annually.
                Against a <strong>{fmt(tetherCost)}</strong> Year-1 investment, Tether projects
                <strong style={{color:C.t}}> {fmt(totalTetherImpact)}</strong> in recovered value.
                {totalTetherImpact>tetherCost?" That's a "+Math.round(roiPct)+"% return before Year 2 even starts.":""}
              </p>
            </div>
          </Fade>
        </Fade>}

        {/* -- STEP 4: THE VERDICT (clean) -- */}
        {step===4&&<Fade show={r}>
          <div style={{fontSize:10,fontWeight:700,color:C.kf,letterSpacing:".12em",marginBottom:8,textAlign:"center"}}>
            {orgName?orgName.toUpperCase()+" · ":""}{sp.label.toUpperCase()} · {prov} PROVIDERS</div>

          <div style={{textAlign:"center",padding:mob?"28px 0":"48px 0"}}>
            <div style={{fontSize:13,fontWeight:600,color:C.ks,marginBottom:12}}>Net Year-1 Impact</div>
            <Fade delay={200} show={r}><div style={{fontSize:mob?48:80,fontWeight:500,color:C.t,fontFamily:mn,letterSpacing:"-.05em",lineHeight:1}}>
              <AN value={netImpact} prefix="$"/></div></Fade>
            <Fade delay={500} show={r}><div style={{display:"flex",justifyContent:"center",gap:mob?20:40,marginTop:mob?16:28,flexWrap:"wrap"}}>
              {[{v:Math.round(roiPct)+"%",l:"ROI",c:C.a},{v:paybackMo+" mo",l:"PAYBACK",c:C.s},{v:"+"+fmtK(addlVisits),l:"PATIENTS",c:C.t}].map(function(x){return(
                <div key={x.l} style={{textAlign:"center"}}><div style={{fontSize:mob?22:32,fontWeight:500,color:x.c,fontFamily:mn}}>{x.v}</div>
                  <div style={{fontSize:9,fontWeight:700,color:C.kf,letterSpacing:".1em",marginTop:4}}>{x.l}</div></div>)})}</div></Fade>
          </div>

          <Fade delay={700} show={r}>
            <div style={{padding:mob?"20px 18px":"24px 28px",background:C.sf,borderRadius:12,border:"1px solid "+C.b,marginBottom:24}}>
              <p style={{fontSize:mob?13:15,color:C.km,lineHeight:1.9,margin:0}}>
                {orgName||"Your organization"} currently converts <strong>{fillRate}%</strong> of available capacity, leaving
                <strong style={{color:C.r}}> {fmt(totalUnrealized)}</strong> on the table annually. By improving fill rate by
                <strong> {targetLift} points</strong>, reducing no-shows by 50%, and recapturing leaked referrals, Tether recovers
                <strong style={{color:C.t}}> {fmtK(addlVisits)} patient visits</strong> — generating
                <strong style={{color:C.t}}> {fmt(totalTetherImpact)}</strong> against a
                <strong> {fmt(tetherCost)}</strong> Year-1 investment.
              </p>
            </div>
          </Fade>

          <Fade delay={900} show={r}>
            <div style={{display:"flex",gap:12,justifyContent:"center",flexWrap:"wrap",marginBottom:8}}>
              <Btn onClick={function(){exportPDF({
                title:sp.label+" · "+prov+" Providers — Access Value Analysis",
                subtitle:"Projected Year-1 impact based on current utilization and Tether improvement modeling.",
                date:new Date().toLocaleDateString('en-US',{month:'long',day:'numeric',year:'numeric'}),
                metrics:[{v:fmt(netImpact),l:"Net Year-1 Impact",cls:"teal"},{v:Math.round(roiPct)+"%",l:"ROI",cls:"amber"},{v:paybackMo+" mo",l:"Payback"},{v:"+"+fmtK(addlVisits),l:"Patients",cls:"teal"}],
                narrative:(orgName||sp.label+" network")+" ("+prov+" providers) converts "+fillRate+"% of capacity, leaving "+fmt(totalUnrealized)+" unrealized. Tether recovers "+fmtK(addlVisits)+" visits generating "+fmt(totalTetherImpact)+" against "+fmt(tetherCost)+" investment.",
                breakdown:[{l:"Visit revenue",v:fmt(addlDirectRev)},{l:"Downstream (35%)",v:fmt(addlDownstream)},{l:"Referral recapture",v:fmt(leakRecovery)},{l:"Total impact",v:fmt(totalTetherImpact)},{l:"Investment",v:"("+fmt(tetherCost)+")"},{l:"Net impact",v:fmt(netImpact)}],
                methodology:"Rev/visit: "+fmt(sp.revPerVisit)+". Downstream: "+sp.downstream+"x. Tiered pricing."
              })}}>Export Full Analysis</Btn>
              <Btn v="accent" onClick={function(){window.open("mailto:brad.larmie@monolithgrey.com?subject=Tether Access Review Request&body=I'd like to schedule a 30-minute access review consultation.")}}>Schedule Access Review</Btn>
            </div>
            <div style={{textAlign:"center",fontSize:11,color:C.kf}}>30-minute consultation with a Tether access strategist</div>
          </Fade>

          <Fade delay={1000} show={r}>
            <div style={{marginTop:32}}>
              <div onClick={function(){setShowDetail(!showDetail)}} style={{cursor:"pointer",padding:"14px 0",borderTop:"1px solid "+C.bl,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <span style={{fontSize:12,fontWeight:600,color:C.t}}>3-year projection</span>
                <span style={{fontSize:10,color:C.kf,fontFamily:mn}}>{showDetail?"\u2212":"+"}</span></div>
              {showDetail&&<Fade show={showDetail}><Card mb={8} pad={mob?"16px 14px":"20px 24px"}>
                <div style={{borderRadius:10,overflow:"hidden",border:"1px solid "+C.bl}}>
                  <div style={{display:"grid",gridTemplateColumns:mob?".5fr 1fr 1fr 1fr":".7fr 1fr 1fr 1fr"}}>
                    {["","Impact","Cost","Net"].map(function(h,i){return <div key={i} style={{padding:mob?"10px 10px":"12px 16px",background:C.sa,fontSize:10,fontWeight:700,color:C.kf,letterSpacing:".06em",textAlign:i?"right":"left"}}>{h}</div>})}</div>
                  {yr.map(function(y,yi){return <div key={yi} style={{display:"grid",gridTemplateColumns:mob?".5fr 1fr 1fr 1fr":".7fr 1fr 1fr 1fr",borderTop:"1px solid "+C.bl}}>
                    <div style={{padding:mob?"10px 10px":"12px 16px",fontSize:mob?12:13,fontWeight:600,color:C.k}}>{"Year "+y.y}</div>
                    <div style={{padding:mob?"10px 10px":"12px 16px",fontSize:mob?12:13,fontFamily:mn,fontWeight:500,color:C.km,textAlign:"right"}}>{fmt(y.impact)}</div>
                    <div style={{padding:mob?"10px 10px":"12px 16px",fontSize:mob?12:13,fontFamily:mn,fontWeight:500,color:C.km,textAlign:"right"}}>{fmt(y.cost)}</div>
                    <div style={{padding:mob?"10px 10px":"12px 16px",fontSize:mob?12:13,fontFamily:mn,fontWeight:500,color:y.impact-y.cost>0?C.t:C.r,textAlign:"right"}}>{fmt(y.impact-y.cost)}</div>
                  </div>})}
                  <div style={{display:"grid",gridTemplateColumns:mob?".5fr 1fr 1fr 1fr":".7fr 1fr 1fr 1fr",borderTop:"2px solid "+C.bd}}>
                    <div style={{padding:mob?"10px 10px":"12px 16px",fontSize:mob?12:13,fontWeight:700,color:C.k,background:C.sh}}>3-Year</div>
                    <div style={{padding:mob?"10px 10px":"12px 16px",background:C.sh}}></div>
                    <div style={{padding:mob?"10px 10px":"12px 16px",background:C.sh}}></div>
                    <div style={{padding:mob?"10px 10px":"12px 16px",fontSize:mob?12:13,fontFamily:mn,fontWeight:700,color:C.t,textAlign:"right",background:C.sh}}>{fmt(yr.reduce(function(a,b){return a+(b.impact-b.cost)},0))}</div>
                  </div>
                </div></Card></Fade>}

              <div onClick={function(){setShowBreakdown(!showBreakdown)}} style={{cursor:"pointer",padding:"14px 0",borderTop:"1px solid "+C.bl,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <span style={{fontSize:12,fontWeight:600,color:C.t}}>Investment detail</span>
                <span style={{fontSize:10,color:C.kf,fontFamily:mn}}>{showBreakdown?"\u2212":"+"}</span></div>
              {showBreakdown&&<Fade show={showBreakdown}><Card mb={8} pad={mob?"16px 14px":"20px 24px"}>
                {(function(){var pp=prov<=20?4200:prov<=50?3600:prov<=100?3000:prov<=200?2400:1800;
                  var impl=calcCost(prov,1)-(40000+prov*pp);var annual=40000+prov*pp;
                  return [{l:"Implementation (one-time)",v:fmt(impl)},{l:"Annual platform ("+prov+" providers)",v:fmt(annual)},{l:"Year-1 total",v:fmt(tetherCost),bold:true}].map(function(x){return(
                    <div key={x.l} style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",padding:"10px 0",borderBottom:"1px solid "+C.bl,flexWrap:"wrap",gap:4}}>
                      <span style={{fontSize:12,color:x.bold?C.k:C.ks,fontWeight:x.bold?600:400}}>{x.l}</span>
                      <span style={{fontSize:14,fontWeight:x.bold?700:500,color:x.bold?C.k:C.km,fontFamily:mn}}>{x.v}</span></div>)})})()}
                <div style={{marginTop:16}}>
                  {[{l:orgName?orgName+"'s unrealized value":"Annual unrealized value",v:totalUnrealized,c:C.r,bg:C.rb,w:"100%"},
                    {l:"Tether Year-1 investment",v:tetherCost,c:C.t,bg:C.tb,w:Math.max((tetherCost/totalUnrealized)*100,3)+"%"}].map(function(x){return(
                    <div key={x.l} style={{marginBottom:14}}>
                      <div style={{height:32,borderRadius:8,background:x.bg,overflow:"hidden",marginBottom:6,position:"relative"}}>
                        <div style={{height:"100%",width:x.w,background:x.c+"20",borderRadius:8,transition:"width .5s ease"}}/>
                        <div style={{position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",fontSize:13,fontWeight:600,color:x.c,fontFamily:mn}}>{fmt(x.v)}</div></div>
                      <div style={{fontSize:11,color:C.ks,paddingLeft:4}}>{x.l}</div></div>)})}</div>
              </Card></Fade>}

              <MethodNote sp={sp} prov={prov}/>
            </div>
          </Fade>
          <Fade delay={1100} show={r}><CrossNav current="prospect" onNav={function(n){onHome();setTimeout(function(){var el=document.querySelector('[data-path="'+n+'"]');if(el)el.click()},100)}}/></Fade>
        </Fade>}
        <NavFoot step={step} max={4} onBack={()=>step>0?setStep(step-1):onHome()} onNext={()=>setStep(step+1)}/>
      </div>
    </div>
  );
}

/* ═══ PROVE YOUR VALUE — Existing Customer ═══ */
function CustomerPath({onHome}){
  const{mob,tab}=useM();
  useInjectStyles();
  const[step,setStep]=useState(0);const[r,setR]=useState(false);
  const[spec,setSpec]=useState("multi");
  const[orgName,setOrgName]=useState("");
  const[bProv,setBProv]=useState(45);const[bFill,setBFill]=useState(71);const[bNoShow,setBNoShow]=useState(17);
  const[bLeak,setBLeak]=useState(24);
  const[bRevPerVisit,setBRevPerVisit]=useState(null);const[monthsLive,setMonthsLive]=useState(8);
  const[cFill,setCFill]=useState(85);const[cNoShow,setCNoShow]=useState(7);const[cLeak,setCLeak]=useState(11);
  const[expProv,setExpProv]=useState(120);const[expSpecs,setExpSpecs]=useState(["ortho","cardio"]);
  const[showExpDetail,setShowExpDetail]=useState(false);
  const[custImpl,setCustImpl]=useState(null);
  const[custAnnual,setCustAnnual]=useState(null);

  useEffect(()=>{window.scrollTo(0,0);setR(false);setShowExpDetail(false);setTimeout(()=>setR(true),30)},[step]);
  const sp=SPECS[spec];const rpv=bRevPerVisit||sp.revPerVisit;
  const daysPerWeek=5;const weeksPerYear=50;const totalSlots=bProv*sp.slotsPerDay*daysPerWeek*weeksPerYear;
  const bFilled=Math.round(totalSlots*(bFill/100));const bNS=Math.round(bFilled*(bNoShow/100));const bActual=bFilled-bNS;
  const bLeaked=Math.round(bActual*0.35*(bLeak/100));
  const cFilled=Math.round(totalSlots*(cFill/100));const cNS=Math.round(cFilled*(cNoShow/100));const cActual=cFilled-cNS;
  const cLeaked=Math.round(cActual*0.35*(cLeak/100));
  const addlVisits=cActual-bActual;const addlRev=addlVisits*rpv;
  const downstreamAttr=0.35;
  const addlDownstream=Math.round(addlVisits*rpv*(sp.downstream-1)*downstreamAttr);
  const leakRecov=Math.round(Math.max(bLeaked-cLeaked,0)*rpv*sp.downstream*downstreamAttr);
  const totalValue=addlRev+addlDownstream+leakRecov;
  const defCostC=calcCost(bProv,1);
  const defPPC=bProv<=20?4200:bProv<=50?3600:bProv<=100?3000:bProv<=200?2400:1800;
  const defImplC=defCostC-(40000+bProv*defPPC);const defAnnualC=40000+bProv*defPPC;
  const implCostC=custImpl!==null?custImpl:defImplC;
  const annualPlatformC=custAnnual!==null?custAnnual:defAnnualC;
  const tetherCost=implCostC+annualPlatformC;
  const achievedROI=tetherCost>0?((totalValue-tetherCost)/tetherCost)*100:0;
  const perDollar=totalValue/tetherCost;const perProvPerMonth=Math.round(totalValue/bProv/12);
  const toggleExpSpec=(sk)=>setExpSpecs(p=>p.includes(sk)?p.filter(x=>x!==sk):[...p,sk]);
  const expSlots=expProv*sp.slotsPerDay*daysPerWeek*weeksPerYear;const expLiftPts=cFill-bFill;
  const expNewFill=Math.min(bFill+expLiftPts,98);const expNSReduction=(bNoShow-cNoShow)/bNoShow;
  const expFilled=Math.round(expSlots*(expNewFill/100));const expNewNS=Math.max(bNoShow*(1-expNSReduction),2);
  const expNSSlots=Math.round(expFilled*(expNewNS/100));const expActual=expFilled-expNSSlots;
  const expAvgRev=expSpecs.length?expSpecs.reduce((s,k)=>s+(SPECS[k]?.revPerVisit||285),0)/expSpecs.length:rpv;
  const expAvgDown=expSpecs.length?expSpecs.reduce((s,k)=>s+(SPECS[k]?.downstream||2),0)/expSpecs.length:sp.downstream;
  const expBaseActual=Math.round(expSlots*(bFill/100)*(1-bNoShow/100));
  const expAddlVisits=expActual-expBaseActual;
  const expTotalImpact=Math.round(expAddlVisits*expAvgRev+expAddlVisits*expAvgRev*(expAvgDown-1)*downstreamAttr);
  const expCost=calcCost(expProv,1);const expROI=((expTotalImpact-expCost)/expCost)*100;

  const metrics=[
    {label:"Fill Rate",b:bFill,a:cFill,setB:setBFill,setA:setCFill,minB:40,maxB:98,minA:bFill,maxA:98,u:"%",good:"up"},
    {label:"No-Show Rate",b:bNoShow,a:cNoShow,setB:setBNoShow,setA:setCNoShow,minB:2,maxB:40,minA:1,maxA:bNoShow,u:"%",good:"dn"},
    {label:"Referral Leakage",b:bLeak,a:cLeak,setB:setBLeak,setA:setCLeak,minB:5,maxB:50,minA:2,maxA:bLeak,u:"%",good:"dn"},
  ];

  return(
    <div style={{minHeight:"100vh",background:C.bg,fontFamily:bd}}>
      <TopBar onHome={onHome} ctx="Prove Your Value"/>
      <Steps steps={["BEFORE & AFTER","THE IMPACT","THE INVESTMENT","EXPANSION"]} cur={step} go={setStep}/>
      <div style={{maxWidth:780,margin:"0 auto",padding:mob?"32px 20px 24px":"64px 48px 40px"}}>

        {/* ── STEP 0: Before & After ── */}
        {step===0&&<Fade show={r}>
          <PageHead title="Show us the before and after." sub="Select your specialty and set your metrics. Left is where you started — right is where you are now."/>

          {/* Org config */}
          <Card shadow={2} mb={28} pad={mob?"20px 18px":"28px 36px"}>
            <div style={{display:"flex",alignItems:"center",gap:mob?16:32,flexWrap:"wrap"}}>
              <div style={{display:"flex",alignItems:"center",gap:10}}>
                <span style={{fontSize:10,fontWeight:700,color:C.kf,letterSpacing:".08em"}}>SPECIALTY</span>
                <select value={spec} onChange={e=>setSpec(e.target.value)}
                  style={{padding:"8px 16px",borderRadius:8,border:`1.5px solid ${C.b}`,background:C.sf,fontSize:12,fontFamily:bd,color:C.k,cursor:"pointer",outline:"none"}}>
                  {Object.entries(SPECS).map(([k,v])=><option key={k} value={k}>{v.label}</option>)}
                </select>
              </div>
              {[{l:"PROVIDERS",v:bProv,set:setBProv,min:5,max:500,step:5},
                {l:"MONTHS LIVE",v:monthsLive,set:setMonthsLive,min:1,max:36,step:1},
                {l:"REV/VISIT",v:rpv,set:setBRevPerVisit,min:100,max:800,step:5,fmt:true}
              ].map(x=>(
                <div key={x.l} style={{display:"flex",alignItems:"center",gap:8}}>
                  <span style={{fontSize:10,fontWeight:700,color:C.kf,letterSpacing:".08em"}}>{x.l}</span>
                  <div style={{position:"relative",display:"flex",alignItems:"center"}}>
                    <span style={{fontSize:18,fontWeight:600,color:C.k,fontFamily:mn,minWidth:x.fmt?52:32,textAlign:"right"}}>{x.fmt?fmt(x.v):x.v}</span>
                    <div style={{width:mob?56:72,height:28,position:"relative",marginLeft:8,display:"flex",alignItems:"center"}}>
                      <div style={{position:"absolute",left:0,right:0,height:3,background:C.bl,borderRadius:2}}/>
                      <div style={{position:"absolute",left:0,width:`${((x.v-x.min)/(x.max-x.min))*100}%`,height:3,background:C.t,borderRadius:2}}/>
                      <input type="range" min={x.min} max={x.max} step={x.step} value={x.v} onChange={e=>x.set(+e.target.value)}
                        style={{position:"absolute",width:"100%",height:28,opacity:0,cursor:"pointer",zIndex:2}}/>
                      <div style={{position:"absolute",left:`${((x.v-x.min)/(x.max-x.min))*100}%`,transform:"translateX(-50%)",
                        width:10,height:10,borderRadius:"50%",background:C.sf,border:`2.5px solid ${C.t}`,boxShadow:sh1,pointerEvents:"none",zIndex:1}}/>
                    </div>
                  </div>
                </div>))}
            </div>
          </Card>

          {/* Side by side: Before / After — upgraded with larger values and better spacing */}
          <Card shadow={2} mb={24} pad="0">
            <div style={{display:"grid",gridTemplateColumns:mob?"1fr":"1fr 1fr"}}>
              <div style={{padding:mob?"24px 20px":"32px 32px",borderRight:mob?"none":`1px solid ${C.bl}`,borderBottom:mob?`1px solid ${C.bl}`:"none"}}>
                <div style={{fontSize:10,fontWeight:700,color:C.r,letterSpacing:".12em",marginBottom:28}}>BEFORE TETHER</div>
                {metrics.map(m=>(
                  <div key={m.label+"b"} style={{marginBottom:28}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",marginBottom:10}}>
                      <span style={{fontSize:11,fontWeight:600,color:C.ks,letterSpacing:".04em",textTransform:"uppercase"}}>{m.label}</span>
                      <span style={{fontSize:24,fontWeight:500,color:C.r,fontFamily:mn}}>{m.b}%</span>
                    </div>
                    <div style={{position:"relative",height:28,display:"flex",alignItems:"center"}}>
                      <div style={{position:"absolute",left:0,right:0,height:4,background:C.bl,borderRadius:2}}/>
                      <div style={{position:"absolute",left:0,width:`${((m.b-m.minB)/(m.maxB-m.minB))*100}%`,height:4,background:`${C.r}60`,borderRadius:2}}/>
                      <input type="range" min={m.minB} max={m.maxB} step={1} value={m.b} onChange={e=>m.setB(+e.target.value)}
                        style={{position:"absolute",width:"100%",height:28,opacity:0,cursor:"pointer",zIndex:2}}/>
                      <div style={{position:"absolute",left:`${((m.b-m.minB)/(m.maxB-m.minB))*100}%`,transform:"translateX(-50%)",
                        width:14,height:14,borderRadius:"50%",background:C.sf,border:`2.5px solid ${C.r}`,boxShadow:sh2,pointerEvents:"none",zIndex:1}}/>
                    </div>
                  </div>))}
              </div>
              <div style={{padding:mob?"24px 20px":"32px 32px",background:C.sh}}>
                <div style={{fontSize:10,fontWeight:700,color:C.t,letterSpacing:".12em",marginBottom:28}}>WITH TETHER</div>
                {metrics.map(m=>{
                  const diff=m.a-m.b;const abs=Math.abs(diff);const isGood=m.good==="up"?diff>0:diff<0;
                  return <div key={m.label+"a"} style={{marginBottom:28}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",marginBottom:10}}>
                      <span style={{fontSize:11,fontWeight:600,color:C.ks,letterSpacing:".04em",textTransform:"uppercase"}}>{m.label}</span>
                      <div style={{display:"flex",alignItems:"baseline",gap:8}}>
                        <span style={{fontSize:24,fontWeight:500,color:C.t,fontFamily:mn}}>{m.a}%</span>
                        <span style={{fontSize:11,fontWeight:700,color:isGood?C.t:C.r,fontFamily:mn,background:isGood?C.tb:C.rb,
                          padding:"3px 8px",borderRadius:4}}>{diff>0?"↑":"↓"}{abs}pts</span>
                      </div>
                    </div>
                    <div style={{position:"relative",height:28,display:"flex",alignItems:"center"}}>
                      <div style={{position:"absolute",left:0,right:0,height:4,background:C.bl,borderRadius:2}}/>
                      <div style={{position:"absolute",left:0,width:`${((m.a-m.minA)/(m.maxA-m.minA))*100}%`,height:4,background:C.t,borderRadius:2}}/>
                      <input type="range" min={m.minA} max={m.maxA} step={1} value={m.a} onChange={e=>m.setA(+e.target.value)}
                        style={{position:"absolute",width:"100%",height:28,opacity:0,cursor:"pointer",zIndex:2}}/>
                      <div style={{position:"absolute",left:`${((m.a-m.minA)/(m.maxA-m.minA))*100}%`,transform:"translateX(-50%)",
                        width:14,height:14,borderRadius:"50%",background:C.sf,border:`2.5px solid ${C.t}`,boxShadow:`0 2px 8px ${C.t}40`,pointerEvents:"none",zIndex:1}}/>
                    </div>
                  </div>;})}
              </div>
            </div>
            <div style={{padding:mob?"14px 16px":"18px 32px",borderTop:`1px solid ${C.bl}`,background:C.sa,display:"flex",justifyContent:"space-between",alignItems:"center",
              borderRadius:"0 0 12px 12px"}}>
              <span style={{fontSize:13,color:C.ks}}>
                <strong style={{color:C.k}}>{fmtK(bActual)}</strong> → <strong style={{color:C.t}}>{fmtK(cActual)}</strong> patients/yr
                <span style={{color:C.t,fontWeight:700,fontFamily:mn,marginLeft:8}}>+{fmtK(addlVisits)}</span></span>
              <span style={{fontSize:13,color:C.ks}}>Projected value: <strong style={{color:C.t,fontFamily:mn}}>{fmt(totalValue)}</strong></span>
            </div>
          </Card>
        </Fade>}

        {/* ── STEP 1: The Impact — dramatic reveal ── */}
        {step===1&&<Fade show={r}>
          <div style={{fontSize:11,fontWeight:700,color:C.kf,letterSpacing:".12em",marginBottom:12}}>
            {sp.label.toUpperCase()} · {bProv} PROVIDERS · {monthsLive} MONTHS LIVE
          </div>

          {/* THE NUMBER */}
          <div style={{padding:mob?"36px 0 28px":"60px 0 48px",textAlign:"center"}}>
            <div style={{fontSize:13,fontWeight:600,color:C.ks,marginBottom:16}}>Total Value Delivered</div>
            <Fade delay={200} show={r}>
              <div style={{fontSize:mob?48:80,fontWeight:500,color:C.t,fontFamily:mn,letterSpacing:"-.05em",lineHeight:1}}>
                <AN value={totalValue} prefix="$"/>
              </div>
            </Fade>
            <Fade delay={500} show={r}>
              <div style={{display:"flex",justifyContent:"center",gap:mob?16:48,marginTop:mob?20:36}}>
                {[{v:`+${fmtK(addlVisits)}`,l:"Patients Added",c:C.t},{v:`${Math.round(achievedROI)}%`,l:"Achieved ROI",c:C.a},{v:`$${perDollar.toFixed(1)}`,l:"Per $1 Invested",c:C.s},{v:fmt(perProvPerMonth),l:"Per Provider / Mo",c:C.t}].map(x=>(
                  <div key={x.l} style={{textAlign:"center"}}>
                    <div style={{fontSize:mob?18:28,fontWeight:500,color:x.c,fontFamily:mn}}>{x.v}</div>
                    <div style={{fontSize:9,fontWeight:700,color:C.kf,letterSpacing:".1em",marginTop:6}}>{x.l.toUpperCase()}</div>
                  </div>))}
              </div>
            </Fade>
          </div>

          {/* Value breakdown with progress bars */}
          <Fade delay={700} show={r}>
            <Card mb={24}>
              <SectionLabel>Where the Value Comes From</SectionLabel>
              {[{l:"Additional visit revenue",v:addlRev,c:C.t,s:`${fmtK(addlVisits)} net new visits × ${fmt(rpv)}`},
                {l:"Downstream value",v:addlDownstream,c:C.s,s:<>Referrals, procedures, imaging ({sp.downstream}× multiplier) <Src tip="CMS episode-of-care claims analysis, 2023"/></>},
                {l:"Referral recapture",v:leakRecov,c:C.a,s:`${fmtK(Math.max(bLeaked-cLeaked,0))} referrals kept in-network`}].map(x=>{
                const pct=totalValue>0?((x.v/totalValue)*100):0;
                return <div key={x.l} style={{marginBottom:20}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
                    <div><div style={{fontSize:13,color:C.k,fontWeight:500}}>{x.l}</div>
                      <div style={{fontSize:11,color:C.kf,marginTop:2}}>{x.s}</div></div>
                    <div style={{fontSize:15,fontWeight:600,color:C.k,fontFamily:mn,flexShrink:0,marginLeft:16}}>{fmt(x.v)}</div>
                  </div>
                  <div style={{height:6,borderRadius:3,background:C.bl,overflow:"hidden"}}>
                    <div style={{height:"100%",width:`${pct}%`,background:x.c,borderRadius:3,transition:"width .6s ease"}}/>
                  </div>
                </div>;})}
              <div style={{borderTop:`1px solid ${C.bl}`,paddingTop:16,display:"flex",justifyContent:"space-between",alignItems:"baseline"}}>
                <span style={{fontSize:14,fontWeight:600}}>Total Achieved Value</span>
                <span style={{fontSize:mob?22:28,fontWeight:500,color:C.t,fontFamily:mn}}><AN value={totalValue} prefix="$"/><span style={{fontSize:13,color:C.kf,fontWeight:400}}> / yr</span></span>
              </div>
            </Card>
          </Fade>

          {/* Executive narrative */}
          <Fade delay={900} show={r}>
            <div style={{padding:mob?"20px 18px":"28px 36px",background:C.sf,borderRadius:14,border:`1px solid ${C.b}`,borderLeft:`4px solid ${C.t}`}}>
              <SectionLabel>Executive Summary</SectionLabel>
              <p style={{fontSize:15,color:C.km,lineHeight:1.9,margin:0}}>
                Over <strong>{monthsLive} months</strong>, Tether improved {sp.label.toLowerCase()} fill rate from <strong>{bFill}%</strong> to <strong>{cFill}%</strong> and reduced no-shows from <strong>{bNoShow}%</strong> to <strong>{cNoShow}%</strong>, adding
                <strong style={{color:C.t}}> {fmtK(addlVisits)} patient visits</strong> annually across {bProv} providers.
                Total economic impact: <strong style={{color:C.t}}>{fmt(totalValue)}</strong> per year — a <strong>{Math.round(achievedROI)}% return</strong> on {fmt(tetherCost)}. Every dollar returned <strong>${perDollar.toFixed(1)}</strong>.
              </p>
            </div>
          </Fade>
          <Fade delay={1000} show={r}><MethodNote sp={sp} prov={bProv}/></Fade>
        </Fade>}

        {/* ── STEP 2: THE INVESTMENT ── */}
        {step===2&&<Fade show={r}>
          <PageHead title="What did Tether cost?" sub="Enter your actual implementation and annual platform costs. This drives the ROI you'll use to build the expansion case."/>

          <Fade delay={100} show={r}>
            <Card shadow={2} pad={mob?"24px 20px":"36px 36px"} mb={24}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",marginBottom:28,flexWrap:"wrap",gap:8}}>
                <div style={{fontSize:10,fontWeight:700,color:C.kf,letterSpacing:".12em"}}>IMPLEMENTATION</div>
                <div style={{fontSize:10,color:C.kf}}>One-time deployment & onboarding</div>
              </div>
              <Slider label="Implementation Fee" value={implCostC} onChange={setCustImpl} min={25000} max={1500000} step={25000} format="$"
                note={`Default estimate for ${bProv} providers: ${fmt(defImplC)}`} accent={C.t}/>
            </Card>
          </Fade>

          <Fade delay={250} show={r}>
            <Card shadow={2} pad={mob?"24px 20px":"36px 36px"} mb={24}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",marginBottom:28,flexWrap:"wrap",gap:8}}>
                <div style={{fontSize:10,fontWeight:700,color:C.kf,letterSpacing:".12em"}}>ANNUAL PLATFORM</div>
                <div style={{fontSize:10,color:C.kf}}>Recurring license & support</div>
              </div>
              <Slider label="Annual Platform Cost" value={annualPlatformC} onChange={setCustAnnual} min={20000} max={2500000} step={10000} format="$"
                note={`${bProv} providers × ${fmt(defPPC)}/provider/yr`} accent={C.a}/>
            </Card>
          </Fade>

          <Fade delay={400} show={r}>
            <div style={{padding:mob?"24px 20px":"32px 36px",background:C.k,borderRadius:14,marginBottom:24}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20,flexWrap:"wrap",gap:12}}>
                <div style={{fontSize:10,fontWeight:700,color:C.kf,letterSpacing:".12em"}}>TOTAL INVESTMENT</div>
                <div style={{fontSize:mob?32:44,fontWeight:500,color:C.tc,fontFamily:mn,letterSpacing:"-.04em"}}>{fmt(tetherCost)}</div>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:0,borderTop:`1px solid ${C.km}`,paddingTop:16}}>
                {[{l:"Implementation",v:fmt(implCostC)},{l:"Annual Platform",v:fmt(annualPlatformC)},{l:"Per Provider / Mo",v:fmt(Math.round(annualPlatformC/bProv/12))}].map(x=>(
                  <div key={x.l} style={{textAlign:"center"}}>
                    <div style={{fontSize:mob?14:18,fontWeight:500,color:"#fff",fontFamily:mn}}>{x.v}</div>
                    <div style={{fontSize:8,fontWeight:700,color:C.kf,letterSpacing:".08em",marginTop:4,textTransform:"uppercase"}}>{x.l}</div>
                  </div>))}
              </div>
            </div>
          </Fade>

          <Fade delay={550} show={r}>
            <div style={{padding:mob?"20px 18px":"24px 28px",background:C.sf,borderRadius:12,border:`1px solid ${C.b}`,borderLeft:`4px solid ${C.t}`}}>
              <p style={{fontSize:mob?13:14,color:C.km,lineHeight:1.85,margin:0}}>
                Over <strong>{monthsLive} months</strong>, Tether delivered <strong style={{color:C.t}}>{fmt(totalValue)}</strong> in attributable value
                against a <strong>{fmt(tetherCost)}</strong> investment.
                {totalValue>tetherCost?<> That's <strong style={{color:C.t}}>${(totalValue/tetherCost).toFixed(1)}</strong> back for every dollar invested — a <strong>{Math.round(achievedROI)}% return</strong>.</>:" Adjust costs above to reflect your actual contract."}
              </p>
            </div>
          </Fade>
        </Fade>}

        {/* ── STEP 3: Expansion — dramatic projection ── */}
        {step===3&&<Fade show={r}>
          <PageHead title="What if you expanded?" sub="Your results are proven. Here's what the same improvements look like at scale."/>

          {/* Proven performance badge */}
          <Fade delay={0} show={r}>
            <div style={{padding:mob?"14px 16px":"18px 28px",background:C.tb,borderRadius:14,border:`1px solid ${C.tc}`,marginBottom:28,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <span style={{fontSize:13,color:C.ks}}>
                Proven: <strong style={{color:C.t}}>+{expLiftPts}pt</strong> fill rate · <strong style={{color:C.t}}>{Math.round(expNSReduction*100)}%</strong> no-show reduction · <strong style={{color:C.t}}>{Math.round(achievedROI)}%</strong> ROI</span>
              <span style={{fontSize:10,fontWeight:700,color:C.t,background:`${C.t}15`,padding:"5px 12px",borderRadius:6}}>VALIDATED</span>
            </div>
          </Fade>

          <Card shadow={2} mb={32} pad={mob?"24px 20px":"36px 36px"}>
            <Slider label="Expanded Provider Count" value={expProv} onChange={setExpProv} min={bProv} max={1000} step={5}
              note={`Currently: ${bProv} providers → modeling at ${expProv}`} accent={C.s}/>
            <div style={{marginBottom:24}}>
              <div style={{fontSize:12,fontWeight:600,color:C.km,marginBottom:12}}>Expansion Specialties</div>
              <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                {Object.entries(SPECS).filter(([k])=>k!==spec&&k!=="multi").map(([k,v])=>(
                  <button key={k} onClick={()=>toggleExpSpec(k)} style={{padding:mob?"7px 12px":"9px 18px",borderRadius:8,
                    border:`1.5px solid ${expSpecs.includes(k)?v.color:C.b}`,background:expSpecs.includes(k)?`${v.color}0C`:C.sf,
                    color:expSpecs.includes(k)?v.color:C.ks,fontSize:12,fontWeight:expSpecs.includes(k)?700:500,fontFamily:bd,cursor:"pointer",transition:"all .2s",
                    boxShadow:expSpecs.includes(k)?`0 0 0 3px ${v.color}12`:"none"}}>{v.label}</button>))}
              </div>
            </div>
          </Card>

          {/* The expansion reveal — centered dramatic number */}
          <Fade delay={150} show={r}>
            <div style={{textAlign:"center",padding:"48px 0 40px"}}>
              <div style={{fontSize:11,fontWeight:700,color:C.s,letterSpacing:".14em",marginBottom:16}}>PROJECTED IMPACT AT SCALE</div>
              <div style={{fontSize:mob?40:72,fontWeight:500,color:C.s,fontFamily:mn,letterSpacing:"-.04em",lineHeight:1}}>
                <AN value={expTotalImpact} prefix="$"/>
              </div>
              <div style={{fontSize:15,color:C.ks,marginTop:14}}>across {expProv} providers annually</div>
              <div style={{display:"flex",justifyContent:"center",gap:mob?16:48,marginTop:mob?20:32}}>
                <div style={{textAlign:"center"}}>
                  <div style={{fontSize:28,fontWeight:500,color:C.s,fontFamily:mn}}>+{fmtK(expAddlVisits)}</div>
                  <div style={{fontSize:9,fontWeight:700,color:C.kf,letterSpacing:".1em",marginTop:4}}>PATIENTS ADDED</div>
                </div>
                <div style={{width:1,background:C.bl}}/>
                <div style={{textAlign:"center"}}>
                  <div style={{fontSize:28,fontWeight:500,color:C.a,fontFamily:mn}}>{Math.round(expROI)}%</div>
                  <div style={{fontSize:9,fontWeight:700,color:C.kf,letterSpacing:".1em",marginTop:4}}>PROJECTED ROI</div>
                </div>
                <div style={{width:1,background:C.bl}}/>
                <div style={{textAlign:"center"}}>
                  <div style={{fontSize:28,fontWeight:500,color:C.t,fontFamily:mn}}>{fmt(Math.round(expTotalImpact/expProv/12))}</div>
                  <div style={{fontSize:9,fontWeight:700,color:C.kf,letterSpacing:".1em",marginTop:4}}>PER PROVIDER / MO</div>
                </div>
              </div>
            </div>
          </Fade>

          {/* Progressive disclosure for comparison table */}
          <Fade delay={350} show={r}>
            {!showExpDetail?
              <div onClick={()=>setShowExpDetail(true)} style={{textAlign:"center",padding:"8px 0 24px",cursor:"pointer"}}>
                <span style={{fontSize:12,fontWeight:600,color:C.s,borderBottom:`1px dashed ${C.s}50`}}>Show side-by-side comparison →</span>
              </div>:
              <Fade show={showExpDetail}>
                <Card mb={24}>
                  <SectionLabel>Current Deployment vs. Expansion</SectionLabel>
                  <div style={{borderRadius:10,overflow:"hidden",border:`1px solid ${C.bl}`}}>
                    {[[""  ,`Today (${bProv})`,`Expanded (${expProv})`],
                      ["Additional patients / yr",fmtK(addlVisits),fmtK(expAddlVisits)],
                      ["Economic impact",fmt(totalValue),fmt(expTotalImpact)],
                      ["Platform investment",fmt(tetherCost),fmt(expCost)],
                      ["ROI",`${Math.round(achievedROI)}%`,`${Math.round(expROI)}%`],
                      ["Per provider / mo",fmt(perProvPerMonth),fmt(Math.round(expTotalImpact/expProv/12))],
                    ].map((row,ri)=>(
                      <div key={ri} style={{display:"grid",gridTemplateColumns:mob?"1.2fr .8fr .8fr":"1.4fr 1fr 1fr",borderTop:ri?`1px solid ${C.bl}`:"none"}}>
                        {row.map((v,ci)=>(
                          <div key={ci} style={{padding:"14px 18px",fontSize:ri===0?10:13,fontWeight:ri===0?700:ci===0?500:600,
                            fontFamily:ci&&ri?mn:bd,color:ri===0?C.kf:ci===2?C.s:ci===1?C.t:C.k,
                            letterSpacing:ri===0?".08em":"0",textAlign:ci?"right":"left",background:ri===0?C.sa:C.sf}}>{v}</div>))}
                      </div>))}
                  </div>
                </Card>
              </Fade>}
          </Fade>

          {/* Closing narrative */}
          <Fade delay={showExpDetail?200:450} show={r}>
            <div style={{padding:mob?"20px 18px":"28px 36px",background:C.sf,borderRadius:14,border:`1px solid ${C.b}`,borderLeft:`4px solid ${C.s}`}}>
              <SectionLabel>The Expansion Case</SectionLabel>
              <p style={{fontSize:15,color:C.km,lineHeight:1.9,margin:0}}>
                At {bProv} providers, Tether has delivered <strong style={{color:C.t}}>{fmt(totalValue)}</strong> in validated value at a <strong>{Math.round(achievedROI)}% ROI</strong>. Expanding to <strong>{expProv} providers</strong>{expSpecs.length?` across ${expSpecs.map(s=>SPECS[s]?.label).filter(Boolean).join(", ").toLowerCase()}`:""} projects
                <strong style={{color:C.s}}> {fmtK(expAddlVisits)} additional patients</strong> and
                <strong style={{color:C.s}}> {fmt(expTotalImpact)}</strong> in total impact.
                These aren't projections from a model. They're your own numbers, applied to a bigger canvas.
              </p>
            </div>
          </Fade>
          <Fade delay={showExpDetail?300:550} show={r}><div style={{textAlign:"center",marginTop:36}}>
            <div style={{display:"flex",gap:12,justifyContent:"center",flexWrap:"wrap"}}><Btn onClick={()=>exportPDF({
              title:`${sp.label} · ${bProv} Providers — Value Realization Report`,
              subtitle:`${monthsLive} months live. Achieved outcomes and expansion projection.`,
              date:new Date().toLocaleDateString('en-US',{month:'long',day:'numeric',year:'numeric'}),
              metrics:[{v:fmt(totalValue),l:"Total Value Delivered",cls:"teal"},{v:`${Math.round(achievedROI)}%`,l:"Achieved ROI",cls:"amber"},{v:`$${perDollar.toFixed(1)}`,l:"Per $1 Invested",cls:"sage"},{v:`+${fmtK(addlVisits)}`,l:"Patients Added",cls:"teal"}],
              narrative:`Over ${monthsLive} months, Tether improved ${sp.label.toLowerCase()} fill rate from ${bFill}% to ${cFill}% and reduced no-shows from ${bNoShow}% to ${cNoShow}%, adding ${fmtK(addlVisits)} patient visits annually across ${bProv} providers. Total attributable economic impact: ${fmt(totalValue)} per year — a ${Math.round(achievedROI)}% return on ${fmt(tetherCost)}. Every dollar returned $${perDollar.toFixed(1)}.`,
              breakdown:[{l:"Additional visit revenue",v:fmt(addlRev)},{l:"Downstream value (35% attribution)",v:fmt(addlDownstream)},{l:"Referral recapture",v:fmt(leakRecov)},{l:"Total achieved value",v:fmt(totalValue)},{l:"Platform investment",v:`(${fmt(tetherCost)})`},{l:"Net value",v:fmt(totalValue-tetherCost)}],
              methodology:`Revenue per visit: ${fmt(rpv)}. Downstream multiplier: ${sp.downstream}×. 35% downstream attribution factor. Value-based pricing: 18% of achieved impact.`
            })}>Download Board Summary</Btn><Btn v="accent">Share with Leadership</Btn></div>
            <div style={{fontSize:11,color:C.kf,marginTop:14}}>PDF with all metrics, comparisons, and expansion projections</div>
          </div></Fade>
          <Fade delay={showExpDetail?400:650} show={r}><MethodNote sp={sp} prov={bProv}/></Fade>
          <Fade delay={showExpDetail?500:750} show={r}><CrossNav current="customer" onNav={n=>{onHome();setTimeout(()=>document.querySelector(`[data-path="${n}"]`)?.click(),100)}}/></Fade>
        </Fade>}
        <NavFoot step={step} max={3} onBack={()=>step>0?setStep(step-1):onHome()} onNext={()=>setStep(step+1)}/>
      </div>
    </div>
  );
}

/* ═══ CASE STUDIES ═══ */
const STORIES=[
{id:"pinnacle",headline:"How a 120-provider orthopedic group recovered $4.8M in 11 months",
  org:"Pinnacle Orthopedics & Sports Medicine",meta:"120 providers · 16 locations · Rocky Mountain West",color:C.a,
  context:"Pinnacle is one of the largest independent orthopedic groups in the Mountain West — 82 surgeons, 38 APPs, running 16 clinics and 3 ambulatory surgery centers. They were doing well by most measures. But their COO, Rachel Tanaka, had a problem she couldn't solve with the tools she had.",
  problem:"\"We knew our surgeons weren't as busy as they should be. But we couldn't pinpoint where the patients were falling out. Was it the front desk? The referral process? The wait time? We had a feeling it was all three, but no data to prove it.\"",
  problemStats:[{label:"Avg wait to 3rd available",val:"18 days",note:"vs. 8-day regional benchmark"},{label:"Surgical referral conversion",val:"61%",note:"39% never scheduled"},{label:"Schedule utilization",val:"69%",note:"across all provider types"},{label:"No-show rate",val:"14%",note:"higher in PT and pain management"}],
  timeline:[
    {phase:"Weeks 1–4",title:"Deployment & Baseline",desc:"Tether integrated with Pinnacle's Epic instance and Phreesia check-in system. Within 10 days, the platform mapped the complete patient acquisition funnel — from referral receipt to completed visit — for every provider, location, and specialty line. The initial findings were uncomfortable."},
    {phase:"Month 2–3",title:"The Referral Black Hole",desc:"Tether identified that 34% of incoming surgical referrals sat in work queues for more than 72 hours before first patient contact. By the time a scheduler called, many patients had already booked with a competitor. Tether's automated outreach began contacting patients within 15 minutes of referral receipt. Surgical consult scheduling jumped from 61% to 78% within 6 weeks."},
    {phase:"Month 4–6",title:"The Backfill Engine",desc:"With predictive no-show scoring running across all locations, Tether began proactively backfilling slots 48–72 hours before predicted no-shows. The system learned which patients were high-risk (new PCP referrals had 2.4× higher no-show rates) and which available patients had the shortest notice tolerance. Fill rate climbed from 69% to 81%."},
    {phase:"Month 7–11",title:"Compound Effects",desc:"Higher surgical consult volume meant more pre-surgical imaging, more surgeries, more post-op PT visits. Pinnacle's ASCs went from 72% block utilization to 88%. Two surgeons who had been considering leaving cited the improved patient flow as a reason to stay."}],
  results:{metrics:[{label:"Fill rate",before:"69%",after:"84%",delta:"+15 pts"},{label:"No-show rate",before:"14%",after:"6.2%",delta:"−56%"},{label:"Referral conversion",before:"61%",after:"83%",delta:"+22 pts"},{label:"Wait to 3rd available",before:"18 days",after:"6 days",delta:"−67%"},{label:"ASC block utilization",before:"72%",after:"88%",delta:"+16 pts"}],
    addlVisits:"18,400",revenue:"$4.8M",roi:"340%",payback:"3.5 months",monthlyData:[69,70,72,74,76,78,80,81,83,84,84]},
  quote:"The tool paid for itself in the first quarter. But the real story is the two surgeons who decided to stay. You can't put an ROI number on retention — but it probably saved us $2M in recruitment costs alone.",
  quoteAuthor:"Rachel Tanaka, COO",
  secondOrder:"Within 8 months, Pinnacle approved a new pain management clinic in their fastest-growing market — directly enabled by the volume data Tether surfaced. They also eliminated 3.5 FTEs of manual scheduling work, redeploying staff to patient experience roles."},
{id:"lakeview",headline:"A 42-provider women's health practice cut wait times by 71% and added $1.9M",
  org:"Lakeview Women's Health Associates",meta:"42 providers · 6 clinics · Upper Midwest",color:"#8B5E8B",
  context:"Lakeview is a single-specialty OB/GYN practice serving a mid-size metro area. 4.8 stars on Google, 92nd percentile patient satisfaction. But popularity had created a different kind of problem.",
  problem:"\"Our doctors were booked out 24 days for a new patient appointment. We were turning away patients who called for the first time. But we also had a 17% no-show rate — our doctors were sitting idle while new patients couldn't get in. It was maddening.\"",
  problemStats:[{label:"New patient wait",val:"24 days",note:"for first available OB/GYN"},{label:"No-show rate",val:"17%",note:"highest in prenatal visits"},{label:"Schedule utilization",val:"74%",note:"despite being 'fully booked'"},{label:"Call abandonment",val:"19%",note:"patients hanging up before scheduling"}],
  timeline:[
    {phase:"Weeks 1–3",title:"The Paradox",desc:"Tether's analysis surfaced what the administrator called \"the paradox\" — Lakeview was simultaneously overbooked (24-day waits) and underutilized (74% fill). The problem wasn't capacity. No-shows, cancellations, and scheduling rigidity were creating phantom scarcity."},
    {phase:"Month 2",title:"Smart Wait List",desc:"Tether launched its intelligent wait list — patients who wanted earlier appointments were automatically offered same-week openings as they appeared. Within 3 weeks, the effective wait dropped from 24 to 14 days without adding a single provider."},
    {phase:"Month 3–5",title:"Prenatal No-Show Intervention",desc:"Prenatal visits had a 22% no-show rate. Tether identified the primary driver: transportation and childcare barriers for afternoon appointments. The platform began proactively offering morning-slot swaps to flagged patients. Prenatal no-shows dropped to 8%."},
    {phase:"Month 6–9",title:"New Patient Acceleration",desc:"With utilization climbing and no-shows falling, Lakeview could accept new patients 3× faster. Wait times hit 7 days. New patient volume increased 31% without adding providers."}],
  results:{metrics:[{label:"New patient wait",before:"24 days",after:"7 days",delta:"−71%"},{label:"No-show rate",before:"17%",after:"6.8%",delta:"−60%"},{label:"Schedule utilization",before:"74%",after:"89%",delta:"+15 pts"},{label:"New patient volume",before:"baseline",after:"+31%",delta:"+31%"}],
    addlVisits:"6,800",revenue:"$1.9M",roi:"290%",payback:"4 months",monthlyData:[74,76,78,80,83,85,87,88,89,89]},
  quote:"We were turning away the exact patients we'd spent years building a reputation to attract. Tether didn't give us more capacity — it unlocked the capacity we already had.",
  quoteAuthor:"Amanda Reeves, Practice Administrator",
  secondOrder:"Lakeview opened their first satellite clinic 7 months after deployment — a decision they'd debated for 2 years. Tether's patient zip-code demand data gave them the confidence to commit. They also launched a same-day sick visit line for established patients."},
{id:"trident",headline:"A 280-provider multi-specialty system found $8.1M hiding in plain sight",
  org:"Trident Health Network",meta:"280 providers · 34 locations · Southeast US",color:C.s,
  context:"Trident is a physician-led health network spanning primary care, cardiology, GI, neurology, and orthopedics across a major metro and surrounding rural communities. With 34 locations, operational visibility was their biggest challenge.",
  problem:"\"Every department told me they were at capacity. But system-wide utilization was 71%. Something didn't add up. Nobody had a tool that could show where patients were falling out of the funnel, across every specialty, every location, in real time.\"",
  problemStats:[{label:"System-wide utilization",val:"71%",note:"ranging 64%–83% by site"},{label:"Cross-referral leakage",val:"27%",note:"internal referrals lost to competitors"},{label:"Scheduling calls/day",val:"2,800+",note:"22% abandonment rate"},{label:"Provider satisfaction",val:"34th %ile",note:"physicians frustrated by empty slots"}],
  timeline:[
    {phase:"Month 1",title:"System-Wide X-Ray",desc:"Tether mapped patient flow across all 34 locations and 8 specialty lines. First finding: cardiology and GI had the lowest utilization (64%, 67%) but the highest revenue per visit ($410, $385). Second: 27% of internal referrals were never converted — roughly 19,000 lost specialist visits per year."},
    {phase:"Month 2–3",title:"The Referral Loop",desc:"Tether's closed-loop referral tracking connected PCP referral orders to specialist scheduling in real time. PCPs could see whether referrals had been scheduled, completed, or dropped. Internal referral conversion jumped from 73% to 89% within 8 weeks."},
    {phase:"Month 4–6",title:"Site-Level Optimization",desc:"Each of Trident's 34 locations received its own access scorecard — fill rate, no-show rate, referral conversion, patient acquisition by zip code. Site administrators could compare themselves to peers. Competitive dynamics kicked in. The lowest-performing sites improved fastest."},
    {phase:"Month 7–12",title:"Network Effects",desc:"Patients who had a good scheduling experience in primary care were significantly more likely to stay in-network for specialty referrals. Leakage dropped from 27% to 12%. The cardiology group hit 82% utilization by month 10. Two cardiologists asked to extend their clinic days."}],
  results:{metrics:[{label:"System utilization",before:"71%",after:"85%",delta:"+14 pts"},{label:"Internal referral conversion",before:"73%",after:"91%",delta:"+18 pts"},{label:"Cross-referral leakage",before:"27%",after:"12%",delta:"−56%"},{label:"Call abandonment",before:"22%",after:"9%",delta:"−59%"},{label:"Provider satisfaction",before:"34th %ile",after:"78th %ile",delta:"+44 pts"}],
    addlVisits:"31,200",revenue:"$8.1M",roi:"310%",payback:"3 months",monthlyData:[71,73,74,76,78,80,82,83,84,85,85,85]},
  quote:"I'd been asking for this data for five years. Every vendor said they could do it. Tether is the first one that actually showed me where the patients were going — and brought them back.",
  quoteAuthor:"David Kern, SVP of Operations",
  secondOrder:"Trident renegotiated payer contracts 9 months in, armed with utilization data demonstrating network adequacy improvements — securing a 4.2% rate increase from their largest commercial payer. Two rural sites flagged for closure were kept open after Tether's demand forecasting showed untapped patient populations within 15-minute drive times."}
];

function StoryCard({s,i,onClick}){
  const{mob}=useM();
  const[h,setH]=useState(false);
  return <Fade delay={i*100} show={true}>
    <div onClick={onClick} onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}
      style={{padding:mob?"20px 18px":"32px 32px",cursor:"pointer",background:C.sf,border:`1.5px solid ${h?s.color+"40":C.b}`,
        borderRadius:14,marginBottom:16,transition:"all .3s cubic-bezier(.16,1,.3,1)",boxShadow:h?sh2:sh1,
        transform:h?"translateY(-2px)":"none"}}>
      <div style={{display:"flex",flexDirection:mob?"column":"row",justifyContent:"space-between",alignItems:mob?"flex-start":"flex-start",marginBottom:16,gap:mob?12:0}}>
        <div style={{flex:1}}>
          <div style={{fontSize:11,color:C.kf,marginBottom:10,fontWeight:600}}>{s.meta}</div>
          <div style={{fontSize:mob?16:19,fontWeight:400,color:C.k,fontFamily:dp,lineHeight:1.3}}>{s.headline}</div>
        </div>
        <div style={{display:"flex",gap:mob?16:24,marginLeft:mob?0:32,flexShrink:0}}>
          <div style={{textAlign:"right"}}><div style={{fontSize:22,fontWeight:500,color:s.color,fontFamily:mn}}>{s.results.revenue}</div>
            <div style={{fontSize:9,fontWeight:700,color:C.kf,letterSpacing:".08em"}}>RECOVERED</div></div>
          <div style={{textAlign:"right"}}><div style={{fontSize:22,fontWeight:500,color:s.color,fontFamily:mn}}>{s.results.roi}</div>
            <div style={{fontSize:9,fontWeight:700,color:C.kf,letterSpacing:".08em"}}>ROI</div></div>
        </div>
      </div>
      <div style={{fontSize:13,color:C.ks,lineHeight:1.7}}>{s.context.slice(0,150)}…</div>
      <div style={{marginTop:16,fontSize:12,fontWeight:600,color:h?s.color:C.kf,transition:"color .2s",
        display:"flex",alignItems:"center",gap:6}}>Read the full story <span style={{transition:"transform .25s",transform:h?"translateX(3px)":"none",display:"inline-block"}}>→</span></div>
    </div>
  </Fade>;
}

function CaseStudyPath({onHome}){
  const{mob,tab}=useM();
  useInjectStyles();
  const[sel,setSel]=useState(null);const[r,setR]=useState(false);
  useEffect(()=>{window.scrollTo(0,0);setR(false);setTimeout(()=>setR(true),40)},[sel]);
  const cs=STORIES.find(s=>s.id===sel);

  /* ── LIST VIEW ── */
  if(!cs)return(
    <div style={{minHeight:"100vh",background:C.bg,fontFamily:bd}}>
      <TopBar onHome={onHome} ctx="Case Studies"/>
      <div style={{maxWidth:780,margin:"0 auto",padding:mob?"32px 20px 24px":"64px 48px 40px"}}>
        <PageHead title="Real results from real health systems." sub="Documented outcomes from organizations that deployed Tether and measured the difference."/>

        {/* Hero stats — centered dramatic numbers */}
        <div style={{textAlign:"center",padding:"8px 0 48px"}}>
          <div style={{display:"flex",justifyContent:"center",gap:mob?20:56}}>
            {[{v:"442",l:"Total Providers",c:C.t},{v:"$14.8M",l:"Revenue Recovered",c:C.t},{v:"56,400",l:"Patients Added / Year",c:C.s},{v:"313%",l:"Average ROI",c:C.a}].map(x=>(
              <div key={x.l} style={{textAlign:"center"}}>
                <div style={{fontSize:mob?20:32,fontWeight:500,color:x.c,fontFamily:mn,letterSpacing:"-.03em"}}>{x.v}</div>
                <div style={{fontSize:9,fontWeight:700,color:C.kf,letterSpacing:".1em",marginTop:6}}>{x.l.toUpperCase()}</div>
              </div>))}
          </div>
        </div>

        {STORIES.map((s,i)=><StoryCard key={s.id} s={s} i={i} onClick={()=>setSel(s.id)}/>)}
        <div style={{marginTop:48,paddingTop:24,borderTop:`1px solid ${C.bl}`}}>
          <CrossNav current="casestudy" onNav={n=>{onHome();setTimeout(()=>document.querySelector(`[data-path="${n}"]`)?.click(),100)}}/>
        </div>
      </div>
    </div>);

  /* ── DETAIL VIEW ── */
  const mo=cs.results.monthlyData;const moMax=Math.max(...mo);
  return(
    <div style={{minHeight:"100vh",background:C.bg,fontFamily:bd}}>
      <TopBar onHome={onHome} ctx="Case Studies"/>
      <div style={{maxWidth:780,margin:"0 auto",padding:mob?"32px 20px 24px":"64px 48px 40px"}}>
        <Fade show={r}>
          <div onClick={()=>setSel(null)} style={{color:C.t,fontSize:12,fontWeight:600,cursor:"pointer",marginBottom:36,display:"inline-flex",alignItems:"center",gap:6}}>
            <span>←</span> All Case Studies
          </div>
          <div style={{marginBottom:20}}>
            <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:16}}>
              <div style={{width:10,height:10,borderRadius:3,background:cs.color}}/><span style={{fontSize:11,color:C.kf,fontWeight:600}}>{cs.meta}</span></div>
            <h1 style={{fontSize:mob?22:34,fontWeight:400,color:C.k,fontFamily:dp,margin:"0 0 12px",lineHeight:1.2,letterSpacing:"-.02em"}}>{cs.headline}</h1>
            <div style={{fontSize:16,fontWeight:600,color:cs.color}}>{cs.org}</div>
          </div>
        </Fade>

        {/* Hero result numbers — immediate impact */}
        <Fade delay={80} show={r}>
          <div style={{textAlign:"center",padding:"40px 0 44px"}}>
            <div style={{display:"flex",justifyContent:"center",gap:mob?20:56}}>
              {[{l:"Revenue Impact",v:cs.results.revenue,c:cs.color},{l:"Additional Visits",v:cs.results.addlVisits,c:C.t},{l:"ROI",v:cs.results.roi,c:C.a},{l:"Payback",v:cs.results.payback,c:C.s}].map(x=>(
                <div key={x.l} style={{textAlign:"center"}}>
                  <div style={{fontSize:mob?20:32,fontWeight:500,color:x.c,fontFamily:mn,letterSpacing:"-.03em"}}>{x.v}</div>
                  <div style={{fontSize:9,fontWeight:700,color:C.kf,letterSpacing:".1em",marginTop:6}}>{x.l.toUpperCase()}</div>
                </div>))}
            </div>
          </div>
        </Fade>

        <Fade delay={140} show={r}><div style={{fontSize:15,color:C.km,lineHeight:1.9,marginBottom:32}}>{cs.context}</div></Fade>

        <Fade delay={200} show={r}>
          <div style={{padding:mob?"20px 18px":"28px 36px",background:C.sf,borderRadius:14,border:`1px solid ${C.b}`,borderLeft:`4px solid ${cs.color}`,marginBottom:32}}>
            <div style={{fontSize:mob?14:16,color:C.km,lineHeight:1.85,fontStyle:"italic",fontFamily:dp}}>{cs.problem}</div>
          </div>
        </Fade>

        <Fade delay={260} show={r}>
          <div style={{display:"grid",gridTemplateColumns:mob?"1fr":"1fr 1fr",gap:14,marginBottom:mob?28:48}}>
            {cs.problemStats.map(s=>(
              <div key={s.label} style={{padding:20,background:C.sf,border:`1px solid ${C.b}`,borderRadius:14,boxShadow:sh1}}>
                <div style={{fontSize:10,color:C.kf,fontWeight:700,letterSpacing:".06em",marginBottom:10}}>{s.label.toUpperCase()}</div>
                <div style={{fontSize:mob?22:26,fontWeight:500,color:C.r,fontFamily:mn}}>{s.val}</div>
                <div style={{fontSize:11,color:C.kf,marginTop:6}}>{s.note}</div>
              </div>))}
          </div>
        </Fade>

        <Fade delay={320} show={r}><SectionLabel>Implementation Timeline</SectionLabel></Fade>
        {cs.timeline.map((t,i)=>(
          <Fade key={t.phase} delay={380+i*80} show={r}>
            <div style={{display:"flex",flexDirection:mob?"column":"row",gap:mob?8:28,marginBottom:mob?20:28}}>
              <div style={{width:mob?70:88,flexShrink:0,paddingTop:3}}>
                <div style={{fontSize:11,fontWeight:700,color:cs.color,fontFamily:mn}}>{t.phase}</div></div>
              <div style={{flex:1,borderLeft:`2px solid ${C.bl}`,paddingLeft:28,paddingBottom:4}}>
                <div style={{fontSize:15,fontWeight:600,color:C.k,marginBottom:8}}>{t.title}</div>
                <div style={{fontSize:14,color:C.ks,lineHeight:1.8}}>{t.desc}</div>
              </div>
            </div>
          </Fade>))}

        <Fade delay={380+cs.timeline.length*80} show={r}>
          <Card shadow={2} mb={28} pad={mob?"20px 18px":"32px 36px"}>
            <SectionLabel>Year-1 Results</SectionLabel>
            <div style={{borderRadius:10,overflow:"hidden",border:`1px solid ${C.bl}`,marginBottom:28}}>
              <div style={{display:"grid",gridTemplateColumns:mob?"1.2fr .6fr .6fr .6fr":"1.4fr .8fr .8fr .8fr",background:C.sa}}>
                {["Metric","Before","After","Change"].map(h=>(
                  <div key={h} style={{padding:"12px 16px",fontSize:10,fontWeight:700,color:C.kf,letterSpacing:".08em"}}>{h}</div>))}
              </div>
              {cs.results.metrics.map(m=>(
                <div key={m.label} style={{display:"grid",gridTemplateColumns:mob?"1.2fr .6fr .6fr .6fr":"1.4fr .8fr .8fr .8fr",borderTop:`1px solid ${C.bl}`}}>
                  <div style={{padding:"14px 16px",fontSize:13,color:C.k,fontWeight:500}}>{m.label}</div>
                  <div style={{padding:"14px 16px",fontSize:13,color:C.kf,fontFamily:mn}}>{m.before}</div>
                  <div style={{padding:"14px 16px",fontSize:13,color:C.t,fontWeight:600,fontFamily:mn}}>{m.after}</div>
                  <div style={{padding:"14px 16px",fontSize:13,color:C.t,fontWeight:600,fontFamily:mn}}>{m.delta}</div>
                </div>))}
            </div>
            <div style={{fontSize:10,fontWeight:700,color:C.kf,letterSpacing:".06em",marginBottom:14}}>UTILIZATION TREND BY MONTH</div>
            <div style={{display:"flex",alignItems:"flex-end",gap:5,height:90}}>
              {mo.map((v,i)=>(
                <div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
                  <div style={{fontSize:9,color:i===mo.length-1?C.t:C.kf,fontFamily:mn,fontWeight:600}}>{v}%</div>
                  <div style={{width:"100%",background:i<1?`${C.kf}30`:C.t,borderRadius:4,
                    height:`${(v/moMax)*64}px`,opacity:i<1?.4:.6+(i/mo.length)*.4,transition:"height .5s ease"}}/>
                  <div style={{fontSize:8,color:C.kf}}>{i===0?"Pre":`M${i}`}</div>
                </div>))}
            </div>
          </Card>
        </Fade>

        <Fade delay={380+cs.timeline.length*80+100} show={r}>
          <div style={{padding:mob?"20px 18px":"32px 40px",background:C.sf,borderRadius:14,border:`1px solid ${C.b}`,borderLeft:`4px solid ${cs.color}`,marginBottom:28}}>
            <div style={{fontSize:mob?16:20,color:C.k,lineHeight:1.7,fontFamily:dp,fontStyle:"italic",marginBottom:16}}>"{cs.quote}"</div>
            <div style={{fontSize:13,fontWeight:600,color:cs.color}}>— {cs.quoteAuthor}, {cs.org}</div>
          </div>
        </Fade>

        <Fade delay={380+cs.timeline.length*80+200} show={r}>
          <Card mb={0}>
            <SectionLabel>What happened next</SectionLabel>
            <div style={{fontSize:14,color:C.ks,lineHeight:1.85}}>{cs.secondOrder}</div>
          </Card>
        </Fade>

        <div style={{marginTop:mob?28:48,paddingTop:24,borderTop:`1px solid ${C.bl}`,display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:12}}>
          <Btn onClick={()=>setSel(null)} v="secondary">← All Case Studies</Btn>
          <Btn v="accent">Download PDF</Btn>
        </div>
        <CrossNav current="casestudy" onNav={n=>{onHome();setTimeout(()=>document.querySelector(`[data-path="${n}"]`)?.click(),100)}}/>
      </div>
    </div>);
}


function PathCard({p,onClick,ready,i}){
  const{mob}=useM();
  const[h,setH]=useState(false);
  const icons={
    prospect:<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><rect x="2" y="8" width="4" height="10" rx="1" fill={h?p.color:`${p.color}50`}/><rect x="8" y="4" width="4" height="14" rx="1" fill={h?p.color:`${p.color}70`}/><rect x="14" y="1" width="4" height="17" rx="1" fill={p.color}/></svg>,
    customer:<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="8" stroke={p.color} strokeWidth="2"/><path d="M6 10l3 3 5-6" stroke={p.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
    casestudy:<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M4 3h12a1 1 0 011 1v12a1 1 0 01-1 1H4a1 1 0 01-1-1V4a1 1 0 011-1z" stroke={p.color} strokeWidth="1.5"/><path d="M7 7h6M7 10h6M7 13h4" stroke={p.color} strokeWidth="1.5" strokeLinecap="round"/></svg>,
  };
  return(
    <Fade delay={200+i*120} show={ready} style={{height:"100%"}}>
      <div data-path={p.k} onClick={onClick} onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}
        style={{padding:"36px 32px 32px",cursor:"pointer",background:C.sf,transition:"all .3s cubic-bezier(.16,1,.3,1)",
          height:"100%",boxSizing:"border-box",display:"flex",flexDirection:"column",
          border:`1.5px solid ${h?p.color+"40":C.b}`,borderRadius:14,
          transform:h?"translateY(-3px)":"none",boxShadow:h?sh2:sh1}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:28}}>
          <div style={{width:44,height:44,borderRadius:12,background:`${p.color}08`,border:`1.5px solid ${p.color}20`,
            display:"flex",alignItems:"center",justifyContent:"center",transition:"all .3s",
            ...(h?{background:`${p.color}14`,borderColor:`${p.color}35`}:{})}}>{icons[p.k]}</div>
          <div style={{fontSize:9,fontWeight:700,color:p.color,letterSpacing:".12em",textTransform:"uppercase",
            background:`${p.color}08`,padding:"4px 10px",borderRadius:4}}>{p.label}</div>
        </div>
        <div style={{fontSize:22,fontWeight:400,color:C.k,marginBottom:12,lineHeight:1.2,fontFamily:dp}}>{p.title}</div>
        <div style={{fontSize:13,color:C.ks,lineHeight:1.75,flex:1}}>{p.desc}</div>
        <div style={{marginTop:"auto",paddingTop:28,fontSize:13,fontWeight:600,color:h?p.color:C.kf,transition:"all .25s",
          display:"flex",alignItems:"center",gap:8}}>Explore <span style={{transition:"transform .25s cubic-bezier(.16,1,.3,1)",
            transform:h?"translateX(4px)":"none",display:"inline-block",fontSize:16}}>→</span></div>
      </div>
    </Fade>
  );
}

export default function App(){
  const{mob}=useM();
  const[splash,setSplash]=useState(true);
  const[splashPhase,setSplashPhase]=useState(0);
  const[path,setPath_]=useState(null);const setPath=(p)=>{window.scrollTo(0,0);setPath_(p)};const[ready,setReady]=useState(false);

  useEffect(()=>{
    setTimeout(()=>setSplashPhase(1),200);
    setTimeout(()=>setSplashPhase(2),1200);
    setTimeout(()=>setSplashPhase(3),3000);
    setTimeout(()=>{setSplash(false);setTimeout(()=>setReady(true),80)},3400);
  },[]);

  useInjectStyles();

  /* ── SPLASH SCREEN ── */
  if(splash)return(
    <div style={{minHeight:"100vh",background:"#0F172A",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:bd,
      transition:"opacity .5s",opacity:splashPhase>=3?0:1}}>
      <div style={{textAlign:"center"}}>
        <div style={{opacity:splashPhase>=1?1:0,transform:splashPhase>=1?"scale(1)":"scale(.8)",transition:"all .8s cubic-bezier(.16,1,.3,1)",marginBottom:40}}>
          <svg width="48" height="48" viewBox="0 0 20 20"><rect width="20" height="20" rx="5" fill="#1E293B"/>
            <path d="M5 8L10 5L15 8L10 11Z" fill="none" stroke={C.t} strokeWidth="1.3" strokeLinejoin="round"/>
            <path d="M5 10.5L10 13.5L15 10.5" fill="none" stroke="#5EC4B6" strokeWidth="1" strokeLinejoin="round" opacity=".4"/></svg>
        </div>
        <div style={{opacity:splashPhase>=2?1:0,transform:splashPhase>=2?"translateY(0)":"translateY(16px)",transition:"all .7s cubic-bezier(.16,1,.3,1)"}}>
          <div style={{fontSize:mob?22:36,fontWeight:400,color:"#F8FAFC",fontFamily:dp,letterSpacing:"-.02em",lineHeight:1.2}}>
            What is your patient access<br/>actually worth?
          </div>
        </div>
      </div>
    </div>
  );

  if(path==="prospect")return <ProspectPath onHome={()=>setPath(null)}/>;
  if(path==="customer")return <CustomerPath onHome={()=>setPath(null)}/>;
  if(path==="casestudy")return <CaseStudyPath onHome={()=>setPath(null)}/>;

  /* ── HOME: Clean choice ── */
  return(
    <div style={{minHeight:"100vh",background:C.bg,fontFamily:bd,color:C.k,display:"flex",flexDirection:"column"}}>
      <div style={{borderBottom:`1px solid ${C.b}`,padding:mob?"0 16px":"0 56px",height:mob?50:58,display:"flex",justifyContent:"space-between",alignItems:"center",
        background:"rgba(255,255,255,.92)",backdropFilter:"blur(16px)",WebkitBackdropFilter:"blur(16px)"}}>
        <div style={{display:"flex",alignItems:"center",gap:12}}><Logo/><span style={{fontSize:13,fontWeight:800,letterSpacing:".14em"}}>TETHER</span></div>
        <div style={{display:"flex",gap:16,alignItems:"center"}}>
          {!mob&&["HIPAA","SOC 2","Epic & Cerner","HL7 FHIR"].map(b=>(
            <span key={b} style={{fontSize:8,fontWeight:700,color:C.kf,letterSpacing:".06em"}}>{b}</span>))}
        </div>
      </div>

      {/* Centered hero question */}
      <div style={{flex:1,display:"flex",flexDirection:"column",justifyContent:"center",maxWidth:980,margin:"0 auto",padding:mob?"0 20px":"0 56px",width:"100%",boxSizing:"border-box"}}>
        <Fade show={ready}>
          <div style={{textAlign:"center",marginBottom:56}}>
            <div style={{display:"inline-block",fontSize:10,fontWeight:700,color:C.t,letterSpacing:".18em",marginBottom:20,
              background:C.tb,padding:"6px 14px",borderRadius:5,border:`1px solid ${C.tc}`}}>AI-POWERED ACCESS INTELLIGENCE</div>
            <h1 style={{fontSize:mob?28:44,fontWeight:400,lineHeight:1.12,margin:"0 0 16px",fontFamily:dp,letterSpacing:"-.02em"}}>What brings you here?</h1>
            <p style={{fontSize:15,color:C.ks,lineHeight:1.7,margin:0}}>Choose your path. Every calculation is transparent, sourced, and exportable.</p>
          </div>
        </Fade>

        <div style={{display:"grid",gridTemplateColumns:mob?"1fr":"1fr 1fr 1fr",gap:mob?14:20,alignItems:"stretch"}}>
          {[{k:"prospect",label:"New Health System",title:"Build Your Case",desc:"Model your capacity, quantify where access breaks down, and project what Tether would unlock. Five steps, fully sourced.",color:C.t},
            {k:"customer",label:"Current Customer",title:"Prove Your Value",desc:"Measure what Tether delivered in dollars and patients. Build a board-ready case, then model expansion.",color:C.a},
            {k:"casestudy",label:"Case Studies",title:"See Real Results",desc:"442 providers, $14.8M recovered, 313% average ROI. Three documented outcomes across specialties.",color:C.s},
          ].map((p,i)=><PathCard key={p.k} p={p} i={i} ready={ready} onClick={()=>setPath(p.k)}/>)}
        </div>
      </div>

      <div style={{borderTop:`1px solid ${C.b}`,padding:mob?"16px 20px":"20px 56px",display:"flex",justifyContent:"space-between",background:C.sf,flexWrap:"wrap",gap:8}}>
        <span style={{fontSize:9,fontWeight:700,color:C.kf,letterSpacing:".12em"}}>BUILT BY BRAD LARMIE</span>
        <span style={{fontSize:9,fontWeight:700,color:C.kf,letterSpacing:".08em"}}>MONOLITH GREY · VALUE ENGINEERING</span>
      </div>
    </div>
  );
}
