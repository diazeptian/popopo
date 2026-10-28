// Name card gantung: turun dari atas, bisa ditarik-tarik, lalu berayun kembali
(()=>{
const box=document.getElementById('hang'),card=document.getElementById('ncard');
if(!box||!card)return;
const str=box.querySelector('.str');
const L=()=>innerWidth<=820?64:90;
let x=0,y=0,vx=0,vy=0,drag=false,ox=0,oy=0,running=false;
const MAXS=170; // seberapa jauh tali boleh ditarik

function render(){
  const py=L()+y,len=Math.hypot(x,py),th=Math.atan2(x,py);
  const tilt=Math.max(-14,Math.min(14,-vx*.5))*Math.PI/180;
  str.style.height=len+'px';
  str.style.transform=`rotate(${-th}rad)`;
  card.style.transform=`translate(${x}px,${py}px) rotate(${-th+tilt}rad)`;
}
function step(){
  if(!drag){vx+=-.05*x;vy+=-.05*y;vx*=.965;vy*=.965;x+=vx;y+=vy}
  render();
  if(drag||Math.abs(x)>.05||Math.abs(y)>.05||Math.abs(vx)>.05||Math.abs(vy)>.05)requestAnimationFrame(step);
  else{x=y=vx=vy=0;render();running=false}
}
const kick=()=>{if(!running){running=true;requestAnimationFrame(step)}};

card.addEventListener('pointerdown',e=>{
  drag=true;card.classList.add('grab');card.setPointerCapture(e.pointerId);
  ox=e.clientX-x;oy=e.clientY-y;vx=vy=0;kick();
});
card.addEventListener('pointermove',e=>{
  if(!drag)return;
  let nx=e.clientX-ox,ny=e.clientY-oy;
  const l=L(),minY=40-l;if(ny<minY)ny=minY;
  const len=Math.hypot(nx,l+ny),max=l+MAXS;
  if(len>max){const k=max/len;nx*=k;ny=(l+ny)*k-l}
  vx=vx*.4+(nx-x)*.6;vy=vy*.4+(ny-y)*.6;x=nx;y=ny;
});
const up=e=>{if(!drag)return;drag=false;card.classList.remove('grab');
  try{card.releasePointerCapture(e.pointerId)}catch(_){}kick()};
card.addEventListener('pointerup',up);
card.addEventListener('pointercancel',up);
addEventListener('resize',render);

// Turun dari atas setiap kali section About terlihat (scroll turun maupun naik), lalu berayun
render();
let kt;
const io=new IntersectionObserver(es=>{
  const e=es[0],on=box.classList.contains('in');
  if(e.isIntersecting&&e.intersectionRatio>=.3&&!on){
    box.classList.add('in');clearTimeout(kt);
    kt=setTimeout(()=>{vx=9;kick()},750);
  }else if(!e.isIntersecting&&on){
    box.classList.remove('in');clearTimeout(kt);
    drag=false;card.classList.remove('grab');x=y=vx=vy=0;render();
  }
},{threshold:[0,.3]});
io.observe(box);
})();
