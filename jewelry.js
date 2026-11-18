'use strict';
(() => {
 const items=window.PORTFOLIO_COLLECTIONS[document.body.dataset.collection],stage=document.querySelector('#jewelry-stage');
 const previous=document.querySelector('#previous-item'),next=document.querySelector('#next-item');
 const status=document.querySelector('#carousel-status'),detail=document.querySelector('#item-detail');
 const reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 let active=Math.max(0,items.findIndex(item=>'#'+item.id===location.hash)),busy=false,swiped=false;
 const cards=items.map((item,i)=>{
  const card=document.createElement('article');card.className='jewelry-card';card.setAttribute('aria-roledescription','slide');card.setAttribute('aria-label',`${i+1} of ${items.length}`);
  const button=document.createElement('button');button.className='object-button';button.setAttribute('aria-label',`View ${item.title}, ${item.material}`);
  const image=document.createElement('img');image.src=item.image;image.alt=item.alt;image.draggable=false;button.append(image);
  const title=document.createElement('h2');title.textContent=item.title;const material=document.createElement('p');material.textContent=item.material;
  card.append(button,title,material);stage.append(card);
  button.addEventListener('click',event=>{if(swiped){event.preventDefault();return;}document.querySelector('#detail-image').src=item.image;document.querySelector('#detail-image').alt=item.alt;document.querySelector('#detail-title').textContent=item.title;document.querySelector('#detail-material').textContent=item.material;detail.showModal();});
  return card;
 });
 function rank(i){return(i-active+items.length)%items.length;}
 function render(){cards.forEach((card,i)=>{card.dataset.position=Math.min(rank(i),4);card.classList.toggle('spotlight',i===active);if(i===active)card.setAttribute('aria-current','true');else card.removeAttribute('aria-current');});status.textContent=`${items[active].title}, ${items[active].material}. ${active+1} of ${items.length}.`;}
 function go(direction){
  if(busy)return;busy=true;const old=active;active=(active+direction+items.length)%items.length;
  if(reduce){render();busy=false;return;}
  if(direction>0){render();cards[old].dataset.position='-1';}
  else{const entering=cards[active];entering.classList.add('reposition');entering.dataset.position='-1';void entering.offsetWidth;entering.classList.remove('reposition');render();}
  window.setTimeout(()=>{if(direction>0){cards[old].classList.add('reposition');cards[old].dataset.position=rank(old);void cards[old].offsetWidth;cards[old].classList.remove('reposition');}busy=false;},560);
 }
 previous.addEventListener('click',()=>go(-1));next.addEventListener('click',()=>go(1));
 stage.addEventListener('keydown',event=>{if(event.key==='ArrowLeft'||event.key==='ArrowRight'){event.preventDefault();go(event.key==='ArrowRight'?1:-1);}});
 let start=null;
 stage.addEventListener('pointerdown',event=>{if(event.button!==0)return;start={x:event.clientX,y:event.clientY,id:event.pointerId};swiped=false;});
 stage.addEventListener('pointermove',event=>{if(!start||event.pointerId!==start.id)return;const dx=event.clientX-start.x,dy=event.clientY-start.y;if(Math.abs(dx)>40&&Math.abs(dx)>Math.abs(dy)*1.3){swiped=true;go(dx<0?1:-1);start=null;}});
 window.addEventListener('pointerup',()=>{start=null;window.setTimeout(()=>swiped=false,0);});stage.addEventListener('pointercancel',()=>{start=null;swiped=false;});
 let wheelLock=false;
 stage.addEventListener('wheel',event=>{if(Math.abs(event.deltaX)>Math.abs(event.deltaY)&&Math.abs(event.deltaX)>8){event.preventDefault();if(!wheelLock){go(event.deltaX>0?1:-1);wheelLock=true;window.setTimeout(()=>wheelLock=false,650);}}},{passive:false});
 detail.addEventListener('click', () => detail.close());
 render();
})();
