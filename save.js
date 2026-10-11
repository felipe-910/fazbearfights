const Save={keys:{1:'tbb_save_v4',2:'ctw_save_v1'},k:'tbb_save_v4',
rd(k){try{return JSON.parse(localStorage.getItem(k))}catch(e){return null}},
get(){return this.rd(this.k)},has(i){return !!(this.keys[i]&&this.rd(this.keys[i]))},
set(o){try{o?localStorage.setItem(this.k,JSON.stringify(o)):localStorage.removeItem(this.k)}catch(e){}},
store(){this.set({stage:G.stage,flags:G.flags,done:G.done,map:G.map,x:G.p.x,y:G.p.y,npcPos:G.npcPos})}};
