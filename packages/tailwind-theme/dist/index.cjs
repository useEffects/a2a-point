"use strict";var S=Object.create;var t=Object.defineProperty;var v=Object.getOwnPropertyDescriptor;var w=Object.getOwnPropertyNames;var $=Object.getPrototypeOf,x=Object.prototype.hasOwnProperty;var F=(e,r)=>{for(var o in r)t(e,o,{get:r[o],enumerable:!0})},s=(e,r,o,c)=>{if(r&&typeof r=="object"||typeof r=="function")for(let n of w(r))!x.call(e,n)&&n!==o&&t(e,n,{get:()=>r[n],enumerable:!(c=v(r,n))||c.enumerable});return e};var a=(e,r,o)=>(o=e!=null?S($(e)):{},s(r||!e||!e.__esModule?t(o,"default",{value:e,enumerable:!0}):o,e)),k=e=>s(t({},"__esModule",{value:!0}),e);var T={};F(T,{generateThemeCSS:()=>l,theme:()=>f});module.exports=k(T);var i=a(require("postcss"),1);var f={light:{background:"#eff1f5",foreground:"#4c4f69",card:"#e6e9ef","card-foreground":"#4c4f69",popover:"#dce0e8","popover-foreground":"#4c4f69",primary:"#FF7F00","primary-foreground":"eff1f5",secondary:"#bcc0cc","secondary-foreground":"#4c4f69",muted:"#acb0be","muted-foreground":"#64748B",accent:"#ccd0da","accent-foreground":"#4c4f69",destructive:"#b4637a","destructive-foreground":"#eff1f5",info:"#56949f","info-foreground":"#eff1f5",success:"#286983","success-foreground":"#eff1f5",warning:"#ea9d34","warning-foreground":"#eff1f5",border:"#acb0be",input:"#4c4f69",ring:"#bcc0cc",subtext:"#5c5f77"},dark:{background:"#191724",foreground:"#e0def4",card:"#1f1d2e","card-foreground":"#e0def4",popover:"#26233a","popover-foreground":"#e0def4",primary:"#FF7F00","primary-foreground":"#191724",secondary:"#403d52","secondary-foreground":"#e0def4",muted:"#21202e","muted-foreground":"#6e6a86",accent:"#524f67","accent-foreground":"#e0def4",destructive:"#eb6f92","destructive-foreground":"#191724",info:"#9ccfd8","info-foreground":"#191724",success:"#31748f","success-foreground":"#191724",warning:"#f6c177","warning-foreground":"#191724",border:"#21202e",input:"#e0def4",ring:"#403d52",subtext:"#908caa"}};var u=require("fs"),g=a(require("color-convert"),1);function l(){return{postcssPlugin:"generate-theme-css",OnceExit:e=>{let r=(p,m)=>{let b=Object.entries(p).map(([h,y])=>{let d=g.default.hex.hsl(y);return`		--${h}: ${d[0]} ${d[1]}% ${d[2]}%;`}).join(`
`);return`${m} {
${b}
}`},o=r(f.light,":root"),c=r(f.dark,".dark:root"),n=`/*Auto Generated*/

@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
	${o}
	${c}
}`;(0,u.writeFileSync)(`${process.cwd()}/global.css`,n),console.log("Global CSS file generated successfully.")}}}var C=(0,i.default)([l()]);C.process("",{from:void 0}).catch(e=>{console.error("Error generating global CSS:",e)});0&&(module.exports={generateThemeCSS,theme});
