'use strict';
const drawers=window.CABINET_DRAWERS;
const container=document.querySelector('#drawers');
const menu=document.querySelector('#navigation');
const menuToggles = document.querySelectorAll('#menu-toggle, #mobile-menu-toggle');
const states=[];
function configureNewTab(link, drawer) {
 if (!drawer.newTab) return;
 link.target = "_blank";
 link.rel = "noopener noreferrer";
}
function position(element,rect){const [x,y,w,h]=rect;Object.assign(element.style,{left:x/1728*100+'%',top:y/1299*100+'%',width:w/1728*100+'%',height:h/1299*100+'%'});}
function clearAll(){for(const state of states){state.pinned=false;state.hover=false;state.focus=false;state.render();}}
function preview(index){if(!container){location.href='index.html#'+drawers[index].id;return;}clearAll();const state=states[index];state.pinned=true;state.button.focus({preventScroll:true});state.button.scrollIntoView({block:'center'});state.render();}
for(const [index,drawer] of drawers.entries()){
 if(!container)continue;
 const layer=document.createElement('div');layer.className='drawer-layer';
 const image=document.createElement('img');image.src=drawer.asset;image.className='collage';image.alt='';image.setAttribute('aria-hidden','true');position(image,drawer.overlay);
 const button=document.createElement(drawer.newTab ? 'a' : 'button');button.className='hotspot';
 if(drawer.newTab){button.href=drawer.url;configureNewTab(button,drawer);}button.id=drawer.id;button.setAttribute('aria-label',drawer.name);if(!drawer.newTab)button.setAttribute('aria-pressed','false');position(button,drawer.hit);
 if(drawer.label){const label=document.createElement('span');label.className='drawer-label closed-label';label.textContent=drawer.name;label.setAttribute('aria-hidden','true');position(label,drawer.label);layer.append(label);}
 const openLabel=document.createElement('span');openLabel.className='drawer-label open-label'+(drawer.secret?' secret-label':'');openLabel.textContent=drawer.name;openLabel.setAttribute('aria-hidden','true');position(openLabel,drawer.openLabel);
 layer.append(image,openLabel,button);container.append(layer);
 const state={button,pinned:false,hover:false,focus:false,render(){layer.classList.toggle('active',this.pinned||this.hover||this.focus);if(!drawer.newTab)button.setAttribute('aria-pressed',String(this.pinned));}};states.push(state);
 button.addEventListener('pointerenter',event=>{if(event.pointerType==='mouse'){state.hover=true;state.render();}});
 button.addEventListener('pointerleave',()=>{state.hover=false;state.render();});
 button.addEventListener('focus',()=>{state.focus=button.matches(':focus-visible');state.render();});
 button.addEventListener('blur',()=>{state.focus=false;state.render();});
 button.addEventListener('click',()=>{if(drawer.newTab)return;if(drawer.url){location.href=drawer.url;return;}const wasPinned=state.pinned;clearAll();state.pinned=!wasPinned;state.render();});

}
for (const toggle of menuToggles) {
  toggle.addEventListener('click', () => {
    clearAll();
    menu.showModal();
    document.documentElement.classList.add('menu-open');
    toggle.setAttribute('aria-expanded', 'true');
  });
}
menu.addEventListener('close', () => {
  document.documentElement.classList.remove('menu-open');
  for (const toggle of menuToggles) toggle.setAttribute('aria-expanded', 'false');
});
menu.querySelector('.dismiss').addEventListener('click',()=>menu.close());
document.addEventListener('keydown',event=>{if(event.key==='Escape')clearAll();});
// Real text links stay usable with keyboard and screen readers.
const footerOrder=[4,3,2,5,6,1,0,7];
for(const [slot,index] of footerOrder.entries()){
 const drawer=drawers[index];const link=document.createElement('a');link.textContent=({ 'About me':'About Me','Junk drawer':'Junk Drawer','UX website':'UX Website' })[drawer.name]||drawer.name;link.href=drawer.url||(container?'':'index.html')+'#'+drawer.id;
 configureNewTab(link,drawer);
 link.addEventListener('click',event=>{if(!drawer.url){event.preventDefault();preview(index);}});
 document.querySelector(slot<4?'#footer-primary':'#footer-secondary').append(link);
}

// Menu order and grouping follow the supplied reference artwork.
for(const [slot,index] of [4,3,5,2,6,0,1,7].entries()){
 const drawer=drawers[index];const link=document.createElement('a');link.textContent=({ 'About me':'About Me','Junk drawer':'Junk Drawer','UX website':'UX Website' })[drawer.name]||drawer.name;link.href=drawer.url||(container?'':'index.html')+'#'+drawer.id;
 configureNewTab(link,drawer);
 link.addEventListener('click',event=>{menu.close();if(!drawer.url){event.preventDefault();preview(index);}});
 document.querySelector(slot<5?'#menu-work':'#menu-studio').append(link);
}

const catalogLink=document.createElement('a');catalogLink.textContent='Full Catalog';catalogLink.href='full-catalog.html';document.querySelector('#menu-work').append(catalogLink);
if(container){const match=drawers.findIndex(drawer=>'#'+drawer.id===location.hash);if(match>=0)preview(match);}
