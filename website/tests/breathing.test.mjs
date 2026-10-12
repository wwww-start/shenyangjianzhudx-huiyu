import test from 'node:test';
import assert from 'node:assert/strict';
import { breathingDuty, filteredPWM, risingTime } from '../src/lib/breathing.mjs';

test('呼吸包络四秒内由暗到亮再到暗，跨周期连续', () => {
  assert.deepEqual([0,1,2,3,4].map(t => breathingDuty(t)), [0,50,100,50,0]);
  assert.equal(breathingDuty(5,4),50);
});
test('平滑呼吸端点和对称性正确，手动占空比能反算对应时刻', () => {
  for(const period of [2,4,8]) {
    assert.equal(breathingDuty(0,period,'smooth'),0);
    assert.equal(breathingDuty(period/2,period,'smooth'),100);
    assert.equal(breathingDuty(period,period,'smooth'),0);
    assert.ok(Math.abs(breathingDuty(period/4,period,'smooth')-50)<1e-10);
    for(const envelope of ['smooth','linear']) for(const value of [0,1,25,50,75,99,100]) {
      const t=risingTime(value,period,envelope);
      assert.ok(Math.abs(breathingDuty(t,period,envelope)-value)<1e-10);
      assert.ok(Math.abs(breathingDuty(period-t,period,envelope)-value)<1e-10);
    }
  }
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
