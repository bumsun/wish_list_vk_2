import React from 'react';
import ReactDOM from 'react-dom';
import { View, Panel, PanelHeader, Group, List, Cell } from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';
import MyEpic from './MyEpic.js';

function App () {
  
  return new MyEpic();
  // return (
  //   <View activePanel="main">
  //     <Panel id="main">
  //       <PanelHeader>VKUI</PanelHeader>
  //       <Group title="Items">
  //         <List>
  //           <Cell>Hello</Cell>
  //           <Cell>World</Cell>
  //         </List>
  //       </Group>
  //     </Panel>
  //   </View>
  // );
}

ReactDOM.render(<App />, document.getElementById('root'));

export default App;