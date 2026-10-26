export const CONTACT_PROGRESS = .43;
export const POSE_STOPS = [.14,.20,.25,.29,.33,.36,.39,CONTACT_PROGRESS,.46,.49,.52,.55];
export const PLAYER_ATLAS = { columns:4, rows:3, frames:12, source:'/image/crickt-photoreal-batting-atlas.png' };

const clamp = value => Math.max(0,Math.min(1,value));
const smooth = (a,b,value) => {const t=clamp((value-a)/(b-a));return t*t*(3-2*t);};

export function frameAtProgress(progress) {
  if(progress <= POSE_STOPS[0]) return {first:0,second:0,blend:0};
  if(progress >= POSE_STOPS.at(-1)) return {first:11,second:11,blend:0};
  const second=POSE_STOPS.findIndex(stop=>stop>progress);
  const first=second-1;
  return {first,second,blend:smooth(POSE_STOPS[first],POSE_STOPS[second],progress)};
}

export function atlasCell(frame) {
  const safe=Math.max(0,Math.min(PLAYER_ATLAS.frames-1,Math.round(frame)));
  return {column:safe%PLAYER_ATLAS.columns,row:Math.floor(safe/PLAYER_ATLAS.columns)};
}

export function ballFlight(t,contact) {
  return [contact[0]+5.8*t,contact[1]+5.5*t-3.1*t*t,contact[2]-4.8*t];
}

export function photoSceneAtProgress(progress,contact) {
  const p=clamp(progress);
  const incoming=smooth(.28,CONTACT_PROGRESS,p);
  const flight=smooth(CONTACT_PROGRESS,.79,p);
  const ending=smooth(.82,.94,p);
  const approach=[contact[0]+1.7,contact[1]+.6,contact[2]+1.4];
  const position=p<=CONTACT_PROGRESS ? approach.map((value,index)=>value+(contact[index]-value)*incoming) : ballFlight(flight,contact);
  return {
    pose:frameAtProgress(p),
    position, approach, flight, ending,
    playerOpacity:Math.max(smooth(.105,.18,p)*(1-smooth(.53,.60,p)),ending),
    ballScale:(1-.63*smooth(.06,.27,p))*(1-smooth(.78,.83,p)),
  };
}
