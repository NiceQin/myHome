import React from 'react';
import axios from 'axios';
import handle from './wsmain.js';
import IMEvent from './IMEvent.js';
import './window.css';
import { Icon,Form,TextArea,Button } from 'semantic-ui-react'

class ChatWindow extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      listData: [],
      msgContent: '',
      client: null
    }
  }

  componentDidMount() {
    const {from_user,to_user} = this.props.currentInfo;
    axios.post('chats/info',{
      from_user: from_user,
      to_user: to_user
    }).then(result=>{
      if(result.meta.status === 200) {
        // 打开聊天窗口的时候，需要向服务器注册用户ID
        let currentUser = localStorage.getItem('uid');
        let client = handle(currentUser,(data)=>{
          // 该回调函数用来处理服务器返回的消息（其实就是对方发送消息）
          // 其实就是接收对方返回的消息
          let newList = [...this.state.listData];
          // data.content表示接受到消息内容
          newList.push(JSON.parse(data.content));
          this.setState({
            listData: newList
          })
        });
        this.setState({
          listData: result.data.list,
          client: client
        });
      }
    })
  }

  sendMsg = () => {
    // 把表单的内容发送到后台
    // 把用户输入的信息封装称为数据包，然后发送到后台
    const {from_user, to_user, avatar} = this.props.currentInfo;
    let pdata = {
      id: new Date().getTime(),
      from_user: from_user,
      to_user: to_user,
      avatar: avatar,
      chat_msg: this.state.msgContent
    }
    // 把消息发送出去
    this.state.client.emitEvent(IMEvent.MSG_TEXT_SEND,JSON.stringify(pdata));
    // 把本人发送的消息添加到本地窗口中
    let newArr = [...this.state.listData, pdata]
    this.setState({
      listData: newArr
    });
  }
  handleMsgChange = (event) => {
    this.setState({
      msgContent: event.target.value
    });
  }

  render() {
    const {username} = this.props.currentInfo;
    // 获取当前用户ID（用于判断当前聊天用户）
    let currentUser = parseInt(localStorage.getItem('uid'),10);
    const listContent = this.state.listData.map(item=>{
      return (
        <li
          key={item.id}
          className={
            currentUser === item.from_user
              ? "chat-info-left"
              : "chat-info-right"
          }
        >
          <img src={"http://47.96.21.88:8086/public/1.png"} alt="" />
          <span>{item.chat_msg}</span>
        </li>
      );
    })
    return (
      <div className='chat-window'>
        <div className="chat-window-title">
          <Icon onClick={this.props.hideChat} name='angle left' className='chat-ret-btn' size='large'/>
          <span>{username}</span>
        </div>
        <div className="chat-window-content">
          <ul>
            {listContent}
          </ul>
        </div>
        <div className="chat-window-input">
          <Form>
            <TextArea value={this.state.msgContent} onChange={this.handleMsgChange} placeholder='请输入内容...' />
            <Button onClick={this.props.hideChat}>关闭</Button>
            <Button primary onClick={this.sendMsg}>发送</Button>
          </Form>
        </div>
      </div>
    );
  }
}
export default ChatWindow;
