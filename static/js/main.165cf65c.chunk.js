(this["webpackJsonpvk-apps-wish-list"]=this["webpackJsonpvk-apps-wish-list"]||[]).push([[0],{155:function(e,t,a){e.exports=a(243)},243:function(e,t,a){"use strict";a.r(t);a(156),a(182),a(184),a(185),a(187),a(188),a(189),a(190),a(191),a(192),a(193),a(194),a(196),a(197),a(198),a(199),a(200),a(201),a(202),a(203),a(204),a(205),a(207),a(208),a(209),a(210),a(211),a(212),a(213),a(214),a(215),a(216),a(217),a(218),a(219),a(220),a(221),a(222),a(223),a(224);var n=a(0),s=a.n(n),r=a(16),i=a.n(r),l=a(25),c=a.n(l),o=a(9),d=(a(239),a(83)),u=a(84),h=a(89),p=a(85),m=a(41),f=a(90),y=a(86),b=a.n(y),v=a(87),E=a.n(v),S=a(88),g=a.n(S),k=(a(241),a(242),function(e){function t(e){var a;return Object(d.a)(this,t),(a=Object(h.a)(this,Object(p.a)(t).call(this,e))).state={activeStory:"wish",avatar:null},a.onStoryChange=a.onStoryChange.bind(Object(m.a)(a)),a}return Object(f.a)(t,e),Object(u.a)(t,[{key:"onStoryChange",value:function(e){this.setState({activeStory:e.currentTarget.dataset.story})}},{key:"componentDidMount",value:function(){var e=this;console.log("componentDidMount()"),c.a.subscribe((function(t){if(t.detail.hasOwnProperty("type"))switch(t.detail.type){case"VKWebAppGetUserInfoResult":console.log("e.detail.data = "+JSON.stringify(t.detail.data)),e.setState({fetchedUser:t.detail.data});break;case"VKWebAppGeodataResult":e.setState({geodata:{lat:t.detail.data.lat,lng:t.detail.data.long}});break;case"VKWebAppAccessTokenReceived":e.setState({token:t.detail.data.access_token}),e.getFriends();break;case"VKWebAppCallAPIMethodResult":"34bc"===t.detail.data.request_id&&e.setState({friends:t.detail.data.response.items})}})),c.a.send("VKWebAppGetUserInfo",{})}},{key:"render",value:function(){return s.a.createElement(o.c,{activeStory:this.state.activeStory,tabbar:s.a.createElement(o.f,null,s.a.createElement(o.g,{onClick:this.onStoryChange,selected:"wish"===this.state.activeStory,"data-story":"wish",text:"\u041c\u043e\u0438 \u0436\u0435\u043b\u0430\u043d\u0438\u044f"},s.a.createElement(b.a,null)),s.a.createElement(o.g,{onClick:this.onStoryChange,selected:"friends"===this.state.activeStory,"data-story":"friends",text:"friends"},s.a.createElement(E.a,null)),s.a.createElement(o.g,{onClick:this.onStoryChange,selected:"feed"===this.state.activeStory,"data-story":"feed",label:"12",text:"\u041b\u0435\u043d\u0442\u0430"},s.a.createElement(g.a,null)))},s.a.createElement(o.h,{id:"wish",activePanel:"wish"},s.a.createElement(o.d,{id:"wish"},s.a.createElement(o.e,null,"Wish"),s.a.createElement(o.b,null,"JSON = ",this.state.fetchedUser),s.a.createElement(o.a,{src:"https://sun9-11.userapi.com/c846420/v846420985/1526cd/YmiB_KSW1Q8.jpg?ava=1",size:80}))),s.a.createElement(o.h,{id:"friends",activePanel:"friends"},s.a.createElement(o.d,{id:"friends"},s.a.createElement(o.e,null,"Friends"))),s.a.createElement(o.h,{id:"feed",activePanel:"feed"},s.a.createElement(o.d,{id:"feed"},s.a.createElement(o.e,null,"Feed"))))}}]),t}(s.a.Component));function w(){return new k}i.a.render(s.a.createElement(w,null),document.getElementById("root"));var C=w;c.a.send("VKWebAppInit"),i.a.render(s.a.createElement(C,null),document.getElementById("root"))}},[[155,1,2]]]);
//# sourceMappingURL=main.165cf65c.chunk.js.map