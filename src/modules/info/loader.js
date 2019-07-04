import React from 'react';
import Tloader from 'react-touch-loader';
import './tab.css';
import axios from 'axios';
import { Item,Icon,Button,Modal,TextArea } from 'semantic-ui-react';

class QuestionModel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      size: 'small',
      commentStyle: {
        width: '100%',
        border: 0
      },
      value: ''
    };
  }

  handleContent = (event) => {
    this.setState({
      value: event.target.value
    });
  }

  handleSubmit = () => {
    axios.post('infos/question',{
      question: this.state.value
    }).then(result=>{
      if(result.meta.status === 200) {
        // 关闭窗口
        this.props.close();
      }
    })
  }

  render() {
    return (
      <div>
        <Modal open={this.props.open} size={this.state.size}>
          <Modal.Header>发表评论</Modal.Header>
          <Modal.Content>
            <TextArea value={this.state.value} onChange={this.handleContent} style={this.state.commentStyle} placeholder='Tell us more' />
          </Modal.Content>
          <Modal.Actions>
            <Button onClick={this.props.close} negative>取消</Button>
            <Button onClick={this.handleSubmit} positive icon='checkmark' labelPosition='right' content='发表' />
          </Modal.Actions>
        </Modal>
      </div>
    )
  }
}

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
  props.listData.forEach((item,i)=>{
    list.push(
      <li key={i}>
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
      <QuestionModel close={props.close} open={props.open}/>
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
      hasMore: true,
      listData: [],
      total: 0,
      pagenum: 0, // 当前加载到了第几条
      pagesize: 2,
      loadSwitch : false,
      open: false
    }
  }

  refresh = (resolve, reject) => {
    // 为什么要添加定时函数？
    if(this.state.loadSwitch) {
      // 阻止后续代码运行并终止任务
      return reject();
    }
    setTimeout(()=>{
      // 刷新数据，重置状态
      this.setState({
        pagenum: 0,
        loadSwitch: true
      });
      this.loadData().then(result=>{
        console.log('success')
        this.setState({
          loadSwitch: false
        });
        resolve();
      })
    }, 0);
  }

  loadMore = (resolve) => {
    // 加载更多，本质上包含分页逻辑（1、从第几条开始，查询多少条）
    // 计算当前要加载的条数
    setTimeout(()=>{
      this.setState({
        pagenum: this.state.pagenum + this.state.pagesize
      });
      this.loadData().then(result=>{
        // 把新加载的数据填充到原有的集合中
        // this.state.listData.push(...result);
        // 推荐直接使用setState方式进行数据更新，不要使用push直接操作原始数据
        let newArr = [...this.state.listData, ...result]
        this.setState({
          listData: newArr
        });
        // 处理是否还有更多的数据
        this.setState({
          hasMore: this.state.pagenum>0 && this.state.pagenum<this.state.total
        });
        resolve();
      })
    }, 0);
  }

  loadData = () => {
    const {type} = this.props;
    return axios.post('infos/list',{
      pagenum: this.state.pagenum,
      pagesize: this.state.pagesize,
      type: type
    }).then(result=>{
      if(result.meta.status === 200) {
        this.setState({
          total: result.data.list.total
        });
        return result.data.list.data;
      }
    })
  }

  componentDidMount(){
    this.loadData().then(result=>{
      this.setState({
        listData: result,
      });
    })
  }

  handleClose = () => {
    // 打开问题弹窗
    this.setState({
      open: !this.state.open
    });
  }

  initList = () => {
    // 产生列表内容
    const {type} = this.props;
    if(type === 1 || type === 2) {
      // 加载资讯
      return <RecoMessage listData={this.state.listData}/>
    }else if(type === 3){
      // 加载问答列表
      return <AskAnswer open={this.state.open} close={this.handleClose} listData={this.state.listData}/>
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
