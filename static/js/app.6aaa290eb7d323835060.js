webpackJsonp([1],{"7nOq":function(t,e){},NHnr:function(t,e,a){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var i=a("7+uW"),r={render:function(){var t=this.$createElement,e=this._self._c||t;return e("div",{attrs:{id:"app"}},[e("transition",{attrs:{name:"fade"}},[e("router-view")],1)],1)},staticRenderFns:[]};var o=a("VU/8")({name:"App"},r,!1,function(t){a("huGD")},null,null).exports,s=a("/ocq"),n=a("mvHQ"),l=a.n(n),c=a("mtWM"),d=a.n(c),u={data:function(){return{stories:null,fullscreenLoading:!1,dateText:"",dateStr:"",todayStr:"",todayStr2:"",scrollPosition:0}},methods:{getFullFromApi:function(){var t=localStorage.getItem("daily_cache"),e=JSON.parse(t),a=this.dateStr.replace(/-/g,""),i=String(Number(a));if(t&&e.date===i)this.stories=e.stories;else{var r=this;r.fullscreenLoading=!0;var o={stories:{}};d.a.get("https://api.mou.science/daily/api/4/news/before/"+a).then(function(t){o.date=t.data.date;var e=[];t.data.stories.forEach(function(t){var a=t.id;o.stories[a]={},o.stories[a].info=t;var i="https://api.mou.science/daily/api/4/news/"+a;e.push(d.a.get(i))}),d.a.all(e).then(function(t){t.forEach(function(t){o.stories[t.data.id].content=t.data}),console.log("today: "+(r.todayStr===a)),r.todayStr===a?d.a.get("https://api.mou.science/daily/api/4/news/latest").then(function(t){o.date=t.data.date;var e=[];t.data.stories.forEach(function(t){var a=t.id;if(!o.stories[a]){o.stories[a]={},o.stories[a].info=t;var i="https://api.mou.science/daily/api/4/news/"+a;e.push(d.a.get(i))}}),d.a.all(e).then(function(t){t.forEach(function(t){o.stories[t.data.id].content=t.data}),r.stories=o.stories,localStorage.setItem("daily_cache",l()(o)),r.fullscreenLoading=!1})}):(r.stories=o.stories,localStorage.setItem("daily_cache",l()(o)),r.fullscreenLoading=!1)})}).catch(function(t){r.fullscreenLoading=!1,r.$message({showClose:!0,message:"加载失败，请重试。",duration:0,type:"error"}),console.log(t)})}},readsStory:function(t){this.changeRouter("/article/"+t)},getTodayData:function(){console.log("Get Today Date"),this.dateStr=this.todayStr2,this.getFullFromApi()},handleDateChange:function(t){console.log(t),this.dateStr=t,this.getFullFromApi()},changeRouter:function(t){console.log($(window).scrollTop()),sessionStorage.setItem("home_pos",$(window).scrollTop()),this.$router.push(t)}},mounted:function(){var t=new Date,e=t.getMonth()+1,a=t.getDate();this.dateStr=t.getFullYear()+"-"+(e<10?"0"+e:e)+"-"+(a<10?"0"+a:a),this.todayStr=t.getFullYear()+""+(e<10?"0"+e:e)+(a<10?"0"+a:a),this.todayStr2=t.getFullYear()+"-"+(e<10?"0"+e:e)+"-"+(a<10?"0"+a:a);var i=localStorage.getItem("daily_cache"),r=this.dateStr.replace(/-/g,""),o=String(Number(r)),s=JSON.parse(i);i?i&&(Number(o)===Number(s.date)?this.stories=s.stories:(this.stories=s.stories,this.$notify({title:"注意：",message:"此缓存非今天的日报，戳此通知可更新。",onClick:this.getTodayData,duration:2888}))):this.getFullFromApi(),setTimeout(function(){$(window).scrollTop(parseInt(sessionStorage.getItem("home_pos")))},100)}},h={render:function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("el-container",[a("el-header",{staticStyle:{padding:"0",height:"38px",width:"100%",position:"fixed",top:"0","z-index":"1000"}},[a("el-row",{attrs:{type:"flex",justify:"center"}},[a("el-col",{attrs:{md:15}},[a("div",{staticClass:"head"},[a("el-col",{attrs:{span:12}},[a("h5",{staticStyle:{"text-align":"center","margin-top":"6px","font-weight":"inherit"}},[t._v("知乎日报")])]),t._v(" "),a("el-col",{attrs:{span:11}},[a("el-date-picker",{staticStyle:{width:"100%"},attrs:{size:"small",type:"date",format:"yyyy-MM-dd","value-format":"yyyy-MM-dd",placeholder:"选择日期",editable:!1,clearable:!1},on:{change:t.handleDateChange},model:{value:t.dateText,callback:function(e){t.dateText=e},expression:"dateText"}})],1)],1)])],1)],1),t._v(" "),a("el-main",{staticStyle:{"padding-left":"15px","padding-right":"15px","padding-top":"48px"}},[a("el-row",{attrs:{type:"flex",justify:"center"}},[a("el-col",{attrs:{md:{span:14}}},[a("el-row",{attrs:{gutter:30}},t._l(t.stories,function(e){return a("el-col",{key:e.id,attrs:{span:12,md:6,sm:8}},[a("el-card",{attrs:{"body-style":{padding:"0px"}}},[a("img",{staticClass:"image",attrs:{src:e.content.image.replace(/(https|http):\/\/(.*?)/g,"https://images.weserv.nl/?url=$2")},on:{click:function(a){t.readsStory(e.info.id)}}}),t._v(" "),a("div",{staticStyle:{padding:"14px"},on:{click:function(a){t.readsStory(e.info.id)}}},[a("span",{staticStyle:{"font-size":"15px","line-height":"1.6em"}},[t._v(t._s(e.info.title))]),t._v(" "),a("div",{staticClass:"bottom clearfix"},[a("time",{staticClass:"time"},[t._v("id: "+t._s(e.info.id))])])])]),t._v(" "),a("br")],1)}))],1)],1)],1),t._v(" "),a("el-row",{directives:[{name:"loading",rawName:"v-loading.fullscreen.lock",value:t.fullscreenLoading,expression:"fullscreenLoading",modifiers:{fullscreen:!0,lock:!0}}],attrs:{"element-loading-text":"加载中......"}})],1)},staticRenderFns:[]};var p=a("VU/8")(u,h,!1,function(t){a("nfC8")},null,null).exports,g={data:function(){return{currentStory:{body:"",img_source:"",image:"",viewMore:"",title:""},currentStoryId:"",clickCount:0,clickTimer:null,errorMessage:"",fullscreenLoading:!1}},methods:{getContent:function(t){setTimeout(function(){$(window).scrollTop(0)},100);var e=localStorage.getItem("daily_cache"),a=JSON.parse(e);if(e){var i=null;i=a.stories[t].content,this.currentStory.body=i.body.replace(/<img class="content-image" src="(https|http):\/\/(.*?)"/g,'<img class="content-image" src="https://images.weserv.nl/?url=$2"').replace('<div class="img-place-holder"></div>','<div class="img-place-holder" style="height: auto;"><div class="img-wrap">\n<h1 class="headline-title">'+i.title+'</h1>\n<span class="img-source">'+i.image_source+'</span>\n<img src="'+i.image.replace(/(https|http):\/\/(.*?)/,"https://images.weserv.nl/?url=$2")+'" alt="">\n<div class="img-mask"></div>\n</div></div>'),this.currentStory.img_source=i.image_source,this.currentStory.title=i.title,this.currentStory.image=i.image;var r=i.body.match(/class="view-more"><a href="(.+?)">/);this.currentStory.viewMore=r?r[1]:"#","false"!==localStorage.getItem("daily_vue_first_use")&&(this.$notify({title:"操作提示：",message:"1.双击随机一篇文章， 2.点击左上角“知乎日报”可返回列表， 3.浏览器后退有效， 4.数据已存储到本地，日期变化时重新加载， 5.查看非当天日报请使用后退返回，点击左上角会重载当天数据。",duration:0}),localStorage.setItem("daily_vue_first_use","false"))}},backToTop:function(){$("html,body").animate({scrollTop:0},400)},articleClick:function(){if(this.clickCount++,1===this.clickCount){var t=this;this.clickTimer=setTimeout(function(){t.clickCount=0},700)}else this.randomArticle(),clearTimeout(this.clickTimer),this.clickCount=0},backHome:function(){this.$router.push({path:"/"})},randomArticle:function(){var t=localStorage.getItem("daily_cache"),e=JSON.parse(t);if(t){var a=[];for(var i in e.stories)a.push(i);var r=a[Math.floor(Math.random()*a.length)];this.$router.push({path:"/article/"+r})}}},watch:{$route:function(){var t=this;this.currentStoryId="",setTimeout(function(){t.currentStoryId=t.$route.params.aid},300),this.getContent(this.$route.params.aid)}},mounted:function(){this.currentStoryId=this.$route.params.aid,this.getContent(this.$route.params.aid)}},m={render:function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("el-container",[a("el-header",{staticStyle:{padding:"0",height:"38px",width:"100%",position:"fixed",top:"0","z-index":"1000"}},[a("el-row",{attrs:{type:"flex",justify:"center"}},[a("el-col",{attrs:{md:15}},[a("div",{staticClass:"head"},[a("el-col",{attrs:{span:12}},[a("h5",{staticStyle:{"text-align":"center","margin-top":"6px","font-weight":"inherit"},on:{click:t.backHome}},[t._v("知乎日报")])]),t._v(" "),a("el-col",{attrs:{span:8}},[a("table",{staticStyle:{height:"100%","margin-top":"5px"}},[a("tr",[a("td",[a("a",{staticStyle:{color:"black","text-decoration":"underline"},attrs:{target:"_blank",href:t.currentStory.viewMore}},[t._v("查看问题")])])])])]),t._v(" "),a("el-col",{attrs:{span:4}},[a("el-button",{staticStyle:{width:"100%","background-color":"transparent",border:"none"},on:{click:t.randomArticle}},[a("span",{staticClass:"el-icon-arrow-right"})])],1)],1)])],1)],1),t._v(" "),a("div",{staticStyle:{"margin-top":"21px",padding:"15px"}},[a("div",{staticClass:"row"},[a("transition",{attrs:{name:"fade"}},[t.currentStoryId?a("div",{staticClass:"col-12",on:{click:t.articleClick}},[a("div",{domProps:{innerHTML:t._s(t.currentStory.body)}}),t._v(" "),a("el-button",{staticClass:"back-to-top",attrs:{size:"small"},on:{click:t.backToTop}},[t._v("To top")])],1):t._e()])],1)])],1)},staticRenderFns:[]};var f=a("VU/8")(g,m,!1,function(t){a("7nOq")},null,null).exports;i.default.use(s.a);var v=new s.a({routes:[{path:"/",name:"Home",component:p},{path:"/article/:aid",name:"Article",component:f}]}),y=a("zL8q"),S=a.n(y);a("tvR6");i.default.use(S.a),i.default.config.productionTip=!1,new i.default({el:"#app",router:v,components:{App:o},template:"<App/>"})},huGD:function(t,e){},nfC8:function(t,e){},tvR6:function(t,e){}},["NHnr"]);
//# sourceMappingURL=app.6aaa290eb7d323835060.js.map