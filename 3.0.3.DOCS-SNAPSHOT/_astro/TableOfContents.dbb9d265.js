import{_ as h,h as v,p as u}from"./hooks.module.ee390651.js";import{o as n}from"./jsxRuntime.module.760e3403.js";import{_ as w}from"./preact.module.e54f245b.js";const{replace:O}="",b=/&(?:amp|#38|lt|#60|gt|#62|apos|#39|quot|#34);/g,k={"&amp;":"&","&#38;":"&","&lt;":"<","&#60;":"<","&gt;":">","&#62;":">","&apos;":"'","&#39;":"'","&quot;":'"',"&#34;":'"'},C=t=>k[t],I=t=>O.call(t,b,C),$=({headings:t=[]})=>{const o=h(),l="on-this-page-heading",f=h([]),[p,a]=v("overview");u(()=>{const e=()=>{const s=document.querySelectorAll("article :is(h1, h2, h3, h4)");f.current=Array.from(s).map(r=>({id:r.id,topOffset:r.getBoundingClientRect().top+window.scrollY}))};return e(),window.addEventListener("resize",e),()=>{window.removeEventListener("resize",e)}},[]),u(()=>{if(!o.current)return;const e=c=>{for(const i of c)if(i.isIntersecting){const{id:g}=i.target;if(g===l)continue;a(i.target.id);break}},s={rootMargin:"-100px 0% -66%",threshold:1},r=new IntersectionObserver(e,s);return document.querySelectorAll("article :is(h1,h2,h3)").forEach(c=>r.observe(c)),()=>r.disconnect()},[o.current]);const m=e=>{a(e.target.getAttribute("href").replace("#",""))};let d=t.filter(({depth:e})=>e>1&&e<4);if(d.length>0)return n(w,{children:[n("h2",{id:l,className:"heading",children:"On this page"}),n("ul",{ref:o,children:d.map(e=>n("li",{className:`header-link depth-${e.depth} ${p===e.slug?"current-header-link":""}`.trim(),children:n("a",{href:`#${e.slug}`,onClick:m,children:I(e.text)})}))})]})};export{$ as default};