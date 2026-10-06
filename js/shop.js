/* ============ SHOP ============ */
const shopState={cat:'all',concern:'',q:'',sort:'pop'};
function Shop(tab,params){
  if(params.concern){shopState.concern=params.concern;shopState.cat='all'}
  const titles={'':['The Shop','Skin & hair care made with plants, tested by doctors.'],wedding:['Wedding <em class="foil">Gifting</em>','Glow plans for the couple and personalised favours for every ceremony.'],corporate:['Corporate <em class="foil">Gifting</em>','Co-branded wellness gifts for teams and clients, from 25 boxes.']};
  const [h,l]=titles[tab||''];
  return phero('Shop',h,l,'Shop')+`
  <section class="sec" style="padding-top:36px"><div class="wrap">
    <div class="seg" role="tablist">
      <button class="${!tab?'on':''}" data-go="#/shop">${ic('leaf')} Skin & Hair</button>
      <button class="${tab==='wedding'?'on':''}" data-go="#/shop/wedding">${ic('rings')} Wedding</button>
      <button class="${tab==='corporate'?'on':''}" data-go="#/shop/corporate">${ic('brief')} Corporate</button>
    </div>
    ${tab==='wedding'?Wedding():tab==='corporate'?Corporate():Catalog()}
  </div></section>`;
}
function Catalog(){
  return `<div class="shopbar">
    <div class="chips" data-chipgroup="cat">${[['all','All'],['skin','Skin'],['hair','Hair'],['kits','Kits']].map(c=>`<button class="chip ${shopState.cat===c[0]?'on':''}" data-cat="${c[0]}">${c[1]}</button>`).join('')}</div>
    <div style="display:flex;gap:10px;flex:1;justify-content:flex-end;flex-wrap:wrap">
      <div class="search">${ic('search')}<input class="inp" id="q" placeholder="Search saffron, hair fall\u2026" value="${shopState.q}"></div>
      <select class="inp sort" id="concernSel" aria-label="Concern"><option value="">All concerns</option>${CONCERNS.map(c=>`<option value="${c.id}" ${shopState.concern===c.id?'selected':''}>${c.name}</option>`).join('')}</select>
      <select class="inp sort" id="sortSel" aria-label="Sort"><option value="pop">Most popular</option><option value="lo" ${shopState.sort==='lo'?'selected':''}>Price: low to high</option><option value="hi" ${shopState.sort==='hi'?'selected':''}>Price: high to low</option><option value="rate" ${shopState.sort==='rate'?'selected':''}>Top rated</option></select>
    </div></div>
    <div class="grid g4" id="pgrid">${gridHTML()}</div>
    <div class="feature reveal" style="margin-top:72px;min-height:0">
      <div class="fx on-dark" style="background:var(--teal);padding:48px"><span class="eyebrow">Not sure where to start?</span><h2 style="font-size:clamp(32px,4vw,46px)">Get a regimen built by a doctor.</h2><div><a href="#/consult" class="btn btn-gold">Consult from ₹499 ${ic('arrow')}</a></div></div>
      <div class="t-skin" style="display:flex;align-items:flex-end;justify-content:center;gap:0;padding:36px 20px 0">${[['mist','#E8B9B5','Rose'],['dropper','#9A5A24','Kesar'],['tube','#7E9B6A','Neem']].map((a,i)=>`<div style="width:${i===1?34:28}%">${art(...a)}</div>`).join('')}</div>
    </div>`;
}
function gridHTML(){
  let list=P.filter(p=>['skin','hair','kits'].includes(p.cat));
  if(shopState.cat!=='all')list=list.filter(p=>p.cat===shopState.cat);
  if(shopState.concern)list=list.filter(p=>(p.concern||[]).includes(shopState.concern));
  if(shopState.q){const q=shopState.q.toLowerCase();list=list.filter(p=>(p.name+' '+p.short+' '+p.ingr.join(' ')).toLowerCase().includes(q))}
  if(shopState.sort==='lo')list.sort((a,b)=>a.price-b.price);
  if(shopState.sort==='hi')list.sort((a,b)=>b.price-a.price);
  if(shopState.sort==='rate')list.sort((a,b)=>b.rating-a.rating);
  return list.length?list.map(pcard).join(''):`<div class="empty" style="grid-column:1/-1"><h3 style="font-size:32px">Nothing matches yet.</h3><p>Try another word, or <a class="link" href="#/consult">ask a doctor</a>.</p></div>`;
}

/* ---- Wedding ---- */
const BOXES=[{id:'potli',name:'Silk Potli',price:180,body:'#D9A21E',type:'potli'},{id:'tin',name:'Keepsake Tin',price:260,body:'#B5485A',type:'tin'},{id:'trunk',name:'Signature Trunk',price:520,body:'#7A2E3A',type:'trunk'}];
const FILL=[{id:'f1',name:'Rose mist 50 ml',price:290,t:'mist',b:'#E8B9B5',l:'Rose'},{id:'f2',name:'Haldi ubtan 30 g',price:240,t:'jar',b:'#E2B34A',l:'Ubtan'},{id:'f3',name:'Kesar lip balm',price:220,t:'tube',b:'#B5485A',l:'Kesar'},{id:'f4',name:'Bhringraj oil 50 ml',price:260,t:'oil',b:'#5E7F4E',l:'Oil'},{id:'f5',name:'Sandal mini bar',price:180,t:'bar',b:'#C9945A',l:'Sandal'},{id:'f6',name:'Mogra soy candle',price:350,t:'candle',b:'#EFE6D4',l:'Mogra'}];
const byob={box:'tin',items:['f1','f2','f3'],names:'',note:'',cer:'Haldi',qty:50};
function Wedding(){
  const wp=P.filter(p=>p.cat==='wedding');
  return `
  <div style="margin-top:48px">
    <div class="sec-head reveal"><div><span class="eyebrow">For the couple</span><h2>The bridal glow countdown.</h2></div><p class="lead" style="max-width:40ch">Start 90 days out. Your doctor times every step to your wedding date.</p></div>
    <div class="countdown reveal">
      ${[['90','Consult & begin','Diagnose concerns, start actives for acne or pigmentation.'],['60','Build the glow','Weekly ubtan, nightly kesar elixir, hair oiling twice a week.'],['30','Hold steady','Hydration and mists. Last facial happens here.'],['7','Nothing new','No experiments. Just rest, water and rose mist.']].map(c=>`<div class="cd"><div class="ring"><div><b>${c[0]}</b><small>days</small></div></div><h4>${c[1]}</h4><p>${c[2]}</p></div>`).join('')}
    </div>
  </div>
  <div style="margin-top:80px">
    <div class="sec-head reveal"><div><span class="eyebrow">Shop wedding</span><h2>Kits for the bride, groom & crew.</h2></div></div>
    <div class="grid g4">${wp.map(pcard).join('')}</div>
  </div>
  <div style="margin-top:80px">
    <div class="sec-head reveal"><div><span class="eyebrow">Gift by ceremony</span><h2>A favour for every function.</h2></div><p class="lead" style="max-width:38ch">Personalised with your names or wedding monogram. Min. 25 per design.</p></div>
    <div class="grid g3">
      ${[['c-haldi','Haldi','Mini ubtan & sandal bar in a marigold potli.',349],['c-mehendi','Mehendi','Hand cream & cooling mist for hennaed hands.',449],['c-sangeet','Sangeet','Rose lip balm & glow mist for the dance floor.',399],['c-maids','Bridesmaids & groomsmen','Matching boxes, a personal note for each.',1299],['c-invite','With the invite','A slim box that travels with your wedding card.',299],['c-thanks','Thank-you hampers','For family who made it all happen.',1499]].map(c=>`<div class="ceremony ${c[0]} reveal"><span class="eyebrow">${ic('gift')}</span><h4>${c[1]}</h4><p>${c[2]}</p><div class="from">from <b>${inr(c[3])}</b> per guest</div><button class="link" style="align-self:flex-start" data-scroll="byob">Customise ${ic('arrow')}</button></div>`).join('')}
    </div>
  </div>
  <div style="margin-top:80px" id="byob">
    <div class="sec-head reveal"><div><span class="eyebrow">Build your own box</span><h2>Design your favour in three steps.</h2></div></div>
    <div class="byob"><div id="byobSteps">${byobSteps()}</div><aside class="preview on-dark" id="byobPrev">${byobPreview()}</aside></div>
  </div>
  <div class="news on-dark reveal" style="margin-top:80px;background:#4A1622"><div><span class="eyebrow">Wedding concierge</span><h2>Planning 200+ favours?</h2><p class="lead" style="margin-top:10px">Share your dates and guest count. We\u2019ll send samples and a mood board in 48 hours.</p></div><div style="display:flex;gap:10px;flex-wrap:wrap;position:relative;z-index:2"><a href="#/contact" class="btn btn-gold">${ic('chat')} WhatsApp us</a><button class="btn btn-ghost" data-toast="Lookbook will be shared on WhatsApp">${ic('dl')} Lookbook</button></div></div>`;
}
function byobSteps(){
  return `<div class="byob-step"><h4><span class="n">1</span>Choose a box</h4><div class="opt-grid">${BOXES.map(b=>`<button class="opt ${byob.box===b.id?'on':''}" data-box="${b.id}"><div class="mini">${art(b.type,b.body)}</div><b>${b.name}</b><small>${inr(b.price)}</small></button>`).join('')}</div></div>
  <div class="byob-step"><h4><span class="n">2</span>Fill it <small class="muted" style="font-family:var(--sans);font-size:15px;font-weight:400">(up to 4)</small></h4><div class="opt-grid">${FILL.map(f=>`<button class="opt ${byob.items.includes(f.id)?'on':''}" data-fill="${f.id}"><div class="mini">${art(f.t,f.b,f.l)}</div><b>${f.name}</b><small>${inr(f.price)}</small></button>`).join('')}</div></div>
  <div class="byob-step"><h4><span class="n">3</span>Personalise</h4><div class="fgrid">
    <div class="field"><label>Names on the tag</label><input class="inp" id="bNames" maxlength="28" placeholder="Ritika & Arjun" value="${byob.names}"></div>
    <div class="field"><label>Ceremony</label><select class="inp" id="bCer">${['Haldi','Mehendi','Sangeet','Wedding','Reception','Bridesmaids'].map(c=>`<option ${byob.cer===c?'selected':''}>${c}</option>`).join('')}</select></div>
    <div class="field full"><label>Note for guests</label><input class="inp" id="bNote" maxlength="60" placeholder="Thank you for blessing us" value="${byob.note}"></div>
    <div class="field"><label>Quantity (min 25)</label><div class="qty-ctl"><button type="button" data-bq="-25">${ic('minus')}</button><span id="bQty">${byob.qty}</span><button type="button" data-bq="25">${ic('plus')}</button></div></div>
  </div></div>`;
}
function byobPreview(){
  const b=BOXES.find(x=>x.id===byob.box), items=FILL.filter(f=>byob.items.includes(f.id));
  const per=b.price+items.reduce((s,f)=>s+f.price,0), disc=byob.qty>=200?.15:byob.qty>=100?.1:byob.qty>=50?.05:0, tot=per*byob.qty*(1-disc);
  return `<span class="eyebrow">${byob.cer} favour</span><div class="box-art">${art(b.type,b.body)}</div>
  <div class="names foil">${byob.names||'Your names here'}</div><div class="note">${byob.note||'Your note for guests'}</div>
  <div class="lines"><div><span>${b.name}</span><span>${inr(b.price)}</span></div>${items.map(f=>`<div><span>${f.name}</span><span>${inr(f.price)}</span></div>`).join('')||'<div><span class="muted">Add items</span><span></span></div>'}
  <div><span>Per box \u00D7 ${byob.qty}</span><span>${inr(per*byob.qty)}</span></div>${disc?`<div style="color:var(--gold-l)"><span>Volume saving ${disc*100}%</span><span>\u2212${inr(per*byob.qty*disc)}</span></div>`:''}
  <div class="tot"><span>Estimate</span><span>${inr(tot)}</span></div></div>
  <div style="display:grid;gap:10px;margin-top:20px"><button class="btn btn-gold btn-block" data-toast="Quote request sent. Our wedding concierge will WhatsApp you.">Request quote</button><button class="btn btn-ghost btn-block" data-sample>Order 1 sample box \u00B7 ${inr(per)}</button></div>`;
}

/* ---- Corporate ---- */
function Corporate(){
  const cp=P.filter(p=>p.cat==='corporate');
  return `
  <div style="margin-top:48px">
    <div class="sec-head reveal"><div><span class="eyebrow">Occasions</span><h2>Gifts people actually use.</h2></div><p class="lead" style="max-width:40ch">Skin and hair rituals instead of another diary. Every box can carry your logo.</p></div>
    <div class="occasions">${[['spark','Diwali & festive','Our busiest season, book by September.'],['users','Employee welcome kits','First-day boxes with your brand.'],['heart','Client thank-you','For partners who deserve better than mithai.'],['award','Rewards & milestones','Work anniversaries, top performers.'],['cal','Events & offsites','Conference kits and speaker gifts.']].map(o=>`<div class="occ reveal">${ic(o[0])}<b>${o[1]}</b><small>${o[2]}</small></div>`).join('')}</div>
  </div>
  <div style="margin-top:80px">
    <div class="sec-head reveal"><div><span class="eyebrow">Curated hampers</span><h2>Three tiers, endlessly customisable.</h2></div></div>
    <div class="tiers">${cp.map((p,i)=>`<div class="tier reveal ${i===1?'hot':''}">${i===1?'<span class="ribbon">Most gifted</span>':''}<div class="tart">${art(p.type,i===1?'#022F31':p.body)}</div><h3>${p.name.replace(' Gift Box','').replace(' Wellness Hamper','').replace(' Ritual Trunk','')}</h3><div class="p">${inr(p.price)} <small>per box</small></div><ul>${p.ingr.map(x=>`<li>${ic('check')}${x}</li>`).join('')}</ul><button class="btn ${i===1?'btn-gold':'btn-ghost'}" style="margin-top:auto" data-scroll="corpForm" data-tier="${p.name}">Request this</button></div>`).join('')}</div>
  </div>
  <div class="grid g2" style="margin-top:80px;gap:28px;align-items:start">
    <div class="card reveal"><span class="eyebrow">Volume pricing</span><h3 style="font-size:36px;margin:10px 0 18px">The more you gift, the less you pay.</h3>
      <div class="table-scroll"><table class="vol"><thead><tr><th>Quantity</th><th>Saving</th><th>Extras</th></tr></thead><tbody>
      <tr><td>25 to 99</td><td><b>5%</b></td><td>Custom note card</td></tr><tr><td>100 to 499</td><td><b>10%</b></td><td>+ Logo sleeve, free</td></tr><tr><td>500+</td><td><b>15%</b></td><td>+ Custom box & account manager</td></tr></tbody></table></div></div>
    <div class="card reveal"><span class="eyebrow">Make it yours</span><h3 style="font-size:36px;margin:10px 0 18px">Co-branding options.</h3>
      <div style="display:grid;gap:16px">${[['box','Logo sleeve or foil stamp','Your logo on the box, in gold or your brand colour.'],['file','Custom message card','Printed note from your leadership team.'],['gift','Brand-colour ribbon & tissue','Matched to your palette.'],['truck','Multi-address delivery','Upload a sheet, we ship to every employee\u2019s door.']].map(b=>`<div style="display:flex;gap:14px"><div style="width:44px;height:44px;border-radius:50%;background:var(--sage);color:var(--teal);display:grid;place-items:center;flex:none">${ic(b[0])}</div><div><b style="font-weight:500;color:var(--teal)">${b[1]}</b><div class="muted" style="font-size:15px">${b[2]}</div></div></div>`).join('')}</div></div>
  </div>
  <div style="margin-top:80px">
    <div class="sec-head reveal"><div><span class="eyebrow">How it works</span><h2>Brief to doorstep in about 3 weeks.</h2></div></div>
    <div class="process">${[['Share your brief','Occasion, quantity, budget, date.'],['Curation & sample','We send a physical sample in 5 days.'],['Approve artwork','Logo, sleeve and card proofs.'],['Production','Hand-packed in small batches.'],['Pan-India delivery','To one office or 500 homes.']].map(s=>`<div class="proc reveal"><b>${s[0]}</b><span>${s[1]}</span></div>`).join('')}</div>
  </div>
  <div class="grid" style="grid-template-columns:minmax(0,1fr) minmax(0,1.3fr);gap:48px;margin-top:80px" id="corpForm">
    <div class="reveal"><span class="eyebrow">Corporate enquiry</span><h2 style="font-size:clamp(38px,5vw,56px);margin:12px 0 14px">Tell us about your gifting.</h2><p class="lead">A gifting specialist replies within one working day with a proposal and catalogue.</p>
      <button class="btn btn-ghost" style="margin-top:22px" data-toast="Catalogue PDF will be emailed to you">${ic('dl')} Download catalogue</button></div>
    <form class="card reveal" data-form="corp" style="background:#fff"><div class="fgrid">
      <div class="field"><label>Company</label><input class="inp" required placeholder="Company name"></div>
      <div class="field"><label>Your name</label><input class="inp" required placeholder="Full name"></div>
      <div class="field"><label>Work email</label><input class="inp" type="email" required placeholder="you@company.com"></div>
      <div class="field"><label>Phone</label><input class="inp" type="tel" required placeholder="+91"></div>
      <div class="field"><label>Occasion</label><select class="inp"><option>Diwali & festive</option><option>Employee welcome kits</option><option>Client thank-you</option><option>Rewards & milestones</option><option>Events & offsites</option></select></div>
      <div class="field"><label>Hamper</label><select class="inp" id="tierSel"><option>Not sure yet</option>${cp.map(p=>`<option>${p.name}</option>`).join('')}</select></div>
      <div class="field"><label>Quantity</label><select class="inp"><option>25 to 99</option><option>100 to 499</option><option>500+</option></select></div>
      <div class="field"><label>Needed by</label><input class="inp" type="date"></div>
      <div class="field full"><label>Branding & notes</label><textarea class="inp" placeholder="Logo on box, message card, delivery to multiple cities\u2026"></textarea></div>
      <div class="full"><button class="btn btn-teal btn-block" type="submit">Send enquiry ${ic('arrow')}</button></div>
    </div></form>
  </div>`;
}

/* ============ PRODUCT ============ */
function Product(id){
  const p=byId(id); if(!p)return NotFound();
  const rel=P.filter(x=>x.cat===p.cat&&x.id!==p.id).slice(0,4);
  const back=p.cat==='wedding'?'#/shop/wedding':p.cat==='corporate'?'#/shop/corporate':'#/shop';
  return `<section class="sec" style="padding-top:36px"><div class="wrap">
    <div class="crumbs" style="color:var(--muted);margin-bottom:22px"><a href="#/">Home</a><span>/</span><a href="${back}">Shop</a><span>/</span><span>${p.name}</span></div>
    <div class="pd">
      <div class="pd-art ${tint(p)}">${art(p.type,p.body,p.label)}</div>
      <div>
        ${p.tag?`<span class="eyebrow">${p.tag}</span>`:''}
        <h1>${p.name}</h1>
        <div class="meta" style="display:flex;gap:10px;align-items:center;color:var(--muted)">${stars(p.rating)} <span>${p.rating} · ${p.rev} reviews</span></div>
        <p class="lead" style="margin:18px 0">${p.short}</p>
        <div class="price" style="font-size:28px;font-family:var(--serif)">${inr(p.price)}${p.mrp?`<s>${inr(p.mrp)}</s>`:''} <small class="muted" style="font-family:var(--sans);font-size:14px;font-weight:400">incl. taxes</small></div>
        <div style="margin:22px 0 10px" class="muted">Size</div>
        <div class="sizes chips" data-chipgroup="size">${p.sizes.map((s,i)=>`<button class="chip ${i===0?'on':''}" data-chip="${s}">${s}</button>`).join('')}</div>
        <div style="display:flex;gap:12px;margin:26px 0;flex-wrap:wrap">
          <div class="qty-ctl"><button data-pq="-1">${ic('minus')}</button><span id="pq">1</span><button data-pq="1">${ic('plus')}</button></div>
          <button class="btn btn-teal" style="flex:1;min-width:200px" data-addpd="${p.id}">${ic('bag')} Add to bag</button>
        </div>
        <div class="card" style="display:flex;gap:14px;align-items:center;padding:18px;background:var(--sage);border:0"><div style="width:46px;height:46px;border-radius:50%;background:var(--teal);color:var(--gold-l);display:grid;place-items:center;flex:none">${ic('steth')}</div><div style="flex:1"><b style="font-weight:500;color:var(--teal)">Not sure it\u2019s right for you?</b><div class="muted" style="font-size:15px">Ask a dermatologist on video, from ₹499.</div></div><a href="#/consult" class="link">Consult</a></div>
        <div style="margin-top:26px">
          ${acc('Key ingredients',`<div class="ingr">${p.ingr.map(x=>`<span>${x}</span>`).join('')}</div>`,true)}
          ${acc('How to use',p.use)}
          ${acc('Free from','Parabens, sulphates, mineral oil, synthetic fragrance and animal testing.')}
          ${acc('Shipping & returns','Ships in 24 hours. Free above ₹999. Easy returns on unopened products within 7 days.')}
        </div>
      </div>
    </div>
    ${rel.length?`<div class="sec-head" style="margin-top:96px"><div><span class="eyebrow">Pairs well with</span><h2>Complete the ritual</h2></div></div><div class="grid g4">${rel.map(pcard).join('')}</div>`:''}
  </div></section>`;
}
