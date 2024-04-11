import React, { Component } from 'react';
import "../css/news.css";
import { HiOutlineShoppingBag } from "react-icons/hi";
import { PiMedal } from "react-icons/pi";
import { PiCoins } from "react-icons/pi";
import { GiCancel } from "react-icons/gi";
import Carousel from 'react-bootstrap/Carousel';
import Axios from 'axios';

class index extends Component {
    state = { 
        productList:[
            {}
        ],
        brandList:[
            {}
        ],
        userImg: null,

     } 

     async componentDidMount() {
        const userData = await JSON.parse(localStorage.getItem("userdata"));

        try{
            const newState = {...this.state};
            const resultProduct = await Axios.get("http://localhost:8000/index/products");
            const resultBrand = await Axios.get("http://localhost:8000/index/brand");
            const shuffle =  (array)=>{for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1)); 
                [array[i], array[j]] = [array[j], array[i]];
              }
              return array;
            }
            newState.productList = shuffle(resultProduct.data);
            newState.brandList = resultBrand.data;
            this.setState(newState);
        }
        catch (error) {
            console.error('Error:', error);
        }

        if (userData) {
            await Axios.get(`http://localhost:8000/user/${userData.user_id}`)
              .then((response) => {
                const userImg = response.data.user_img ? response.data.user_img : "LeDian.png";
                this.setState({ userImg, userData });
              })
              .catch((error) => {
                console.error("Failed to fetch user data:", error);
              });
          }
      
     }


    render() { 
        return (<React.Fragment>
            <div id='header'
                style={{
                    boxShadow: '1px 3px 10px #cccccc',
                    marginBottom: '4px',
                }} 
                className='d-flex justify-content-between'>
                <div className='col-7 col-sm-7 col-md-6 col-xl-5 d-flex ms-2 justify-content-between align-items-center'>
                <div id='menu' className='col-8'><h2 className='btn text-start  my-auto fs-4' onClick={this.toggleMenuNav}>☰</h2></div>
                    <h4 id='homeBtn' className='my-auto btn' onClick={()=>{window.location="/index"}}><img id='logo' src='/img/index/LeDian_LOGO-05.png' alt='logo'></img></h4>
                    <h4 className='my-auto p-0 btn headerText menuBtn d-flex align-items-center justify-content-center' onClick={this.cartMenuClick}><HiOutlineShoppingBag className='fs-4'/>購物車</h4>
                    <h4 className='my-auto p-0 btn headerText menuBtn d-flex align-items-center justify-content-center' onClick={()=>{window.location="/brand"}}><PiMedal className='fs-4'/>品牌專區</h4>
                    <h4 className='my-auto p-0 btn headerText menuBtn d-flex align-items-center justify-content-center' onClick={this.pointinfoShow}><PiCoins className='fs-4'/>集點資訊</h4>
                </div>
                <div id="pointinfo">
                    <button  id="pointinfoclose" onClick={this.pointinfoHide}><GiCancel   className='fs-2 text-light' /></button>
                    <h1>集點資訊</h1>
                    <p>．每消費20元即可累積1點。</p>
                    <p>．每點可折抵1元消費金額。</p>
                    <p>．點數可在下次消費時折抵使用。</p>
                    <p>．點數不可轉讓，不可兌換現金，不可合併使用。</p>
                    <p>．本集點活動以公告為準，如有更改，恕不另行通知。</p>
                </div>


                <div className='d-flex me-2 align-items-center'>
                    {this.state.userData ? (
                    <h4
                        id="loginBtn"
                        className="my-auto btn headerText text-nowrap"
                        onClick={this.toggleMemberNav}
                    >
                        <img
                        id="memberHeadshot"
                        src={`/img/users/${this.state.userImg}`}
                        alt="memberHeadshot"
                        className="img-fluid my-auto mx-1 rounded-circle border"
                        />
                        會員專區▼
                    </h4>
                    ) : (
                    <h4
                        id="loginBtn"
                        className="my-auto btn headerText align-self-center"
                        onClick={this.toggleMemberNav}
                    >
                        登入/註冊
                    </h4>
                    )}
                                
                    <div id='memberNav' className='collapse'>
                        <div className='p-2'>
                            <h4 className='headerText text-center my-2' onClick={()=>{window.location="/profile"}}>會員中心</h4><hr />
                            <h4 className='headerText text-center my-2' onClick={this.logoutClick}>登出</h4>
                        </div>
                    </div>
                </div>
            </div>
            <div id='menuNav' className='menuNav d-flex flex-column align-items-center'>
                <h4 className='menuText my-3 mainColor border-bottom border-secondary' onClick={this.cartMenuClick}><HiOutlineShoppingBag className='fs-4'/>購物車</h4>
                <h4 className='menuText my-3 mainColor border-bottom border-secondary' onClick={()=>{window.location="/brand"}}><PiMedal className='fs-4'/>品牌專區</h4>
                <h4 className='menuText my-3 mainColor border-bottom border-secondary' onClick={this.pointinfoShow}><PiCoins className='fs-4'/>集點資訊</h4>
            </div>




            <div id='banner' className='d-flex justify-content-center'><img id='bannerImg' src={("/img/index/Home_Banner_01.jpg")} alt='homeBanner' className='img-fluid'></img></div>
            <div className="container">
                <div className='navbar row'>
                    <div className='navImg col-4 btn' onClick={()=>{window.location="/le"}}><img src={("/img/index/LeDian_BANNER-01.jpg")} alt='navImg' className='img-fluid'></img></div>
                    <div className='navImg col-4 btn' onClick={()=>{window.location="/dian"}}><img src={("/img/index/LeDian_BANNER-02.jpg")} alt='navImg' className='img-fluid'></img></div>
                    <div className='navImg col-4 btn' onClick={()=>{window.location="/news"}}><img src={("/img/index/LeDian_BANNER-05.jpg")} alt='navImg' className='img-fluid'></img></div>
                </div>
                <h2 className='text-center mainColor m-2'>最新消息</h2>
            <div id='newsArea' className='row mt-2'>
                <div className="newsCard col-4 overflow-hidden p-2 p-sm-2 p-md-3 d-flex">
                    <img src={("/img/news/1.jpg")} alt='newsImg' className='img-fluid rounded-1'></img>
                </div>
                <div className="newsCard col-4 overflow-hidden p-2 p-sm-2 p-md-3 d-flex" >
                    <img src={("/img/news/2.jpg")} alt='newsImg' className='img-fluid rounded-1'></img>
                </div>
                <div className="newsCard col-4 overflow-hidden p-2 p-sm-2 p-md-3 d-flex" >
                    <img src={("/img/news/3.jpg")} alt='newsImg' className='img-fluid rounded-1'></img>
                </div>
                <div className="newsCard col-4 overflow-hidden p-2 p-sm-2 p-md-3 d-flex" >
                    <img src={("/img/news/4.jpg")} alt='newsImg' className='img-fluid rounded-1'></img>
                </div>
                <div className="newsCard col-4 overflow-hidden p-2 p-sm-2 p-md-3 d-flex" >
                    <img src={("/img/news/5.jpg")} alt='newsImg' className='img-fluid rounded-1'></img>
                </div>
                <div className="newsCard col-4 overflow-hidden p-2 p-sm-2 p-md-3 d-flex" >
                    <img src={("/img/news/6.jpg")} alt='newsImg' className='img-fluid rounded-1'></img>
                </div>
                <div className="newsCard col-4 overflow-hidden p-2 p-sm-2 p-md-3 d-flex" >
                    <img src={("/img/news/7.jpg")} alt='newsImg' className='img-fluid rounded-1'></img>
                </div>
                <div className="newsCard col-4 overflow-hidden p-2 p-sm-2 p-md-3 d-flex" >
                    <img src={("/img/news/8.jpg")} alt='newsImg' className='img-fluid rounded-1'></img>
                </div>
                <div className="newsCard col-4 overflow-hidden p-2 p-sm-2 p-md-3 d-flex" >
                    <img src={("/img/news/9.jpg")} alt='newsImg' className='img-fluid rounded-1'></img>
                </div>
            </div>
            </div>
            
            <div id='rouletteArea' className='row d-flex align-items-end justify-content-center mx-auto'>
                <Carousel data-bs-theme="dark" indicators={false} controls={false} className='col-3 mb-4 align-self-center' interval={2000} pause={false} defaultActiveIndex={0}> 

                    {this.state.productList.map((product,i)=>{
                        return(                    
                        <Carousel.Item key={i} id={product.product_id} className='p-0 my-1'><br/><br/>
                        <img
                        key={product.product_id}
                        className="d-block w-100 img-fluid mx-auto mb-3"
                        src={`img/class/${product.product_img}.png`}
                        alt="..."
                        /><br/><br/><br/><br/>
                        <Carousel.Caption> 
                        <h5 className='rouletteBrand m-0'>
                            {this.state.brandList.map((e)=>{
                                if(product.brand_id == e.brand_id){
                                    return e.brand_name
                                }else{ return null}
                            })
                        }
                        </h5>
                        <p className='rouletteProduct m-0'>{product.product_name}</p>
                        </Carousel.Caption>
                    </Carousel.Item>)
                    })}
                </Carousel> 
                <Carousel data-bs-theme="dark" indicators={false} controls={false} className='col-5' interval={2000} pause={false} defaultActiveIndex={1}> 

                    {this.state.productList.map((product,i)=>{
                        return(                    
                        <Carousel.Item key={i} id={product.product_id} className='p-0 my-1'><br/><br/>
                        <img
                        key={product.product_id}
                        className="d-block w-100 img-fluid mx-auto"
                        src={`img/class/${product.product_img}.png`}
                        alt="..."
                        /><br/><br/><br/><br/>
                        <Carousel.Caption className='p-0 my-1' > 
                        <h5 className='rouletteBrand m-0'>
                            {this.state.brandList.map((e)=>{
                                if(product.brand_id == e.brand_id){
                                    return e.brand_name 
                                }else{ return null}
                            })
                        }
                        </h5>
                        <p className='rouletteProduct m-0'>{product.product_name}</p>
                        </Carousel.Caption>
                    </Carousel.Item>)
                    })}
                </Carousel> 
                <Carousel data-bs-theme="dark" indicators={false} controls={false} className='col-3 mb-4 align-self-center' interval={2000} pause={false} defaultActiveIndex={2}> 

                    {this.state.productList.map((product,i)=>{
                        return(                    
                        <Carousel.Item key={i} id={product.product_id} className='p-0 my-1'><br/><br/>
                        <img
                        key={product.product_id}
                        className="d-block w-100 img-fluid mx-auto mb-3"
                        src={`img/class/${product.product_img}.png`}
                        alt="..."
                        /><br/><br/><br/><br/>
                        <Carousel.Caption> 
                        <h5 className='rouletteBrand m-0'>
                            {this.state.brandList.map((bracd)=>{
                                if(product.brand_id == bracd.brand_id){
                                    return bracd.brand_name
                                }else{ return null}
                            })
                        }
                        </h5>
                        <p className='rouletteProduct m-0'>{product.product_name}</p>
                        </Carousel.Caption>
                    </Carousel.Item>)
                    })}
                </Carousel> 


            </div>
           
            <div id="footer" className='d-flex'>
                <div id="footerLogo" className='col-3'>
                    <img id='"footerImg"' className='img-fluid' src={("/img/index/LeDian_LOGO-04.png")} alt="footerLogo" />
                </div>
                <div className='col-6 d-flex align-items-center'>
                    <div  id='footerlink' className='col-2 d-flex flex-column'>
                        <div className='d-flex'>
                            <div><img className='img-fluid' src={("/img/index/facebook.png")} alt="fackbook" /></div>
                            <div><img className='img-fluid' src={("/img/index/instagram.png")} alt="instagram" /></div>
                            <div><img className='img-fluid' src={("/img/index/line.png")} alt="line" /></div>
                        </div>
                        <p className='text-white text-nowrap footerText'>信箱: ledian.tw@gmail.com</p>
                    </div>
                </div>
                <div id='footerInfo' className='col-3 d-flex row align-items-center justify-content-center'>   
                    <div className='col-3 col-sm-6 d-flex flex-column align-items-center'>
                        <p className='footerText m-0 py-1 text-nowrap text-white'>意見回饋</p>
                        <p className='footerText m-0 py-1 text-nowrap text-white'>常見問題</p>
                    </div>
                    <div className='col-4 col-sm-6 d-flex flex-column align-items-start'>
                        <p className='footerText m-0 py-1 text-nowrap text-white'>使用者條款</p>
                        <p className='footerText m-0 py-1 text-nowrap text-white'>隱私權條款</p>
                        <p className='footerText m-0 py-1 text-nowrap text-white'>信用卡條款</p>
                    </div>
                </div>
            </div>
            </React.Fragment>);
    }
    pointinfoShow = (event) => {
        document.getElementById("pointinfo").style.top = event.clientY + 50 + "px";
        document.getElementById("pointinfo").style.left = event.clientX - 150 + "px";
    } 

    pointinfoHide = (event) => {
        document.getElementById("pointinfo").style.top = "-500px";
        event.cancelBubble = true;
    }

    toggleMemberNav = () => {
        const userdata = localStorage.getItem('userdata');
        if(userdata){
            document.getElementById('memberNav').classList.toggle('collapse');
        }else{
            const path = this.props.location.pathname;
            sessionStorage.setItem('redirect',path) ;
            window.location = "/login";
        }
      }
    toggleMenuNav = () => {
        document.getElementById('menuNav').classList.toggle('menuNav');
    }
    logoutClick = async () => {
        // 清除localStorage
        localStorage.removeItem("userdata");
        const userdata = localStorage.getItem("userdata");
        console.log("現在的:", userdata);
        try {
            // 告訴後台使用者要登出
            await Axios.post('http://localhost:8000/logout');
        
            
            //   window.location = '/logout'; // 看看登出要重新定向到哪個頁面
        } catch (error) {
            console.error("登出時出錯:", error);
        }
        
        document.getElementById('memberNav').classList.add('collapse');
        this.setState({})
        window.location = "/index"
    }
    cartMenuClick = () => {
        const userData = JSON.parse(localStorage.getItem('userdata'));
        if(userData){
            const userId = userData.user_id;
            window.location = `/cartlist/${userId}`;
        }else {
            window.location = "/login";
        }              

    }


    }
 
export default index;