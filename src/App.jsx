import { useState, useEffect, useRef, useMemo } from "react";

/* ═══════════════════════════════════════════
   TETHER — AI-Powered Access Intelligence
   V7 — Premium Design Overhaul
   ═══════════════════════════════════════════ */

const C={
  bg:"#F8FAFB",sf:"#FFFFFF",sa:"#F1F5F9",sh:"#F8FAFC",
  b:"#E2E8F0",bl:"#EDF2F7",bd:"#CBD5E1",
  k:"#0F172A",km:"#334155",ks:"#64748B",kf:"#94A3B8",kg:"#CBD5E1",
  t:"#0D9488",tb:"#F0FDFA",tc:"#99F6E4",td:"#115E59",
  a:"#D97706",ab:"#FFFBEB",ac:"#FDE68A",ad:"#92400E",
  r:"#DC2626",rb:"#FEF2F2",rc:"#FECACA",
  s:"#2563EB",sb:"#EFF6FF",sc:"#BFDBFE",
};
const sh1="0 1px 2px rgba(15,23,42,.06), 0 1px 3px rgba(15,23,42,.04)";
const sh2="0 2px 4px rgba(15,23,42,.04), 0 6px 16px rgba(15,23,42,.06)";
const sh3="0 4px 6px rgba(15,23,42,.03), 0 12px 32px rgba(15,23,42,.08)";

const dp=`'Instrument Serif','Georgia',serif`;
const bd=`'Plus Jakarta Sans','Helvetica Neue',sans-serif`;
const mn=`'JetBrains Mono','SF Mono',monospace`;
const FL="https://fonts.googleapis.com/css2?family=Instrument+Serif&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap";

const fmt=n=>{if(Math.abs(n)>=1e6)return`$${(n/1e6).toFixed(1)}M`;if(Math.abs(n)>=1e3)return`$${Math.round(n/1e3).toLocaleString()}K`;return`$${Math.round(n).toLocaleString()}`};
const fmtK=n=>n>=1000?`${(n/1000).toFixed(1)}K`:n.toLocaleString();

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

function Card({children,pad="28px 32px",shadow=1,mb=20,style={}}){
  return <div style={{padding:pad,background:C.sf,border:`1px solid ${shadow>1?C.bd:C.b}`,borderRadius:12,
    boxShadow:shadow===0?"none":shadow===1?sh1:shadow===2?sh2:sh3,marginBottom:mb,...style}}>{children}</div>;
}

function SectionLabel({children}){
  return <div style={{fontSize:10,fontWeight:700,color:C.kf,letterSpacing:".12em",textTransform:"uppercase",fontFamily:bd,marginBottom:20}}>{children}</div>;
}

function PageHead({title,sub}){
  return <div style={{marginBottom:48}}>
    <h1 style={{fontSize:38,fontWeight:400,color:C.k,fontFamily:dp,margin:"0 0 14px",lineHeight:1.12,letterSpacing:"-.015em"}}>{title}</h1>
    {sub&&<p style={{fontSize:15,color:C.ks,lineHeight:1.75,margin:0,maxWidth:500,fontFamily:bd}}>{sub}</p>}
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
      <div style={{position:"relative",height:36,display:"flex",alignItems:"center"}}>
        <div style={{position:"absolute",left:0,right:0,height:5,background:C.bl,borderRadius:3}}/>
        <div style={{position:"absolute",left:0,width:`${pct}%`,height:5,background:ac,borderRadius:3,transition:"width .08s"}}/>
        <input type="range" min={min} max={max} step={step} value={value} onChange={e=>onChange(+e.target.value)}
          style={{position:"absolute",width:"100%",height:36,opacity:0,cursor:"pointer",zIndex:2}}/>
        <div style={{position:"absolute",left:`${pct}%`,transform:"translateX(-50%)",
          width:h?20:16,height:h?20:16,borderRadius:"50%",background:C.sf,border:`2.5px solid ${ac}`,
          boxShadow:h?`0 0 0 5px ${ac}18, ${sh2}`:sh1,transition:"all .2s cubic-bezier(.16,1,.3,1)",pointerEvents:"none",zIndex:1}}/>
      </div>
      {note&&<div style={{fontSize:11,color:C.kf,marginTop:10,fontFamily:bd}}>{note}</div>}
    </div>
  );
}

function Logo(){return <svg width="20" height="20" viewBox="0 0 20 20"><rect width="20" height="20" rx="5" fill={C.k}/>
  <path d="M5 8L10 5L15 8L10 11Z" fill="none" stroke={C.t} strokeWidth="1.3" strokeLinejoin="round"/>
  <path d="M5 10.5L10 13.5L15 10.5" fill="none" stroke="#5EC4B6" strokeWidth="1" strokeLinejoin="round" opacity=".4"/></svg>}

function TopBar({onHome,ctx}){return(
  <div style={{borderBottom:`1px solid ${C.b}`,padding:"0 48px",height:58,display:"flex",justifyContent:"space-between",alignItems:"center",
    background:"rgba(255,255,255,.85)",backdropFilter:"blur(16px)",WebkitBackdropFilter:"blur(16px)",position:"sticky",top:0,zIndex:100}}>
    <div onClick={onHome} style={{cursor:"pointer",display:"flex",alignItems:"center",gap:12}}>
      <Logo/><span style={{fontSize:13,fontWeight:800,letterSpacing:".14em",color:C.k,fontFamily:bd}}>TETHER</span>
      {ctx&&<><div style={{width:1,height:18,background:C.bl,margin:"0 8px"}}/><span style={{fontSize:12,fontWeight:500,color:C.ks,fontFamily:bd}}>{ctx}</span></>}
    </div></div>)}

function Steps({steps,cur,go}){return(
  <div style={{display:"flex",borderBottom:`1px solid ${C.b}`,background:C.sf,paddingLeft:48,gap:0}}>
    {steps.map((s,i)=>{
      const active=i===cur;const done=i<cur;
      return <div key={s} onClick={()=>i<=cur&&go(i)} style={{
        padding:"15px 28px 14px",fontSize:10,fontWeight:700,letterSpacing:".1em",fontFamily:bd,
        color:active?C.k:done?C.t:C.kf,
        borderBottom:active?`2.5px solid ${C.t}`:"2.5px solid transparent",
        cursor:i<=cur?"pointer":"default",transition:"all .2s",marginBottom:-1}}>
        <span style={{display:"inline-flex",alignItems:"center",justifyContent:"center",
          width:18,height:18,borderRadius:"50%",fontSize:9,fontWeight:700,fontFamily:mn,marginRight:10,
          background:done?C.t:active?C.k:C.bl,color:done||active?"#fff":C.kf,
          transition:"all .25s"}}>{done?"✓":i+1}</span>{s}</div>})}</div>)}

function Btn({children,onClick,v="primary",disabled}){
  const[h,setH]=useState(false);
  const styles={
    primary:{padding:"13px 32px",borderRadius:8,border:"none",
      background:h?C.km:C.k,color:"#fff",fontSize:13,fontWeight:600,fontFamily:bd,cursor:"pointer",letterSpacing:".01em",
      boxShadow:h?`0 6px 20px rgba(15,23,42,.2)`:sh1,transition:"all .25s cubic-bezier(.16,1,.3,1)",
      transform:h?"translateY(-1px)":"none"},
    secondary:{padding:"12px 24px",borderRadius:8,border:`1.5px solid ${C.b}`,background:h?C.sa:C.sf,
      color:C.km,fontSize:13,fontWeight:600,fontFamily:bd,cursor:disabled?"default":"pointer",
      opacity:disabled?.35:1,transition:"all .2s",transform:h&&!disabled?"translateY(-1px)":"none",
      boxShadow:h&&!disabled?sh1:"none"},
    accent:{padding:"12px 28px",borderRadius:8,border:`1.5px solid ${C.tc}`,background:h?C.tb:C.sf,
      color:C.td,fontSize:13,fontWeight:600,fontFamily:bd,cursor:"pointer",transition:"all .25s",
      transform:h?"translateY(-1px)":"none",boxShadow:h?`0 4px 12px ${C.t}15`:"none"}};
  return <button onClick={onClick} onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)} style={styles[v]}>{children}</button>;
}

function NavFoot({step,max,onBack,onNext}){return(
  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:72,paddingTop:28,borderTop:`1px solid ${C.bl}`}}>
    <Btn onClick={onBack} v="secondary" disabled={step===0}>Back</Btn>
    {step<max?<Btn onClick={onNext}>Continue</Btn>:<Btn v="accent">Export Summary</Btn>}
  </div>)}

function Stat({label,value,sub,color=C.k,bg=C.sf,border=C.b}){return(
  <div style={{padding:"24px 20px",background:bg,border:`1px solid ${border}`,borderRadius:12,boxShadow:sh1}}>
    <div style={{fontSize:10,fontWeight:700,color:bg===C.sf?C.kf:color,letterSpacing:".1em",textTransform:"uppercase",fontFamily:bd,marginBottom:14}}>{label}</div>
    <div style={{fontSize:32,fontWeight:500,color,fontFamily:mn,letterSpacing:"-.04em",lineHeight:1}}>{value}</div>
    {sub&&<div style={{fontSize:11,color:C.kf,marginTop:10,fontFamily:bd}}>{sub}</div>}
  </div>)}

function MethodNote({sp,prov}){
  const[open,setOpen]=useState(false);
  return <div style={{marginTop:32,borderTop:`1px solid ${C.bl}`,paddingTop:24}}>
    <div onClick={()=>setOpen(!open)} style={{cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
      <span style={{fontSize:11,fontWeight:600,color:C.kf,letterSpacing:".06em"}}>METHODOLOGY & ASSUMPTIONS</span>
      <span style={{fontSize:10,color:C.kg,fontFamily:mn}}>{open?"−":"+"}</span>
    </div>
    {open&&<div style={{marginTop:16,fontSize:12,color:C.kf,lineHeight:1.8}}>
      <div style={{marginBottom:12}}>This analysis uses the following inputs and assumptions:</div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"8px 32px",fontSize:11}}>
        <div>Specialty economics: <strong style={{color:C.ks}}>{sp.label}</strong></div>
        <div>Revenue per visit: <strong style={{color:C.ks}}>{fmt(sp.revPerVisit)}</strong></div>
        <div>Downstream multiplier: <strong style={{color:C.ks}}>{sp.downstream}×</strong></div>
        <div>Slots per day per provider: <strong style={{color:C.ks}}>{sp.slotsPerDay}</strong></div>
        <div>Operating weeks per year: <strong style={{color:C.ks}}>50</strong></div>
        <div>Provider count: <strong style={{color:C.ks}}>{prov}</strong></div>
        <div>No-show reduction assumption: <strong style={{color:C.ks}}>50%</strong></div>
        <div>Referral recovery rate: <strong style={{color:C.ks}}>40%</strong></div>
        <div>Platform pricing: <strong style={{color:C.ks}}>$900/provider/mo</strong></div>
        <div>Annual compounding improvement: <strong style={{color:C.ks}}>15%</strong></div>
      </div>
      <div style={{marginTop:12,fontSize:10,color:C.kg}}>Revenue per visit reflects blended reimbursement across payer mix. Downstream multiplier accounts for referrals, procedures, imaging, and ancillary services generated per initial visit. All projections are illustrative and should be validated against your organization's actual financial data.</div>
    </div>}
  </div>;
}

/* Cross-navigation — keeps them in the tool */
function CrossNav({current}){
  const paths=[
    {k:"prospect",label:"Build Your Case",desc:"Model capacity for a new health system",color:C.t},
    {k:"customer",label:"Prove Your Value",desc:"Quantify achieved ROI for existing customers",color:C.a},
    {k:"casestudy",label:"See Real Results",desc:"Read documented outcomes",color:C.s},
  ].filter(p=>p.k!==current);
  return <div style={{marginTop:24,padding:"20px 24px",background:C.sa,borderRadius:6}}>
    <div style={{fontSize:9,fontWeight:700,color:C.kf,letterSpacing:".1em",marginBottom:16}}>CONTINUE EXPLORING</div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
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

/* ═══ PROSPECT PATH ═══ */
function ProspectPath({onHome}){
  const[step,setStep]=useState(0);const[r,setR]=useState(false);
  const[spec,setSpec]=useState("multi");const[prov,setProv]=useState(45);const[daysPerWeek,setDaysPerWeek]=useState(5);
  const[fillRate,setFillRate]=useState(72);const[noShow,setNoShow]=useState(16);const[leakPct,setLeakPct]=useState(20);
  const[targetLift,setTargetLift]=useState(10);
  useEffect(()=>{window.scrollTo(0,0);setR(false);setTimeout(()=>setR(true),30)},[step]);
  const sp=SPECS[spec];const weeksPerYear=50;
  const totalSlots=prov*sp.slotsPerDay*daysPerWeek*weeksPerYear;
  const filledSlots=Math.round(totalSlots*(fillRate/100));const emptySlots=totalSlots-filledSlots;
  const noShowSlots=Math.round(filledSlots*(noShow/100));const actualVisits=filledSlots-noShowSlots;
  const unrealizedSlots=emptySlots+noShowSlots;const unrealizedDirect=unrealizedSlots*sp.revPerVisit;
  const unrealizedDownstream=unrealizedSlots*sp.revPerVisit*(sp.downstream-1);const totalUnrealized=unrealizedDirect+unrealizedDownstream;
  const emptyPerProvPerMonth=Math.round(unrealizedSlots/prov/12);const lostPerProvPerMonth=Math.round(unrealizedDirect/prov/12);
  const leakedReferrals=Math.round(actualVisits*0.35*(leakPct/100));const leakageLoss=leakedReferrals*sp.revPerVisit*sp.downstream;
  const newFillRate=Math.min(fillRate+targetLift,98);const newNoShow=Math.max(noShow-Math.round(noShow*0.50),2);
  const newFilledSlots=Math.round(totalSlots*(newFillRate/100));const newNoShowSlots=Math.round(newFilledSlots*(newNoShow/100));
  const newActualVisits=newFilledSlots-newNoShowSlots;const addlVisits=newActualVisits-actualVisits;
  const addlDirectRev=addlVisits*sp.revPerVisit;const addlDownstream=addlVisits*sp.revPerVisit*(sp.downstream-1);
  const totalAddlValue=addlDirectRev+addlDownstream;const leakRecovery=leakedReferrals*0.40*sp.revPerVisit*sp.downstream;
  const totalTetherImpact=totalAddlValue+leakRecovery;const tetherCost=Math.max(prov*900*12,120000);
  const netImpact=totalTetherImpact-tetherCost;const roiPct=((totalTetherImpact-tetherCost)/tetherCost)*100;
  const paybackMo=Math.max(1,Math.round((tetherCost/totalTetherImpact)*12));
  const yr=[1,2,3].map(y=>({y,impact:totalTetherImpact*(1+(y-1)*0.15),cost:tetherCost*(y===1?1:.85)}));
  const threeYrNet=yr.reduce((a,b)=>a+(b.impact-b.cost),0);

  return(
    <div style={{minHeight:"100vh",background:C.bg,fontFamily:bd}}>
      <TopBar onHome={onHome} ctx="New Health System"/>
      <Steps steps={["YOUR CAPACITY","TODAY'S REALITY","WHAT IF","THE CASE"]} cur={step} go={setStep}/>
      <div style={{maxWidth:740,margin:"0 auto",padding:"48px 40px 32px"}}>

        {step===0&&<Fade show={r}>
          <PageHead title="Let's start with what you have." sub="Every provider in your network represents available capacity. We'll build the economic picture from there."/>
          <div style={{marginBottom:32}}>
            <div style={{fontSize:11,fontWeight:600,color:C.ks,letterSpacing:".05em",textTransform:"uppercase",marginBottom:12}}>Specialty Focus</div>
            <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
              {Object.entries(SPECS).map(([k,v])=>(
                <button key={k} onClick={()=>setSpec(k)} style={{
                  padding:"8px 16px",borderRadius:4,border:`1px solid ${spec===k?v.color:C.b}`,
                  background:spec===k?`${v.color}10`:C.sf,color:spec===k?v.color:C.ks,
                  fontSize:11,fontWeight:spec===k?600:500,fontFamily:bd,cursor:"pointer",transition:"all .15s"}}>{v.label}</button>))}
            </div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 56px"}}>
            <Slider label="Active Providers" value={prov} onChange={setProv} min={5} max={500} step={5} note="Physicians, APPs, and specialists"/>
            <Slider label="Clinic Days Per Week" value={daysPerWeek} onChange={setDaysPerWeek} min={3} max={6} step={1} note="Operating days across locations"/>
          </div>
          <Fade delay={200} show={r}>
            <Card shadow={2}>
              <SectionLabel>Your Total Capacity</SectionLabel>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:24}}>
                <div><div style={{fontSize:28,fontWeight:500,color:C.k,fontFamily:mn,letterSpacing:"-.03em"}}>{totalSlots.toLocaleString()}</div>
                  <div style={{fontSize:11,color:C.kf,marginTop:4}}>available slots / year</div></div>
                <div><div style={{fontSize:28,fontWeight:500,color:sp.color,fontFamily:mn,letterSpacing:"-.03em"}}>{fmt(sp.revPerVisit)}</div>
                  <div style={{fontSize:11,color:C.kf,marginTop:4}}>avg revenue per visit</div></div>
                <div><div style={{fontSize:28,fontWeight:500,color:C.a,fontFamily:mn,letterSpacing:"-.03em"}}>{sp.downstream}×</div>
                  <div style={{fontSize:11,color:C.kf,marginTop:4}}>downstream multiplier</div></div>
              </div>
              <div style={{borderTop:`1px solid ${C.bl}`,marginTop:24,paddingTop:16}}>
                <div style={{fontSize:13,color:C.ks,lineHeight:1.6}}>
                  If every slot were filled and every patient showed up, your {sp.label.toLowerCase()} network would generate
                  <span style={{fontWeight:700,color:C.k,fontFamily:mn}}> {fmt(totalSlots*sp.revPerVisit*sp.downstream)}</span> in total economic value annually.
                </div>
              </div>
            </Card>
          </Fade>
        </Fade>}

        {step===1&&<Fade show={r}>
          <PageHead title="Now, what's actually happening." sub="The gap between your capacity and your reality is where the opportunity lives."/>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 56px"}}>
            <Slider label="Schedule Fill Rate" value={fillRate} onChange={setFillRate} min={40} max={98} step={1} format="%" note={`National ${sp.label.toLowerCase()} median: ${sp.benchUtil}%`} accent={fillRate>=sp.benchUtil?C.t:C.r}/>
            <Slider label="No-Show Rate" value={noShow} onChange={setNoShow} min={2} max={40} step={1} format="%" note="Patients who miss appointments" accent={noShow<=15?C.t:C.r}/>
          </div>
          <Slider label="Referral Leakage" value={leakPct} onChange={setLeakPct} min={5} max={50} step={1} format="%" note="Referrals lost out-of-network" accent={leakPct<=15?C.t:C.r}/>
          <Fade delay={150} show={r}>
            <Card shadow={2}>
              <SectionLabel>Capacity Conversion</SectionLabel>
              <div style={{height:40,borderRadius:6,background:C.bl,overflow:"hidden",display:"flex",marginBottom:16}}>
                <div style={{width:`${(actualVisits/totalSlots)*100}%`,background:C.t,transition:"width .6s ease",borderRadius:"6px 0 0 6px"}}/>
                <div style={{width:`${(noShowSlots/totalSlots)*100}%`,background:C.a,transition:"width .6s ease"}}/>
              </div>
              <div style={{display:"flex",gap:24,marginBottom:24}}>
                {[{c:C.t,l:`Patients seen (${fmtK(actualVisits)})`},{c:C.a,l:`No-shows (${fmtK(noShowSlots)})`},{c:C.bl,l:`Unfilled (${fmtK(emptySlots)})`}].map(x=>(
                  <div key={x.l} style={{display:"flex",alignItems:"center",gap:8}}><div style={{width:12,height:12,borderRadius:3,background:x.c}}/><span style={{fontSize:11,color:C.ks}}>{x.l}</span></div>))}
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12}}>
                {[{l:"REALIZED",v:actualVisits*sp.revPerVisit+actualVisits*sp.revPerVisit*(sp.downstream-1),s:`${fmtK(actualVisits)} visits + downstream`,bg:C.tb,bc:C.tc,fc:C.t},
                  {l:"UNREALIZED",v:totalUnrealized,s:`${fmtK(unrealizedSlots)} empty + no-show slots`,bg:C.rb,bc:C.rc,fc:C.r},
                  {l:"LEAKED",v:leakageLoss,s:`${fmtK(leakedReferrals)} referrals lost/yr`,bg:C.ab,bc:C.ac,fc:C.a}].map(x=>(
                  <div key={x.l} style={{padding:16,background:x.bg,borderRadius:6,border:`1px solid ${x.bc}`}}>
                    <div style={{fontSize:8,fontWeight:700,color:x.fc,letterSpacing:".08em",marginBottom:8}}>{x.l}</div>
                    <div style={{fontSize:22,fontWeight:500,color:x.fc,fontFamily:mn}}>{fmt(x.v)}</div>
                    <div style={{fontSize:10,color:C.kf,marginTop:4}}>{x.s}</div>
                  </div>))}
              </div>
            </Card>
          </Fade>
          <Fade delay={300} show={r}>
            <div style={{padding:"20px 24px",background:C.sa,borderRadius:6,borderLeft:`3px solid ${C.r}`}}>
              <div style={{fontSize:13,color:C.km,lineHeight:1.7}}>
                Each of your <strong>{prov} providers</strong> has roughly <strong style={{color:C.r,fontFamily:mn}}>{emptyPerProvPerMonth} unfilled slots per month</strong> — that's
                <strong style={{color:C.r,fontFamily:mn}}> {fmt(lostPerProvPerMonth)}</strong> in unrealized direct revenue per provider, every month.
              </div>
            </div>
          </Fade>
        </Fade>}

        {step===2&&<Fade show={r}>
          <PageHead title="What if we move the needle?" sub="Tether works across scheduling, referral management, and patient outreach. Drag the slider to see what a realistic improvement means."/>
          <Card shadow={2} mb={24}>
            <Slider label="Fill Rate Improvement" value={targetLift} onChange={setTargetLift} min={3} max={25} step={1} format="%" accent={C.t}
              note={`Moving from ${fillRate}% → ${newFillRate}% fill rate`}/>
            <div style={{marginBottom:24}}>
              <SectionLabel>Provider Schedule · Weekly Snapshot</SectionLabel>
              <div style={{display:"grid",gridTemplateColumns:`repeat(${Math.min(sp.slotsPerDay,20)}, 1fr)`,gap:3}}>
                {Array.from({length:Math.min(sp.slotsPerDay*daysPerWeek,100)}).map((_,i)=>{
                  const tot=sp.slotsPerDay*daysPerWeek;const bef=Math.round(tot*(fillRate/100));const aft=Math.round(tot*(newFillRate/100));
                  return <div key={i} style={{height:16,borderRadius:3,
                    background:i<bef?C.t:i<aft?C.a:C.bl,border:`1px solid ${i<bef?C.td+"60":i<aft?C.ad+"60":C.bd}`,
                    opacity:i<bef?0.65:i<aft?0.85:0.35,transition:"all .25s ease"}}/>;
                })}
              </div>
              <div style={{display:"flex",gap:20,marginTop:12}}>
                {[{c:C.t,o:.65,l:"Currently filled"},{c:C.a,o:.85,l:"Recovered by Tether"},{c:C.bl,o:.35,l:"Remaining open"}].map(x=>(
                  <div key={x.l} style={{display:"flex",alignItems:"center",gap:6}}><div style={{width:12,height:12,borderRadius:3,background:x.c,opacity:x.o}}/><span style={{fontSize:10,color:C.ks}}>{x.l}</span></div>))}
              </div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:24,paddingTop:24,borderTop:`1px solid ${C.bl}`}}>
              <div>
                <div style={{fontSize:9,fontWeight:700,color:C.kf,letterSpacing:".1em",marginBottom:16}}>BEFORE TETHER</div>
                <div style={{display:"flex",alignItems:"baseline",gap:8,marginBottom:8}}>
                  <span style={{fontSize:36,fontWeight:500,color:C.kf,fontFamily:mn}}>{fillRate}%</span>
                  <span style={{fontSize:12,color:C.kg}}>fill rate</span></div>
                <div style={{fontSize:12,color:C.kf}}>{fmtK(actualVisits)} patients / year</div>
              </div>
              <div>
                <div style={{fontSize:9,fontWeight:700,color:C.t,letterSpacing:".1em",marginBottom:16}}>WITH TETHER</div>
                <div style={{display:"flex",alignItems:"baseline",gap:8,marginBottom:8}}>
                  <span style={{fontSize:36,fontWeight:500,color:C.t,fontFamily:mn}}>{newFillRate}%</span>
                  <span style={{fontSize:12,color:C.t}}>fill rate</span></div>
                <div style={{fontSize:12,color:C.km}}>{fmtK(newActualVisits)} patients / year</div>
              </div>
            </div>
          </Card>
          <Fade delay={100} show={r}>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:16}}>
              {[{l:"ADDITIONAL PATIENTS SEEN",v:addlVisits,p:"+"},{l:"ADDITIONAL DIRECT REVENUE",v:addlDirectRev,p:"+$"}].map(x=>(
                <div key={x.l} style={{padding:24,background:C.tb,border:`1px solid ${C.tc}`,borderRadius:6,boxShadow:sh1}}>
                  <div style={{fontSize:9,fontWeight:700,color:C.t,letterSpacing:".08em",marginBottom:12}}>{x.l}</div>
                  <div style={{fontSize:36,fontWeight:500,color:C.t,fontFamily:mn,lineHeight:1}}>{x.p==="+"?"+":""}<AN value={x.v} prefix={x.p==="+"?"":"$"}/></div>
                  <div style={{fontSize:11,color:C.ks,marginTop:8}}>per year across your network</div>
                </div>))}
            </div>
          </Fade>
          <Fade delay={200} show={r}>
            <Card>
              <SectionLabel>Total Economic Impact</SectionLabel>
              {[{l:"Additional visit revenue",v:addlDirectRev,c:C.t},{l:"Downstream value (referrals, procedures, imaging)",v:addlDownstream,c:C.s},{l:"Referral leakage recovery",v:leakRecovery,c:C.a}].map(x=>(
                <div key={x.l} style={{display:"flex",alignItems:"center",gap:16,marginBottom:12}}>
                  <div style={{width:8,height:8,borderRadius:2,background:x.c,flexShrink:0}}/>
                  <div style={{flex:1,fontSize:13,color:C.ks}}>{x.l}</div>
                  <div style={{fontSize:14,fontWeight:600,color:C.k,fontFamily:mn}}>{fmt(x.v)}</div>
                </div>))}
              <div style={{borderTop:`1px solid ${C.bl}`,marginTop:16,paddingTop:16,display:"flex",justifyContent:"space-between",alignItems:"baseline"}}>
                <span style={{fontSize:14,fontWeight:600,color:C.k}}>Total Projected Impact</span>
                <span style={{fontSize:28,fontWeight:500,color:C.t,fontFamily:mn}}><AN value={totalTetherImpact} prefix="$"/></span>
              </div>
            </Card>
          </Fade>
          <Fade delay={300} show={r}>
            <div style={{padding:"20px 24px",background:C.sa,borderRadius:6,borderLeft:`3px solid ${C.t}`}}>
              <div style={{fontSize:13,color:C.km,lineHeight:1.75}}>
                A <strong>{targetLift}-point</strong> improvement in fill rate means <strong>{fmtK(addlVisits)} more patients</strong> receiving care at your facilities every year — and
                <strong style={{color:C.t,fontFamily:mn}}> {fmt(totalTetherImpact)}</strong> in total economic value your organization isn't capturing today.
              </div>
            </div>
          </Fade>
        </Fade>}

        {step===3&&<Fade show={r}>
          <PageHead title="The case for Tether." sub={`${sp.label} · ${prov} providers · ${fmtK(actualVisits)} current annual visits`}/>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:10,marginBottom:24}}>
            <Fade delay={0} show={r}><Stat label="Net Year-1 Impact" value={<AN value={netImpact} prefix="$"/>} color={C.t} bg={C.tb} border={C.tc}/></Fade>
            <Fade delay={80} show={r}><Stat label="Return on Investment" value={<AN value={roiPct} suffix="%"/>} color={C.a}/></Fade>
            <Fade delay={160} show={r}><Stat label="Payback" value={<AN value={paybackMo} suffix=" mo"/>} color={C.s} sub="Full cost recovery"/></Fade>
            <Fade delay={240} show={r}><Stat label="Patients Added" value={<>+<AN value={addlVisits}/></>} color={C.t} sub="per year"/></Fade>
          </div>
          <Fade delay={300} show={r}>
            <div style={{padding:"24px 28px",background:C.sa,borderRadius:6,borderLeft:`3px solid ${C.t}`,marginBottom:24}}>
              <p style={{fontSize:14,color:C.km,lineHeight:1.85,margin:0}}>
                Your {sp.label.toLowerCase()} network currently converts <strong>{fillRate}%</strong> of available capacity into patient visits, leaving
                an estimated <strong style={{color:C.r}}>{fmt(totalUnrealized)}</strong> in unrealized economic value on the table annually.
                No-shows account for <strong>{fmtK(noShowSlots)}</strong> lost appointments, and referral leakage diverts another
                <strong> {fmtK(leakedReferrals)}</strong> patients to out-of-network providers.
              </p>
              <p style={{fontSize:14,color:C.km,lineHeight:1.85,margin:"16px 0 0"}}>
                By improving fill rate by <strong>{targetLift} points</strong> and reducing no-shows by 50%, Tether would add
                <strong style={{color:C.t}}> {fmtK(addlVisits)} patient visits</strong> annually — generating
                <strong style={{color:C.t}}> {fmt(totalTetherImpact)}</strong> in total economic value against a
                <strong> {fmt(tetherCost)}</strong> annual investment. The platform pays for itself in <strong>{paybackMo} months</strong>.
              </p>
            </div>
          </Fade>
          <Fade delay={420} show={r}>
            <Card mb={24}>
              <SectionLabel>3-Year Projection</SectionLabel>
              <div style={{display:"grid",gridTemplateColumns:".8fr 1fr 1fr 1fr",gap:0,borderRadius:6,overflow:"hidden",border:`1px solid ${C.bl}`}}>
                {["","Tether Impact","Platform Cost","Net Value"].map((h,i)=>(
                  <div key={i} style={{padding:"10px 14px",background:C.sa,fontSize:9,fontWeight:700,color:C.kf,letterSpacing:".06em",borderBottom:`1px solid ${C.bl}`,textAlign:i?"right":"left"}}>{h}</div>))}
                {yr.map((y,yi)=>([null,y.impact,y.cost,y.impact-y.cost].map((v,i)=>(
                  <div key={`${yi}${i}`} style={{padding:"12px 14px",fontSize:12,fontFamily:i?mn:bd,fontWeight:i===0?600:500,
                    color:i===3?(v>0?C.t:C.r):!i?C.k:C.km,textAlign:i?"right":"left",
                    borderBottom:yi<2?`1px solid ${C.bl}`:"none",background:C.sf}}>{i===0?`Year ${y.y}`:fmt(v)}</div>))))}
                {[null,null,null,threeYrNet].map((v,i)=>(
                  <div key={`t${i}`} style={{padding:"12px 14px",fontSize:12,fontFamily:i?mn:bd,fontWeight:700,
                    color:i===3?C.t:C.k,textAlign:i?"right":"left",borderTop:`2px solid ${C.b}`,background:C.sa}}>
                    {!i?"3-Year Total":i===3?fmt(v):""}</div>))}
              </div>
              <div style={{fontSize:10,color:C.kg,marginTop:12}}>15% annual improvement compounding. 15% platform discount years 2–3.</div>
            </Card>
          </Fade>
          <Fade delay={540} show={r}>
            <Card mb={24}>
              <SectionLabel>Investment in Context</SectionLabel>
              {[{l:"Unrealized value",v:totalUnrealized,c:C.r,bg:C.rb,w:"100%"},{l:"Tether investment",v:tetherCost,c:C.t,bg:C.tb,w:`${Math.max((tetherCost/totalUnrealized)*100,3)}%`}].map(x=>(
                <div key={x.l} style={{marginBottom:16}}>
                  <div style={{height:32,borderRadius:6,background:x.bg,overflow:"hidden",marginBottom:8}}>
                    <div style={{height:"100%",width:x.w,background:`${x.c}25`,borderRadius:6,transition:"width .8s ease"}}/></div>
                  <div style={{display:"flex",justifyContent:"space-between"}}><span style={{fontSize:12,color:C.ks}}>{x.l}</span><span style={{fontSize:13,fontWeight:600,color:x.c,fontFamily:mn}}>{fmt(x.v)}</span></div>
                </div>))}
            </Card>
          </Fade>
          <Fade delay={640} show={r}>
            <Card shadow={2} mb={0} pad="28px">
              <SectionLabel>Export Preview · Executive Summary</SectionLabel>
              <div style={{padding:"24px 28px",background:C.bg,borderRadius:6,border:`1px solid ${C.bl}`}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:16}}>
                  <div><div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}><Logo/><span style={{fontSize:10,fontWeight:700,letterSpacing:".12em"}}>TETHER</span></div>
                    <div style={{fontSize:8,color:C.kf}}>Access Intelligence Platform · Value Analysis</div></div>
                  <div style={{fontSize:8,color:C.kf,textAlign:"right"}}>Prepared for: [Organization]<br/>{new Date().toLocaleDateString('en-US',{month:'long',day:'numeric',year:'numeric'})}</div>
                </div>
                <div style={{borderTop:`1px solid ${C.bl}`,paddingTop:16}}>
                  <div style={{fontSize:14,fontWeight:400,color:C.k,fontFamily:dp,marginBottom:8}}>{sp.label} · {prov} Providers</div>
                  <div style={{display:"flex",gap:32}}>
                    {[{l:"Net Impact",v:fmt(netImpact),c:C.t},{l:"ROI",v:`${Math.round(roiPct)}%`,c:C.a},{l:"Payback",v:`${paybackMo} mo`,c:C.s},{l:"Patients",v:`+${fmtK(addlVisits)}`,c:C.t}].map(x=>(
                      <div key={x.l}><div style={{fontSize:16,fontWeight:500,color:x.c,fontFamily:mn}}>{x.v}</div>
                        <div style={{fontSize:8,color:C.kf,letterSpacing:".04em",fontWeight:600}}>{x.l.toUpperCase()}</div></div>))}
                  </div>
                </div>
              </div>
            </Card>
          </Fade>
          <Fade delay={720} show={r}><div style={{textAlign:"center",marginTop:32}}>
            <div style={{display:"flex",gap:12,justifyContent:"center"}}><Btn>Schedule an Access Review</Btn><Btn v="accent">Export Full Summary</Btn></div>
            <div style={{fontSize:10,color:C.kg,marginTop:12}}>30-minute consultation with a Tether access strategist</div>
          </div></Fade>
          <Fade delay={800} show={r}><MethodNote sp={sp} prov={prov}/></Fade>
          <Fade delay={880} show={r}><CrossNav current="prospect" onNav={n=>{onHome();setTimeout(()=>document.querySelector(`[data-path="${n}"]`)?.click(),100)}}/></Fade>
        </Fade>}
        <NavFoot step={step} max={3} onBack={()=>step>0?setStep(step-1):onHome()} onNext={()=>setStep(step+1)}/>
      </div>
    </div>
  );
}

/* ═══ PROVE YOUR VALUE — Existing Customer ═══ */
function CustomerPath({onHome}){
  const[step,setStep]=useState(0);const[r,setR]=useState(false);
  const[spec,setSpec]=useState("multi");
  const[bProv,setBProv]=useState(45);const[bFill,setBFill]=useState(71);const[bNoShow,setBNoShow]=useState(17);
  const[bLeak,setBLeak]=useState(24);
  const[bRevPerVisit,setBRevPerVisit]=useState(null);const[monthsLive,setMonthsLive]=useState(8);
  const[cFill,setCFill]=useState(85);const[cNoShow,setCNoShow]=useState(7);const[cLeak,setCLeak]=useState(11);
  const[expProv,setExpProv]=useState(120);const[expSpecs,setExpSpecs]=useState(["ortho","cardio"]);

  useEffect(()=>{window.scrollTo(0,0);setR(false);setTimeout(()=>setR(true),30)},[step]);
  const sp=SPECS[spec];const rpv=bRevPerVisit||sp.revPerVisit;
  const daysPerWeek=5;const weeksPerYear=50;const totalSlots=bProv*sp.slotsPerDay*daysPerWeek*weeksPerYear;
  const bFilled=Math.round(totalSlots*(bFill/100));const bNS=Math.round(bFilled*(bNoShow/100));const bActual=bFilled-bNS;
  const bLeaked=Math.round(bActual*0.35*(bLeak/100));
  const cFilled=Math.round(totalSlots*(cFill/100));const cNS=Math.round(cFilled*(cNoShow/100));const cActual=cFilled-cNS;
  const cLeaked=Math.round(cActual*0.35*(cLeak/100));
  const addlVisits=cActual-bActual;const addlRev=addlVisits*rpv;const addlDownstream=addlVisits*rpv*(sp.downstream-1);
  const leakRecov=Math.max(bLeaked-cLeaked,0)*rpv*sp.downstream;const totalValue=addlRev+addlDownstream+leakRecov;
  const tetherCost=Math.max(bProv*900*12,120000);const achievedROI=((totalValue-tetherCost)/tetherCost)*100;
  const perDollar=totalValue/tetherCost;const perProvPerMonth=Math.round(totalValue/bProv/12);
  const toggleExpSpec=(sk)=>setExpSpecs(p=>p.includes(sk)?p.filter(x=>x!==sk):[...p,sk]);
  const expSlots=expProv*sp.slotsPerDay*daysPerWeek*weeksPerYear;const expLiftPts=cFill-bFill;
  const expNewFill=Math.min(bFill+expLiftPts,98);const expNSReduction=(bNoShow-cNoShow)/bNoShow;
  const expFilled=Math.round(expSlots*(expNewFill/100));const expNewNS=Math.max(bNoShow*(1-expNSReduction),2);
  const expNSSlots=Math.round(expFilled*(expNewNS/100));const expActual=expFilled-expNSSlots;
  const expAvgRev=expSpecs.length?expSpecs.reduce((s,k)=>s+(SPECS[k]?.revPerVisit||285),0)/expSpecs.length:rpv;
  const expAvgDown=expSpecs.length?expSpecs.reduce((s,k)=>s+(SPECS[k]?.downstream||2),0)/expSpecs.length:sp.downstream;
  const expBaseActual=Math.round(expSlots*(bFill/100)*(1-bNoShow/100));
  const expAddlVisits=expActual-expBaseActual;const expTotalImpact=expAddlVisits*expAvgRev+expAddlVisits*expAvgRev*(expAvgDown-1);
  const expCost=Math.max(expProv*850*12,120000);const expROI=((expTotalImpact-expCost)/expCost)*100;

  const metrics=[
    {label:"Fill Rate",b:bFill,a:cFill,setB:setBFill,setA:setCFill,minB:40,maxB:98,minA:bFill,maxA:98,u:"%",good:"up"},
    {label:"No-Show Rate",b:bNoShow,a:cNoShow,setB:setBNoShow,setA:setCNoShow,minB:2,maxB:40,minA:1,maxA:bNoShow,u:"%",good:"dn"},
    {label:"Referral Leakage",b:bLeak,a:cLeak,setB:setBLeak,setA:setCLeak,minB:5,maxB:50,minA:2,maxA:bLeak,u:"%",good:"dn"},
  ];

  return(
    <div style={{minHeight:"100vh",background:C.bg,fontFamily:bd}}>
      <TopBar onHome={onHome} ctx="Prove Your Value"/>
      <Steps steps={["BEFORE & AFTER","THE IMPACT","EXPANSION"]} cur={step} go={setStep}/>
      <div style={{maxWidth:740,margin:"0 auto",padding:"48px 40px 32px"}}>

        {/* ── STEP 0: Before & After — one view ── */}
        {step===0&&<Fade show={r}>
          <PageHead title="Show us the before and after." sub="Select your specialty and set your metrics. Left is where you started — right is where you are now."/>

          {/* Compact org bar */}
          <Card shadow={1} mb={24} pad="20px 28px">
            <div style={{display:"flex",alignItems:"center",gap:28,flexWrap:"wrap"}}>
              <div style={{display:"flex",alignItems:"center",gap:10}}>
                <span style={{fontSize:9,fontWeight:700,color:C.kf,letterSpacing:".06em"}}>SPECIALTY</span>
                <select value={spec} onChange={e=>setSpec(e.target.value)}
                  style={{padding:"7px 14px",borderRadius:6,border:`1px solid ${C.b}`,background:C.sf,fontSize:12,fontFamily:bd,color:C.k,cursor:"pointer",outline:"none"}}>
                  {Object.entries(SPECS).map(([k,v])=><option key={k} value={k}>{v.label}</option>)}
                </select>
              </div>
              {[{l:"PROVIDERS",v:bProv,set:setBProv,min:5,max:500,step:5},
                {l:"MONTHS LIVE",v:monthsLive,set:setMonthsLive,min:1,max:36,step:1},
                {l:"REV/VISIT",v:rpv,set:setBRevPerVisit,min:100,max:800,step:5,fmt:true}
              ].map(x=>(
                <div key={x.l} style={{display:"flex",alignItems:"center",gap:8}}>
                  <span style={{fontSize:9,fontWeight:700,color:C.kf,letterSpacing:".06em"}}>{x.l}</span>
                  <div style={{position:"relative",display:"flex",alignItems:"center"}}>
                    <span style={{fontSize:17,fontWeight:600,color:C.k,fontFamily:mn,minWidth:x.fmt?48:28,textAlign:"right"}}>{x.fmt?fmt(x.v):x.v}</span>
                    <div style={{width:64,height:24,position:"relative",marginLeft:8,display:"flex",alignItems:"center"}}>
                      <div style={{position:"absolute",left:0,right:0,height:2,background:C.bl,borderRadius:1}}/>
                      <div style={{position:"absolute",left:0,width:`${((x.v-x.min)/(x.max-x.min))*100}%`,height:2,background:C.t,borderRadius:1}}/>
                      <input type="range" min={x.min} max={x.max} step={x.step} value={x.v} onChange={e=>x.set(+e.target.value)}
                        style={{position:"absolute",width:"100%",height:24,opacity:0,cursor:"pointer",zIndex:2}}/>
                      <div style={{position:"absolute",left:`${((x.v-x.min)/(x.max-x.min))*100}%`,transform:"translateX(-50%)",
                        width:8,height:8,borderRadius:"50%",background:C.sf,border:`2px solid ${C.t}`,boxShadow:sh1,pointerEvents:"none",zIndex:1}}/>
                    </div>
                  </div>
                </div>))}
            </div>
          </Card>

          {/* Side by side: Before / After */}
          <Card shadow={2} mb={24} pad="0">
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr"}}>
              {/* Before column */}
              <div style={{padding:"28px 28px",borderRight:`1px solid ${C.bl}`}}>
                <div style={{fontSize:9,fontWeight:700,color:C.r,letterSpacing:".1em",marginBottom:24}}>BEFORE TETHER</div>
                {metrics.map(m=>(
                  <div key={m.label+"b"} style={{marginBottom:24}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",marginBottom:8}}>
                      <span style={{fontSize:11,fontWeight:600,color:C.ks,letterSpacing:".04em",textTransform:"uppercase"}}>{m.label}</span>
                      <span style={{fontSize:20,fontWeight:500,color:C.r,fontFamily:mn}}>{m.b}{m.u==="d"?"d":"%"}</span>
                    </div>
                    <div style={{position:"relative",height:28,display:"flex",alignItems:"center"}}>
                      <div style={{position:"absolute",left:0,right:0,height:3,background:C.bl,borderRadius:2}}/>
                      <div style={{position:"absolute",left:0,width:`${((m.b-m.minB)/(m.maxB-m.minB))*100}%`,height:3,background:`${C.r}60`,borderRadius:2}}/>
                      <input type="range" min={m.minB} max={m.maxB} step={1} value={m.b}
                        onChange={e=>m.setB(+e.target.value)}
                        style={{position:"absolute",width:"100%",height:24,opacity:0,cursor:"pointer",zIndex:2}}/>
                      <div style={{position:"absolute",left:`${((m.b-m.minB)/(m.maxB-m.minB))*100}%`,transform:"translateX(-50%)",
                        width:12,height:12,borderRadius:"50%",background:C.sf,border:`2.5px solid ${C.r}`,boxShadow:sh2,pointerEvents:"none",zIndex:1}}/>
                    </div>
                  </div>
                ))}
              </div>
              {/* After column */}
              <div style={{padding:"28px 28px",background:C.sh}}>
                <div style={{fontSize:9,fontWeight:700,color:C.t,letterSpacing:".1em",marginBottom:24}}>WITH TETHER</div>
                {metrics.map(m=>{
                  const diff=m.a-m.b;const abs=Math.abs(diff);const isGood=m.good==="up"?diff>0:diff<0;
                  return <div key={m.label+"a"} style={{marginBottom:24}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",marginBottom:8}}>
                      <span style={{fontSize:11,fontWeight:600,color:C.ks,letterSpacing:".04em",textTransform:"uppercase"}}>{m.label}</span>
                      <div style={{display:"flex",alignItems:"baseline",gap:8}}>
                        <span style={{fontSize:20,fontWeight:500,color:C.t,fontFamily:mn}}>{m.a}{m.u==="d"?"d":"%"}</span>
                        <span style={{fontSize:11,fontWeight:700,color:isGood?C.t:C.r,fontFamily:mn,background:isGood?C.tb:C.rb,
                          padding:"2px 6px",borderRadius:3}}>{diff>0?"↑":"↓"}{abs}{m.u==="d"?"":"pts"}</span>
                      </div>
                    </div>
                    <div style={{position:"relative",height:28,display:"flex",alignItems:"center"}}>
                      <div style={{position:"absolute",left:0,right:0,height:3,background:C.bl,borderRadius:2}}/>
                      <div style={{position:"absolute",left:0,width:`${((m.a-m.minA)/(m.maxA-m.minA))*100}%`,height:3,background:C.t,borderRadius:2}}/>
                      <input type="range" min={m.minA} max={m.maxA} step={1} value={m.a} onChange={e=>m.setA(+e.target.value)}
                        style={{position:"absolute",width:"100%",height:24,opacity:0,cursor:"pointer",zIndex:2}}/>
                      <div style={{position:"absolute",left:`${((m.a-m.minA)/(m.maxA-m.minA))*100}%`,transform:"translateX(-50%)",
                        width:12,height:12,borderRadius:"50%",background:C.sf,border:`2.5px solid ${C.t}`,boxShadow:`0 2px 8px ${C.t}40`,pointerEvents:"none",zIndex:1}}/>
                    </div>
                  </div>;
                })}
              </div>
            </div>
            {/* Bottom bar: live computed impact preview */}
            <div style={{padding:"16px 28px",borderTop:`1px solid ${C.bl}`,background:C.sa,display:"flex",justifyContent:"space-between",alignItems:"center",
              borderRadius:"0 0 6px 6px"}}>
              <span style={{fontSize:12,color:C.ks}}>
                <strong style={{color:C.k}}>{fmtK(bActual)}</strong> → <strong style={{color:C.t}}>{fmtK(cActual)}</strong> patients/yr
                <span style={{color:C.t,fontWeight:700,fontFamily:mn,marginLeft:8}}>+{fmtK(addlVisits)}</span></span>
              <span style={{fontSize:12,color:C.ks}}>Projected value: <strong style={{color:C.t,fontFamily:mn}}>{fmt(totalValue)}</strong></span>
            </div>
          </Card>
        </Fade>}

        {/* ── STEP 1: The Impact — pure reveal ── */}
        {step===1&&<Fade show={r}>
          <PageHead title="What Tether delivered." sub={`${sp.label} · ${bProv} providers · ${monthsLive} months live`}/>

          {/* Hero metrics */}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:24}}>
            <Fade delay={0} show={r}>
              <div style={{padding:28,background:C.tb,border:`1px solid ${C.tc}`,borderRadius:6,boxShadow:sh2}}>
                <div style={{fontSize:9,fontWeight:700,color:C.t,letterSpacing:".08em",marginBottom:12}}>TOTAL VALUE DELIVERED</div>
                <div style={{fontSize:42,fontWeight:500,color:C.t,fontFamily:mn,lineHeight:1,letterSpacing:"-.04em"}}><AN value={totalValue} prefix="$"/></div>
                <div style={{fontSize:12,color:C.ks,marginTop:12}}>in annualized economic impact</div>
              </div>
            </Fade>
            <Fade delay={80} show={r}>
              <div style={{padding:28,background:C.tb,border:`1px solid ${C.tc}`,borderRadius:6,boxShadow:sh2}}>
                <div style={{fontSize:9,fontWeight:700,color:C.t,letterSpacing:".08em",marginBottom:12}}>ADDITIONAL PATIENTS SEEN</div>
                <div style={{fontSize:42,fontWeight:500,color:C.t,fontFamily:mn,lineHeight:1,letterSpacing:"-.04em"}}>+<AN value={addlVisits}/></div>
                <div style={{fontSize:12,color:C.ks,marginTop:12}}>per year across your network</div>
              </div>
            </Fade>
          </div>
          <Fade delay={160} show={r}>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:24}}>
              <Stat label="Achieved ROI" value={<AN value={achievedROI} suffix="%"/>} color={C.a}/>
              <Stat label="Per $1 Invested" value={<>${perDollar.toFixed(1)} back</>} color={C.t}/>
              <Stat label="Per Provider / Mo" value={<AN value={perProvPerMonth} prefix="$"/>} color={C.t} sub="attributable value"/>
            </div>
          </Fade>

          {/* Value breakdown */}
          <Fade delay={240} show={r}>
            <Card mb={24}>
              <SectionLabel>Where the Value Comes From</SectionLabel>
              {[{l:"Additional visit revenue",v:addlRev,c:C.t,s:`${fmtK(addlVisits)} net new visits × ${fmt(rpv)}`},
                {l:"Downstream value",v:addlDownstream,c:C.s,s:`Referrals, procedures, imaging (${sp.downstream}× multiplier)`},
                {l:"Referral recapture",v:leakRecov,c:C.a,s:`${fmtK(Math.max(bLeaked-cLeaked,0))} referrals kept in-network`}].map(x=>{
                const pct=totalValue>0?((x.v/totalValue)*100):0;
                return <div key={x.l} style={{marginBottom:20}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
                    <div><div style={{fontSize:13,color:C.k,fontWeight:500}}>{x.l}</div>
                      <div style={{fontSize:11,color:C.kg,marginTop:2}}>{x.s}</div></div>
                    <div style={{fontSize:15,fontWeight:600,color:C.k,fontFamily:mn,flexShrink:0,marginLeft:16}}>{fmt(x.v)}</div>
                  </div>
                  <div style={{height:6,borderRadius:3,background:C.bl,overflow:"hidden"}}>
                    <div style={{height:"100%",width:`${pct}%`,background:x.c,borderRadius:3,transition:"width .6s ease"}}/>
                  </div>
                </div>;})}
              <div style={{borderTop:`1px solid ${C.bl}`,paddingTop:16,display:"flex",justifyContent:"space-between",alignItems:"baseline"}}>
                <span style={{fontSize:14,fontWeight:600}}>Total Achieved Value</span>
                <span style={{fontSize:28,fontWeight:500,color:C.t,fontFamily:mn}}><AN value={totalValue} prefix="$"/><span style={{fontSize:13,color:C.kf,fontWeight:400}}> / yr</span></span>
              </div>
            </Card>
          </Fade>

          {/* Executive narrative */}
          <Fade delay={320} show={r}>
            <div style={{padding:"24px 28px",background:C.sa,borderRadius:6,borderLeft:`3px solid ${C.t}`}}>
              <SectionLabel>Executive Summary</SectionLabel>
              <p style={{fontSize:14,color:C.km,lineHeight:1.85,margin:0}}>
                Over <strong>{monthsLive} months</strong>, Tether improved {sp.label.toLowerCase()} fill rate from <strong>{bFill}%</strong> to <strong>{cFill}%</strong> and reduced no-shows from <strong>{bNoShow}%</strong> to <strong>{cNoShow}%</strong>, adding
                <strong style={{color:C.t}}> {fmtK(addlVisits)} patient visits</strong> annually across {bProv} providers.
              </p>
              <p style={{fontSize:14,color:C.km,lineHeight:1.85,margin:"16px 0 0"}}>
                The total economic impact — including downstream referrals, procedures, and referral recapture — is
                <strong style={{color:C.t}}> {fmt(totalValue)}</strong> per year, representing a <strong>{Math.round(achievedROI)}% return</strong> on a {fmt(tetherCost)} investment. Every dollar invested returned <strong>${perDollar.toFixed(1)}</strong>. Per provider, Tether generates <strong style={{fontFamily:mn}}>{fmt(perProvPerMonth)}/month</strong> in attributable value.
              </p>
            </div>
          </Fade>
        </Fade>}

        {/* ── STEP 2: Expansion ── */}
        {step===2&&<Fade show={r}>
          <PageHead title="What if you expanded?" sub="Your results are proven. Here's what the same improvements look like at scale."/>

          {/* What you've proven - compact reminder */}
          <Fade delay={0} show={r}>
            <div style={{padding:"16px 24px",background:C.tb,borderRadius:6,border:`1px solid ${C.tc}`,marginBottom:24,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <span style={{fontSize:12,color:C.ks}}>Your proven performance: <strong style={{color:C.t}}>+{expLiftPts}pt</strong> fill rate · <strong style={{color:C.t}}>{Math.round(expNSReduction*100)}%</strong> no-show reduction · <strong style={{color:C.t}}>{Math.round(achievedROI)}%</strong> ROI</span>
              <span style={{fontSize:10,fontWeight:600,color:C.t,background:`${C.t}15`,padding:"4px 10px",borderRadius:3}}>VALIDATED</span>
            </div>
          </Fade>

          {/* The one slider that matters */}
          <Card shadow={2} mb={24}>
            <Slider label="Expanded Provider Count" value={expProv} onChange={setExpProv} min={bProv} max={1000} step={5}
              note={`Currently: ${bProv} providers → modeling at ${expProv}`} accent={C.s}/>

            <div style={{marginBottom:24}}>
              <div style={{fontSize:11,fontWeight:600,color:C.ks,letterSpacing:".05em",textTransform:"uppercase",marginBottom:12}}>Expansion Specialties</div>
              <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                {Object.entries(SPECS).filter(([k])=>k!==spec&&k!=="multi").map(([k,v])=>(
                  <button key={k} onClick={()=>toggleExpSpec(k)} style={{padding:"7px 14px",borderRadius:4,
                    border:`1px solid ${expSpecs.includes(k)?v.color:C.b}`,background:expSpecs.includes(k)?`${v.color}10`:C.sf,
                    color:expSpecs.includes(k)?v.color:C.ks,fontSize:11,fontWeight:expSpecs.includes(k)?600:500,fontFamily:bd,cursor:"pointer",transition:"all .15s"}}>{v.label}</button>))}
              </div>
            </div>

            <div style={{borderTop:`1px solid ${C.bl}`,paddingTop:24,display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
              <div style={{padding:24,background:C.sb,borderRadius:6,border:`1px solid ${C.sc}`}}>
                <div style={{fontSize:9,fontWeight:700,color:C.s,letterSpacing:".08em",marginBottom:10}}>PATIENTS ADDED AT SCALE</div>
                <div style={{fontSize:40,fontWeight:500,color:C.s,fontFamily:mn,lineHeight:1}}>+<AN value={expAddlVisits}/></div>
                <div style={{fontSize:11,color:C.kf,marginTop:8}}>across {expProv} providers annually</div>
              </div>
              <div style={{padding:24,background:C.tb,borderRadius:6,border:`1px solid ${C.tc}`}}>
                <div style={{fontSize:9,fontWeight:700,color:C.t,letterSpacing:".08em",marginBottom:10}}>TOTAL ECONOMIC IMPACT</div>
                <div style={{fontSize:40,fontWeight:500,color:C.t,fontFamily:mn,lineHeight:1}}><AN value={expTotalImpact} prefix="$"/></div>
                <div style={{fontSize:11,color:C.kf,marginTop:8}}>direct + downstream</div>
              </div>
            </div>
          </Card>

          {/* Comparison table */}
          <Fade delay={100} show={r}>
            <Card mb={24}>
              <SectionLabel>Current Deployment vs. Expansion</SectionLabel>
              <div style={{borderRadius:6,overflow:"hidden",border:`1px solid ${C.bl}`}}>
                {[[""  ,`Today (${bProv})`,`Expanded (${expProv})`],
                  ["Additional patients / yr",fmtK(addlVisits),fmtK(expAddlVisits)],
                  ["Economic impact",fmt(totalValue),fmt(expTotalImpact)],
                  ["Platform investment",fmt(tetherCost),fmt(expCost)],
                  ["ROI",`${Math.round(achievedROI)}%`,`${Math.round(expROI)}%`],
                  ["Per provider / mo",fmt(perProvPerMonth),fmt(Math.round(expTotalImpact/expProv/12))],
                ].map((row,ri)=>(
                  <div key={ri} style={{display:"grid",gridTemplateColumns:"1.4fr 1fr 1fr",borderTop:ri?`1px solid ${C.bl}`:"none"}}>
                    {row.map((v,ci)=>(
                      <div key={ci} style={{padding:"12px 16px",fontSize:ri===0?9:12,fontWeight:ri===0?700:ci===0?500:600,
                        fontFamily:ci&&ri?mn:bd,color:ri===0?C.kf:ci===2?C.s:ci===1?C.t:C.k,
                        letterSpacing:ri===0?".06em":"0",textAlign:ci?"right":"left",background:ri===0?C.sa:C.sf}}>{v}</div>))}
                  </div>))}
              </div>
            </Card>
          </Fade>

          {/* The closing argument */}
          <Fade delay={200} show={r}>
            <div style={{padding:"24px 28px",background:C.sa,borderRadius:6,borderLeft:`3px solid ${C.s}`}}>
              <SectionLabel>The Expansion Case</SectionLabel>
              <p style={{fontSize:14,color:C.km,lineHeight:1.85,margin:0}}>
                At {bProv} providers, Tether has delivered <strong style={{color:C.t}}>{fmt(totalValue)}</strong> in validated value at a <strong>{Math.round(achievedROI)}% ROI</strong>. Expanding to <strong>{expProv} providers</strong>{expSpecs.length?` across ${expSpecs.map(s=>SPECS[s]?.label).filter(Boolean).join(", ").toLowerCase()}`:""} projects
                <strong style={{color:C.s}}> {fmtK(expAddlVisits)} additional patients</strong> and
                <strong style={{color:C.s}}> {fmt(expTotalImpact)}</strong> in total impact.
              </p>
              <p style={{fontSize:14,color:C.km,lineHeight:1.85,margin:"16px 0 0"}}>
                These aren't projections from a model. They're your own numbers, applied to a bigger canvas.
              </p>
            </div>
          </Fade>
          <Fade delay={300} show={r}><div style={{textAlign:"center",marginTop:32}}>
            <div style={{display:"flex",gap:12,justifyContent:"center"}}><Btn>Download Board Summary</Btn><Btn v="accent">Share with Leadership</Btn></div>
            <div style={{fontSize:10,color:C.kg,marginTop:12}}>PDF with all metrics, comparisons, and expansion projections</div>
          </div></Fade>
          <Fade delay={380} show={r}><MethodNote sp={sp} prov={bProv}/></Fade>
          <Fade delay={460} show={r}><CrossNav current="customer" onNav={n=>{onHome();setTimeout(()=>document.querySelector(`[data-path="${n}"]`)?.click(),100)}}/></Fade>
        </Fade>}
        <NavFoot step={step} max={2} onBack={()=>step>0?setStep(step-1):onHome()} onNext={()=>setStep(step+1)}/>
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
  const[h,setH]=useState(false);
  return <Fade delay={i*80} show={true}>
    <div onClick={onClick} onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}
      style={{padding:"28px 28px",cursor:"pointer",background:h?C.sh:C.sf,border:`1px solid ${h?C.bd:C.b}`,
        borderRadius:8,marginBottom:12,transition:"all .2s cubic-bezier(.22,1,.36,1)",position:"relative",boxShadow:h?sh2:sh1,
        transform:h?"translateY(-1px)":"none"}}>
      {h&&<div style={{position:"absolute",top:0,left:0,width:3,height:"100%",borderRadius:"3px 0 0 3px",background:s.color}}/>}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12}}>
        <div style={{flex:1}}>
          <div style={{fontSize:11,color:C.kf,marginBottom:8}}>{s.meta}</div>
          <div style={{fontSize:17,fontWeight:400,color:C.k,fontFamily:dp,lineHeight:1.3}}>{s.headline}</div>
        </div>
        <div style={{display:"flex",gap:24,marginLeft:32,flexShrink:0}}>
          <div style={{textAlign:"right"}}><div style={{fontSize:20,fontWeight:500,color:s.color,fontFamily:mn}}>{s.results.revenue}</div>
            <div style={{fontSize:8,fontWeight:700,color:C.kg,letterSpacing:".06em"}}>RECOVERED</div></div>
          <div style={{textAlign:"right"}}><div style={{fontSize:20,fontWeight:500,color:s.color,fontFamily:mn}}>{s.results.roi}</div>
            <div style={{fontSize:8,fontWeight:700,color:C.kg,letterSpacing:".06em"}}>ROI</div></div>
        </div>
      </div>
      <div style={{fontSize:12,color:C.ks,lineHeight:1.6}}>{s.context.slice(0,140)}…</div>
      <div style={{marginTop:12,fontSize:11,fontWeight:600,color:h?s.color:C.kg,transition:"color .15s"}}>Read the full story →</div>
    </div>
  </Fade>;
}

function CaseStudyPath({onHome}){
  const[sel,setSel]=useState(null);const[r,setR]=useState(false);
  useEffect(()=>{window.scrollTo(0,0);setR(false);setTimeout(()=>setR(true),40)},[sel]);
  const cs=STORIES.find(s=>s.id===sel);

  if(!cs)return(
    <div style={{minHeight:"100vh",background:C.bg,fontFamily:bd}}>
      <TopBar onHome={onHome} ctx="Case Studies"/>
      <div style={{maxWidth:740,margin:"0 auto",padding:"48px 40px 32px"}}>
        <PageHead title="Real results from real health systems." sub="These aren't hypotheticals. These are documented outcomes from organizations that deployed Tether and measured the difference."/>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:10,marginBottom:32}}>
          {[{v:"442",l:"Total Providers",c:C.t},{v:"$14.8M",l:"Combined Revenue Impact",c:C.t},{v:"56,400",l:"Additional Patients / Year",c:C.s},{v:"313%",l:"Average ROI",c:C.a}].map(x=>(
            <div key={x.l} style={{padding:"16px 12px",textAlign:"center",background:C.sf,border:`1px solid ${C.b}`,borderRadius:6,boxShadow:sh1}}>
              <div style={{fontSize:20,fontWeight:500,color:x.c,fontFamily:mn,marginBottom:4}}>{x.v}</div>
              <div style={{fontSize:8,fontWeight:700,color:C.kf,letterSpacing:".06em"}}>{x.l.toUpperCase()}</div>
            </div>))}
        </div>
        {STORIES.map((s,i)=><StoryCard key={s.id} s={s} i={i} onClick={()=>setSel(s.id)}/>)}
        <div style={{marginTop:48,paddingTop:24,borderTop:`1px solid ${C.bl}`}}><Btn onClick={onHome} v="secondary">Back to Home</Btn></div>
      </div>
    </div>);

  const mo=cs.results.monthlyData;const moMax=Math.max(...mo);
  return(
    <div style={{minHeight:"100vh",background:C.bg,fontFamily:bd}}>
      <TopBar onHome={onHome} ctx="Case Studies"/>
      <div style={{maxWidth:740,margin:"0 auto",padding:"48px 40px 32px"}}>
        <Fade show={r}>
          <div onClick={()=>setSel(null)} style={{color:C.t,fontSize:12,fontWeight:600,cursor:"pointer",marginBottom:32}}>← All Case Studies</div>
          <div style={{marginBottom:48}}>
            <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:16}}>
              <div style={{width:10,height:10,borderRadius:3,background:cs.color}}/><span style={{fontSize:11,color:C.kf}}>{cs.meta}</span></div>
            <h1 style={{fontSize:30,fontWeight:400,color:C.k,fontFamily:dp,margin:"0 0 12px",lineHeight:1.2}}>{cs.headline}</h1>
            <div style={{fontSize:15,fontWeight:600,color:cs.color}}>{cs.org}</div>
          </div>
        </Fade>
        <Fade delay={60} show={r}><div style={{fontSize:15,color:C.km,lineHeight:1.85,marginBottom:32}}>{cs.context}</div></Fade>
        <Fade delay={120} show={r}>
          <div style={{padding:"24px 28px",background:C.sa,borderRadius:6,borderLeft:`3px solid ${cs.color}`,marginBottom:24}}>
            <div style={{fontSize:15,color:C.km,lineHeight:1.85,fontStyle:"italic",fontFamily:dp}}>{cs.problem}</div>
          </div>
        </Fade>
        <Fade delay={180} show={r}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:48}}>
            {cs.problemStats.map(s=>(
              <div key={s.label} style={{padding:16,background:C.sf,border:`1px solid ${C.b}`,borderRadius:6,boxShadow:sh1}}>
                <div style={{fontSize:10,color:C.kf,fontWeight:600,letterSpacing:".04em",marginBottom:8}}>{s.label}</div>
                <div style={{fontSize:22,fontWeight:500,color:C.r,fontFamily:mn}}>{s.val}</div>
                <div style={{fontSize:10,color:C.kg,marginTop:4}}>{s.note}</div>
              </div>))}
          </div>
        </Fade>
        <Fade delay={240} show={r}><SectionLabel>Implementation Timeline</SectionLabel></Fade>
        {cs.timeline.map((t,i)=>(
          <Fade key={t.phase} delay={300+i*80} show={r}>
            <div style={{display:"flex",gap:24,marginBottom:24}}>
              <div style={{width:80,flexShrink:0,paddingTop:3}}>
                <div style={{fontSize:11,fontWeight:700,color:cs.color,fontFamily:mn}}>{t.phase}</div></div>
              <div style={{flex:1,borderLeft:`1px solid ${C.bl}`,paddingLeft:24,paddingBottom:4}}>
                <div style={{fontSize:14,fontWeight:600,color:C.k,marginBottom:8}}>{t.title}</div>
                <div style={{fontSize:13,color:C.ks,lineHeight:1.75}}>{t.desc}</div>
              </div>
            </div>
          </Fade>))}
        <Fade delay={300+cs.timeline.length*80} show={r}>
          <Card shadow={2} mb={24} pad="28px">
            <SectionLabel>Year-1 Results</SectionLabel>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:10,marginBottom:24}}>
              {[{l:"Additional Visits",v:cs.results.addlVisits,c:C.t},{l:"Revenue Impact",v:cs.results.revenue,c:C.t},{l:"ROI",v:cs.results.roi,c:C.a},{l:"Payback",v:cs.results.payback,c:C.s}].map(x=>(
                <div key={x.l} style={{textAlign:"center"}}>
                  <div style={{fontSize:24,fontWeight:500,color:x.c,fontFamily:mn,marginBottom:4}}>{x.v}</div>
                  <div style={{fontSize:9,fontWeight:700,color:C.kf,letterSpacing:".06em"}}>{x.l.toUpperCase()}</div>
                </div>))}
            </div>
            <div style={{borderRadius:6,overflow:"hidden",border:`1px solid ${C.bl}`,marginBottom:24}}>
              <div style={{display:"grid",gridTemplateColumns:"1.4fr .8fr .8fr .8fr",background:C.sa}}>
                {["Metric","Before","After","Change"].map(h=>(
                  <div key={h} style={{padding:"10px 12px",fontSize:9,fontWeight:700,color:C.kf,letterSpacing:".06em"}}>{h}</div>))}
              </div>
              {cs.results.metrics.map(m=>(
                <div key={m.label} style={{display:"grid",gridTemplateColumns:"1.4fr .8fr .8fr .8fr",borderTop:`1px solid ${C.bl}`}}>
                  <div style={{padding:"12px 12px",fontSize:12,color:C.k,fontWeight:500}}>{m.label}</div>
                  <div style={{padding:"12px 12px",fontSize:12,color:C.kf,fontFamily:mn}}>{m.before}</div>
                  <div style={{padding:"12px 12px",fontSize:12,color:C.t,fontWeight:600,fontFamily:mn}}>{m.after}</div>
                  <div style={{padding:"12px 12px",fontSize:12,color:C.t,fontWeight:600,fontFamily:mn}}>{m.delta}</div>
                </div>))}
            </div>
            <div style={{fontSize:10,fontWeight:600,color:C.kf,letterSpacing:".04em",marginBottom:12}}>UTILIZATION TREND BY MONTH</div>
            <div style={{display:"flex",alignItems:"flex-end",gap:4,height:80}}>
              {mo.map((v,i)=>(
                <div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
                  <div style={{fontSize:8,color:i===mo.length-1?C.t:C.kg,fontFamily:mn,fontWeight:600}}>{v}%</div>
                  <div style={{width:"100%",background:i<1?`${C.kf}30`:C.t,borderRadius:3,
                    height:`${(v/moMax)*60}px`,opacity:i<1?.4:.6+(i/mo.length)*.4,transition:"height .5s ease"}}/>
                  <div style={{fontSize:7,color:C.kg}}>{i===0?"Pre":`M${i}`}</div>
                </div>))}
            </div>
          </Card>
        </Fade>
        <Fade delay={300+cs.timeline.length*80+100} show={r}>
          <div style={{padding:"28px 32px",background:C.sa,borderRadius:6,borderLeft:`3px solid ${cs.color}`,marginBottom:24}}>
            <div style={{fontSize:18,color:C.k,lineHeight:1.7,fontFamily:dp,fontStyle:"italic",marginBottom:16}}>"{cs.quote}"</div>
            <div style={{fontSize:12,fontWeight:600,color:cs.color}}>— {cs.quoteAuthor}, {cs.org}</div>
          </div>
        </Fade>
        <Fade delay={300+cs.timeline.length*80+200} show={r}>
          <Card mb={0}>
            <SectionLabel>What happened next</SectionLabel>
            <div style={{fontSize:13,color:C.ks,lineHeight:1.75}}>{cs.secondOrder}</div>
          </Card>
        </Fade>
        <div style={{marginTop:48,paddingTop:24,borderTop:`1px solid ${C.bl}`,display:"flex",justifyContent:"space-between"}}>
          <Btn onClick={()=>setSel(null)} v="secondary">← All Case Studies</Btn>
          <Btn v="accent">Download PDF</Btn>
        </div>
        <CrossNav current="casestudy"/>
      </div>
    </div>);
}


function PathCard({p,onClick,ready,i}){
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
  const[path,setPath_]=useState(null);const setPath=(p)=>{window.scrollTo(0,0);setPath_(p)};const[ready,setReady]=useState(false);
  useEffect(()=>{setTimeout(()=>setReady(true),80)},[]);
  const FL_=<link href={FL} rel="stylesheet"/>;
  if(path==="prospect")return <>{FL_}<ProspectPath onHome={()=>setPath(null)}/></>;
  if(path==="customer")return <>{FL_}<CustomerPath onHome={()=>setPath(null)}/></>;
  if(path==="casestudy")return <>{FL_}<CaseStudyPath onHome={()=>setPath(null)}/></>;
  if(path)return <>{FL_}<div style={{minHeight:"100vh",background:C.bg,fontFamily:bd,display:"flex",alignItems:"center",justifyContent:"center"}}>
    <div style={{textAlign:"center",padding:48}}><div style={{fontSize:11,color:C.kf,letterSpacing:".1em",marginBottom:16}}>COMING SOON</div>
    <div style={{fontSize:28,fontWeight:400,color:C.k,fontFamily:dp,marginBottom:20}}>This path is launching soon.</div>
    <Btn onClick={()=>setPath(null)}>Back to Home</Btn></div></div></>;

  return(
    <div style={{minHeight:"100vh",background:C.bg,fontFamily:bd,color:C.k,display:"flex",flexDirection:"column"}}>
      {FL_}
      <div style={{borderBottom:`1px solid ${C.b}`,padding:"0 56px",height:58,display:"flex",justifyContent:"space-between",alignItems:"center",
        background:"rgba(255,255,255,.92)",backdropFilter:"blur(16px)",WebkitBackdropFilter:"blur(16px)"}}>
        <div style={{display:"flex",alignItems:"center",gap:12}}><Logo/><span style={{fontSize:13,fontWeight:800,letterSpacing:".14em"}}>TETHER</span></div>
        <div style={{fontSize:9,fontWeight:700,color:C.kf,letterSpacing:".12em"}}>VALUE ENGINEERING</div>
      </div>

      <div style={{maxWidth:960,margin:"0 auto",padding:"100px 56px 0",width:"100%",boxSizing:"border-box"}}>
        <Fade show={ready}>
          <div style={{display:"grid",gridTemplateColumns:"1.1fr .9fr",gap:72,alignItems:"center"}}>
            <div>
              <div style={{display:"inline-block",fontSize:10,fontWeight:700,color:C.t,letterSpacing:".18em",marginBottom:28,
                background:C.tb,padding:"6px 14px",borderRadius:5,border:`1px solid ${C.tc}`}}>AI-POWERED ACCESS INTELLIGENCE</div>
              <h1 style={{fontSize:50,fontWeight:400,lineHeight:1.06,margin:"0 0 24px",fontFamily:dp,letterSpacing:"-.025em"}}>Quantify the value of patient access.</h1>
              <p style={{fontSize:16,color:C.ks,lineHeight:1.85,margin:"0 0 36px",maxWidth:440}}>Every unfilled slot, missed appointment, and lost referral has a dollar value. We make it visible — and recoverable.</p>
              <div style={{display:"flex",gap:12}}>
                <Btn onClick={()=>setPath("prospect")}>Build Your Case</Btn>
                <Btn v="accent" onClick={()=>setPath("casestudy")}>See Results</Btn>
              </div>
            </div>
            <Fade delay={350} show={ready}>
              <div style={{padding:"32px 28px",background:C.sf,border:`1px solid ${C.bd}`,borderRadius:14,boxShadow:sh3}}>
                <div style={{fontSize:10,fontWeight:700,color:C.kf,letterSpacing:".1em",marginBottom:24}}>SAMPLE · 60-PROVIDER ORTHOPEDIC GROUP</div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:24}}>
                  <div style={{padding:20,background:C.rb,borderRadius:10,border:`1px solid ${C.rc}`}}>
                    <div style={{fontSize:8,fontWeight:700,color:C.r,letterSpacing:".08em",marginBottom:8}}>UNREALIZED CAPACITY</div>
                    <div style={{fontSize:28,fontWeight:500,color:C.r,fontFamily:mn,lineHeight:1}}>$3.2M<span style={{fontSize:13,color:C.kf,fontWeight:400}}>/yr</span></div>
                  </div>
                  <div style={{padding:20,background:C.tb,borderRadius:10,border:`1px solid ${C.tc}`}}>
                    <div style={{fontSize:8,fontWeight:700,color:C.t,letterSpacing:".08em",marginBottom:8}}>RECOVERABLE</div>
                    <div style={{fontSize:28,fontWeight:500,color:C.t,fontFamily:mn,lineHeight:1}}>$1.8M<span style={{fontSize:13,color:C.kf,fontWeight:400}}>/yr</span></div>
                  </div>
                </div>
                <div style={{display:"flex",gap:0}}>
                  {[{l:"Fill Rate",b:"71%",a:"85%"},{l:"No-Shows",b:"16%",a:"7%"},{l:"Wait",b:"14d",a:"5d"}].map((m,i)=>(
                    <div key={m.l} style={{flex:1,textAlign:"center",padding:"14px 0",borderTop:`1px solid ${C.bl}`,borderLeft:i?`1px solid ${C.bl}`:"none"}}>
                      <div style={{fontSize:8,color:C.kf,fontWeight:700,letterSpacing:".08em",marginBottom:8}}>{m.l.toUpperCase()}</div>
                      <div style={{fontSize:13,fontFamily:mn}}>
                        <span style={{color:C.kf,textDecoration:"line-through"}}>{m.b}</span>
                        <span style={{color:C.kg,margin:"0 6px"}}>→</span>
                        <span style={{color:C.t,fontWeight:600}}>{m.a}</span>
                      </div>
                    </div>))}
                </div>
              </div>
            </Fade>
          </div>
        </Fade>
      </div>

      <div style={{maxWidth:960,margin:"0 auto",padding:"60px 56px 48px",width:"100%",boxSizing:"border-box"}}>
        <Fade delay={500} show={ready}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:0,borderRadius:12,overflow:"hidden",border:`1px solid ${C.b}`,background:C.sf,boxShadow:sh1}}>
            {[{v:"$14.8M",l:"Recovered"},{v:"31,400+",l:"Patients Added"},{v:"3.2 mo",l:"Avg Payback"},{v:"340%",l:"Year-1 ROI"}].map((s,i)=>(
              <div key={s.l} style={{padding:"22px 16px",textAlign:"center",borderLeft:i?`1px solid ${C.b}`:"none"}}>
                <div style={{fontSize:24,fontWeight:500,color:C.t,fontFamily:mn,marginBottom:6}}>{s.v}</div>
                <div style={{fontSize:9,fontWeight:700,color:C.kf,letterSpacing:".08em"}}>{s.l.toUpperCase()}</div>
              </div>))}
          </div>
        </Fade>
      </div>

      <div style={{maxWidth:960,margin:"0 auto",padding:"0 56px 32px",width:"100%",boxSizing:"border-box"}}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:20,alignItems:"stretch"}}>
          {[{k:"prospect",label:"New Health System",title:"Build Your Case",desc:"Model your capacity, quantify where access breaks down, and project what Tether would unlock.",color:C.t},
            {k:"customer",label:"Current Customer",title:"Prove Your Value",desc:"Measure what Tether delivered in dollars and patients. Build a board-ready case, then model expansion.",color:C.a},
            {k:"casestudy",label:"Case Studies",title:"See Real Results",desc:"Documented outcomes from health systems across specialties, regions, and sizes.",color:C.s},
          ].map((p,i)=><PathCard key={p.k} p={p} i={i} ready={ready} onClick={()=>setPath(p.k)}/>)}
        </div>
      </div>

      <div style={{maxWidth:960,margin:"0 auto",padding:"20px 56px 0",width:"100%",boxSizing:"border-box"}}>
        <Fade delay={700} show={ready}>
          <div style={{display:"flex",gap:12,justifyContent:"center"}}>
            {["HIPAA Compliant","SOC 2 Type II","Epic & Cerner Integrated","HL7 FHIR Native"].map(b=>(
              <span key={b} style={{fontSize:9,fontWeight:600,color:C.kf,letterSpacing:".06em",padding:"8px 18px",border:`1px solid ${C.bl}`,borderRadius:6,background:C.sf}}>{b}</span>))}
          </div>
        </Fade>
      </div>

      <div style={{flex:1}}/>
      <div style={{borderTop:`1px solid ${C.b}`,padding:"20px 56px",display:"flex",justifyContent:"space-between",background:C.sf}}>
        <span style={{fontSize:9,fontWeight:700,color:C.kf,letterSpacing:".12em"}}>BUILT BY BRAD LARMIE</span>
        <span style={{fontSize:9,fontWeight:700,color:C.kf,letterSpacing:".08em"}}>MONOLITH GREY · VALUE ENGINEERING</span>
      </div>
    </div>
  );
}
