(()=>{"use strict";var e={520:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.display_queue=t.dequeue=t.head=t.enqueue=t.is_empty=t.empty=void 0,t.empty=function(){return[0,0,[]]},t.is_empty=function(e){return e[0]===e[1]},t.enqueue=function(e,t){var o=t[1];t[2][o]=e,t[1]=o+1},t.head=function(e){var t=e[0];return e[2][t]},t.dequeue=function(e){var t=e[0];e[0]=t+1},t.display_queue=function(e){console.log(e[2].slice(e[0],e[1]))}},313:(e,t,o)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.bfs=void 0;var n=o(106),l=o(520);function r(e,t,o){var n=new Set,r=(0,l.empty)();(0,l.enqueue)(e,r);for(var a=new Map,c=function(){var c=(0,l.head)(r);if((0,l.dequeue)(r),n.has(c))return"continue";if(n.add(c),c===t){for(var i=[t],d=t;a.has(d)&&d!==e;)d=a.get(d),i.unshift(d);return{value:[i,Array.from(n)]}}(o.get(c)||[]).forEach((function(e){n.has(e)||(a.set(e,c),(0,l.enqueue)(e,r))}))};!(0,l.is_empty)(r);){var i=c();if("object"==typeof i)return i.value}return[]}(0,n.generate2DGridAdjacencyList)(20,43),t.bfs=r;var a=r(0,17,(0,n.generate2DGridAdjacencyList)(6,5));console.log(a)},106:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.addNode=t.removeNode=t.generate2DGridAdjacencyList=void 0,t.generate2DGridAdjacencyList=function(e,t){for(var o=new Map,n=0;n<e;n++)for(var l=0;l<t;l++){var r=n*t+l,a=[];n>0&&a.push(r-t),n<e-1&&a.push(r+t),l<t-1&&a.push(r+1),l>0&&a.push(r-1),o.set(r,a)}return o},t.removeNode=function(e,t,o,n){e.delete(t),[t-1,t+1,t-n,t+n].forEach((function(o){if(e.has(o)){var n=e.get(o).filter((function(e){return e!==t}));e.set(o,n)}}))},t.addNode=function(e,t,o,n){var l=Math.floor(t/n),r=t%n,a=[];l>0&&a.push(t-n),l<o-1&&a.push(t+n),r>0&&a.push(t-1),r<n-1&&a.push(t+1),e.set(t,a),a.forEach((function(o){e.has(o)&&!e.get(o).includes(t)&&e.get(o).push(t)}))}}},t={};function o(n){var l=t[n];if(void 0!==l)return l.exports;var r=t[n]={exports:{}};return e[n](r,r.exports,o),r.exports}(()=>{var e,t,n,l,r,a=o(106),c=o(313),i=document.getElementById("myCanvas");i.width=window.innerWidth,i.height=window.innerHeight;var d=i.getContext("2d"),u=.2*i.height,s=.8*i.height,f=20,v=(s-u)/f,g=(0,a.generate2DGridAdjacencyList)(20,20);console.log(g);var h={placed:!1,row:-1,col:-1},y=20,p={placed:!1,row:-1,col:-1},w=203;function m(e,t,o,n,l,r,c){var i=e.getContext("2d");if(i){var d=o*v+u,s=t*v+u;if(r){i.fillStyle="white",i.fillRect(d,s,v,v),i.strokeStyle="black",i.strokeRect(d,s,v,v);var f=o+20*t;"wall"===c&&((0,a.addNode)(g,f+1,20,20),console.log("node added"))}else f=o+20*t,"wall"===c&&((0,a.removeNode)(g,f,20,20),console.log("node removed")),i.fillStyle=l,i.fillRect(d,s,v,v)}else console.error("Failed to get the canvas 2D context")}function k(e,t,o,n,l){var r=e.getContext("2d");if(r)for(var a=0;a<t.length;a++){var c=t[a]%o*v+u,i=Math.floor(t[a]/o)*v+u;r.fillStyle=l,r.fillRect(c,i,v,v)}else console.error("Failed to get the canvas 2D context")}i.addEventListener("mousedown",(function(e){!function(t){var o=i.getBoundingClientRect(),n=e.clientX-o.left,l=e.clientY-o.top,r=Math.floor((l-u)/v),a=Math.floor((n-u)/v);if(n>u&&n<s+v&&l>u&&l<s+v)switch(E){case"start":t?(m(i,r,a,0,"yellow",!0,"start"),r===h.row&&a===h.col?(h.placed=!1,y=-1):(m(i,h.row,h.col,0,"yellow",!0,"start"),y=a+20*r)):!0===h.placed?(m(i,h.row,h.col,0,"yellow",!0,"start"),m(i,r,a,0,"yellow",!1,"start")):(m(i,r,a,0,"yellow",!1,"start"),h.placed=!0,y=a+20*r),h.row=r,h.col=a;break;case"goal":t?(m(i,r,a,0,"green",!0,"goal"),r===p.row&&a===p.col?(p.placed=!1,w=-1):m(i,p.row,p.col,0,"green",!0,"goal")):!0===p.placed?(m(i,p.row,p.col,0,"green",!0,"goal"),m(i,r,a,0,"green",!1,"goal"),w=a+20*r):(m(i,r,a,0,"green",!1,"goal"),p.placed=!0,w=a+20*r),p.row=r,p.col=a;break;case"wall":m(i,r,a,0,"red",!!t,"wall");break;default:console.error("No mode selected")}}(function(){var t=i.getBoundingClientRect(),o=e.clientX-t.left,n=e.clientY-t.top;if(d){var l=d.getImageData(o,n,1,1).data;if(o>u&&o<s+v&&n>u&&n<s+v)return 255!==l[0]||255!==l[1]||255!==l[2]?(console.log("true"),!0):(console.log("false"),!1)}return console.log("error"),!1}())}));var E=null;null===(e=document.getElementById("startButton"))||void 0===e||e.addEventListener("click",(function(){E="start",console.log("start")})),null===(t=document.getElementById("goalButton"))||void 0===t||t.addEventListener("click",(function(){E="goal",console.log("goal")})),null===(n=document.getElementById("wallButton"))||void 0===n||n.addEventListener("click",(function(){E="wall",console.log("wall")})),null===(l=document.getElementById("resetButton"))||void 0===l||l.addEventListener("click",(function(){})),null===(r=document.getElementById("runButton"))||void 0===r||r.addEventListener("click",(function(){var e=(0,c.bfs)(y,w,g),t=e[0],o=e[1];t&&t.length>0?(k(i,o,20,0,"gray"),k(i,t,20,0,"blue")):console.error("No valid path found.")})),function(e,t){if(d){d.strokeStyle="black";for(var o=0;o<=20;o++)for(var n=0;n<=20;n++){var l=o*v+u,r=n*v+u;d.strokeStyle="black",d.strokeRect(l,r,v,v),d.fillStyle="white",d.fillRect(l,r,v,v)}}else console.error("Failed to get the canvas 2D context")}(),document.addEventListener("keydown",(function(e){console.log(w),console.log(y),e.key}))})()})();
//# sourceMappingURL=bundle.js.map