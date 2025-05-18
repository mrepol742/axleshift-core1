/**
 * © 2025 Melvin Jones Repol & its contributors . All rights reserved.
 * This project is licensed under the MIT License with Commons Clause.
*/
import{r}from"./CbKKHx2O.js";function e(e,t,a){var n=r.useRef(void 0!==e),o=r.useState(t),u=o[0],c=o[1],i=void 0!==e,s=n.current;return n.current=i,!i&&s&&u!==t&&c(t),[i?e:u,r.useCallback((function(r){for(var e=arguments.length,t=new Array(e>1?e-1:0),n=1;n<e;n++)t[n-1]=arguments[n];a&&a.apply(void 0,[r].concat(t)),c(r)}),[a])]}export{e as u};
