import React from 'react';
import ReactDOM from 'react-dom';
import { View, Panel, PanelHeader, Group, List, Cell,Tabbar,TabbarItem,Epic} from '@vkontakte/vkui';
import Icon28Newsfeed from '@vkontakte/icons/dist/28/newsfeed';
import Icon28Search from '@vkontakte/icons/dist/28/search';
import Icon28Messages from '@vkontakte/icons/dist/28/messages';
import Icon28Notifications from '@vkontakte/icons/dist/28/notifications';
import Icon28More from '@vkontakte/icons/dist/28/more';


class MyEpic extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      activeStory: 'more'
    };
    this.onStoryChange = this.onStoryChange.bind(this);
  }

  onStoryChange (e) {
    this.setState({ activeStory: e.currentTarget.dataset.story })
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