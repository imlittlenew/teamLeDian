import React, { Component } from "react";
import JsBarcode from "jsbarcode";
import "../css/profile.css"; // 引入樣式文件
import "react-datepicker/dist/react-datepicker.css"; // 引入日期選擇器樣式
import { Modal } from "react-bootstrap"; // 添加這行

class Barcode extends Component {
  constructor(props) {
    super(props);
    this.state = {
      verifyBarcodeInput: "", // 驗證輸入的條碼
      validationResult: "", // 驗證結果
      generatedBarcodeContainerDisplay: "none", // 生成的條碼容器顯示狀態
      barcodeImgButtonDisplay: "none", // 條碼圖片按鈕顯示狀態
      isModalOpen: false, // 模態框打開狀態
      barcodeText: "", // 條碼文本
    };
  }

  // 處理輸入框變化
  handleInputChange = (e) => {
    this.setState({ verifyBarcodeInput: e.target.value.toUpperCase() });
  };

  // 處理編輯按鈕點擊
  handleEditButtonClick = () => {
    this.setState({ isModalOpen: true });
  };

  // 處理刪除按鈕點擊
  handleDeleteButtonClick = () => {
    this.clearBarcode();
  };

  // 清除條碼信息
  clearBarcode = () => {
    this.setState({
      verifyBarcodeInput: "",
      validationResult: "",
      generatedBarcodeContainerDisplay: "none",
      barcodeImgButtonDisplay: "none",
      barcodeText: "",
    });
  };

  // 生成條碼
  generateBarcode = (barcodeValue) => {
    JsBarcode("#generatedBarcode", barcodeValue, { format: "CODE39" });
    this.setState({
      barcodeImgButtonDisplay: "flex",
      generatedBarcodeContainerDisplay: "flex",
      barcodeText: barcodeValue,
      isModalOpen: false,
    });
  };

  // 驗證輸入的條碼
  validateBarcode = () => {
    const barcodeValue = this.state.verifyBarcodeInput;
    const regex = /^\/[\dA-Z0-9+\-.]{7}$/;
    if (regex.test(barcodeValue)) {
      this.generateBarcode(barcodeValue);
      this.setState({ validationResult: "" });
    } else {
      this.setState({ validationResult: "載具號碼格式不正確，請重新確認!" });
    }
  };
  handleModalClose = () => {
    this.setState({ isModalOpen: false });
  };
  
  render() {
    return (
      <>
        {/* 模態框 */}
        <Modal show={this.state.isModalOpen} backdrop="static" centered>
        <Modal.Header closeButton onClick={this.handleModalClose}>
        <Modal.Title>我的載具</Modal.Title>
        </Modal.Header>
          <Modal.Body>
            <label htmlFor="verifyBarcodeInput" className="form-label modalLabel">
              請輸入載具條碼，輸入確認後會自動產生條碼
            </label>
            <input
              id="verifyBarcodeInput"
              className="form-control mb-2"
              type="text"
              placeholder="首位為/，英文字母為大寫"
              maxLength="8"
              aria-label="default input example"
              value={this.state.verifyBarcodeInput}
              onChange={this.handleInputChange}
            />
            <div id="validationResult">{this.state.validationResult}</div>
          </Modal.Body>
          <Modal.Footer onClick={this.validateBarcode} style={{ cursor: 'pointer' }}>
            <div className="mx-auto">
              儲存
            </div>
          </Modal.Footer>

        </Modal>
        {/* 模態框結束 */}

        {/* 條碼部分 */}
        <div className="col-12 mb-2 mt-4">
          <div className="row">
            <div className="col-2"></div>
            <div className="col-12 text-center">載具條碼</div>
            <div className="col-6 text-end p-1">
              {this.state.barcodeText && <div id="barcodeText">{this.state.barcodeText}</div>}
            </div>
            <div className="col-6">
              <div className={`d-flex align-items-center ml-auto text-grey ${this.state.barcodeImgButtonDisplay === "none" ? "d-none" : ""}`} id="barcodeimgbutton">
                <button type="button" className="btn btn-sm" id="editbutton" onClick={this.handleEditButtonClick}>
                  <img src="./img/Member_Area/pencil.png" alt="edit" className="img-fluid" />
                </button>
                <button type="button" className="btn btn-sm" id="deletebutton" onClick={this.handleDeleteButtonClick}>
                  <img src="./img/Member_Area/garbage.png" alt="delete" className="img-fluid" />
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="col-12 d-flex justify-content-center align-items-center">
          <div id="Barcodecontent" className={`mx-auto my-auto ${this.state.barcodeText ? "d-none" : ""}`}>
            <label className="rounded-3" id="Barcodeborder" onClick={this.handleEditButtonClick}>
              <span className="Barcodemodallabel">&#43; 新增載具條碼</span>
              <button
                type="button"
                className="btn btn-primary Barcodemodal"
                id="Barcodebutton"
              ></button>
            </label>
          </div>

          <div
            id="generatedBarcodeContainer"
            className={`mx-auto my-auto d-flex justify-content-center align-items-center ${this.state.generatedBarcodeContainerDisplay === "none" ? "d-none" : ""}`}
          >
            <svg id="generatedBarcode"></svg>
          </div>
        </div>
        {/* 條碼部分結束 */}
      </>
    );
  }
}

export default Barcode;