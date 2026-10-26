(()=>{
 'use strict';
 const page=window.ISMReviewPage.mount({name:'ISM Business English · Core: blocos de três lições. Nas trilhas Premium, abra esta revisão na própria página Premium após liberar seu acesso.',brand:'#087d81',embedded:true,
  load:async()=>{
   const result=[];
   if(typeof getModule==='function'){
    const modules=await Promise.all(Object.keys(COUNTS).map(id=>getModule(Number(id))));
    for(const module of modules)for(const l of module.lessons){const practice=Array.isArray(l.practice)?l.practice:[l.practice];result.push({id:l.id,title:l.title,goal:l.objective||l.pt||l.title,section:'Core',terms:l.learn.map(([en,pt])=>({en,pt})),questions:practice.filter(Boolean).map(q=>({prompt:q.prompt,options:q.options,answer:q.options?.[q.answer],feedback:q.feedback})),sentence:l.learn[0]?.[0],dialogue:[]});}
   }
   for(const l of window.ISM_BUSINESS_PRACTICE||[])result.push({id:'practice:'+l.id,title:l.title,goal:l.goal,section:'Aulas completas',terms:l.vocabulary.map(([en,pt,example])=>({en,pt,example})),questions:l.practice.map(([prompt,answer,options,feedback])=>({prompt,answer,options,feedback})),sentence:l.order[0],dialogue:l.dialogue.map(([speaker,text,pt])=>({speaker,text,pt}))});
   for(const course of window.ISM_PREMIUM_COURSES||[])course.lessons.forEach((row,i)=>result.push({id:course.id+'-'+i,title:row[0],goal:row[1],section:'Premium · '+course.title,terms:row[4].map(value=>{const[en,pt]=value.split('|');return {en,pt};}),questions:[{prompt:row[5],options:row[6],answer:row[6]?.[row[7]],feedback:row[8]}],sentence:row[3]?.[0],dialogue:[]}));
   if(!result.length)throw Error('Content is not authorized or is still loading');return result;
  },play:text=>window.ISMAudio?.speak(text),stop:()=>window.ISMAudio?.stop()
 });
 if(!document.querySelector('header nav')){const home=document.querySelector('.intent-home > div')||document.querySelector('main');if(home){const launch=document.createElement('button');launch.type='button';launch.className='btn soft';launch.textContent='Revisão a cada três lições →';launch.style.marginTop='12px';launch.onclick=()=>page.open();home.append(launch);}}
 window.addEventListener('ism-review-content-ready',()=>page.refresh());
})();
