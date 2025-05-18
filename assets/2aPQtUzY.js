/**
 * © 2025 Melvin Jones Repol & its contributors . All rights reserved.
 * This project is licensed under the MIT License with Commons Clause.
*/
const r=r=>{const o=new Date(r).getTime(),t=Date.now(),e=Math.floor((t-o)/1e3);if(e<60)return"now";if(e<3600){return`${Math.floor(e/60)} min`}if(e<86400){return`${Math.floor(e/3600)} hr`}if(e<2592e3){const r=Math.floor(e/86400);return r>1?`${r} days`:`${r} day`}if(e<31536e3){return`${Math.floor(e/2592e3)} mo`}const n=Math.floor(e/31536e3);return n>1?`${n} yrs`:`${n} yr`};export{r as p};
