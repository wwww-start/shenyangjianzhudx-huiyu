import test from 'node:test';
import assert from 'node:assert/strict';
import { breathingDuty, filteredPWM } from '../src/lib/breathing.mjs';

test('呼吸包络四秒内由暗到亮再到暗，跨周期连续', () => {
  assert.deepEqual([0,1,2,3,4].map(t => breathingDuty(t)), [0,50,100,50,0]);
  assert.equal(breathingDuty(5,4),50);
});
test('平均电压按占空比计算，端点无纹波', () => {
  assert.equal(filteredPWM(50).average,1.65);
  for (const duty of [0,100]) {
    const r=filteredPWM(duty);
    assert.ok(Math.abs(r.ripple)<1e-12);
    assert.ok(r.rows.every(x => Math.abs(x.voltage-r.average)<1e-12));
  }
});
test('RC 周期稳态平均与输入平均一致，大时间常数减小纹波', () => {
  const r=filteredPWM(25,.01),rows=r.rows;
  let integral=0;
  for(let i=1;i<rows.length;i++) integral+=(rows[i].time-rows[i-1].time)*(rows[i].voltage+rows[i-1].voltage)/2;
  assert.ok(Math.abs(integral/.004-.825)<1e-5);
  assert.ok(filteredPWM(50,.001).ripple>filteredPWM(50,.01).ripple);
  assert.ok(filteredPWM(50,.01).ripple>filteredPWM(50,.05).ripple);
  assert.ok(rows.every(x=>Number.isFinite(x.voltage)&&x.voltage>=0&&x.voltage<=3.3));
});
