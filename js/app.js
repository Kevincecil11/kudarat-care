/* tighter label type for long product names */
{const _art=art;art=function(t,b,l,lid){const o=_art(t,b,l,lid);return l&&l.length>7?o.replace('font-size="10.5" letter-spacing="1.4"','font-size="8.6" letter-spacing="1"'):o}}
/* ============ ACCOUNT ============ */
function Account(){
  const u=store.get('kc_user',null); if(!u){location.hash='#/login';return ''}
  const consults=store.get('kc_consults',[{date:'Sat, 10 Oct',time:'5:30 PM',type:'Video consult',doc:'Dr. Aanya Mehta',concern:'Pigmentation'}]);
  const orders=store.get('kc_orders',[]).concat([{id:'KC24817',date:'21 Sep 2026',items:'Bhringraj Root Oil ×1, Amla Cleanser ×1',total:1200,status:'Delivered'}]);
  const reg=[['Morning','neem-wash','Cleanse 30 sec'],['Morning','sun-veil','Two fingers, reapply 3 hrly'],['Night','kesar-elixir','3 to 4 drops'],['Night','saffron-cream','Pea-sized']];
  return `<section class="sec" style="padding-top:40px"><div class="wrap">
    <div style="display:flex;justify-content:space-between;align-items:flex-end;gap:16px;flex-wrap:wrap;margin-bottom:32px"><div><span class="eyebrow">My account</span><h1 style="font-size:clamp(40px,5vw,64px);margin-top:10px">Hello, ${u.name.split(' ')[0]}.</h1></div><button class="btn btn-ghost btn-sm" data-logout>${ic('out')} Log out</button></div>
    <div class="stats">${[['cal',consults.length,'Consultations','#DDE7E1','#04484A'],['file',1,'Active regimen','#F1E4D3','#94702A'],['bag',orders.length,'Orders','#F2DDD3','#7A2E3A'],['user','\u2713','Profile','#E9E2F0','#5B4A7A']].map(s=>`<div class="stat"><div class="ico" style="background:${s[3]};color:${s[4]}">${ic(s[0])}</div><div><b>${s[1]}</b><small>${s[2]}</small></div></div>`).join('')}</div>
    <div class="grid g2" style="margin-top:24px;align-items:start">
      <div class="card"><h3 style="font-size:30px;margin-bottom:16px;display:flex;gap:10px;align-items:center">${ic('cal')} Upcoming consults</h3>
        ${consults.map(c=>`<div style="background:var(--sage);border-radius:14px;padding:16px;display:flex;justify-content:space-between;gap:12px;align-items:center;margin-bottom:10px;flex-wrap:wrap"><div><b style="font-weight:600;color:var(--teal)">${c.date} at ${c.time}</b><div class="muted" style="font-size:15px">${c.type} · ${c.concern}</div></div><div style="text-align:right"><div style="font-size:14px">${c.doc}</div><button class="link" style="font-size:14px" data-toast="Video link opens 10 min before the consult">Join call</button></div></div>`).join('')}
        <a href="#/consult" class="link" style="margin-top:8px">Book another ${ic('arrow')}</a></div>
      <div class="card"><h3 style="font-size:30px;margin-bottom:6px;display:flex;gap:10px;align-items:center">${ic('file')} My regimen</h3><p class="muted" style="font-size:14px;margin-bottom:14px">Prescribed by Dr. Aanya Mehta · 21 Sep 2026</p>
        ${reg.map(r=>{const p=byId(r[1]);return `<div class="citem" style="grid-template-columns:56px 1fr auto"><div class="th ${tint(p)}" style="width:56px;height:56px">${art(p.type,p.body,p.label)}</div><div><b>${p.name}</b><small>${r[0]} · ${r[2]}</small></div><span class="status ${r[0]==='Morning'?'s-proc':'s-ship'}">${r[0]==='Morning'?'AM':'PM'}</span></div>`}).join('')}
        <button class="btn btn-teal btn-block" style="margin-top:18px" data-addreg="${reg.map(r=>r[1]).join(',')}">${ic('bag')} Add regimen to bag</button></div>
    </div>
    <div class="card" style="margin-top:24px"><h3 style="font-size:30px;margin-bottom:16px;display:flex;gap:10px;align-items:center">${ic('bag')} Order history</h3>
      <div class="table-scroll"><table class="otable"><thead><tr><th>Order</th><th>Date</th><th>Items</th><th>Total</th><th>Status</th></tr></thead><tbody>
      ${orders.map(o=>`<tr><td style="font-weight:600;color:var(--teal)">#${o.id}</td><td>${o.date}</td><td style="min-width:200px">${o.items}</td><td style="font-weight:600">${inr(o.total)}</td><td><span class="status ${o.status==='Delivered'?'s-del':o.status==='Shipped'?'s-ship':'s-proc'}">${o.status}</span></td></tr>`).join('')}
      </tbody></table></div></div>
  </div></section>`;
}

/* ============ CART + CHECKOUT ============ */
let cart=store.get('kc_cart',[]);
const cartCount=()=>cart.reduce((s,i)=>s+i.q,0);
const cartTotal=()=>cart.reduce((s,i)=>s+i.price*i.q,0);
function addToCart(id,q=1,size,extra){
  const p=byId(id)||extra; const key=id+(size||'');
  const ex=cart.find(i=>i.key===key);
  if(ex)ex.q+=q; else cart.push({key,id,name:p.name,price:p.price,size:size||(p.sizes?p.sizes[0]:''),q,type:p.type,body:p.body,label:p.label||'',cat:p.cat||'gift'});
  saveCart(); toast(`${p.name} added to bag`);
  const b=$('#cartBadge'); b.classList.remove('bump'); void b.offsetWidth; b.classList.add('bump');
}
function saveCart(){store.set('kc_cart',cart);renderCart()}
function renderCart(){
  const n=cartCount(), b=$('#cartBadge'); b.textContent=n; b.classList.toggle('show',n>0);
  const tot=cartTotal(), left=Math.max(0,999-tot);
  $('#cartBody').innerHTML=cart.length?`<div class="ship-bar">${left?`You\u2019re <b>${inr(left)}</b> away from free shipping`:'<b>You\u2019ve unlocked free shipping</b>'}<div class="track"><i style="width:${Math.min(100,tot/999*100)}%"></i></div></div>`+cart.map(i=>`<div class="citem"><div class="th ${tint(i)}">${art(i.type,i.body,i.label)}</div><div><b>${i.name}</b><small>${i.size}</small><div class="qty-ctl"><button data-cq="${i.key}|-1" aria-label="Less">${ic('minus')}</button><span>${i.q}</span><button data-cq="${i.key}|1" aria-label="More">${ic('plus')}</button></div></div><div style="text-align:right"><b>${inr(i.price*i.q)}</b><button class="icon-btn" style="width:36px;height:36px;margin-left:auto;color:var(--muted)" data-rm="${i.key}" aria-label="Remove">${ic('trash')}</button></div></div>`).join(''):`<div class="empty"><div style="width:120px;margin:0 auto 10px">${art('box','#04484A')}</div><h3 style="font-size:30px">Your bag is empty</h3><p style="margin:6px 0 20px">Start with a bestseller.</p><a href="#/shop" class="btn btn-teal" data-act="close">Shop now</a></div>`;
  $('#cartFoot').innerHTML=cart.length?`<div class="sumrow"><span class="muted">Subtotal</span><b>${inr(tot)}</b></div><div class="sumrow"><span class="muted">Shipping</span><span>${left?inr(79):'Free'}</span></div><a href="#/checkout" class="btn btn-teal btn-block" style="margin-top:10px">Checkout · ${inr(tot+(left?79:0))}</a>`:'';
}
function Checkout(){
  if(!cart.length)return `<section class="sec"><div class="wrap empty"><h2 style="font-size:44px">Nothing to check out yet.</h2><p style="margin:10px 0 24px">Your bag is empty.</p><a href="#/shop" class="btn btn-teal">Go to shop</a></div></section>`;
  const u=store.get('kc_user',{}), tot=cartTotal(), ship=tot>=999?0:79;
  return `<section class="sec" style="padding-top:40px"><div class="wrap">
    <span class="eyebrow">Checkout</span><h1 style="font-size:clamp(40px,5vw,60px);margin:10px 0 30px">Almost yours.</h1>
    <div class="grid" style="grid-template-columns:minmax(0,1.4fr) minmax(0,1fr);gap:28px;align-items:start" id="coGrid">
      <form class="card" data-form="checkout" style="background:#fff"><h3 style="font-size:28px;margin-bottom:16px">Delivery details</h3><div class="fgrid">
        <div class="field"><label>Full name</label><input class="inp" required value="${u.name||''}" placeholder="Full name"></div>
        <div class="field"><label>Phone</label><input class="inp" type="tel" required placeholder="+91"></div>
        <div class="field full"><label>Email</label><input class="inp" type="email" value="${u.email||''}" placeholder="For order updates"></div>
        <div class="field full"><label>Address</label><input class="inp" required placeholder="House, street, area"></div>
        <div class="field"><label>City</label><input class="inp" required placeholder="City"></div>
        <div class="field"><label>PIN code</label><input class="inp" required inputmode="numeric" maxlength="6" placeholder="6 digits"></div>
        <div class="field full"><label>Payment</label><div class="opt-grid">${[['UPI','GPay, PhonePe, Paytm'],['Card / Netbanking','Secure payment gateway'],['Cash on delivery','+₹40 handling']].map((p,i)=>`<button type="button" class="opt ${i===0?'on':''}" data-pay><b>${p[0]}</b><small>${p[1]}</small></button>`).join('')}</div></div>
        <div class="full"><button class="btn btn-teal btn-block" type="submit">Place order · ${inr(tot+ship)}</button><p class="muted" style="font-size:14px;text-align:center;margin-top:10px">Prototype: no payment is taken.</p></div>
      </div></form>
      <div class="card"><h3 style="font-size:28px;margin-bottom:10px">Order summary</h3>${cart.map(i=>`<div class="citem" style="grid-template-columns:56px 1fr auto"><div class="th ${tint(i)}" style="width:56px;height:56px">${art(i.type,i.body,i.label)}</div><div><b>${i.name}</b><small>${i.size} · Qty ${i.q}</small></div><b>${inr(i.price*i.q)}</b></div>`).join('')}
        <div style="margin-top:16px"><div class="sumrow"><span class="muted">Subtotal</span><span>${inr(tot)}</span></div><div class="sumrow"><span class="muted">Shipping</span><span>${ship?inr(ship):'Free'}</span></div><div class="sumrow" style="font-size:20px;font-weight:600;border-top:1px solid var(--line);padding-top:12px;margin-top:6px"><span>Total</span><span>${inr(tot+ship)}</span></div></div></div>
    </div></div></section>`;
}
function Placed(id){
  return `<section class="sec"><div class="wrap" style="text-align:center;max-width:620px">
    <svg viewBox="0 0 120 120" style="width:120px;margin:0 auto 18px"><circle cx="60" cy="60" r="54" fill="none" stroke="url(#kcfoil)" stroke-width="3" style="stroke-dasharray:340;stroke-dashoffset:340;animation:drawc 1.2s cubic-bezier(.6,.1,.2,1) forwards"/><polyline points="38 62 53 77 84 44" fill="none" stroke="#04484A" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" style="stroke-dasharray:70;stroke-dashoffset:70;animation:drawc .6s 1s forwards"/></svg>
    <span class="eyebrow">Order #${id}</span><h1 style="font-size:clamp(44px,6vw,72px);margin:12px 0">Thank you.</h1><p class="lead" style="margin:0 auto 28px">Your order is being hand-packed. We\u2019ll WhatsApp you the tracking link.</p>
    <div class="hero-cta" style="justify-content:center"><a href="#/account" class="btn btn-teal">View in account</a><a href="#/shop" class="btn btn-ghost">Keep shopping</a></div></div></section>`;
}
function NotFound(){return `<section class="sec"><div class="wrap empty"><h2 style="font-size:48px">Page not found</h2><p style="margin:10px 0 24px">This page wandered off into the garden.</p><a href="#/" class="btn btn-teal">Back home</a></div></section>`}

/* ============ ROUTER ============ */
const NAV=[['#/','Home'],['#/consult','Consult'],['#/shop','Shop'],['#/journal','Journal'],['#/about','About'],['#/contact','Contact']];
function chrome(path){
  const u=store.get('kc_user',null), base='#/'+(path.split('/')[1]||'');
  const act=h=>h===base||(h==='#/shop'&&base==='#/product');
  $('#nav').innerHTML=NAV.map(([h,t])=>`<a href="${h}" class="${act(h)?'active':''}">${t}</a>`).join('');
  $('#mnav').innerHTML=NAV.map(([h,t])=>`<a href="${h}">${t}${ic('arrow')}</a>`).join('')+`<a href="#/shop/wedding">Wedding gifting <small>Shop</small></a><a href="#/shop/corporate">Corporate gifting <small>Shop</small></a>`;
  $('#acctPill').innerHTML=u?`${ic('user')} ${u.name.split(' ')[0]}`:`${ic('user')} Login`;
  $('#acctPill').href=u?'#/account':'#/login';
  $('#drawerAcct').textContent=u?'My account':'Login / Register';$('#drawerAcct').href=u?'#/account':'#/login';
  const tabs=[['#/','Home','home'],['#/shop','Shop','bag'],['#/consult','Consult','steth'],['#/journal','Journal','book'],[u?'#/account':'#/login',u?'Account':'Login','user']];
  $('#tabbar').innerHTML=tabs.map(([h,t,i])=>`<a href="${h}" class="${act(h)||(i==='user'&&(base==='#/login'||base==='#/account'))?'active':''}">${ic(i)}<span>${t}</span></a>`).join('');
}
function route(){try{renderRoute()}catch(err){console.error(err);$('#app').innerHTML=`<div class="boot"><div><h2 style="font-size:40px">Something went wrong</h2><p>${err.message}</p><p><a class="link" href="#/">Back home</a></p></div></div>`}}
function renderRoute(){
  const raw=location.hash.slice(1)||'/', [path,qs]=raw.split('?'), params=Object.fromEntries(new URLSearchParams(qs||''));
  const seg=path.split('/').filter(Boolean);
  let html, title='KudaratCare';
  switch(seg[0]){
    case undefined: html=Home(); break;
    case 'consult': html=Consult(); title='Consult a Doctor · KudaratCare'; break;
    case 'shop': html=Shop(seg[1]||'',params); title='Shop · KudaratCare'; break;
    case 'product': html=Product(seg[1]); title=(byId(seg[1])||{}).name+' · KudaratCare'; break;
    case 'journal': html=seg[1]?Article(seg[1]):Journal(); title='Kudarat Care Journal'; break;
    case 'about': html=About(); title='About · KudaratCare'; break;
    case 'contact': html=Contact(); title='Contact · KudaratCare'; break;
    case 'login': if(store.get('kc_user',null)){location.hash='#/account';return} html=Login(); title='Login · KudaratCare'; break;
    case 'account': html=Account(); title='My Account · KudaratCare'; break;
    case 'checkout': html=Checkout(); title='Checkout · KudaratCare'; break;
    case 'placed': html=Placed(seg[1]); break;
    default: html=NotFound();
  }
  if(!html)return;
  const app=$('#app'); app.style.animation='none'; void app.offsetWidth; app.style.animation='';
  app.innerHTML=html;
  document.title=title; chrome(path); closeAll(); window.scrollTo({top:0,behavior:'instant'}); observe();
}
let io;
function observe(){
  io&&io.disconnect();
  io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{rootMargin:'0px 0px -6% 0px'});
  $$('.reveal').forEach((el,i)=>{el.style.transitionDelay=((i%4)*70)+'ms';io.observe(el)});
}

/* ============ UI HELPERS ============ */
let tt;
function toast(msg){const t=$('#toast');t.innerHTML=ic('check')+msg;t.classList.add('show');clearTimeout(tt);tt=setTimeout(()=>t.classList.remove('show'),2600)}
function openDrawer(id){$('#'+id).classList.add('open');$('#scrim').classList.add('show');document.body.style.overflow='hidden'}
function closeAll(){$$('.drawer').forEach(d=>d.classList.remove('open'));$('#scrim').classList.remove('show');document.body.style.overflow=''}
function scrollToId(id){const el=document.getElementById(id);if(el)window.scrollTo({top:el.getBoundingClientRect().top+scrollY-80,behavior:'smooth'})}
const refreshByob=()=>{$('#byobSteps').innerHTML=byobSteps();$('#byobPrev').innerHTML=byobPreview()};

/* ============ EVENTS ============ */
document.addEventListener('click',e=>{
  const t=e.target.closest('button,a,[data-go],[data-act],article'); if(!t)return;
  const d=t.dataset;
  if(d.act==='menu'){openDrawer('menuDrawer');return}
  if(d.act==='cart'){renderCart();openDrawer('cartDrawer');return}
  if(d.act==='close'&&t.tagName!=='A'){closeAll();return}
  if(d.go){location.hash=d.go;return}
  if(d.add){e.preventDefault();addToCart(d.add);return}
  if(d.addpd){const q=+$('#pq').textContent, s=$('[data-chipgroup="size"] .on')?.dataset.chip;addToCart(d.addpd,q,s);return}
  if(d.pq){const el=$('#pq');el.textContent=Math.max(1,+el.textContent+ +d.pq);return}
  if(d.cq){const [k,n]=d.cq.split('|'),i=cart.find(x=>x.key===k);i.q+=+n;if(i.q<1)cart=cart.filter(x=>x!==i);saveCart();return}
  if(d.rm){cart=cart.filter(x=>x.key!==d.rm);saveCart();return}
  if(d.addreg){d.addreg.split(',').forEach(id=>addToCart(id));toast('Regimen added to bag');return}
  if(d.acc!==undefined){t.parentElement.classList.toggle('open');return}
  if(d.chip!==undefined){$$('.chip',t.parentElement).forEach(c=>c.classList.remove('on'));t.classList.add('on');return}
  if(d.cat){shopState.cat=d.cat;$$('[data-cat]').forEach(c=>c.classList.toggle('on',c===t));$('#pgrid').innerHTML=gridHTML();observe();return}
  if(d.jcat){jcat=d.jcat;$$('[data-jcat]').forEach(c=>c.classList.toggle('on',c===t));$('#jgrid').innerHTML=jgrid();observe();return}
  if(d.scroll){e.preventDefault();
    if(d.tier){setTimeout(()=>{const s=$('#tierSel');if(s)s.value=d.tier},50)}
    if(d.picktype){$$('[data-chipgroup="type"] .chip').forEach(c=>c.classList.toggle('on',c.dataset.chip===d.picktype))}
    scrollToId(d.scroll);return}
  if(d.pickdoc){const doc=DOCTORS.find(x=>x.id===d.pickdoc);$('#docSel').value=doc.name;scrollToId('book');return}
  if(d.box){byob.box=d.box;refreshByob();return}
  if(d.fill){const i=byob.items.indexOf(d.fill);if(i>-1)byob.items.splice(i,1);else if(byob.items.length<4)byob.items.push(d.fill);else toast('Max 4 items per box');refreshByob();return}
  if(d.bq){byob.qty=Math.max(25,byob.qty+ +d.bq);refreshByob();return}
  if(d.sample!==undefined){const b=BOXES.find(x=>x.id===byob.box),per=b.price+FILL.filter(f=>byob.items.includes(f.id)).reduce((s,f)=>s+f.price,0);addToCart('sample-'+byob.box,1,byob.names||'Sample box',{name:'Sample '+b.name+' favour',price:per,type:b.type,body:b.body,cat:'wedding',sizes:['Sample']});return}
  if(d.toast){e.preventDefault();toast(d.toast);return}
  if(d.pay!==undefined){$$('[data-pay]').forEach(c=>c.classList.toggle('on',c===t));return}
  if(d.authmode){authMode=d.authmode;route();return}
  if(d.google!==undefined){store.set('kc_user',{name:'Guest User',email:'guest@gmail.com'});toast('Signed in with Google (demo)');location.hash='#/account';return}
  if(d.logout!==undefined){store.del('kc_user');toast('Logged out');location.hash='#/';return}
  if(t.tagName==='A'&&t.getAttribute('href')?.startsWith('#/')&&t.getAttribute('href')===location.hash){route()}
});
document.addEventListener('input',e=>{
  const id=e.target.id;
  if(id==='q'){shopState.q=e.target.value;$('#pgrid').innerHTML=gridHTML();observe()}
  if(id==='bNames'){byob.names=e.target.value;$('#byobPrev').innerHTML=byobPreview()}
  if(id==='bNote'){byob.note=e.target.value;$('#byobPrev').innerHTML=byobPreview()}
});
document.addEventListener('change',e=>{
  const id=e.target.id;
  if(id==='concernSel'){shopState.concern=e.target.value;$('#pgrid').innerHTML=gridHTML();observe()}
  if(id==='sortSel'){shopState.sort=e.target.value;$('#pgrid').innerHTML=gridHTML();observe()}
  if(id==='bCer'){byob.cer=e.target.value;$('#byobPrev').innerHTML=byobPreview()}
  if(e.target.dataset.file!==undefined){$('#fileLbl').textContent=e.target.files.length+' photo(s) added'}
});
document.addEventListener('submit',e=>{
  e.preventDefault(); const f=e.target, k=f.dataset.form, fd=new FormData(f);
  if(k==='news'){f.reset();toast('Subscribed. Check your inbox for 10% off')}
  if(k==='contact'){f.reset();toast('Message sent. We\u2019ll reply within a day')}
  if(k==='corp'){f.reset();toast('Enquiry sent. A gifting specialist will reach out')}
  if(k==='consult'){
    const d=new Date(fd.get('date')), c={date:d.toLocaleDateString('en-IN',{weekday:'short',day:'numeric',month:'short'}),time:$('[data-chipgroup="slot"] .on')?.dataset.chip,type:$('[data-chipgroup="type"] .on')?.dataset.chip,doc:fd.get('doctor'),concern:fd.get('concern')};
    store.set('kc_consults',[c,...store.get('kc_consults',[])]);
    f.innerHTML=`<div style="text-align:center;padding:30px 10px"><svg viewBox="0 0 120 120" style="width:96px;margin:0 auto 14px"><circle cx="60" cy="60" r="54" fill="none" stroke="url(#kcfoil)" stroke-width="3" style="stroke-dasharray:340;stroke-dashoffset:340;animation:drawc 1s forwards"/><polyline points="38 62 53 77 84 44" fill="none" stroke="#04484A" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" style="stroke-dasharray:70;stroke-dashoffset:70;animation:drawc .5s .8s forwards"/></svg><h3 style="font-size:36px">You\u2019re booked.</h3><p class="muted" style="margin:8px 0 22px">${c.type} on ${c.date} at ${c.time} with ${c.doc}. We\u2019ll WhatsApp the video link.</p><a href="#/account" class="btn btn-teal">View in account</a></div>`;
  }
  if(k==='login'||k==='register'){
    const email=fd.get('email'), name=fd.get('name')||email.split('@')[0].replace(/[._]/g,' ').replace(/\b\w/g,m=>m.toUpperCase());
    if(String(fd.get('pw')).length<4){const er=$('#authErr');er.hidden=false;er.textContent='Password must be at least 4 characters.';return}
    store.set('kc_user',{name,email}); authMode='login'; toast(k==='login'?'Welcome back':'Account created'); location.hash='#/account';
  }
  if(k==='checkout'){
    const id='KC'+Math.floor(10000+Math.random()*89999), tot=cartTotal()+(cartTotal()>=999?0:79);
    const o={id,date:new Date().toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'}),items:cart.map(i=>`${i.name} ×${i.q}`).join(', '),total:tot,status:'Processing'};
    store.set('kc_orders',[o,...store.get('kc_orders',[])]); cart=[]; saveCart(); location.hash='#/placed/'+id;
  }
});
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeAll()});
window.addEventListener('hashchange',route);
renderCart(); route();
