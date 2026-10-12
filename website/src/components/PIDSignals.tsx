import {ResponsiveContainer,LineChart,Line,XAxis,YAxis,CartesianGrid,Tooltip,ReferenceLine} from 'recharts';

interface Row { t:number; p:number; i:number; d:number; output:number; }
export default function PIDSignals({rows}:{rows:Row[]}) {
  return <details><summary>展开 P/I/D 与输出曲线，观察积分为什么造成超调</summary>
    <p>误差变为零时，已经累积的 I 项仍可能为正；速度超过目标后，负误差才逐步减少积分。超调还取决于 P、D、对象动态和限幅，Ki 增大不保证超调量始终单调增加。</p>
    <div className="signal-legend"><span>P（蓝）</span><span>I（橙）</span><span>D（灰）</span><span>输出 u（绿）</span></div>
    <div className="chart" role="img" aria-label="比例、积分、微分和控制输出随时间变化">
      <ResponsiveContainer width="100%" height="100%"><LineChart data={rows} margin={{top:10,right:18,left:0,bottom:12}}>
        <CartesianGrid strokeDasharray="3 3" opacity={.25}/>
        <XAxis dataKey="t" type="number" domain={[0,8]} tick={{fill:'var(--sl-color-gray-2)'}}/>
        <YAxis width={42} tick={{fill:'var(--sl-color-gray-2)'}}/>
        <Tooltip contentStyle={{background:'var(--sl-color-bg)',borderColor:'var(--sl-color-gray-4)'}} labelFormatter={v=>`${Number(v).toFixed(2)} s`} formatter={v=>Number(v).toFixed(3)}/>
        <ReferenceLine y={0} stroke="#8b96a8"/>
        <Line name="P项" dataKey="p" stroke="#6177dd" dot={false} isAnimationActive={false}/>
        <Line name="I项" dataKey="i" stroke="#d78728" strokeWidth={2} dot={false} isAnimationActive={false}/>
        <Line name="D项" dataKey="d" stroke="#8b96a8" dot={false} isAnimationActive={false}/>
        <Line name="限幅后的输出" dataKey="output" stroke="#17a68a" strokeWidth={2} dot={false} isAnimationActive={false}/>
      </LineChart></ResponsiveContainer>
    </div>
  </details>;
}
