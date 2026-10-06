/* ============ ICONS ============ */
const I={
 bag:'<path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>',
 user:'<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
 home:'<path d="M3 10l9-7 9 7v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 13 15 13 15 22"/>',
 book:'<path d="M2 4h6a4 4 0 0 1 4 4v13a3 3 0 0 0-3-3H2z"/><path d="M22 4h-6a4 4 0 0 0-4 4v13a3 3 0 0 1 3-3h7z"/>',
 steth:'<path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 12 0V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3"/><path d="M8 15v1a6 6 0 0 0 12 0v-4"/><circle cx="20" cy="10" r="2"/>',
 video:'<polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/>',
 arrow:'<line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>',
 check:'<polyline points="20 6 9 17 4 12"/>',
 plus:'<line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>',
 minus:'<line x1="5" y1="12" x2="19" y2="12"/>',
 star:'<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>',
 gift:'<polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/><line x1="12" y1="22" x2="12" y2="7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/>',
 brief:'<rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>',
 mail:'<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>',
 phone:'<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/>',
 pin:'<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>',
 chat:'<path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>',
 cal:'<rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>',
 file:'<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>',
 leaf:'<path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>',
 shield:'<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/>',
 truck:'<rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>',
 out:'<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>',
 down:'<polyline points="6 9 12 15 18 9"/>',
 clock:'<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
 dl:'<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>',
 up:'<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>',
 sun:'<circle cx="12" cy="12" r="4.5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.2" y1="4.2" x2="5.6" y2="5.6"/><line x1="18.4" y1="18.4" x2="19.8" y2="19.8"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.2" y1="19.8" x2="5.6" y2="18.4"/><line x1="18.4" y1="5.6" x2="19.8" y2="4.2"/>',
 drop:'<path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/>',
 target:'<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>',
 wind:'<path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2"/>',
 feather:'<path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z"/><line x1="16" y1="8" x2="2" y2="22"/><line x1="17.5" y1="15" x2="9" y2="15"/>',
 snow:'<path d="M20 17.58A5 5 0 0 0 18 8h-1.26A8 8 0 1 0 4 16.25"/><line x1="8" y1="16" x2="8.01" y2="16"/><line x1="8" y1="20" x2="8.01" y2="20"/><line x1="12" y1="18" x2="12.01" y2="18"/><line x1="12" y1="22" x2="12.01" y2="22"/><line x1="16" y1="16" x2="16.01" y2="16"/><line x1="16" y1="20" x2="16.01" y2="20"/>',
 smile:'<circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/>',
 users:'<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
 award:'<circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/>',
 trash:'<polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>',
 spark:'<path d="M12 3l1.9 5.6L19.5 10l-5.6 1.9L12 17.5l-1.9-5.6L4.5 10l5.6-1.4z"/>',
 heart:'<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z"/>',
 search:'<circle cx="11" cy="11" r="7.5"/><line x1="21" y1="21" x2="16.5" y2="16.5"/>',
 rings:'<circle cx="9" cy="14" r="6"/><circle cx="15" cy="14" r="6"/><path d="M10 4l2-2 2 2"/>',
 flask:'<path d="M9 2h6"/><path d="M10 2v6L4.5 18.5A2.3 2.3 0 0 0 6.5 22h11a2.3 2.3 0 0 0 2-3.5L14 8V2"/><line x1="7" y1="15" x2="17" y2="15"/>',
 box:'<path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/>'
};
const ic=(n,c='')=>`<svg class="icon ${c}" viewBox="0 0 24 24">${I[n]||''}</svg>`;
const stars=r=>`<span class="stars">${[1,2,3,4,5].map(i=>`<svg class="icon" viewBox="0 0 24 24" style="opacity:${i<=Math.round(r)?1:.25}">${I.star}</svg>`).join('')}</span>`;
const inr=n=>'₹'+Math.round(n).toLocaleString('en-IN');
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const store=(()=>{const m={};let ls=null;try{ls=window.localStorage;ls.setItem('_kc','1');ls.removeItem('_kc')}catch(e){ls=null}
 return{get:(k,d)=>{try{const v=ls?ls.getItem(k):m[k];return v==null?d:JSON.parse(v)}catch(e){return d}},
 set:(k,v)=>{const s=JSON.stringify(v);try{if(ls)ls.setItem(k,s);else m[k]=s}catch(e){m[k]=s}},
 del:k=>{try{if(ls)ls.removeItem(k)}catch(e){}delete m[k]}}})();

/* ============ PRODUCT ART (SVG) ============ */
function art(type,body='#9A5A24',label='',lid='url(#kcfoil)'){
  const lab=(x,y,w,h)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="6" fill="#FBF8F1"/><circle cx="100" cy="${y+h*0.36}" r="${Math.min(13,h*.2)}" fill="none" stroke="url(#kcfoil)" stroke-width="2"/><text x="100" y="${y+h*0.36+4}" text-anchor="middle" font-family="Cormorant Garamond,serif" font-style="italic" font-weight="700" font-size="${Math.min(13,h*.2)}" fill="#04484A">kc</text><text x="100" y="${y+h*0.78}" text-anchor="middle" font-family="Jost,sans-serif" font-size="${label.length>9?9:10.5}" letter-spacing="1.4" fill="#04484A">${label.toUpperCase()}</text>`;
  const gloss=(x,y,w,h,rx)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="url(#kcgloss)"/>`;
  const shadow=`<ellipse cx="100" cy="230" rx="62" ry="7" fill="#01201F" opacity=".14"/>`;
  const S={
   dropper:`${shadow}<rect x="89" y="8" width="22" height="42" rx="11" fill="#1B2A29"/><rect x="78" y="46" width="44" height="28" rx="5" fill="${lid}"/><rect x="56" y="72" width="88" height="156" rx="22" fill="${body}"/>${gloss(56,72,88,156,22)}${lab(66,120,68,74)}`,
   jar:`${shadow}<rect x="40" y="98" width="120" height="36" rx="9" fill="${lid}"/><rect x="34" y="128" width="132" height="100" rx="26" fill="${body}"/>${gloss(34,128,132,100,26)}${lab(52,146,96,62)}`,
   tube:`${shadow}<rect x="58" y="20" width="84" height="14" rx="3" fill="${body}" opacity=".85"/><path d="M60 32 L140 32 L126 196 L74 196 Z" fill="${body}"/><path d="M60 32 L140 32 L126 196 L74 196 Z" fill="url(#kcgloss)"/><rect x="74" y="192" width="52" height="36" rx="7" fill="${lid}"/>${lab(76,70,48,92)}`,
   pump:`${shadow}<rect x="93" y="12" width="14" height="32" fill="#1B2A29"/><rect x="104" y="14" width="34" height="9" rx="4" fill="#1B2A29"/><rect x="80" y="40" width="40" height="26" rx="5" fill="${lid}"/><rect x="58" y="64" width="84" height="164" rx="18" fill="${body}"/>${gloss(58,64,84,164,18)}${lab(68,112,64,80)}`,
   oil:`${shadow}<rect x="80" y="10" width="40" height="46" rx="7" fill="${lid}"/><rect x="88" y="54" width="24" height="16" fill="${body}"/><path d="M88 68 Q62 76 62 100 L62 214 Q62 228 76 228 L124 228 Q138 228 138 214 L138 100 Q138 76 112 68 Z" fill="${body}"/><path d="M88 68 Q62 76 62 100 L62 214 Q62 228 76 228 L124 228 Q138 228 138 214 L138 100 Q138 76 112 68 Z" fill="url(#kcgloss)"/>${lab(70,122,60,76)}`,
   mist:`${shadow}<rect x="86" y="14" width="28" height="40" rx="10" fill="${lid}"/><rect x="74" y="26" width="14" height="6" rx="3" fill="#1B2A29"/><rect x="64" y="52" width="72" height="176" rx="30" fill="${body}"/>${gloss(64,52,72,176,30)}${lab(72,112,56,80)}`,
   bar:`${shadow}<rect x="30" y="150" width="140" height="74" rx="14" fill="${body}"/><rect x="30" y="150" width="140" height="74" rx="14" fill="url(#kcgloss)"/><rect x="30" y="172" width="140" height="30" fill="#FBF8F1"/><text x="100" y="192" text-anchor="middle" font-family="Jost,sans-serif" font-size="11" letter-spacing="1.6" fill="#04484A">${label.toUpperCase()}</text>`,
   box:`${shadow}<rect x="26" y="104" width="148" height="122" rx="8" fill="${body}"/><rect x="18" y="84" width="164" height="34" rx="6" fill="${body}"/><rect x="18" y="84" width="164" height="34" rx="6" fill="#000" opacity=".12"/><rect x="92" y="84" width="16" height="142" fill="${lid}"/><path d="M100 84 C80 50 50 62 66 80 C74 88 92 86 100 84 Z" fill="${lid}"/><path d="M100 84 C120 50 150 62 134 80 C126 88 108 86 100 84 Z" fill="${lid}"/><circle cx="100" cy="168" r="24" fill="#FBF8F1"/><circle cx="100" cy="168" r="18" fill="none" stroke="url(#kcfoil)" stroke-width="2"/><text x="100" y="174" text-anchor="middle" font-family="Cormorant Garamond,serif" font-style="italic" font-weight="700" font-size="18" fill="#04484A">kc</text>`,
   potli:`${shadow}<path d="M64 96 Q40 170 58 214 Q64 228 82 228 L118 228 Q136 228 142 214 Q160 170 136 96 Z" fill="${body}"/><path d="M64 96 Q40 170 58 214 Q64 228 82 228 L118 228 Q136 228 142 214 Q160 170 136 96 Z" fill="url(#kcgloss)"/><path d="M64 98 Q72 60 84 74 Q92 50 100 70 Q108 50 116 74 Q128 60 136 98 Z" fill="${body}"/><rect x="60" y="92" width="80" height="10" rx="5" fill="${lid}"/><path d="M78 102 L70 140 M122 102 L130 140" stroke="url(#kcfoil)" stroke-width="3" stroke-linecap="round"/><circle cx="70" cy="144" r="5" fill="url(#kcfoil)"/><circle cx="130" cy="144" r="5" fill="url(#kcfoil)"/><circle cx="100" cy="172" r="20" fill="none" stroke="url(#kcfoil)" stroke-width="2"/><text x="100" y="178" text-anchor="middle" font-family="Cormorant Garamond,serif" font-style="italic" font-weight="700" font-size="16" fill="#F3DC98">kc</text>`,
   tin:`${shadow}<rect x="34" y="138" width="132" height="90" rx="12" fill="${body}"/><rect x="34" y="138" width="132" height="90" rx="12" fill="url(#kcgloss)"/><rect x="28" y="122" width="144" height="28" rx="8" fill="${lid}"/><circle cx="100" cy="186" r="24" fill="none" stroke="url(#kcfoil)" stroke-width="2"/><text x="100" y="193" text-anchor="middle" font-family="Cormorant Garamond,serif" font-style="italic" font-weight="700" font-size="18" fill="#F3DC98">kc</text>`,
   trunk:`${shadow}<rect x="22" y="110" width="156" height="118" rx="10" fill="${body}"/><path d="M22 120 Q22 82 60 82 L140 82 Q178 82 178 120 L178 136 L22 136 Z" fill="${body}"/><path d="M22 120 Q22 82 60 82 L140 82 Q178 82 178 120 L178 136 L22 136 Z" fill="#000" opacity=".12"/><rect x="22" y="134" width="156" height="6" fill="${lid}"/><rect x="48" y="82" width="8" height="146" fill="${lid}" opacity=".9"/><rect x="144" y="82" width="8" height="146" fill="${lid}" opacity=".9"/><rect x="88" y="128" width="24" height="26" rx="4" fill="${lid}"/><path d="M84 82 Q84 64 100 64 Q116 64 116 82" fill="none" stroke="url(#kcfoil)" stroke-width="5"/><circle cx="100" cy="186" r="18" fill="none" stroke="url(#kcfoil)" stroke-width="2"/><text x="100" y="192" text-anchor="middle" font-family="Cormorant Garamond,serif" font-style="italic" font-weight="700" font-size="15" fill="#F3DC98">kc</text>`,
   candle:`${shadow}<path d="M100 92 Q92 108 100 118 Q108 108 100 92 Z" fill="#F3B54A"/><line x1="100" y1="116" x2="100" y2="128" stroke="#1B2A29" stroke-width="2"/><rect x="50" y="126" width="100" height="102" rx="12" fill="${body}"/><rect x="50" y="126" width="100" height="102" rx="12" fill="url(#kcgloss)"/>${lab(62,150,76,56)}`
  };
  return `<svg viewBox="0 0 200 240" aria-hidden="true">${S[type]||S.jar}</svg>`;
}

/* leaves like the logo */
const leavesSVG=`<svg viewBox="0 0 200 200" aria-hidden="true"><path d="M20 180 C40 120 70 70 140 40 C120 90 80 140 20 180Z" fill="url(#kcfoil)"/><path d="M40 150 C70 120 120 100 190 108 C150 140 100 156 40 150Z" fill="url(#kcfoil)" opacity=".9"/><path d="M70 120 C90 80 120 40 168 12 C160 60 130 100 70 120Z" fill="url(#kcfoil)" opacity=".75"/></svg>`;

/* journal art */
function jart(cat,seed=1){
  const pal={'Bridal':['#7A2E3A','#F2DDD3'],'Ingredients':['#04484A','#E9D9B6'],'Skin Science':['#E9DCC6','#04484A'],'Hair':['#DDE7E1','#04484A'],'Rituals':['#5E6B3A','#F1E4D3'],'Wellness':['#F1E4D3','#7A2E3A']}[cat]||['#04484A','#E9D9B6'];
  const [bg,fg]=pal; const r=(n)=>((Math.sin(seed*99+n)*10000)%1+1)%1;
  let leaves='';
  for(let i=0;i<5;i++){const a=-70+i*28+r(i)*14, s=.7+r(i+9)*.6;
    leaves+=`<g transform="translate(${170+r(i+3)*60} ${250}) rotate(${a}) scale(${s})"><path d="M0 0 C 30 -40, 110 -40, 150 0 C 110 40, 30 40, 0 0 Z" fill="${fg}" opacity="${.35+i*.12}"/><path d="M0 0 L150 0" stroke="${bg}" stroke-width="2" opacity=".5"/></g>`;}
  return `<svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" style="width:100%;height:100%"><rect width="400" height="300" fill="${bg}"/><circle cx="${250+r(1)*60}" cy="${110+r(2)*30}" r="${80+r(4)*30}" fill="none" stroke="url(#kcfoil)" stroke-width="2.5"/><circle cx="${250+r(1)*60}" cy="${110+r(2)*30}" r="${66+r(4)*30}" fill="none" stroke="url(#kcfoil)" stroke-width="1" opacity=".6"/>${leaves}</svg>`;
}

/* ============ DATA ============ */
const CONCERNS=[
 {id:'glow',name:'Dull skin',sub:'Glow & radiance',ic:'sun'},
 {id:'acne',name:'Acne',sub:'Breakouts & oil',ic:'drop'},
 {id:'pigmentation',name:'Pigmentation',sub:'Spots & tan',ic:'target'},
 {id:'dryness',name:'Dryness',sub:'Barrier repair',ic:'leaf'},
 {id:'sensitive',name:'Sensitivity',sub:'Calm & soothe',ic:'smile'},
 {id:'hairfall',name:'Hair fall',sub:'Roots & density',ic:'wind'},
 {id:'dandruff',name:'Dandruff',sub:'Scalp balance',ic:'snow'}
];
const P=[
 {id:'kesar-elixir',name:'Kesar Glow Face Elixir',cat:'skin',type:'dropper',body:'#9A5A24',label:'Kesar',concern:['glow','pigmentation'],price:1250,mrp:1450,sizes:['15 ml','30 ml'],rating:4.8,rev:412,tag:'Bestseller',short:'Saffron & kumkumadi night oil for an even, lit-from-within glow.',ingr:['Kashmiri saffron','Kumkumadi taila','Amla vitamin C','Sandalwood'],use:'Warm 3 to 4 drops between palms and press onto clean skin at night. Follow with Saffron Night Cream.'},
 {id:'haldi-ubtan',name:'Haldi Chandan Ubtan',cat:'skin',type:'jar',body:'#E2B34A',label:'Ubtan',concern:['glow','pigmentation'],price:690,sizes:['100 g'],rating:4.7,rev:308,tag:'Bridal pick',short:'The pre-wedding ritual, bottled. Brightens and gently polishes.',ingr:['Wild turmeric','Sandalwood','Chickpea flour','Rose petals'],use:'Mix 1 tsp with rose water or milk into a paste. Apply, leave 10 minutes, rub off in circles. 2 to 3 times a week.'},
 {id:'rose-mist',name:'Rose & Vetiver Toning Mist',cat:'skin',type:'mist',body:'#E8B9B5',label:'Rose',concern:['dryness','sensitive'],price:520,sizes:['100 ml','200 ml'],rating:4.6,rev:256,short:'Steam-distilled Kannauj rose to calm and hydrate, any time.',ingr:['Kannauj rose water','Vetiver','Aloe'],use:'Mist over face after cleansing, or through the day to refresh.'},
 {id:'neem-wash',name:'Aloe Neem Clarifying Wash',cat:'skin',type:'tube',body:'#7E9B6A',label:'Neem',concern:['acne'],price:420,sizes:['100 ml'],rating:4.5,rev:521,tag:'New',short:'A low-foam gel that clears pores without stripping.',ingr:['Neem leaf','Aloe vera','Tulsi','Salicylic (willow bark)'],use:'Massage onto damp skin for 30 seconds, rinse. Morning and night.'},
 {id:'saffron-cream',name:'Saffron Night Cream',cat:'skin',type:'jar',body:'#EFE6D4',label:'Saffron',concern:['glow','dryness'],price:1490,mrp:1690,sizes:['50 g'],rating:4.8,rev:190,short:'Rich overnight repair with saffron, ghee and almond.',ingr:['Saffron','Cow ghee','Almond oil','Shea butter'],use:'Smooth a pea-sized amount over face and neck as your last night step.'},
 {id:'sun-veil',name:'Mineral Sun Veil SPF 40',cat:'skin',type:'tube',body:'#F1E4D3',label:'SPF 40',concern:['pigmentation','sensitive'],price:780,sizes:['50 g'],rating:4.4,rev:143,short:'Zinc-based, no white cast, made for Indian skin tones.',ingr:['Zinc oxide','Carrot seed','Aloe'],use:'Apply two fingers\u2019 length as the last morning step. Reapply every 3 hours outdoors.'},
 {id:'bhringraj-oil',name:'Bhringraj Root Oil',cat:'hair',type:'oil',body:'#5E7F4E',label:'Bhringraj',concern:['hairfall'],price:640,sizes:['100 ml','200 ml'],rating:4.8,rev:688,tag:'Bestseller',short:'Slow-cooked in sesame for 7 days. For stronger roots.',ingr:['Bhringraj','Amla','Brahmi','Cold-pressed sesame'],use:'Warm slightly, massage into scalp for 5 minutes. Leave 1 hour or overnight, then wash.'},
 {id:'amla-cleanser',name:'Amla Shikakai Hair Cleanser',cat:'hair',type:'pump',body:'#A9A35A',label:'Amla',concern:['hairfall','dandruff'],price:560,sizes:['200 ml'],rating:4.5,rev:402,short:'Sulphate-free cleanse that respects your scalp\u2019s oils.',ingr:['Amla','Shikakai','Reetha','Hibiscus'],use:'Lather on wet scalp, massage, rinse. Use 2 to 3 times a week.'},
 {id:'methi-serum',name:'Onion & Methi Hair Serum',cat:'hair',type:'dropper',body:'#6D4B2F',label:'Methi',concern:['hairfall'],price:790,sizes:['30 ml'],rating:4.6,rev:233,short:'Lightweight, non-greasy scalp serum for density.',ingr:['Red onion','Fenugreek','Rosemary','Redensyl'],use:'Part hair, apply 1 dropper across scalp. Massage. No rinse needed.'},
 {id:'hibiscus-mask',name:'Hibiscus Repair Mask',cat:'hair',type:'jar',body:'#B5485A',label:'Hibiscus',concern:['dryness'],price:720,sizes:['200 g'],rating:4.7,rev:167,tag:'New',short:'Deep conditioning for frizz, colour and heat damage.',ingr:['Hibiscus','Coconut milk','Aloe','Shea'],use:'After cleansing, apply to lengths. Leave 10 minutes, rinse.'},
 {id:'neem-tonic',name:'Neem Tea Tree Scalp Tonic',cat:'hair',type:'mist',body:'#4D7A6B',label:'Scalp',concern:['dandruff'],price:680,sizes:['100 ml'],rating:4.4,rev:98,short:'A cooling spritz for itchy, flaky scalps.',ingr:['Neem','Tea tree','Peppermint'],use:'Spray on scalp sections, massage. Daily or on alternate days.'},
 {id:'sandal-bar',name:'Sandal & Kesar Bathing Bar',cat:'skin',type:'bar',body:'#C9945A',label:'Sandal',concern:['dryness','glow'],price:290,sizes:['125 g'],rating:4.6,rev:340,short:'Cold-process, glycerine-rich bar for the whole family.',ingr:['Sandalwood','Saffron','Coconut oil'],use:'Lather and rinse. Store dry between uses.'},
 {id:'glow-kit',name:'Daily Glow Ritual Kit',cat:'kits',type:'box',body:'#04484A',label:'',concern:['glow'],price:2390,mrp:2880,sizes:['Kit of 4'],rating:4.9,rev:121,tag:'Save 17%',short:'Wash, mist, elixir and night cream: a full routine.',ingr:['Neem wash','Rose mist','Kesar elixir','Night cream'],use:'AM: wash, mist, SPF. PM: wash, mist, elixir, night cream.'},
 {id:'hair-kit',name:'Root Revival Hair Kit',cat:'kits',type:'box',body:'#5E7F4E',label:'',concern:['hairfall'],price:1790,mrp:1990,sizes:['Kit of 3'],rating:4.7,rev:88,tag:'Save 10%',short:'Oil, cleanser and serum, the complete hair-fall routine.',ingr:['Bhringraj oil','Amla cleanser','Methi serum'],use:'Oil twice a week before washing; serum daily on scalp.'},
 /* wedding */
 {id:'bride-plan',name:'Bride\u2019s 90-Day Glow Plan',cat:'wedding',type:'trunk',body:'#7A2E3A',label:'',price:6999,sizes:['90-day plan'],rating:4.9,rev:64,tag:'Includes 3 consults',short:'Doctor-led regimen + full product set, timed to your date.',ingr:['3 video consults','Kesar elixir','Ubtan','Night cream','Rose mist','Hair oil'],use:'Your doctor sets the schedule. We ship in phases so products are fresh.'},
 {id:'groom-kit',name:'Groom\u2019s Ritual Kit',cat:'wedding',type:'box',body:'#1E3B3A',label:'',price:3499,sizes:['Kit of 5'],rating:4.7,rev:41,short:'Clear skin, calm beard, steady roots before the big day.',ingr:['Neem wash','Sun veil','Bhringraj oil','Beard oil','Ubtan'],use:'Start 30 to 45 days out for best results.'},
 {id:'maid-box',name:'Bridesmaid Pamper Box',cat:'wedding',type:'tin',body:'#B5485A',label:'',price:1299,sizes:['Box of 4'],rating:4.8,rev:57,tag:'Personalised',short:'Rose mist, lip balm, ubtan and a handwritten note.',ingr:['Rose mist 50 ml','Kesar lip balm','Ubtan 30 g','Note card'],use:'Add each name at checkout. Min. 4 boxes.'},
 {id:'haldi-favour',name:'Haldi Favour Potli',cat:'wedding',type:'potli',body:'#D9A21E',label:'',price:349,sizes:['Per potli (min 25)'],rating:4.8,rev:73,short:'Mini ubtan + sandal bar in a yellow silk potli.',ingr:['Ubtan 30 g','Sandal mini bar','Tag with your names'],use:'Minimum 25. Ready in 10 days.'},
 /* corporate */
 {id:'corp-essentials',name:'Essentials Gift Box',cat:'corporate',type:'box',body:'#04484A',label:'',price:799,sizes:['Per box'],rating:4.7,rev:39,short:'Rose mist, sandal bar and lip balm.',ingr:['Rose mist 100 ml','Sandal bar','Kesar lip balm'],use:'From 25 boxes.'},
 {id:'corp-signature',name:'Signature Wellness Hamper',cat:'corporate',type:'trunk',body:'#04484A',label:'',price:1499,sizes:['Per hamper'],rating:4.9,rev:52,short:'Our most-gifted hamper for teams and clients.',ingr:['Kesar elixir 15 ml','Bhringraj oil','Rose mist','Mogra candle'],use:'From 25 hampers.'},
 {id:'corp-luxe',name:'Luxe Ritual Trunk',cat:'corporate',type:'trunk',body:'#1B2A29',label:'',price:2999,sizes:['Per trunk'],rating:4.9,rev:23,short:'Full-size rituals in a keepsake trunk.',ingr:['Glow ritual kit','Hair oil','Candle','Brass diya'],use:'From 25 trunks.'}
];
const tint=p=>p.cat==='hair'?'t-hair':p.cat==='wedding'?'t-wed':(p.cat==='corporate'||p.cat==='kits')?'t-gift':'t-skin';
const byId=id=>P.find(p=>p.id===id);

const DOCTORS=[
 {id:'d1',name:'Dr. Aanya Mehta',ini:'AM',role:'MD, Dermatology',exp:'11 yrs',lang:'English, Hindi, Gujarati',focus:'Acne, pigmentation, bridal skin',next:'Today, 5:30 PM'},
 {id:'d2',name:'Dr. Rohan Iyer',ini:'RI',role:'Trichologist',exp:'8 yrs',lang:'English, Hindi, Tamil',focus:'Hair fall, scalp, PCOS-related thinning',next:'Tomorrow, 11:00 AM'},
 {id:'d3',name:'Dr. Sana Qureshi',ini:'SQ',role:'BAMS, Ayurvedic skin specialist',exp:'9 yrs',lang:'English, Hindi, Urdu',focus:'Sensitive skin, eczema, holistic routines',next:'Thu, 4:00 PM'}
];

const ARTICLES=[
 {id:'bridal-90',cat:'Bridal',title:'The 90-day bridal skin plan, week by week',ex:'What to start, what to stop, and the one thing you should never try in the final fortnight.',read:8,date:'2 Oct 2026',by:'Dr. Aanya Mehta',
  intro:'Brides ask us the same question every season: when should I start? The honest answer is three months out. Skin turns over roughly every 28 days, so ninety days gives you three full cycles to see real change rather than a temporary glow.',
  pts:['Days 90 to 60: book a consult, fix the basics (cleanser, sunscreen, sleep) and start any active treatment for acne or pigmentation.','Days 60 to 30: add a weekly ubtan and a nightly face oil. This is the window for facials, not later.','Days 30 to 7: hold steady. Hydration, rose mist, gentle exfoliation only.','Final week: nothing new. No new facials, no new products, no experiments.'],
  quote:'The biggest bridal skin mistake is a brand-new facial five days before the wedding.'},
 {id:'bhringraj',cat:'Ingredients',title:'Bhringraj, explained: what the \u2018king of hair\u2019 really does',ex:'Separating centuries of tradition from what the research actually supports.',read:6,date:'26 Sep 2026',by:'Dr. Rohan Iyer',
  intro:'Bhringraj (Eclipta alba) has been used in Ayurvedic hair oils for centuries. Modern studies are small but promising, pointing to improved circulation at the scalp and support for the growth phase of the hair cycle.',
  pts:['It works best as a consistent, twice-weekly scalp massage, not a once-a-month treatment.','Pair it with a gentle cleanser so oil build-up doesn\u2019t clog follicles.','Give it 12 weeks before judging results.'],
  quote:'Oil is a habit, not a rescue. Consistency beats quantity every time.'},
 {id:'face-wash',cat:'Skin Science',title:'Why your face wash might be making your acne worse',ex:'Squeaky clean is not the goal. Here is what to look for instead.',read:5,date:'18 Sep 2026',by:'Dr. Aanya Mehta',
  intro:'That tight, squeaky feeling after washing is your skin barrier asking for help. Harsh cleansers strip oil, and oily skin responds by producing more of it.',
  pts:['Choose a low-foam gel with neem or a gentle salicylic acid.','Wash for 30 seconds, not two minutes.','Twice a day is enough. More is not better.'],
  quote:'If your skin feels tight after washing, your cleanser is too strong.'},
 {id:'hard-water',cat:'Hair',title:'Hard water and hair: a survival guide for Indian cities',ex:'Why your hair feels like straw after a move, and the three fixes that help.',read:7,date:'9 Sep 2026',by:'Dr. Rohan Iyer',
  intro:'Calcium and magnesium in hard water leave a film on hair that makes it dull, tangly and prone to breakage. Many Indian cities have water hard enough to notice within weeks.',
  pts:['A shower filter is the single best investment.','Rinse with diluted amla or apple cider vinegar once a week.','Condition every wash, even if your hair is oily at the roots.'],
  quote:'Sometimes it\u2019s not your shampoo, it\u2019s your tap.'},
 {id:'saffron',cat:'Ingredients',title:'Saffron in skincare: luxury, or real science?',ex:'The world\u2019s most expensive spice, and what it can actually do for your skin.',read:6,date:'1 Sep 2026',by:'Dr. Sana Qureshi',
  intro:'Saffron is rich in antioxidants like crocin and safranal, which help protect skin from oxidative stress. In traditional kumkumadi formulas it is paired with oils that help it reach the skin.',
  pts:['Look for real Kashmiri saffron listed near the top of the ingredients.','Use it at night, when skin repairs.','Patience: brightening takes 6 to 8 weeks.'],
  quote:'Real saffron is a quiet ingredient. It works slowly and it works well.'},
 {id:'monsoon',cat:'Rituals',title:'Monsoon skin: switching your routine when humidity hits 90%',ex:'Lighter layers, fewer steps, and why you still need sunscreen on grey days.',read:4,date:'22 Aug 2026',by:'Dr. Sana Qureshi',
  intro:'Humidity changes how skin behaves. Pores feel congested, heavy creams sit on the surface, and fungal breakouts become more common.',
  pts:['Swap rich creams for gels and mists.','Keep a clarifying wash for evenings.','Sunscreen still matters: UV gets through cloud cover.'],
  quote:'In the monsoon, less is more. Edit your shelf.'},
 {id:'pigment',cat:'Skin Science',title:'Pigmentation 101: the four types and what fades each',ex:'Tan, melasma, post-acne marks and sun spots need very different care.',read:9,date:'12 Aug 2026',by:'Dr. Aanya Mehta',
  intro:'Not all dark spots are the same. Treating melasma like a tan can make it worse, which is why diagnosis comes before products.',
  pts:['Tan: sunscreen and time, plus gentle exfoliation.','Post-acne marks: niacinamide and saffron help them fade.','Melasma: needs a doctor; triggers include hormones and heat.','Sun spots: consistent SPF and targeted actives.'],
  quote:'Get the diagnosis right and the routine becomes simple.'},
 {id:'oiling',cat:'Rituals',title:'The weekly hair oiling ritual, done right',ex:'How much, how long, and the warm-towel trick our grandmothers knew.',read:5,date:'4 Aug 2026',by:'Dr. Rohan Iyer',
  intro:'Champi is one of the oldest rituals in Indian homes. Done well, it\u2019s a scalp massage that improves circulation and leaves lengths softer.',
  pts:['Use 1 to 2 tablespoons, warmed. More just means more washing.','Massage with fingertips for five minutes, not nails.','Wrap in a warm towel for 20 minutes, then wash.'],
  quote:'The massage matters as much as the oil.'}
];
