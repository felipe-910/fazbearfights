(function(){document.querySelectorAll('#pad button').forEach(b=>{const k=b.dataset.k;
const down=e=>{e.preventDefault();try{b.setPointerCapture(e.pointerId)}catch(_){}if(!keys[k])press(k);keys[k]=1;b.classList.add('on')};
const up=e=>{e.preventDefault();keys[k]=0;b.classList.remove('on')};
b.addEventListener('pointerdown',down);['pointerup','pointercancel','lostpointercapture'].forEach(t=>b.addEventListener(t,up));b.addEventListener('contextmenu',e=>e.preventDefault())});
document.getElementById('bE').addEventListener('pointerdown',e=>{e.preventDefault();press('Enter')});
document.addEventListener('gesturestart',e=>e.preventDefault());
['touchend','click','pointerup'].forEach(n=>document.addEventListener(n,()=>Aud.init(),{passive:true}));
document.addEventListener('contextmenu',e=>e.preventDefault())})();
