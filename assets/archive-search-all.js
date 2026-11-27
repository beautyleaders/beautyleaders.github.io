(()=>{
  const input=document.querySelector('#archive-search'),grid=document.querySelector('#archive-grid'),pages=document.querySelector('#bl-episode-pages'),count=document.querySelector('#search-count'),reset=document.querySelector('#search-reset');
  if(!input||!grid||!pages)return;
  const fa=document.documentElement.lang==='fa',indexURL=(fa?'../':'')+'assets/archive-cards-'+(fa?'fa':'en')+'.json';
  let all=null,filtered=[],page=0,original=grid.innerHTML,originalPages=pages.innerHTML,searchVersion=0;
  const normalize=s=>(s||'').toLowerCase().replace(/[ي]/g,'ی').replace(/[ك]/g,'ک').replace(/[\u200c\u064b-\u065f]/g,'').trim();
  function render(){
    const items=filtered.slice(page*10,page*10+10);grid.innerHTML=items.map(x=>x.html).join('');
    count.textContent=filtered.length+(fa?' گفتگو':' conversations');
    pages.innerHTML='';
    const total=Math.ceil(filtered.length/10);
    for(let n=0;n<total;n++){
      const btn=document.createElement('button');btn.type='button';btn.textContent=String(n+1);btn.setAttribute('aria-label',(fa?'صفحه ':'Page ')+(n+1));
      if(n===page){btn.className='current';btn.setAttribute('aria-current','page')}
      btn.addEventListener('click',()=>{page=n;render();grid.scrollIntoView({block:'start',behavior:'smooth'})});pages.append(btn);
    }
    if(filtered.length===0){grid.innerHTML='<p role="status">'+(fa?'گفتگویی با این عبارت پیدا نشد.':'No conversations match your search.')+'</p>'}
  }
  async function search(){
    const version=++searchVersion,val=normalize(input.value);
    if(!val){grid.innerHTML=original;pages.innerHTML=originalPages;count.textContent=(window.__blPublishedCount||document.querySelectorAll('.bl-archive-card').length)+(fa?' گفتگو':' conversations');return}
    if(!all){try{const res=await fetch(indexURL);if(!res.ok)throw new Error('index');all=await res.json()}catch(e){if(version===searchVersion)count.textContent=fa?'جستجو موقتاً در دسترس نیست':'Search temporarily unavailable';return}}
    if(version!==searchVersion)return;
    const current=normalize(input.value);filtered=all.filter(x=>normalize(x.search).includes(current));page=0;render();
  }
  input.addEventListener('input',search);
  if(reset)reset.addEventListener('click',()=>{input.value='';search();input.focus()});
})();