
import React, { Component } from 'react';
import "../css/index.css";
import { HiOutlineShoppingBag } from "react-icons/hi";
import { PiMedal } from "react-icons/pi";
import { PiCoins } from "react-icons/pi";
import { GiCancel } from "react-icons/gi";
import GradeIcon from '@mui/icons-material/Grade';  
import Carousel from 'react-bootstrap/Carousel';
import Axios from 'axios';
import { GoogleMap, LoadScript, Marker, StandaloneSearchBox, Autocomplete,DistanceMatrixService } from '@react-google-maps/api';

<head>
<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCxryD8kH56hfiJ0bJt6r_KQ6G4MEZY6dI&loading=async&libraries=places,drawing,geometry&callback=initMap&v=weekly"></script>
</head>

class index extends Component {
    state = { 
        currentLocation: { lat: null, lng: null },
        branchList:[
            {}
        ],
        brandList:[
            {}
        ],  
        branchPosition:[
            {branchId: 1,branchAddress: '台中市西屯區中工三路181號2樓', lat: 24.1767266, lng: 120.6183528},
        ],
        distances: {},
        productList:[
            {}
        ],
     } 

    componentDidMount() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                ({ coords: { latitude: lat, longitude: lng } }) => {
                    const pos = { lat, lng };
                    this.setState({ currentLocation: pos}, 
                    () => {
                        this.getData(); 
                    });
                },
                error => {
                    console.error('Error getting geolocation:', error);
                }
            );
            
        } else {
            console.error('Geolocation is not supported by this browser.');
        }
    }

    getData = async () => {
        try {
            const resultBranch = await Axios.get("http://localhost:8000/index/branch");
            const resultBrand = await Axios.get("http://localhost:8000/index/brand");
            const resultProduct = await Axios.get("http://localhost:8000/index/products");
            const newState = {...this.state};
            newState.branchList = resultBranch.data;
            newState.brandList = resultBrand.data;

            const shuffle =  (array)=>{for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1)); 
                [array[i], array[j]] = [array[j], array[i]];
              }
              return array;
            }
            newState.productList = shuffle(resultProduct.data);

                 
            newState.branchPosition = resultBranch.data.map(branch => ({
                branchId: branch.branch_id,
                branchAddress: branch.branch_address,
                lat: branch.branch_latitude,
                lng: branch.branch_longitude
            }));
            this.setState(newState, () => {
                this.calculateDistances();
            });
            console.log(this.state)
        } catch (error) {
            console.error('Error:', error);
        }
    }
    
    calculateDistances = () => {
        const currentLat =  this.state.currentLocation.lat
        const currentLng =  this.state.currentLocation.lng
        const branchPosition  = this.state.branchPosition;
        if (currentLat !== null && currentLng !== null) {
          const R = 6371; // 地球平均半径（km）
          const distances = {};
          branchPosition.forEach(branch => {
            const { branchId,lat, lng,} = branch;
            const dLat = this.deg2rad(lat - currentLat);
            const dLng = this.deg2rad(lng - currentLng);
            const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                      Math.cos(this.deg2rad(currentLat)) * Math.cos(this.deg2rad(lat)) *
                      Math.sin(dLng / 2) * Math.sin(dLng / 2);
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            distances[branchId] = (R * c).toFixed(1); // 保留一位小数
          });        
          this.setState({distances});
        }
      }
    
      deg2rad = (deg) => {
        return deg * (Math.PI / 180);
      }


    render() { 
        const currentLat =  this.state.currentLocation.lat
        const currentLng =  this.state.currentLocation.lng
        const distances  = this.state.distances;
        const randomNumber = Math.floor(Math.random() * 191);

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
                    {this.loginCheck()}
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
                <h2 className='text-center mainColor m-2'>附近店家</h2>
            </div>
            <div className="container mt-2 mb-3">
                <div className="row d-flex justify-content-center">
                    <div className="choose_right row">
                            {/* 附近店鋪 */}
        {currentLat !== null && currentLng !== null ? (
        <>
        {Object.entries(distances).filter(([branchId, distance]) => distance < 2)
            .sort((a, b) => a[1] - b[1]).map(([branchId, distance]) => (
                <div key={branchId} className="col-lg-6 col-xxl-4 my-3" 
                    onClick={()=>{
                        const userData = JSON.parse(localStorage.getItem('userdata'));
                        if(userData){
                            window.location=`/order/${branchId}`
                        }else {                         
                            sessionStorage.setItem('redirect',`/order/${branchId}`) ;
                            window.location = "/login";
                        }}}>
                    <div className="card branchCard">
                        <div className="image">
                            {this.state.branchList.map((branch)=>{
                                if(branch.branch_id == branchId){
                                    var id = branch.brand_id;
                                    return this.state.brandList.map(function(brand,i){
                                        if( brand.brand_id == id ){
                                            return <React.Fragment key={i}><img
                                                src={`/img/mainproduct/${brand.brand_id}.png`}
                                                className="card-img-top"
                                                alt="..."
                                            />
                                            <img  src={`/img/logo/${brand.brand_id}.png`} className="logo" alt="..." />
                                            </React.Fragment>
                                                                                    }else{
                                            return null}
                                    })
                                }else{
                                    return null
                                }
                            })}
                        </div>
                        <div className="card-body">
                            <div className="row information ">
                                <p className="col-3 score align-items-center d-flex align-items-center justify-content-center">
                                    <GradeIcon className='me-1 iconGrade' />
                                    {/* 評分 */}
                                    {this.state.branchList.map(function(e){
                                        if(e.branch_id == branchId){
                                            return e.branch_score.toFixed(1);  //小數點後補0
                                        }else{
                                            return null
                                        }
                                    })}
                                </p>
                                <p className="col-4 time">

                                    {/* 營業時間 */}

                                    {this.state.branchList.map((branch)=>{
                                        if(branch.branch_id == branchId){
                                            const day = new Date().getDay();
                                            const openTime = [branch.Sun_start,branch.Mon_start,branch.Tue_start,branch.Wed_start,branch.Thu_start,branch.Fri_start,branch.Sat_start]
                                            const closeTime = [branch.Sun_end,branch.Mon_end,branch.Tue_end,branch.Wed_end,branch.Thu_end,branch.Fri_end,branch.Sat_end]
                                            if(openTime[day] == "店休" | closeTime[day] == "店休"){
                                                return "店休"
                                            }else{
                                                return `${openTime[day]}~${closeTime[day]}`
                                            }
                                        }else{
                                            return null
                                        }
                                    })}

                                </p>               
                                <p className="col-4 kilometre">約 {distance} 公里</p>
                            </div>
                            <p className="card-title lh-sm">

                                {/* 品牌名 */}
                                {this.state.branchList.map((branch)=>{
                                    if(branch.branch_id == branchId){
                                        var id = branch.brand_id;
                                        return this.state.brandList.map(function(brand){
                                            if( brand.brand_id == id ){
                                                return brand.brand_name
                                            }else{
                                                return null}
                                        }
                                        )
                                    }else{
                                        return null
                                    }
                                })}
                                {" "}
                                {/* 店名 */}
                                {this.state.branchList.map(function(e){
                                    if(e.branch_id == branchId){
                                        return e.branch_name}
                                    else{
                                        return null
                                    }
                                })}
                                <br />
                                {this.state.branchList.map(function(e){
                                    if(e.branch_id == branchId){
                                        return( <a key={branchId}
                                                   href={"https://www.google.com/maps/place/" +  e.branch_address}
                                                >
                                                    {e.branch_address}
                                                </a>)}else{
                                        return null
                                    }
                                })}
                            </p>
                        </div>
                    </div>
                </div>                            
        ))}
    </>
) : (
    <h3>無法讀取位置...</h3>
)}
                        
                    </div>
                </div>
            </div>
            <div className='text-center'>
                <h2>#網友激推!</h2>
                <h3>想不到喝甚麼?來這看看!</h3>
            </div>
            <div id='rouletteArea' className='row d-flex align-items-end justify-content-center mx-auto'>
                <Carousel data-bs-theme="dark" indicators={false} controls={false} className='col-3 mb-4 align-self-center' interval={2000} pause={false} defaultActiveIndex={randomNumber-1}> 

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
                <Carousel data-bs-theme="dark" indicators={false} controls={false} className='col-5' interval={2000} pause={false} defaultActiveIndex={randomNumber}> 

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
                <Carousel data-bs-theme="dark" indicators={false} controls={false} className='col-3 mb-4 align-self-center' interval={2000} pause={false} defaultActiveIndex={randomNumber+1}> 

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
                        <h5 className='rouletteBrand text-center'>
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
                <div id='footerInfo' className='col-3 d-flex row align-items-center justify-content-center pe-1'>   
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
    loginCheck = () => {
        const userData = JSON.parse(localStorage.getItem('userdata'));
        if(userData){
            const userImg = userData.user_img?userData.user_img:'LeDian.png';
            return (
                <h4 id='loginBtn' className='my-auto btn headerText text-nowrap' onClick={this.toggleMemberNav}>                
                    <img id='memberHeadshot' src={(`/img/users/${userImg}`)} alt='memberHeadshot' className='img-fluid my-auto mx-1 rounded-circle border'></img>
                    會員專區▼</h4>
                )
        }else {
            return (<h4 id='loginBtn' className='my-auto btn headerText align-self-center' onClick={this.toggleMemberNav}>登入/註冊▼</h4>)
        }              
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
