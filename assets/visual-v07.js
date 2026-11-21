(()=>{
'use strict';
const header=document.querySelector('#site-header');
const nav=document.querySelector('#main-nav');
const toggle=document.querySelector('.menu-toggle');
if(header&&nav&&toggle){
 const media=matchMedia('(max-width: 940px)');
 let opened=false;
 function setOpen(value,focus){opened=Boolean(value)&&media.matches;nav.dataset.collapsed=String(!opened);toggle.setAttribute('aria-expanded',String(opened));document.body.classList.toggle('nav-open',opened);toggle.setAttribute('aria-label',opened?(document.documentElement.lang==='fa'?'بستن منو':'Close navigation'):(document.documentElement.lang==='fa'?'باز کردن منو':'Open navigation'));if(focus)toggle.focus()}
 function updateScroll(){header.classList.toggle('compact',scrollY>50)}
 updateScroll();addEventListener('scroll',updateScroll,{passive:true});
 toggle.addEventListener('click',()=>setOpen(!opened));
 nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>setOpen(false)));
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&opened){setOpen(false,true)}});
 document.addEventListener('pointerdown',e=>{if(opened&&!header.contains(e.target))setOpen(false)});
 media.addEventListener('change',()=>setOpen(false));
}
document.querySelectorAll('[data-print]').forEach(btn=>{btn.hidden=false;btn.addEventListener('click',()=>print())});
})();