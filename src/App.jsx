import { useState, useEffect, useRef, useMemo } from "react";

/* ═══════════════════════════════════════════
   TETHER — AI-Powered Access Intelligence
   
   SPACING SYSTEM (8px grid):
   4  — micro (icon gaps, tight elements)
   8  — small (inline spacing)
   12 — compact (label to content)
   16 — medium (between related items)
   24 — section (between components)
   32 — large (between major sections)
   48 — page (content padding)
   64 — hero (major vertical rhythm)
   
   SHADOW LEVELS:
   0 — flat (borders only)
   1 — subtle: 0 1px 3px rgba(0,0,0,.04)
   2 — card: 0 2px 8px rgba(0,0,0,.05)
   3 — elevated: 0 4px 20px rgba(0,0,0,.06)
   
   RADIUS: 6px cards, 4px chips/badges, 5px buttons
   ═══════════════════════════════════════════ */

const C={
  bg:"#F7F7F4",sf:"#FFFFFF",sa:"#F1F0EC",sh:"#FAFAF8",
  b:"#E3E1DB",bl:"#EDEBE6",bd:"#D2CFC8",
  k:"#111518",km:"#2E3338",ks:"#5A5E63",kf:"#94979B",kg:"#C2C4C7",
  t:"#1A7A6D",tb:"#EDF7F5",tc:"#C0DED9",td:"#0F5A50",
  a:"#B8762C",ab:"#FBF4EA",ac:"#E4D0B2",ad:"#7D5019",
  r:"#B44040",rb:"#FBF0F0",rc:"#E8CCCC",
  s:"#3D5A80",sb:"#EEF2F7",sc:"#C4D0DE",
};
const sh1="0 1px 3px rgba(0,0,0,.04)";
const sh2="0 2px 8px rgba(0,0,0,.05)";
const sh3="0 4px 20px rgba(0,0,0,.06)";

const dp=`'Instrument Serif','Georgia',serif`;
const bd=`'Plus Jakarta Sans','Helvetica Neue',sans-serif`;
const mn=`'JetBrains Mono','SF Mono',monospace`;
const FL="https://fonts.googleapis.com/css2?family=Instrument+Serif&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap";

const fmt=n=>{if(Math.abs(n)>=1e6)return`$${(n/1e6).toFixed(1)}M`;if(Math.abs(n)>=1e3)return`$${Math.round(n/1e3).toLocaleString()}K`;return`$${Math.round(n).toLocaleString()}`};
const fmtK=n=>n>=1000?`${(n/1000).toFixed(1)}K`:n.toLocaleString();

const SPECS={
  primary:  {label:"Primary Care",       revPerVisit:185, slotsPerDay:22, downstream:1.4, color:C.t,  benchUtil:81},
  ortho:    {label:"Orthopedics",         revPerVisit:340, slotsPerDay:16, downstream:2.8, color:C.a,  benchUtil:76},
  cardio:   {label:"Cardiology",          revPerVisit:410, slotsPerDay:14, downstream:3.2, color:C.r,  benchUtil:74},
  womens:   {label:"Women's Health",      revPerVisit:245, slotsPerDay:20, downstream:1.6, color:"#8B5E8B", benchUtil:79},
  onc:      {label:"Oncology",            revPerVisit:520, slotsPerDay:12, downstream:4.1, color:C.s,  benchUtil:72},
  gastro:   {label:"Gastroenterology",    revPerVisit:385, slotsPerDay:14, downstream:2.5, color:"#5E8B6E", benchUtil:75},
  neuro:    {label:"Neurology",           revPerVisit:370, slotsPerDay:14, downstream:2.2, color:"#6E5E8B", benchUtil:73},
  multi:    {label:"Multi-Specialty Avg", revPerVisit:285, slotsPerDay:18, downstream:2.0, color:C.km, benchUtil:78},
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
  return <div style={{opacity:show?1:0,transform:show?"translateY(0)":"translateY(8px)",
    transition:`all 0.45s cubic-bezier(0.22,1,0.36,1) ${delay}ms`,...style}}>{children}</div>;
}

/* Reusable section card wrapper */
function Card({children,pad="24px 28px",shadow=1,mb=16,style={}}){
  return <div style={{padding:pad,background:C.sf,border:`1px solid ${C.b}`,borderRadius:6,
    boxShadow:shadow===0?"none":shadow===1?sh1:shadow===2?sh2:sh3,marginBottom:mb,...style}}>{children}</div>;
}

function SectionLabel({children}){
  return <div style={{fontSize:9,fontWeight:700,color:C.kf,letterSpacing:".1em",textTransform:"uppercase",fontFamily:bd,marginBottom:16}}>{children}</div>;
}

function PageHead({title,sub}){
  return <div style={{marginBottom:48}}>
    <h1 style={{fontSize:34,fontWeight:400,color:C.k,fontFamily:dp,margin:"0 0 12px",lineHeight:1.15,letterSpacing:"-.01em"}}>{title}</h1>
    {sub&&<p style={{fontSize:14,color:C.ks,lineHeight:1.7,margin:0,maxWidth:460,fontFamily:bd}}>{sub}</p>}
  </div>;
}

function Slider({label,value,onChange,min,max,step,format="num",note,accent}){
  const pct=((value-min)/(max-min))*100;
  const dv=format==="$"?fmt(value):format==="%"?`${value}%`:format==="d"?`${value} days`:value.toLocaleString();
  const[h,setH]=useState(false);
  const ac=accent||C.t;
  return(
    <div style={{marginBottom:32}} onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",marginBottom:12}}>
        <span style={{fontSize:11,fontWeight:600,color:C.ks,letterSpacing:".05em",textTransform:"uppercase",fontFamily:bd}}>{label}</span>
        <span style={{fontSize:22,fontWeight:500,color:h?ac:C.k,fontFamily:mn,letterSpacing:"-.03em",transition:"color .15s"}}>{dv}</span>
      </div>
      <div style={{position:"relative",height:32,display:"flex",alignItems:"center"}}>
        <div style={{position:"absolute",left:0,right:0,height:1,background:C.bl}}/>
        <div style={{position:"absolute",left:0,width:`${pct}%`,height:1,background:ac,transition:"width .06s"}}/>
        <input type="range" min={min} max={max} step={step} value={value} onChange={e=>onChange(+e.target.value)}
          style={{position:"absolute",width:"100%",height:32,opacity:0,cursor:"pointer",zIndex:2}}/>
        <div style={{position:"absolute",left:`${pct}%`,transform:"translateX(-50%)",
          width:h?14:10,height:h?14:10,borderRadius:"50%",background:C.sf,border:`2px solid ${ac}`,
          boxShadow:h?`0 2px 8px ${ac}40`:sh1,transition:"all .15s ease-out",pointerEvents:"none",zIndex:1}}/>
      </div>
      {note&&<div style={{fontSize:10,color:C.kg,marginTop:8,fontFamily:bd}}>{note}</div>}
    </div>
  );
}

function Logo(){return <svg width="16" height="16" viewBox="0 0 16 16"><rect width="16" height="16" rx="3.5" fill={C.k}/>
  <path d="M4 6.5L8 4L12 6.5L8 9Z" fill="none" stroke={C.t} strokeWidth="1.2" strokeLinejoin="round"/>
  <path d="M4 8.5L8 11L12 8.5" fill="none" stroke="#5BA89E" strokeWidth="1" strokeLinejoin="round" opacity=".5"/></svg>}

function TopBar({onHome,ctx}){return(
  <div style={{borderBottom:`1px solid ${C.b}`,padding:"0 48px",height:52,display:"flex",justifyContent:"space-between",alignItems:"center",background:C.sf}}>
    <div onClick={onHome} style={{cursor:"pointer",display:"flex",alignItems:"center",gap:12}}>
      <Logo/><span style={{fontSize:12,fontWeight:700,letterSpacing:".15em",color:C.k,fontFamily:bd}}>TETHER</span>
      {ctx&&<><span style={{color:C.bd,fontWeight:300,fontSize:14,margin:"0 4px"}}>/</span>
        <span style={{fontSize:11,fontWeight:500,color:C.kf,letterSpacing:".03em",fontFamily:bd}}>{ctx}</span></>}
    </div></div>)}

function Steps({steps,cur,go}){return(
  <div style={{display:"flex",borderBottom:`1px solid ${C.b}`,background:C.sf,paddingLeft:48}}>
    {steps.map((s,i)=>(
      <div key={s} onClick={()=>i<=cur&&go(i)} style={{padding:"12px 24px",fontSize:10,fontWeight:600,letterSpacing:".08em",fontFamily:bd,
        color:i===cur?C.k:i<cur?C.t:C.kg,borderBottom:i===cur?`2px solid ${C.t}`:"2px solid transparent",
        cursor:i<=cur?"pointer":"default",transition:"all .2s",marginBottom:-1}}>
        <span style={{color:i<=cur?C.t:C.kg,marginRight:8,fontFamily:mn,fontSize:9}}>{String(i+1).padStart(2,"0")}</span>{s}</div>))}
  </div>)}

function Btn({children,onClick,v="primary",disabled}){
  const[h,setH]=useState(false);
  const s={
    primary:{padding:"12px 36px",borderRadius:5,border:"none",background:h?C.km:C.k,color:"#fff",fontSize:12,fontWeight:600,fontFamily:bd,cursor:"pointer",letterSpacing:".02em",boxShadow:h?"0 4px 16px rgba(0,0,0,.15)":sh1,transition:"all .2s"},
    secondary:{padding:"11px 24px",borderRadius:5,border:`1px solid ${C.b}`,background:h?C.sa:C.sf,color:C.ks,fontSize:12,fontWeight:600,fontFamily:bd,cursor:disabled?"default":"pointer",opacity:disabled?.3:1,transition:"all .2s"},
    accent:{padding:"11px 28px",borderRadius:5,border:`1px solid ${C.t}35`,background:h?C.tb:C.sf,color:C.td,fontSize:12,fontWeight:600,fontFamily:bd,cursor:"pointer",transition:"all .2s"}};
  return <button onClick={onClick} onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)} style={s[v]}>{children}</button>;
}

function NavFoot({step,max,onBack,onNext}){return(
  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:64,paddingTop:24,borderTop:`1px solid ${C.bl}`}}>
    <Btn onClick={onBack} v="secondary" disabled={step===0}>Back</Btn>
    {step<max?<Btn onClick={onNext}>Continue</Btn>:<Btn v="accent">Export Summary</Btn>}
  </div>)}

function Stat({label,value,sub,color=C.k,bg=C.sf,border=C.b}){return(
  <div style={{padding:"24px 20px",background:bg,border:`1px solid ${border}`,borderRadius:6,boxShadow:sh1}}>
    <div style={{fontSize:9,fontWeight:700,color:bg===C.sf?C.kf:color,letterSpacing:".1em",textTransform:"uppercase",fontFamily:bd,marginBottom:12}}>{label}</div>
    <div style={{fontSize:30,fontWeight:500,color,fontFamily:mn,letterSpacing:"-.04em",lineHeight:1}}>{value}</div>
    {sub&&<div style={{fontSize:10,color:C.kg,marginTop:8,fontFamily:bd}}>{sub}</div>}
  </div>)}

/* ═══ PROSPECT PATH ═══ */
function ProspectPath({onHome}){
  const[step,setStep]=useState(0);const[r,setR]=useState(false);
  const[spec,setSpec]=useState("multi");const[prov,setProv]=useState(45);const[daysPerWeek,setDaysPerWeek]=useState(5);
  const[fillRate,setFillRate]=useState(72);const[noShow,setNoShow]=useState(16);const[leakPct,setLeakPct]=useState(20);
  const[targetLift,setTargetLift]=useState(10);
  useEffect(()=>{setR(false);setTimeout(()=>setR(true),30)},[step]);
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
          <div style={{maxWidth:"calc(50% - 28px)"}}>
            <Slider label="Referral Leakage" value={leakPct} onChange={setLeakPct} min={5} max={50} step={1} format="%" note="Referrals lost out-of-network" accent={leakPct<=15?C.t:C.r}/>
          </div>
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
        </Fade>}
        <NavFoot step={step} max={3} onBack={()=>step>0?setStep(step-1):onHome()} onNext={()=>setStep(step+1)}/>
      </div>
    </div>
  );
}

/* ═══ HOME ═══ */
function PathCard({p,onClick,ready,i}){
  const[h,setH]=useState(false);
  return(
    <Fade delay={180+i*100} show={ready} style={{height:"100%"}}>
      <div onClick={onClick} onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}
        style={{padding:"36px 32px",cursor:"pointer",background:h?C.sh:C.sf,transition:"all .2s",
          height:"100%",boxSizing:"border-box",display:"flex",flexDirection:"column",position:"relative"}}>
        {h&&<div style={{position:"absolute",top:0,left:0,right:0,height:2,background:p.color,transition:"opacity .2s"}}/>}
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:20}}>
          <div style={{fontSize:24,fontWeight:400,color:h?p.color:C.bl,fontFamily:dp,transition:"color .25s",lineHeight:1}}>{p.n}</div>
          <div style={{fontSize:9,fontWeight:700,color:p.color,letterSpacing:".12em",textTransform:"uppercase"}}>{p.label}</div>
        </div>
        <div style={{fontSize:18,fontWeight:600,color:C.k,marginBottom:8,lineHeight:1.3}}>{p.title}</div>
        <div style={{fontSize:13,color:C.ks,lineHeight:1.65,flex:1}}>{p.desc}</div>
        <div style={{marginTop:"auto",paddingTop:20,fontSize:11,fontWeight:600,color:h?p.color:C.kg,transition:"color .25s"}}>Begin →</div>
      </div>
    </Fade>
  );
}

export default function App(){
  const[path,setPath]=useState(null);const[ready,setReady]=useState(false);
  useEffect(()=>{setTimeout(()=>setReady(true),60)},[]);
  const FL_=<link href={FL} rel="stylesheet"/>;
  if(path==="prospect")return <>{FL_}<ProspectPath onHome={()=>setPath(null)}/></>;
  if(path)return <>{FL_}<div style={{minHeight:"100vh",background:C.bg,fontFamily:bd,display:"flex",alignItems:"center",justifyContent:"center"}}>
    <div style={{textAlign:"center",padding:48}}><div style={{fontSize:11,color:C.kf,letterSpacing:".1em",marginBottom:16}}>COMING SOON</div>
    <div style={{fontSize:28,fontWeight:400,color:C.k,fontFamily:dp,marginBottom:20}}>This path is launching soon.</div>
    <Btn onClick={()=>setPath(null)}>Back to Home</Btn></div></div></>;

  return(
    <div style={{minHeight:"100vh",background:C.bg,fontFamily:bd,color:C.k,display:"flex",flexDirection:"column"}}>
      {FL_}
      {/* Nav */}
      <div style={{borderBottom:`1px solid ${C.b}`,padding:"0 48px",height:52,display:"flex",justifyContent:"space-between",alignItems:"center",background:C.sf}}>
        <div style={{display:"flex",alignItems:"center",gap:12}}><Logo/><span style={{fontSize:12,fontWeight:700,letterSpacing:".15em"}}>TETHER</span></div>
      </div>

      {/* Hero */}
      <div style={{maxWidth:900,margin:"0 auto",padding:"80px 48px 0",width:"100%",boxSizing:"border-box"}}>
        <Fade show={ready}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:56,alignItems:"center"}}>
            <div>
              <div style={{fontSize:9,fontWeight:700,color:C.t,letterSpacing:".2em",marginBottom:24}}>TETHER · AI-POWERED ACCESS INTELLIGENCE</div>
              <h1 style={{fontSize:44,fontWeight:400,lineHeight:1.08,margin:"0 0 20px",fontFamily:dp}}>Quantify the value of patient access.</h1>
              <p style={{fontSize:15,color:C.ks,lineHeight:1.75,margin:0}}>Every unfilled slot, missed appointment, and lost referral has a dollar value. We make it visible — and recoverable.</p>
            </div>
            <Fade delay={300} show={ready}>
              <div style={{padding:"28px 24px",background:C.sf,border:`1px solid ${C.b}`,borderRadius:6,boxShadow:sh3}}>
                <div style={{fontSize:9,fontWeight:700,color:C.kf,letterSpacing:".1em",marginBottom:20,textTransform:"uppercase"}}>Sample · 60-Provider Orthopedic Group</div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:20}}>
                  <div style={{padding:16,background:C.rb,borderRadius:6,border:`1px solid ${C.rc}`}}>
                    <div style={{fontSize:8,fontWeight:700,color:C.r,letterSpacing:".08em",marginBottom:6}}>UNREALIZED CAPACITY</div>
                    <div style={{fontSize:24,fontWeight:500,color:C.r,fontFamily:mn}}>$3.2M<span style={{fontSize:12,color:C.kf}}>/yr</span></div>
                  </div>
                  <div style={{padding:16,background:C.tb,borderRadius:6,border:`1px solid ${C.tc}`}}>
                    <div style={{fontSize:8,fontWeight:700,color:C.t,letterSpacing:".08em",marginBottom:6}}>RECOVERABLE</div>
                    <div style={{fontSize:24,fontWeight:500,color:C.t,fontFamily:mn}}>$1.8M<span style={{fontSize:12,color:C.kf}}>/yr</span></div>
                  </div>
                </div>
                <div style={{display:"flex",gap:0}}>
                  {[{l:"Fill Rate",b:"71%",a:"85%"},{l:"No-Shows",b:"16%",a:"7%"},{l:"Wait",b:"14d",a:"5d"}].map((m,i)=>(
                    <div key={m.l} style={{flex:1,textAlign:"center",padding:"12px 0",borderTop:`1px solid ${C.bl}`,borderLeft:i?`1px solid ${C.bl}`:"none"}}>
                      <div style={{fontSize:8,color:C.kg,fontWeight:700,letterSpacing:".08em",marginBottom:6}}>{m.l.toUpperCase()}</div>
                      <div style={{fontSize:12,fontFamily:mn}}>
                        <span style={{color:C.kf,textDecoration:"line-through"}}>{m.b}</span>
                        <span style={{color:C.kg,margin:"0 5px"}}>→</span>
                        <span style={{color:C.t,fontWeight:600}}>{m.a}</span>
                      </div>
                    </div>))}
                </div>
              </div>
            </Fade>
          </div>
        </Fade>
      </div>

      {/* Social proof */}
      <div style={{maxWidth:900,margin:"0 auto",padding:"48px 48px 40px",width:"100%",boxSizing:"border-box"}}>
        <Fade delay={450} show={ready}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"20px 0",borderTop:`1px solid ${C.bl}`,borderBottom:`1px solid ${C.bl}`}}>
            {[{v:"$14.8M",l:"recovered across partners"},{v:"31,400+",l:"additional patients / year"},{v:"3.2 mo",l:"average payback"},{v:"340%",l:"average year-1 ROI"}].map(s=>(
              <div key={s.l} style={{display:"flex",alignItems:"baseline",gap:8}}>
                <span style={{fontSize:18,fontWeight:500,color:C.t,fontFamily:mn}}>{s.v}</span>
                <span style={{fontSize:10,color:C.kf}}>{s.l}</span>
              </div>))}
          </div>
        </Fade>
      </div>

      {/* Cards */}
      <div style={{maxWidth:900,margin:"0 auto",padding:"0 48px 24px",width:"100%",boxSizing:"border-box"}}>
        <Fade delay={500} show={ready}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:1,background:C.b,borderRadius:6,overflow:"hidden",alignItems:"stretch"}}>
            {[{k:"prospect",n:"01",label:"New Health System",title:"Build Your Case",desc:"Model your capacity, see where access breaks down, and project what Tether would unlock for your organization.",color:C.t},
              {k:"customer",n:"02",label:"Current Customer",title:"Prove Your Value",desc:"Measure what Tether has delivered. Build a board-ready case with your own data — then model expansion.",color:C.a},
              {k:"casestudy",n:"03",label:"Case Studies",title:"See Real Results",desc:"Documented outcomes from health systems across specialties, regions, and organization sizes.",color:C.s},
            ].map((p,i)=><PathCard key={p.k} p={p} i={i} ready={ready} onClick={()=>setPath(p.k)}/>)}
          </div>
        </Fade>
      </div>

      {/* Compliance badges */}
      <div style={{maxWidth:900,margin:"0 auto",padding:"20px 48px 0",width:"100%",boxSizing:"border-box"}}>
        <Fade delay={600} show={ready}>
          <div style={{display:"flex",gap:16,justifyContent:"center"}}>
            {["HIPAA Compliant","SOC 2 Type II","Epic & Cerner Integrated","HL7 FHIR Native"].map(b=>(
              <span key={b} style={{fontSize:9,fontWeight:600,color:C.kg,letterSpacing:".06em",padding:"7px 16px",border:`1px solid ${C.bl}`,borderRadius:4}}>{b}</span>))}
          </div>
        </Fade>
      </div>

      {/* Footer */}
      <div style={{flex:1}}/>
      <div style={{borderTop:`1px solid ${C.b}`,padding:"16px 48px",display:"flex",justifyContent:"space-between"}}>
        <span style={{fontSize:9,fontWeight:600,color:C.kg,letterSpacing:".1em"}}>BUILT BY BRAD LARMIE</span>
        <span style={{fontSize:9,fontWeight:600,color:C.kg,letterSpacing:".06em"}}>VALUE ENGINEERING</span>
      </div>
    </div>
  );
}
