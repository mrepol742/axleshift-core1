/**
 * © 2025 Melvin Jones Repol & its contributors . All rights reserved.
 * This project is licensed under the MIT License with Commons Clause.
*/
function t(t,o){o=o||2;const r="0000"+t;return r.substr(r.length-o,o)}class o{constructor(t,o,r){this.year=t,this.month=o,this.day=r}toString(){return[t(this.year,4),t(this.month),t(this.day)].join("-")}}function r(t,r,n){t=function(t){return t?t instanceof Date?t=t.getFullYear():"string"==typeof t&&(t=parseInt(t,10)):t=(new Date).getFullYear(),t}(t);const e=Math.floor(t/100);let a=15+Math.floor((3*e+3)/4)-Math.floor((8*e+13)/25),s=2-Math.floor((3*e+3)/4);r&&(a=15,s=0);const h=t%19,l=(19*h+a)%30,f=21+l-Math.floor((l+h/11)/29);let i=f+(7-(f-(7-Math.floor(t+t/4+s)%7))%7);n&&(i=i+Math.floor(t/100)-Math.floor(t/400)-2);const u=[0,31,28,31,30,31,30,31,31];let c,M=i;for(c=3;c<8&&!(M<=u[c]);c++)M-=u[c];return new o(t,c,M)}const n={easter:function(t){return r(t)},orthodoxEaster:function(t){return r(t,!0,!0)}};export{n as e};
