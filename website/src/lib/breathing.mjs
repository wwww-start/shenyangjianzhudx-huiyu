/** Ideal 0–3.3 V source; triangle or raised-cosine envelope, no hardware I/O. */
export function breathingDuty(time, period = 4, envelope = 'linear') {
  const phase = ((time % period) + period) % period / period;
  if (envelope === 'smooth') return 50 * (1 - Math.cos(2 * Math.PI * phase));
  return 100 * (phase <= .5 ? 2 * phase : 2 * (1 - phase));
}

/** Map a manual duty selection to the rising half of the chosen envelope. */
export function risingTime(duty, period = 4, envelope = 'linear') {
  const ratio = Math.max(0, Math.min(100, duty)) / 100;
  return envelope === 'smooth'
    ? period * Math.acos(1 - 2 * ratio) / (2 * Math.PI)
    : ratio * period / 2;
}

/** Periodic steady-state RC response, solved exactly within each high/low segment.
 * duty in percent, tau in seconds, carrier fixed at 1000 Hz.
 * Samples cover 4 carrier periods; changing duty generates a new steady-state snapshot.
 */
export function filteredPWM(duty, tau = .01) {
  const ratio = Math.max(0, Math.min(100, duty)) / 100;
  const period = .001, high = ratio * period;
  const a = Math.exp(-high / tau), b = Math.exp(-(period - high) / tau);
  const lowVoltage = 3.3 * (1 - a) * b / (-Math.expm1(-period / tau));
  const peakVoltage = 3.3 + (lowVoltage - 3.3) * a;
  const rows = Array.from({ length: 801 }, (_, k) => {
    const time = k * period / 200;
    const phase = time % period;
    const voltage = phase < high
      ? 3.3 + (lowVoltage - 3.3) * Math.exp(-phase / tau)
      : peakVoltage * Math.exp(-(phase - high) / tau);
    return { time, voltage };
  });
  return { rows, average: 3.3 * ratio, ripple: peakVoltage - lowVoltage };
}
