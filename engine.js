export const SUITS=['♠','♥','♣','♦'];
export const rank=card=>card%13+1;
export const suit=card=>Math.floor(card/13);
export const color=card=>suit(card)%2;
export const card=(s,r)=>s*13+r-1;
export const rankName=card=>({1:'A',11:'J',12:'Q',13:'K'}[rank(card)]||String(rank(card)));
export const label=card=>rankName(card)+SUITS[suit(card)];
export function clone(state){return {...state,columns:state.columns.map(c=>[...c]),cells:[...state.cells],foundations:[...state.foundations]};}
function rand(s){let x=s||0x9e3779b9;x^=x<<13;x^=x>>>17;x^=x<<5;return x>>>0;}
export function deal(seed=1){
  const deck=Array.from({length:52},(_,i)=>i);let r=seed>>>0;
  for(let i=51;i>0;i--){r=rand(r);const j=r%(i+1);[deck[i],deck[j]]=[deck[j],deck[i]];}
  const columns=Array.from({length:8},()=>[]);deck.forEach((c,i)=>columns[i%8].push(c));
  return {mode:'classic',seed:seed>>>0,columns,cells:Array(4).fill(null),foundations:[0,0,0,0],moves:0};
}
export function isSequence(cards){return cards.length>0&&cards.every((c,i)=>!i||(rank(cards[i-1])===rank(c)+1&&color(cards[i-1])!==color(c)));}
export function sourceCards(state,from){
  if(!from||!Number.isInteger(from.index))return [];
  if(from.type==='column'&&from.index>=0&&from.index<8){const a=state.columns[from.index];return Number.isInteger(from.at)&&from.at>=0&&from.at<a.length?a.slice(from.at):[];}
  if(from.type==='cell'&&from.index>=0&&from.index<4){const c=state.cells[from.index];return c===null?[]:[c];}
  if(from.type==='foundation'&&from.index>=0&&from.index<4){const r=state.foundations[from.index];return r?[card(from.index,r)]:[];}
  return [];
}
export function capacity(state,toColumn){
  const free=state.cells.filter(c=>c===null).length;
  const empty=state.columns.filter((c,i)=>!c.length&&i!==toColumn).length;
  return (free+1)*2**empty;
}
export function canMove(state,from,to){
  if(!to||!Number.isInteger(to.index)||(from?.type===to.type&&from?.index===to.index))return false;
  const cards=sourceCards(state,from);if(!isSequence(cards))return false;
  if(to.type==='cell')return to.index>=0&&to.index<4&&cards.length===1&&state.cells[to.index]===null;
  if(to.type==='foundation')return to.index>=0&&to.index<4&&cards.length===1&&suit(cards[0])===to.index&&rank(cards[0])===state.foundations[to.index]+1;
  if(to.type==='column'&&to.index>=0&&to.index<8){const dest=state.columns[to.index];return cards.length<=capacity(state,to.index)&&(!dest.length||(color(dest.at(-1))!==color(cards[0])&&rank(dest.at(-1))===rank(cards[0])+1));}
  return false;
}
export function move(state,from,to){
  if(!canMove(state,from,to))return null;
  const next=clone(state),cards=sourceCards(state,from);
  if(from.type==='column')next.columns[from.index].splice(from.at);
  else if(from.type==='cell')next.cells[from.index]=null;
  else next.foundations[from.index]--;
  if(to.type==='column')next.columns[to.index].push(...cards);
  else if(to.type==='cell')next.cells[to.index]=cards[0];
  else next.foundations[to.index]++;
  next.moves++;return next;
}
export const won=state=>state.foundations.every(r=>r===13);
export function legalMoves(state){
  const sources=[];state.columns.forEach((col,index)=>col.forEach((c,at)=>{if(isSequence(col.slice(at)))sources.push({type:'column',index,at});}));
  state.cells.forEach((c,index)=>{if(c!==null)sources.push({type:'cell',index});});state.foundations.forEach((r,index)=>{if(r)sources.push({type:'foundation',index});});
  const destinations=[...Array.from({length:4},(_,index)=>({type:'foundation',index})),...Array.from({length:8},(_,index)=>({type:'column',index})),...Array.from({length:4},(_,index)=>({type:'cell',index}))];
  const result=[];for(const from of sources)for(const to of destinations){if(from.type==='cell'&&to.type==='cell')continue;if(from.type==='column'&&from.at===0&&to.type==='column'&&!state.columns[to.index].length)continue;if(canMove(state,from,to))result.push({from,to});}
  return result.sort((a,b)=>hintScore(state,b)-hintScore(state,a));
}
function hintScore(state,m){return (m.to.type==='foundation'?1000:0)+(m.from.type==='cell'?50:0)+(m.from.type==='column'&&m.from.at===0?40:0)+(m.to.type==='column'&&state.columns[m.to.index].length?20:0)-(m.from.type==='foundation'?1500:0)-(m.to.type==='cell'?10:0);}
export function validateState(state){
  if(!state||!Array.isArray(state.columns)||state.columns.length!==8||state.columns.some(c=>!Array.isArray(c))||!Array.isArray(state.cells)||state.cells.length!==4||!Array.isArray(state.foundations)||state.foundations.length!==4||!state.foundations.every(r=>Number.isInteger(r)&&r>=0&&r<=13))return false;
  const cards=[...state.columns.flat(),...state.cells.filter(c=>c!==null)];state.foundations.forEach((r,s)=>{for(let i=1;i<=r;i++)cards.push(card(s,i));});
  return cards.length===52&&new Set(cards).size===52&&cards.every(c=>Number.isInteger(c)&&c>=0&&c<52)&&Number.isInteger(state.moves)&&state.moves>=0;
}

export const PUZZLES=[
 {id:'west-tower',names:['The west tower','西塔的来信'],description:['Give the kings a place to wait. Free the queens beneath them.','为国王找一个临时落脚点，解放压在下面的王后。'],foundations:[11,11,11,11],columns:[[card(0,12),card(0,13)],[card(1,12),card(1,13)],[card(2,12),card(2,13)],[card(3,12),card(3,13)],[],[],[],[]],par:12},
 {id:'moon-ball',names:['The moonlight ball','月光舞会'],description:['Four guests are blocking the dance floor. Reserve space before you begin.','四位客人挡住了舞池，开始前先规划临时位置。'],foundations:[10,10,10,10],columns:[[card(0,11),card(1,12),card(2,13)],[card(1,11),card(2,12),card(3,13)],[card(2,11),card(3,12),card(0,13)],[card(3,11),card(0,12),card(1,13)],[],[],[],[]],par:20},
 {id:'last-candle',names:['The last candle','最后一支蜡烛'],description:['Every column is occupied. Use the four free cells to open the manor.','每列都被占用了。利用四个空当，为庄园打开通路。'],foundations:[9,9,9,9],columns:[[card(0,10),card(1,13)],[card(1,10),card(0,13)],[card(2,10),card(3,13)],[card(3,10),card(2,13)],[card(0,11),card(1,12)],[card(1,11),card(0,12)],[card(2,11),card(3,12)],[card(3,11),card(2,12)]],par:24}
];
export function puzzle(index){const p=PUZZLES[index];if(!p)throw new Error('Unknown puzzle');return {mode:'puzzle',puzzleIndex:index,seed:0,columns:p.columns.map(c=>[...c]),foundations:[...p.foundations],cells:Array(4).fill(null),moves:0};}
export function puzzleSolution(index){
 const path=[];const c=(index,at)=>({type:'column',index,at}),cell=index=>({type:'cell',index}),f=index=>({type:'foundation',index});
 if(index===0){for(let i=0;i<4;i++){path.push([c(i,1),cell(i)],[c(i,0),f(i)],[cell(i),f(i)]);}}
 if(index===1){for(let i=0;i<4;i++)path.push([c(i,2),cell(i)]);for(let i=0;i<4;i++)path.push([c(i,1),{type:'column',index:i+4}]);for(let i=0;i<4;i++)path.push([c(i,0),f(i)]);for(let i=0;i<4;i++)path.push([c(i+4,0),f((i+1)%4)]);for(let i=0;i<4;i++)path.push([cell(i),f((i+2)%4)]);}
 if(index===2){const kings=[1,0,3,2],queens=[1,0,3,2];for(let i=0;i<4;i++)path.push([c(i,1),cell(i)]);for(let i=0;i<4;i++)path.push([c(i,0),f(i)]);for(let i=0;i<4;i++)path.push([c(i+4,1),{type:'column',index:i}]);for(let i=0;i<4;i++)path.push([c(i+4,0),f(i)]);for(let i=0;i<4;i++)path.push([c(i,0),f(queens[i])]);for(let i=0;i<4;i++)path.push([cell(i),f(kings[i])]);}
 return path;
}
