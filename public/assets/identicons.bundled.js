!function(t,e){"object"==typeof exports&&"object"==typeof module?module.exports=e():"function"==typeof define&&define.amd?define([],e):"object"==typeof exports?exports.Identicons=e():t.Identicons=e()}(this,(()=>{return t={359:function(t){var e,o;t.exports=(e={138:t=>{const e={fatal:[0,"color: #FF5555; font-weight: 800"],error:[1,"color: #E20D03"],warn:[2,"color: #ebab34; font-weight: 600"],normal:[3,"font-weight: 800"],info:[4,"color: #007e8a","color: initial"],debug:[5,"color: #008024","color: #777"],trace:[6,"color: #aaa"]};t.exports={Logger:class{constructor(t,e,o){const n="undefined"!=typeof window?window.localStorage.getItem("LOG_COLOR"):null,i=("undefined"!=typeof window?function(t){const e=window.localStorage.getItem(`LOG_LEVEL.${t}`),o=window.localStorage.getItem("LOG_LEVEL");return e||o||null}(t):null)||3;this.context=t,this._color_setting=n||o,this.setLevel(e||i)}setLevel(o){if(this._level=o,"string"==typeof this._level)if(!1===isNaN(this._level))this._level=parseInt(this._level);else{if(void 0===e[this._level.toLowerCase()])throw new Error(`Unknown log level '${this._level}'; options are ${Object.keys(e).join(", ")}`);this._level=e[this._level.toLowerCase()][0]}return this.level=Object.entries(e).reduce(((e,[o,[n,i,s]])=>(e[o]=this._level>=n,this[o]=function(...e){return this.level[o]&&function(e,o,n,i,...s){if("function"==typeof s[0]&&(s=s[0](),!Array.isArray(s)))throw new TypeError(`Calculated "args" function must return an array; not type '${typeof s}'`);let r=(new Date).toISOString(),l=o.length>10?"…"+o.slice(-9):o.padEnd(10),a=n.slice(0,5).padStart(5).toUpperCase();if(e.colors&&("false"===e.colors||"0"===e.colors))return t.exports.console.log(`${r} [ ${l} ] ${a}: ${i}`,...s);t.exports.console.log(`${r} [ %c${l}%c ] %c${a}%c: %c${i}`,"color: #75008a","color: initial",e.lvl_color,"color: initial",e.msg_color||e.lvl_color,...s)}({colors:this._color_setting,lvl_color:i,msg_color:s},this.context,o,...e),this.level[o]},e)),{}),this._level}},console}}},o={},function t(n){var i=o[n];if(void 0!==i)return i.exports;var s=o[n]={exports:{}};return e[n](s,s.exports,t),s.exports}(138))},138:(t,e,o)=>{const{Logger:n}=o(359),i=new n("identicons"),{Pseudorandomizer:s}=o(173);function r({h:t,s:e,l:o}){return`hsl(${t}, ${e}%, ${o}%)`}const l=new Path2D;function a(t,e){const o=t.random(),n=t.random(),s=e.isPointInPath(l,o,n);return i.debug("Point( %s, %s ) in path? %s",o,n,s),s?[o,n]:a(...arguments)}l.ellipse(.5,.5,.5,.5,0,0,2*Math.PI),t.exports={renderDiscs:function(t,e){void 0===e&&(e=document.createElement("canvas"));const o=new s(t.seed),n=o.input,l=o.random(),c=void 0===t.base?l:parseFloat(t.base),h=t.width||t.size||e.offsetWidth,d=t.height||t.size||e.offsetHeight;if(0===h||0===d)throw new Error(`Bad width or height (x = ${h}px, y = ${d}px); Cannot paint on an invisible canvas`);i.debug("Render for size %s/%s with seed: %s",h,d,n);const u=Math.min(h,d)/Math.max(h,d),f=t.maxSize||Math.max(h,d)*(u+.5),g=t.minSize||.1*Math.min(h,d),p=t.minDiscs||6,m=t.maxDiscs||1.33*p,v=t.colorRange||10,w=!!t.grayscale;e.width=h,e.height=d;const x=e.getContext("2d");i.debug("BG range reduction: %s / %s",3.6*v/2,v/20+3);const _=3.6*v/2/(v/20+3),b=360*c;i.debug("BG base/range = radius: %s/%s = %s",c.toFixed(2),v,_);const y=b-_,M=b+_,L=o.randint(y,M),$=(L+361)%361;i.debug("BG constraints: %s-%s = %s = %s",y.toFixed(2),M.toFixed(2),L,$);const S=r({h:$,s:w?0:80,l:o.randint(20,40)});x.fillStyle=S,x.fillRect(0,0,e.width,e.height);const E=o.randint(p,m),D=[],I=[],P=[];for(let t=0;t<E;t++){const e=((t+1)/E)**2;D.push(e),I.push(o.randint(g,f)*e+g)}I.sort(((t,e)=>t<e?1:t>e?-1:0)),I.forEach((t=>{const e=t/2,n=r(function(t,e,o,n){const i=3.6*e/2,s=(o.randint(360*t-i,360*t+i)+360)%361,r=o.randint(85,100);return{h:s,s:n?0:r,l:o.randint(20,80)}}(c,v,o,w));x.fillStyle=n,x.beginPath();const[s,l]=a(o,x),u=s*(h+e/2)-e/4,f=l*(d+e/2)-e/4;P.push([s,l]),i.debug("Valid ellipse point( %s, %s )",u,f),x.arc(u,f,e,0,2*Math.PI),x.fill()}));const z=e.toDataURL();return{canvas:e,width:h,height:d,ratio:u,maxSize:f,minDiscs:p,maxDiscs:m,color_range:v,bg_radius:_,dataURL:z,settings:{seed:n,base:c,numDiscs:E,background_color:S,discMulti:D,discSizes:I,discPositions:P}}},logging(t="trace"){i.setLevel(t)}}},173:t=>{t.exports={Pseudorandomizer:class{constructor(t){this.input=t?String(t):Math.floor(Math.random()*Math.pow(10,16)).toString(16),this.seed=function(t){let e=1779033703,o=3144134277,n=1013904242,i=2773480762;for(let s,r=0;r<t.length;r++)s=t.charCodeAt(r),e=o^Math.imul(e^s,597399067),o=n^Math.imul(o^s,2869860233),n=i^Math.imul(n^s,951274213),i=e^Math.imul(i^s,2716044179);return e=Math.imul(n^e>>>18,597399067),o=Math.imul(i^o>>>22,2869860233),n=Math.imul(e^n>>>17,951274213),i=Math.imul(o^i>>>19,2716044179),[(e^o^n^i)>>>0,(o^e)>>>0,(n^e)>>>0,(i^e)>>>0]}(this.input),this.random=function(t,e,o,n){return function(){var i=(t>>>=0)+(e>>>=0)|0;return t=e^e>>>9,e=(o>>>=0)+(o<<3)|0,o=(o=o<<21|o>>>11)+(i=i+(n=1+(n>>>=0)|0)|0)|0,(i>>>0)/4294967296}}(...this.seed)}randint(t,e){return Math.floor(this.random()*(e-t)+t)}}}}},e={},function o(n){var i=e[n];if(void 0!==i)return i.exports;var s=e[n]={exports:{}};return t[n].call(s.exports,s,s.exports,o),s.exports}(138);var t,e}));
//# sourceMappingURL=identicons.bundled.js.map