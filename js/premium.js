/* Full-resolution responsive media; no screenshot crops or low-res base64. */
const premiumAssets={
 hero:['https://u260625351.p.clickup-attachments.com/u260625351/308c8b54-8c5a-57c7-9529-eb6d563a7e42/hero-640.webp?view=open','https://u260625351.p.clickup-attachments.com/u260625351/b7f927ea-b328-57cf-b472-9b0c3e257667/hero-1536.webp?view=open',1536,1024],
 cleanser:['https://u260625351.p.clickup-attachments.com/u260625351/8271ea9f-aa96-50d5-bd6b-5562f4a138f6/cleanser-640.webp?view=open','https://u260625351.p.clickup-attachments.com/u260625351/7afbde4e-cec6-5eb7-a2b7-bf2309b3be29/cleanser-1122.webp?view=open',1122,1402],
 cream:['https://u260625351.p.clickup-attachments.com/u260625351/be47e26b-2b66-5cd4-98e5-ac0476d106f4/cream-640.webp?view=open','https://u260625351.p.clickup-attachments.com/u260625351/771e8bcf-a13a-5933-9aa6-172a0cc4fd57/cream-1254.webp?view=open',1254,1254],
 serum:['https://u260625351.p.clickup-attachments.com/u260625351/d9c8eb0a-5014-5ff7-b8ac-941fb956f0c7/serum-640.webp?view=open','https://u260625351.p.clickup-attachments.com/u260625351/53faf6d5-95bf-5dfb-90b5-2f86a2b8a79e/serum-1024.webp?view=open',1024,1536],
 hair:['https://u260625351.p.clickup-attachments.com/u260625351/10f0e125-8e59-5be9-b60c-e889a3742401/hair-640.webp?view=open','https://u260625351.p.clickup-attachments.com/u260625351/dd8f4ba8-4448-56a5-a86a-bdf7021a6e3d/hair-1122.webp?view=open',1122,1402],
 consult:['https://u260625351.p.clickup-attachments.com/u260625351/ed29ab93-3e7b-5c28-a573-1ed8c284db28/consult-640.webp?view=open','https://u260625351.p.clickup-attachments.com/u260625351/9eac7afe-9fee-50cf-b306-f3700e0630b4/consult-1536.webp?view=open',1536,1024],
 wedding:['https://u260625351.p.clickup-attachments.com/u260625351/f7b9439d-73d9-5b82-8124-6c3b35c52d4d/wedding-640.webp?view=open','https://u260625351.p.clickup-attachments.com/u260625351/24aa4813-83f4-5fcf-8103-b2339bea8fbf/wedding-1536.webp?view=open',1536,1024],
 corporate:['https://u260625351.p.clickup-attachments.com/u260625351/0baa3140-1884-5366-8b7d-4f237c154d60/corporate-640.webp?view=open','https://u260625351.p.clickup-attachments.com/u260625351/6dbcf07d-b9ff-572a-a80b-5c0d89f0ce23/corporate-1536.webp?view=open',1536,1024],
 leaves:['https://u260625351.p.clickup-attachments.com/u260625351/50c18a4e-e291-56f5-8b8b-2928c7423c8b/botanical-640.webp?view=open','https://u260625351.p.clickup-attachments.com/u260625351/0274c5bf-ba73-55d4-9cd3-a7fd57e00e7a/botanical-1122.webp?view=open',1122,1402],
 ingredients:['https://u260625351.p.clickup-attachments.com/u260625351/50c18a4e-e291-56f5-8b8b-2928c7423c8b/botanical-640.webp?view=open','https://u260625351.p.clickup-attachments.com/u260625351/0274c5bf-ba73-55d4-9cd3-a7fd57e00e7a/botanical-1122.webp?view=open',1122,1402]
};
const premiumReduce=matchMedia('(prefers-reduced-motion:reduce)');
const premiumNav=[['#/consult','Consult'],['#/shop','Shop'],['#/journal','Journal'],['#/about','About'],['#/contact','Contact']];
let premiumObserver;
let premiumFrame=0;
function premiumMedia(root=document){
 root.querySelectorAll('.flow-photo:not([data-hd])').forEach(el=>{
  const key=Object.keys(premiumAssets).find(k=>el.classList.contains('photo-'+k));if(!key)return;
  const a=premiumAssets[key],img=document.createElement('img');el.dataset.hd='true';
  const isHero=el.classList.contains('hero-photo');
  img.width=a[2];img.height=a[3];img.alt=el.getAttribute('aria-label')||'Illustrative KudaratCare photography';el.removeAttribute('role');el.removeAttribute('aria-label');
  const rect=el.getBoundingClientRect();
  const visible=rect.top<innerHeight+100&&rect.bottom>0;
  img.loading=isHero||visible?'eager':'lazy';img.decoding='async';if(isHero)img.setAttribute('fetchpriority','high');
  img.sizes=isHero?'(max-width: 760px) 100vw, 61vw':el.closest('.citem,.mini')?'150px':el.closest('.pd-art')?'(max-width: 760px) 92vw, 48vw':el.closest('.flow-category,.pcard')?'(max-width: 900px) 44vw, 23vw':el.closest('.flow-journal')?'(max-width: 760px) 90vw, 29vw':'(max-width: 760px) 100vw, 54vw';
  img.srcset=`${a[0]} 640w, ${a[1]} ${a[2]}w`;img.src=a[1];
  img.addEventListener('error',()=>{if(img.dataset.retried){el.classList.add('image-error');return}img.dataset.retried='true';img.removeAttribute('srcset');img.src=a[1]});
  el.appendChild(img);
 });
}
function premiumEnhance(){
 premiumMedia();
 const path=location.hash||'#/';
 $('#nav').innerHTML=premiumNav.map(([href,label])=>`<a href="${href}" ${path.startsWith(href)&&href!=='#/'?'aria-current="page" class="active"':''}>${label}</a>`).join('');
 $('#nav').setAttribute('aria-label','Main navigation');
 $('#mnav').innerHTML=[['#/','Home'],...premiumNav].map(([h,t])=>`<a href="${h}">${t}${ic('arrow')}</a>`).join('');
 $('#menuDrawer [data-act="close"]').setAttribute('aria-label','Close navigation');
 $('#cartDrawer [data-act="close"]').setAttribute('aria-label','Close bag');
 $('#drawerAcct').textContent=store.get('kc_user',null)?'My demo account':'Explore your account';
 document.querySelectorAll('.drawer').forEach(d=>{d.inert=!d.classList.contains('open')});
 document.querySelector('.menu-btn').setAttribute('aria-expanded',String($('#menuDrawer').classList.contains('open')));
 document.querySelector('.menu-btn').setAttribute('aria-controls','menuDrawer');
 const ft=document.querySelector('.ft');
 if(!ft.querySelector('.premium-disclosure')){
  const note=document.createElement('p');note.className='premium-disclosure';note.textContent='Design preview by MTRX Digital. Imagery, products and prices are illustrative; no real booking, purchase or sign-in takes place. Final brand details and services are subject to client confirmation.';ft.querySelector('.wrap').append(note);
 }
 const footerLinks=[...ft.querySelectorAll('a')];
 footerLinks.forEach(a=>{if(a.textContent==='Skin care')a.href='#/shop?category=skin';if(a.textContent==='Hair care')a.href='#/shop?category=hair';if(a.textContent==='Track an order')a.href='#/account';if(/Shipping & returns|Privacy & terms/.test(a.textContent)){a.href='#/contact';a.dataset.flowalert='Policies will be supplied by KudaratCare before launch.'}});
 document.querySelectorAll('input[type=email]').forEach(el=>{el.autocomplete='off';el.setAttribute('inputmode','email')});
 document.querySelectorAll('[data-form="checkout"]').forEach(f=>{f.querySelector('.btn-block').textContent='Complete demo checkout'});
 const hero=document.querySelector('.flow-hero');if(hero)hero.classList.add('premium-boot');
 if(premiumObserver)premiumObserver.disconnect();
 if(!premiumReduce.matches&&'IntersectionObserver' in window){
  premiumObserver=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('is-visible');premiumObserver.unobserve(e.target)}}),{threshold:.08});
  document.querySelectorAll('.flow-category,.flow-care-copy,.flow-gift,.flow-journal,.flow-step,.pcard').forEach(el=>{
   if(el.getBoundingClientRect().top>innerHeight-30&&!el.classList.contains('is-visible')){el.classList.add('premium-reveal');premiumObserver.observe(el)}
  });
 }
 document.querySelectorAll('.field').forEach((f,i)=>{const label=f.querySelector('label'),control=f.querySelector('input,select,textarea');if(label&&control){if(!control.id)control.id='kc-field-'+i;label.htmlFor=control.id}});
 document.querySelectorAll('[data-bq]').forEach(b=>b.setAttribute('aria-label',+b.dataset.bq<0?'Reduce gift quantity':'Increase gift quantity'));
 document.querySelectorAll('.acc button').forEach(b=>{b.setAttribute('aria-expanded',String(b.parentElement.classList.contains('open')))});
}
const premiumRoute=renderRoute;
renderRoute=function(){premiumRoute();premiumEnhance();$('#app').setAttribute('aria-label',document.title);};
const premiumRenderCart=renderCart;
renderCart=function(){premiumRenderCart();premiumMedia($('#cartDrawer'));const bar=$('#cartBody .ship-bar');if(bar)bar.insertAdjacentHTML('afterbegin','<span style="display:block;font-size:12px;margin-bottom:6px">Sample shipping estimate</span>');};
const premiumDrawerOpen=openDrawer,premiumDrawerClose=closeAll;
openDrawer=function(id){$('#'+id).inert=false;premiumDrawerOpen(id);$('#app').inert=true;document.querySelector('.ft').inert=true;document.querySelector('header').inert=true;premiumMedia($('#'+id));const trigger=document.querySelector('.menu-btn');trigger.setAttribute('aria-expanded',id==='menuDrawer'?'true':'false')};
closeAll=function(){document.querySelectorAll('#app,.ft,header').forEach(e=>e.inert=false);premiumDrawerClose();document.querySelectorAll('.drawer').forEach(d=>d.inert=true);document.querySelector('.menu-btn').setAttribute('aria-expanded','false')};
const premiumMutation=new MutationObserver(()=>{
 if(premiumFrame)return;
 premiumFrame=requestAnimationFrame(()=>{premiumFrame=0;premiumMedia();document.querySelectorAll('.acc button').forEach(b=>b.setAttribute('aria-expanded',String(b.parentElement.classList.contains('open'))))});
});
premiumMutation.observe($('#app'),{childList:true,subtree:true});
premiumMutation.observe($('#cartBody'),{childList:true,subtree:true});
document.addEventListener('click',e=>{
 const scrim=e.target.closest('#scrim');if(scrim){e.preventDefault();closeAll();return}
 const search=e.target.closest('[data-focus-search]');if(search){setTimeout(()=>$('#q')?.focus(),80)}
 const skip=e.target.closest('.skip');if(skip){e.preventDefault();$('#app').focus();window.scrollTo({top:0,behavior:'instant'})}
});
let scrollTick=0;
addEventListener('scroll',()=>{if(!scrollTick)scrollTick=requestAnimationFrame(()=>{document.body.classList.toggle('has-scrolled',scrollY>12);scrollTick=0})},{passive:true});
document.addEventListener('keydown',e=>{
 const t=e.target.closest('[data-flowjournal]');if(t&&['ArrowLeft','ArrowRight'].includes(e.key)){e.preventDefault();const a=$$('[data-flowjournal]'),delta=e.key==='ArrowRight'?1:a.length-1;const next=a[(a.indexOf(t)+delta)%a.length];next.click();next.focus()}
});
renderCart();route();
