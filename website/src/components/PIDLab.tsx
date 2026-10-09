import { useEffect, useMemo, useState } from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine } from 'recharts';
import { defaults, simulate, metrics } from '../lib/pid.mjs';

export default function PIDLab(){
  const [config,setConfig]=useState({...defaults});
  const [cursor,setCursor]=useState(799);
  const [playing,setPlaying]=useState(false);
  const rows=useMemo(()=>simulate(config),[config]);
  const summary=useMemo(()=>metrics(rows,config.target),[rows,config.target]);
  useEffect(()=>{ if(!playing)return; const id=window.setInterval(()=>setCursor(c=>{if(c>=799){setPlaying(false);return 799;}return Math.min(799,c+5);}),50);return()=>clearInterval(id); },[playing]);
  const current=rows[Math.min(cursor,rows.length-1)];
  function update(key:string,value:number|string|boolean){setConfig(c=>({...c,[key]:value}));setCursor(799);setPlaying(false);}
  const sliders=[['kp','Kp 比例增益',0,.2,.001],['ki','Ki 积分增益',0,.3,.002],['kd','Kd 微分增益',0,.02,.0005],['target','目标速度',0,120,1]] as const;
  return <section className="lab" aria-label="PID 仿真实验">
    <div className="lab-heading"><span className="eyebrow">实验 03 / CONTROL</span><h2>让一条曲线，解释 PID</h2><p>改变一个参数，观察一次完整响应。所有数据由离散模型即时计算。</p></div>
    <div className="control-grid">{sliders.map(([key,label,min,max,step])=><label key={key}>{label}<output>{config[key]}</output><input aria-label={label} type="range" min={min} max={max} step={step} value={config[key]} onChange={e=>update(key,Number(e.target.value))}/></label>)}</div>
    <div className="toolbar"><label>实现形式 <select aria-label="实现形式" value={config.mode} onChange={e=>update('mode',e.target.value)}><option value="position">位置式</option><option value="incremental">增量式（同状态策略）</option></select></label><label><input type="checkbox" checked={config.antiWindup} onChange={e=>update('antiWindup',e.target.checked)}/> 条件积分</label><button onClick={()=>{setConfig({...defaults});setCursor(799);setPlaying(false);}}>重置参数</button><button onClick={()=>{if(playing){setPlaying(false);}else{if(cursor>=799)setCursor(0);setPlaying(true);}}}>{playing?'暂停':'播放动画'}</button><button onClick={()=>{setCursor(0);setPlaying(true);}}>重新播放</button></div>
    <p className="note">采样 10 ms · 对象时间常数 0.25 s · 输出 0～1 · 积分 ±0.8 · 微分滤波 0.03 s。0.5 s 给定阶跃；4 s 对象增益从 100 降到 90。速度为教学单位。</p>
    <div className="chart-legend"><span>— 目标速度</span><span>— 实际速度</span></div><div className="chart" role="img" aria-label="目标速度与实际速度随时间变化的仿真曲线">
      <ResponsiveContainer width="100%" height="100%"><LineChart data={rows.slice(0,cursor+1)} margin={{top:15,right:15,left:0,bottom:12}}><CartesianGrid strokeDasharray="3 3" opacity={.25}/><XAxis dataKey="t" type="number" domain={[0,8]} tickCount={9} tick={{fill:'var(--sl-color-gray-2)'}} label={{value:'时间 / s',position:'insideBottom',offset:-8}}/><YAxis domain={[0,'auto']} width={42} tick={{fill:'var(--sl-color-gray-2)'}}/><Tooltip contentStyle={{background:'var(--sl-color-bg)',borderColor:'var(--sl-color-gray-4)',borderRadius:10}} labelFormatter={v=>`${Number(v).toFixed(2)} s`} formatter={(v)=>Number(v).toFixed(3)}/><ReferenceLine x={4} stroke="#ce7d1f" strokeDasharray="5 5"/><Line name="目标速度" type="stepAfter" dataKey="target" stroke="#6177dd" strokeWidth={2} dot={false} isAnimationActive={false}/><Line name="实际速度" type="linear" dataKey="speed" stroke="#17a68a" strokeWidth={3} dot={false} isAnimationActive={false}/></LineChart></ResponsiveContainer>
    </div>
    <label>查看采样时刻：{current.t.toFixed(2)} s<input aria-label="查看采样时刻" type="range" min="0" max="799" value={cursor} onChange={e=>{setPlaying(false);setCursor(Number(e.target.value));}}/></label>
    <div className="metrics"><div><small>当前误差 r − y</small><strong>{current.error.toFixed(3)}</strong></div><div><small>当前输出 u</small><strong>{current.output.toFixed(3)}</strong></div><div><small>全程超调量</small><strong>{summary.overshoot===null?'不适用':summary.overshoot.toFixed(2)+'%'}</strong></div><div><small>4 s 后 ±2% 恢复时间</small><strong>{summary.settling===null?'窗口内未确认':summary.settling.toFixed(2)+' s'}</strong></div></div>
    <p className="note">当前 P={current.p.toFixed(3)}，I={current.i.toFixed(3)}，D={current.d.toFixed(3)}；未限幅输出={current.raw.toFixed(3)}；Δu={current.delta.toFixed(3)}。超调量取完整 8 s 数据；恢复时间要求连续留在误差带至少 0.5 s。</p>
    <details><summary>读取数值表（每 0.5 s，完整数据可下载）</summary><table><thead><tr><th>t / s</th><th>目标</th><th>速度</th><th>输出</th></tr></thead><tbody>{rows.filter((_,i)=>i%50===0).map(r=><tr key={r.t}><td>{r.t.toFixed(2)}</td><td>{r.target}</td><td>{r.speed.toFixed(3)}</td><td>{r.output.toFixed(3)}</td></tr>)}</tbody></table></details>
    <button onClick={()=>{const csv='time,target,speed,output,error\n'+rows.map(r=>[r.t,r.target,r.speed,r.output,r.error].join(',')).join('\n');const url=URL.createObjectURL(new Blob([csv],{type:'text/csv'}));const a=document.createElement('a');a.href=url;a.download='pid-simulation.csv';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}}>下载本次仿真 CSV</button>
  </section>;
}
