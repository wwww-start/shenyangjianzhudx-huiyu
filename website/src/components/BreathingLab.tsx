import { useEffect, useState } from 'react';
import { breathingDuty, filteredPWM, risingTime } from '../lib/breathing.mjs';
import { pwmPath } from '../lib/pwm.mjs';
import BreathingOverview from './BreathingOverview';

export default function BreathingLab() {
  const [time, setTime] = useState(0);
  const [period, setPeriod] = useState(4);
  const [playing, setPlaying] = useState(false);
  const [tau, setTau] = useState(.01);
  const [envelope, setEnvelope] = useState('smooth');
  useEffect(() => {
    if (!playing) return;
    let last = performance.now();
    const timer = window.setInterval(() => {
      const now = performance.now();
      const elapsed = (now - last) / 1000;
      last = now;
      setTime(t => (t + elapsed) % period);
    }, 20);
    return () => window.clearInterval(timer);
  }, [playing, period]);
  const duty = breathingDuty(time, period, envelope);
  const signal = filteredPWM(duty, tau);
  const averageY = 140 - 90 * duty / 100;
  const filteredPath = signal.rows.map((r, i) => `${i ? 'L' : 'M'}${20 + r.time / .004 * 640} ${140 - r.voltage / 3.3 * 90}`).join(' ');
  return <section className="lab" aria-label="PWM 呼吸灯实验">
    <span className="eyebrow">PWM → 平均效果 / BREATHING LED</span>
    <h2>用数字脉冲，实现渐变亮度</h2>
    <p>1 kHz 的 PWM 负责快速开关；缓慢变化的占空比让灯逐渐变亮，再逐渐变暗。先点击播放，也可以暂停后手动调整。</p>
    <div className="toolbar">
      <button onClick={() => setPlaying(p => !p)}>{playing ? '暂停呼吸灯' : '播放呼吸灯'}</button>
      <button onClick={() => { setTime(0); setPlaying(true); }}>重新播放呼吸灯</button>
      <button onClick={() => { setPlaying(false); setTime(0); setPeriod(4); setTau(.01); setEnvelope('smooth'); }}>重置呼吸灯</button>
      <label>一轮呼吸时间 <select aria-label="一轮呼吸时间" value={period} onChange={e => { setTime(0); setPeriod(Number(e.target.value)); }}><option value={2}>2 秒</option><option value={4}>4 秒</option><option value={8}>8 秒</option></select></label>
      <label>变化方式 <select aria-label="呼吸变化方式" value={envelope} onChange={e => { setTime(0); setEnvelope(e.target.value); }}><option value="smooth">平滑呼吸（余弦）</option><option value="linear">原代码线性渐变（三角）</option></select></label>
    </div>
    <BreathingOverview time={time} period={period} envelope={envelope}/>
    <label>查看一轮中的时刻 <output>{time.toFixed(2)} s</output><input aria-label="呼吸时间游标" type="range" min="0" max={period} step=".01" value={time} onChange={e => { setPlaying(false); setTime(Number(e.target.value)); }}/></label>
    <div className="breathing-display">
      <div className="breathing-led" role="img" aria-label={`模拟 LED，平均亮度比例约 ${duty.toFixed(1)}%`}>
        <div style={{ background: '#34d399', opacity: duty / 100, boxShadow: `0 0 ${15 + 45 * duty / 100}px ${10 * duty / 100}px #34d399` }} />
      </div>
      <div><strong>{duty.toFixed(1)}% 占空比</strong><p>理想平均电压：{signal.average.toFixed(3)} V<br/>LED 平均电流约为：{duty.toFixed(1)}% × 导通电流</p></div>
    </div>
    <label>手动设置占空比 <output>{duty.toFixed(1)}%</output><input aria-label="呼吸灯占空比" type="range" min="0" max="100" step="1" value={Math.round(duty)} onChange={e => { setPlaying(false); setTime(risingTime(Number(e.target.value),period,envelope)); }} /></label>
    <h3>放大当前时刻：PWM 与滤波电压</h3>
    <svg viewBox="0 0 700 200" role="img" aria-label="PWM 快速波形、理想平均值与 RC 滤波电压">
      <path d="M20 30V160H680" stroke="#8a9bb1" fill="none" />
      <path d={pwmPath(duty)} stroke="#6177dd" strokeWidth="2" fill="none" />
      <path d={`M20 ${averageY} H660`} stroke="#d78728" strokeWidth="2" strokeDasharray="7 5" fill="none" />
      <path d={filteredPath} stroke="#17a68a" strokeWidth="3" fill="none" />
      <text x="20" y="22" fill="#6b849e">高电平 3.3 V · 低电平 0 V</text>
      <text x="350" y="185" textAnchor="middle" fill="#6b849e">放大看 4 ms：4 个 PWM 周期</text>
    </svg>
    <p className="note">蓝色：引脚 PWM；橙色虚线：理想周期平均值；绿色：RC 滤波输出。图中每次采用当前占空比的周期稳态解，播放时逐帧更新；不模拟慢速包络切换时的 RC 过渡。</p>
    <label>RC 时间常数 <select aria-label="RC 时间常数" value={tau} onChange={e => setTau(Number(e.target.value))}><option value={.001}>1 ms（纹波明显）</option><option value={.01}>10 ms（较平滑）</option><option value={.05}>50 ms（纹波更小）</option></select></label>
    <p>当前滤波纹波约 {signal.ripple.toFixed(3)} V（峰峰值）。时间常数越大，稳态纹波通常越小，但真实电路跟随占空比变化也更慢。</p>
    <h3>为什么能“模拟”模拟信号？</h3>
    <p>理想平均电压 V̄ = D × 3.3 V。例如 D=50% 时平均值为 1.65 V，而引脚仍在 0 V 和 3.3 V 之间切换。通过 RC 低通可以得到接近平均值、仍带纹波的电压，适用于低带宽信号。</p>
    <p>呼吸灯通常让 PWM 直接控制 LED 的开关电流，不必先滤波成电压。假设每次导通电流相同，平均电流约为 D × I<sub>on</sub>，视觉呈现渐变。人的亮度感知并非严格线性，屏幕圆灯只是比例示意。</p>
    <p className="note">LED 需要限流电阻或恒流驱动；较大电流应使用合适驱动级。低有效接线下，亮灯比例可能为 1−D，应先检查极性。RC 曲线假设理想电源、无负载的一阶网络，与 LED 路径分别演示。</p>
    <details><summary>思考题：25% 占空比时，引脚是否始终输出 0.825 V？</summary><p>不是。它在每个周期的 25% 时间输出 3.3 V，其余时间输出 0 V；0.825 V 是理想平均值。滤波后才得到接近该值的电压，而且仍受纹波与负载影响。</p></details>
  </section>;
}
