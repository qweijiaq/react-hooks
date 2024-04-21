(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[38],{"/MKA":function(e,a,n){"use strict";n.r(a);var l=n("ahKI"),t=n.n(l),r=n("Z63h"),c=n("1i7f"),u=n("PAHk"),m=t.a.memo((e=>{var a=e.demos,n=a["index-default"].component,l=a["index-manual"].component;return t.a.createElement(t.a.Fragment,null,t.a.createElement(t.a.Fragment,null,t.a.createElement("div",{className:"markdown"},t.a.createElement("h1",{id:"\u5feb\u901f\u4e0a\u624b"},t.a.createElement(r["AnchorLink"],{to:"#\u5feb\u901f\u4e0a\u624b","aria-hidden":"true",tabIndex:-1},t.a.createElement("span",{className:"icon icon-link"})),"\u5feb\u901f\u4e0a\u624b"),t.a.createElement("p",null,t.a.createElement("code",null,"useRequest")," \u662f\u4e00\u4e2a\u5f3a\u5927\u7684\u5f02\u6b65\u6570\u636e\u7ba1\u7406\u7684 Hooks\uff0cReact \u9879\u76ee\u4e2d\u7684\u7f51\u7edc\u8bf7\u6c42\u573a\u666f\u4f7f\u7528 ",t.a.createElement("code",null,"useRequest")," \u5c31\u591f\u4e86\u3002"),t.a.createElement("p",null,t.a.createElement("code",null,"useRequest")," \u901a\u8fc7\u63d2\u4ef6\u5f0f\u7ec4\u7ec7\u4ee3\u7801\uff0c\u6838\u5fc3\u4ee3\u7801\u6781\u5176\u7b80\u5355\uff0c\u5e76\u4e14\u53ef\u4ee5\u5f88\u65b9\u4fbf\u7684\u6269\u5c55\u51fa\u66f4\u9ad8\u7ea7\u7684\u529f\u80fd\u3002\u76ee\u524d\u5df2\u6709\u80fd\u529b\u5305\u62ec\uff1a"),t.a.createElement("ul",null,t.a.createElement("li",null,"\u81ea\u52a8\u8bf7\u6c42/\u624b\u52a8\u8bf7\u6c42"),t.a.createElement("li",null,"\u8f6e\u8be2"),t.a.createElement("li",null,"\u9632\u6296"),t.a.createElement("li",null,"\u8282\u6d41"),t.a.createElement("li",null,"\u5c4f\u5e55\u805a\u7126\u91cd\u65b0\u8bf7\u6c42"),t.a.createElement("li",null,"\u9519\u8bef\u91cd\u8bd5"),t.a.createElement("li",null,"loading delay"),t.a.createElement("li",null,"SWR(stale-while-revalidate)"),t.a.createElement("li",null,"\u7f13\u5b58")),t.a.createElement("p",null,"\u63a5\u4e0b\u6765\u8ba9\u6211\u4eec\u5148\u4ece\u4e24\u4e2a\u6700\u7b80\u5355\u7684\u4f8b\u5b50\u8ba4\u8bc6 ",t.a.createElement("code",null,"useRequest"),"\u3002"),t.a.createElement("h2",{id:"\u9ed8\u8ba4\u7528\u6cd5"},t.a.createElement(r["AnchorLink"],{to:"#\u9ed8\u8ba4\u7528\u6cd5","aria-hidden":"true",tabIndex:-1},t.a.createElement("span",{className:"icon icon-link"})),"\u9ed8\u8ba4\u7528\u6cd5"),t.a.createElement("p",null,t.a.createElement("code",null,"useRequest")," \u7684\u7b2c\u4e00\u4e2a\u53c2\u6570\u662f\u4e00\u4e2a\u5f02\u6b65\u51fd\u6570\uff0c\u5728\u7ec4\u4ef6\u521d\u6b21\u52a0\u8f7d\u65f6\uff0c\u4f1a\u81ea\u52a8\u89e6\u53d1\u8be5\u51fd\u6570\u6267\u884c\u3002\u540c\u65f6\u81ea\u52a8\u7ba1\u7406\u8be5\u5f02\u6b65\u51fd\u6570\u7684 ",t.a.createElement("code",null,"loading")," , ",t.a.createElement("code",null,"data")," , ",t.a.createElement("code",null,"error")," \u7b49\u72b6\u6001\u3002"),t.a.createElement(u["a"],{code:"const { data, error, loading } = useRequest(getUsername);",lang:"js"}),t.a.createElement("br",null)),t.a.createElement(c["default"],a["index-default"].previewerProps,t.a.createElement(n,null)),t.a.createElement("div",{className:"markdown"},t.a.createElement("h2",{id:"\u624b\u52a8\u89e6\u53d1"},t.a.createElement(r["AnchorLink"],{to:"#\u624b\u52a8\u89e6\u53d1","aria-hidden":"true",tabIndex:-1},t.a.createElement("span",{className:"icon icon-link"})),"\u624b\u52a8\u89e6\u53d1"),t.a.createElement("p",null,"\u5982\u679c\u8bbe\u7f6e\u4e86 ",t.a.createElement("code",null,"options.manual = true"),"\uff0c\u5219 useRequest \u4e0d\u4f1a\u9ed8\u8ba4\u6267\u884c\uff0c\u9700\u8981\u901a\u8fc7 ",t.a.createElement("code",null,"run")," \u6765\u89e6\u53d1\u6267\u884c\u3002"),t.a.createElement(u["a"],{code:"const { loading, run } = useRequest(changeUsername, {\n  manual: true\n});",lang:"js"}),t.a.createElement("br",null)),t.a.createElement(c["default"],a["index-manual"].previewerProps,t.a.createElement(l,null)),t.a.createElement("div",{className:"markdown"},t.a.createElement("p",null,"\u4e0a\u9762\u4e24\u4e2a\u4f8b\u5b50\uff0c\u6211\u4eec\u6f14\u793a\u4e86 ",t.a.createElement("code",null,"useRequest")," \u6700\u57fa\u7840\u7684\u7528\u6cd5\uff0c\u63a5\u4e0b\u6765\u7684\u6211\u4eec\u5f00\u59cb\u9010\u4e2a\u8be6\u7ec6\u4ecb\u7ecd ",t.a.createElement("code",null,"useRequest")," \u7684\u7279\u6027\u3002"))))}));a["default"]=e=>{var a=t.a.useContext(r["context"]),n=a.demos;return t.a.useEffect((()=>{var a;null!==e&&void 0!==e&&null!==(a=e.location)&&void 0!==a&&a.hash&&r["AnchorLink"].scrollToAnchor(decodeURIComponent(e.location.hash.slice(1)))}),[]),t.a.createElement(m,{demos:n})}},MZF8:function(e,a,n){"use strict";var l=n("ogwx");n.d(a,"a",(function(){return l["b"]}));n("VCU9")}}]);