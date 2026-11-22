(()=>{
 'use strict';
 const fa=document.documentElement.lang==='fa';
 const email=String.fromCharCode(100,101,109,111,64,101,120,97,109,112,108,101,46,99,111,109);
 document.querySelectorAll('[data-email-display]').forEach(el=>{el.textContent=email;el.title=fa?'ایمیل آزمایشی، برای ارسال استفاده نکنید':'Demo address — not an active mailbox';});
 const nodes=[...document.querySelectorAll('[data-bl-count]')];
 if(nodes.length){
   const path=location.pathname.includes('/fa/')?'../assets/episodes.json':'assets/episodes.json';
   fetch(path).then(res=>res.ok?res.json():Promise.reject(res.status)).then(entries=>{
    const n=entries.filter(x=>x && x.slug && x.youtube_url).length;window.__blPublishedCount=n;
    nodes.forEach(el=>{
     if(el.id==='bl-guest-count' || el.id==='search-count'){
       // avoid overwriting live filtered search counts while a visitor is searching.
       const input=document.querySelector('#bl-guest-search,#archive-search');
       if(input && input.value.trim())return;
       el.textContent=n+(el.dataset.blCount==='guests'?(fa?' مهمان':' guests'):(fa?' گفتگو':' conversations'));
     }else el.textContent=fa?new Intl.NumberFormat('fa-IR').format(n):String(n);
    });
   }).catch(()=>{});
 }
})();