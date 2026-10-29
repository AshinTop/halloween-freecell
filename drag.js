// Pointer-gesture lifecycle shared by mouse, pen and touch. Game rules stay in engine.js.
export function createCardDrag({canStart,onStart=()=>{},onMove=()=>{},onEnd=()=>{},onDrop=()=>false,now=()=>performance.now()}){
  let gesture=null,suppressedClick=null;
  const point=e=>({x:e.clientX,y:e.clientY});
  function begin(e,from){
    // A fresh physical press must never be swallowed by the previous drag's click guard.
    if(gesture)return false;
    suppressedClick=null;
    if(e.isPrimary===false||e.button!==0||!from||!canStart(from))return false;
    gesture={pointerId:e.pointerId,pointerType:e.pointerType||'mouse',from:{...from},start:point(e),...point(e),active:false};
    return true;
  }
  function update(e){
    if(!gesture||e.pointerId!==gesture.pointerId)return false;
    Object.assign(gesture,point(e));
    const current=gesture,threshold=current.pointerType==='touch'?12:6;
    if(!current.active&&Math.hypot(current.x-current.start.x,current.y-current.start.y)>=threshold){
      current.active=true;
      onStart(current);
    }
    if(gesture===current&&current.active)onMove(current);
    return gesture===current&&current.active;
  }
  function finish(e){
    if(!gesture||e.pointerId!==gesture.pointerId)return {handled:false,dragged:false,committed:false};
    update(e);
    const current=gesture;
    if(!current)return {handled:true,dragged:false,committed:false};
    gesture=null;
    if(current.active)suppressedClick={at:now()};
    onEnd(current,'release');
    return {handled:true,dragged:current.active,committed:current.active&&!!onDrop(current)};
  }
  function cancel(reason='cancel'){
    if(!gesture)return false;
    const current=gesture;
    gesture=null;
    if(current.active)suppressedClick={at:now()};
    onEnd(current,reason);
    return current.active;
  }
  function consumeClick(e){
    // Keyboard-generated activation has detail 0 and remains available after a drag.
    if(!suppressedClick||e.detail===0)return false;
    const suppress=now()-suppressedClick.at<700;
    suppressedClick=null;
    return suppress;
  }
  function lostCapture(e,captureTarget){
    // Touch starts with implicit capture on the card. Its loss bubbles when capture
    // transfers to our stable container, but that transfer is not a cancelled drag.
    if(e.target!==captureTarget||captureTarget.hasPointerCapture(e.pointerId)||gesture?.pointerId!==e.pointerId)return false;
    return cancel('lostcapture');
  }
  return {begin,update,finish,cancel,consumeClick,lostCapture,clearClickGuard(){suppressedClick=null;},get current(){return gesture;}};
}

export function edgeScrollDelta(point,rect,elapsed=16){
  // Only scroll while the finger is INSIDE the tableau, not over the fixed foundations.
  if(point.x<rect.left||point.x>rect.right||point.y<rect.top||point.y>rect.bottom)return 0;
  const edge=Math.min(30,rect.height/3),speed=360*Math.min(32,Math.max(0,elapsed))/1000;
  if(point.y<rect.top+edge)return -speed*(1-(point.y-rect.top)/edge);
  if(point.y>rect.bottom-edge)return speed*(1-(rect.bottom-point.y)/edge);
  return 0;
}
