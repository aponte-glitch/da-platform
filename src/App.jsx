import React, { useState } from "react";
import {
  ClipboardList, Users, Calculator,
  Flame, ArrowLeft, ChevronRight, Plus,
  Wrench, TrendingUp, Mail, MessageSquare,
  PhoneCall, CheckCircle2, FileText, RefreshCw, Search,
  ArrowUpRight, Shield, MapPin, Sparkles, Check, Bell, Target,
  Zap, DollarSign, Activity, Send, Home
} from "lucide-react";

/* ════════════════════════════════════════════════════════
   DESIGN SYSTEM — "Field Command"
   Deep ink + warm ivory. Deal economics drive color.
════════════════════════════════════════════════════════ */
const INK   = "#13161c";   // near-black base
const INK2  = "#1c212b";   // raised surface on dark
const INK3  = "#2a313e";   // hairline on dark
const PAPER = "#f4f1ea";   // warm ivory page
const CARD  = "#ffffff";
const EDGE  = "#e4ded2";    // warm hairline on light
const MUTE  = "#8b8578";    // warm grey text
const SUB   = "#615c52";    // darker warm grey
const GOLD  = "#c8a24a";    // brass accent
const GOLD2 = "#9c7c2e";    // deep brass
const JADE  = "#3f9b6e";    // strong deal / go
const RUST  = "#c0533b";    // hot / urgent / dead
const AMBER = "#d4922f";    // warm / caution
const STEEL = "#4a7ba6";    // info / neutral signal
const PLUM  = "#7a6596";    // ai / special

const FD = "'Libre Baskerville', Georgia, serif";   // display
const FB = "'Inter', -apple-system, system-ui, sans-serif"; // body
const FM = "'Inter', system-ui, sans-serif"; // numerals (tabular)

/* ── Accounts ── */
const ACCOUNTS = [
  { name:"David", role:"Operations & Lead Gen", initial:"D" },
  { name:"Azeez", role:"Acquisitions & Closing", initial:"A" },
];

/* ── Pipeline ── */
const PIPE_STAGES = [
  "New Lead","Contacted","Negotiating","Appointment Set",
  "Under Contract","Sent to Buyers","Assigned","Closed","Dead Lead"
];
const PIPE_C = {
  "New Lead":STEEL, "Contacted":PLUM, "Negotiating":AMBER,
  "Appointment Set":"#cf7d2c", "Under Contract":JADE,
  "Sent to Buyers":"#2f8f88", "Assigned":GOLD, "Closed":INK, "Dead Lead":MUTE
};
const TEMP   = { hot:RUST, warm:AMBER, cold:STEEL };
const TEMP_L = { hot:"Hot", warm:"Warm", cold:"Cold" };

/* ── Helpers ── */
const fmt  = n => "$" + Number(Math.round(n)).toLocaleString();
const fmtK = n => n>=1000 ? "$"+(n/1000).toFixed(n%1000===0?0:1)+"k" : "$"+n;
const mao  = (arv,rep) => Math.round(arv*0.7 - rep);
const num  = s => parseFloat(String(s).replace(/,/g,"") || 0);
// deal grade from spread vs asking
const dealGrade = (arv,rep,asking) => {
  const spread = mao(arv,rep) - asking;
  if (spread >= 25000) return { g:"A", c:JADE, label:"Strong" };
  if (spread >= 8000)  return { g:"B", c:AMBER, label:"Workable" };
  if (spread >= 0)     return { g:"C", c:AMBER, label:"Tight" };
  return { g:"D", c:RUST, label:"Underwater" };
};

/* ════════════════════════════════════════════════════════
   SEED DATA
════════════════════════════════════════════════════════ */
const LEADS_SEED = [
  { id:1, name:"Robert Johnson", phone:"(254) 445-8821", email:"rjohnson@email.com",
    addr:"1842 Elm St, Waco, TX 76701", city:"Waco", motivation:9,
    asking:187000, arv:245000, repairs:38000, source:"PropStream",
    lastContact:"2 days ago", nextFollowUp:"Today", stage:"Under Contract",
    temp:"hot", beds:3, baths:2, sqft:1620, yearBuilt:1998, mortgage:62000,
    reason:"Pre-foreclosure, divorce", timeline:"ASAP",
    notes:"Very motivated. Wife left, behind 3 payments, needs out fast.",
    callLog:[{ outcome:"Interested", note:"Wants $190k but will negotiate", date:"2 days ago" }],
    tasks:[{done:true,label:"Initial call"},{done:true,label:"Send contract"},{done:false,label:"Schedule inspection"}] },
  { id:2, name:"Maria Santos", phone:"(254) 332-9910", email:"msantos@gmail.com",
    addr:"934 Oak Ave, Killeen, TX 76541", city:"Killeen", motivation:8,
    asking:162000, arv:215000, repairs:30000, source:"Facebook",
    lastContact:"Today", nextFollowUp:"Tomorrow", stage:"Negotiating",
    temp:"hot", beds:4, baths:2, sqft:1840, yearBuilt:2003, mortgage:0,
    reason:"Inherited property", timeline:"30 days",
    notes:"Inherited from aunt, lives in Houston. Free & clear. Wants clean close.",
    callLog:[{ outcome:"Interested", note:"Open to offers, call back Thursday", date:"Today" }],
    tasks:[{done:true,label:"Initial call"},{done:false,label:"Send offer"}] },
  { id:3, name:"James Williams", phone:"(254) 771-4432", email:"jwill@yahoo.com",
    addr:"2201 Pine Rd, Temple, TX 76502", city:"Temple", motivation:7,
    asking:198000, arv:256000, repairs:42000, source:"County Records",
    lastContact:"4 days ago", nextFollowUp:"Today", stage:"Appointment Set",
    temp:"warm", beds:3, baths:2, sqft:1500, yearBuilt:1991, mortgage:88000,
    reason:"Tax delinquent", timeline:"60 days",
    notes:"$12k behind on taxes. Afraid of losing the house. Meeting Tue 2pm.",
    callLog:[], tasks:[{done:true,label:"Initial call"},{done:false,label:"Walkthrough"}] },
  { id:4, name:"Patricia Davis", phone:"(512) 884-2291", email:"pdavis@hotmail.com",
    addr:"567 Cedar Ln, San Marcos, TX 78666", city:"San Marcos", motivation:6,
    asking:174000, arv:228000, repairs:33000, source:"Cold Call",
    lastContact:"1 week ago", nextFollowUp:"This Week", stage:"Contacted",
    temp:"warm", beds:3, baths:1, sqft:1380, yearBuilt:1985, mortgage:45000,
    reason:"FSBO, downsizing", timeline:"Flexible",
    notes:"Skeptical on price. Follow up with comps to justify offer.",
    callLog:[{ outcome:"Voicemail", note:"Left message", date:"1 week ago" }],
    tasks:[{done:false,label:"Send comps"}] },
  { id:5, name:"Thomas Brown", phone:"(325) 667-5543", email:"tbrown@email.com",
    addr:"8823 Maple Dr, Abilene, TX 79601", city:"Abilene", motivation:5,
    asking:155000, arv:205000, repairs:28000, source:"Referral",
    lastContact:"2 weeks ago", nextFollowUp:"This Week", stage:"New Lead",
    temp:"cold", beds:4, baths:2, sqft:1720, yearBuilt:2001, mortgage:95000,
    reason:"Absentee landlord", timeline:"Maybe",
    notes:"Tenant just left. May be ready soon. Nurture.",
    callLog:[], tasks:[] },
  { id:6, name:"Sandra Lee", phone:"(254) 119-8830", email:"slee@email.com",
    addr:"410 Birch St, Waco, TX 76710", city:"Waco", motivation:4,
    asking:169000, arv:221000, repairs:31000, source:"Driving for Dollars",
    lastContact:"3 weeks ago", nextFollowUp:"Overdue", stage:"New Lead",
    temp:"cold", beds:3, baths:2, sqft:1560, yearBuilt:1994, mortgage:71000,
    reason:"Distressed exterior", timeline:"Unknown",
    notes:"Confirmed not interested yet. Long-term nurture.",
    callLog:[], tasks:[] },
];

const BUYERS_SEED = [
  { id:1, name:"Carlos Mendez", company:"Lone Star Capital", phone:"(512) 220-7781",
    email:"carlos@lonestarcap.com", areas:["Waco","Temple","Killeen"],
    types:["Single Family","Multi-Family"], strategy:"Buy & Hold",
    range:"$100k–$250k", notes:"Fast closer, never backed out. Prefers Waco. Wants 2+ deals/mo." },
  { id:2, name:"Ashley Reed", company:"Reed Renovations", phone:"(254) 880-1142",
    email:"ashley@reedrenov.com", areas:["Killeen","Temple"],
    types:["Single Family"], strategy:"Fix & Flip",
    range:"$120k–$200k", notes:"Likes heavy rehabs. Quick yes/no. Texts back fast." },
  { id:3, name:"Vikram Patel", company:"VP Holdings", phone:"(512) 445-9930",
    email:"vpatel@vpholdings.com", areas:["San Marcos","Kyle"],
    types:["Single Family","Duplex"], strategy:"Buy & Hold",
    range:"$150k–$300k", notes:"Biggest buyer. Wants light-rehab / turnkey-ish." },
  { id:4, name:"Dana White", company:"Hill Country Homes", phone:"(325) 117-6654",
    email:"dana@hillcountry.com", areas:["Abilene","Waco"],
    types:["Single Family"], strategy:"Fix & Flip",
    range:"$90k–$180k", notes:"Newer buyer. Verify proof of funds before assigning." },
];

const FINDER_SEED = [
  { id:101, addr:"1420 Austin Ave, Waco, TX 76701", city:"Waco", owner:"Gerald Pruitt",
    phone:"(254) 555-0182", email:"gpruitt@email.com", beds:3, baths:2, sqft:1540, yearBuilt:1989,
    arv:238000, repairs:34000, signal:"Pre-foreclosure", detail:"Filed 18 days ago", motivation:"High", matchScore:94,
    why:"Owner 4 months behind. High equity. Distressed sale likely within 60 days.",
    photo:"https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=700&q=80" },
  { id:102, addr:"815 Trimmier Rd, Killeen, TX 76541", city:"Killeen", owner:"Yolanda Briggs",
    phone:"(254) 555-0299", email:"ybriggs@email.com", beds:4, baths:2, sqft:1880, yearBuilt:2002,
    arv:221000, repairs:27000, signal:"Absentee owner", detail:"Vacant 90+ days", motivation:"Medium", matchScore:81,
    why:"Out-of-state owner, sitting vacant. No mortgage on record — likely free & clear.",
    photo:"https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=700&q=80" },
  { id:103, addr:"3302 Birdcreek Dr, Temple, TX 76502", city:"Temple", owner:"Marcus Tate",
    phone:"(254) 555-0344", email:"mtate@email.com", beds:3, baths:2, sqft:1610, yearBuilt:1995,
    arv:249000, repairs:41000, signal:"Tax delinquent", detail:"2 years behind", motivation:"High", matchScore:88,
    why:"Owes ~$9k back taxes. At risk of lien sale. Strong motivation to move fast.",
    photo:"https://images.unsplash.com/photo-1576941089067-2de3c901e126?w=700&q=80" },
  { id:104, addr:"612 Hutchison St, San Marcos, TX 78666", city:"San Marcos", owner:"Estate of L. Carver",
    phone:"(512) 555-0411", email:"carver.estate@email.com", beds:2, baths:1, sqft:1180, yearBuilt:1978,
    arv:212000, repairs:48000, signal:"Probate", detail:"Inherited estate", motivation:"High", matchScore:85,
    why:"In probate. Heirs out of area, typically want a quick cash sale.",
    photo:"https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=700&q=80" },
  { id:105, addr:"2244 S 14th St, Abilene, TX 79605", city:"Abilene", owner:"Denise Hollis",
    phone:"(325) 555-0566", email:"dhollis@email.com", beds:3, baths:1, sqft:1320, yearBuilt:1983,
    arv:178000, repairs:29000, signal:"Code violations", detail:"Multiple open", motivation:"Medium", matchScore:72,
    why:"Open code violations. Owner may be tired of city hassle and repairs.",
    photo:"https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?w=700&q=80" },
];

const ACTIVITY_SEED = [
  { who:"Azeez", action:"moved Robert Johnson to Under Contract", time:"22m", accent:JADE },
  { who:"Azeez", action:"logged a call — Maria Santos, Interested", time:"1h", accent:STEEL },
  { who:"David", action:"added 4 new leads from PropStream", time:"3h", accent:GOLD },
  { who:"Azeez", action:"sent Elm St deal to Carlos Mendez", time:"1d", accent:PLUM },
];

/* ════════════════════════════════════════════════════════
   PRIMITIVES
════════════════════════════════════════════════════════ */
const Eyebrow = ({ children, color=MUTE, style }) => (
  <div style={{ fontSize:10.5, letterSpacing:"0.18em", textTransform:"uppercase", fontWeight:700, color, fontFamily:FB, ...style }}>{children}</div>
);

const Card = ({ children, style, onClick }) => (
  <div onClick={onClick} style={{ background:CARD, border:`1px solid ${EDGE}`, borderRadius:4, padding:18, cursor:onClick?"pointer":"default", ...style }}>{children}</div>
);

const Pill = ({ label, color }) => (
  <span style={{ fontSize:10, padding:"3px 9px", border:`1px solid ${color}55`, color, borderRadius:3, fontWeight:700, letterSpacing:"0.06em", textTransform:"uppercase", whiteSpace:"nowrap", background:color+"10" }}>{label}</span>
);

const Stat = ({ label, value, color=INK, sub }) => (
  <div>
    <Eyebrow color={MUTE} style={{ marginBottom:5 }}>{label}</Eyebrow>
    <div style={{ fontSize:21, fontWeight:700, fontFamily:FD, color, letterSpacing:"-0.01em", lineHeight:1 }}>{value}</div>
    {sub && <div style={{ fontSize:11, color:MUTE, marginTop:4 }}>{sub}</div>}
  </div>
);

const ScreenHdr = ({ title, sub, onBack, right }) => (
  <div style={{ background:CARD, borderBottom:`1px solid ${EDGE}`, padding:"16px 18px", display:"flex", alignItems:"center", gap:13, position:"sticky", top:0, zIndex:20 }}>
    {onBack && <button onClick={onBack} style={{ background:"none", border:"none", cursor:"pointer", padding:0, display:"flex" }}><ArrowLeft size={19} color={INK} /></button>}
    <div style={{ flex:1, minWidth:0 }}>
      <div style={{ fontSize:18, fontWeight:700, color:INK, fontFamily:FD, letterSpacing:"-0.01em", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{title}</div>
      {sub && <div style={{ fontSize:11.5, color:MUTE, marginTop:1 }}>{sub}</div>}
    </div>
    {right}
  </div>
);

const Row = ({ label, value, last, vc }) => (
  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"baseline", padding:"10px 0", borderBottom:last?"none":`1px solid ${EDGE}`, gap:16 }}>
    <span style={{ fontSize:12, color:SUB, flexShrink:0 }}>{label}</span>
    <span style={{ fontSize:13, color:vc||INK, fontWeight:600, textAlign:"right" }}>{value}</span>
  </div>
);

const Field = ({ label, val, set, ph, prefix }) => (
  <div style={{ marginBottom:15 }}>
    <Eyebrow style={{ marginBottom:7 }}>{label}</Eyebrow>
    <div style={{ position:"relative", display:"flex", alignItems:"center" }}>
      {prefix && <span style={{ position:"absolute", left:13, fontSize:15, color:MUTE, fontWeight:600 }}>{prefix}</span>}
      <input value={val} onChange={e=>set(e.target.value)} placeholder={ph} inputMode="numeric"
        style={{ width:"100%", padding:prefix?"13px 14px 13px 26px":"13px 14px", border:`1px solid ${EDGE}`, borderRadius:4, fontSize:16, fontFamily:FB, color:INK, outline:"none", boxSizing:"border-box", background:CARD, fontWeight:600 }} />
    </div>
  </div>
);

/* deal economics block — the signature element */
const DealStrip = ({ arv, repairs, asking, dark=true }) => {
  const maxOffer = mao(arv, repairs);
  const grade = dealGrade(arv, repairs, asking);
  const spread = maxOffer - asking;
  const bg = dark ? INK : CARD;
  const txt = dark ? "#fff" : INK;
  const mut = dark ? "#7d8694" : MUTE;
  const line = dark ? INK3 : EDGE;
  return (
    <div style={{ background:bg, borderRadius:4, padding:18, border:dark?"none":`1px solid ${EDGE}` }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:16 }}>
        <div>
          <Eyebrow color={GOLD} style={{ marginBottom:6 }}>Max Allowable Offer</Eyebrow>
          <div style={{ fontSize:32, fontWeight:700, fontFamily:FD, color:GOLD, lineHeight:0.95, letterSpacing:"-0.02em" }}>{fmt(maxOffer)}</div>
        </div>
        <div style={{ textAlign:"center", flexShrink:0 }}>
          <div style={{ width:44, height:44, borderRadius:4, border:`1.5px solid ${grade.c}`, background:grade.c+"1e", display:"flex", alignItems:"center", justifyContent:"center", fontSize:22, fontWeight:700, color:grade.c, fontFamily:FD }}>{grade.g}</div>
          <div style={{ fontSize:9, color:grade.c, fontWeight:700, marginTop:4, letterSpacing:"0.08em", textTransform:"uppercase" }}>{grade.label}</div>
        </div>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:1, background:line, border:`1px solid ${line}`, borderRadius:4, overflow:"hidden" }}>
        {[["ARV",fmtK(arv)],["Repairs",fmtK(repairs)],["Asking",fmtK(asking)]].map(([l,v],i)=>(
          <div key={i} style={{ background:bg, padding:"10px 12px" }}>
            <div style={{ fontSize:9.5, color:mut, letterSpacing:"0.1em", textTransform:"uppercase", fontWeight:600 }}>{l}</div>
            <div style={{ fontSize:15, fontWeight:700, color:txt, fontFamily:FD, marginTop:3 }}>{v}</div>
          </div>
        ))}
      </div>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginTop:14 }}>
        <span style={{ fontSize:11, color:mut }}>Spread to asking</span>
        <span style={{ fontSize:15, fontWeight:700, fontFamily:FD, color:spread>0?JADE:RUST }}>{spread>0?"+":""}{fmt(spread)}</span>
      </div>
    </div>
  );
};

const SwipeBack = ({ onBack, children }) => {
  const ref = React.useRef(null);
  return (
    <div onTouchStart={e=>{const t=e.touches[0];ref.current=t.clientX<=44?{x:t.clientX,y:t.clientY}:null;}}
      onTouchEnd={e=>{if(!ref.current)return;const t=e.changedTouches[0];if(t.clientX-ref.current.x>72&&Math.abs(t.clientY-ref.current.y)<50)onBack();ref.current=null;}}
      style={{ minHeight:"100%" }}>{children}</div>
  );
};

/* ════════════════════════════════════════════════════════
   BOTTOM NAV
════════════════════════════════════════════════════════ */
const NAV_TABS = [
  { id:"dashboard", label:"Today",   Icon:Target },
  { id:"deals",     label:"Deals",   Icon:ClipboardList },
  { id:"finder",    label:"Finder",  Icon:Sparkles },
  { id:"buyers",    label:"Buyers",  Icon:Users },
  { id:"numbers",   label:"Numbers", Icon:Calculator },
];
const BottomNav = ({ current, onNav }) => (
  <div style={{ background:INK, display:"flex", padding:"7px 6px", paddingBottom:"calc(7px + env(safe-area-inset-bottom))", position:"sticky", bottom:0, zIndex:30, borderTop:`1px solid ${INK3}` }}>
    {NAV_TABS.map(item=>{
      const active=current===item.id;
      return (
        <button key={item.id} onClick={()=>onNav(item.id)} style={{ flex:1, background:"none", border:"none", cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", gap:4, padding:"6px 0", fontFamily:FB, position:"relative" }}>
          {active && <div style={{ position:"absolute", top:-7, width:22, height:2, background:GOLD, borderRadius:2 }} />}
          <item.Icon size={20} color={active?GOLD:"#6b7280"} strokeWidth={active?2.4:1.8} />
          <span style={{ fontSize:9.5, fontWeight:active?700:500, color:active?"#fff":"#6b7280", letterSpacing:"0.04em" }}>{item.label}</span>
        </button>
      );
    })}
  </div>
);

/* ════════════════════════════════════════════════════════
   AI SCORER (live Claude)
════════════════════════════════════════════════════════ */
const AIScorer = ({ lead }) => {
  const [loading,setLoading]=useState(false);
  const [result,setResult]=useState(null);
  const run = async () => {
    setLoading(true);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages",{
        method:"POST", headers:{"Content-Type":"application/json"},
        body:JSON.stringify({ model:"claude-opus-4-8", max_tokens:1200,
          messages:[{role:"user",content:`You are an elite Central Texas wholesaler. Analyze this lead.
Name: ${lead.name} | ${lead.addr}
Asking ${fmt(lead.asking)} | ARV ${fmt(lead.arv)} | Repairs ${fmt(lead.repairs)} | MAO ${fmt(mao(lead.arv,lead.repairs))}
Mortgage ${fmt(lead.mortgage)} | Reason: ${lead.reason} | Timeline: ${lead.timeline} | Motivation ${lead.motivation}/10
Notes: ${lead.notes}
Return ONLY JSON: {"score":85,"grade":"A","verdict":"GO","strengths":["s1","s2"],"risks":["r1","r2"],"nextMove":"...","callScript":"opener for Azeez","suggestedOffer":120000}`}] })
      });
      const data = await res.json();
      setResult(JSON.parse(data.content[0].text.replace(/```json|```/g,"").trim()));
    } catch(e) {
      setResult({ score:lead.motivation*10, grade:lead.motivation>=8?"A":lead.motivation>=6?"B":"C",
        verdict:lead.motivation>=7?"GO":"MAYBE",
        strengths:[lead.mortgage<lead.arv*0.4?"High equity position":"Workable equity", lead.reason],
        risks:["Verify ARV with fresh comps","Confirm repair scope on-site"],
        nextMove:`Call ${lead.name.split(" ")[0]} today. Lead with empathy on "${lead.reason}", anchor near ${fmt(mao(lead.arv,lead.repairs))}.`,
        callScript:`Hi ${lead.name.split(" ")[0]}, this is Azeez with D&A Property Group — I understand you're dealing with ${lead.reason.toLowerCase()}. I buy houses as-is for cash and can close fast. Mind if I ask a couple quick questions?`,
        suggestedOffer:mao(lead.arv,lead.repairs) });
    }
    setLoading(false);
  };
  const gc = g=>g==="A"?JADE:g==="B"?AMBER:RUST;
  if (loading) return <div style={{ textAlign:"center", padding:40, color:MUTE, fontSize:13 }}><RefreshCw size={22} color={GOLD}/><div style={{marginTop:10}}>Analyzing the deal…</div></div>;
  if (!result) return (
    <div>
      <button onClick={run} style={{ width:"100%", padding:16, background:INK, color:"#fff", border:"none", borderRadius:4, fontSize:14, fontWeight:700, cursor:"pointer", fontFamily:FB, display:"flex", alignItems:"center", justifyContent:"center", gap:9 }}>
        <Sparkles size={17} color={GOLD}/> Run AI Deal Analysis
      </button>
      <p style={{ fontSize:11.5, color:MUTE, textAlign:"center", marginTop:11, lineHeight:1.5 }}>Scores the deal, flags risks, and writes Azeez's opener.</p>
    </div>
  );
  return (
    <div style={{ background:INK, borderRadius:4, padding:18, color:"#fff" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:18 }}>
        <div><Eyebrow color="#7d8694" style={{marginBottom:5}}>AI Deal Score</Eyebrow>
          <div style={{ fontSize:38, fontWeight:700, fontFamily:FD, color:GOLD, lineHeight:0.9 }}>{result.score}<span style={{fontSize:15,color:"#7d8694"}}>/100</span></div></div>
        <div style={{ textAlign:"center" }}>
          <div style={{ width:50, height:50, borderRadius:4, border:`1.5px solid ${gc(result.grade)}`, background:gc(result.grade)+"1e", display:"flex", alignItems:"center", justifyContent:"center", fontSize:24, fontWeight:700, color:gc(result.grade), fontFamily:FD }}>{result.grade}</div>
          <div style={{ fontSize:9.5, color:result.verdict==="GO"?JADE:result.verdict==="PASS"?RUST:AMBER, fontWeight:700, marginTop:4, letterSpacing:"0.06em" }}>{result.verdict}</div></div>
      </div>
      {result.suggestedOffer && (
        <div style={{ border:`1px solid ${GOLD}44`, background:GOLD+"14", borderRadius:4, padding:13, marginBottom:15, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <Eyebrow color={GOLD}>Suggested opening offer</Eyebrow>
          <span style={{ fontSize:20, fontWeight:700, fontFamily:FD, color:"#fff" }}>{fmt(result.suggestedOffer)}</span>
        </div>
      )}
      <Eyebrow color="#7d8694" style={{marginBottom:7}}>Strengths</Eyebrow>
      {result.strengths.map((s,i)=><div key={i} style={{ fontSize:12.5, color:"#fff", marginBottom:5, display:"flex", gap:8 }}><Check size={14} color={JADE} style={{flexShrink:0,marginTop:1}}/>{s}</div>)}
      <Eyebrow color="#7d8694" style={{margin:"13px 0 7px"}}>Risks</Eyebrow>
      {result.risks.map((r,i)=><div key={i} style={{ fontSize:12.5, color:"#d8b88a", marginBottom:5, display:"flex", gap:8 }}><span style={{color:AMBER,flexShrink:0}}>▸</span>{r}</div>)}
      <div style={{ marginTop:15, padding:13, background:INK2, borderRadius:4 }}>
        <Eyebrow color="#7d8694" style={{marginBottom:5}}>Next move</Eyebrow>
        <div style={{ fontSize:12.5, color:"#fff", lineHeight:1.55 }}>{result.nextMove}</div>
      </div>
      <div style={{ marginTop:11, padding:13, background:GOLD+"14", border:`1px solid ${GOLD}33`, borderRadius:4 }}>
        <Eyebrow color={GOLD} style={{marginBottom:5}}>Opener for Azeez</Eyebrow>
        <div style={{ fontSize:12.5, color:"#fff", lineHeight:1.55, fontStyle:"italic" }}>"{result.callScript}"</div>
      </div>
    </div>
  );
};

/* ════════════════════════════════════════════════════════
   CALL LOGGER
════════════════════════════════════════════════════════ */
const OUTCOMES = [
  { id:"Interested", label:"Interested", c:JADE },
  { id:"Voicemail", label:"Voicemail", c:AMBER },
  { id:"Call Back", label:"Call Back", c:STEEL },
  { id:"Not Now", label:"Not Now", c:MUTE },
  { id:"Dead", label:"Dead", c:RUST },
];
const CallLogger = ({ onLog }) => {
  const [open,setOpen]=useState(false); const [note,setNote]=useState("");
  if (!open) return (
    <button onClick={()=>setOpen(true)} style={{ width:"100%", padding:13, background:CARD, border:`1px solid ${EDGE}`, borderRadius:4, fontSize:13, fontWeight:600, cursor:"pointer", fontFamily:FB, color:INK, display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}>
      <Activity size={15}/> Log Call Outcome
    </button>
  );
  return (
    <Card>
      <Eyebrow style={{marginBottom:12}}>How did the call go?</Eyebrow>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:12 }}>
        {OUTCOMES.map(o=>(
          <button key={o.id} onClick={()=>{onLog({outcome:o.id,note,date:"Just now"});setOpen(false);setNote("");}}
            style={{ padding:"11px 8px", background:o.c+"12", border:`1px solid ${o.c}40`, borderRadius:4, cursor:"pointer", fontFamily:FB, fontSize:12.5, fontWeight:700, color:o.c }}>{o.label}</button>
        ))}
      </div>
      <textarea value={note} onChange={e=>setNote(e.target.value)} placeholder="Quick note…" style={{ width:"100%", padding:"10px 12px", border:`1px solid ${EDGE}`, borderRadius:4, fontSize:13, fontFamily:FB, color:INK, outline:"none", resize:"none", height:60, boxSizing:"border-box" }} />
      <button onClick={()=>setOpen(false)} style={{ marginTop:8, width:"100%", padding:9, background:"transparent", border:"none", color:MUTE, fontSize:12, cursor:"pointer", fontFamily:FB }}>Cancel</button>
    </Card>
  );
};

/* ════════════════════════════════════════════════════════
   DEAL ROOM
════════════════════════════════════════════════════════ */
const DealRoom = ({ lead, onBack }) => {
  const feeEst = mao(lead.arv,lead.repairs) - Math.round(lead.asking*0.92);
  const matched = BUYERS_SEED.filter(b=>b.areas.includes(lead.city));
  const checklist = [
    {label:"Contract Signed",done:true},{label:"Title Ordered",done:true},
    {label:"Buyer Identified",done:matched.length>0},{label:"Assignment Signed",done:false},
    {label:"Closing Scheduled",done:false},{label:"Closed & Paid",done:false},
  ];
  const done = checklist.filter(c=>c.done).length;
  return (
    <SwipeBack onBack={onBack}><div style={{ background:PAPER, fontFamily:FB, minHeight:"100%" }}>
      <ScreenHdr title="Deal Room" sub={lead.addr.split(",")[0]} onBack={onBack} />
      <div style={{ background:INK, padding:"20px 18px" }}>
        <Eyebrow color={GOLD} style={{marginBottom:6}}>Projected Assignment Fee</Eyebrow>
        <div style={{ fontSize:38, fontWeight:700, fontFamily:FD, color:GOLD, lineHeight:0.95 }}>{fmt(feeEst)}</div>
        <div style={{ fontSize:12, color:"#7d8694", marginTop:8 }}>{lead.name} · {lead.city}, TX</div>
        <div style={{ marginTop:16 }}>
          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}><span style={{fontSize:11,color:"#7d8694"}}>Closing progress</span><span style={{fontSize:11,color:GOLD,fontWeight:700}}>{done} of {checklist.length}</span></div>
          <div style={{ display:"flex", gap:4 }}>
            {checklist.map((c,i)=><div key={i} style={{ flex:1, height:3, borderRadius:2, background:c.done?GOLD:INK3 }} />)}
          </div>
        </div>
      </div>
      <div style={{ padding:16 }}>
        <Eyebrow color={SUB} style={{marginBottom:11}}>Closing Checklist</Eyebrow>
        <Card style={{ marginBottom:18, padding:"4px 18px" }}>
          {checklist.map((c,i)=>(
            <div key={i} style={{ display:"flex", alignItems:"center", gap:12, padding:"13px 0", borderBottom:i<checklist.length-1?`1px solid ${EDGE}`:"none" }}>
              {c.done?<CheckCircle2 size={19} color={JADE}/>:<div style={{width:19,height:19,borderRadius:"50%",border:`1.5px solid ${EDGE}`}}/>}
              <span style={{ fontSize:13, flex:1, color:c.done?INK:MUTE, fontWeight:c.done?600:400 }}>{c.label}</span>
              {c.done && <Pill label="Done" color={JADE}/>}
            </div>
          ))}
        </Card>
        <Eyebrow color={SUB} style={{marginBottom:11}}>Matched Buyers · {matched.length}</Eyebrow>
        {matched.map(b=>(
          <Card key={b.id} style={{ marginBottom:9, display:"flex", alignItems:"center", gap:13 }}>
            <Avatar initial={b.name[0]} />
            <div style={{ flex:1 }}><div style={{fontSize:14,fontWeight:700,color:INK}}>{b.name}</div><div style={{fontSize:11.5,color:MUTE}}>{b.strategy} · {b.range}</div></div>
            <a href={`sms:${b.phone}`} style={{ padding:"9px 14px", background:INK, color:"#fff", borderRadius:4, textDecoration:"none", fontSize:12, fontWeight:600 }}>Send</a>
          </Card>
        ))}
        <button style={{ width:"100%", marginTop:6, padding:14, background:GOLD, color:INK, border:"none", borderRadius:4, fontSize:13.5, fontWeight:700, cursor:"pointer", fontFamily:FB, display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}><Send size={16}/> Blast to All Matched Buyers</button>
      </div>
    </div></SwipeBack>
  );
};

const Avatar = ({ initial, size=42, on="dark" }) => (
  <div style={{ width:size, height:size, borderRadius:4, background:on==="dark"?INK:GOLD, color:on==="dark"?GOLD:INK, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:700, fontSize:size*0.4, fontFamily:FD, flexShrink:0 }}>{initial}</div>
);

/* ════════════════════════════════════════════════════════
   LEAD DETAIL
════════════════════════════════════════════════════════ */
/* ════════════════════════════════════════════════════════
   AI OFFER & OUTREACH — generates offer + seller messages
════════════════════════════════════════════════════════ */
const AIOffer = ({ lead }) => {
  const [loading,setLoading]=useState(false);
  const [out,setOut]=useState(null);
  const maxOffer = mao(lead.arv, lead.repairs);
  const run = async () => {
    setLoading(true);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages",{
        method:"POST", headers:{"Content-Type":"application/json"},
        body:JSON.stringify({ model:"claude-opus-4-8", max_tokens:1400,
          messages:[{role:"user",content:`You are a Central Texas wholesaler writing seller outreach for D&A Property Group (caller: Azeez). Be warm, plain, never pushy. Texas SB 2212: we assign contracts, not licensed agents.
Seller: ${lead.name} | ${lead.addr} | reason: ${lead.reason} | timeline: ${lead.timeline} | motivation ${lead.motivation}/10
MAO ${fmt(maxOffer)}. Suggested opening offer slightly below MAO.
Return ONLY JSON: {"opening":120000,"text":"a short SMS to the seller","email_subject":"...","email_body":"a short email","talkingPoints":["point1","point2","point3"]}`}] })
      });
      const data = await res.json();
      setOut(JSON.parse(data.content[0].text.replace(/```json|```/g,"").trim()));
    } catch(e) {
      const opening = Math.round(maxOffer*0.93);
      setOut({
        opening,
        text:`Hi ${lead.name.split(" ")[0]}, it's Azeez with D&A Property Group. Thanks for the time earlier. Based on the condition, I can do a cash, as-is offer around ${fmt(opening)}, close on your timeline, no fees or repairs on you. Want me to send the simple agreement over?`,
        email_subject:`Cash offer for ${lead.addr.split(",")[0]}`,
        email_body:`Hi ${lead.name.split(" ")[0]},\n\nThanks for talking with me. As we discussed, D&A Property Group can purchase your property at ${lead.addr.split(",")[0]} as-is for cash — no repairs, no agent commissions, and we cover closing costs. We can close on your timeline.\n\nBased on everything you shared, I can put together an offer around ${fmt(opening)}. To be upfront: we purchase through a contract that we may assign to a buyer in our network, and you'll know exactly who closes before anything is final.\n\nIf that works, I'll send a simple one-page agreement to get started. Happy to answer any questions.\n\n— Azeez, D&A Property Group`,
        talkingPoints:[
          `Lead with empathy about ${lead.reason.toLowerCase()} before the number`,
          `Anchor at ${fmt(opening)}, hold firm under ${fmt(maxOffer)}`,
          `Sell speed & certainty: cash, as-is, no fees, close on their timeline`
        ]
      });
    }
    setLoading(false);
  };
  if (loading) return <div style={{ textAlign:"center", padding:40, color:MUTE, fontSize:13 }}><RefreshCw size={22} color={GOLD}/><div style={{marginTop:10}}>Writing your offer & messages…</div></div>;
  if (!out) return (
    <div>
      <DealStrip arv={lead.arv} repairs={lead.repairs} asking={lead.asking} />
      <button onClick={run} style={{ width:"100%", marginTop:14, padding:16, background:INK, color:"#fff", border:"none", borderRadius:4, fontSize:14, fontWeight:700, cursor:"pointer", fontFamily:FB, display:"flex", alignItems:"center", justifyContent:"center", gap:9 }}>
        <Sparkles size={17} color={GOLD}/> Build Offer & Outreach
      </button>
      <p style={{ fontSize:11.5, color:MUTE, textAlign:"center", marginTop:11, lineHeight:1.5 }}>AI writes a ready-to-send text, email, and your talking points — tuned to this seller.</p>
    </div>
  );
  const smsHref = `sms:${lead.phone}?&body=${encodeURIComponent(out.text)}`;
  const mailHref = `mailto:${lead.email}?subject=${encodeURIComponent(out.email_subject)}&body=${encodeURIComponent(out.email_body)}`;
  return (
    <div>
      <div style={{ background:INK, borderRadius:4, padding:20, marginBottom:14, textAlign:"center" }}>
        <Eyebrow color="#7d8694" style={{marginBottom:8}}>AI Suggested Opening Offer</Eyebrow>
        <div style={{ fontSize:40, fontWeight:700, fontFamily:FD, color:GOLD, lineHeight:0.95 }}>{fmt(out.opening)}</div>
        <div style={{ fontSize:11.5, color:"#7d8694", marginTop:8 }}>Ceiling (MAO): {fmt(maxOffer)} — never exceed</div>
      </div>
      <Eyebrow color={SUB} style={{marginBottom:9}}>Talking Points</Eyebrow>
      <Card style={{ marginBottom:16, padding:"4px 18px" }}>
        {out.talkingPoints.map((p,i)=>(
          <div key={i} style={{ display:"flex", gap:9, padding:"12px 0", borderBottom:i<out.talkingPoints.length-1?`1px solid ${EDGE}`:"none" }}>
            <span style={{ fontSize:12, fontWeight:700, color:GOLD, fontFamily:FD }}>{i+1}</span>
            <span style={{ fontSize:13, color:INK, lineHeight:1.5 }}>{p}</span>
          </div>
        ))}
      </Card>
      <Eyebrow color={SUB} style={{marginBottom:9}}>Ready to Send — Text</Eyebrow>
      <Card style={{ marginBottom:10 }}>
        <div style={{ fontSize:13, color:INK, lineHeight:1.6, fontStyle:"italic" }}>{out.text}</div>
      </Card>
      <a href={smsHref} style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:7, padding:13, background:GOLD, color:INK, borderRadius:4, textDecoration:"none", fontSize:13.5, fontWeight:700, marginBottom:18 }}><MessageSquare size={16}/> Send This Text</a>
      <Eyebrow color={SUB} style={{marginBottom:9}}>Ready to Send — Email</Eyebrow>
      <Card style={{ marginBottom:10 }}>
        <div style={{ fontSize:12, fontWeight:700, color:INK, marginBottom:7 }}>{out.email_subject}</div>
        <div style={{ fontSize:12.5, color:SUB, lineHeight:1.6, whiteSpace:"pre-line" }}>{out.email_body}</div>
      </Card>
      <a href={mailHref} style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:7, padding:13, background:INK, color:"#fff", borderRadius:4, textDecoration:"none", fontSize:13.5, fontWeight:700, marginBottom:12 }}><Mail size={16}/> Send This Email</a>
      <button onClick={()=>setOut(null)} style={{ width:"100%", padding:11, background:"transparent", border:`1px solid ${EDGE}`, borderRadius:4, color:SUB, fontSize:12.5, fontWeight:600, cursor:"pointer", fontFamily:FB }}>Regenerate</button>
    </div>
  );
};

const LEAD_TABS = [{id:"overview",label:"Overview"},{id:"deal",label:"Economics"},{id:"ai",label:"AI Score"},{id:"offer",label:"Offer"},{id:"calls",label:"Calls"},{id:"notes",label:"Notes"}];
const LeadDetail = ({ lead:initLead, onBack, onUpdate }) => {
  const [lead,setLead]=useState(initLead);
  const [tab,setTab]=useState("overview");
  const [room,setRoom]=useState(false);
  React.useEffect(()=>{ setLead(initLead); }, [initLead]);
  if (room) return <DealRoom lead={lead} onBack={()=>setRoom(false)} />;
  const c = TEMP[lead.temp];
  const equity = lead.arv - lead.mortgage;
  const equityPct = Math.round((equity/lead.arv)*100);
  const logCall = e => { const u={...lead,callLog:[e,...(lead.callLog||[])]}; setLead(u); if(onUpdate)onUpdate(u); };
  const setStage = newStage => { const u={...lead,stage:newStage}; setLead(u); if(onUpdate)onUpdate(u); };
  return (
    <SwipeBack onBack={onBack}><div style={{ background:PAPER, fontFamily:FB, minHeight:"100%" }}>
      <ScreenHdr title={lead.name} sub={`${lead.addr.split(",")[0]} · ${lead.city}`} onBack={onBack}
        right={lead.stage==="Under Contract"?<button onClick={()=>setRoom(true)} style={{ padding:"8px 12px", background:JADE, color:"#fff", border:"none", borderRadius:4, fontSize:11, fontWeight:700, cursor:"pointer", fontFamily:FB, display:"flex", alignItems:"center", gap:5 }}><Shield size={13}/> Deal Room</button>:null} />
      <div style={{ background:CARD, padding:"12px 18px", borderBottom:`1px solid ${EDGE}`, display:"flex", gap:8 }}>
        <a href={`tel:${lead.phone}`} style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", gap:6, padding:11, background:INK, color:"#fff", borderRadius:4, textDecoration:"none", fontSize:13, fontWeight:600 }}><PhoneCall size={15}/> Call</a>
        <a href={`sms:${lead.phone}`} style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", gap:6, padding:11, background:CARD, border:`1px solid ${EDGE}`, color:INK, borderRadius:4, textDecoration:"none", fontSize:13, fontWeight:600 }}><MessageSquare size={15}/> Text</a>
        <a href={`mailto:${lead.email}`} style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", gap:6, padding:11, background:CARD, border:`1px solid ${EDGE}`, color:INK, borderRadius:4, textDecoration:"none", fontSize:13, fontWeight:600 }}><Mail size={15}/> Email</a>
      </div>
      <div style={{ background:CARD, borderBottom:`1px solid ${EDGE}`, display:"flex", padding:"0 10px", overflowX:"auto" }}>
        {LEAD_TABS.map(t=>(
          <button key={t.id} onClick={()=>setTab(t.id)} style={{ padding:"13px 13px", background:"none", border:"none", borderBottom:`2px solid ${tab===t.id?INK:"transparent"}`, color:tab===t.id?INK:MUTE, fontSize:12.5, fontWeight:tab===t.id?700:500, cursor:"pointer", fontFamily:FB, whiteSpace:"nowrap" }}>{t.label}</button>
        ))}
      </div>
      <div style={{ padding:16 }}>
        {tab==="overview" && <>
          <div style={{ display:"flex", gap:7, marginBottom:14, flexWrap:"wrap" }}>
            <Pill label={TEMP_L[lead.temp]} color={c}/><Pill label={`Mot ${lead.motivation}/10`} color={lead.motivation>=7?JADE:AMBER}/>
          </div>
          {/* fast stage mover */}
          <Eyebrow color={SUB} style={{marginBottom:8}}>Move Stage</Eyebrow>
          <div style={{ display:"flex", gap:6, overflowX:"auto", marginBottom:16, paddingBottom:2 }}>
            {PIPE_STAGES.filter(s=>s!=="Dead Lead").map(s=>{
              const on = lead.stage===s;
              return <button key={s} onClick={()=>setStage(s)} style={{ whiteSpace:"nowrap", padding:"8px 12px", borderRadius:4, border:`1px solid ${on?PIPE_C[s]:EDGE}`, background:on?PIPE_C[s]:CARD, color:on?"#fff":SUB, cursor:"pointer", fontSize:11.5, fontWeight:on?700:500, fontFamily:FB }}>{s}</button>;
            })}
          </div>
          <div style={{ background:INK, borderRadius:4, padding:16, marginBottom:14, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <div><Eyebrow color="#7d8694" style={{marginBottom:5}}>Seller Equity</Eyebrow><div style={{fontSize:24,fontWeight:700,fontFamily:FD,color:equityPct>=40?GOLD:"#fff"}}>{fmt(equity)}</div></div>
            <div style={{ textAlign:"right" }}><Eyebrow color="#7d8694" style={{marginBottom:5}}>Equity</Eyebrow><div style={{fontSize:24,fontWeight:700,fontFamily:FD,color:equityPct>=40?JADE:equityPct>=20?AMBER:RUST}}>{equityPct}%</div></div>
          </div>
          <Card style={{ marginBottom:12, padding:"4px 18px" }}>
            <div style={{padding:"14px 0 4px"}}><Eyebrow color={SUB}>Seller & Situation</Eyebrow></div>
            <Row label="Phone" value={lead.phone} /><Row label="Reason selling" value={lead.reason} />
            <Row label="Timeline" value={lead.timeline} vc={lead.timeline==="ASAP"?RUST:INK} /><Row label="Mortgage owed" value={fmt(lead.mortgage)} last />
          </Card>
          <Card style={{ padding:"4px 18px" }}>
            <div style={{padding:"14px 0 4px"}}><Eyebrow color={SUB}>Property</Eyebrow></div>
            <Row label="Beds / Baths" value={`${lead.beds} / ${lead.baths}`} /><Row label="Square feet" value={lead.sqft.toLocaleString()} />
            <Row label="Year built" value={lead.yearBuilt} /><Row label="Source" value={lead.source} last />
          </Card>
        </>}
        {tab==="deal" && <>
          <DealStrip arv={lead.arv} repairs={lead.repairs} asking={lead.asking} />
          <Card style={{ marginTop:14, padding:"4px 18px" }}>
            <div style={{padding:"14px 0 4px"}}><Eyebrow color={SUB}>The Math</Eyebrow></div>
            <Row label="ARV × 70%" value={fmt(Math.round(lead.arv*0.7))} /><Row label="Less repairs" value={`− ${fmt(lead.repairs)}`} />
            <Row label="MAO" value={fmt(mao(lead.arv,lead.repairs))} vc={JADE} /><Row label="Seller asking" value={fmt(lead.asking)} />
            <Row label="Est. assignment fee" value={fmt(Math.max(0,(mao(lead.arv,lead.repairs)-lead.asking)*0.7))} vc={JADE} last />
          </Card>
        </>}
        {tab==="ai" && <AIScorer lead={lead} />}
        {tab==="offer" && <AIOffer lead={lead} />}
        {tab==="calls" && <>
          <CallLogger onLog={logCall} />
          <div style={{ marginTop:14 }}>
            <Eyebrow color={SUB} style={{marginBottom:11}}>Call History</Eyebrow>
            {(lead.callLog||[]).length===0 && <div style={{textAlign:"center",padding:28,color:MUTE,fontSize:13}}>No calls logged yet</div>}
            {(lead.callLog||[]).map((e,i)=>{const oc=OUTCOMES.find(o=>o.id===e.outcome)||{c:MUTE};return(
              <Card key={i} style={{ marginBottom:8, borderLeft:`3px solid ${oc.c}` }}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:e.note?6:0 }}><Pill label={e.outcome} color={oc.c}/><span style={{fontSize:11,color:MUTE}}>{e.date}</span></div>
                {e.note && <div style={{fontSize:13,color:INK}}>{e.note}</div>}
              </Card>
            );})}
          </div>
        </>}
        {tab==="notes" && <>
          <Card style={{ marginBottom:12 }}><Eyebrow color={SUB} style={{marginBottom:9}}>Notes</Eyebrow><div style={{fontSize:13.5,color:INK,lineHeight:1.65}}>{lead.notes}</div></Card>
          <Card style={{ padding:"4px 18px" }}>
            <div style={{padding:"14px 0 4px"}}><Eyebrow color={SUB}>Tasks</Eyebrow></div>
            {(lead.tasks||[]).length===0 && <div style={{fontSize:13,color:MUTE,padding:"8px 0 14px"}}>No tasks yet</div>}
            {(lead.tasks||[]).map((t,i)=>(
              <div key={i} style={{ display:"flex", alignItems:"center", gap:11, padding:"11px 0", borderBottom:i<lead.tasks.length-1?`1px solid ${EDGE}`:"none" }}>
                {t.done?<CheckCircle2 size={18} color={JADE}/>:<div style={{width:18,height:18,borderRadius:"50%",border:`1.5px solid ${EDGE}`}}/>}
                <span style={{ fontSize:13, color:t.done?MUTE:INK, textDecoration:t.done?"line-through":"none" }}>{t.label}</span>
              </div>
            ))}
          </Card>
        </>}
      </div>
    </div></SwipeBack>
  );
};

/* ════════════════════════════════════════════════════════
   DASHBOARD — "Today"
════════════════════════════════════════════════════════ */
const Dashboard = ({ user, leads, onOpenLead, onGoFinder, onQuickAdd }) => {
  const hot = leads.filter(l=>l.temp==="hot");
  const today = leads.filter(l=>l.nextFollowUp==="Today");
  const overdue = leads.filter(l=>l.nextFollowUp==="Overdue");
  const appts = leads.filter(l=>l.stage==="Appointment Set");
  const queue = [...overdue, ...today];
  const hour = new Date().getHours();
  const greet = hour<12?"Good morning":hour<17?"Good afternoon":"Good evening";

  return (
    <div style={{ background:PAPER, fontFamily:FB, minHeight:"100%" }}>
      {/* hero */}
      <div style={{ background:INK, padding:"22px 18px 24px", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", top:-40, right:-30, width:160, height:160, borderRadius:"50%", background:GOLD, opacity:0.06 }} />
        <Eyebrow color={GOLD}>{new Date().toLocaleDateString("en-US",{weekday:"long",month:"long",day:"numeric"})}</Eyebrow>
        <div style={{ fontSize:26, fontWeight:700, color:"#fff", fontFamily:FD, marginTop:6, letterSpacing:"-0.01em" }}>{greet}, {user.name}.</div>
        <div style={{ fontSize:13.5, color:"#9aa0ab", marginTop:6, lineHeight:1.5 }}>
          You've got <span style={{color:RUST,fontWeight:700}}>{hot.length} hot leads</span> and <span style={{color:GOLD,fontWeight:700}}>{queue.length} follow-ups</span> waiting. Let's move.
        </div>
        <div style={{ display:"flex", gap:10, marginTop:18 }}>
          {[["Hot",hot.length,RUST],["Due",queue.length,GOLD],["Appts",appts.length,STEEL]].map(([l,v,col],i)=>(
            <div key={i} style={{ flex:1, background:INK2, borderRadius:4, padding:"12px 14px", borderTop:`2px solid ${col}` }}>
              <div style={{ fontSize:26, fontWeight:700, fontFamily:FD, color:"#fff", lineHeight:1 }}>{v}</div>
              <div style={{ fontSize:10.5, color:"#9aa0ab", marginTop:4, letterSpacing:"0.06em", textTransform:"uppercase", fontWeight:600 }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding:16 }}>
        {/* AI finder nudge */}
        <button onClick={onGoFinder} style={{ width:"100%", background:`linear-gradient(100deg, ${INK2}, ${INK})`, border:`1px solid ${GOLD}33`, borderRadius:4, padding:"14px 16px", cursor:"pointer", textAlign:"left", fontFamily:FB, display:"flex", alignItems:"center", gap:13, marginBottom:22 }}>
          <div style={{ width:40, height:40, borderRadius:4, background:GOLD+"1e", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}><Sparkles size={20} color={GOLD}/></div>
          <div style={{ flex:1 }}><div style={{fontSize:13.5,fontWeight:700,color:"#fff"}}>5 fresh distressed properties found</div><div style={{fontSize:11.5,color:"#9aa0ab",marginTop:2}}>New pre-foreclosures & probate in your markets</div></div>
          <ChevronRight size={18} color={GOLD}/>
        </button>

        {/* priority queue */}
        {hot.length>0 && <>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:12 }}>
            <Eyebrow color={SUB}>Call First</Eyebrow>
            <span style={{ fontSize:11, color:RUST, fontWeight:700, display:"flex", alignItems:"center", gap:4 }}><Flame size={12}/> {hot.length} hot</span>
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:9, marginBottom:22 }}>
            {hot.map(l=>{const grade=dealGrade(l.arv,l.repairs,l.asking);return(
              <div key={l.id} onClick={()=>onOpenLead(l)} style={{ background:CARD, border:`1px solid ${EDGE}`, borderLeft:`3px solid ${RUST}`, borderRadius:4, padding:"13px 15px", cursor:"pointer", display:"flex", alignItems:"center", gap:13 }}>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:8 }}><span style={{fontSize:14.5,fontWeight:700,color:INK}}>{l.name}</span><span style={{fontSize:11,fontWeight:700,color:grade.c}}>{grade.g}</span></div>
                  <div style={{ fontSize:11.5, color:MUTE, marginTop:2 }}>{l.city} · {l.reason}</div>
                  <div style={{ display:"flex", gap:12, marginTop:6 }}>
                    <span style={{fontSize:11.5,color:JADE,fontWeight:700}}>MAO {fmtK(mao(l.arv,l.repairs))}</span>
                    <span style={{fontSize:11.5,color:l.nextFollowUp==="Overdue"?RUST:AMBER,fontWeight:700}}>{l.nextFollowUp}</span>
                  </div>
                </div>
                <a href={`tel:${l.phone}`} onClick={e=>e.stopPropagation()} style={{ width:40, height:40, background:INK, borderRadius:4, display:"flex", alignItems:"center", justifyContent:"center", textDecoration:"none", flexShrink:0 }}><PhoneCall size={16} color="#fff"/></a>
              </div>
            );})}
          </div>
        </>}

        {/* follow ups */}
        {queue.length>0 && <>
          <Eyebrow color={SUB} style={{marginBottom:12}}>Follow-Ups Due</Eyebrow>
          <Card style={{ marginBottom:22, padding:"2px 16px" }}>
            {queue.map((l,i)=>(
              <div key={l.id} onClick={()=>onOpenLead(l)} style={{ display:"flex", alignItems:"center", gap:12, padding:"13px 0", borderBottom:i<queue.length-1?`1px solid ${EDGE}`:"none", cursor:"pointer" }}>
                <div style={{ width:7, height:7, borderRadius:"50%", background:l.nextFollowUp==="Overdue"?RUST:AMBER, flexShrink:0 }} />
                <div style={{ flex:1 }}><div style={{fontSize:13.5,fontWeight:600,color:INK}}>{l.name}</div><div style={{fontSize:11,color:MUTE}}>{l.stage}</div></div>
                <span style={{ fontSize:11, fontWeight:700, color:l.nextFollowUp==="Overdue"?RUST:AMBER }}>{l.nextFollowUp}</span>
                <ChevronRight size={15} color="#c9c2b4"/>
              </div>
            ))}
          </Card>
        </>}

        {/* activity */}
        <Eyebrow color={SUB} style={{marginBottom:12}}>Team Activity</Eyebrow>
        <Card style={{ padding:"2px 16px" }}>
          {ACTIVITY_SEED.map((a,i)=>(
            <div key={i} style={{ display:"flex", gap:12, padding:"12px 0", borderBottom:i<ACTIVITY_SEED.length-1?`1px solid ${EDGE}`:"none", alignItems:"center" }}>
              <div style={{ width:28, height:28, borderRadius:4, background:a.who==="David"?INK:GOLD, color:a.who==="David"?GOLD:INK, display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:700, fontFamily:FD, flexShrink:0 }}>{a.who[0]}</div>
              <div style={{ flex:1 }}><div style={{fontSize:12.5,color:INK,lineHeight:1.4}}><b>{a.who}</b> {a.action}</div></div>
              <span style={{ fontSize:11, color:MUTE, flexShrink:0 }}>{a.time}</span>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
};

/* ════════════════════════════════════════════════════════
   DEALS (list + pipeline)
════════════════════════════════════════════════════════ */
const TEMP_TABS = [{id:"all",label:"All"},{id:"hot",label:"Hot"},{id:"warm",label:"Warm"},{id:"cold",label:"Cold"}];
const Deals = ({ leads, onOpenLead, onQuickAdd }) => {
  const [view,setView]=useState("list");
  const [filter,setFilter]=useState("all");
  const [search,setSearch]=useState("");
  const [stage,setStage]=useState(null);
  const setSel = onOpenLead;
  if (stage) {
    const leads=leads.filter(l=>l.stage===stage);
    return (
      <SwipeBack onBack={()=>setStage(null)}><div style={{ background:PAPER, fontFamily:FB, minHeight:"100%" }}>
        <ScreenHdr title={stage} sub={`${leads.length} ${leads.length===1?"deal":"deals"}`} onBack={()=>setStage(null)} />
        <div style={{ padding:14 }}>
          {leads.length===0 && <div style={{textAlign:"center",padding:60,color:MUTE,fontSize:14}}>Nothing in this stage yet</div>}
          {leads.map(l=>{const grade=dealGrade(l.arv,l.repairs,l.asking);return(
            <Card key={l.id} onClick={()=>setSel(l)} style={{ borderTop:`2px solid ${PIPE_C[stage]}`, marginBottom:10 }}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                <div><div style={{fontSize:15,fontWeight:700,color:INK}}>{l.name}</div><div style={{fontSize:12,color:MUTE,marginTop:2}}>{l.addr.split(",")[0]} · {l.city}</div></div>
                <div style={{width:30,height:30,borderRadius:4,border:`1.5px solid ${grade.c}`,background:grade.c+"15",display:"flex",alignItems:"center",justifyContent:"center",fontSize:15,fontWeight:700,color:grade.c,fontFamily:FD}}>{grade.g}</div>
              </div>
              <div style={{display:"flex",gap:14,marginTop:11}}><span style={{fontSize:12,color:MUTE}}>Ask {fmtK(l.asking)}</span><span style={{fontSize:12,color:JADE,fontWeight:700}}>MAO {fmtK(mao(l.arv,l.repairs))}</span></div>
            </Card>
          );})}
        </div>
      </div></SwipeBack>
    );
  }
  const shown = leads.filter(l=>filter==="all"||l.temp===filter).filter(l=>!search||l.name.toLowerCase().includes(search.toLowerCase())||l.city.toLowerCase().includes(search.toLowerCase()));
  return (
    <div style={{ background:PAPER, fontFamily:FB, minHeight:"100%" }}>
      <ScreenHdr title="Deals" sub={`${leads.length} active`}
        right={<button style={{ display:"flex", alignItems:"center", gap:5, padding:"9px 13px", background:INK, color:"#fff", border:"none", borderRadius:4, fontSize:12, fontWeight:600, cursor:"pointer", fontFamily:FB }}><Plus size={14}/> Add</button>} />
      <div style={{ background:CARD, borderBottom:`1px solid ${EDGE}`, padding:"10px 14px", display:"flex", gap:8 }}>
        {[{id:"list",label:"List"},{id:"pipeline",label:"Pipeline"}].map(v=>{const a=view===v.id;return(
          <button key={v.id} onClick={()=>setView(v.id)} style={{ flex:1, padding:"10px 0", borderRadius:4, border:a?"none":`1px solid ${EDGE}`, background:a?INK:CARD, color:a?"#fff":MUTE, cursor:"pointer", fontSize:13, fontWeight:600, fontFamily:FB }}>{v.label}</button>
        );})}
      </div>
      {view==="list" && <>
        <div style={{ background:CARD, borderBottom:`1px solid ${EDGE}`, padding:"10px 14px" }}>
          <div style={{ position:"relative" }}>
            <Search size={15} color={MUTE} style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)" }} />
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search name or city" style={{ width:"100%", padding:"10px 12px 10px 34px", border:`1px solid ${EDGE}`, borderRadius:4, fontSize:13, fontFamily:FB, color:INK, outline:"none", boxSizing:"border-box", background:PAPER }} />
          </div>
        </div>
        <div style={{ background:CARD, borderBottom:`1px solid ${EDGE}`, padding:"10px 14px", display:"flex", gap:7, overflowX:"auto" }}>
          {TEMP_TABS.map(f=>{const n=f.id==="all"?leads.length:leads.filter(l=>l.temp===f.id).length;const a=filter===f.id;return(
            <button key={f.id} onClick={()=>setFilter(f.id)} style={{ whiteSpace:"nowrap", padding:"7px 13px", borderRadius:4, border:a?"none":`1px solid ${EDGE}`, background:a?INK:CARD, color:a?"#fff":MUTE, cursor:"pointer", fontSize:12, fontWeight:600, fontFamily:FB }}>{f.label} · {n}</button>
          );})}
        </div>
        <div style={{ padding:14, display:"flex", flexDirection:"column", gap:9 }}>
          {shown.length===0 && <div style={{textAlign:"center",padding:40,color:MUTE,fontSize:13}}>No deals match</div>}
          {shown.map(l=>{const cc=TEMP[l.temp];const grade=dealGrade(l.arv,l.repairs,l.asking);return(
            <div key={l.id} onClick={()=>setSel(l)} style={{ background:CARD, border:`1px solid ${EDGE}`, borderLeft:`3px solid ${cc}`, borderRadius:4, padding:14, cursor:"pointer", display:"flex", alignItems:"center", gap:13 }}>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ display:"flex", alignItems:"center", gap:8, flexWrap:"wrap" }}><span style={{fontSize:14.5,fontWeight:700,color:INK}}>{l.name}</span><Pill label={l.stage} color={PIPE_C[l.stage]||MUTE}/></div>
                <div style={{ fontSize:11.5, color:MUTE, marginTop:3 }}>{l.addr.split(",")[0]} · {l.city}</div>
                <div style={{ display:"flex", gap:13, marginTop:7 }}>
                  <span style={{fontSize:11.5,color:MUTE}}>Ask {fmtK(l.asking)}</span>
                  <span style={{fontSize:11.5,color:JADE,fontWeight:700}}>MAO {fmtK(mao(l.arv,l.repairs))}</span>
                  <span style={{fontSize:11.5,color:l.nextFollowUp==="Overdue"?RUST:l.nextFollowUp==="Today"?AMBER:MUTE,fontWeight:600}}>{l.nextFollowUp}</span>
                </div>
              </div>
              <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:7 }}>
                <div style={{ width:34, height:34, borderRadius:4, border:`1.5px solid ${grade.c}`, background:grade.c+"15", display:"flex", alignItems:"center", justifyContent:"center", fontSize:15, fontWeight:700, color:grade.c, fontFamily:FD }}>{grade.g}</div>
              </div>
            </div>
          );})}
        </div>
      </>}
      {view==="pipeline" && (
        <div style={{ padding:14 }}>
          {PIPE_STAGES.map((s,i)=>{const cc=PIPE_C[s];const n=leads.filter(l=>l.stage===s).length;return(
            <button key={s} onClick={()=>n>0&&setStage(s)} style={{ width:"100%", background:CARD, border:`1px solid ${EDGE}`, borderRadius:4, padding:"14px 16px", cursor:n>0?"pointer":"default", textAlign:"left", fontFamily:FB, display:"flex", alignItems:"center", gap:14, marginBottom:8, opacity:n>0?1:0.5 }}>
              <div style={{ width:3, alignSelf:"stretch", background:cc, borderRadius:2 }} />
              <div style={{ flex:1 }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                  <span style={{ fontSize:14, fontWeight:700, color:n>0?INK:MUTE }}>{s}</span>
                  <span style={{ fontSize:18, fontWeight:700, fontFamily:FD, color:n>0?cc:"#c9c2b4" }}>{n}</span>
                </div>
              </div>
              {n>0 && <ChevronRight size={16} color="#c9c2b4"/>}
            </button>
          );})}
        </div>
      )}
    </div>
  );
};

/* ════════════════════════════════════════════════════════
   AI FINDER
════════════════════════════════════════════════════════ */
const SIGNAL_OPTIONS = ["Pre-foreclosure","Tax delinquent","Probate","Absentee owner","Vacant","Code violations","Divorce","Inherited","Tired landlord"];
const AIFinder = ({ onAddLead }) => {
  const [sel,setSel]=useState(null);
  const [filter,setFilter]=useState("all");
  const [showSearch,setShowSearch]=useState(false);
  const [location,setLocation]=useState("");
  const [radius,setRadius]=useState("25");
  const [signals,setSignals]=useState([]);
  const [minBeds,setMinBeds]=useState("");
  const [maxPrice,setMaxPrice]=useState("");
  const [keywords,setKeywords]=useState("");
  const [searched,setSearched]=useState(false);
  const toggleSig = s => setSignals(p=>p.includes(s)?p.filter(x=>x!==s):[...p,s]);

  if (sel) {
    const maxOffer=mao(sel.arv,sel.repairs);
    const motC=sel.motivation==="High"?RUST:sel.motivation==="Medium"?AMBER:STEEL;
    const sms=encodeURIComponent(`Hi ${sel.owner.split(" ")[0]}, I'm with D&A Property Group — we buy houses in ${sel.city} as-is for cash. Would you consider a fair cash offer on your property at ${sel.addr.split(",")[0]}?`);
    return (
      <SwipeBack onBack={()=>setSel(null)}><div style={{ background:PAPER, fontFamily:FB, minHeight:"100%" }}>
        <ScreenHdr title={sel.addr.split(",")[0]} sub={`${sel.city}, TX`} onBack={()=>setSel(null)} />
        <div style={{ position:"relative" }}>
          <img src={sel.photo} alt="" style={{ width:"100%", height:210, objectFit:"cover", display:"block" }} />
          <div style={{ position:"absolute", inset:0, background:"linear-gradient(to top, rgba(19,22,28,0.85), transparent 55%)" }} />
          <div style={{ position:"absolute", left:16, right:16, bottom:14, display:"flex", justifyContent:"space-between", alignItems:"flex-end" }}>
            <div style={{ display:"flex", alignItems:"center", gap:7, background:INK+"e6", borderRadius:4, padding:"6px 11px" }}><Sparkles size={13} color={GOLD}/><span style={{fontSize:14,fontWeight:700,color:GOLD,fontFamily:FD}}>{sel.matchScore}</span><span style={{fontSize:10,color:"#9aa0ab"}}>match</span></div>
            <Pill label={`${sel.motivation} motivation`} color={motC} />
          </div>
        </div>
        <div style={{ padding:16 }}>
          <Card style={{ marginBottom:14, borderLeft:`3px solid ${GOLD}` }}>
            <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:8 }}><Zap size={14} color={GOLD}/><span style={{fontSize:12,fontWeight:700,color:GOLD2}}>{sel.signal}</span><span style={{fontSize:11,color:MUTE}}>· {sel.detail}</span></div>
            <div style={{ fontSize:13, color:INK, lineHeight:1.6 }}>{sel.why}</div>
          </Card>
          <DealStrip arv={sel.arv} repairs={sel.repairs} asking={maxOffer+8000} />
          <Card style={{ marginTop:14, marginBottom:14, padding:"4px 18px" }}>
            <div style={{padding:"14px 0 4px"}}><Eyebrow color={SUB}>Property</Eyebrow></div>
            <Row label="Address" value={sel.addr.split(",")[0]} /><Row label="Beds / Baths" value={`${sel.beds} / ${sel.baths}`} />
            <Row label="Square feet" value={sel.sqft.toLocaleString()} /><Row label="Year built" value={sel.yearBuilt} last />
          </Card>
          <Card style={{ marginBottom:16, padding:"4px 18px" }}>
            <div style={{padding:"14px 0 4px"}}><Eyebrow color={SUB}>Owner Contact</Eyebrow></div>
            <Row label="Owner" value={sel.owner} /><Row label="Phone" value={sel.phone} /><Row label="Email" value={sel.email} last />
          </Card>
          <div style={{ display:"flex", gap:8, marginBottom:10 }}>
            <a href={`tel:${sel.phone}`} style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", gap:7, padding:14, background:INK, color:"#fff", borderRadius:4, textDecoration:"none", fontSize:14, fontWeight:700 }}><PhoneCall size={16}/> Cold Call</a>
            <a href={`sms:${sel.phone}?&body=${sms}`} style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", gap:7, padding:14, background:GOLD, color:INK, borderRadius:4, textDecoration:"none", fontSize:14, fontWeight:700 }}><MessageSquare size={16}/> Text</a>
          </div>
          <a href={`mailto:${sel.email}?subject=Cash offer for ${encodeURIComponent(sel.addr.split(",")[0])}`} style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:7, padding:14, background:CARD, border:`1px solid ${EDGE}`, color:INK, borderRadius:4, textDecoration:"none", fontSize:14, fontWeight:600, marginBottom:10 }}><Mail size={16}/> Send Email</a>
          <button onClick={()=>onAddLead && onAddLead({ name:sel.owner, phone:sel.phone, addr:sel.addr.split(",")[0], city:sel.city, asking:String(maxOffer+8000), arv:String(sel.arv), repairs:String(sel.repairs), temp:sel.motivation==="High"?"hot":"warm", reason:sel.signal })} style={{ width:"100%", padding:14, background:JADE, color:"#fff", border:"none", borderRadius:4, fontSize:14, fontWeight:700, cursor:"pointer", fontFamily:FB, display:"flex", alignItems:"center", justifyContent:"center", gap:7 }}><Plus size={16}/> Add to Deals</button>
        </div>
      </div></SwipeBack>
    );
  }

  const cities=["all",...Array.from(new Set(FINDER_SEED.map(h=>h.city)))];
  const shown=filter==="all"?FINDER_SEED:FINDER_SEED.filter(h=>h.city===filter);
  const ipt={ width:"100%", padding:"12px 14px", border:`1px solid ${EDGE}`, borderRadius:4, fontSize:15, fontFamily:FB, color:INK, outline:"none", boxSizing:"border-box", background:CARD, fontWeight:500 };

  return (
    <div style={{ background:PAPER, fontFamily:FB, minHeight:"100%" }}>
      <ScreenHdr title="AI Finder" sub={searched?`${FINDER_SEED.length} matches`:"Set your search"}
        right={<button onClick={()=>setShowSearch(s=>!s)} style={{ display:"flex", alignItems:"center", gap:5, padding:"9px 13px", background:showSearch?GOLD:INK, color:showSearch?INK:"#fff", border:"none", borderRadius:4, fontSize:12, fontWeight:600, cursor:"pointer", fontFamily:FB }}><Search size={13}/> {searched?"Edit":"Search"}</button>} />

      {(showSearch || !searched) && (
        <div style={{ background:CARD, borderBottom:`1px solid ${EDGE}`, padding:16, maxWidth:760, margin:"0 auto", width:"100%", boxSizing:"border-box" }}>
          <div style={{ marginBottom:15 }}>
            <Eyebrow style={{marginBottom:7}}>Location — city, ZIP, or county</Eyebrow>
            <div style={{ position:"relative" }}>
              <MapPin size={15} color={MUTE} style={{ position:"absolute", left:13, top:"50%", transform:"translateY(-50%)" }} />
              <input value={location} onChange={e=>setLocation(e.target.value)} placeholder="Killeen, TX or 76541" style={{ ...ipt, paddingLeft:36 }} />
            </div>
          </div>
          <div style={{ marginBottom:16 }}>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:7 }}><Eyebrow>Search radius</Eyebrow><span style={{fontSize:13,fontWeight:700,color:INK,fontFamily:FD}}>{radius} mi</span></div>
            <input type="range" min="5" max="100" step="5" value={radius} onChange={e=>setRadius(e.target.value)} style={{ width:"100%", accentColor:INK }} />
          </div>
          <div style={{ marginBottom:16 }}>
            <Eyebrow style={{marginBottom:9}}>Distress signals</Eyebrow>
            <div style={{ display:"flex", flexWrap:"wrap", gap:7 }}>
              {SIGNAL_OPTIONS.map(s=>{const on=signals.includes(s);return(
                <button key={s} onClick={()=>toggleSig(s)} style={{ padding:"7px 12px", borderRadius:4, border:`1px solid ${on?INK:EDGE}`, background:on?INK:CARD, color:on?"#fff":SUB, cursor:"pointer", fontSize:12, fontWeight:600, fontFamily:FB }}>{s}</button>
              );})}
            </div>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:16 }}>
            <div><Eyebrow style={{marginBottom:7}}>Min beds</Eyebrow><input value={minBeds} onChange={e=>setMinBeds(e.target.value)} placeholder="Any" inputMode="numeric" style={ipt} /></div>
            <div><Eyebrow style={{marginBottom:7}}>Max price</Eyebrow><input value={maxPrice} onChange={e=>setMaxPrice(e.target.value)} placeholder="250,000" inputMode="numeric" style={ipt} /></div>
          </div>
          <div style={{ marginBottom:18 }}>
            <Eyebrow style={{marginBottom:7}}>Keywords</Eyebrow>
            <input value={keywords} onChange={e=>setKeywords(e.target.value)} placeholder="motivated, must sell, as-is, relocating" style={ipt} />
            <p style={{ fontSize:11, color:MUTE, marginTop:7, lineHeight:1.5 }}>AI scans listings, notes, and public records for these terms.</p>
          </div>
          <button onClick={()=>{setSearched(true);setShowSearch(false);}} style={{ width:"100%", padding:16, background:INK, color:"#fff", border:"none", borderRadius:4, fontSize:14, fontWeight:700, cursor:"pointer", fontFamily:FB, display:"flex", alignItems:"center", justifyContent:"center", gap:9 }}>
            <Sparkles size={17} color={GOLD}/> Find Deals
          </button>
        </div>
      )}

      {searched && !showSearch && <>
        <div style={{ background:INK, padding:"14px 18px" }}>
          <div style={{ display:"flex", alignItems:"center", gap:8 }}><MapPin size={14} color={GOLD}/><span style={{fontSize:13,color:"#fff",fontWeight:600}}>{location||"Central Texas"} · {radius} mi</span></div>
          {(signals.length>0||keywords) && <div style={{fontSize:11,color:"#9aa0ab",marginTop:6}}>{signals.join(" · ")}{signals.length>0&&keywords?" · ":""}{keywords}</div>}
        </div>
        <div style={{ background:CARD, borderBottom:`1px solid ${EDGE}`, padding:"10px 14px", display:"flex", gap:7, overflowX:"auto" }}>
          {cities.map(c=>{const a=filter===c;const n=c==="all"?FINDER_SEED.length:FINDER_SEED.filter(h=>h.city===c).length;return(
            <button key={c} onClick={()=>setFilter(c)} style={{ whiteSpace:"nowrap", padding:"7px 13px", borderRadius:4, border:a?"none":`1px solid ${EDGE}`, background:a?INK:CARD, color:a?"#fff":MUTE, cursor:"pointer", fontSize:12, fontWeight:600, fontFamily:FB }}>{c==="all"?"All":c} · {n}</button>
          );})}
        </div>
        <div style={{ padding:14, display:"flex", flexDirection:"column", gap:13, maxWidth:760, margin:"0 auto", width:"100%", boxSizing:"border-box" }}>
          {shown.map(h=>{const motC=h.motivation==="High"?RUST:h.motivation==="Medium"?AMBER:STEEL;const grade=dealGrade(h.arv,h.repairs,mao(h.arv,h.repairs)+8000);return(
            <div key={h.id} onClick={()=>setSel(h)} style={{ background:CARD, border:`1px solid ${EDGE}`, borderRadius:4, overflow:"hidden", cursor:"pointer" }}>
              <div style={{ position:"relative" }}>
                <img src={h.photo} alt="" style={{ width:"100%", height:160, objectFit:"cover", display:"block" }} />
                <div style={{ position:"absolute", top:11, left:11, background:INK+"e6", borderRadius:4, padding:"5px 10px", display:"flex", alignItems:"center", gap:5 }}><Sparkles size={11} color={GOLD}/><span style={{fontSize:12,fontWeight:700,color:GOLD}}>{h.matchScore}</span></div>
                <div style={{ position:"absolute", top:11, right:11 }}><Pill label={h.motivation} color={motC}/></div>
                <div style={{ position:"absolute", bottom:11, left:11, background:GOLD, borderRadius:4, padding:"4px 9px", fontSize:11, fontWeight:700, color:INK }}>{h.signal}</div>
              </div>
              <div style={{ padding:14 }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
                  <div><div style={{fontSize:15,fontWeight:700,color:INK}}>{h.addr.split(",")[0]}</div><div style={{fontSize:11.5,color:MUTE,marginTop:2}}>{h.city} · {h.beds}bd/{h.baths}ba · {h.sqft.toLocaleString()} sf</div></div>
                  <div style={{width:30,height:30,borderRadius:4,border:`1.5px solid ${grade.c}`,background:grade.c+"15",display:"flex",alignItems:"center",justifyContent:"center",fontSize:15,fontWeight:700,color:grade.c,fontFamily:FD}}>{grade.g}</div>
                </div>
                <div style={{ display:"flex", gap:14, marginTop:10 }}><span style={{fontSize:12,color:MUTE}}>ARV {fmtK(h.arv)}</span><span style={{fontSize:12,color:JADE,fontWeight:700}}>MAO {fmtK(mao(h.arv,h.repairs))}</span></div>
                <div style={{ display:"flex", gap:8, marginTop:12 }}>
                  <a href={`tel:${h.phone}`} onClick={e=>e.stopPropagation()} style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", gap:6, padding:10, background:INK, color:"#fff", borderRadius:4, textDecoration:"none", fontSize:12.5, fontWeight:600 }}><PhoneCall size={14}/> Call</a>
                  <a href={`sms:${h.phone}`} onClick={e=>e.stopPropagation()} style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", gap:6, padding:10, background:CARD, border:`1px solid ${EDGE}`, color:INK, borderRadius:4, textDecoration:"none", fontSize:12.5, fontWeight:600 }}><MessageSquare size={14}/> Text</a>
                  <a href={`mailto:${h.email}`} onClick={e=>e.stopPropagation()} style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", gap:6, padding:10, background:CARD, border:`1px solid ${EDGE}`, color:INK, borderRadius:4, textDecoration:"none", fontSize:12.5, fontWeight:600 }}><Mail size={14}/> Email</a>
                </div>
              </div>
            </div>
          );})}
        </div>
      </>}
    </div>
  );
};

/* ════════════════════════════════════════════════════════
   BUYERS
════════════════════════════════════════════════════════ */
const Buyers = () => {
  const [sel,setSel]=useState(null);
  if (sel) return (
    <SwipeBack onBack={()=>setSel(null)}><div style={{ background:PAPER, fontFamily:FB, minHeight:"100%" }}>
      <ScreenHdr title={sel.name} sub={sel.company} onBack={()=>setSel(null)} />
      <div style={{ padding:16 }}>
        <div style={{ display:"flex", gap:8, marginBottom:16 }}>
          <a href={`tel:${sel.phone}`} style={{ flex:1, textAlign:"center", padding:13, background:INK, color:"#fff", borderRadius:4, textDecoration:"none", fontSize:13, fontWeight:600 }}>Call</a>
          <a href={`sms:${sel.phone}`} style={{ flex:1, textAlign:"center", padding:13, background:GOLD, color:INK, borderRadius:4, textDecoration:"none", fontSize:13, fontWeight:700 }}>Text</a>
          <a href={`mailto:${sel.email}`} style={{ flex:1, textAlign:"center", padding:13, background:CARD, border:`1px solid ${EDGE}`, color:INK, borderRadius:4, textDecoration:"none", fontSize:13, fontWeight:600 }}>Email</a>
        </div>
        <Card style={{ marginBottom:14, padding:"4px 18px" }}>
          <div style={{padding:"14px 0 4px"}}><Eyebrow color={SUB}>Buy Box</Eyebrow></div>
          <Row label="Strategy" value={sel.strategy} /><Row label="Price range" value={sel.range} />
          <Row label="Areas" value={sel.areas.join(", ")} /><Row label="Types" value={sel.types.join(", ")} last />
        </Card>
        <Card style={{ marginBottom:14, padding:"4px 18px" }}>
          <div style={{padding:"14px 0 4px"}}><Eyebrow color={SUB}>Contact</Eyebrow></div>
          <Row label="Phone" value={sel.phone} /><Row label="Email" value={sel.email} last />
        </Card>
        <Card>
          <Eyebrow color={SUB} style={{marginBottom:9}}>Notes</Eyebrow>
          <div style={{ fontSize:13.5, color:INK, lineHeight:1.6, marginBottom:14 }}>{sel.notes}</div>
          <button style={{ width:"100%", padding:12, background:CARD, color:INK, border:`1px solid ${EDGE}`, borderRadius:4, fontSize:13, fontWeight:600, cursor:"pointer", fontFamily:FB }}>+ Add Note</button>
        </Card>
      </div>
    </div></SwipeBack>
  );
  return (
    <div style={{ background:PAPER, fontFamily:FB, minHeight:"100%" }}>
      <ScreenHdr title="Buyers" sub={`${BUYERS_SEED.length} cash buyers`}
        right={<button style={{ display:"flex", alignItems:"center", gap:5, padding:"9px 13px", background:INK, color:"#fff", border:"none", borderRadius:4, fontSize:12, fontWeight:600, cursor:"pointer", fontFamily:FB }}><Plus size={14}/> Add</button>} />
      <div style={{ padding:14, display:"flex", flexDirection:"column", gap:10 }}>
        {BUYERS_SEED.map(b=>(
          <div key={b.id} onClick={()=>setSel(b)} style={{ background:CARD, border:`1px solid ${EDGE}`, borderRadius:4, padding:16, cursor:"pointer", display:"flex", alignItems:"center", gap:14 }}>
            <Avatar initial={b.name[0]} />
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ fontSize:15, fontWeight:700, color:INK }}>{b.name}</div>
              <div style={{ fontSize:12, color:MUTE }}>{b.company}</div>
              <div style={{ display:"flex", gap:9, marginTop:7, flexWrap:"wrap" }}><Pill label={b.strategy} color={b.strategy==="Fix & Flip"?AMBER:STEEL}/><span style={{fontSize:11.5,color:MUTE,alignSelf:"center"}}>{b.range}</span></div>
            </div>
            <ChevronRight size={16} color="#c9c2b4"/>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ════════════════════════════════════════════════════════
   CALCULATORS
════════════════════════════════════════════════════════ */
const CalcShell = ({ title, sub, onBack, children }) => (
  <SwipeBack onBack={onBack}><div style={{ background:PAPER, fontFamily:FB, minHeight:"100%" }}>
    <ScreenHdr title={title} sub={sub} onBack={onBack} />
    <div style={{ padding:20, maxWidth:560, margin:"0 auto" }}>{children}</div>
  </div></SwipeBack>
);
const Result = ({ label, value, color=GOLD, foot }) => (
  <div style={{ background:INK, borderRadius:4, padding:24, textAlign:"center" }}>
    <Eyebrow color="#7d8694" style={{marginBottom:9}}>{label}</Eyebrow>
    <div style={{ fontSize:44, fontWeight:700, color, fontFamily:FD, lineHeight:0.95, letterSpacing:"-0.02em" }}>{value}</div>
    {foot && <div style={{ fontSize:12, color:"#7d8694", marginTop:10 }}>{foot}</div>}
  </div>
);

const MAOCalc = ({ onBack }) => {
  const [arv,setArv]=useState(""); const [rep,setRep]=useState("");
  const a=num(arv),r=num(rep); const res=a&&r?mao(a,r):null;
  return <CalcShell title="MAO Calculator" sub="Maximum Allowable Offer" onBack={onBack}>
    <Field label="After Repair Value" val={arv} set={setArv} ph="245,000" prefix="$" />
    <Field label="Estimated Repairs" val={rep} set={setRep} ph="38,000" prefix="$" />
    {res!==null && <Result label="Max Allowable Offer" value={fmt(res)} foot={`${fmt(a)} × 70% − ${fmt(r)}`} />}
  </CalcShell>;
};
const OfferRangeCalc = ({ onBack }) => {
  const [arv,setArv]=useState(""); const [rep,setRep]=useState("");
  const a=num(arv),r=num(rep); const targets=[5000,10000,15000,20000,25000];
  return <CalcShell title="Offer Range" sub="Offers at each fee target" onBack={onBack}>
    <Field label="After Repair Value" val={arv} set={setArv} ph="245,000" prefix="$" />
    <Field label="Estimated Repairs" val={rep} set={setRep} ph="38,000" prefix="$" />
    {a>0&&r>0 && <>
      <Eyebrow color={SUB} style={{margin:"4px 0 11px"}}>Offer to lock each fee</Eyebrow>
      {targets.map(t=>{const offer=mao(a,r)-t;const ok=offer>0;return(
        <Card key={t} style={{ marginBottom:9, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <div><div style={{fontSize:11.5,color:MUTE}}>Fee target</div><div style={{fontSize:18,fontWeight:700,color:JADE,fontFamily:FD}}>{fmt(t)}</div></div>
          <div style={{textAlign:"right"}}><div style={{fontSize:11.5,color:MUTE}}>Offer seller</div><div style={{fontSize:18,fontWeight:700,fontFamily:FD,color:ok?INK:RUST}}>{ok?fmt(offer):"—"}</div></div>
        </Card>
      );})}
    </>}
  </CalcShell>;
};
const REPAIR_ITEMS=[["Roof",6000,14000],["HVAC",4000,9000],["Kitchen",5000,20000],["Bathrooms",3000,12000],["Flooring",3000,8000],["Interior Paint",2000,5000],["Exterior Paint",2000,6000],["Windows",3000,9000],["Electrical",2000,8000],["Plumbing",2000,7000],["Foundation",5000,25000],["Landscaping",500,3000]];
const RepairEstimator = ({ onBack }) => {
  const [sel,setSel]=useState({}); const [lvl,setLvl]=useState("mid");
  const cost=([,lo,hi])=>lvl==="low"?lo:lvl==="high"?hi:Math.round((lo+hi)/2);
  const total=REPAIR_ITEMS.filter(i=>sel[i[0]]).reduce((s,i)=>s+cost(i),0);
  const count=Object.values(sel).filter(Boolean).length;
  return <SwipeBack onBack={onBack}><div style={{ background:PAPER, fontFamily:FB, minHeight:"100%" }}>
    <ScreenHdr title="Repair Estimator" sub="Tap what needs work" onBack={onBack} />
    <div style={{ background:INK, padding:"18px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
      <div><Eyebrow color="#7d8694" style={{marginBottom:6}}>Estimated Repairs</Eyebrow><div style={{fontSize:34,fontWeight:700,fontFamily:FD,color:GOLD,lineHeight:0.95}}>{fmt(total)}</div><div style={{fontSize:11,color:"#7d8694",marginTop:6}}>{count} items selected</div></div>
      <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
        {["low","mid","high"].map(l=>(<button key={l} onClick={()=>setLvl(l)} style={{ padding:"7px 15px", borderRadius:4, border:"none", cursor:"pointer", background:lvl===l?GOLD:INK2, color:lvl===l?INK:"#fff", fontSize:11, fontWeight:700, fontFamily:FB, textTransform:"capitalize" }}>{l}</button>))}
      </div>
    </div>
    <div style={{ padding:14 }}>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
        {REPAIR_ITEMS.map(item=>{const on=!!sel[item[0]];return(
          <button key={item[0]} onClick={()=>setSel(p=>({...p,[item[0]]:!p[item[0]]}))} style={{ padding:"13px 14px", borderRadius:4, cursor:"pointer", background:on?INK:CARD, border:`1px solid ${on?INK:EDGE}`, textAlign:"left", fontFamily:FB }}>
            <div style={{ fontSize:13, fontWeight:600, color:on?"#fff":INK }}>{item[0]}</div>
            <div style={{ fontSize:11.5, color:on?GOLD:MUTE, marginTop:3, fontWeight:on?700:500 }}>~{fmt(cost(item))}</div>
          </button>
        );})}
      </div>
    </div>
  </div></SwipeBack>;
};
const FeeCalc = ({ onBack }) => {
  const [c,setC]=useState(""); const [b,setB]=useState("");
  const cv=num(c),bv=num(b); const res=cv&&bv?bv-cv:null;
  return <CalcShell title="Assignment Fee" sub="Profit and 50/50 split" onBack={onBack}>
    <Field label="Your contract price" val={c} set={setC} ph="120,000" prefix="$" />
    <Field label="What buyer pays" val={b} set={setB} ph="133,000" prefix="$" />
    {res!==null && <div style={{ background:INK, borderRadius:4, padding:24, textAlign:"center" }}>
      <Eyebrow color="#7d8694" style={{marginBottom:9}}>Assignment Fee</Eyebrow>
      <div style={{ fontSize:44, fontWeight:700, fontFamily:FD, color:res>0?GOLD:RUST, lineHeight:0.95 }}>{res>0?fmt(res):"Check numbers"}</div>
      {res>0 && <div style={{ marginTop:18, paddingTop:18, borderTop:`1px solid ${INK3}`, display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
        <div><Eyebrow color="#7d8694">David · 50%</Eyebrow><div style={{fontSize:20,fontWeight:700,fontFamily:FD,color:"#fff",marginTop:5}}>{fmt(res*0.5)}</div></div>
        <div><Eyebrow color="#7d8694">Azeez · 50%</Eyebrow><div style={{fontSize:20,fontWeight:700,fontFamily:FD,color:"#fff",marginTop:5}}>{fmt(res*0.5)}</div></div>
      </div>}
    </div>}
  </CalcShell>;
};
const SplitCalc = ({ onBack }) => {
  const [fee,setFee]=useState(""); const [exp,setExp]=useState("");
  const f=num(fee),e=num(exp); const net=f-e; const each=net>0?net*0.5:0;
  return <CalcShell title="Profit Split" sub="50/50 after expenses" onBack={onBack}>
    <Field label="Assignment fee" val={fee} set={setFee} ph="13,500" prefix="$" />
    <Field label="Business expenses" val={exp} set={setExp} ph="0" prefix="$" />
    {f>0 && <div style={{ background:INK, borderRadius:4, padding:20 }}>
      <Row label="Gross fee" value={fmt(f)} /><Row label="Less expenses" value={`− ${fmt(e)}`} />
      <div style={{ display:"flex", justifyContent:"space-between", padding:"12px 0 4px" }}><span style={{fontSize:12,color:"#7d8694"}}>Net profit</span><span style={{fontSize:15,fontWeight:700,fontFamily:FD,color:net>0?GOLD:RUST}}>{fmt(net)}</span></div>
      <div style={{ marginTop:14, display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, textAlign:"center" }}>
        <div style={{ background:INK2, borderRadius:4, padding:15 }}><Eyebrow color="#7d8694">David</Eyebrow><div style={{fontSize:24,fontWeight:700,fontFamily:FD,color:GOLD,marginTop:5}}>{fmt(each)}</div></div>
        <div style={{ background:INK2, borderRadius:4, padding:15 }}><Eyebrow color="#7d8694">Azeez</Eyebrow><div style={{fontSize:24,fontWeight:700,fontFamily:FD,color:GOLD,marginTop:5}}>{fmt(each)}</div></div>
      </div>
    </div>}
  </CalcShell>;
};
const EquityCalc = ({ onBack }) => {
  const [v,setV]=useState(""); const [m,setM]=useState("");
  const vv=num(v),mv=num(m); const eq=vv-mv; const pct=vv>0?((eq/vv)*100).toFixed(0):0;
  return <CalcShell title="Equity Calculator" sub="Seller's equity position" onBack={onBack}>
    <Field label="Property value (ARV)" val={v} set={setV} ph="245,000" prefix="$" />
    <Field label="Remaining mortgage" val={m} set={setM} ph="80,000" prefix="$" />
    {vv>0 && <Result label="Equity" value={fmt(Math.max(0,eq))} color={eq>50000?GOLD:eq>20000?AMBER:RUST} foot={`${pct}% — ${pct>=40?"high equity, strong deal":pct>=20?"moderate, workable":"low equity, difficult"}`} />}
  </CalcShell>;
};
const ROICalc = ({ onBack }) => {
  const [p,setP]=useState(""); const [r,setR]=useState(""); const [s,setS]=useState("");
  const pv=num(p),rv=num(r),sv=num(s); const profit=sv-pv-rv-(sv*0.08); const roi=pv+rv>0?((profit/(pv+rv))*100).toFixed(1):null;
  return <CalcShell title="Buyer ROI" sub="Show buyers their return" onBack={onBack}>
    <Field label="Purchase price" val={p} set={setP} ph="133,000" prefix="$" />
    <Field label="Repairs" val={r} set={setR} ph="38,000" prefix="$" />
    <Field label="After repair value" val={s} set={setS} ph="245,000" prefix="$" />
    {pv>0&&rv>0&&sv>0 && <div style={{ background:INK, borderRadius:4, padding:20 }}>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginBottom:16 }}>
        <div><Eyebrow color="#7d8694">Total in</Eyebrow><div style={{fontSize:20,fontWeight:700,fontFamily:FD,color:"#fff",marginTop:4}}>{fmt(pv+rv)}</div></div>
        <div><Eyebrow color="#7d8694">Net profit</Eyebrow><div style={{fontSize:20,fontWeight:700,fontFamily:FD,color:profit>0?GOLD:RUST,marginTop:4}}>{fmt(profit)}</div></div>
      </div>
      <div style={{ textAlign:"center", paddingTop:16, borderTop:`1px solid ${INK3}` }}>
        <Eyebrow color="#7d8694" style={{marginBottom:6}}>Buyer ROI</Eyebrow>
        <div style={{ fontSize:40, fontWeight:700, fontFamily:FD, color:parseFloat(roi)>20?JADE:parseFloat(roi)>10?AMBER:RUST }}>{roi}%</div>
        <div style={{ fontSize:11, color:"#7d8694", marginTop:6 }}>Includes ~8% closing & holding</div>
      </div>
    </div>}
  </CalcShell>;
};
const RentCalc = ({ onBack }) => {
  const [price,setPrice]=useState(""); const [down,setDown]=useState("20"); const [rate,setRate]=useState("7.5"); const [term,setTerm]=useState("30");
  const p=num(price),d=num(down)/100,mo=num(rate)/100/12,n=num(term)*12; const loan=p*(1-d);
  const pay=loan>0&&mo>0?Math.round(loan*mo*Math.pow(1+mo,n)/(Math.pow(1+mo,n)-1)):0;
  return <CalcShell title="Max Rent" sub="Rent needed to cash flow" onBack={onBack}>
    <Field label="Purchase price" val={price} set={setPrice} ph="155,000" prefix="$" />
    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:10, marginBottom:15 }}>
      {[["Down %",down,setDown],["Rate %",rate,setRate],["Term yr",term,setTerm]].map(([l,v,s],i)=>(
        <div key={i}><Eyebrow style={{marginBottom:6}}>{l}</Eyebrow><input value={v} onChange={e=>s(e.target.value)} inputMode="numeric" style={{ width:"100%", padding:"12px 10px", border:`1px solid ${EDGE}`, borderRadius:4, fontSize:15, fontFamily:FB, color:INK, outline:"none", boxSizing:"border-box", background:CARD, fontWeight:600 }} /></div>
      ))}
    </div>
    {pay>0 && <div style={{ background:INK, borderRadius:4, padding:20 }}>
      <Row label="Loan amount" value={fmt(loan)} /><Row label="Monthly P&I" value={fmt(pay)} />
      <Row label="Break-even rent · 1.2×" value={fmt(pay*1.2)} vc={AMBER} /><Row label="Good deal rent · 1.4×" value={fmt(pay*1.4)} vc={JADE} last />
    </div>}
  </CalcShell>;
};
const QuickRef = ({ onBack }) => {
  const [open,setOpen]=useState(null);
  const cards=[
    { id:"mao", title:"MAO Formula", sub:"Reference on every call", body:[["Formula","ARV × 70% − Repairs = MAO"],["Example","$245k × 70% = $171.5k − $38k = $133.5k"],["Rule","Never pay more than MAO. Ever."],["Why 70%","Leaves 30% for your buyer's profit + fees"]] },
    { id:"disc", title:"Texas Disclosure", sub:"Say on every seller call", body:[["Required","\"I want to be upfront — I'm not a licensed agent. I buy through a contract assignment, meaning I find a buyer for the contract.\""],["Also say","\"You'll know the end buyer before closing, and you can walk away anytime.\""],["Why","Texas SB 2212 requires disclosing equitable interest"]] },
    { id:"obj", title:"Objection Responses", sub:"Azeez's cheat sheet", body:[["\"I want full price\"","\"I get it. My value is speed and certainty — no repairs, no fees, cash in 7 days. What works for you?\""],["\"Let me think\"","\"Of course. Can I call you Thursday so you have all the info?\""],["\"Offer's too low\"","\"I hear you. Walk me through your number and let's find middle ground.\""],["\"I have an agent\"","\"No problem — is the listing active, or are you weighing options?\""]] },
    { id:"stages", title:"Pipeline Stages", sub:"When to move forward", body:[["New → Contacted","First contact made"],["Contacted → Negotiating","Seller open to an offer"],["Negotiating → Appt","Agreed to meet for offer"],["Appt → Under Contract","Purchase agreement signed"],["Under Contract → Sent","Blasted to buyers"],["Assigned → Closed","Title closed, fee received"]] },
  ];
  if (open!==null) { const card=cards[open]; return (
    <CalcShell title={card.title} sub={card.sub} onBack={()=>setOpen(null)}>
      <Card style={{ padding:"4px 18px" }}>
        {card.body.map((it,i)=>(
          <div key={i} style={{ padding:"14px 0", borderBottom:i<card.body.length-1?`1px solid ${EDGE}`:"none" }}>
            <Eyebrow color={GOLD2} style={{marginBottom:6}}>{it[0]}</Eyebrow>
            <div style={{ fontSize:13.5, color:INK, lineHeight:1.6 }}>{it[1]}</div>
          </div>
        ))}
      </Card>
    </CalcShell>
  );}
  return <CalcShell title="Scripts & Formulas" sub="Quick reference" onBack={onBack}>
    <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
      {cards.map((card,i)=>(
        <Card key={card.id} onClick={()=>setOpen(i)} style={{ display:"flex", alignItems:"center", gap:14 }}>
          <div style={{ flex:1 }}><div style={{fontSize:14.5,fontWeight:700,color:INK}}>{card.title}</div><div style={{fontSize:12,color:MUTE,marginTop:2}}>{card.sub}</div></div>
          <ChevronRight size={16} color="#c9c2b4"/>
        </Card>
      ))}
    </div>
  </CalcShell>;
};

const Numbers = () => {
  const [sub,setSub]=useState(null);
  const map={mao:MAOCalc,range:OfferRangeCalc,repair:RepairEstimator,fee:FeeCalc,split:SplitCalc,equity:EquityCalc,roi:ROICalc,rent:RentCalc,ref:QuickRef};
  if (sub){ const C=map[sub]; return <C onBack={()=>setSub(null)} />; }
  const calcs=[
    {id:"mao",label:"MAO",sub:"Max offer",Icon:Target,c:INK},
    {id:"range",label:"Offer Range",sub:"By fee target",Icon:TrendingUp,c:STEEL},
    {id:"repair",label:"Repairs",sub:"Estimate cost",Icon:Wrench,c:AMBER},
    {id:"equity",label:"Equity",sub:"Seller stake",Icon:Activity,c:PLUM},
    {id:"fee",label:"Assign Fee",sub:"+ 50/50 split",Icon:DollarSign,c:JADE},
    {id:"split",label:"Profit Split",sub:"After costs",Icon:Users,c:"#2f8f88"},
    {id:"roi",label:"Buyer ROI",sub:"Their return",Icon:TrendingUp,c:STEEL},
    {id:"rent",label:"Max Rent",sub:"Cash flow",Icon:Home,c:AMBER},
  ];
  return (
    <div style={{ background:PAPER, fontFamily:FB, minHeight:"100%" }}>
      <ScreenHdr title="Numbers" sub="Run any deal in seconds" />
      <div style={{ padding:14, maxWidth:760, margin:"0 auto" }}>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(150px, 1fr))", gap:11 }}>
          {calcs.map(item=>(
            <button key={item.id} onClick={()=>setSub(item.id)} style={{ background:CARD, border:`1px solid ${EDGE}`, borderRadius:4, padding:"17px 15px", cursor:"pointer", textAlign:"left", fontFamily:FB, display:"flex", flexDirection:"column", gap:13, minHeight:108 }}>
              <div style={{ width:38, height:38, borderRadius:4, background:item.c+"15", display:"flex", alignItems:"center", justifyContent:"center" }}><item.Icon size={19} color={item.c} strokeWidth={2}/></div>
              <div><div style={{fontSize:14,fontWeight:700,color:INK}}>{item.label}</div><div style={{fontSize:11.5,color:MUTE,marginTop:2}}>{item.sub}</div></div>
            </button>
          ))}
        </div>
        <button onClick={()=>setSub("ref")} style={{ width:"100%", marginTop:12, background:INK, border:"none", borderRadius:4, padding:"17px 18px", cursor:"pointer", textAlign:"left", fontFamily:FB, display:"flex", alignItems:"center", gap:14 }}>
          <div style={{ width:38, height:38, borderRadius:4, background:GOLD+"1e", display:"flex", alignItems:"center", justifyContent:"center" }}><FileText size={19} color={GOLD} strokeWidth={2}/></div>
          <div style={{ flex:1 }}><div style={{fontSize:14,fontWeight:700,color:"#fff"}}>Scripts & Formulas</div><div style={{fontSize:11.5,color:"#9aa0ab",marginTop:2}}>MAO, Texas disclosure, objections, stages</div></div>
          <ChevronRight size={18} color="#7d8694"/>
        </button>
      </div>
    </div>
  );
};

/* ════════════════════════════════════════════════════════
   APP SHELL
════════════════════════════════════════════════════════ */
/* ════════════════════════════════════════════════════════
   QUICK ADD — capture a lead from anywhere, fast
════════════════════════════════════════════════════════ */
const QuickAdd = ({ onClose, onSave }) => {
  const [f,setF] = useState({ name:"", phone:"", addr:"", city:"Killeen", asking:"", arv:"", repairs:"", temp:"warm", reason:"" });
  const set = (k,v)=>setF(p=>({...p,[k]:v}));
  const ipt = { width:"100%", padding:"12px 14px", border:`1px solid ${EDGE}`, borderRadius:4, fontSize:15, fontFamily:FB, color:INK, outline:"none", boxSizing:"border-box", background:CARD, fontWeight:500 };
  const canSave = f.name && f.phone;
  return (
    <div style={{ position:"fixed", inset:0, zIndex:60, background:"rgba(19,22,28,0.55)", display:"flex", flexDirection:"column", justifyContent:"flex-end", fontFamily:FB }} onClick={onClose}>
      <div onClick={e=>e.stopPropagation()} style={{ background:PAPER, borderRadius:"14px 14px 0 0", maxHeight:"92vh", overflowY:"auto", maxWidth:760, margin:"0 auto", width:"100%" }}>
        <div style={{ position:"sticky", top:0, background:PAPER, padding:"16px 18px", borderBottom:`1px solid ${EDGE}`, display:"flex", alignItems:"center", justifyContent:"space-between", zIndex:2 }}>
          <div style={{ fontSize:18, fontWeight:700, fontFamily:FD, color:INK }}>New Lead</div>
          <button onClick={onClose} style={{ background:"none", border:"none", cursor:"pointer", fontSize:24, color:MUTE, lineHeight:1 }}>×</button>
        </div>
        <div style={{ padding:18 }}>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
            <div style={{ gridColumn:"1 / -1" }}><Eyebrow style={{marginBottom:7}}>Seller name *</Eyebrow><input value={f.name} onChange={e=>set("name",e.target.value)} placeholder="Robert Johnson" style={ipt} /></div>
            <div><Eyebrow style={{marginBottom:7}}>Phone *</Eyebrow><input value={f.phone} onChange={e=>set("phone",e.target.value)} placeholder="(254) 555-0000" style={ipt} /></div>
            <div><Eyebrow style={{marginBottom:7}}>City</Eyebrow>
              <select value={f.city} onChange={e=>set("city",e.target.value)} style={ipt}>{["Killeen","Temple","Waco","Harker Heights","Belton","Copperas Cove","San Marcos","Abilene"].map(c=><option key={c}>{c}</option>)}</select>
            </div>
            <div style={{ gridColumn:"1 / -1" }}><Eyebrow style={{marginBottom:7}}>Address</Eyebrow><input value={f.addr} onChange={e=>set("addr",e.target.value)} placeholder="1842 Elm St" style={ipt} /></div>
            <div><Eyebrow style={{marginBottom:7}}>Asking</Eyebrow><input value={f.asking} onChange={e=>set("asking",e.target.value)} placeholder="187,000" inputMode="numeric" style={ipt} /></div>
            <div><Eyebrow style={{marginBottom:7}}>Est. ARV</Eyebrow><input value={f.arv} onChange={e=>set("arv",e.target.value)} placeholder="245,000" inputMode="numeric" style={ipt} /></div>
            <div><Eyebrow style={{marginBottom:7}}>Est. repairs</Eyebrow><input value={f.repairs} onChange={e=>set("repairs",e.target.value)} placeholder="38,000" inputMode="numeric" style={ipt} /></div>
            <div><Eyebrow style={{marginBottom:7}}>Temp</Eyebrow>
              <select value={f.temp} onChange={e=>set("temp",e.target.value)} style={ipt}><option value="hot">Hot</option><option value="warm">Warm</option><option value="cold">Cold</option></select>
            </div>
            <div style={{ gridColumn:"1 / -1" }}><Eyebrow style={{marginBottom:7}}>Reason for selling</Eyebrow><input value={f.reason} onChange={e=>set("reason",e.target.value)} placeholder="Pre-foreclosure, relocating…" style={ipt} /></div>
          </div>
          {/* live MAO preview */}
          {num(f.arv)>0 && num(f.repairs)>0 && (
            <div style={{ marginTop:16, background:INK, borderRadius:4, padding:14, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <Eyebrow color={GOLD}>Max Allowable Offer</Eyebrow>
              <span style={{ fontSize:22, fontWeight:700, fontFamily:FD, color:GOLD }}>{fmt(mao(num(f.arv),num(f.repairs)))}</span>
            </div>
          )}
          <button disabled={!canSave} onClick={()=>onSave(f)} style={{ width:"100%", marginTop:18, padding:16, background:canSave?INK:EDGE, color:canSave?"#fff":MUTE, border:"none", borderRadius:4, fontSize:14, fontWeight:700, cursor:canSave?"pointer":"default", fontFamily:FB }}>Save Lead</button>
        </div>
      </div>
    </div>
  );
};

/* ════════════════════════════════════════════════════════
   APP SHELL
════════════════════════════════════════════════════════ */
export default function App() {
  const [screen,setScreen]=useState("login");
  const [user,setUser]=useState(null);
  const [tab,setTab]=useState("dashboard");
  const [leads,setLeads]=useState(LEADS_SEED);
  const [activeLead,setActiveLead]=useState(null);
  const [quickAdd,setQuickAdd]=useState(false);

  const openLead = l => setActiveLead(l);
  const updateLead = updated => {
    setLeads(prev => prev.map(l => l.id===updated.id ? updated : l));
    setActiveLead(updated);
  };
  const saveNewLead = f => {
    const lead = {
      id: Date.now(), name:f.name, phone:f.phone, email:"",
      addr:`${f.addr}, ${f.city}, TX`, city:f.city, motivation: f.temp==="hot"?8:f.temp==="warm"?6:4,
      asking:num(f.asking), arv:num(f.arv), repairs:num(f.repairs), source:"Manual",
      lastContact:"Just added", nextFollowUp:"Today", stage:"New Lead", temp:f.temp,
      beds:3, baths:2, sqft:1500, yearBuilt:2000, mortgage:0,
      reason:f.reason||"—", timeline:"Unknown", notes:f.reason?`Reason: ${f.reason}`:"New lead — needs first contact.",
      callLog:[], tasks:[{done:false,label:"Make first contact"}]
    };
    setLeads(prev=>[lead,...prev]);
    setQuickAdd(false);
    setActiveLead(lead);
  };

  if (screen==="login") {
    return (
      <div style={{ minHeight:"100vh", background:INK, fontFamily:FB, display:"flex", alignItems:"center", justifyContent:"center", padding:20, position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", top:"-10%", right:"-15%", width:300, height:300, borderRadius:"50%", background:GOLD, opacity:0.05 }} />
        <div style={{ position:"absolute", bottom:"-15%", left:"-10%", width:260, height:260, borderRadius:"50%", background:GOLD, opacity:0.04 }} />
        <div style={{ width:"100%", maxWidth:380, position:"relative" }}>
          <div style={{ textAlign:"center", marginBottom:36 }}>
            <div style={{ width:64, height:64, border:`1.5px solid ${GOLD}`, borderRadius:6, display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 20px" }}>
              <span style={{ fontSize:21, fontWeight:700, color:GOLD, fontFamily:FD }}>D&A</span>
            </div>
            <div style={{ fontSize:24, fontWeight:700, color:"#fff", fontFamily:FD, letterSpacing:"-0.01em" }}>D&A Property Group</div>
            <Eyebrow color="#7d8694" style={{ marginTop:8 }}>Central Texas · Deal Engine</Eyebrow>
          </div>
          <div style={{ background:INK2, borderRadius:6, padding:"26px 24px", border:`1px solid ${INK3}` }}>
            <Eyebrow color={MUTE} style={{ marginBottom:18 }}>Choose your account</Eyebrow>
            {ACCOUNTS.map(a=>(
              <button key={a.name} onClick={()=>{setUser(a);setScreen("app");}} style={{ width:"100%", display:"flex", alignItems:"center", gap:14, padding:"14px", background:INK, border:`1px solid ${INK3}`, borderRadius:4, cursor:"pointer", fontFamily:FB, marginBottom:10, textAlign:"left" }}>
                <Avatar initial={a.initial} on="light" />
                <div style={{ flex:1 }}><div style={{fontSize:15,fontWeight:700,color:"#fff"}}>{a.name}</div><div style={{fontSize:11.5,color:"#7d8694",marginTop:1}}>{a.role}</div></div>
                <ArrowUpRight size={17} color={GOLD}/>
              </button>
            ))}
          </div>
          <div style={{ textAlign:"center", marginTop:20, fontSize:11, color:"#4a4f58" }}>D&A Property Group LLC</div>
        </div>
      </div>
    );
  }

  const render = () => {
    if (activeLead) return <LeadDetail lead={activeLead} onBack={()=>setActiveLead(null)} onUpdate={updateLead} />;
    if (tab==="dashboard") return <Dashboard user={user} leads={leads} onOpenLead={openLead} onGoFinder={()=>setTab("finder")} onQuickAdd={()=>setQuickAdd(true)} />;
    if (tab==="deals") return <Deals leads={leads} onOpenLead={openLead} onQuickAdd={()=>setQuickAdd(true)} />;
    if (tab==="finder") return <AIFinder onAddLead={saveNewLead} />;
    if (tab==="buyers") return <Buyers/>;
    if (tab==="numbers") return <Numbers/>;
    return null;
  };

  return (
    <div style={{ minHeight:"100vh", display:"flex", flexDirection:"column", background:PAPER, fontFamily:FB }}>
      {/* top bar */}
      <div style={{ background:INK, padding:"11px 18px", display:"flex", justifyContent:"space-between", alignItems:"center", flexShrink:0, borderBottom:`1px solid ${INK3}` }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ width:28, height:28, border:`1.5px solid ${GOLD}`, borderRadius:4, display:"flex", alignItems:"center", justifyContent:"center" }}><span style={{ fontSize:9.5, fontWeight:700, color:GOLD, fontFamily:FD }}>D&A</span></div>
          <span style={{ fontSize:13, fontWeight:700, color:"#fff", fontFamily:FD }}>Deal Engine</span>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:14 }}>
          <Bell size={17} color="#7d8694" />
          <button onClick={()=>{setScreen("login");setUser(null);setTab("dashboard");setActiveLead(null);}} style={{ display:"flex", alignItems:"center", gap:7, background:"none", border:"none", cursor:"pointer", fontFamily:FB }}>
            <span style={{ fontSize:12, color:"#9aa0ab" }}>{user.name}</span>
            <div style={{ width:26, height:26, borderRadius:4, background:GOLD, color:INK, display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, fontWeight:700, fontFamily:FD }}>{user.initial}</div>
          </button>
        </div>
      </div>

      {/* content */}
      <div style={{ flex:1, overflowY:"auto" }}>{render()}</div>

      {/* floating quick-add — hidden while viewing a lead */}
      {!activeLead && (
        <button onClick={()=>setQuickAdd(true)} style={{ position:"fixed", right:18, bottom:"calc(74px + env(safe-area-inset-bottom))", width:54, height:54, borderRadius:"50%", background:GOLD, border:"none", boxShadow:"0 6px 20px rgba(19,22,28,0.3)", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", zIndex:25 }}>
          <Plus size={26} color={INK} strokeWidth={2.5} />
        </button>
      )}

      {/* nav always present */}
      <BottomNav current={tab} onNav={t=>{setActiveLead(null);setTab(t);}} />

      {quickAdd && <QuickAdd onClose={()=>setQuickAdd(false)} onSave={saveNewLead} />}
    </div>
  );
}
