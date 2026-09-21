/* luna engine: moon phase math (pure, node-testable). All dates UTC ms. */
var SYNODIC = 29.53058867;
var EPOCH = Date.UTC(2000, 0, 6, 18, 14); /* new moon 2000-01-06 18:14 UTC */
var DAY = 86400000;

function phase(ms){
  var d = (ms - EPOCH) / DAY / SYNODIC;
  var p = d - Math.floor(d);
  return p < 0 ? p + 1 : p;
}
function illumination(p){ return (1 - Math.cos(2*Math.PI*p)) / 2; }
function ageDays(p){ return p * SYNODIC; }
var NAMES = ['New Moon','Waxing Crescent','First Quarter','Waxing Gibbous','Full Moon','Waning Gibbous','Last Quarter','Waning Crescent'];
function phaseName(p){
  return NAMES[Math.min(7, Math.floor(p*8))];
}
var MILESTONES = [ {q:0, name:'New Moon'}, {q:0.25, name:'First Quarter'}, {q:0.5, name:'Full Moon'}, {q:0.75, name:'Last Quarter'} ];
function nextMilestones(ms){
  var p = phase(ms);
  var out = MILESTONES.map(function(m){
    var delta = (m.q - p + 1) % 1;
    if (delta < 0.002 || delta > 0.998) delta = (delta + 1) % 1; /* not right now - next one */
    if (delta === 0) delta = 1;
    return { name:m.name, at: ms + delta * SYNODIC * DAY };
  });
  out.sort(function(a,b){ return a.at - b.at; });
  return out;
}
/* rough center-of-day phase list for a calendar month (year, 0-based month) */
function monthPhases(year, month){
  var days = new Date(Date.UTC(year, month+1, 0)).getUTCDate();
  var out = [];
  for (var d=1; d<=days; d++) out.push({ day:d, p: phase(Date.UTC(year, month, d, 12)) });
  return out;
}
if (typeof module !== 'undefined' && module.exports){
  module.exports = { SYNODIC:SYNODIC, EPOCH:EPOCH, phase:phase, illumination:illumination, ageDays:ageDays, phaseName:phaseName, nextMilestones:nextMilestones, monthPhases:monthPhases };
}
