import {SUITS,rank,suit,color,rankName,label,deal,isSequence,sourceCards,canMove,move,legalMoves,won,validateState,puzzle,PUZZLES} from './engine.js';
import {parsePreferences,parseLevelIndex} from './startup.js';
import {createCardDrag,edgeScrollDelta} from './drag.js';
import {findAutoFinishPlan,createAutoFinishController} from './auto-finish.js';
const $=s=>document.querySelector(s),KEY='midnight-freecell-v1';
const embedded=(()=>{try{return window.self!==window.top||new URLSearchParams(location.search).get('embed')==='1';}catch{return true;}})();
let lastCardTap=null,cardDrag=null,autoCollector=null,autoSuppressed=false,autoGhost=null,autoAnimation=null;
const words={en:{edition:'HALLOWEEN COLLECTION · No. 02',eyebrow:'AN INVITATION TO THE MOONLIT MANOR',subtitle:'A little patience. Four lights in the dark.',classic:'Classic manor',puzzles:'Lantern rescue',moves:'MOVES',time:'TIME',towers:'TOWERS',freeCells:'FOUR PLACES TO PAUSE',foundations:'LIGHT THE TOWERS · A TO K',tableHint:'Alternate red & black. Build downward.',scrollCards:'Scroll columns',scrollUp:'Scroll card columns up',scrollDown:'Scroll card columns down',dragging:'Move the cards to a glowing destination. Release to place them.',autoFinish:'Finish automatically',autoStop:'Stop',autoReady:'Every remaining card can go home.',autoProgress:'Collecting {done} / {total} cards',autoCollecting:'The route is clear. Collecting the last cards…',autoPaused:'Collection stopped. Play by hand or finish automatically.',autoUndo:'Automatic collection undone. Finish again whenever you are ready.',helpAuto:'Once every remaining card can legally reach its foundation without another tableau move, the manor collects them automatically. Stop pauses collection; Undo restores the position before the collection began. After Stop or Undo, use Finish automatically to resume.',undo:'Undo',hint:'A little hint',newDeal:'New deal',retry:'Restart puzzle',footer:'Every clever move brings a little light.',helpLabel:'A LETTER FROM THE MANOR',helpTitle:'Make room.<br>Let the light in.',helpClassic:'Move all 52 cards into the four foundations, from Ace to King in the same suit. Build the eight columns downward, alternating red and black. Any card can start an empty column. Each free cell holds one card.',controlsTitle:'Drag, or select and place',helpControls:'Drag a card or an ordered run to a glowing column, free cell or foundation. You can also tap the card, then tap its destination. Double-click or double-tap a single exposed card to try its foundation. A run needs enough free cells and empty columns. In short tables, use the scroll arrows; dragging near the top or bottom of the columns also scrolls them.',helpPuzzle:'Three handcrafted endgames teach the art of making space. The same FreeCell rules apply. Each puzzle has a verified solution; the suggested move target is a friendly challenge, not a claim of the fewest possible moves.',helpHint:'Hints suggest a legal move, not a guaranteed winning solution. Foundation cards may move back. Undo is unlimited. Shortcuts: U to undo, H for a hint, Esc to stop collection, cancel a drag, or clear your selection.',play:'Enter the manor',idle:'Drag a card, or tap it and then its destination. Keep a little free space.',selected:'{card} selected · {count} card(s). Glowing spaces can receive them.',badRun:'Choose an exposed card or a descending run of alternating colors.',badMove:'That move needs a different destination or more free space.',choose:'First choose a card to move.',noHint:'No immediate legal move. Try Undo or start a fresh deal.',hintMessage:'Try {card} → {target}. This is a legal suggestion, not a solved path.',column:'column {n}',cell:'free cell {n}',foundation:'{suit} foundation',emptyCell:'Empty free cell {n}',cellOccupied:'Free cell {n}, {card}',emptyColumn:'Empty column {n}',cardAria:'{card}, column {column}, card {at}',foundationAria:'{suit} foundation, {rank} of 13',deal:'DEAL #{seed}',puzzle:'LANTERN RESCUE · {n} / 3',target:'Aim for <b>{par} moves</b>.',best:'Personal best: {moves} moves.',victoryLabel:'THE MANOR IS AWAKE',victoryTitle:'Four lights.<br>One lovely escape.',victoryCopy:'You lit all four towers in {moves} moves and {time}. Hints used: {hints}.',next:'Next letter',again:'A new invitation',share:'Share result',copySuccess:'Your manor story is copied.',shareWin:'Haunted FreeCell · I lit all four towers in {moves} moves ({time}), with {hints} hints. {deal}',shareProgress:'Haunted FreeCell · Join me at the moonlit manor. {deal}',undoToast:'One move back. A little more room.',soundOn:'Turn sound off',soundOff:'Turn sound on',how:'How to play'},zh:{edition:'万圣节游戏集 · 第 02 号',eyebrow:'来自月光庄园的一封邀请函',subtitle:'一点耐心，让暗夜里的四盏灯亮起。',classic:'经典庄园',puzzles:'灯笼救援',moves:'移动',time:'用时',towers:'塔楼',freeCells:'四个暂时停留的位置',foundations:'点亮塔楼 · 从 A 到 K',tableHint:'红黑交替，按点数递减排列。',scrollCards:'滚动牌列',scrollUp:'向上滚动牌列',scrollDown:'向下滚动牌列',dragging:'把牌拖到发光的位置，松开即可放置。',autoFinish:'自动收完',autoStop:'停止',autoReady:'剩下的牌都能安全收齐。',autoProgress:'正在收牌：{done} / {total}',autoCollecting:'归路已通，正在自动收齐最后的牌……',autoPaused:'已停止自动收牌。可手动继续，或点击自动收完。',autoUndo:'已撤销整次自动收牌，可随时再次自动收完。',helpAuto:'当剩下的牌无需再在牌列间调整，都能按规则进入收牌区时，会自动逐张收齐。点击停止可暂停；撤销会恢复到这次自动收牌开始前。停止或撤销后，可点击自动收完继续。',undo:'撤销',hint:'一点提示',newDeal:'新牌局',retry:'重试本关',footer:'每一步巧思，都会带来一点光。',helpLabel:'庄园里的一封信',helpTitle:'腾出空间，<br>让光进来。',helpClassic:'把 52 张牌按相同花色，从 A 到 K 移入四个收牌区。八列牌按点数递减、红黑交替排列。任意牌都能放入空列，每个空当只能暂存一张牌。',controlsTitle:'拖动放牌，也可点选移动',helpControls:'拖动一张牌或一组有序牌，到发光的牌列、空当或收牌区后松开。也可以先点牌，再点目的地。双击或快速轻点两次暴露的单张牌，会尝试把它移入收牌区。整组移动仍需要足够的空当和空列。矮窗口可用滚动箭头查看牌列，拖牌靠近牌列上下边缘也会自动滚动。',helpPuzzle:'三道手工设计的残局，让你练习如何腾出空间。规则与经典 FreeCell 相同，每关都有经过验证的解法。建议步数是友好的挑战目标，不代表理论最少步数。',helpHint:'提示只提供合法的一步，不保证一定通关。收牌区的牌可以移回，撤销次数不限。快捷键：U 撤销，H 提示，Esc 停止收牌、取消拖动或清除选择。',play:'进入月光庄园',idle:'拖动牌，或先点牌再点目的地。留出空当，下一步会更从容。',selected:'已选 {card}，共 {count} 张。发光位置可以接收它们。',badRun:'请选择暴露的单张牌，或红黑交替、点数递减的一组牌。',badMove:'这个移动需要其他位置，或更多中转空间。',choose:'请先选择要移动的牌。',noHint:'目前没有直接合法的移动，可以撤销或开始新牌局。',hintMessage:'试试 {card} → {target}。这是合法建议，不是完整解法。',column:'第 {n} 列',cell:'第 {n} 个空当',foundation:'{suit} 收牌区',emptyCell:'第 {n} 个空当，空闲',cellOccupied:'第 {n} 个空当，{card}',emptyColumn:'第 {n} 列，空闲',cardAria:'{card}，第 {column} 列，第 {at} 张',foundationAria:'{suit} 收牌区，已完成 {rank} / 13',deal:'牌局 #{seed}',puzzle:'灯笼救援 · {n} / 3',target:'试着在 <b>{par} 步</b>内完成。',best:'个人最佳：{moves} 步。',victoryLabel:'庄园苏醒了',victoryTitle:'四盏灯，<br>一次漂亮的解封。',victoryCopy:'你用 {moves} 步、{time} 点亮了四座塔楼。使用提示：{hints} 次。',next:'下一封来信',again:'一份新的邀请',share:'分享成绩',copySuccess:'你的庄园故事已复制。',shareWin:'鬼屋 FreeCell · 我用 {moves} 步（{time}）点亮了四座塔楼，使用了 {hints} 次提示。{deal}',shareProgress:'鬼屋 FreeCell · 来月光庄园一起解开纸牌谜题吧。{deal}',undoToast:'退后一步，腾出一点空间。',soundOn:'关闭音效',soundOff:'开启音效',how:'玩法说明'}};
let prefs;try{prefs=parsePreferences(localStorage.getItem(KEY));}catch{prefs={};}
let lang=prefs.lang==='zh'?'zh':'en',muted=!!prefs.muted,completed=prefs.completed||{},elapsed=Number(prefs.elapsed)||0,hints=Number(prefs.hints)||0,started=false,history=[],selected=null,suggestion=null,toastTimer,audio;
let state=validateState(prefs.state)&&(prefs.state.mode==='classic'||(prefs.state.mode==='puzzle'&&Number.isInteger(prefs.state.puzzleIndex)&&PUZZLES[prefs.state.puzzleIndex]))?prefs.state:deal((Date.now()>>>0)||1);
started=state.moves>0;
const t=(key,data={})=>Object.entries(data).reduce((s,[k,v])=>s.replaceAll('{'+k+'}',v),words[lang][key]||key);
const time=()=>`${Math.floor(elapsed/60)}:${String(elapsed%60).padStart(2,'0')}`;
function save(){try{localStorage.setItem(KEY,JSON.stringify({lang,muted,completed,elapsed,hints,state}));}catch{}}
function tone(complete=false){if(muted)return;try{audio??=new(window.AudioContext||window.webkitAudioContext)();if(audio.state==='suspended')audio.resume();(complete?[330,440,554,660]:[280]).forEach((f,i)=>{const o=audio.createOscillator(),g=audio.createGain(),now=audio.currentTime+i*.1;o.frequency.value=f;o.type='sine';g.gain.setValueAtTime(0,now);g.gain.linearRampToValueAtTime(.035,now+.01);g.gain.exponentialRampToValueAtTime(.001,now+.2);o.connect(g);g.connect(audio.destination);o.start(now);o.stop(now+.22);});}catch{}}
function toast(message){$('#toast').textContent=message;$('#toast').classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('#toast').classList.remove('show'),3500);}
function faceArt(c){const r=rank(c);if(r===11)return `<svg class="face-art" viewBox="0 0 80 100" aria-hidden="true"><path d="M10 92q2-24 30-27 28 3 30 27" fill="currentColor" opacity=".15"/><path d="m20 24 0-18 18 12 6 0L61 6l-2 20c12 29-2 50-20 50S6 54 20 24Z" fill="currentColor" opacity=".75"/><path d="m22 40 11 3-8 5m31-8-11 3 8 5" fill="#f4ead2"/><path d="m36 54 8 0-4 5Zm4 6q-8 7-14 0m14 0q8 7 14 0" fill="none" stroke="#f4ead2" stroke-width="2"/><path d="M13 80h54M18 86h44" stroke="currentColor" opacity=".5"/></svg>`;
 if(r===12)return `<svg class="face-art" viewBox="0 0 80 100" aria-hidden="true"><path d="M10 95q6-26 30-26 24 0 30 26" fill="currentColor" opacity=".2"/><path d="M22 42q-8 28 2 40h32q10-12 1-39" fill="currentColor" opacity=".65"/><ellipse cx="40" cy="50" rx="17" ry="23" fill="#f0d5ae"/><path d="M20 43 43 3l18 40Z" fill="currentColor"/><path d="M10 42q30-10 60 0v5H10Z" fill="currentColor"/><path d="m35 28 9-2 1 8-9 1Z" fill="none" stroke="#e4bb74" stroke-width="2"/><circle cx="34" cy="52" r="1.5" fill="#30483a"/><circle cx="47" cy="52" r="1.5" fill="#30483a"/><path d="M35 63q6 5 11-1" fill="none" stroke="#a95b48" stroke-width="1.8"/><path d="M28 80h24l-12 10Z" fill="currentColor" opacity=".65"/></svg>`;
 return `<svg class="face-art" viewBox="0 0 80 100" aria-hidden="true"><path d="M8 94q8-29 32-29 24 0 32 29" fill="currentColor" opacity=".2"/><path d="M41 30C18 18 4 47 16 65q10 16 24 9 20 7 28-12 10-25-14-33-7-2-13 1" fill="currentColor" opacity=".7"/><path d="m24 46 11-5 2 11Zm32 0-11-5-2 11ZM26 59q14 13 28 0l-6 1-3 5-6-2-6 2-3-5Z" fill="#f2e4c0"/><path d="M24 25 20 9l14 8L40 4l7 13 14-8-5 17Z" fill="#d2a762"/><path d="M26 80h28M22 87h36" stroke="currentColor" opacity=".55"/></svg>`;
}
function pipArt(c){const r=rank(c),s=SUITS[suit(c)];if(r===1)return `<svg class="ace-art" viewBox="0 0 80 100" aria-hidden="true"><path d="M40 6 67 22v51L40 95 13 73V22Z" fill="none" stroke="currentColor" opacity=".25"/><text x="40" y="69" text-anchor="middle" font-size="59" fill="currentColor" font-family="Georgia">${s}</text><path d="m34 15 6-6 6 6m-12 70 6 6 6-6" fill="none" stroke="currentColor" opacity=".4"/></svg>`;
 const positions={2:[[40,20],[40,80]],3:[[40,18],[40,50],[40,82]],4:[[20,20],[60,20],[20,80],[60,80]],5:[[20,20],[60,20],[40,50],[20,80],[60,80]],6:[[20,18],[60,18],[20,50],[60,50],[20,82],[60,82]],7:[[20,18],[60,18],[40,34],[20,50],[60,50],[20,82],[60,82]],8:[[20,18],[60,18],[40,34],[20,50],[60,50],[40,66],[20,82],[60,82]],9:[[20,13],[60,13],[20,38],[60,38],[40,50],[20,63],[60,63],[20,88],[60,88]],10:[[20,13],[60,13],[40,25],[20,38],[60,38],[20,63],[60,63],[40,76],[20,88],[60,88]]}[r];
 return `<svg class="pip-art" viewBox="0 0 80 100" aria-hidden="true">${positions.map(([x,y])=>`<text x="${x}" y="${y+6}" text-anchor="middle" font-size="24" fill="currentColor" font-family="Georgia">${s}</text>`).join('')}</svg>`;
}
function sameSource(a,b){return a&&b&&a.type===b.type&&a.index===b.index&&(a.type!=='column'||a.at===b.at);}
function cardHTML(c,from,i=0){const active=selected&&selected.type===from.type&&selected.index===from.index&&(from.type!=='column'||from.at>=selected.at);const hinted=suggestion&&sameSource(suggestion.from,from);return `<button class="card ${color(c)?'red ':''}${active?'selected ':''}${hinted?'hinted':''}" data-card="${c}" data-movable="${isSequence(sourceCards(state,from))}" data-type="${from.type}" data-index="${from.index}" ${from.type==='column'?`data-at="${from.at}"`:''} style="--i:${i}" aria-label="${from.type==='column'?t('cardAria',{card:label(c),column:from.index+1,at:from.at+1}):label(c)}" aria-pressed="${active?'true':'false'}"><span class="corner">${rankName(c)}<small>${SUITS[suit(c)]}</small></span>${rank(c)>10?faceArt(c):pipArt(c)}<span class="corner bottom">${rankName(c)}<small>${SUITS[suit(c)]}</small></span></button>`;}
function destinationClass(type,index){return (selected&&canMove(state,selected,{type,index})?' can-drop':'')+(suggestion&&suggestion.to.type===type&&suggestion.to.index===index?' hint-destination':'');}
function render(){
 cardDrag?.cancel('render');
 document.documentElement.lang=lang==='zh'?'zh-CN':'en';document.querySelectorAll('[data-i18n]').forEach(el=>el.innerHTML=t(el.dataset.i18n));$('#language').textContent=lang==='en'?'中文':'EN';$('#sound').classList.toggle('sound-off',muted);$('#sound').setAttribute('aria-label',t(muted?'soundOff':'soundOn'));$('#help').setAttribute('aria-label',t('how'));
 const isPuzzle=state.mode==='puzzle',spec=PUZZLES[state.puzzleIndex];$('#classic-mode').classList.toggle('active',!isPuzzle);$('#puzzle-mode').classList.toggle('active',isPuzzle);$('#puzzle-bar').hidden=!isPuzzle;$('#puzzle-picker').innerHTML=PUZZLES.map((p,i)=>`<button data-puzzle="${i}" class="${state.puzzleIndex===i?'active ':''}${completed[p.id]?'complete':''}">${i+1}. ${p.names[lang==='zh'?1:0]}</button>`).join('');
 if(isPuzzle)$('#puzzle-copy').innerHTML=spec.description[lang==='zh'?1:0]+' '+t('target',{par:spec.par})+(completed[spec.id]?' '+t('best',{moves:completed[spec.id]}):'');
 $('#move-count').textContent=state.moves;$('#timer').textContent=time();$('#tower-count').textContent=state.foundations.filter(r=>r===13).length+' / 4';$('#deal-label').textContent=isPuzzle?t('puzzle',{n:state.puzzleIndex+1}):t('deal',{seed:state.seed});$('#new-deal span:last-child').textContent=t(isPuzzle?'retry':'newDeal');
 $('#cells').innerHTML=state.cells.map((c,index)=>`<div class="slot${destinationClass('cell',index)}" data-target data-type="cell" data-index="${index}" role="button" tabindex="0" aria-label="${c===null?t('emptyCell',{n:index+1}):t('cellOccupied',{n:index+1,card:label(c)})}">${c===null?`<svg aria-hidden="true"><use href="#leaf"/></svg><span class="slot-label">${['I','II','III','IV'][index]}</span>`:cardHTML(c,{type:'cell',index})}</div>`).join('');
 $('#foundations').innerHTML=state.foundations.map((r,index)=>`<div class="slot foundation ${r===13?'done':''}${destinationClass('foundation',index)}" data-target data-type="foundation" data-index="${index}" role="button" tabindex="0" aria-label="${t('foundationAria',{suit:SUITS[index],rank:r})}">${r?cardHTML(index*13+r-1,{type:'foundation',index}):`<span class="slot-symbol">${SUITS[index]}</span><span class="slot-label">A → K</span>`}<span class="foundation-progress" style="width:${r/13*100}%"></span></div>`).join('');
 $('#tableau').innerHTML=state.columns.map((col,index)=>`<div class="column${destinationClass('column',index)}" data-target data-type="column" data-index="${index}" role="button" tabindex="0" aria-label="${t(col.length?'column':'emptyColumn',{n:index+1})}" style="--stack-height:calc(${Math.max(0,col.length-1)} * var(--stack-gap))"><div class="column-empty" aria-hidden="true"><svg><use href="#leaf"/></svg></div>${col.map((c,at)=>cardHTML(c,{type:'column',index,at},at)).join('')}</div>`).join('');
 document.querySelectorAll('[data-tower]').forEach(el=>el.classList.toggle('lit',state.foundations[Number(el.dataset.tower)]===13));$('#undo').disabled=!history.length;$('#hint').disabled=won(state)||!!autoCollector?.running;$('#status').textContent=autoCollector?.running?t('autoCollecting'):selected?t('selected',{card:label(sourceCards(state,selected)[0]),count:sourceCards(state,selected).length}):t('idle');
 const collecting=!!autoCollector?.running,ready=!!findAutoFinishPlan(state)?.length;document.documentElement.classList.toggle('auto-collecting',collecting);$('.table-inner').inert=collecting;$('.table-inner').setAttribute('aria-busy',String(collecting));$('#auto-finish-bar').hidden=!collecting&&!ready;$('#auto-finish').textContent=t(collecting?'autoStop':'autoFinish');$('#auto-finish-status').textContent=collecting?t('autoProgress',autoCollector.progress):t('autoReady');if(!collecting&&ready&&autoSuppressed)$('#status').textContent=t('autoPaused');
 $('#victory').hidden=!won(state);if(won(state)){if(isPuzzle)completed[spec.id]=Math.min(completed[spec.id]||Infinity,state.moves);$('#victory-copy').textContent=t('victoryCopy',{moves:state.moves,time:time(),hints});$('#victory-primary').textContent=t(isPuzzle&&state.puzzleIndex<2?'next':'again');}
 layout();save();
}
function layout(){
 cardDrag?.cancel('resize');
 const compact=embedded||window.innerHeight<=700,wide=compact&&window.innerWidth>=620&&window.innerHeight<=450;
 document.documentElement.classList.toggle('compact',compact);document.documentElement.classList.toggle('compact-wide',wide);
 const board=$('#tableau'),inner=$('.table-inner'),viewport=$('.tableau-viewport'),small=window.innerWidth<=600;
 const gap=parseFloat(getComputedStyle(inner).getPropertyValue('--gap'))||4;
 const cardWidth=(board.clientWidth-7*gap)/8,longest=Math.max(1,...state.columns.map(c=>c.length));
 const corner=board.querySelector('.card:not(:last-child) .corner:not(.bottom)'),minGap=corner?Math.max(18,Math.ceil(corner.getBoundingClientRect().bottom-corner.closest('.card').getBoundingClientRect().top)+2):18;
 let cardHeight,stackGap,contentHeight;
 if(compact){
  inner.style.setProperty('--reserve-h',Math.round(Math.max(44,Math.min(wide?50:86,cardWidth*1.36)))+'px');
  const available=viewport.clientHeight;
  cardHeight=Math.round(Math.max(50,Math.min(cardWidth*1.36,wide?78:140)));
  const fit=(available-cardHeight-4)/Math.max(1,longest-1);
  // Expose rank and suit together. Long columns scroll locally instead of hiding cards.
  stackGap=Math.max(minGap,Math.min(small?27:30,Math.floor(fit)));
  contentHeight=Math.max(available-2,cardHeight+Math.max(0,longest-1)*stackGap+4);
 }else{
  inner.style.removeProperty('--reserve-h');cardHeight=Math.round(cardWidth*1.36);
  stackGap=small?Math.max(minGap,19,Math.min(26,Math.floor(230/Math.max(6,longest-1)))):Math.max(minGap,20,Math.min(29,Math.floor(300/Math.max(6,longest-1))));
  contentHeight=Math.max(small?230:290,cardHeight+Math.max(0,longest-1)*stackGap);
 }
 inner.style.setProperty('--card-h',cardHeight+'px');inner.style.setProperty('--stack-gap',stackGap+'px');board.style.height=contentHeight+'px';
 const scroll=compact&&contentHeight>viewport.clientHeight+2,wasScrolling=!$('#scroll-tools').hidden;$('#scroll-tools').hidden=!scroll;$('#scroll-hint').textContent=t('scrollCards');$('#scroll-up').setAttribute('aria-label',t('scrollUp'));$('#scroll-down').setAttribute('aria-label',t('scrollDown'));$('#table-rule-label').hidden=scroll;if(wasScrolling!==scroll)requestAnimationFrame(layout);
}
function revealSelectedCard(){
 if(!selected||selected.type!=='column'||!document.documentElement.classList.contains('compact'))return;
 const viewport=$('.tableau-viewport'),el=$(`#tableau [data-card][data-index="${selected.index}"][data-at="${selected.at}"]`);if(!el)return;
 const r=el.getBoundingClientRect(),v=viewport.getBoundingClientRect();
 if(r.top<v.top+3)viewport.scrollTop-=v.top+3-r.top;else if(r.bottom>v.bottom-3)viewport.scrollTop+=r.bottom-v.bottom+3;
}

function perform(from,to){if(autoCollector?.running)return false;const next=move(state,from,to);if(!next)return false;history.push(state);state=next;selected=null;suggestion=null;started=true;render();tone(won(state));if(!autoSuppressed&&!document.hidden)autoCollector?.start();return true;}
function fromElement(el){const type=el.dataset.type,index=Number(el.dataset.index);return type==='column'?{type,index,at:Number(el.dataset.at)}:{type,index};}
$('.table-inner').addEventListener('click',e=>{if(won(state)||autoCollector?.running)return;const cardNode=e.target.closest('[data-card]'),zone=e.target.closest('[data-target]');if(!zone)return;const to={type:zone.dataset.type,index:Number(zone.dataset.index)};
 if(cardNode){const from=fromElement(cardNode),cardId=Number(cardNode.dataset.card),now=performance.now();const quick=lastCardTap&&lastCardTap.card===cardId&&now-lastCardTap.time<420;lastCardTap={card:cardId,time:now};if(quick){const cards=sourceCards(state,from);lastCardTap=null;if(cards.length===1&&perform(from,{type:'foundation',index:suit(cards[0])}))return;}if(sameSource(selected,from)){selected=null;suggestion=null;render();return;}if(selected&&perform(selected,to))return;const cards=sourceCards(state,from);if(!isSequence(cards)){toast(t('badRun'));return;}selected=from;suggestion=null;render();}
 else if(selected){lastCardTap=null;if(!perform(selected,to))toast(t('badMove'));}else{lastCardTap=null;toast(t('choose'));}
});
// Pointer Events keep mouse, pen and touch on the same rules path as click-to-place.
const tableRoot=$('.table-inner'),tableViewport=$('.tableau-viewport');
let dragOrigin=null,dragGhost=null,dragFrame=0,dragFrameTime=0;
function destinationAt(point){
 const node=document.elementFromPoint(point.x,point.y)?.closest('[data-target]');
 return node&&tableRoot.contains(node)?{type:node.dataset.type,index:Number(node.dataset.index)}:null;
}
function showDropTarget(point){
 tableRoot.querySelectorAll('.drop-hover,.drop-invalid').forEach(el=>el.classList.remove('drop-hover','drop-invalid'));
 const node=document.elementFromPoint(point.x,point.y)?.closest('[data-target]');
 if(node&&tableRoot.contains(node))node.classList.add(canMove(state,point.from,{type:node.dataset.type,index:Number(node.dataset.index)})?'drop-hover':'drop-invalid');
}
function dragScrollFrame(time){
 const current=cardDrag.current;
 if(!current?.active)return;
 const elapsed=dragFrameTime?time-dragFrameTime:16;dragFrameTime=time;
 const before=tableViewport.scrollTop;
 tableViewport.scrollTop+=edgeScrollDelta(current,tableViewport.getBoundingClientRect(),elapsed);
 if(tableViewport.scrollTop!==before)showDropTarget(current);
 dragFrame=requestAnimationFrame(dragScrollFrame);
}
function clearDragVisuals(current){
 cancelAnimationFrame(dragFrame);dragFrame=0;dragFrameTime=0;
 dragGhost?.remove();dragGhost=null;dragOrigin=null;
 document.documentElement.classList.remove('card-dragging');
 const remaining=sourceCards(state,selected);$('#status').textContent=remaining.length?t('selected',{card:label(remaining[0]),count:remaining.length}):t('idle');
 tableRoot.querySelectorAll('.drag-source,.can-drop,.drop-hover,.drop-invalid').forEach(el=>el.classList.remove('drag-source','can-drop','drop-hover','drop-invalid'));
 if(remaining.length)tableRoot.querySelectorAll('[data-target]').forEach(el=>el.classList.toggle('can-drop',canMove(state,selected,{type:el.dataset.type,index:Number(el.dataset.index)})));
 try{if(tableRoot.hasPointerCapture(current.pointerId))tableRoot.releasePointerCapture(current.pointerId);}catch{}
}
cardDrag=createCardDrag({
 canStart:from=>!won(state)&&!autoCollector?.running&&!$('#help-dialog').open&&isSequence(sourceCards(state,from)),
 onStart:current=>{
  lastCardTap=null;selected={...current.from};suggestion=null;
  const first=dragOrigin,rect=first.getBoundingClientRect(),cards=current.from.type==='column'?[...first.parentElement.querySelectorAll('[data-card]')].filter(el=>Number(el.dataset.at)>=current.from.at):[first];
  const gap=cards.length>1?cards[1].getBoundingClientRect().top-rect.top:0;
  dragGhost=document.createElement('div');dragGhost.className='card-drag-ghost';dragGhost.setAttribute('aria-hidden','true');dragGhost.inert=true;
  dragGhost.style.cssText=`width:${rect.width}px;height:${rect.height+gap*(cards.length-1)}px;--card-h:${rect.height}px;--stack-gap:${gap}px`;
  current.offsetX=current.start.x-rect.left;current.offsetY=current.start.y-rect.top;
  cards.forEach((el,i)=>{const copy=el.cloneNode(true);copy.classList.remove('hinted','selected');copy.style.setProperty('--i',i);copy.style.height=rect.height+'px';copy.tabIndex=-1;copy.removeAttribute('id');dragGhost.append(copy);el.classList.add('drag-source');});
  tableRoot.querySelectorAll('[data-card]').forEach(el=>{const from=fromElement(el);const active=from.type===selected.type&&from.index===selected.index&&(from.type!=='column'||from.at>=selected.at);el.classList.toggle('selected',active);el.setAttribute('aria-pressed',String(active));el.classList.remove('hinted');});
  tableRoot.querySelectorAll('[data-target]').forEach(el=>{el.classList.remove('hint-destination');el.classList.toggle('can-drop',canMove(state,current.from,{type:el.dataset.type,index:Number(el.dataset.index)}));});
  document.body.append(dragGhost);document.documentElement.classList.add('card-dragging');$('#status').textContent=t('dragging');
  try{tableRoot.setPointerCapture(current.pointerId);}catch{}
  dragFrame=requestAnimationFrame(dragScrollFrame);
 },
 onMove:current=>{if(dragGhost)dragGhost.style.transform=`translate(${current.x-current.offsetX}px,${current.y-current.offsetY}px)`;showDropTarget(current);},
 onEnd:clearDragVisuals,
 onDrop:current=>{
  const to=destinationAt(current);
  if(to&&perform(current.from,to))return true;
  render();if(to)toast(t('badMove'));return false;
 }
});
document.addEventListener('pointerdown',()=>cardDrag.clearClickGuard(),true);
tableRoot.addEventListener('pointerdown',e=>{
 const node=e.target.closest('[data-card]');
 if(node&&cardDrag.begin(e,fromElement(node)))dragOrigin=node;
});
document.addEventListener('pointermove',e=>{if(cardDrag.update(e))e.preventDefault();},{passive:false});
document.addEventListener('pointerup',e=>{const result=cardDrag.finish(e);if(result.dragged)e.preventDefault();});
function cancelCardDrag(reason){if(cardDrag.cancel(reason))render();}
document.addEventListener('pointercancel',e=>{if(cardDrag.current?.pointerId===e.pointerId)cancelCardDrag('pointercancel');});
tableRoot.addEventListener('lostpointercapture',e=>{if(cardDrag.lostCapture(e,tableRoot))render();});
tableRoot.addEventListener('dragstart',e=>e.preventDefault());
document.addEventListener('click',e=>{if(cardDrag.consumeClick(e)){e.preventDefault();e.stopImmediatePropagation();}},true);
window.addEventListener('blur',()=>{cancelCardDrag('blur');autoCollector?.cancel('blur');});
document.addEventListener('visibilitychange',()=>{if(document.hidden){cancelCardDrag('hidden');autoCollector?.cancel('hidden');}});
$('#scroll-up').onclick=()=>{tableViewport.scrollTop-=Math.max(40,tableViewport.clientHeight*.65);};
$('#scroll-down').onclick=()=>{tableViewport.scrollTop+=Math.max(40,tableViewport.clientHeight*.65);};

// The endgame proof is all-or-nothing; ordinary moves never auto-collect a partial plan.
function clearAutoVisual(){
 autoAnimation?.cancel();autoAnimation=null;autoGhost?.remove();autoGhost=null;
 document.querySelectorAll('.auto-source,.auto-target').forEach(el=>el.classList.remove('auto-source','auto-target'));
}
function animateAutoStep(step,info){
 clearAutoVisual();
 if(!info.duration)return;
 const from=step.from,source=from.type==='column'?document.querySelector(`#tableau [data-card][data-index="${from.index}"][data-at="${from.at}"]`):document.querySelector(`#cells [data-card][data-index="${from.index}"]`),target=document.querySelector(`#foundations [data-target][data-index="${step.to.index}"]`);
 if(!source||!target)return;
 if(from.type==='column'&&document.documentElement.classList.contains('compact')){
  const r=source.getBoundingClientRect(),v=tableViewport.getBoundingClientRect();
  if(r.bottom>v.bottom)tableViewport.scrollTop+=r.bottom-v.bottom;else if(r.top<v.top)tableViewport.scrollTop-=v.top-r.top;
 }
 const a=source.getBoundingClientRect(),b=target.getBoundingClientRect();
 source.classList.add('auto-source');target.classList.add('auto-target');
 autoGhost=source.cloneNode(true);autoGhost.className='card auto-collect-card'+(color(step.card)?' red':'');autoGhost.removeAttribute('id');autoGhost.setAttribute('aria-hidden','true');autoGhost.tabIndex=-1;autoGhost.inert=true;
 autoGhost.style.cssText=`position:fixed;left:${a.left}px;top:${a.top}px;width:${a.width}px;height:${a.height}px;transform-origin:top left;z-index:1100;pointer-events:none`;
 document.body.append(autoGhost);
 if(autoGhost.animate)autoAnimation=autoGhost.animate([{transform:'translate(0,0) scale(1,1)'},{transform:`translate(${b.left-a.left}px,${b.top-a.top}px) scale(${b.width/a.width},${b.height/a.height})`}],{duration:info.duration,easing:'ease-in-out',fill:'forwards'});
}
autoCollector=createAutoFinishController({
 getState:()=>state,setState:next=>{state=next;},
 duration:count=>window.matchMedia('(prefers-reduced-motion: reduce)').matches?0:Math.min(130,4000/count),
 onStart:({checkpoint})=>{cardDrag.cancel('auto-finish');lastCardTap=null;selected=null;suggestion=null;history.push(checkpoint);started=true;render();},
 onBeforeStep:animateAutoStep,
 onStep:(_step,info)=>{clearAutoVisual();if(!info.last){render();tone();}},
 onComplete:()=>{clearAutoVisual();render();tone(true);},
 onCancel:({done,checkpoint})=>{clearAutoVisual();autoSuppressed=true;if(done===0&&history.at(-1)===checkpoint)history.pop();render();}
});
$('#auto-finish').onclick=()=>{if(autoCollector.running)autoCollector.cancel('stop');else{autoSuppressed=false;autoCollector.start();}};

// Quick foundation moves use card identity across renders, so both mouse double-click and touch double-tap work.
$('.table-inner').addEventListener('keydown',e=>{if((e.key==='Enter'||e.key===' ')&&e.target.matches('[data-target]')){e.preventDefault();e.target.click();}});
function start(mode,index=0,seed=(Date.now()>>>0)||1){autoCollector?.cancel('restart');autoSuppressed=false;lastCardTap=null;state=mode==='puzzle'?puzzle(index):deal(seed);elapsed=0;hints=0;started=false;history=[];selected=null;suggestion=null;render();}
function undo(){autoCollector?.cancel('undo');if(!history.length)return;lastCardTap=null;state=history.pop();autoSuppressed=!!findAutoFinishPlan(state)?.length;selected=null;suggestion=null;render();toast(t(autoSuppressed?'autoUndo':'undoToast'));}
function hint(){if(won(state)||autoCollector?.running)return;const list=legalMoves(state);if(!list.length){toast(t('noHint'));return;}suggestion=list[0];selected=suggestion.from;hints++;render();revealSelectedCard();const target=suggestion.to.type==='foundation'?t('foundation',{suit:SUITS[suggestion.to.index]}):t(suggestion.to.type,{n:suggestion.to.index+1});toast(t('hintMessage',{card:label(sourceCards(state,selected)[0]),target}));}
async function share(){const isPuzzle=state.mode==='puzzle',descriptor=isPuzzle?PUZZLES[state.puzzleIndex].names[lang==='zh'?1:0]:t('deal',{seed:state.seed});const text=t(won(state)?'shareWin':'shareProgress',{moves:state.moves,time:time(),hints,deal:descriptor});const url=new URL(location.href);url.search=isPuzzle?'?puzzle='+(state.puzzleIndex+1):'?deal='+state.seed;try{if(navigator.share)await navigator.share({title:'Haunted FreeCell',text,url:url.href});else{await navigator.clipboard.writeText(text+'\n'+url.href);toast(t('copySuccess'));}}catch(e){if(e.name!=='AbortError')toast(text);}}
$('#classic-mode').onclick=()=>{if(state.mode!=='classic')start('classic');};$('#puzzle-mode').onclick=()=>{if(state.mode!=='puzzle')start('puzzle');};$('#puzzle-picker').onclick=e=>{const button=e.target.closest('[data-puzzle]');if(button)start('puzzle',Number(button.dataset.puzzle));};$('#new-deal').onclick=()=>start(state.mode,state.puzzleIndex);$('#undo').onclick=undo;$('#hint').onclick=hint;$('#language').onclick=()=>{autoCollector?.cancel('language');lang=lang==='en'?'zh':'en';render();};$('#sound').onclick=()=>{muted=!muted;render();if(!muted)tone();};$('#help').onclick=()=>{cancelCardDrag('help');autoCollector?.cancel('help');$('#help-dialog').showModal();};$('#close-help').onclick=$('#help-play').onclick=()=>$('#help-dialog').close();$('#help-dialog').onclick=e=>{if(e.target===$('#help-dialog')){const r=e.target.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)e.target.close();}};
$('#victory-primary').onclick=()=>{if(state.mode==='puzzle'&&state.puzzleIndex<2)start('puzzle',state.puzzleIndex+1);else start('classic');};$('#victory-share').onclick=share;
window.addEventListener('keydown',e=>{if($('#help-dialog').open||e.ctrlKey||e.metaKey||e.altKey)return;const k=e.key.toLowerCase();if(k==='u'){e.preventDefault();undo();}else if(k==='h'){e.preventDefault();hint();}else if(k==='escape'){autoCollector?.cancel('escape');selected=null;suggestion=null;render();}});window.addEventListener('resize',()=>{autoCollector?.cancel('resize');requestAnimationFrame(layout);});window.visualViewport?.addEventListener('resize',()=>{autoCollector?.cancel('resize');requestAnimationFrame(layout);});
setInterval(()=>{if(started&&!won(state)&&!document.hidden&&!$('#help-dialog').open){elapsed++;$('#timer').textContent=time();if(elapsed%10===0)save();}},1000);window.addEventListener('pagehide',()=>{cancelCardDrag('pagehide');autoCollector?.cancel('pagehide');save();});
const params=new URLSearchParams(location.search),p=parseLevelIndex(params.get('puzzle'),PUZZLES.length),d=Number(params.get('deal'));if(p!==null)start('puzzle',p);else if(params.has('deal')&&Number.isInteger(d)&&d>=0&&d<=4294967295)start('classic',0,d);else render();
