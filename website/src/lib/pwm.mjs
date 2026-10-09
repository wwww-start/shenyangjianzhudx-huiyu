export function pwmPath(duty) {
  if(duty===0) return 'M20 140 H660';
  if(duty===100) return 'M20 50 H660';
  let wave='M20 140';
  for(let n=0;n<4;n++) {
    const x=20+n*160,edge=x+160*duty/100;
    wave+=` L${x} 50 L${edge} 50 L${edge} 140 L${x+160} 140`;
  }
  return wave;
}
