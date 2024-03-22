import React, { Component } from 'react';
import "../css/order.css";
import "bootstrap/dist/js/bootstrap.js";
import axios from 'axios';


class order extends Component {

    state = {
        storeInfo: {},
        brandInfo: {},
        productList: [],
        categoriesList: [],
        productInfo:{},

    }

    
    // 元件掛載撈資料
    componentDidMount = async () => {
        var resultStore = await axios.get(`http://localhost:8000/order/branch/${this.props.match.params.id}`);
        var resultBrand = await axios.get(`http://localhost:8000/order/brand/${resultStore.data[0].brand_id}`);
        var resultProduct = await axios.get(`http://localhost:8000/order/product/${resultStore.data[0].brand_id}`);
        var resultCategories = await axios.get(`http://localhost:8000/categories/${resultStore.data[0].brand_id}`);

        var newState = { ...this.state };
        newState.storeInfo = resultStore.data[0];
        newState.brandInfo = resultBrand.data[0];
        newState.productList = resultProduct.data;
        newState.categoriesList = resultCategories.data;

        this.setState(newState);
        console.log(this.state);
    }

    getProductInfo = ()=>{
        
    }

    render() {
        const brandInfo = this.state.brandInfo
        const storeInfo = this.state.storeInfo
        const day = new Date().getDay();
        const openTime = [storeInfo.Sun_start,storeInfo.Mon_start,storeInfo.Tue_start,storeInfo.Wed_start,storeInfo.Thu_start,storeInfo.Fri_start,storeInfo.Sat_start]
        const closeTime = [storeInfo.Sun_end,storeInfo.Mon_end,storeInfo.Tue_end,storeInfo.Wed_end,storeInfo.Thu_end,storeInfo.Fri_end,storeInfo.Sat_end]


        return (<React.Fragment>




            {/* 電腦版banner */}
            <div className="row computer">
                <div className="col-12">
                    <img 
                    src={(`/img/storebanner/${brandInfo.brand_id}.png`)}
                    alt="bannerImg"
                    className="banner">
                    </img>
                </div>
            </div>

            {/* 手機版banner */}
            <div className="row phone">
                <div className="col-12">
                    <img 
                    src={(`/img/storebannermin/${brandInfo.brand_id}.png`)} 
                    alt="bannerImg" 
                    className="bannermin">
                    </img>
                </div>
            </div>

            {/* 商店資訊 */}

            <div className="row storeBox">

                <div className="col-3 storeBox">
                    <div className="row">
                        <div className="col-6">
                            <img 
                            src={(`/img/logo/${brandInfo.brand_id}.png`)} 
                            className="storeBoxLogo"
                            alt='brandLogo'
                            >
                            </img>
                        </div>
                        <div className="col-6">
                            <img 
                            src={("/img/icon/buy2.png")} 
                            alt="buy" 
                            className="buyjoin d-flex flex-column align-items-center btn-join" 
                            data-bs-toggle="modal"
                            data-bs-target="#exampleModaljoin"
                            type="button"
                            // onClick="linkShare"
                            >
                            </img>
                        </div>
                    </div>
                    <div className="row textstore">
                        <div className="col-12 textstore">
                            <h4 className="storeTitle">{brandInfo.brand_name} {storeInfo.branch_name}</h4>
                        </div>
                        <div className="col-12 textstore">
                            <p className="storeContent">
                                營業時間:{openTime[day]}~{closeTime[day]}
                            </p>
                        </div>
                        <div className="col-12 textstore">
                            <p className="storeContent">
                                聯絡電話: {storeInfo.branch_phone}
                            </p>
                        </div>
                        <div className="col-12 textstore">
                            <p className="storeContent">
                                地址: {storeInfo.branch_address}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="col-10"></div>
            </div>




            {/* 揪團對話盒 */}
            <div className="modal fade join" id="exampleModaljoin" tabIndex="-1" aria-labelledby="exampleModalLabel"
                aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content join-box">
                        <div className="modal-header d-flex justify-content-center pb-0 border-0">
                            <h5 className="modal-title text-title-b" id="exampleModaljoin">
                                揪團分享！
                            </h5>
                        </div>
                        <div className="modal-body">
                            <div className="row d-flex flex-column justify-content-between">
                                <div className="col-12 text-center">
                                    <input className="text-des p-2 border-0 join-box-input" type="text"
                                        value="https://order.nidin.shop/gb/men" />
                                </div>
                                <div className="col-12 text-center my-3">
                                    <button id="copy-link" className="btn-continue text-title p-3">
                                        揪團分享！ 複製連結
                                    </button>
                                </div>
                                <div className="col-12 mt-3">
                                    <div className="row">
                                        <div className="col-6 pe-0 d-flex justify-content-end">
                                            <div id="qrcode-size"></div>
                                        </div>
                                        <div className="col-6 px-0">
                                            <img src={("/img/logo/1.png")} alt="logo" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 菜單 */}
            <div className="menu">
                <div className="boxMenu">
                    {/* 按鈕 */}
                    <div className="container">
                        {/* 第一段 */}
                        {this.state.categoriesList.map((category)=>{
                            return(<React.Fragment key={category.category_id}>
                                <div className="row">
                                <h3 className="title1">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                        className="bi bi-suit-heart-fill" viewBox="0 0 16 16">
                                        <path
                                            d="M4 1c2.21 0 4 1.755 4 3.92C8 2.755 9.79 1 12 1s4 1.755 4 3.92c0 3.263-3.234 4.414-7.608 9.608a.513.513 0 0 1-.784 0C3.234 9.334 0 8.183 0 4.92 0 2.755 1.79 1 4 1" />
                                    </svg>
                                    {category.category_name}
                                </h3>
                            </div>  
                            <div className="row drink">
                            {this.state.productList.map((product)=>{
                                if(product.category_id == category.category_id){
                                return (
                                    <div className="col-lg-3 col-md-6 button btn btn-outline-warning" type="button" data-bs-toggle="modal"  key={product.product_id} id={product.product_id}
                                    data-bs-target="#exampleModal" onClick={()=>{this.boxmenu(product.product_id)}}>  
                                    <div className="row">
                                        <div className="col-8 button ">
                                            <div className="row">
                                                <h3 className="buttonTitle">{product.product_name}</h3>
                                                <div className="row text">
                                                    <div className="col-5">
                                                        <p className="buttonPrics col">${product.products_price_0?product.products_price_0:product.products_price_1}</p>
                                                    </div>
                                                    <div className="col-2"></div>
                                                    <div className="col-5">
                                                        {
                                                            product.choose_size_0 == 1 | product.choose_size_0 == 3| product.choose_size_0 == 4|product.choose_size_1 == 1 | product.choose_size_1 == 3 |product.choose_size_1 == 4
                                                            |product.choose_size_2 == 1 | product.choose_size_2 == 3| product.choose_size_0 == 4?<img src={("/img/icon/snowflake.png")} className="cold" alt="cold"></img>:null
                                                        }
                                                        {
                                                            product.choose_size_0 == 2 | product.choose_size_0 == 3| product.choose_size_0 == 5|product.choose_size_1 == 2 | product.choose_size_1 == 3 |product.choose_size_1 == 5
                                                            |product.choose_size_2 == 2 | product.choose_size_2 == 3| product.choose_size_0 == 5?<img src={("/img/icon/hotsale.png")} className="hot" alt="hot"></img>:null
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-4 product">
                                            <div className="row">
                                                <div className="col-12">
                                                    <img src={(`/img/drinksimg/${product.product_img}.png`)} className="productImg"
                                                        alt="productImg"></img>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                              )}
                         })} </div></React.Fragment>
                            )

                        })}



                        <div className="link-top"></div>
                    </div>
                </div>
            </div>

            {/* 對話盒Modal */}
            <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-lg ">
                    <div className="modal-content">
                        <div className="modal-body">
                            <div className="modal-body">
                                <div className="container-fluid">
                                    <div className="row">
                                        <div className="col-6 modaltop">
                                            <h3 className="modalTitle">許慶良窯燒桂圓鮮奶茶</h3>
                                        </div>
                                        <div className="col-6 modaltop"></div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-5">
                                            {/* 左側上方圖片 */}
                                            <div className="row">
                                                <div className="col-12">
                                                    <img src="img/className/14_782.png" className="clasImg"></img>
                                                </div>
                                                <div className="col-12 Text">
                                                    <div className="alert alert-warning" role="alert">
                                                        *脆啵啵球配料冷飲限定口感佳（常溫/溫/熱恕不開放加料<br></br>
                                                        *小圓仔配料建議冷/溫飲
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-7 modalRight">
                                            {/* 右側尺寸 */}
                                            <div className="row sizetitle">
                                                <div className="col-4 text">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                                        fill="currentColor" className="bi bi-star-fill" viewBox="0 0 16 16">
                                                        <path
                                                            d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
                                                    </svg>
                                                    尺寸
                                                </div>
                                                <div className="col-4"></div>
                                                <div className="col-4"></div>
                                            </div>
                                            <div className="row sizecheck">
                                                {/* 尺寸選項 */}

                                                <div className="col-4 form-check">
                                                    <input className="form-check-input" type="radio" name="size" id="medium" value="1"></input>
                                                    <label className="form-check-label" for="medium">&nbsp;M</label>
                                                </div>
                                                <div className="col-4 form-check">
                                                    <input className="form-check-input" type="radio" name="size" id="large" value="2"></input>
                                                    <label className="form-check-label" for="large">&nbsp;L</label>
                                                </div>
                                                <div className="col-4 form-check">
                                                    <input className="form-check-input" type="radio" name="size" id="bottle" value="3"></input>
                                                    <label className="form-check-label" for="bottle">&nbsp;瓶</label>
                                                </div>

                                            </div>



                                            <div className="row temperaturetitle">
                                                {/* 溫度 */}
                                                <div className="col-4 text">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                                        fill="currentColor" className="bi bi-star-fill" viewBox="0 0 16 16">
                                                        <path
                                                            d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
                                                    </svg>
                                                    溫度
                                                </div>
                                                <div className="col-4"></div>
                                                <div className="col-4"></div>
                                            </div>
                                            <div className="row temperaturecheck">
                                                {/* 溫度選項 */}
                                                <div className="col-4 form-check">
                                                    <input className="form-check-input" type="radio" name="temperature" id="lessIce" value="1"></input>
                                                    <label className="form-check-label" for="flexRadioDefault1">&nbsp;少冰</label>
                                                </div>
                                                <div className="col-4 form-check">
                                                    <input className="form-check-input" type="radio" name="temperature" id="low" value="2"></input>
                                                    <label className="form-check-label" for="flexRadioDefault1">&nbsp;微冰</label>
                                                </div>
                                                <div className="col-4 form-check">
                                                    <input className="form-check-input" type="radio" name="temperature" id="noIce" value="3"></input>
                                                    <label className="form-check-label" for="flexRadioDefault1">&nbsp;去冰</label>
                                                </div>
                                                <div className="col-4 form-check">
                                                    <input className="form-check-input" type="radio" name="temperature" id="normal" value="4"></input>
                                                    <label className="form-check-label" for="flexRadioDefault1">&nbsp;正常</label>
                                                </div>
                                                <div className="col-4 form-check">
                                                    <input className="form-check-input" type="radio" name="temperature" id="roomTemperature" value="5"></input>
                                                    <label className="form-check-label" for="flexRadioDefault1">&nbsp;溫</label>
                                                </div>
                                                <div className="col-4 form-check">
                                                    <input className="form-check-input" type="radio" name="temperature" id="hot" value="6"></input>
                                                    <label className="form-check-label" for="flexRadioDefault1">&nbsp;熱</label>
                                                </div>
                                            </div>


                                            <div className="row sugarinesstitle">
                                                {/* 甜度 */}
                                                <div className="col-4 text">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                                        fill="currentColor" className="bi bi-star-fill" viewBox="0 0 16 16">
                                                        <path
                                                            d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
                                                    </svg>
                                                    甜度
                                                </div>
                                                <div className="col-4"></div>
                                                <div className="col-4"></div>
                                            </div>
                                            <div className="row sugarinesscheck">
                                                {/* 甜度選項 */}
                                                <div className="col-4 form-check">
                                                    <input className="form-check-input" type="radio" name="sugariness" id="lessSugar" value="1"></input>
                                                    <label className="form-check-label" for="flexRadioDefault1">&nbsp;少糖</label>
                                                </div>
                                                <div className="col-4 form-check">
                                                    <input className="form-check-input" type="radio" name="sugariness" id="halfSugar" value="2"></input>
                                                    <label className="form-check-label" for="flexRadioDefault1">&nbsp;半糖</label>
                                                </div>
                                                <div className="col-4 form-check">
                                                    <input className="form-check-input" type="radio" name="sugariness" id="standard" value="3"></input>
                                                    <label className="form-check-label" for="flexRadioDefault1">&nbsp;標準</label>
                                                </div>
                                                <div className="col-4 form-check">
                                                    <input className="form-check-input" type="radio" name="sugariness" id="lightSugar" value="4"></input>
                                                    <label className="form-check-label" for="flexRadioDefault1">&nbsp;微糖</label>
                                                </div>
                                                <div className="col-4 form-check">
                                                    <input className="form-check-input" type="radio" name="sugariness" id="noSugar" value="5"></input>
                                                    <label className="form-check-label" for="flexRadioDefault1">&nbsp;無糖</label>
                                                </div>
                                            </div>


                                            <div className="row sugarinesstitle">
                                                {/* 配料 */}
                                                <div className="col-4 text">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                                        fill="currentColor" className="bi bi-star-fill" viewBox="0 0 16 16">
                                                        <path
                                                            d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
                                                    </svg>
                                                    配料
                                                </div>
                                                <div className="col-4"></div>
                                                <div className="col-4"></div>
                                            </div>
                                            <div className="row sugarinesscheck">
                                                {/* 配料選項 */}
                                                <div className="col-4 form-check">
                                                    <input className="form-check-input" type="checkbox" name="ingredients" id="grass" value="1"></input>
                                                    <label className="form-check-label" for="flexRadioDefault1">&nbsp;仙草</label>
                                                </div>
                                                <div className="col-4 form-check">
                                                    <input className="form-check-input" type="checkbox" name="ingredients" id="balls" value="2"></input>
                                                    <label className="form-check-label" for="flexRadioDefault1">&nbsp;珍珠</label>
                                                </div>
                                                <div className="col-4 form-check">
                                                    <input className="form-check-input" type="checkbox" name="ingredients" id="taroBalls" value="3"></input>
                                                    <label className="form-check-label" for="flexRadioDefault1">&nbsp;芋圓</label>
                                                </div>
                                                <div className="col-4 form-check">
                                                    <input className="form-check-input" type="checkbox" name="ingredients" id="redBeans" value="4"></input>
                                                    <label className="form-check-label" for="flexRadioDefault1">&nbsp;紅豆</label>
                                                </div>
                                                <div className="col-4 form-check">
                                                    <input className="form-check-input" type="checkbox" name="ingredients" id="pidding" value="5"></input>
                                                    <label className="form-check-label" for="flexRadioDefault1">&nbsp;布丁</label>
                                                </div>
                                                <div className="col-4 form-check">
                                                    <input className="form-check-input" type="checkbox" name="ingredients" id="konjacjelly" value="6"></input>
                                                    <label className="form-check-label" for="flexRadioDefault1">&nbsp;愛玉</label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row footer">
                                        <div className="col-6 modaltop">總金額 : 100 元</div>
                                        <div className="col-6 modaltop">
                                            <div className="row price">
                                                <div className="col-4">
                                                    <button type="button" className="btn add btn-outline-warning">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                                            fill="currentColor" className="bi bi-dash-lg" viewBox="0 0 16 16">
                                                            <path fillRule="evenodd"
                                                                d="M2 8a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11A.5.5 0 0 1 2 8" />
                                                        </svg>
                                                    </button>
                                                </div>
                                                <div className="col-4 text-center" >
                                                    <div className="price">10</div>
                                                </div>
                                                <div className="col-4 text-center" >
                                                    <button type="button" className="btn add btn-outline-warning">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                                            fill="currentColor" className="bi bi-plus-lg" viewBox="0 0 16 16">
                                                            <path fillRule="evenodd"
                                                                d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="d-grid gap-2 col-8 mx-auto">
                                    <button className="btn btn-outline-warning" type="button">加入購物車</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment >
        ); // end of redner()
    }


    boxmenu = function (e) {
        console.log(e)
    }


}

export default order;