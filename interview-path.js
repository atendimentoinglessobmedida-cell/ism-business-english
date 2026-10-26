/* P1 only: all progress remains in ismbe:premium:p1:v1. */
let guided = [];
let activeSimulation = null;
const textFilled = value => typeof value === 'string' && value.trim().length > 0;
const arg = value => esc(JSON.stringify(value));
const profileCount = () => Object.values(st.profile).filter(textFilled).length;
const storyCount = () => st.stars.filter(s => ['situation','task','action','result','learning'].every(k => textFilled(s[k]))).length;
const lessonCount = modules => Object.entries(st.lessons).filter(([id,done]) => done && modules.includes(Number(id.split('.')[0])) && /^[0-9]+\.[1-6]$/.test(id)).length;
function simQuestions(sim) {
  return [{prompt:sim.opening,target:[]}, ...sim.turns];
}
function simRecord(sim) {
  const old = st.sims[sim.id];
  // Keep legacy text verbatim, as the answer to the opening question.
  if (typeof old === 'string') return {answers:[old], drafts:{}, legacy:true};
  return old && Array.isArray(old.answers) ? old : {answers:[],drafts:{}};
}
function answeredCount(sim) {
  const record = simRecord(sim), questions = simQuestions(sim);
  let count = 0;
  while (count < questions.length && textFilled(record.answers[count])) count++;
  return count;
}
function simComplete(sim) { return answeredCount(sim) === simQuestions(sim).length; }
function stageProgress(id) {
  let current=0,total=1,unit='concluído';
  if(id===1){current=Array.from({length:8},(_,i)=>Number(st.diag[i])).filter(n=>n>=1&&n<=5).length;total=8;unit='competências';}
  if(id===2){current=profileCount();total=6;unit='campos mínimos';}
  if(id===3){current=lessonCount([13,14]);total=12;unit='lições';}
  if(id===4){current=storyCount();total=5;unit='histórias completas';}
  if([5,6,7].includes(id)){current=lessonCount([id+10]);total=6;unit='lições';}
  if(id===8){current=guided.filter(simComplete).length;total=4;unit='conversas completas';}
  if(id===9){current=st.mock.completed&&Array.from({length:11},(_,i)=>st.mock[i]).every(textFilled)?1:0;unit='entrevista';}
  if(id===10){current=st.action.completed&&['answers','language','next'].every(k=>textFilled(st.action[k]))?1:0;unit='plano';}
  current=Math.min(current,total);
  return {current,total,unit,percent:Math.round(current/total*100)};
}
function stepDone(id){const p=stageProgress(id);return p.current===p.total;}
function mastery(){return [2,3,4,5,6,7,8,9,10].every(stepDone);}
function progressBar(percent,label){return '<div class="bar" role="progressbar" aria-label="'+esc(label)+'" aria-valuemin="0" aria-valuemax="100" aria-valuenow="'+percent+'"><i style="width:'+percent+'%"></i></div>';}
async function init(){
  $('view').innerHTML='<div class="card" role="status">Carregando Interview Lab…</div>';
  try{
    const [c,p,s]=await Promise.all([j(CONTENT),j(PATH),j(SIMS+'?module=P1')]);
    if(!Array.isArray(p.data?.stages)||!Array.isArray(s.data))throw Error('invalid data');
    catalog=c.data;pathway=p.data;guided=s.data.filter(sim=>sim.module==='P1');
    if(guided.length!==4||guided.some(sim=>!textFilled(sim.opening)||!Array.isArray(sim.turns)||!sim.turns.length||sim.turns.some(t=>!textFilled(t.prompt))))throw Error('invalid simulations');
    showDashboard();
  }catch(error){$('view').innerHTML='<div class="card"><h3>Não foi possível carregar o Interview Lab.</h3><p class="muted">Seu progresso salvo continua neste navegador.</p><button class="btn" onclick="init()">TENTAR NOVAMENTE</button></div>';}
}
function showDashboard(){
  activeSimulation=null;
  if(!pathway||!guided.length)return init();
  const completed=pathway.stages.filter(s=>stepDone(s.id)).length;
  const percent=Math.round(pathway.stages.reduce((sum,s)=>sum+stageProgress(s.id).percent,0)/pathway.stages.length);
  $('view').innerHTML='<div class="hero"><span class="badge">👑 PREMIUM BONUS 01</span><h2 style="margin-top:10px">Job Interview Mastery Path</h2><p class="muted">Diagnose → Build → Learn → Practice → Simulate → Reflect → Repeat</p>'+progressBar(percent,'Progresso da jornada')+'<p><b>'+percent+'% da jornada • '+completed+'/10 etapas</b></p><p>'+lessonCount([13,14,15,16,17])+'/30 lições • '+storyCount()+'/5 STAR stories • '+guided.filter(simComplete).length+'/4 simulações</p><small class="muted">Média das 10 etapas. Progresso Premium salvo neste navegador.</small></div>'+(mastery()?'<div class="card"><h3>🏆 GLOBAL INTERVIEWER</h3><p class="muted">Jornada completa registrada.</p></div>':'')+pathway.stages.map(s=>{
    const p=stageProgress(s.id), done=stepDone(s.id), started=p.current>0||(s.id===8&&guided.some(sim=>answeredCount(sim)>0));
    return '<div class="card step '+(done?'done':started?'in-progress':'')+'"><div class="stepHead"><div class="num">'+(done?'✓':s.id)+'</div><div><div class="ey">ETAPA '+s.id+'</div><h3>'+esc(s.title)+'</h3><p class="muted">'+esc((s.outcomes||[]).slice(0,2).join(' • '))+'</p></div></div><div class="stage-status"><b>'+(done?'Concluída':started?'Em andamento':'Não iniciada')+'</b><span>'+p.current+'/'+p.total+' '+p.unit+'</span></div>'+progressBar(p.percent,s.title)+'<button class="btn '+(s.id===9?'gold':'soft')+' wide" onclick="openStage('+s.id+')">'+(done?'REVISAR':started?'CONTINUAR':'INICIAR')+' →</button></div>';
  }).join('');
  window.scrollTo(0,0);
}
function simulations(){
  activeSimulation=null;
  $('view').innerHTML='<div class="card"><div class="ey">ETAPA 8</div><h2>Guided Interview Simulations</h2><p class="muted">Responda à abertura e às perguntas seguintes, uma por vez. Você pode sair e continuar depois.</p></div>'+guided.map(sim=>{
    const n=answeredCount(sim),total=simQuestions(sim).length;
    return '<div class="card"><h3>'+esc(sim.title)+'</h3><p class="muted">'+esc(sim.goal)+'</p><p>'+n+'/'+total+' respostas • '+(simComplete(sim)?'Concluída':n?'Em andamento':'Não iniciada')+'</p>'+progressBar(Math.round(n/total*100),sim.title)+'<button class="btn wide" onclick="openSimulation('+arg(sim.id)+')">'+(simComplete(sim)?'REVISAR CONVERSA':n?'CONTINUAR':'INICIAR')+'</button></div>';
  }).join('');
  window.scrollTo(0,0);
}
function openSimulation(id,index){
  const sim=guided.find(s=>s.id===id);if(!sim)return simulations();
  const count=answeredCount(sim),questions=simQuestions(sim);
  activeSimulation={id,index:index===undefined?count:Math.max(0,Math.min(index,count,questions.length-1))};
  renderConversation();
}
function renderConversation(){
  const {id,index}=activeSimulation,sim=guided.find(s=>s.id===id),questions=simQuestions(sim),record=simRecord(sim);
  const complete=index>=questions.length;
  $('view').innerHTML='<button class="btn soft" onclick="simulations()">← SIMULAÇÕES</button><div class="card"><h2>'+esc(sim.title)+'</h2><p class="muted">'+esc(sim.goal)+'</p>'+progressBar(Math.round(answeredCount(sim)/questions.length*100),sim.title)+'<p>'+answeredCount(sim)+'/'+questions.length+' respostas salvas</p></div><div id="conversation">'+questions.slice(0,complete?questions.length:index).map((q,i)=>'<div class="card"><div class="bubble"><b>Interviewer</b><p>'+esc(q.prompt)+'</p></div><div class="bubble you"><b>Você</b><p>'+esc(record.answers[i])+'</p></div><button class="btn soft" onclick="openSimulation('+arg(id)+','+i+')">EDITAR RESPOSTA '+(i+1)+'</button></div>').join('')+'</div>'+(complete?'<div class="card"><h3>✓ Conversa concluída</h3><p class="muted">Revise a relevância, a clareza e as evidências das suas respostas. Esta prática não avalia pronúncia, gramática ou potencial de contratação.</p><details><summary>Ver exemplo de resposta</summary><div class="bubble">'+esc(sim.model)+'</div><button class="audio" onclick="speak('+arg(sim.model)+')">▶ OUVIR MODELO</button></details><p class="muted">Critérios para reflexão: '+esc((sim.criteria||[]).join(' • '))+'</p><button class="btn wide" onclick="simulations()">VOLTAR ÀS SIMULAÇÕES</button></div>':conversationForm(sim,questions[index],record,index));
  if(!complete)$('simAnswer').focus();else window.scrollTo(0,0);
}
function conversationForm(sim,q,record,index){
  const answer=record.drafts?.[index]??record.answers[index]??'';
  return '<div class="card"><div class="ey">PERGUNTA '+(index+1)+' DE '+simQuestions(sim).length+'</div><div class="bubble"><b>Interviewer</b><h3>'+esc(q.prompt)+'</h3></div><button class="audio" onclick="speak('+arg(q.prompt)+')">▶ OUVIR</button>'+((q.target||[]).length?'<p class="muted">Pontos de apoio: '+q.target.map(t=>'<span class="pill">'+esc(t)+'</span>').join('')+'</p>':'')+'<label for="simAnswer"><b>Sua resposta em inglês</b></label><textarea id="simAnswer" oninput="saveSimDraft()" placeholder="Use sua experiência real…">'+esc(answer)+'</textarea><p id="simStatus" class="status-note" role="status">O rascunho é salvo enquanto você digita.</p><div class="sim-actions">'+(index?'<button class="btn soft" onclick="openSimulation('+arg(sim.id)+','+(index-1)+')">← ANTERIOR</button>':'')+'<button class="btn" id="submitSim" onclick="saveSim()" '+(!textFilled(answer)?'disabled':'')+'>'+(index===simQuestions(sim).length-1?'CONCLUIR CONVERSA':'SALVAR E CONTINUAR →')+'</button></div></div>';
}
function saveSimDraft(){
  if(!activeSimulation)return;
  const {id,index}=activeSimulation,sim=guided.find(s=>s.id===id),record=simRecord(sim);
  record.drafts={...record.drafts,[index]:$('simAnswer').value};st.sims[id]=record;
  $('submitSim').disabled=!textFilled($('simAnswer').value);
  try{save();$('simStatus').textContent='Rascunho salvo neste navegador.';}
  catch(error){$('simStatus').textContent='Não foi possível salvar. Mantenha esta página aberta e copie sua resposta.';}
}
function saveSim(){
  if(!activeSimulation||!textFilled($('simAnswer').value))return;
  const {id,index}=activeSimulation,sim=guided.find(s=>s.id===id),record=simRecord(sim);
  const previous=st.sims[id];
  const updated={...record,answers:[...record.answers],drafts:{...record.drafts}};
  updated.answers[index]=$('simAnswer').value.trim();delete updated.drafts[index];
  st.sims[id]=updated;updated.completed=simComplete(sim);
  try{save();}catch(error){st.sims[id]=previous;$('simStatus').textContent='Não foi possível salvar. Copie sua resposta e tente novamente.';return;}
  activeSimulation.index=index+1;renderConversation();
}
init();
