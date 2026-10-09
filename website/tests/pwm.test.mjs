import test from 'node:test';
import assert from 'node:assert/strict';
import { pwmPath } from '../src/lib/pwm.mjs';
test('0% 与 100% 为持续低/高电平，没有伪造的跳变',()=>{
  assert.equal(pwmPath(0),'M20 140 H660');
  assert.equal(pwmPath(100),'M20 50 H660');
});
test('50% 波形在半周期下降',()=>assert.ok(pwmPath(50).includes('L100 50 L100 140')));
