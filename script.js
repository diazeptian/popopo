// Tema gelap/terang
const root=document.documentElement;
try{const t=localStorage.getItem('theme');if(t)root.dataset.theme=t}catch(e){}
document.getElementById('toggle').onclick=()=>{
  const n=root.dataset.theme==='dark'?'light':'dark';root.dataset.theme=n;
  try{localStorage.setItem('theme',n)}catch(e){}
};
// Bintang berkelap-kelip
const bg=document.getElementById('bg');
const N=innerWidth<700?45:90;
for(let i=0;i<N;i++){const s=document.createElement('div');s.className='star';
  s.style.cssText=`left:${Math.random()*100}%;top:${Math.random()*70}%;animation-delay:${Math.random()*3}s;animation-duration:${2+Math.random()*3}s;opacity:${.4+Math.random()*.6}`;
  bg.prepend(s)}
// Efek ketik
const words=['I build modern, clean, and responsive websites','that bring ideas to life.','Build beautiful & functional web experiences.'];
const el=document.getElementById('typed');let w=0,c=0,del=false;
(function tick(){const t=words[w];el.textContent=t.slice(0,c);
  if(!del&&c===t.length){del=true;return setTimeout(tick,1800)}
  if(del&&c===0){del=false;w=(w+1)%words.length}
  c+=del?-1:1;setTimeout(tick,del?25:55)})();
// Arah & jeda (stagger) animasi masuk
document.querySelectorAll('.title').forEach(e=>e.classList.add('rv-l'));
document.querySelector('.about>div:first-child')?.classList.add('rv-l');
document.querySelector('.photo')?.classList.add('rv-r');
document.querySelectorAll('.skills .card').forEach(e=>e.classList.add('rv-z'));
// Animasi masuk berulang: tiap section dimainkan lagi setiap kali muncul (scroll turun maupun naik)
const secs=[...document.querySelectorAll('section.s')];
secs.forEach(sec=>{
  sec._rv=[...sec.querySelectorAll('.rv')];
  sec._rv.forEach((e,i)=>e.style.transitionDelay=Math.min(i*0.13,0.9)+'s');
});
const enter=sec=>{
  if(sec._on)return;sec._on=true;sec.classList.add('show');
  sec._rv.forEach((e,i)=>{
    const d=Math.min(i*0.13,0.9);e.style.transitionDelay=d+'s';
    clearTimeout(e._t);e._t=setTimeout(()=>{e.style.transitionDelay='';e.classList.add('done')},(d+1.2)*1000+400);
  });
  sec.querySelectorAll('[data-n]').forEach(n=>{
    clearInterval(n._i);const to=+n.dataset.n;let v=0;
    n._i=setInterval(()=>{v+=2;if(v>=to){v=to;clearInterval(n._i)}n.textContent=v+'%'},25);
  });
};
const leave=sec=>{
  if(!sec._on)return;sec._on=false;sec.classList.remove('show');
  sec._rv.forEach(e=>{clearTimeout(e._t);e.classList.remove('done');e.style.transitionDelay='0s'});
  sec.querySelectorAll('[data-n]').forEach(n=>{clearInterval(n._i);n.textContent='0%'});
};
const io=new IntersectionObserver(es=>es.forEach(e=>{
  if(e.isIntersecting&&e.intersectionRatio>=.2)enter(e.target);
  else if(!e.isIntersecting)leave(e.target);
}),{threshold:[0,.2]});
secs.forEach(s=>io.observe(s));
// Nav aktif
const links=[...document.querySelectorAll('.links a')];
addEventListener('scroll',()=>{let cur='home';
  document.querySelectorAll('header[id],section[id]').forEach(s=>{if(scrollY>=s.offsetTop-200)cur=s.id});
  links.forEach(a=>a.classList.toggle('on',a.getAttribute('href')==='#'+cur));});

// Menu hamburger (mobile)
const burger=document.getElementById('burger'),menu=document.querySelector('.links');
const setMenu=o=>{menu.classList.toggle('open',o);burger.classList.toggle('open',o);burger.setAttribute('aria-expanded',o)};
burger.onclick=()=>setMenu(!menu.classList.contains('open'));
menu.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>setMenu(false)));
addEventListener('resize',()=>{if(innerWidth>820)setMenu(false)});

// Efek scroll: progress bar, nav pintar, parallax, tombol ke atas
const nav=document.querySelector('nav'),bar=document.getElementById('progress'),topBtn=document.getElementById('top');
const hero=document.querySelector('.hero .wrap'),moon=document.querySelector('.moon');
const clouds=[...document.querySelectorAll('.cloud')],mount=document.querySelector('.mount');
let lastY=0,tick2=false;
function onScroll(){
  const y=scrollY,max=document.documentElement.scrollHeight-innerHeight;
  bar.style.transform=`scaleX(${max>0?y/max:0})`;
  nav.classList.toggle('scrolled',y>40);
  nav.classList.remove('hide'); // navbar selalu tampil saat scroll
  topBtn.classList.toggle('on',y>500);
  lastY=y;
  if(y<innerHeight*1.2){
    bg.style.translate=`0 ${y*.18}px`;
    moon.style.translate=`0 ${y*.35}px`;
    clouds.forEach((c,i)=>c.style.translate=`${(i%2?-1:1)*y*.15}px ${y*(.1+i*.05)}px`);
    mount.style.translate=`0 ${-y*.06}px`;
    hero.style.transform=`translateY(${y*.15}px)`;
    hero.style.opacity=Math.max(0,1-y/(innerHeight*.9));
  }
  tick2=false;
}
addEventListener('scroll',()=>{if(!tick2){tick2=true;requestAnimationFrame(onScroll)}},{passive:true});
topBtn.onclick=()=>scrollTo({top:0,behavior:'smooth'});
onScroll();

// Burung berkelompok (tampil hanya di mode terang)
function addFlock(parent,top,dur,delay){
  const f=document.createElement('div');f.className='bf';
  f.style.cssText=`top:${top}%;animation-duration:${dur}s;animation-delay:${delay}s`;
  f.innerHTML=[[0,0],[-28,11],[-28,-11]].map(([x,y],i)=>`<svg class="bird" viewBox="0 0 30 12" style="left:${x}px;top:${y}px;animation-delay:${i*.12}s"><path d="M1 9Q8 0 15 7Q22 0 29 9"/></svg>`).join('');
  parent.appendChild(f);
}
// Bintang & awan di section About, Skills, dan Projects
['about','skills','projects'].forEach(id=>{
  const sec=document.getElementById(id);if(!sec)return;
  const sky=document.createElement('div');sky.className='sky';
  const n=innerWidth<700?38:76;
  for(let i=0;i<n;i++){
    const s=document.createElement('i'),z=Math.random()<.2?3:(Math.random()<.5?2:1.5);
    if(z===3)s.className='g';
    s.style.cssText=`left:${Math.random()*100}%;top:${Math.random()*100}%;width:${z}px;height:${z}px;opacity:${.35+Math.random()*.65};animation-delay:${Math.random()*3}s;animation-duration:${2+Math.random()*3}s`;
    sky.appendChild(s);
  }
  // awan
  for(let i=0;i<3;i++){
    const cl=document.createElement('div');cl.className='cl';
    const dur=70+Math.random()*50;
    cl.style.cssText=`--w:${(innerWidth<700?120:170)+Math.random()*110}px;top:${8+i*30+Math.random()*12}%;animation-duration:${dur}s;animation-delay:-${Math.random()*dur}s`;
    sky.appendChild(cl);
  }
  addFlock(sky,12+Math.random()*50,20+Math.random()*8,Math.random()*10);
  sec.prepend(sky);
});
// burung di hero (mode terang)
addFlock(bg,18,22,2);addFlock(bg,35,26,11);

// Ikon skill: tekan untuk menampilkan deskripsi + gerak kecil
// (gerak memakai Web Animations API supaya tidak mengganggu animasi "pop" bawaan ikon)
const skillInfo={
  'HTML':'Kerangka dasar halaman web. Dipakai untuk menyusun struktur: judul, teks, gambar, tautan, dan form.',
  'CSS':'Mengatur tampilan web: warna, font, tata letak, animasi, dan membuatnya responsif di HP maupun desktop.',
  'JavaScript':'Membuat web jadi interaktif: menanggapi klik, mengubah isi halaman, animasi, dan mengolah data.',
  'React':'Library untuk membangun antarmuka dari komponen yang bisa dipakai ulang, supaya web besar tetap rapi.',
  'GitHub':'Menyimpan kode dan riwayat perubahannya dengan Git, serta memudahkan kolaborasi dan publikasi project.'
};
const skillCards=[...document.querySelectorAll('.skills .card')];
skillCards.forEach(card=>{
  const ic=card.querySelector('.ic'),h=card.querySelector('h3'),name=h&&h.textContent.trim();
  if(!ic||!name)return;
  const d=document.createElement('div');d.className='sdesc';
  const p=document.createElement('p');p.textContent=skillInfo[name]||'';d.appendChild(p);
  h.after(d);
  ic.setAttribute('role','button');ic.tabIndex=0;ic.setAttribute('aria-expanded','false');
  const toggle=()=>{
    const open=!card.classList.contains('open');
    skillCards.forEach(c=>{c.classList.remove('open');const i=c.querySelector('.ic');i&&i.setAttribute('aria-expanded','false')});
    card.classList.toggle('open',open);ic.setAttribute('aria-expanded',open);
    if(ic.animate&&!matchMedia('(prefers-reduced-motion: reduce)').matches)
      ic.animate([
        {translate:'0 0',rotate:'0deg'},
        {translate:'0 -4px',rotate:'-8deg',offset:.3},
        {translate:'0 0',rotate:'6deg',offset:.6},
        {translate:'0 0',rotate:'0deg'}
      ],{duration:450,easing:'ease-out'});
  };
  ic.addEventListener('click',toggle);
  ic.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();toggle()}});
});
document.addEventListener('click',e=>{
  if(e.target.closest('.skills .card'))return;
  skillCards.forEach(c=>c.classList.remove('open'));
});
