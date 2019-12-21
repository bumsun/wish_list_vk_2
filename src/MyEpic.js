import React from 'react';
import ReactDOM from 'react-dom';
import fetchJsonp from 'fetch-jsonp';
import { Div,View, Panel, PanelHeader, Group, List, Cell,Tabbar,TabbarItem,Epic,Button, Avatar,Slider, Input, FormLayoutGroup,FormLayout, HeaderButton, Tooltip} from '@vkontakte/vkui';
import PanelHeaderBack from '@vkontakte/vkui/dist/components/PanelHeaderBack/PanelHeaderBack';
import Icon28Newsfeed from '@vkontakte/icons/dist/28/newsfeed';
import Icon28Search from '@vkontakte/icons/dist/28/search';
import Icon28Messages from '@vkontakte/icons/dist/28/messages';
import Icon28Notifications from '@vkontakte/icons/dist/28/notifications';
import Icon28More from '@vkontakte/icons/dist/28/more';
import Icon24Share from '@vkontakte/icons/dist/24/share'
import Icon24Back from '@vkontakte/icons/dist/24/back'
import Icon24ShareOutline from '@vkontakte/icons/dist/24/share_outline';
import Icon20GiftOutline from '@vkontakte/icons/dist/20/gift_outline';
import Icon20UserOutline from '@vkontakte/icons/dist/20/user_outline';
import Icon20FollowersOutline from '@vkontakte/icons/dist/20/followers_outline';
import Icon20ArticleBoxOutline from '@vkontakte/icons/dist/20/article_box_outline';

import connect from '@vkontakte/vk-connect';
import './App.css';

// import 'css/flexboxgrid.min.css';


const jsdom = require("jsdom");
const { JSDOM } = jsdom;


class MyEpic extends React.Component {
  constructor(props) {
    super(props);
    

    this.state = {
      authToken: null,
      activeStory: 'wish',
      user_owner_id: null,
      user_name: null,
      user_avatar: null,
      user_items: [],
      user_friend_wishes: [],
      user_my_mark_wishes: [],
      friends: [],
      friends_for_look: [],
      wish_owner_id: null,
      wish_name: null,
      wish_description: null,
      wish_reference_url: null,
      wish_price: null,
      wish_photo_url: null,
      wish_importance: null,
      friend_id: null,
      friend_name: null,
      friend_avatar: null,
      friend_items: [],
      gift_id: null,
      gift_owner_id: null,
      gift_photo_url: null,
      gift_name: null,
      gift_reference_url: null,
      gift_price: null,
      gift_modified: null,
      gift_description: null,
      gift_already_presented: null,
      tooltip1: true,
      tooltip2: true
    };

    this.onStoryChange = this.onStoryChange.bind(this);
    this.onAddWish = this.onAddWish.bind(this);
    this.handleChangeForAddWish = this.handleChangeForAddWish.bind(this);
    this.getFriends = this.getFriends.bind(this);
    this.onFriendClickHandler = this.onFriendClickHandler.bind(this);
    this.onBackClick = this.onBackClick.bind(this);
    this.loadFriendsWishes = this.loadFriendsWishes.bind(this);
    this.callShareDialog = this.callShareDialog.bind(this);
    this.onDeleteGiftClickHandler = this.onDeleteGiftClickHandler.bind(this);
    this.historyScreen = [this.state.activeStory]
    // this.loadWishList = this.loadWishList.bind(this);
  }

  onBackClick (e) {
  	if(this.historyScreen.length == 1){
		    return;
  	}
  	console.log("onBackClick = " + this.historyScreen.length);
    this.historyScreen.pop();
    console.log("onBackClick = " + this.historyScreen.length);
    this.setState({ activeStory: this.historyScreen[this.historyScreen.length-1] })
    if(this.historyScreen[this.historyScreen.length-1] == "friend"){
        this.loadWishlistByShare(this.state.friend_id);
    }
  }
  onStoryChange (e) {
    if(e.currentTarget.dataset.story == "add_wish"){
      this.historyScreen.push(e.currentTarget.dataset.story)
    }else{
      this.historyScreen = [e.currentTarget.dataset.story]
    }
  	
    this.setState({ activeStory: e.currentTarget.dataset.story })
  }

  onAddWish (e) {
    this.postData('https://upmob.ru/api/mirrorWishList', {method_name:"addGift",owner_id: this.state.wish_owner_id,owner_name: this.state.user_name, owner_avatar: this.state.user_avatar, name: this.state.wish_name, description:this.state.wish_description,reference_url:this.state.wish_reference_url, price:this.state.wish_price, photo_url:this.state.wish_photo_url, importance:this.state.wish_importance})
      .then(data => {
          console.log(JSON.stringify(data)) // JSON-строка полученная после вызова `response.json()`
          this.loadWishList(this.state.user_owner_id)
          this.onBackClick (e);

          this.setState({wish_price: null});
          this.setState({wish_photo_url: null});
          this.setState({wish_description: null});
          this.setState({wish_name: null});
      })
      .catch(error => console.error(error));
  }
  loadWishList (wish_owner_id) {
    console.log("wish_owner_id = " + wish_owner_id);

    this.postData('https://upmob.ru/api/mirrorWishList', {method_name:"getGiftsByUserId", owner_id: wish_owner_id})
      .then(data =>{
        console.log(JSON.stringify(data)) // JSON-строка полученная после вызова `response.json()`
        this.setState({ user_items: data.items})
      }) 
      .catch(error => console.error(error));
  }

  loadFriendsWishes (friends) {
    var uids = ""
    for(var i = 0; i < friends.length; i++){
    	if(i == 0){
    		uids += ""+friends[i].id;
    	}else{
    		uids += ","+friends[i].id;
    	}    	
    }
    console.log("loadFriendsWishes uids = " + uids)

    this.postData('https://upmob.ru/api/mirrorWishList', {method_name:"getGiftsForFriends", uids: uids})
      .then(data =>{
        console.log("loadFriendsWishes res = " + JSON.stringify(data)) // JSON-строка полученная после вызова `response.json()`
        
        this.state.user_my_mark_wishes = [];
        for(var i = 0; i < data.items.length; i++){
            var item = data.items[i];

            if(item.already_presented != null && item.already_presented == this.state.user_owner_id){
               this.state.user_my_mark_wishes.push(item)

            }
        }
        this.setState({ user_friend_wishes: data.items})
        this.setState({ friends_for_look: this.removeDuplicates(data.items, "owner_id")})

      }) 
      .catch(error => console.error(error));
  }
  removeDuplicates(originalArray, prop) {
     var newArray = [];
     var lookupObject  = {};

     for(var i in originalArray) {
        lookupObject[originalArray[i][prop]] = originalArray[i];
     }

     for(i in lookupObject) {
         newArray.push(lookupObject[i]);
     }
      return newArray;
 }

  postData(url = '', data = {}) {
  // Значения по умолчанию обозначены знаком *
    return fetch(url, {
	        method: 'POST', // *GET, POST, PUT, DELETE, etc.
	        mode: 'cors', // no-cors, cors, *same-origin
	        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
	        credentials: 'same-origin', // include, *same-origin, omit
	        headers: {
	            'Content-Type': 'application/json',
	            // 'Content-Type': 'application/x-www-form-urlencoded',
	        },
	        redirect: 'follow', // manual, *follow, error
	        referrer: 'no-referrer', // no-referrer, *client
	        body: JSON.stringify(data), // тип данных в body должен соответвовать значению заголовка "Content-Type"
	    }).then(response => response.json()); // парсит JSON ответ в Javascript объект
	}
	getFriends() {
		const ownerId = 124527492
		let api = `https://api.vk.com/method/friends.get?v=5.52&access_token=${this.state.authToken}&fields=photo_100`
		fetchJsonp(api)
		.then(res => res.json())
		.then(data => {
			console.log("getFriends data = " + JSON.stringify(data))
			this.setState({ friends : data.response.items});
			this.loadFriendsWishes(data.response.items)
		})
		.catch(e => {
			console.log("getFriends e = " + e)
		})
	}

  

  componentDidMount() {
    connect.subscribe((e) => {
      console.log("e = " + JSON.stringify(e));
      if (e.detail.hasOwnProperty('type')) {
        switch (e.detail.type) {
          case 'VKWebAppGetUserInfoResult':
            console.log("e.detail.data = " + JSON.stringify(e.detail.data));
            console.log("this.state.avatar = " + this.state.user_avatar);
            this.setState({ user_avatar: e.detail.data.photo_200 });
            this.setState({ user_name: e.detail.data.first_name + " " + e.detail.data.last_name});
            this.setState({ wish_owner_id: e.detail.data.id + ""});

            if(this.state.user_owner_id == null){
            	this.setState({ user_owner_id: e.detail.data.id + ""});
            }
            this.loadWishList(this.state.wish_owner_id);

            console.log("window.location.href = " + window.location.hash);
            if(window.location.hash != undefined && window.location.hash.length > 0){
              this.loadWishlistByShare(window.location.hash.replace("#",""))
            }
            
            break;
          case 'VKWebAppInit':
            
            break;
          case 'VKWebAppAccessTokenReceived':
			this.setState({ authToken : e.detail.data.access_token });
			this.getFriends()
			break;
          case 'VKWebAppCallAPIMethodResult':
            debugger;
            if (e.detail.data.request_id === '34bc') {
              this.setState({ friends: e.detail.data.response.items });
            }
            break;
          default:
            break;
        }
      }
    });
    connect.send('VKWebAppInit');
    connect.send('VKWebAppGetUserInfo', {});
    connect.send("VKWebAppGetAuthToken", {"app_id": 7241610, "scope": "friends"});

    // connect
    //   .sendPromise('VKWebAppGetUserInfo')
    //   .then(data => {
    //     // Обработка события в случае успеха
    //     console.log("data= " + JSON.stringify(data));
    //   })
    //   .catch(error => {
    //     // Обработка события в случае ошибки
    //     console.log("error= " + JSON.stringify(error));
    //   });
  }

  async handleChangeForAddWish(event) {
      const target = event.target;
      console.log('event', event);
      var value = target.value;
      var name = target.name;
      

      switch (name) {
          case 'wish_reference_url':
              if(value == undefined){
                  return;
              }

              if(value.indexOf("market.yandex.ru") == -1){
	              	// this.setState({wish_price: "Цена не известна"});
	                this.setState({wish_photo_url: "https://vk.com/images/vkapp_i.png"});
	                this.setState({wish_description: ""});
	                this.setState({wish_reference_url: value});
                  return;
              }
              value = value.replace("m.market.yandex.ru","market.yandex.ru")

              this.setState({wish_reference_url: value});
              
              this.postData('https://upmob.ru/api/mirrorWishList', {method_name:"getFromYandexMarget", reference_url: value})
              .then(data =>{
                this.setState({wish_price: data.wish_price});
                this.setState({wish_photo_url: data.wish_photo_url.replace("http","https")});
                this.setState({wish_description: data.wish_description});
                this.setState({wish_name: data.wish_name});
              }) 
              .catch(error => console.error(error));
              
              break;
          case 'wish_name':
              this.setState({wish_name: value});
              break;
          default:
              console.log('unknown name', name);
      }
  }

  onFriendClickHandler(friend,e) {
  	console.log("e id = " + friend + " " + e);
    this.historyScreen.push("friend")
  	this.setState({ activeStory: "friend" })
  	this.setState({ friend_id: friend.owner_id})
  	this.setState({ friend_name: friend.owner_name })
  	this.setState({ friend_avatar: friend.owner_avatar})
  	
  	this.postData('https://upmob.ru/api/mirrorWishList', {method_name:"getGiftsByUserId", owner_id: friend.owner_id})
      .then(data =>{
        console.log(JSON.stringify(data)) // JSON-строка полученная после вызова `response.json()`
        this.setState({ friend_items: data.items})
      }) 
      .catch(error => console.error(error));
  }

  loadWishlistByShare(user_id) {
    
    this.postData('https://upmob.ru/api/mirrorWishList', {method_name:"getGiftsByUserId", owner_id: user_id})
      .then(data =>{
        console.log(JSON.stringify(data)) // JSON-строка полученная после вызова `response.json()`
        this.setState({ friend_items: data.items})
        this.setState({ activeStory: "friend" })
        this.historyScreen.push("friend")

        if(data.items.length > 0){
            this.setState({ friend_id: data.items[0].owner_id})
            this.setState({ friend_name: data.items[0].owner_name})
            this.setState({ friend_avatar: data.items[0].owner_avatar})
        }
      }) 
      .catch(error => console.error(error));
  }

  onGiftClickHandler(gift,e) {
  	console.log("e id = " + gift + " " + e);
    this.historyScreen.push("gift")
  	this.setState({ activeStory: "gift" })

	  this.setState({ gift_id: gift._id })
  	this.setState({ gift_owner_id: gift.owner_id })
  	this.setState({ gift_photo_url: gift.photo_url })
  	this.setState({ gift_name: gift.name })
  	this.setState({ gift_price: gift.price })
    this.setState({ gift_reference_url: gift.reference_url})

  	this.setState({ gift_modified: gift.modified })
  	this.setState({ gift_description: gift.description })

  	this.setState({ gift_already_presented: gift.already_presented })

  	console.log("onGiftClickHandler gift_owner_id = " + this.state.gift_photo_url + " " + this.state.user_owner_id);
  }

  onSetMarkGiftClickHandler(e) {
    console.log("onSetMarkGiftClickHandler 1")
  	if(this.state.gift_already_presented == this.state.user_owner_id || this.state.gift_already_presented == null){
  		console.log("onSetMarkGiftClickHandler 2")
      var owner_id = null;
  		if(this.state.gift_already_presented == null){
  			owner_id = this.state.user_owner_id 
  		}

      // for(var i = 0; i < this.state.user_my_mark_wishes.length; i++){
      //     var item = this.state.user_my_mark_wishes[i];
      //     if(item._id == this.state.gift_id){
      //        item.gift_already_presented = owner_id;
      //     }
      // }

      // for(var i = 0; i < this.state.user_friend_wishes.length; i++){
      //     var item = this.state.user_friend_wishes[i];

      //     if(item._id == this.state.gift_id){
      //       console.log("onSetMarkGiftClickHandler 2 = " + item._id + " " + this.state.gift_id)
      //        item.gift_already_presented = owner_id;
      //        console.log("onSetMarkGiftClickHandler gift_already_presented = " + item.gift_already_presented )
      //     }
      // }
      // this.setState({ user_friend_wishes: this.state.user_friend_wishes });

  		this.setState({ gift_already_presented: owner_id })
  		this.postData('https://upmob.ru/api/mirrorWishList', {method_name:"setMarkToBuyGifts", gift_id: this.state.gift_id, owner_id: owner_id})
	      .then(data =>{
	        console.log(JSON.stringify(data)) // JSON-строка полученная после вызова `response.json()`
          this.getFriends()

          this.loadFriendsWishes(this.state.friends)
	      }) 
	      .catch(error => console.error(error));

  	}
  }


  onDeleteGiftClickHandler(e) {
    console.log("onDeleteGiftClickHandler 1")
    this.postData('https://upmob.ru/api/mirrorWishList', {method_name:"removeGift", gift_id: this.state.gift_id})
        .then(data =>{
          console.log(JSON.stringify(data)) // JSON-строка полученная после вызова `response.json()`
          this.loadFriendsWishes(this.state.friends)
          this.loadWishList(this.state.user_owner_id)
          this.onBackClick(e)
        }) 
        .catch(error => console.error(error));
  }

  callShareDialog(e) {
    connect.send("VKWebAppShare", {"link": "https://vk.com/app7241610#"+this.state.user_owner_id});
  }







  

  render () {
    return (
      <Epic activeStory={this.state.activeStory} tabbar={
        <Tabbar>
          <TabbarItem
            onClick={this.onStoryChange}
            selected={this.state.activeStory === 'wish'}
            data-story="wish"
            text="Мои желания"
          ><Icon20GiftOutline /></TabbarItem>
          <TabbarItem
            onClick={this.onStoryChange}
            selected={this.state.activeStory === 'friends'}
            data-story="friends"
            text="Друзья"
          ><Icon20UserOutline /></TabbarItem>
          <TabbarItem
            onClick={this.onStoryChange}
            selected={this.state.activeStory === 'feed'}
            data-story="feed"
            text="Лента"
          ><Icon20FollowersOutline /></TabbarItem>
          <TabbarItem
            onClick={this.onStoryChange}
            selected={this.state.activeStory === 'list_presents'}
            data-story="list_presents"
            text="Я подарю"
          ><Icon20ArticleBoxOutline /></TabbarItem>
        </Tabbar>
      }>
        <View id="wish" activePanel="wish">
          <Panel id="wish">
            <PanelHeader>Мои желания</PanelHeader>
            <Div>
              <div class="flexbox-container" >
                <div><div class="ava2"><div class="centered5">{this.state.user_items.length}</div><p style={{margin: 5}}>Желаний</p></div></div>
                <div><Avatar src={this.state.user_avatar} size={180}/></div>
                <Tooltip text="Поделитесь с друзьями Вишлистом, когда он будет готов" cornerOffset={-10}
                    offsetX={7} alignX="right" onClose={() => this.setState({ tooltip2: false})} isShown={this.state.tooltip2 && this.state.user_items.length > 0}>
                     <div><div class="ava3" onClick={this.callShareDialog.bind(this)}><div class="centered6"><Icon24ShareOutline style={{color: "#000000"}} class="iconShare" /></div><p>Поделиться</p></div></div>
              </Tooltip>
               
              </div>
              <div class="centered7" >{this.state.user_name}</div>
              <div class="centered10">
               <Button onClick={this.onStoryChange} data-story="add_wish" size="xl">Добавить желание</Button>
             </div>
            </Div>
              
             <Group>
              <List>
                { 
                  this.state.user_items.length > 0 && this.state.user_items.map((item, index) => (
                    <Cell 
                      key={index}
                      onClick={this.onGiftClickHandler.bind(this,item)}
                      before={
                        <img 
                          style={{ 
                            width: 40, 
                            height : 40, 
                            margin : 10 
                          }} 
                          src={item.photo_url}
                        />
                      }
                      multiline
                      description={
                        item.price != undefined &&
                        item.price+" ₽"} 
                    >
                    {item.name}
                    </Cell>
                  ))
                }
                {
                  this.state.user_items.length == 0 &&
                  <Div>
                    Список желаний пуст.
                  </Div>
                }
              </List>
            </Group>
          </Panel>
        </View>
        <View id="friend" activePanel="wish">
          <Panel id="wish">
            <PanelHeader left={<PanelHeaderBack onClick={this.onBackClick} />}>Желания друга</PanelHeader>
              <div class="flexbox-container" 
                   style={{marginTop: "20px"}}>
                  <div><Avatar src={this.state.friend_avatar} size={170} /></div>
              </div>
              <div class="centered7">{this.state.friend_name}</div><div class="centered8" style={{color: "#888888"}}><p>Желаний: {this.state.friend_items.length}</p></div>
             <Group>
              <List>
                { 
                  this.state.friend_items.length > 0 && this.state.friend_items.map((item, index) => (
                    <Cell 
                      key={index}
                      onClick={this.onGiftClickHandler.bind(this,item)}
                      style={{opacity: item.already_presented && item.already_presented != this.state.user_owner_id  ? 0.3 : 1}}
                      before={
                        <img 
                          style={{ 
                            width: 40, 
                            height : 40, 
                            margin : 10 
                          }} 
                          src={item.photo_url}
                        />
                      }
                      multiline
                      description={
                        item.price != undefined && item.already_presented == undefined ?
                       item.price+" ₽" :
                        item.already_presented != undefined && item.already_presented != this.state.user_owner_id  &&
                        "Подарок забронирован"} 
                    >
                    {item.name}
                    </Cell>
                  ))
                }
                {
                  this.state.friend_items.length == 0 &&
                  <Div>
                    Список желаний пуст.
                  </Div>
                }
              </List>
            </Group>
          </Panel>
        </View>
        <View id="gift" activePanel="wish">
          <Panel id="wish">
            <PanelHeader left={<PanelHeaderBack onClick={this.onBackClick} />}>Подарок</PanelHeader>
              <div class="centered11" style={{backgroundColor:"#FFFFFF"}}>
                  <img src={this.state.gift_photo_url} style={{maxWidth: "50%", maxHeight: "50%", margin: "50px"}}/>
              </div>
               <div class="centered3" style={{fontWeight:600, fontSize:"18pt"}}>
                  {this.state.gift_name} 
              </div>
              <div class="centered3" style={{color:"#999999", fontSize:"13pt"}}>
                  {this.state.gift_price != null &&
                    this.state.gift_price.toLocaleString('en')   + " ₽"}
              </div>
              <div class="centered3">
              	<Button component="a" href={this.state.gift_reference_url} level="secondary" size="xl">Открыть ссылку</Button>
              </div>
              <div class="centered3" style={{color:"#999999", fontSize:"11pt"}}>
                  {"Создано " + (new Date(Date.parse(this.state.gift_modified)).toLocaleString("ru", {year: 'numeric',month: 'long',day: 'numeric'})) } 
              </div>
               <div class="centered3">
                  {this.state.gift_description} 
              </div>
				      {
	              this.state.gift_owner_id != this.state.user_owner_id && this.state.gift_already_presented == null &&
	              <Div class="centered4">
	                <Button onClick={this.onSetMarkGiftClickHandler.bind(this)} size="xl">Я подарю</Button>
	              </Div>
	            }
	            {
	              this.state.gift_owner_id != this.state.user_owner_id && this.state.gift_already_presented != null && this.state.gift_already_presented == this.state.user_owner_id && 
	              <Div class="centered4">
                  <div>
                    <p style={{color:"#999999"}}>Вы собираетесь подарить эту вещь</p>
  	                <Button onClick={this.onSetMarkGiftClickHandler.bind(this)} size="xl">Отменить</Button>
  	              </div>
                </Div>
	            }
	            {
	              this.state.gift_owner_id != this.state.user_owner_id && this.state.gift_already_presented != null && this.state.gift_already_presented != this.state.user_owner_id && 
	              <Div class="centered4">
	                 <p style={{color:"#999999"}} >Эта вещь уже забронирована.</p>
	              </Div>
	            }
              {
                this.state.gift_owner_id == this.state.user_owner_id &&
                <Div class="centered4">
                  <div>
                    <p style={{color:"#999999"}}>Вам уже подарили эту вещь? Или вы передумали?</p>
                    <Button level="destructive" size="xl" onClick={this.onDeleteGiftClickHandler.bind(this)}>Удалить карточку</Button>
                  </div>
                </Div>
              }
			
          </Panel>
        </View>
        <View id="friends" activePanel="friends">
          <Panel id="friends">
            <PanelHeader>Друзья</PanelHeader>
            <Group>
              <List>
                { 
                  this.state.friends_for_look.length > 0 && this.state.friends_for_look.map((item, index) => (
                    <Cell 
                      key={index}
                      onClick={this.onFriendClickHandler.bind(this,item)}
                      before={
                        <Avatar 
                          style={{ 
                            width: 40, 
                            height : 40
                          }} 
                          src={item.owner_avatar}
                        />
                      }
                      multiline
                      description={"Хочет " + item.name + " и еще..."}
                    >
                    {item.owner_name}
                    </Cell>
                  ))
                }
                {
                  this.state.friends_for_look.length == 0 &&
                  <Div>
                    Друзей пока что нет в приложении :(
                  </Div>
                }
              </List>
            </Group>
          </Panel>
        </View>
        <View id="feed" activePanel="feed">
          <Panel id="feed">
            <PanelHeader>Желания друзей</PanelHeader>
            <Group>
              <List>
                { 
                  this.state.user_friend_wishes.length > 0 && this.state.user_friend_wishes.map((item, index) => (
                    <Cell 
                      key={index}
                      onClick={this.onGiftClickHandler.bind(this,item)}
                      before={
                        <Avatar 
                          style={{ 
                            width: 40, 
                            height : 40, 
                            margin : 10 
                          }} 
                          src={item.owner_avatar}
                        />
                      }
                      multiline
                      description={
                        item.price != undefined &&
                        item.price+" ₽"} 
                    >
                    <div><img src={item.photo_url} style={{ 
                                          width: 30, 
                                          height : 30, 
                                          margin : 0 
                                        }} /> </div>
                    {item.name}
                    </Cell>
                  ))
                }
                {
                  this.state.user_friend_wishes.length == 0 &&
                  <Div>
                    Ваши друзья еще не успели пожелать подарки :(
                  </Div>
                }
              </List>
            </Group>
          </Panel>
        </View>
        <View id="list_presents" activePanel="list_presents">
          <Panel id="list_presents">
            <PanelHeader>Собираюсь подарить</PanelHeader>
            <Group>
              <List>
                { 
                  this.state.user_my_mark_wishes.length > 0 && this.state.user_my_mark_wishes.map((item, index) => (
                    <Cell 
                      key={index}
                      onClick={this.onGiftClickHandler.bind(this,item)}
                      before={
                        <Avatar 
                          style={{ 
                            width: 40, 
                            height : 40, 
                            margin : 10 
                          }} 
                          src={item.owner_avatar}
                        />
                      }
                      multiline
                      description={
                        item.price != undefined &&
                        item.price+" ₽"} 
                    >
                    <div><img src={item.photo_url} style={{ 
                            width: 30, 
                            height : 30, 
                            margin : 0 
                          }} /> </div>
                    {item.name}
                    </Cell>
                  ))
                }
                {
                  this.state.user_my_mark_wishes.length == 0 &&
                  <Div>
                    Вы еще не выбрали, что хотите подарить:(
                  </Div>
                }
              </List>
            </Group>
          </Panel>
        </View>
        <View id="add_wish" activePanel="add_wish">
          <Panel id="add_wish">
          	<PanelHeader left={<HeaderButton onClick={this.onBackClick}><Icon24Back/></HeaderButton>}> Добавить Желание</PanelHeader>
          	<Div>
              <a href="https://market.yandex.ru/">Yandex Market</a> - перейдите для поиска своего подарка
            </Div>
             <FormLayout>
              <FormLayoutGroup top="Вставьте ссылку на продукт">
              <Tooltip text="Если ссылка из Яндекс маркета, то вся информация о продукте заполнится автоматически" cornerOffset={-10}
                    offsetX={7} alignX="right" onClose={() => this.setState({ tooltip1: false})} isShown={this.state.tooltip1}>
                <Input top="Ссылка" onChange={this.handleChangeForAddWish} name="wish_reference_url" />
              </Tooltip>
              </FormLayoutGroup>
              {
                
                this.state.wish_reference_url != undefined && this.state.wish_reference_url.length > 1 && this.state.wish_reference_url.indexOf("market.yandex.ru") == -1 &&
                  <FormLayoutGroup top="Напишите название подарка">
                  <Input onChange={this.handleChangeForAddWish} name="wish_name" />
                  </FormLayoutGroup>
              }
            </FormLayout>

           
          	{
          		this.state.wish_description != null && this.state.wish_description.length > 3 &&
          		<Cell 
	              before={
	                <img 
	                  style={{ 
	                    width: 40, 
	                    height : 40, 
	                    margin : 10 
	                  }} 
	                  src={this.state.wish_photo_url}
	                />
	              }
	              multiline
	              description={
                  this.state.wish_price != undefined &&
                  this.state.wish_price+" ₽"} 
	            >
	            {this.state.wish_name}
	            </Cell>
          	}
          	{
              this.state.wish_name != undefined &&
              <Div class="centered4">
                 <Button level="commerce" onClick={this.onAddWish} data-story="add_wish" size="l">Готово</Button>
              </Div>
            }
            {
              this.state.wish_name == undefined &&
              <Div class="centered4">
                 <Button level="secondary" size="l">Готово</Button>
              </Div>
            }
          </Panel>
        </View>
      </Epic>
    )
  }
}
// <MyEpic />
export default MyEpic; 