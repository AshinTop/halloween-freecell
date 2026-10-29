import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import {findAutoFinishPlan,createAutoFinishController} from '../auto-finish.js';
import {puzzle,puzzleSolution,card,move,won,validateState,deal} from '../engine.js';

const col=(index,at)=>({type:'column',index,at}),cell=index=>({type:'cell',index});
function ready(){let state=puzzle(0);for(let i=0;i<4;i++)state=move(state,col(i,1),cell(i));return state;}
function clock(){
  const tasks=[];
  return {tasks,schedule:(fn,ms)=>{const task={fn,ms,cancelled:false};tasks.push(task);return task;},unschedule:task=>{if(task)task.cancelled=true;},tick(){const task=tasks.shift();if(task&&!task.cancelled)task.fn();},flush(){let n=0;while(tasks.length){assert.ok(n++<=52,'collection must be bounded by the deck');this.tick();}}};
}
function player(initial=ready(),extra={}){
  let state=initial,completed=0,cancelled=0;const timer=clock(),history=[];
  const controller=createAutoFinishController({getState:()=>state,setState:next=>{state=next;},onStart:({checkpoint})=>history.push(checkpoint),onComplete:()=>completed++,onCancel:()=>cancelled++,schedule:timer.schedule,unschedule:timer.unschedule,...extra});
  return {controller,timer,history,get state(){return state;},replace:next=>{state=next;},get completed(){return completed;},get cancelled(){return cancelled;}};
}

test('a partial foundation route is rejected until the final blocking King is freed',()=>{
  let state=puzzle(0);
  for(let i=0;i<4;i++){
    const before=structuredClone(state);
    assert.equal(findAutoFinishPlan(state),null);
    assert.deepEqual(state,before,'proof never mutates the board');
    state=move(state,col(i,1),cell(i));
  }
  const before=structuredClone(state),plan=findAutoFinishPlan(state);
  assert.equal(plan.length,8);assert.deepEqual(state,before);
  for(const step of plan){assert.equal(step.to.type,'foundation');assert.notEqual(step.from.type,'foundation');state=move(state,step.from,step.to);assert.ok(validateState(state));}
  assert.ok(won(state));assert.equal(state.moves,12);
});

test('every returned plan along all three authored puzzle routes actually wins without losing cards',()=>{
  for(let level=0;level<3;level++){
    let state=puzzle(level);assert.equal(findAutoFinishPlan(state),null,'do not skip a fresh puzzle');
    for(const [from,to] of puzzleSolution(level)){
      state=move(state,from,to);const before=structuredClone(state),plan=findAutoFinishPlan(state);
      if(plan){let checked=state;for(const step of plan){checked=move(checked,step.from,step.to);assert.ok(checked);assert.ok(validateState(checked));}assert.ok(won(checked));}
      assert.deepEqual(state,before);
    }
  }
});

test('the full remaining deck is supported; invalid states and already completed states are distinct',()=>{
  let state={mode:'classic',seed:1,columns:[...Array.from({length:4},(_,s)=>Array.from({length:13},(_,i)=>card(s,13-i))),[],[],[],[]],cells:[null,null,null,null],foundations:[0,0,0,0],moves:0};
  assert.ok(validateState(state));const plan=findAutoFinishPlan(state);assert.equal(plan.length,52);
  for(const step of plan)state=move(state,step.from,step.to);
  assert.ok(won(state));assert.equal(state.moves,52);assert.deepEqual(findAutoFinishPlan(state),[]);
  for(const bad of [null,{}, {...state,foundations:[13,13,13,12]}])assert.equal(findAutoFinishPlan(bad),null);
});

test('playback counts each real card move and signals completion exactly once',()=>{
  const t=player();assert.ok(t.controller.start());assert.equal(t.controller.start(),false);
  const first=t.timer.tasks[0];t.timer.flush();first.fn();
  assert.ok(won(t.state));assert.equal(t.state.moves,12);assert.equal(t.completed,1);assert.equal(t.cancelled,0);assert.equal(t.controller.running,false);
  assert.equal(t.history.length,1);assert.equal(t.history[0].moves,4);
  assert.equal(t.controller.start(),false);
});

test('Stop and replacement games invalidate even already-queued old timer callbacks',()=>{
  const t=player();t.controller.start();t.timer.tick();const stale=t.timer.tasks[0],stopped=t.state;
  assert.equal(stopped.moves,5);assert.ok(t.controller.cancel('stop'));stale.fn();
  assert.equal(t.state,stopped);assert.equal(t.completed,0);
  t.replace(ready());t.controller.start();const replacement=t.state;stale.fn();assert.equal(t.state,replacement);
  t.timer.flush();assert.ok(won(t.state));assert.equal(t.completed,1);
});

test('an externally replaced state or cancellation inside a step cannot continue the old plan',()=>{
  const t=player();t.controller.start();const replacement=puzzle(1);t.replace(replacement);t.timer.tick();
  assert.equal(t.state,replacement);assert.equal(t.controller.running,false);assert.equal(t.cancelled,1);
  let u;u=player(ready(),{onStep:()=>u.controller.cancel('undo')});u.controller.start();u.timer.tick();
  assert.equal(u.state.moves,5);assert.equal(u.controller.running,false);assert.equal(u.completed,0);assert.equal(u.timer.tasks.length,0);
});

test('reduced-motion playback remains asynchronous and total normal animation is at most four seconds',()=>{
  const t=player(ready(),{duration:()=>0});assert.ok(t.controller.start());assert.equal(t.state.moves,4);assert.equal(t.timer.tasks[0].ms,0);t.timer.flush();assert.ok(won(t.state));
  const full={mode:'classic',seed:1,columns:[...Array.from({length:4},(_,s)=>Array.from({length:13},(_,i)=>card(s,13-i))),[],[],[],[]],cells:[null,null,null,null],foundations:[0,0,0,0],moves:0};
  const u=player(full);u.controller.start();assert.ok(u.timer.tasks[0].ms*52<=4000);u.timer.flush();assert.equal(u.state.moves,52);
});

// Exercise the real app hooks with rendering replaced by inert callbacks. This
// catches history/suppression regressions that testing the planner alone misses.
function appHarness(){
  const source=readFileSync(new URL('../app.js',import.meta.url),'utf8'),timer=clock(),button={};
  const between=(start,end)=>source.slice(source.indexOf(start),source.indexOf(end,source.indexOf(start)));
  const context=vm.createContext({fixture:puzzle(0),move,won,findAutoFinishPlan,puzzle,deal,document:{hidden:false},window:{matchMedia:()=>({matches:false})},cardDrag:{cancel:()=>false},clearAutoVisual:()=>{},animateAutoStep:()=>{},render:()=>{},tone:()=>{},toast:()=>{},t:key=>key,$:()=>button,createAutoFinishController:options=>createAutoFinishController({...options,schedule:timer.schedule,unschedule:timer.unschedule})});
  vm.runInContext(`let state=fixture,history=[],selected=null,suggestion=null,lastCardTap=null,autoSuppressed=false,autoCollector=null,started=false,elapsed=0,hints=0;\n${between('function perform(', 'function fromElement(')}\n${between('function start(mode,','function hint(')}\n${between('autoCollector=createAutoFinishController({', "\n// Quick foundation") }\nthis.app={perform,undo,start,get state(){return state},get history(){return history},get suppressed(){return autoSuppressed},get running(){return autoCollector.running},finishOrStop:()=>$('#auto-finish').onclick()};`,context);
  return {app:context.app,timer};
}

test('real user-move hooks start an endgame, and one Undo restores the entire pre-collection board',()=>{
  const {app,timer}=appHarness();
  for(let i=0;i<4;i++)assert.ok(app.perform(col(i,1),cell(i)));
  assert.ok(app.running);assert.equal(app.state.moves,4);timer.flush();assert.ok(won(app.state));
  app.undo();assert.equal(app.state.moves,4);assert.ok(!won(app.state));assert.ok(app.suppressed);assert.equal(app.running,false);assert.equal(timer.tasks.length,0);
  app.finishOrStop();assert.ok(app.running);timer.flush();assert.ok(won(app.state));assert.equal(app.state.moves,12);
});

test('ordinary midgame Undo does not disable later automatic completion',()=>{
  const {app,timer}=appHarness();app.perform(col(0,1),cell(0));app.undo();
  assert.equal(app.state.moves,0);assert.equal(app.suppressed,false);
  for(let i=0;i<4;i++)app.perform(col(i,1),cell(i));
  assert.ok(app.running);timer.flush();assert.ok(won(app.state));
});

test('Stop before the first card removes the empty checkpoint, and restart ignores stale playback',()=>{
  const {app,timer}=appHarness();for(let i=0;i<4;i++)app.perform(col(i,1),cell(i));
  const stale=timer.tasks[0];app.finishOrStop();assert.equal(app.state.moves,4);assert.equal(app.history.length,4);assert.ok(app.suppressed);
  app.undo();assert.equal(app.state.moves,3);assert.equal(app.suppressed,false);
  app.perform(col(3,1),cell(3));assert.ok(app.running);app.start('puzzle',1);const fresh=app.state;
  stale.fn();timer.flush();assert.equal(app.state,fresh);assert.equal(app.state.puzzleIndex,1);assert.equal(app.state.moves,0);
});
