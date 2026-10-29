import test from 'node:test';
import assert from 'node:assert/strict';
import {createCardDrag,edgeScrollDelta} from '../drag.js';
import {puzzle,puzzleSolution,move,isSequence,sourceCards,validateState,won,card} from '../engine.js';

const column=(index,at)=>({type:'column',index,at});
const event=(x,y=0,extra={})=>({pointerId:1,pointerType:'mouse',button:0,isPrimary:true,clientX:x,clientY:y,...extra});
function table(initial=puzzle(0)){
  let state=initial,target=null,time=100,starts=0,ends=0;
  const drag=createCardDrag({
    now:()=>time,
    canStart:from=>isSequence(sourceCards(state,from)),
    onStart:()=>starts++,onEnd:()=>ends++,
    onDrop:g=>{const next=move(state,g.from,target);if(!next)return false;state=next;return true;}
  });
  return {drag,get state(){return state;},set target(value){target=value;},get starts(){return starts;},get ends(){return ends;},advance:ms=>time+=ms};
}
function drop(t,from,to,extra={}){
  t.target=to;
  assert.ok(t.drag.begin(event(10,10,extra),from));
  t.drag.update(event(80,40,extra));
  return t.drag.finish(event(80,40,extra));
}

test('small mouse and touch movement remains a tap, with no game move or swallowed click',()=>{
  for(const [pointerType,distance] of [['mouse',5],['touch',11]]){
    const t=table(),before=structuredClone(t.state);
    assert.ok(t.drag.begin(event(10,10,{pointerType}),column(0,1)));
    t.target={type:'cell',index:0};
    assert.equal(t.drag.update(event(10+distance,10,{pointerType})),false);
    assert.equal(t.drag.finish(event(10+distance,10,{pointerType})).dragged,false);
    assert.deepEqual(t.state,before);
    assert.equal(t.starts,0);
    assert.equal(t.drag.consumeClick({detail:1}),false);
  }
});

test('mouse and touch drops commit exactly once and suppress their compatibility click',()=>{
  for(const pointerType of ['mouse','touch']){
    const t=table();
    const result=drop(t,column(0,1),{type:'cell',index:0},{pointerType});
    assert.equal(result.committed,true);
    assert.equal(t.state.cells[0],card(0,13));
    assert.equal(t.state.moves,1);
    assert.ok(validateState(t.state));
    assert.equal(t.drag.finish(event(80,40,{pointerType})).handled,false);
    assert.equal(t.drag.consumeClick({detail:0}),false,'keyboard activation stays available');
    assert.equal(t.drag.consumeClick({detail:1}),true);
    assert.equal(t.drag.consumeClick({detail:1}),false);
    assert.equal(t.starts,1);assert.equal(t.ends,1);
  }
});

test('illegal, same-column and outside drops preserve every card and the move count',()=>{
  for(const target of [null,{type:'foundation',index:0},{type:'column',index:0}]){
    const t=table(),before=structuredClone(t.state);
    assert.equal(drop(t,column(0,1),target).committed,false);
    assert.deepEqual(t.state,before);
    assert.ok(validateState(t.state));
  }
  const t=table();drop(t,column(0,1),{type:'cell',index:0});
  const before=structuredClone(t.state);
  assert.equal(drop(t,column(1,1),{type:'cell',index:0}).committed,false);
  assert.deepEqual(t.state,before);
});

test('a dragged ordered run obeys the real free-cell capacity and excludes its empty destination',()=>{
  const run=[card(0,13),card(1,12),card(2,11)],remaining=Array.from({length:52},(_,i)=>i).filter(c=>!run.includes(c));
  const cells=remaining.splice(0,4),columns=[run,[],[],[],[],[],[],[]];
  remaining.forEach((c,i)=>columns[2+i%6].push(c));
  const restricted={mode:'classic',seed:1,columns,cells,foundations:[0,0,0,0],moves:0};
  // One empty free cell yields capacity 2; the empty destination must not double it.
  restricted.columns[2].push(restricted.cells[0]);restricted.cells[0]=null;
  assert.ok(validateState(restricted));
  let t=table(restricted),before=structuredClone(t.state);
  assert.equal(drop(t,column(0,0),{type:'column',index:1}).committed,false);
  assert.deepEqual(t.state,before);
  const roomier=structuredClone(restricted);
  roomier.columns[2].push(roomier.cells[1]);roomier.cells[1]=null;
  t=table(roomier);
  assert.equal(drop(t,column(0,0),{type:'column',index:1}).committed,true);
  assert.deepEqual(t.state.columns[1],run);assert.deepEqual(t.state.columns[0],[]);
  assert.ok(validateState(t.state));
});

test('cancel, capture loss and a rerender invalidate stale release events without moving cards',()=>{
  for(const reason of ['pointercancel','lostcapture','render','resize','hidden']){
    const t=table(),before=structuredClone(t.state);
    t.target={type:'cell',index:0};t.drag.begin(event(0),column(0,1));t.drag.update(event(30));
    assert.equal(t.drag.cancel(reason),true);
    assert.equal(t.drag.finish(event(40)).handled,false);
    assert.deepEqual(t.state,before);
    assert.equal(t.ends,1);assert.equal(t.drag.current,null);
    // The next intentional tap must not be mistaken for the cancelled drag's click.
    t.drag.begin(event(0),column(0,1));t.drag.finish(event(1));
    assert.equal(t.drag.consumeClick({detail:1}),false);
  }
});

test('secondary pointers, non-primary buttons and invalid runs cannot start or finish a move',()=>{
  const t=table();
  assert.equal(t.drag.begin(event(0,0,{button:2}),column(0,1)),false);
  assert.equal(t.drag.begin(event(0,0,{isPrimary:false}),column(0,1)),false);
  assert.equal(t.drag.begin(event(0),column(0,0)),false,'Q then K is not a descending run');
  assert.ok(t.drag.begin(event(0),column(0,1)));
  assert.equal(t.drag.update(event(100,0,{pointerId:2})),false);
  assert.equal(t.drag.finish(event(100,0,{pointerId:2})).handled,false);
  assert.equal(t.drag.current.active,false);
  t.drag.cancel();assert.equal(t.state.moves,0);
});

test('touch capture transfer from a child keeps the drag; genuine container capture loss cancels it',()=>{
  const t=table(),before=structuredClone(t.state),child={};
  let captured=true;
  const container={hasPointerCapture:id=>captured&&id===1};
  t.target={type:'cell',index:0};
  t.drag.begin(event(10,10,{pointerType:'touch'}),column(0,1));
  t.drag.update(event(80,40,{pointerType:'touch'}));
  // The initial card's implicit capture is released when the container takes capture.
  assert.equal(t.drag.lostCapture({pointerId:1,target:child},container),false);
  assert.ok(t.drag.current.active);
  assert.equal(t.drag.lostCapture({pointerId:1,target:container},container),false,'ignore a stale loss if capture has already been regained');
  captured=false;
  assert.equal(t.drag.lostCapture({pointerId:2,target:container},container),false,'unrelated pointer');
  assert.equal(t.drag.lostCapture({pointerId:1,target:container},container),true);
  assert.equal(t.drag.finish(event(80,40,{pointerType:'touch'})).handled,false);
  assert.deepEqual(t.state,before);
  assert.equal(t.ends,1);
});

test('all three rescue puzzles can be completed through drag/drop using the same validated rules',()=>{
  for(let level=0;level<3;level++){
    const t=table(puzzle(level));
    for(const [from,to] of puzzleSolution(level)){
      assert.equal(drop(t,from,to,{pointerType:'touch'}).committed,true);
      assert.ok(validateState(t.state));
      // Each next physical press clears the prior compatibility-click guard.
    }
    assert.ok(won(t.state));
    assert.equal(t.state.moves,puzzleSolution(level).length);
  }
});

test('edge auto-scroll stops over fixed controls and bounds long-frame movement',()=>{
  const rect={left:10,right:310,top:100,bottom:200,height:100};
  assert.ok(edgeScrollDelta({x:20,y:101},rect)<0);
  assert.ok(edgeScrollDelta({x:20,y:199},rect)>0);
  for(const point of [{x:20,y:90},{x:20,y:210},{x:9,y:101},{x:311,y:199},{x:20,y:150}])assert.equal(edgeScrollDelta(point,rect),0);
  assert.equal(edgeScrollDelta({x:20,y:199},rect,60000),edgeScrollDelta({x:20,y:199},rect,32));
});
