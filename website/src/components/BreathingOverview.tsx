import { useMemo } from 'react';
import { breathingDuty } from '../lib/breathing.mjs';

/** Overview separates the slowly changing duty envelope from fixed-height pulses.
 * 24 pulse windows are representative samples, not all 1 kHz carrier cycles.
 */
export default function BreathingOverview({time,period,envelope}:{time:number;period:number;envelope:string}) {
  const {curve,bars,pulses} = useMemo(() => {
    const left=70, width=580, baseline=235, height=145, count=24, cell=width/count;
    const curve=Array.from({length:241},(_,i) => {
      const value=breathingDuty(i/240*period,period,envelope);
      return `${i?'L':'M'}${left+i/240*width} ${baseline-value/100*height}`;
    }).join(' ');
    const bars=Array.from({length:count},(_,i) => {
      const value=breathingDuty((i+.5)/count*period,period,envelope);
      return {x:left+(i+.5)*cell-4, height:value/100*height};
    });
    let pulses=`M${left} 355`;
    for(let i=0;i<count;i++) {
      const value=breathingDuty((i+.5)/count*period,period,envelope);
      const start=left+i*cell, end=start+cell*value/100;
      pulses+=` L${start} 355 L${start} 300 L${end} 300 L${end} 355 L${start+cell} 355`;
    }
    return {curve,bars,pulses};
  },[period,envelope]);
  const current=breathingDuty(time,period,envelope);
  const x=70+Math.min(1,Math.max(0,time/period))*580;
  const y=235-current/100*145;
  return <div className="breathing-overview">
    <svg viewBox="0 0 700 415" role="img" aria-label={`一轮呼吸总览：${time.toFixed(2)} 秒，占空比 ${current.toFixed(1)}%，脉冲宽度与 LED 同步变化`}>
      <text x="70" y="35" className="overview-title">PWM 波 · 一整轮呼吸</text>
      <text x="70" y="67" className="overview-muted">占空比 / 平均亮度比例</text>
      {[0,50,100].map(v=><g key={v}><path d={`M70 ${235-v/100*145} H650`} className="overview-grid"/><text x="57" y={241-v/100*145} textAnchor="end" className="overview-label">{v}%</text></g>)}
      {bars.map((b,i)=><rect key={i} x={b.x} y={235-b.height} width="8" height={b.height} rx="1" className="overview-bar"/>)}
      <path d={curve} fill="none" stroke="#10a9a7" strokeWidth="4"/>
      <path d="M70 78V235H665" className="overview-axis"/>
      <path d={`M${x} 82V355`} className="overview-cursor"/>
      <circle cx={x} cy={y} r="6" fill="#10a9a7" stroke="var(--sl-color-bg)" strokeWidth="2"/>
      <text x="70" y="272" className="overview-muted">实际 PWM：高电平固定，脉冲由窄变宽再变窄</text>
      <text x="57" y="306" textAnchor="end" className="overview-label">3.3 V</text>
      <text x="57" y="361" textAnchor="end" className="overview-label">0 V</text>
      <path d={pulses} className="overview-pulses"/>
      <path d="M70 291V355H665" className="overview-axis"/>
      {[0,.25,.5,.75,1].map(v=><text key={v} x={70+v*580} y="386" textAnchor="middle" className="overview-label">{(period*v).toFixed(1)} s</text>)}
      <text x="365" y="409" textAnchor="middle" className="overview-muted">时间 →</text>
    </svg>
    <p className="note">青色曲线与上方短柱表示占空比的连续变化及抽样值；短柱高度不是引脚电压。下方固定高度的方波展示真实 PWM 的宽度变化。为看清变化，仅展示一轮中的 24 个代表周期；1 kHz 的实际周期远多于图中数量。</p>
  </div>;
}
