import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { simulate, defaults, teachingDefaults, metrics } from '../src/lib/pid.mjs';

test('默认值逐点对齐原仓库 Python 仿真', () => {
  const reference = JSON.parse(readFileSync(new URL('./fixtures/pid-reference.json', import.meta.url)));
  const rows = simulate(defaults);
  assert.equal(rows.length, 800);
  rows.forEach((r, i) => [r.t, r.target, r.speed, r.output].forEach((x, j) => assert.ok(Math.abs(x-reference[i][j]) < 1e-9)));
});
test('同初值、同状态策略下，位置式与增量式等价', () => {
  const a = simulate(defaults), b = simulate({...defaults, mode:'incremental'});
  a.forEach((r,i) => assert.ok(Math.abs(r.speed-b[i].speed)<1e-8));
});
test('零增益保持静止，目标改变实际参与计算', () => {
  assert.ok(simulate({...defaults,kp:0,ki:0,kd:0}).every(r=>r.speed===0));
  assert.notEqual(simulate({...defaults,target:30}).at(-1).speed, simulate(defaults).at(-1).speed);
});
test('不可达目标保持有限且输出和积分有界', () => {
  const rows=simulate({...defaults,target:120,kp:.2,ki:.3,kd:.02});
  assert.ok(rows.every(r=>Object.values(r).every(Number.isFinite) && r.output>=0 && r.output<=1 && Math.abs(r.i)<=.8));
});
test('零目标超调无定义，不把未收敛报告为已稳定', () => {
  assert.equal(metrics(simulate({...defaults,target:0}),0).overshoot,null);
  assert.equal(metrics(simulate({...defaults,kp:0,ki:0,kd:0}),60).settling,null);
});
test('拒绝非有限或越界参数', () => {
  for (const change of [{kp:NaN},{target:Infinity},{ki:-1},{dt:0},{dt:.5}]) assert.throws(()=>simulate({...defaults,...change}));
});
test('非零 P 下，仅增大 Ki 能产生明确超调', () => {
  const slow=metrics(simulate(teachingDefaults),60,.5);
  const fast=metrics(simulate({...teachingDefaults,ki:.08}),60,.5);
  assert.ok(teachingDefaults.kp>0);
  assert.ok(slow.overshoot<.1);
  assert.ok(fast.overshoot>5&&fast.overshoot<8);
  assert.ok(fast.peak>63&&fast.peakTime>.5);
});
test('关闭增益变化后，4秒以后对象按同一方程连续推进', () => {
  const rows=simulate({...teachingDefaults,ki:.08});
  for(let k=399;k<rows.length-1;k++) {
    const expected=rows[k].speed+.01*(100*rows[k].output-rows[k].speed)/.25;
    assert.ok(Math.abs(rows[k+1].speed-expected)<1e-12);
  }
});
test('增量式在教学模式中也与位置式等价', () => {
  const a=simulate({...teachingDefaults,ki:.08});
  const b=simulate({...teachingDefaults,ki:.08,mode:'incremental'});
  a.forEach((r,i)=>assert.ok(Math.abs(r.speed-b[i].speed)<1e-8));
});
