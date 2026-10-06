/* ============ SHARED BITS ============ */
const pcard=p=>`<article class="pcard reveal">
  <a href="#/product/${p.id}" class="art ${tint(p)}">${p.tag?`<span class="tag ${p.cat==='wedding'||p.cat==='corporate'||p.cat==='kits'?'gold':''}">${p.tag}</span>`:''}${art(p.type,p.body,p.label)}</a>
  <div class="body">
    <div class="meta">${stars(p.rating)} <span>${p.rating} (${p.rev})</span></div>
    <h3><a href="#/product/${p.id}">${p.name}</a></h3>
    <div class="row"><span class="price">${inr(p.price)}${p.mrp?`<s>${inr(p.mrp)}</s>`:''}</span><button class="add" data-add="${p.id}" aria-label="Add ${p.name} to bag">${ic('plus')}</button></div>
  </div></article>`;
const jcard=(a,i)=>`<article class="jcard reveal" data-go="#/journal/${a.id}"><div class="jart">${jart(a.cat,i+1)}</div><div class="jmeta"><b>${a.cat}</b><span>${a.read} min read</span></div><h3>${a.title}</h3><p>${a.ex}</p></article>`;
const acc=(q,a,open=false)=>`<div class="acc ${open?'open':''}"><button data-acc>${q}${ic('down')}</button><div class="acc-bd"><div>${a}</div></div></div>`;
const phero=(eb,h,lead,crumb,extra='')=>`<section class="phero"><div class="wrap"><div class="crumbs"><a href="#/">Home</a><span>/</span><span>${crumb}</span></div><h1>${h}</h1><p class="lead">${lead}</p>${extra}</div></section>`;

/* ============ HOME ============ */
function Home(){
  const best=['kesar-elixir','bhringraj-oil','haldi-ubtan','saffron-cream','neem-wash','methi-serum'].map(byId);
  return `
  <section class="hero">
    <div class="hero-in">
      <div class="hero-copy">
        <span class="eyebrow">Ayurvedic skin & hair care</span>
        <h1>Care, the way <em>nature</em> intended.</h1>
        <p class="lead">Plant-led formulas for skin and hair, developed with dermatologists and made in small batches.</p>
        <div class="hero-cta"><a href="#/shop" class="btn btn-gold">Shop the collection</a><a href="#/consult" class="btn btn-ghost">Consult a doctor</a></div>
        <div class="hero-facts"><div><b>100%</b><span>Plant-led actives</span></div><div><b>3</b><span>In-house doctors</span></div><div><b>₹499</b><span>Video consult</span></div></div>
      </div>
      <div class="hero-stage">
        <div class="light-sweep"></div>
        <svg class="ring" viewBox="0 0 500 500" aria-hidden="true"><circle cx="250" cy="250" r="238"/></svg>
        <div class="plinth"></div>
        <div class="hero-products"><div class="hp">${art('oil','#5E7F4E','Bhringraj')}</div><div class="hp">${art('dropper','#7A4A22','Kesar')}</div><div class="hp">${art('jar','#EFE6D4','Saffron')}</div></div>
        <div class="hero-caption"><a href="#/product/kesar-elixir">Kesar Glow Face Elixir</a><span>₹1,250</span></div>
      </div>
    </div>
  </section>

  <section class="sec"><div class="wrap"><div class="statement reveal">
    <span class="eyebrow">Our philosophy</span>
    <p>Saffron from Pampore, rose from Kannauj, bhringraj slow-cooked for seven days. <em>Old remedies, held to a clinic\u2019s standard.</em></p>
  </div></div></section>

  <section class="sec" style="padding-top:0"><div class="wrap">
    <div class="sec-head reveal"><div><span class="eyebrow">Bestsellers</span><h2>The essentials</h2></div><a href="#/shop" class="link">Shop all ${ic('arrow')}</a></div>
    <div class="rail">${best.map(pcard).join('')}</div>
  </div></section>

  <section class="sec" style="padding-top:0"><div class="wrap">
    <div class="sec-head reveal"><div><span class="eyebrow">Shop by concern</span><h2>Begin with what you see in the mirror.</h2></div><a href="#/consult" class="link">Ask a doctor ${ic('arrow')}</a></div>
    <div class="concerns reveal">${CONCERNS.map(c=>`<a href="#/shop?concern=${c.id}" class="concern"><div><b>${c.name}</b><small>${c.sub}</small></div>${ic('arrow')}</a>`).join('')}<a href="#/consult" class="concern"><div><b>Not sure?</b><small>A 20-minute consult with a dermatologist</small></div>${ic('arrow')}</a></div>
  </div></section>

  <section class="sec" style="padding-top:0"><div class="wrap">
    <div class="feature reveal">
      <div class="fx on-dark" style="background:var(--teal)">
        <span class="eyebrow">Kudarat Consult</span>
        <h2>A doctor in your corner, not just a cart.</h2>
        <div class="steps">
          <div class="step"><span class="n">i.</span><div><b>Tell us your concern</b><span>Two minutes and a few photos.</span></div></div>
          <div class="step"><span class="n">ii.</span><div><b>Meet a specialist on video</b><span>Dermatologist or trichologist, 20 minutes.</span></div></div>
          <div class="step"><span class="n">iii.</span><div><b>Receive your regimen</b><span>Saved to your account, refilled in one tap.</span></div></div>
        </div>
        <div><a href="#/consult" class="btn btn-gold">Book a consult · ₹499</a></div>
      </div>
      <div class="doc-visual"><figure class="portrait"><span class="ini">AM</span><figcaption><b>Dr. Aanya Mehta</b><span>MD Dermatology · 11 years</span></figcaption></figure></div>
    </div>
  </div></section>

  <section class="sec" style="padding-top:0"><div class="wrap">
    <div class="sec-head reveal"><div><span class="eyebrow">Gifting</span><h2>For the big days, and everyone in them.</h2></div></div>
    <div class="gift-tiles">
      <a href="#/shop/wedding" class="gtile wed reveal"><div class="gart">${art('trunk','#3E121B','')}</div><span class="eyebrow">Wedding</span><h3>Bridal plans, favours & trousseau</h3><p>A 90-day glow plan for the bride, and personalised favours for every ceremony.</p><span class="link">Explore wedding ${ic('arrow')}</span></a>
      <a href="#/shop/corporate" class="gtile corp reveal"><div class="gart">${art('box','#082F30','')}</div><span class="eyebrow">Corporate</span><h3>Co-branded gifts for teams & clients</h3><p>Festive hampers and welcome kits from 25 boxes, shipped to every address.</p><span class="link">Explore corporate ${ic('arrow')}</span></a>
    </div>
  </div></section>

  <section class="sec" style="padding-top:0"><div class="wrap">
    <div class="sec-head reveal"><div><span class="eyebrow">Kudarat Care Journal</span><h2>Read before you apply.</h2></div><a href="#/journal" class="link">All articles ${ic('arrow')}</a></div>
    <div class="grid g3">${ARTICLES.slice(0,3).map(jcard).join('')}</div>
  </div></section>

  <section class="sec" style="padding-top:0"><div class="wrap">
    <div class="sec-head reveal"><div><span class="eyebrow">In their words</span><h2>From people who switched.</h2></div></div>
    <div class="quotes">
      ${[['My pigmentation finally faded after the consult. Dr. Mehta changed two things and it worked.','Priya S.','Ahmedabad · Kesar Elixir'],['We ordered 180 haldi potlis for our wedding. Every guest asked where they were from.','Ritika & Arjun','Jaipur · Wedding favours'],['We moved our Diwali gifting to KudaratCare. The co-branded boxes felt genuinely premium.','Neha K.','HR Lead, Mumbai · Corporate']].map(q=>`<figure class="quote reveal"><p>\u201C${q[0]}\u201D</p><figcaption class="who"><b>${q[1]}</b><small>${q[2]}</small></figcaption></figure>`).join('')}
    </div>
  </div></section>

  <section class="sec" style="padding-top:0"><div class="wrap">
    <div class="news on-dark reveal"><div><span class="eyebrow">The Kudarat letter</span><h2>Seasonal rituals, once a month.</h2><p class="lead" style="margin-top:12px">And 10% off your first order.</p></div>
    <form class="inline-form" data-form="news"><input type="email" required placeholder="Your email address" aria-label="Email"><button class="btn" type="submit">Subscribe ${ic('arrow')}</button></form></div>
  </div></section>`;
}

/* ============ CONSULT ============ */
function Consult(){
  const today=new Date().toISOString().slice(0,10);
  const slots=['10:00 AM','11:30 AM','1:00 PM','4:00 PM','5:30 PM','7:00 PM'];
  return phero('Kudarat Consult','Talk to a skin & hair <em class="foil">doctor</em>.','Video or in-clinic consults with dermatologists and trichologists. A regimen made for you, not for everyone.','Consult',`<div class="hero-cta"><a href="#book" class="btn btn-gold" data-scroll="book">Book a consult</a><span class="muted" style="align-self:center;font-size:15px">20 minutes · from ₹499</span></div>`)+`
  <section class="sec"><div class="wrap">
    <div class="sec-head reveal"><div><span class="eyebrow">How it works</span><h2>From concern to regimen in a day.</h2></div></div>
    <div class="process">
      ${[['Pick a concern','Skin, hair or scalp. Add photos if you like.'],['Choose a doctor','See languages, focus areas and next slot.'],['Meet on video','20 minutes, from your phone. No app download.'],['Get your regimen','Saved to your account with dosage and timing.'],['Free follow-up','Check in within 14 days at no cost.']].map(s=>`<div class="proc reveal"><b>${s[0]}</b><span>${s[1]}</span></div>`).join('')}
    </div>
  </div></section>

  <section class="sec" style="padding-top:0"><div class="wrap">
    <div class="sec-head reveal"><div><span class="eyebrow">Our doctors</span><h2>Specialists, not chatbots.</h2></div></div>
    <div class="grid g3 docs">${DOCTORS.map(d=>`<div class="card reveal" style="display:flex;flex-direction:column;gap:14px">
      <div style="display:flex;gap:16px;align-items:center"><div class="avatar" style="width:72px;height:72px;font-size:28px;border:1.5px solid var(--gold)">${d.ini}</div><div><h3 style="font-size:28px">${d.name}</h3><div class="muted" style="font-size:15px">${d.role} · ${d.exp}</div></div></div>
      <div style="font-size:15px;display:grid;gap:6px"><div><span class="muted">Focus:</span> ${d.focus}</div><div><span class="muted">Speaks:</span> ${d.lang}</div></div>
      <div style="display:flex;justify-content:space-between;align-items:center;margin-top:auto;padding-top:12px;border-top:1px solid var(--line-2)"><span style="font-size:14px;color:var(--gold-d);font-weight:500">${ic('clock')} Next: ${d.next}</span><button class="btn btn-teal btn-sm" data-pickdoc="${d.id}">Book</button></div></div>`).join('')}</div>
  </div></section>

  <section class="sec" style="padding-top:0"><div class="wrap">
    <div class="sec-head reveal"><div><span class="eyebrow">Consult types</span><h2>Pick what suits you.</h2></div></div>
    <div class="tiers">
      ${[['Video consult','₹499','20 min',['Dermatologist or trichologist','Digital regimen in your account','Free follow-up within 14 days'],'video'],['In-clinic visit','₹799','30 min',['Skin & scalp analysis','Patch test if needed','Regimen + product samples'],'pin',true],['Bridal skin program','₹4,999','3 sessions',['Starts 90 days before the wedding','Doctor-timed regimen','Final-week check-in'],'rings']].map(t=>`<div class="tier reveal ${t[5]?'hot':''}">${t[5]?'<span class="ribbon">Most booked</span>':''}<div class="tier-ic">${ic(t[4])}</div><h3>${t[0]}</h3><div class="p">${t[1]} <small>/ ${t[2]}</small></div><ul>${t[3].map(x=>`<li>${ic('check')}${x}</li>`).join('')}</ul><a href="#book" data-scroll="book" class="btn ${t[5]?'btn-gold':'btn-ghost'}" style="margin-top:auto" data-picktype="${t[0]}">Choose</a></div>`).join('')}
    </div>
  </div></section>

  <section class="sec" id="book" style="background:var(--paper)"><div class="wrap">
    <div class="grid" style="grid-template-columns:minmax(0,1fr) minmax(0,1.3fr);gap:48px" id="bookGrid">
      <div class="reveal"><span class="eyebrow">Book now</span><h2 style="font-size:clamp(38px,5vw,56px);margin:12px 0 14px">Reserve your slot.</h2><p class="lead">Pay at the end of the consult. Reschedule free up to 2 hours before.</p>
        <div style="margin-top:28px">${acc('Is my data private?','Your photos and notes are visible only to your doctor and are never used for marketing.',true)}${acc('Do I have to buy products?','No. Your doctor may suggest KudaratCare products, but prescriptions are always your choice.')}${acc('What if I need medicine?','Our doctors can prescribe where clinically appropriate. You\u2019ll get a digital prescription.')}${acc('Can I consult in Hindi or Gujarati?','Yes. Pick a doctor who speaks your language.')}</div>
      </div>
      <form class="card reveal" data-form="consult" style="background:#fff">
        <div class="fgrid">
          <div class="field"><label>Concern</label><select class="inp" name="concern" required><option value="">Select</option>${CONCERNS.map(c=>`<option>${c.name}</option>`).join('')}<option>Bridal skin prep</option><option>Something else</option></select></div>
          <div class="field"><label>Doctor</label><select class="inp" name="doctor" id="docSel"><option>First available</option>${DOCTORS.map(d=>`<option value="${d.name}">${d.name}</option>`).join('')}</select></div>
          <div class="field full"><label>Consult type</label><div class="chips" data-chipgroup="type">${['Video consult','In-clinic visit','Bridal skin program'].map((t,i)=>`<button type="button" class="chip ${i===0?'on':''}" data-chip="${t}">${t}</button>`).join('')}</div></div>
          <div class="field"><label>Date</label><input class="inp" type="date" name="date" min="${today}" value="${today}" required></div>
          <div class="field"><label>Your name</label><input class="inp" name="name" required placeholder="Full name"></div>
          <div class="field full"><label>Time</label><div class="chips" data-chipgroup="slot">${slots.map((s,i)=>`<button type="button" class="chip ${i===4?'on':''}" data-chip="${s}">${s}</button>`).join('')}</div></div>
          <div class="field"><label>Phone (WhatsApp)</label><input class="inp" name="phone" type="tel" required placeholder="+91"></div>
          <div class="field"><label>Photos (optional)</label><label class="inp" style="display:flex;align-items:center;gap:10px;cursor:pointer;color:var(--muted)">${ic('up')} <span id="fileLbl">Upload up to 3</span><input type="file" accept="image/*" multiple hidden data-file></label></div>
          <div class="field full"><label>Anything we should know?</label><textarea class="inp" name="notes" placeholder="Current products, allergies, how long you\u2019ve had this concern"></textarea></div>
          <div class="full"><button class="btn btn-teal btn-block" type="submit">Confirm booking ${ic('arrow')}</button></div>
        </div>
      </form>
    </div>
  </div></section>`;
}
/* ============ JOURNAL ============ */
let jcat='All';
function Journal(){
  const cats=['All',...new Set(ARTICLES.map(a=>a.cat))];
  const f=ARTICLES[0];
  return phero('Journal','Kudarat Care <em class="foil">Journal</em>','Notes on skin, hair and the plants that care for them. Written and reviewed by our doctors.','Journal')+`
  <section class="sec"><div class="wrap">
    <article class="feature reveal" style="min-height:440px;cursor:pointer;background:var(--paper);border:1px solid var(--line-2)" data-go="#/journal/${f.id}">
      <div style="min-height:300px">${jart(f.cat,1)}</div>
      <div class="fx"><span class="eyebrow">Featured · ${f.cat}</span><h2 style="font-size:clamp(34px,4vw,52px)">${f.title}</h2><p class="lead">${f.ex}</p><div class="muted" style="font-size:15px">${f.by} · ${f.read} min read</div><span class="link" style="align-self:flex-start">Read the article ${ic('arrow')}</span></div>
    </article>
    <div class="chips" style="margin:56px 0 30px" data-jcats>${cats.map(c=>`<button class="chip ${jcat===c?'on':''}" data-jcat="${c}">${c}</button>`).join('')}</div>
    <div class="grid g3" id="jgrid">${jgrid()}</div>
  </div></section>`;
}
const jgrid=()=>ARTICLES.slice(1).filter(a=>jcat==='All'||a.cat===jcat).map((a,i)=>jcard(a,i+2)).join('')||'<p class="muted">More articles coming soon.</p>';
function Article(id){
  const a=ARTICLES.find(x=>x.id===id); if(!a)return NotFound();
  const i=ARTICLES.indexOf(a), more=ARTICLES.filter(x=>x.id!==id).slice(0,3);
  const prods=a.cat==='Hair'||a.id==='bhringraj'||a.id==='oiling'?['bhringraj-oil','methi-serum']:a.cat==='Bridal'?['bride-plan','haldi-ubtan']:['kesar-elixir','neem-wash'];
  return `<section class="sec" style="padding-top:40px"><div class="wrap">
    <div class="article">
      <div class="crumbs" style="color:var(--muted)"><a href="#/journal">Journal</a><span>/</span><span>${a.cat}</span></div>
      <h1 style="font-size:clamp(40px,6vw,72px);margin:18px 0">${a.title}</h1>
      <div style="display:flex;gap:12px;align-items:center;margin-bottom:30px"><div class="avatar" style="width:46px;height:46px;font-size:18px;border:1.5px solid var(--gold)">${a.by.split(' ').slice(1).map(x=>x[0]).join('')}</div><div style="font-size:15px"><b style="font-weight:500">${a.by}</b><div class="muted">${a.date} · ${a.read} min read</div></div></div>
    </div>
    <div style="border-radius:28px;overflow:hidden;aspect-ratio:21/9;max-height:460px;margin-bottom:48px">${jart(a.cat,i+1)}</div>
    <div class="article"><div class="body">
      <p>${a.intro}</p>
      <h3>What actually helps</h3>
      <ul>${a.pts.map(x=>`<li>${x}</li>`).join('')}</ul>
      <blockquote>${a.quote}</blockquote>
      <p>Every skin and scalp is different, so treat this as a starting point. If something isn\u2019t improving after six to eight weeks, it\u2019s worth a conversation with a doctor rather than another new product.</p>
      <div class="card" style="background:var(--teal);color:var(--paper);display:flex;gap:18px;align-items:center;flex-wrap:wrap;border:0;margin:36px 0"><div style="flex:1;min-width:220px"><b class="serif" style="font-size:28px;font-weight:600;display:block;line-height:1.1">Want advice for your skin?</b><span style="opacity:.75">20-minute video consult with ${a.by}.</span></div><a href="#/consult" class="btn btn-gold">Book · ₹499</a></div>
      <h3>Mentioned in this article</h3>
      <div class="grid g2" style="margin-bottom:20px">${prods.map(byId).map(pcard).join('')}</div>
    </div></div>
    <div class="sec-head" style="margin-top:80px"><div><span class="eyebrow">Keep reading</span><h2>More from the Journal</h2></div></div>
    <div class="grid g3">${more.map((x)=>jcard(x,ARTICLES.indexOf(x)+1)).join('')}</div>
  </div></section>`;
}

/* ============ ABOUT ============ */
function About(){
  return phero('About','Kudarat means <em class="foil">nature</em>.','And care means doing right by it. We make skin and hair care from plants India has trusted for centuries, and we check our work with doctors.','About us')+`
  <section class="sec"><div class="wrap">
    <div class="grid g2" style="gap:64px;align-items:center">
      <div class="reveal" style="position:relative;aspect-ratio:1;max-width:480px;width:100%;justify-self:center;display:grid;place-items:center">
        <svg viewBox="0 0 500 500" style="position:absolute;inset:0;width:100%;height:100%"><circle cx="250" cy="250" r="236" fill="var(--paper)" stroke="url(#kcfoil)" stroke-width="2.5"/><circle cx="250" cy="250" r="218" fill="none" stroke="url(#kcfoil)" stroke-width="1" opacity=".6"/></svg>
        <span class="lg-mono" role="img" aria-label="KudaratCare monogram" style="width:58%;position:relative"></span>
      </div>
      <div class="reveal"><span class="eyebrow">Our story</span><h2 style="font-size:clamp(38px,5vw,60px);margin:12px 0 20px">Grandmother\u2019s recipes, a doctor\u2019s rigour.</h2>
        <p class="lead" style="margin-bottom:16px">KudaratCare began with a simple frustration: natural products that didn\u2019t work, and clinical ones that felt cold. We wanted both: the ubtan and bhringraj of our homes, held to the standards of a dermatology clinic.</p>
        <p class="lead">Today every formula is developed with our doctors, made in small batches, and backed by a real consultation if you need one.</p>
        <a href="#/consult" class="link" style="margin-top:22px">Meet our doctors ${ic('arrow')}</a></div>
    </div>
  </div></section>
  <section class="sec" style="padding-top:0"><div class="wrap">
    <div class="sec-head reveal"><div><span class="eyebrow">What we believe</span><h2>Four promises on every label.</h2></div></div>
    <div class="values">${[['Plants first','The hero ingredient is listed first, in a dose that does something.'],['Doctor-checked','Every formula is reviewed and tested by dermatologists.'],['Honest labels','No parabens, sulphates or mystery fragrance. Ever.'],['Small batches','Made fresh, so oils and botanicals stay potent.']].map(v=>`<div class="val reveal"><h4>${v[0]}</h4><p>${v[1]}</p></div>`).join('')}</div>
  </div></section>
  <section class="sec on-dark" style="background:var(--teal)"><div class="wrap">
    <div class="sec-head reveal"><div><span class="eyebrow">Where it comes from</span><h2>Sourced from across India.</h2></div><p class="lead" style="max-width:40ch">We buy directly from growers wherever we can.</p></div>
    <div class="origins reveal">${[['Saffron','Pampore, Kashmir','Hand-picked crocus stigmas.'],['Rose','Kannauj, Uttar Pradesh','Steam-distilled the traditional way.'],['Bhringraj','Kerala','Slow-cooked in sesame for seven days.'],['Turmeric','Erode, Tamil Nadu','Wild Kasturi haldi, non-staining.'],['Sandalwood','Mysuru, Karnataka','Sustainably sourced heartwood.'],['Neem','Rajasthan','Cold-pressed from village co-ops.']].map(o=>`<div class="origin"><small>${o[1]}</small><b>${o[0]}</b><span>${o[2]}</span></div>`).join('')}</div>
  </div></section>
  <section class="sec"><div class="wrap">
    <div class="seal reveal">${[['shield','Dermatologist-tested'],['leaf','Paraben & sulphate free'],['heart','Cruelty free'],['flask','Small-batch made']].map(s=>`<div>${ic(s[0])}${s[1]}</div>`).join('')}</div>
    <div style="text-align:center;margin-top:64px" class="reveal"><h2 style="font-size:clamp(34px,4vw,52px);margin-bottom:22px">Start with what your skin needs.</h2><div class="hero-cta" style="justify-content:center"><a href="#/shop" class="btn btn-teal">Shop the range</a><a href="#/consult" class="btn btn-ghost">Consult a doctor</a></div></div>
  </div></section>`;
}

/* ============ CONTACT ============ */
function Contact(){
  return phero('Contact','We\u2019re <em class="foil">listening</em>.','Questions about an order, a product or gifting? Write to us, or just say hi on WhatsApp.','Contact')+`
  <section class="sec"><div class="wrap"><div class="cgrid">
    <div class="cinfo">
      ${[['chat','WhatsApp','+91 00000 00000 · replies in minutes'],['mail','Email','hello@kudaratcare.com'],['phone','Call','Mon to Sat, 10 AM to 7 PM'],['pin','Visit the clinic','Address to be shared by client']].map(c=>`<a href="#/contact" class="ci-item reveal"><div class="ico">${ic(c[0])}</div><div><b>${c[1]}</b><span>${c[2]}</span></div></a>`).join('')}
      <div class="map reveal"><svg viewBox="0 0 400 260" preserveAspectRatio="xMidYMid slice" style="width:100%;height:100%"><rect width="400" height="260" fill="#E4E9E3"/><path d="M0 180 Q120 150 200 170 T400 140" stroke="#fff" stroke-width="14" fill="none"/><path d="M90 0 L140 260" stroke="#fff" stroke-width="10"/><path d="M260 0 Q280 120 330 260" stroke="#fff" stroke-width="8"/><path d="M0 70 L400 90" stroke="#fff" stroke-width="6"/><rect x="160" y="30" width="70" height="40" rx="6" fill="#D3DED6"/><rect x="290" y="170" width="80" height="50" rx="6" fill="#D3DED6"/><circle cx="210" cy="118" r="34" fill="none" stroke="url(#kcfoil)" stroke-width="2"/><circle cx="210" cy="118" r="12" fill="#04484A"/><circle cx="210" cy="118" r="4" fill="#E2C277"/></svg></div>
    </div>
    <form class="card reveal" data-form="contact" style="background:#fff"><h3 style="font-size:34px;margin-bottom:6px">Send a message</h3><p class="muted" style="margin-bottom:20px">We reply within one working day.</p><div class="fgrid">
      <div class="field"><label>Name</label><input class="inp" required placeholder="Full name"></div>
      <div class="field"><label>Phone</label><input class="inp" type="tel" placeholder="+91"></div>
      <div class="field full"><label>Email</label><input class="inp" type="email" required placeholder="you@email.com"></div>
      <div class="field full"><label>Topic</label><div class="chips" data-chipgroup="topic">${['Order help','Products','Consultation','Wedding gifting','Corporate gifting','Other'].map((t,i)=>`<button type="button" class="chip ${i===0?'on':''}" data-chip="${t}">${t}</button>`).join('')}</div></div>
      <div class="field full"><label>Message</label><textarea class="inp" required placeholder="How can we help?"></textarea></div>
      <div class="full"><button class="btn btn-teal btn-block" type="submit">Send message ${ic('arrow')}</button></div>
    </div></form>
  </div>
  <div style="max-width:820px;margin:96px auto 0"><div class="sec-head reveal" style="justify-content:center;text-align:center"><div><span class="eyebrow">FAQ</span><h2>Quick answers</h2></div></div>
    ${acc('How long does delivery take?','Metro cities: 2 to 3 days. Rest of India: 4 to 6 days. Free shipping above ₹999.',true)}${acc('Are your products suitable for sensitive skin?','Most are, and all are dermatologist-tested. If you\u2019re unsure, book a quick consult first.')}${acc('Can I return a product?','Unopened products can be returned within 7 days. Opened products are replaced if they cause a reaction.')}${acc('How early should I order wedding favours?','Four weeks ahead for up to 200 pieces; six weeks for larger orders.')}${acc('Do you offer GST invoices for corporate orders?','Yes, every corporate order comes with a GST invoice.')}
  </div></div></section>`;
}

/* ============ AUTH (mirrors Dr. Doshi flow) ============ */
let authMode='login';
function Login(){
  const reg=authMode==='register';
  return `<section class="auth-wrap">
    <div class="auth-side on-dark"><span class="lg-mono gold" style="width:90px;position:relative;z-index:2"></span><div><h2>Your skin, your doctor, your orders. One place.</h2></div>
      <ul><li>${ic('cal')} Manage consultations</li><li>${ic('file')} View your doctor\u2019s regimen</li><li>${ic('bag')} Track and reorder in one tap</li></ul></div>
    <div class="auth-main"><div class="auth-card">
      <span class="lg-mono" style="width:64px;margin:0 auto 10px"></span>
      <h2>${reg?'Create account':'Welcome back'}</h2>
      <p class="sub">${reg?'Join to book consults and save your regimen.':'Sign in to access your dashboard, consults and orders.'}</p>
      <form data-form="${reg?'register':'login'}" style="display:grid;gap:16px">
        <div class="err" id="authErr" hidden></div>
        <div class="field"><label>${reg?'Full name':'Your name (optional)'}</label><input class="inp" name="name" ${reg?'required':''} placeholder="Enter your name"></div>
        ${reg?`<div class="field"><label>Phone</label><input class="inp" name="phone" type="tel" placeholder="+91"></div>`:''}
        <div class="field"><label>Email address</label><input class="inp" name="email" type="email" required placeholder="Enter your email" autocomplete="off"></div>
        <div class="field"><label>Password</label><input class="inp" name="pw" type="password" required minlength="4" placeholder="Enter your password" autocomplete="off"></div>
        ${reg?'':'<a href="#/login" class="muted" style="font-size:14px;justify-self:end" data-toast="Password reset link would be emailed">Forgot password?</a>'}
        <button class="btn btn-teal btn-block" type="submit">${reg?'Create account':'Sign in'}</button>
      </form>
      <div class="or">OR</div>
      <button class="gbtn" data-google><svg width="20" height="20" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg> Continue with Google</button>
      <p style="text-align:center;margin-top:20px;font-size:15px" class="muted">${reg?'Already have an account?':'Don\u2019t have an account?'} <button class="link" data-authmode="${reg?'login':'register'}">${reg?'Sign in':'Register here'}</button></p>
      <p class="demo-note">Prototype: any email and password works. Nothing leaves this browser.</p>
    </div></div></section>`;
}
