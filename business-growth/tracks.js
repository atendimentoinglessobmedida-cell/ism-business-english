/* ISM Business Growth — additive catalog; existing lesson records remain authoritative. */
(function(root){
'use strict';
const tracks=Object.freeze([
{id:'meetings',title:'Reuniões',lessons:['meeting-decisions','scheduling-a-meeting','clarify-and-confirm','concise-project-update']},
{id:'presentations',title:'Apresentações',lessons:['presenting-results','concise-project-update']},
{id:'emails',title:'E-mails',lessons:['email-request','handover-across-teams']},
{id:'negotiation',title:'Negociação',lessons:['deadline-negotiation','customer-recovery']},
{id:'interviews',title:'Entrevistas',lessons:['interview-evidence','workplace-introductions']}
]);
const days=Object.freeze([
['Professional introduction','Present your role and one measurable achievement.','Tell me about yourself.'],
['Your career story','Explain your career transitions clearly.','Walk me through your experience.'],
['Strengths with evidence','Support a strength with an example.','What is your greatest strength?'],
['Weaknesses and growth','Describe a genuine improvement plan.','What is one area you are improving?'],
['Why this role?','Connect your experience to the position.','Why are you interested in this role?'],
['STAR: Situation and Task','Set the context without unnecessary detail.','Describe a challenge you faced.'],
['STAR: Action','Explain your own decisions and contributions.','What did you personally do?'],
['STAR: Result','Describe a result without inventing numbers.','What was the outcome?'],
['Teamwork and conflict','Explain a disagreement respectfully.','Tell me about a disagreement at work.'],
['Leadership and ownership','Show initiative and accountability.','Tell me about a time you took ownership.'],
['Problem solving','Clarify constraints and trade-offs.','How did you solve a difficult problem?'],
['Salary negotiation','Discuss expectations professionally.','What are your salary expectations?'],
['Questions for the interviewer','Ask informed questions about success and team priorities.','What would success look like in the first 90 days?'],
['Full mock interview','Complete a structured interview and reflect.','Tell me about yourself and why this role fits you.']
].map(([title,goal,prompt],i)=>Object.freeze({day:i+1,title,goal,prompt,minutes:10+(i%3)*2})));
function recommend(scores){const values=Object.fromEntries(tracks.map(t=>[t.id,Number(scores?.[t.id])||0]));return tracks.slice().sort((a,b)=>values[b.id]-values[a.id]).map(t=>t.id);}
function availableLessons(catalog,trackId){const track=tracks.find(t=>t.id===trackId);return track?track.lessons.map(id=>catalog.find(l=>l.id===id)).filter(Boolean):[];}
root.ISMBusinessGrowth=Object.freeze({tracks,days,recommend,availableLessons});
})(typeof window!=='undefined'?window:globalThis);
