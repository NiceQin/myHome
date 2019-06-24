import React from 'react';
import {Grid,Icon} from 'semantic-ui-react';
import {Route, Link} from "react-router-dom";
import 'semantic-ui-css/semantic.min.css';
import './main.css';
import Home from './home/home.js';
import Chat from './chat/chat.js';
import Info from './info/info.js';
import My from './my/my.js';

class Menu extends React.Component {
  render(){
    const {to, current, menuName, iconName} = this.props;
    return (
      <Route
        path={to}
        exact={current}
        children={({ match }) => (
          <Link to={to}>
            <div className={`placeholder ${match?"active":""}`}>
              <Icon name={iconName}/>
              <div>{menuName}</div>
            </div>
          </Link>
        )}
      />
    );
  }
}

class Main extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      
    }
  }

  render() {
    return (
      <div>
        <div className='main-content'>
          <Route exact path="/home" component={Home} />
          <Route path="/home/info" component={Info} />
          <Route path="/home/chat" component={Chat} />
          <Route path="/home/my" component={My} />
        </div>
        <div className='main-menu'>
          <Grid centered padded >
            <Grid.Row columns={4} divided >
              <Grid.Column>
                <Menu to='/home' current={true} menuName='主页' iconName='user secret'/>
              </Grid.Column>
              <Grid.Column>
                <Menu to='/home/info' menuName='资讯' iconName='window restore'/>
              </Grid.Column>
              <Grid.Column>
                <Menu to='/home/chat' menuName='微聊' iconName='microchip'/>
              </Grid.Column>
              <Grid.Column>
                <Menu to='/home/my' menuName='我的' iconName='window maximize'/>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </div>
      </div>
    );
  }
}

export default Main;