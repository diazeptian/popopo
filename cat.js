// Kucing putih berkalung biru + loading
(()=>{
const D=document,H=D.documentElement,$=s=>D.querySelector(s),wait=ms=>new Promise(r=>setTimeout(r,ms));
const SVG=`<svg viewBox="0 0 120 90" aria-hidden="true"><g class="bd">
<g class="tail"><path d="M30 54Q8 52 10 28" fill="none" stroke="#a9b8d6" stroke-width="10" stroke-linecap="round"/><path d="M30 54Q8 52 10 28" fill="none" stroke="#fff" stroke-width="7" stroke-linecap="round"/></g>
<rect class="leg far b2" x="44" y="62" width="9" height="22" rx="4.5"/><rect class="leg far f2" x="66" y="62" width="9" height="22" rx="4.5"/>
<ellipse class="fur" cx="56" cy="56" rx="32" ry="19"/>
<rect class="leg fur b1" x="30" y="62" width="9" height="22" rx="4.5"/><rect class="leg fur f1" x="78" y="60" width="9" height="24" rx="4.5"/>
<path class="fur" d="M79 29 80 11 93 21ZM95 21 107 11 106 31Z"/><circle class="fur" cx="93" cy="39" r="17"/>
<path d="M82 24 82.5 15 89 21ZM98 21 104 15 103.5 25Z" fill="#ffc2d4"/>
<circle cx="88" cy="37" r="2.3" fill="#1d2b4a"/><circle cx="100" cy="37" r="2.3" fill="#1d2b4a"/><path d="M92.5 42h4l-2 2.5z" fill="#ff8fab"/>
<path d="M104 43l11-3M104 46l11 3M83 43l-9-3" stroke="#a9b8d6" stroke-width="1.2" stroke-linecap="round"/>
<path d="M79 51Q93 62 108 51" fill="none" stroke="#2f7bff" stroke-width="5" stroke-linecap="round"/><circle cx="94" cy="59" r="3" fill="#ffcf40"/>
</g></svg>`;
const cw=()=>innerWidth<700?88:116;
const T=d=>Math.min(2600,Math.max(900,d/.42));
const mk=(par,w)=>{const c=D.createElement('div');c.className='cat';c.dataset.p='sit';c.dataset.d='r';c.style.setProperty('--w',w+'px');
  c.innerHTML=SVG+'<span class="say"></span>';par.appendChild(c);c.h=w*.75;return c};
const put=(c,x,y,ms)=>{c.style.setProperty('--t',(ms||0)+'ms');c.style.left=x+'px';c.style.top=y+'px'};
const run=async(c,x,y,ms)=>{void c.offsetWidth;c.dataset.d=x<parseFloat(c.style.left)?'l':'r';c.dataset.p='run';put(c,x,y,ms);await wait(ms)};
const say=async(c,t,ms)=>{c.querySelector('.say').textContent=t;c.classList.add('talk');await wait(ms);c.classList.remove('talk')};

(async()=>{
  // ---------- LOADING: kucing berlari-lari ----------
  const L=$('#loader');let loaded=D.readyState==='complete';
  addEventListener('load',()=>loaded=true);setTimeout(()=>loaded=true,6000);
  if(L){
    const lc=mk($('.ltrack'),120);lc.classList.add('lcat');lc.dataset.p='run';lc.style.top='14px';
    const bar=L.querySelector('.lbar i'),pc=$('#lp'),t0=performance.now();
    await new Promise(res=>(function f(){const p=Math.min((performance.now()-t0)/2800,1)*(loaded?100:92);
      bar.style.width=p+'%';pc.textContent=Math.round(p);p>=100?res():requestAnimationFrame(f)})());
    L.classList.add('out');setTimeout(()=>L.remove(),900);
  }
  H.classList.remove('loading');

  // ---------- HERO: lari masuk, duduk, say hi, lalu interaktif dengan mouse ----------
  const hero=$('.hero'),W=cw(),hc=mk(hero,W);let hs='intro',busy=false,tx=0,mx=0,lastMv=0,stopT,n=0;
  hc.classList.add('me');
  const spot=()=>({x:Math.max(10,hero.clientWidth-W-(innerWidth<700?18:110)),y:hero.clientHeight*.95-hc.h*.93});
  const face=()=>{hc.dataset.d=mx<hc.offsetLeft+W/2?'l':'r'};
  let s0=spot();put(hc,-W-10,s0.y,0);
  await run(hc,s0.x,s0.y,T(s0.x+W));
  hc.dataset.d='r';hc.dataset.p='sit';await wait(900);
  hc.dataset.p='wave';await say(hc,'Hai! 👋',2600);hc.dataset.p='sit';hs='idle';mx=hc.offsetLeft+W;chk();

  // Mouse: kucing mengejar kursor di sepanjang hero, menoleh ke arah kursor saat duduk
  function go(){
    const cur=hc.offsetLeft,d=Math.abs(tx-cur);
    if(d<24&&hc.dataset.p!=='run'){face();return}
    const ms=Math.max(220,d/.5);
    hc.dataset.d=tx<cur?'l':'r';hc.dataset.p='run';
    put(hc,tx,parseFloat(hc.style.top),ms);
    clearTimeout(stopT);
    stopT=setTimeout(()=>{if(hs==='idle'&&!busy){hc.dataset.p='sit';face()}},ms+60);
  }
  hero.addEventListener('pointermove',e=>{
    if(e.pointerType!=='mouse')return;
    const r=hero.getBoundingClientRect();mx=e.clientX-r.left;
    tx=Math.max(8,Math.min(hero.clientWidth-W-8,mx-W/2));
    if(hs!=='idle'||busy)return;
    const t=performance.now();if(t-lastMv<90)return;lastMv=t;go();
  });
  // Klik / tap kucing: melompat & menyapa
  const talk=['Meow! 😺','Purrr~ 💕','Geli ih! 😹','Hai Dias! 👋','Elus lagi dong 🐾'];
  hc.addEventListener('click',async()=>{
    if(hs!=='idle'||busy)return;busy=true;clearTimeout(stopT);
    hc.dataset.p='wave';hc.classList.add('hop');
    await say(hc,talk[n++%talk.length],1800);
    hc.classList.remove('hop');hc.dataset.p='sit';busy=false;
  });

  // Scroll ke bawah -> lari keluar; kembali ke atas -> lari masuk lagi
  async function chk(){
    if(hs==='idle'&&scrollY>140){hs='go';clearTimeout(stopT);await run(hc,hero.clientWidth+40,parseFloat(hc.style.top),1300);hc.style.display='none';hs='gone';chk()}
    else if(hs==='gone'&&scrollY<40){hs='come';hc.style.display='';const s=spot();put(hc,-W-10,s.y,0);
      await run(hc,s.x,s.y,T(s.x+W));hc.dataset.p='sit';hc.dataset.d='r';hs='idle';chk()}
  }
  addEventListener('scroll',chk,{passive:true});
})();
})();
