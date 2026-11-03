/* ISM Advanced Skills — premium curriculum definition only.
   IMPORTANT: This is NOT an entitlement check. Never unlock paid lessons based on
   this client-side flag. The authenticated backend must authorize access to media,
   exercises, feedback and progress before this catalog is exposed in production. */
(function(root){
'use strict';
const lessons=Object.freeze([
  Object.freeze({
    id:'advanced-presenting-results',
    title:'Presenting Results and Handling Questions',
    level:'B2-C1', product:'business-english', tier:'premium',
    track:'presentations', skills:['listening','reading','speaking','writing'],
    objectives:['Identify a claim and its supporting evidence','Explain limitations of results','Answer challenging stakeholder questions'],
    speakingPrompt:'Present a result, explain one limitation and recommend a next step.',
    writingPrompt:'Write a concise executive summary with a recommendation.',
    rubric:['clarity','evidence','professional-tone','accuracy'],
    status:'curriculum-draft'
  }),
  Object.freeze({
    id:'advanced-project-pilot-decision',
    title:'Should We Extend the Pilot?',
    level:'B2-C1', product:'business-english', tier:'premium',
    track:'presentations', skills:['listening','reading','speaking','writing'],
    objectives:['Distinguish correlation from causation','Evaluate a pilot result','Defend a measured recommendation'],
    speakingPrompt:'Recommend whether to extend a pilot and explain your reasoning.',
    writingPrompt:'Draft a recommendation email noting benefits, risks and next steps.',
    rubric:['clarity','evidence','professional-tone','accuracy'],
    status:'curriculum-draft'
  })
]);
root.ISMAdvancedPremium=Object.freeze({
  moduleId:'advanced-skills', title:'ISM Advanced Skills', tier:'premium',
  entitlementKey:'premium', requiresServerAuthorization:true,
  lessons
});
})(typeof window!=='undefined'?window:globalThis);
