(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[19],{"95eJ":function(e,t,n){},FRSn:function(e,t,n){"use strict";n.r(t);var a=n("ahKI"),l=n.n(a),r=n("Z63h"),c=n("1i7f"),o=n("PAHk"),u=n("v8OG"),i=l.a.memo((e=>{var t=e.demos,n=t["useeventtarget-demo1"].component,a=t["useeventtarget-demo2"].component;return l.a.createElement(l.a.Fragment,null,l.a.createElement(l.a.Fragment,null,l.a.createElement("div",{className:"markdown"},l.a.createElement("h1",{id:"useeventtarget"},l.a.createElement(r["AnchorLink"],{to:"#useeventtarget","aria-hidden":"true",tabIndex:-1},l.a.createElement("span",{className:"icon icon-link"})),"useEventTarget"),l.a.createElement("p",null,"\u5e38\u89c1\u8868\u5355\u63a7\u4ef6(\u901a\u8fc7 e.target.value \u83b7\u53d6\u8868\u5355\u503c) \u7684 onChange \u8ddf value \u903b\u8f91\u5c01\u88c5\uff0c\u652f\u6301\u81ea\u5b9a\u4e49\u503c\u8f6c\u6362\u548c\u91cd\u7f6e\u529f\u80fd\u3002"),l.a.createElement("h2",{id:"\u4ee3\u7801\u6f14\u793a"},l.a.createElement(r["AnchorLink"],{to:"#\u4ee3\u7801\u6f14\u793a","aria-hidden":"true",tabIndex:-1},l.a.createElement("span",{className:"icon icon-link"})),"\u4ee3\u7801\u6f14\u793a"),l.a.createElement("h3",{id:"\u57fa\u7840\u7528\u6cd5"},l.a.createElement(r["AnchorLink"],{to:"#\u57fa\u7840\u7528\u6cd5","aria-hidden":"true",tabIndex:-1},l.a.createElement("span",{className:"icon icon-link"})),"\u57fa\u7840\u7528\u6cd5")),l.a.createElement(c["default"],t["useeventtarget-demo1"].previewerProps,l.a.createElement(n,null)),l.a.createElement("div",{className:"markdown"},l.a.createElement("h3",{id:"\u81ea\u5b9a\u4e49\u8f6c\u6362\u51fd\u6570"},l.a.createElement(r["AnchorLink"],{to:"#\u81ea\u5b9a\u4e49\u8f6c\u6362\u51fd\u6570","aria-hidden":"true",tabIndex:-1},l.a.createElement("span",{className:"icon icon-link"})),"\u81ea\u5b9a\u4e49\u8f6c\u6362\u51fd\u6570")),l.a.createElement(c["default"],t["useeventtarget-demo2"].previewerProps,l.a.createElement(a,null)),l.a.createElement("div",{className:"markdown"},l.a.createElement("h2",{id:"api"},l.a.createElement(r["AnchorLink"],{to:"#api","aria-hidden":"true",tabIndex:-1},l.a.createElement("span",{className:"icon icon-link"})),"API"),l.a.createElement(o["a"],{code:"const [value, { onChange, reset }] = useEventTarget<T, U>(Options<T, U>);",lang:"typescript"}),l.a.createElement("h3",{id:"result"},l.a.createElement(r["AnchorLink"],{to:"#result","aria-hidden":"true",tabIndex:-1},l.a.createElement("span",{className:"icon icon-link"})),"Result"),l.a.createElement(u["a"],null,l.a.createElement("thead",null,l.a.createElement("tr",null,l.a.createElement("th",null,"\u53c2\u6570"),l.a.createElement("th",null,"\u8bf4\u660e"),l.a.createElement("th",null,"\u7c7b\u578b"))),l.a.createElement("tbody",null,l.a.createElement("tr",null,l.a.createElement("td",null,"value"),l.a.createElement("td",null,"\u8868\u5355\u63a7\u4ef6\u7684\u503c"),l.a.createElement("td",null,l.a.createElement("code",null,"T"))),l.a.createElement("tr",null,l.a.createElement("td",null,"onChange"),l.a.createElement("td",null,"\u8868\u5355\u63a7\u4ef6\u503c\u53d1\u751f\u53d8\u5316\u65f6\u5019\u7684\u56de\u8c03"),l.a.createElement("td",null,l.a.createElement("code",null,"(e: ","{"," target: ","{"," value: T ","}"," ","}",") => void"))),l.a.createElement("tr",null,l.a.createElement("td",null,"reset"),l.a.createElement("td",null,"\u91cd\u7f6e\u51fd\u6570"),l.a.createElement("td",null,l.a.createElement("code",null,"() => void"))))),l.a.createElement("h3",{id:"options"},l.a.createElement(r["AnchorLink"],{to:"#options","aria-hidden":"true",tabIndex:-1},l.a.createElement("span",{className:"icon icon-link"})),"Options"),l.a.createElement(u["a"],null,l.a.createElement("thead",null,l.a.createElement("tr",null,l.a.createElement("th",null,"\u53c2\u6570"),l.a.createElement("th",null,"\u8bf4\u660e"),l.a.createElement("th",null,"\u7c7b\u578b"),l.a.createElement("th",null,"\u9ed8\u8ba4\u503c"))),l.a.createElement("tbody",null,l.a.createElement("tr",null,l.a.createElement("td",null,"initialValue"),l.a.createElement("td",null,"\u53ef\u9009\u9879, \u521d\u59cb\u503c"),l.a.createElement("td",null,l.a.createElement("code",null,"T")),l.a.createElement("td",null,"-")),l.a.createElement("tr",null,l.a.createElement("td",null,"transformer"),l.a.createElement("td",null,"\u53ef\u9009\u9879\uff0c\u53ef\u81ea\u5b9a\u4e49\u56de\u8c03\u503c\u7684\u8f6c\u5316"),l.a.createElement("td",null,l.a.createElement("code",null,"(value: U) => T")),l.a.createElement("td",null,"-")))))))}));t["default"]=e=>{var t=l.a.useContext(r["context"]),n=t.demos;return l.a.useEffect((()=>{var t;null!==e&&void 0!==e&&null!==(t=e.location)&&void 0!==t&&t.hash&&r["AnchorLink"].scrollToAnchor(decodeURIComponent(e.location.hash.slice(1)))}),[]),l.a.createElement(i,{demos:n})}},MZF8:function(e,t,n){"use strict";var a=n("ogwx");n.d(t,"a",(function(){return a["b"]}));n("VCU9")},v8OG:function(e,t,n){"use strict";var a=n("ahKI"),l=n.n(a),r=n("bIC1"),c=n.n(r);n("95eJ");function o(e,t){return s(e)||d(e,t)||i(e,t)||u()}function u(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}function i(e,t){if(e){if("string"===typeof e)return m(e,t);var n=Object.prototype.toString.call(e).slice(8,-1);return"Object"===n&&e.constructor&&(n=e.constructor.name),"Map"===n||"Set"===n?Array.from(e):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?m(e,t):void 0}}function m(e,t){(null==t||t>e.length)&&(t=e.length);for(var n=0,a=new Array(t);n<t;n++)a[n]=e[n];return a}function d(e,t){var n=null==e?null:"undefined"!==typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(null!=n){var a,l,r=[],c=!0,o=!1;try{for(n=n.call(e);!(c=(a=n.next()).done);c=!0)if(r.push(a.value),t&&r.length===t)break}catch(u){o=!0,l=u}finally{try{c||null==n["return"]||n["return"]()}finally{if(o)throw l}}return r}}function s(e){if(Array.isArray(e))return e}var E=function(e){var t=e.children,n=Object(a["useRef"])(),r=Object(a["useState"])(!1),u=o(r,2),i=u[0],m=u[1],d=Object(a["useState"])(!1),s=o(d,2),E=s[0],h=s[1];return Object(a["useEffect"])((function(){var e=n.current,t=c()((function(){m(e.scrollLeft>0),h(e.scrollLeft<e.scrollWidth-e.offsetWidth)}),100);return t(),e.addEventListener("scroll",t),window.addEventListener("resize",t),function(){e.removeEventListener("scroll",t),window.removeEventListener("resize",t)}}),[]),l.a.createElement("div",{className:"__dumi-default-table"},l.a.createElement("div",{className:"__dumi-default-table-content",ref:n,"data-left-folded":i||void 0,"data-right-folded":E||void 0},l.a.createElement("table",null,t)))};t["a"]=E}}]);