import React from 'react';
import {Icon,Item} from 'semantic-ui-react';
import {withRouter} from "react-router-dom";
import axios from 'axios';

class HouseList extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      list: []
    }
  }

  componentDidMount(){
    const {query} = this.props.location.state;
    axios.post('homes/list',{
      home_type: query.homeType
    }).then(result=>{
      if(result.meta.status === 200) {
        this.setState({
          list: result.data
        });
      }
    })
  }

  hideList = () => {
    // 处理路由的跳转
    // this.props.history.push('/home');
    this.props.history.goBack();
  }

  render(){
    const {query} = this.props.location.state;
    const listInfo = this.state.list.map(item=>{
      return (
        <Item key={item.id}>
          <Item.Image src={'http://127.0.0.1:8086/public/home.png'}/>
          <Item.Content>
            <Item.Header>{item.home_name}</Item.Header>
            <Item.Meta>
              <span className='cinema'>{item.home_desc}</span>
            </Item.Meta>
            <Item.Description>
              {item.home_tags}
            </Item.Description>
            <Item.Description>{item.home_price}</Item.Description>
          </Item.Content>
        </Item>
      );
    });
    return (
      <div className = 'house-list' >
        <div className = "house-list-title">
          <Icon onClick={this.hideList} name = 'angle left' size = 'large'/>{query.menuName}
        </div> 
        <div className = "house-list-content">
          <Item.Group divided unstackable>
            {listInfo}
          </Item.Group>
        </div>
      </div>
    );
  }
}
export default withRouter(HouseList);
