import test from 'node:test';
import assert from 'node:assert/strict';
import {CONTACT_PROGRESS,POSE_STOPS,PLAYER_ATLAS,frameAtProgress,atlasCell,photoSceneAtProgress} from '../photorealMotion.js';
const contact=[.37,-.5,.402];
const distance=(a,b)=>Math.hypot(...a.map((v,i)=>v-b[i]));

test('the ball meets the contact pose before it can travel towards the boundary',()=>{
  assert.equal(photoSceneAtProgress(CONTACT_PROGRESS-.001,contact).flight,0);
  const hit=photoSceneAtProgress(CONTACT_PROGRESS,contact);
  assert.equal(hit.pose.first,7);
  assert.equal(hit.pose.blend,0);
  assert.ok(distance(hit.position,contact)<1e-8);
  const after=photoSceneAtProgress(CONTACT_PROGRESS+.000001,contact);
  assert.ok(distance(after.position,contact)<1e-7,'the outgoing ball must not jump to a new origin');
  assert.ok(photoSceneAtProgress(.6,contact).position[1]>contact[1]+1);
});

test('each pose stop selects the correct photographic frame without crossing atlas cells',()=>{
  POSE_STOPS.forEach((stop,index)=>assert.equal(frameAtProgress(stop).first,index));
  for(let frame=0;frame<PLAYER_ATLAS.frames;frame++) {
    const {column,row}=atlasCell(frame);
    assert.ok(column>=0&&column<4&&row>=0&&row<3);
    assert.equal(row*4+column,frame);
  }
});

test('reverse scrolling restores exactly the same pose, blend and ball position',()=>{
  const before=photoSceneAtProgress(.35,contact);
  photoSceneAtProgress(.9,contact);
  assert.deepEqual(photoSceneAtProgress(.35,contact),before);
});

test('all scroll positions produce finite frame blends and continuous ball flight',()=>{
  let previous=photoSceneAtProgress(0,contact).position;
  for(let i=0;i<=2000;i++) {
    const state=photoSceneAtProgress(i/2000,contact);
    assert.ok(state.position.every(Number.isFinite));
    assert.ok(state.pose.blend>=0&&state.pose.blend<=1);
    assert.ok(state.playerOpacity>=0&&state.playerOpacity<=1);
    assert.ok(distance(state.position,previous)<.1,'ball trajectory must stay continuous');
    previous=state.position;
  }
});
