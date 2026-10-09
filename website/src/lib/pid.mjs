/** Deterministic teaching model. No hardware or network access. */
export const defaults = {kp:.025,ki:.04,kd:.001,target:60,dt:.01,tau:.03,mode:'position',antiWindup:true};
const clamp=(v,lo,hi)=>Math.max(lo,Math.min(hi,v));
export function simulate(parameters=defaults) {
  const p={...defaults,...parameters};
  for(const key of ['kp','ki','kd','target','dt','tau']) if(!Number.isFinite(p[key])||p[key]<0) throw new RangeError(key);
  if(p.dt<=0||p.dt>.02||p.dt<.001||p.target>120||p.kp>.2||p.ki>.3||p.kd>.02||p.tau>1) throw new RangeError('simulation bounds');
  if(!['position','incremental'].includes(p.mode)) throw new RangeError('mode');
  let speed=0,previous=0,i=0,d=0,oldP=0,oldI=0,oldD=0,raw=0;
  const rows=[];
  for(let k=0;k<Math.round(8/p.dt);k++) {
    const t=k*p.dt,target=t>=.5-1e-10?p.target:0,error=target-speed;
    const proportional=p.kp*error;
    const rawD=k ? -p.kd*(speed-previous)/p.dt : 0;
    d+=p.dt/(p.tau+p.dt)*(rawD-d);
    const nextI=clamp(i+p.ki*error*p.dt,-.8,.8);
    const trial=proportional+nextI+d;
    const blocked=(trial>1&&error>0)||(trial<0&&error<0);
    if(!p.antiWindup||!blocked) i=nextI;
    const delta=proportional-oldP+(i-oldI)+(d-oldD);
    raw=p.mode==='incremental'?raw+delta:proportional+i+d;
    const output=clamp(raw,0,1);
    rows.push({t,target,speed,output,error,p:proportional,i,d,raw,delta});
    oldP=proportional; oldI=i; oldD=d; previous=speed;
    const gain=t>=4-1e-10?90:100;
    speed+=p.dt*(gain*output-speed)/.25;
  }
  return rows;
}
export function metrics(rows,target) {
  const active=rows.filter(r=>r.t>=.5);
  const peak=Math.max(0,...active.map(r=>r.speed));
  // Settling time refers to the post-gain-change segment. Require 0.5 s observed dwell.
  let lastOutside=3.99;
  for(const r of rows) if(r.t>=4&&Math.abs(r.speed-target)>Math.max(.02*Math.abs(target),.01)) lastOutside=r.t;
  const candidate=rows.find(r=>r.t>lastOutside&&r.t>=4)?.t;
  return {error:rows.at(-1)?.error??0,overshoot:target>0?Math.max(0,(peak-target)/target*100):null,
    settling:candidate!==undefined&&rows.at(-1).t-candidate>=.5?candidate-4:null};
}
