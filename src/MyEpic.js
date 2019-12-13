import React from 'react';
import ReactDOM from 'react-dom';
import { View, Panel, PanelHeader, Group, List, Cell,Tabbar,TabbarItem,Epic,Button, Avatar} from '@vkontakte/vkui';
import Icon28Newsfeed from '@vkontakte/icons/dist/28/newsfeed';
import Icon28Search from '@vkontakte/icons/dist/28/search';
import Icon28Messages from '@vkontakte/icons/dist/28/messages';
import Icon28Notifications from '@vkontakte/icons/dist/28/notifications';
import Icon28More from '@vkontakte/icons/dist/28/more';
import connect from '@vkontakte/vk-connect';

class MyEpic extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      activeStory: 'wish',
      avatar: null
    };

    this.onStoryChange = this.onStoryChange.bind(this);

  }

  onStoryChange (e) {
    this.setState({ activeStory: e.currentTarget.dataset.story })
  }

  componentDidMount() {
    connect.subscribe((e) => {
      if (e.detail.hasOwnProperty('type')) {
        switch (e.detail.type) {
          case 'VKWebAppGetUserInfoResult':
            console.log("e.detail.data = " + JSON.stringify(e.detail.data));
            this.setState({ fetchedUser: e.detail.data });
            break;
          case 'VKWebAppGeodataResult':
            this.setState({ 
              geodata: {
                lat: e.detail.data.lat,
                lng: e.detail.data.long
              }
            });
            break;
          case 'VKWebAppAccessTokenReceived':
            this.setState({
              token: e.detail.data.access_token
            });
            this.getFriends();
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
    connect.send('VKWebAppGetUserInfo', {});
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
          ><Icon28Newsfeed /></TabbarItem>
          <TabbarItem
            onClick={this.onStoryChange}
            selected={this.state.activeStory === 'friends'}
            data-story="friends"
            text="friends"
          ><Icon28Search /></TabbarItem>
          <TabbarItem
            onClick={this.onStoryChange}
            selected={this.state.activeStory === 'feed'}
            data-story="feed"
            label="12"
            text="Лента"
          ><Icon28Messages /></TabbarItem>
        </Tabbar>
      }>
        <View id="wish" activePanel="wish">
          <Panel id="wish">
            <PanelHeader>Wish</PanelHeader>
              // <Avatar src={this.state.fetchedUser} size={80}/>
          </Panel>
        </View>
        <View id="friends" activePanel="friends">
          <Panel id="friends">
            <PanelHeader>Friends</PanelHeader>
          </Panel>
        </View>
        <View id="feed" activePanel="feed">
          <Panel id="feed">
            <PanelHeader>Feed</PanelHeader>
          </Panel>
        </View>
      </Epic>
    )
  }
}

// <MyEpic />
export default MyEpic; 