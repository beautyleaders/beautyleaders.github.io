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
/* ROUND 2: move existing social links to the approved desktop footer slot;
   return the SAME elements to the original bottom row on small screens. */
(()=>{
 'use strict';
 const footer=document.querySelector('footer');
 if(!footer)return;
 const wrap=footer.querySelector(':scope > .wrap');
 const nav=wrap?.querySelector('nav');
 const socials=footer.querySelector('.bl-footer-social');
 if(!wrap||!nav||!socials)return;
 const desktop=window.matchMedia('(min-width: 901px)');
 const sync=()=>{
   if(desktop.matches){if(socials.parentElement!==wrap)wrap.appendChild(socials);}
   else if(socials.parentElement!==footer)footer.appendChild(socials);
 };
 sync();
 if(desktop.addEventListener)desktop.addEventListener('change',sync);
 else if(desktop.addListener)desktop.addListener(sync);
})();


/* Mobile/tablet: eliminate iOS blue-emoji arrow rendering site-wide without changing links or desktop. */
(()=>{
 'use strict';
 const mobile=window.matchMedia('(max-width: 1200px)');
 let queued=false;
 function fixAnchor(a){
   if(!a || !a.querySelectorAll || a.dataset.blArrowFixed==='1')return;
   // Only replace the outward-diagonal glyphs, keeping all labels and destinations intact.
   const walker=document.createTreeWalker(a,NodeFilter.SHOW_TEXT);
   const nodes=[];
   let n;
   while((n=walker.nextNode()))if(/[↗↖]/.test(n.nodeValue||''))nodes.push(n);
   for(const node of nodes){
     const bits=(node.nodeValue||'').split(/([↗↖])/g);
     const frag=document.createDocumentFragment();
     for(const bit of bits){
       if(bit==='↗'||bit==='↖'){
         const svg=document.createElement('span');svg.className='bl-mobile-external-arrow';
         svg.setAttribute('aria-hidden','true');frag.appendChild(svg);
       }else if(bit)frag.appendChild(document.createTextNode(bit));
     }
     node.parentNode?.replaceChild(frag,node);
   }
   if(nodes.length)a.dataset.blArrowFixed='1';
 }
 function refresh(){
   if(!mobile.matches)return;
   document.querySelectorAll('a').forEach(fixAnchor);
 }
 function schedule(){if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;refresh()})}
 // No desktop DOM changes; only run on narrow screens.
 if(mobile.matches){refresh();const observer=new MutationObserver(schedule);observer.observe(document.body,{childList:true,subtree:true});}
 mobile.addEventListener?.('change',()=>{if(mobile.matches)refresh()});
})();
