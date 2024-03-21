import React, { Component } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

class ProfileDateTimePicker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedDate: new Date(),
      dbdata: {},

    };
  }

  render() {
    return (
      <DatePicker
        className="text-des form-control"
        selected={this.state.selectedDate}
        maxDate={new Date()}
        dateFormat="yyyy-MM-dd"
        onChange={(date) => this.setState({ selectedDate: date })} // 添加 onChange 事件处理程序以更新所选日期
      />

    );
  }
  
}

export default ProfileDateTimePicker;
