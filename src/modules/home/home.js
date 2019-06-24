import React from 'react';
import {Input,Grid,Icon,Item,Button,Dimmer,Loader} from 'semantic-ui-react';
import ImageGallery from 'react-image-gallery';
import 'semantic-ui-css/semantic.min.css';
import "react-image-gallery/styles/css/image-gallery.css";
import './home.css';
import axios from 'axios';
// import Calculator from './calculator.js';

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      images: [],
      menus: [],
      infos: [],
      faqs: [],
      houses: [],
      loading: true
    }
  }
  doRequest(path,dataName){
    return axios.post(path).then(result=>{
      if(result.meta.status === 200) {
        // 在then中直接返回数据，那么该数据会提供给下一个then
        return result.data.list;
      }
    }).then();
  }
  componentDidMount() {
    let images = this.doRequest('homes/swipe','images');
    let menus = this.doRequest('homes/menu','menus');
    let infos = this.doRequest('homes/info','infos');
    let faqs = this.doRequest('homes/faq','faqs');
    let houses = this.doRequest('homes/house','houses');
    Promise.all([images,menus,infos,faqs,houses]).then((result)=>{
      this.setState({
        images: result[0],
        menus: result[1],
        infos: result[2],
        faqs: result[3],
        houses: result[4],
        loading: false,
        isShowCalc: false
      });
    });
    // axios.post('homes/swipe').then(result=>{
    //   if(result.meta.status === 200) {
    //     this.setState({
    //       images: result.data.list
    //     });
    //   }
    // })
    // axios.post('homes/menu').then(result=>{
    //   if(result.meta.status === 200) {
    //     this.setState({
    //       menus: result.data.list
    //     });
    //   }
    // })
    // axios.post('homes/info').then(result=>{
    //   if(result.meta.status === 200) {
    //     this.setState({
    //       infos: result.data.list
    //     });
    //   }
    // })
    // axios.post('homes/faq').then(result=>{
    //   if(result.meta.status === 200) {
    //     this.setState({
    //       faqs: result.data.list
    //     });
    //   }
    // })
    // axios.post('homes/house').then(result=>{
    //   if(result.meta.status === 200) {
    //     this.setState({
    //       houses: result.data.list
    //     });
    //   }
    // })
  }

  toggleCalc = () => {
    // 隐藏计算器
    this.setState({
      isShowCalc: !this.state.isShowCalc
    });
  }

  render() {
    const Menus = (props) => {
      const list = props.menuData.map(item=>{
        return (
          <Grid.Column onClick={this.toggleCalc} key={item.id}>
            <div className='home-menu-item'>
              <Icon name='home' size='big' />
            </div>
            <div>{item.menu_name}</div>
          </Grid.Column>
        );
      })
      return (
        <Grid padded divided>
          <Grid.Row columns={4}>
            {list}
          </Grid.Row>
        </Grid>
      );
    }
    const Info = (props) => {
      const infos = props.infoData.map(item=>{
        return (
          <Item.Header key={item.id}>
            <span>限购 ●</span>
            <span>{item.info_title}</span>
          </Item.Header>
        );
      });
      return (
        <div className='home-msg'>
          <Item.Group unstackable>
            <Item className='home-msg-img' >
              <Item.Image size='tiny' src={'http://127.0.0.1:8086/public/zixun.png'} />
              <Item.Content verticalAlign='top'>
                {infos}
                <div className="home-msg-more">
                  <Icon name='angle right' size='big' />
                </div>
              </Item.Content>
            </Item>
          </Item.Group>
        </div>
      );
    }
    const Faq = (props) => {
      const faq = props.faqData.map(item=>{
        let tags = item.question_tag.split(',').map((tag,index)=>{
          return <Button key={index} basic color='green' size='mini'>{tag}</Button>
        });
        return (
          <li key={item.question_id}>
            <div>
              <Icon name='question circle outline' />
              <span>{item.question_name}</span>
            </div>
            <div>
              {tags}
              <div>{item.atime} ● <Icon name='comment alternate outline' /> {item.qnum}</div>
            </div>
          </li>
        );
      })
      return (
        <div className='home-ask'>
          <div className='home-ask-title'>好客问答</div>
          <ul>
            {faq}
          </ul>
        </div>
      );
    }
    const House = (props) => {
      let newHouse = [];
      let oldHouse = [];
      let hireHouse = [];
      props.houseData.forEach((item,index)=>{
        let tags = item.home_tags.split(',').map((tag,index)=>{
          return <Button key={index} basic color='green' size='mini'>{tag}</Button>
        })
        let houseItem = (
          <Item key={item.id}>
            <Item.Image src={'http://127.0.0.1:8086/public/home.png'}/>
            <Item.Content>
              <Item.Header>{item.home_name}</Item.Header>
              <Item.Meta>
                <span className='cinema'>{item.home_desc}</span>
              </Item.Meta>
              <Item.Description>
                {tags}
              </Item.Description>
              <Item.Description>{item.home_price}</Item.Description>
            </Item.Content>
          </Item>
        );
        if(index < 2) {
          newHouse.push(houseItem);
        }else if(index === 2 || index === 3) {
          oldHouse.push(houseItem);
        }else{
          hireHouse.push(houseItem);
        }
      })
      return (
        <div>
          <div>
            <div className='home-hire-title'>最新开盘</div>
            <Item.Group divided unstackable>
              {newHouse}
            </Item.Group>
          </div>
          <div>
            <div className='home-hire-title'>二手精选</div>
            <Item.Group divided unstackable>
              {oldHouse}
            </Item.Group>
          </div>
          <div>
            <div className='home-hire-title'>组一个家</div>
            <Item.Group divided unstackable>
              {hireHouse}
            </Item.Group>
          </div>
        </div>
      );
    }
    return (
      <div className='home-container'>
        {/* {this.state.isShowCalc && <Calculator hideCalc={this.toggleCalc}/>} */}
        <div className="home-topbar">
          <Input fluid icon={{ name: 'search', circular: true, link: true }} placeholder='搜房源...' />
        </div>
        <Dimmer inverted active={this.state.loading} page>
          <Loader>Loading</Loader>
        </Dimmer>
        <div className="home-content">
          <ImageGallery items={this.state.images} showThumbnails={false} />
          <Menus menuData={this.state.menus}/>
          <Info infoData={this.state.infos}/>
          <Faq faqData={this.state.faqs}/>
          <House houseData={this.state.houses}/>
        </div>
      </div>
    );
  }
}
export default Home;
