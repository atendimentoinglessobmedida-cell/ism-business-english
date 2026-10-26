/* Recover failed content requests without clearing saved work. */
(()=>{
 const actions=['profile','starBank','editStar','fullMock','modules','openModule','openLesson'];
 for(const name of actions){
  const original=window[name];
  window[name]=async function(...args){
   try{return await original.apply(this,args);}
   catch(error){
    const card=document.createElement('div');card.className='card recovery';
    const title=document.createElement('h2');title.textContent='Não foi possível abrir esta atividade.';
    const note=document.createElement('p');note.className='muted';note.textContent='Seu progresso salvo continua neste navegador. Verifique sua conexão e tente novamente.';
    const retry=document.createElement('button');retry.className='btn';retry.textContent='Tentar novamente';
    retry.onclick=()=>{retry.disabled=true;window[name](...args);};
    const back=document.createElement('button');back.className='btn soft';back.textContent='Voltar à jornada';back.onclick=showDashboard;
    card.append(title,note,retry,back);document.getElementById('view').replaceChildren(card);
   }
  };
 }
})();
