import {clone,validateState,sourceCards,suit,canMove,move,won} from './engine.js';

// A foundation-only move can only expose more cards and free more space. Therefore
// any legal choice is safe during this proof; a partial plan is never returned.
export function findAutoFinishPlan(state){
  if(!validateState(state))return null;
  let simulation=clone(state);
  const plan=[],remaining=52-simulation.foundations.reduce((sum,n)=>sum+n,0);
  for(let count=0;count<remaining;count++){
    const sources=[];
    simulation.columns.forEach((cards,index)=>{if(cards.length)sources.push({type:'column',index,at:cards.length-1});});
    simulation.cells.forEach((card,index)=>{if(card!==null)sources.push({type:'cell',index});});
    let step=null;
    for(const from of sources){
      const card=sourceCards(simulation,from)[0],to={type:'foundation',index:suit(card)};
      if(canMove(simulation,from,to)){step={from,to,card};break;}
    }
    if(!step)return null;
    simulation=move(simulation,step.from,step.to);
    plan.push(step);
  }
  return won(simulation)?plan:null;
}

// Timer callbacks are tied to one run and one immutable state reference. A late
// callback from a stopped game can never move a card in the next game.
export function createAutoFinishController({getState,setState,onStart=()=>{},onBeforeStep=()=>{},onStep=()=>{},onComplete=()=>{},onCancel=()=>{},duration=count=>Math.min(130,4000/count),schedule=(fn,ms)=>setTimeout(fn,ms),unschedule=id=>clearTimeout(id)}){
  let active=null;
  function cancel(reason='stop'){
    if(!active)return false;
    const run=active;active=null;
    unschedule(run.timer);
    onCancel({reason,done:run.index,total:run.plan.length,checkpoint:run.checkpoint});
    return true;
  }
  function beginStep(run){
    if(active!==run)return;
    if(getState()!==run.expected){cancel('state-changed');return;}
    const step=run.plan[run.index],info={done:run.index,total:run.plan.length,duration:run.duration};
    onBeforeStep(step,info);
    if(active!==run)return;
    run.timer=schedule(()=>{
      if(active!==run)return;
      if(getState()!==run.expected){cancel('state-changed');return;}
      const cards=sourceCards(run.expected,step.from);
      const next=cards.length===1&&cards[0]===step.card?move(run.expected,step.from,step.to):null;
      if(!next){cancel('invalid-step');return;}
      run.expected=next;setState(next);
      if(active!==run)return;
      if(getState()!==next){cancel('state-changed');return;}
      run.index++;
      onStep(step,{done:run.index,total:run.plan.length,last:run.index===run.plan.length});
      if(active!==run)return;
      if(getState()!==run.expected){cancel('state-changed');return;}
      if(run.index===run.plan.length){
        active=null;
        if(won(getState()))onComplete({done:run.index,total:run.plan.length});
        else onCancel({reason:'incomplete',done:run.index,total:run.plan.length,checkpoint:run.checkpoint});
      }else beginStep(run);
    },run.duration);
  }
  function start(){
    if(active)return false;
    const checkpoint=getState(),plan=findAutoFinishPlan(checkpoint);
    if(!plan?.length)return false;
    const run={checkpoint,expected:checkpoint,plan,index:0,timer:null,duration:Math.max(0,duration(plan.length))};
    active=run;
    onStart({checkpoint,total:plan.length});
    if(active===run)beginStep(run);
    return active===run;
  }
  return {start,cancel,get running(){return active!==null;},get progress(){return active?{done:active.index,total:active.plan.length}:null;}};
}
