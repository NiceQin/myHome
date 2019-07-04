import React from 'react';
import axios from 'axios';
import './chat.css';
import ChatWindow from './window.js';

class Chat extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      listData: [],
      isShow: false,
      currentInfo: {}
    }
  }

  componentDidMount() {
    axios.post('chats/list').then(result=>{
      if(result.meta.status === 200) {
        this.setState({
          listData: result.data.list
        });
      }
    })
  }

  toChat = (item) => {
    // 保存当前用户信息并且显示聊天窗口
    this.setState({
      isShow: !this.state.isShow,
      currentInfo: {
        username: item.username,
        from_user: item.from_user,
        to_user: item.to_user,
        avatar: item.avatar 
      }
    });
  }

  closeWindow = () => {
    this.setState({
      isShow: !this.state.isShow
    });
  }

  render() {
    const listContet = this.state.listData.map(item=>{
      return (
        <li key={item.id} onClick={this.toChat.bind(this, item)}>
          <div className="avarter">
            <img
              src={"http://47.96.21.88:8086/public/1.png"}
              alt="avarter"
            />
            <span className="name">{item.username}</span>
            <span className="info">{item.chat_msg}</span>
            <span className="time">{item.ctime}</span>
          </div>
        </li>
      );
    });
    return (
      <div className='chat-container'>
        <div className="chat-title">聊天</div>
        <div className="chat-list">
          <ul>
            {listContet}
          </ul>
        </div>
        {this.state.isShow && <ChatWindow hideChat={this.closeWindow} currentInfo={this.state.currentInfo}/>}
      </div>
    );
  }
}
export default Chat;
