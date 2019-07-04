import React from 'react';
import { Grid,Icon,Button,Modal } from 'semantic-ui-react'
import './my.css';
import axios from 'axios';
import AvatarEditor from 'react-avatar-editor'

class ImageModel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      size: 'small',
      commentStyle: {
        width: '100%',
        border: 0
      },
      value: '',
      scale: 1,
      allowZoomOut: false
    };
    this.fileInput = React.createRef();
  }

  submitComment = (e) => {
    this.props.selectImage(this.fileInput.current.files[0])
  }

  render() {
    const { open } = this.props
    return (
      <div>
        <Modal size={this.state.size} open={open}>
          <Modal.Header>选择图片</Modal.Header>
          <Modal.Content>
            <input type="file" ref={this.fileInput} />
          </Modal.Content>
          <Modal.Actions>
            <Button positive onClick={this.submitComment} icon='checkmark' labelPosition='right' content='确定' />
          </Modal.Actions>
        </Modal>
      </div>
    )
  }
}

class AvatarModel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      size: 'small',
      commentStyle: {
        width: '100%',
        border: 0
      },
      value: '',
      scale: 1,
      allowZoomOut: false
    };
  }

  handleScale = e => {
    const scale = parseFloat(e.target.value)
    this.setState({ 
      scale: scale 
    })
  }
  setEditorRef = editor => {
    if (editor) this.editor = editor
  }
  submitComment = (e) => {
    // 生成头像数据(把图片生成base64格式的数据)
    const img = this.editor.getImageScaledToCanvas().toDataURL()
    axios.post('/my/avatar',{
      avatar: img
    }).then(data=>{
      // 上传成功之后更新本地头像信息
      this.props.updateAvatar(img);
    })
  }
  render() {
    const { open,close,avatar } = this.props
    return (
      <div>
        <Modal size={this.state.size} open={open} onClose={close}>
          <Modal.Header>上传头像</Modal.Header>
          <Modal.Content>
            <AvatarEditor
              ref={this.setEditorRef}
              borderRadius={75}
              width={160}
              height={160}
              border={50}
              color={[255, 255, 255, 0.6]} // RGBA
              scale={this.state.scale}
              rotate={0}
              image={avatar}
            />
            <div>
              <span className='avatar-zoom'>缩放:</span>
              <input
                name="scale"
                type="range"
                onChange={this.handleScale}
                min={'1'}
                max="2"
                step="0.01"
                defaultValue="1"
              />
            </div>
          </Modal.Content>
          <Modal.Actions>
            <Button positive onClick={this.submitComment} icon='checkmark' labelPosition='right' content='确定' />
          </Modal.Actions>
        </Modal>
      </div>
    )
  }
}


class My extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      avatarPath: '', //生成的头像的base64数据
      uname: '',
      open: false,
      show: false,
      avatar: null // 选择的文件
    }
  }

  componentDidMount(){
    axios.post('my/info',{
      user_id: localStorage.getItem('uid')
    }).then(result=>{
      if(result.meta.status === 200) {
        this.setState({
          avatarPath: result.data.avatar,
          uname: result.data.username
        });
      }
    })
  }

  // handleClose = () => {
  //   this.setState({
  //     open: !this.state.open
  //   })
  // }

  selectImage = (file) => {
    // 设置选中的图片
    this.setState({
      avatar: file
    });
    // 隐藏选择图片的窗口
    this.toggleSelect();
    // 显示图片裁切弹窗
    this.cropImage();
  }

  cropImage = () => {
    this.setState({
      show: !this.state.show
    });
  }

  toggleSelect = () => {
    this.setState({
      open: !this.state.open
    });
  }

  updateAvatar = (img) => {
    // 更新最新的头像图片
    this.setState({
      avatarPath: img
    });
    // 关闭裁切窗口
    this.cropImage();
  }

  render() {
    return (
      <div className="my-container">
        <ImageModel open={this.state.open} selectImage={this.selectImage} />
        <AvatarModel
          open={this.state.show}
          updateAvatar={this.updateAvatar}
          avatar={this.state.avatar}
          cropImage={this.cropImage}
        />
        <div className="my-title">
          <img src={"http://47.96.21.88:8086/public/1.png"} alt="me" />
          <div className="info">
            <div onClick={this.toggleSelect} className="myicon">
              <img src={this.state.avatarPath} alt="icon" />
            </div>
            <div className="name">{this.state.uname}</div>
            <Button color="green" size="mini">
              已认证
            </Button>
            <div className="edit">编辑个人资料</div>
          </div>
        </div>
        <Grid padded className="my-menu">
          <Grid.Row columns={3}>
            <Grid.Column>
              <Icon name="clock outline" size="big" />
              <div>看房记录</div>
            </Grid.Column>
            <Grid.Column>
              <Icon name="yen sign" size="big" />
              <div>我的订单</div>
            </Grid.Column>
            <Grid.Column>
              <Icon name="bookmark outline" size="big" />
              <div>我的收藏</div>
            </Grid.Column>
            <Grid.Column>
              <Icon name="user outline" size="big" />
              <div>个人资料</div>
            </Grid.Column>
            <Grid.Column>
              <Icon name="home" size="big" />
              <div>身份认证</div>
            </Grid.Column>
            <Grid.Column>
              <Icon name="microphone" size="big" />
              <div>联系我们</div>
            </Grid.Column>
          </Grid.Row>
        </Grid>
        <div className="my-ad">
          <img src={"http://47.96.21.88:8086/public/1.png"} alt="" />
        </div>
      </div>
    );
  }
}
export default My;
