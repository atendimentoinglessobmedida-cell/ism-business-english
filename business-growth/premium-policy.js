/* Premium access policy: fail closed. The caller MUST provide an authenticated,
 * server-verified entitlement response. Never trust localStorage, query params,
 * UI flags, user_metadata or a client-authored tier value. */
(function(root){
'use strict';
function evaluate(response, lessonId, nowMs){
  if(!response || response.verifiedByServer!==true || response.authenticated!==true) return {allowed:false,reason:'authentication_required'};
  if(typeof response.userId!=='string'||!response.userId.trim()) return {allowed:false,reason:'invalid_identity'};
  if(response.tier!=='premium'||response.status!=='active') return {allowed:false,reason:'premium_required'};
  const expires=Date.parse(response.expiresAt);
  if(!Number.isFinite(expires)||expires<=(nowMs??Date.now()))return {allowed:false,reason:'expired'};
  if(!Array.isArray(response.lessonIds)||!response.lessonIds.includes(lessonId))return {allowed:false,reason:'lesson_not_entitled'};
  return {allowed:true,reason:'entitled'};
}
root.ISMPremiumPolicy=Object.freeze({evaluate});
})(typeof window!=='undefined'?window:globalThis);
