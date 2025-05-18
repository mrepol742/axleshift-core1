/**
 * © 2025 Melvin Jones Repol & its contributors . All rights reserved.
 * This project is licensed under the MIT License with Commons Clause.
*/
var e,r={exports:{}},n=r.exports;function t(){return e||(e=1,function(){var e,n,t,o,p,s;"undefined"!=typeof performance&&null!==performance&&performance.now?r.exports=function(){return performance.now()}:"undefined"!=typeof process&&null!==process&&process.hrtime?(r.exports=function(){return(e()-p)/1e6},n=process.hrtime,o=(e=function(){var e;return 1e9*(e=n())[0]+e[1]})(),s=1e9*process.uptime(),p=o-s):Date.now?(r.exports=function(){return Date.now()-t},t=Date.now()):(r.exports=function(){return(new Date).getTime()-t},t=(new Date).getTime())}.call(n)),r.exports}export{t as r};
