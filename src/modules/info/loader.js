import React from 'react';
import Tloader from 'react-touch-loader';
import './tab.css';
import axios from 'axios';
import { Item,Icon,Button } from 'semantic-ui-react';

const RecoMessage = (props) => {
  let content = [];
  props.listData.forEach(item=>{
    content.push(
      <Item key={item.id}>
        <Item.Image size='small' src='http://47.96.21.88:8086/public/1.png' />
        <Item.Content verticalAlign='middle'>
          <Item.Header className='info-title'>{item.info_title}</Item.Header>
          <Item.Meta>
            <span className='price'>$1200</span>
            <span className='stay'>1 Month</span>
          </Item.Meta>
        </Item.Content>
      </Item>
    );
  })
  return (
    <Item.Group unstackable>
      {content}
    </Item.Group>
  );
}
const AskAnswer = (props) => {
  let list = [];
  props.listData.forEach(item=>{
    list.push(
      <li key={item.question_id}>
        <div className='title'>
          <span className='cate'>
            <Icon color='green' name='users' size='small' />
            思维
          </span>
          <span>
            {item.question_name}
          </span>
        </div>
        {item.answer_content&&(
          <div className='user'>
            <Icon circular name='users' size='mini'/>
            {item.username} 的回答
          </div>
        )}
        <div className="info">
          {item.answer_content}
        </div>
        <div className="tag">
          {item.question_tag&&item.question_tag.split(',').map((tag,index)=>{return <span key={index}>{tag}X</span>})}
          <span>{item.qnum?item.qnum:0}个回答</span>
        </div>
      </li>
    );
  });
  return (
    <div>
      <div className='info-ask-btn'>
        <Button fluid color='green'>快速提问</Button>
      </div>
      <ul className='info-ask-list'>{list}</ul>
    </div>
  );
}

class Loader extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      initializing: 0,
      hasMore: false,
      listData: [],
      total: 0
    }
  }

  refresh = (resolve, reject) => {
    console.log(1)
  }

  loadMore = (resolve) => {
    console.log(2)
  }

  loadData = () => {
    const {type} = this.props;
    return axios.post('infos/list',{
      pagenum: 0,
      pagesize: 2,
      type: type
    }).then(result=>{
      if(result.meta.status === 200) {
        this.setState({
          listData: result.data.list.data,
          total: result.data.list.total
        });
      }
    })
  }

  componentDidMount(){
    this.loadData();
  }

  initList = () => {
    // 产生列表内容
    const {type} = this.props;
    if(type === 1 || type === 2) {
      // 加载资讯
      return <RecoMessage listData={this.state.listData}/>
    }else if(type === 3){
      // 加载问答列表
      return <AskAnswer listData={this.state.listData}/>
    }
  }

  render(){
    const {hasMore,initializing} = this.state;
    return (
      <div className="view">
        <Tloader className="main"
          onRefresh={(resolve, reject) => this.refresh(resolve, reject)}
          onLoadMore={(resolve) => this.loadMore(resolve)}
          hasMore={hasMore}
          initializing={initializing}>
          <ul>{this.initList()}</ul>
        </Tloader>
      </div>
    );
  }
}

export default Loader;
