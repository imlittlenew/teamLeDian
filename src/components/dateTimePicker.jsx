import React, { Component } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";

class DateTimePicker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedDate: this.props.message || "",
      openTime_hour: 9,
      openTime_minutes: 0,
      closeTime_hour: 22,
      closeTime_minutes: 0,
      dbdata: {},
      week: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    };
  }
  isHoliday = (date) => {
    const minDate = new Date();
    const maxDate = new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000);
    let index = date.getDay();
    if (date >= minDate && date < maxDate) {
      if (this.state.dbdata[`${this.state.week[index]}_start`] === "店休") {
        return true;
      }
    }
    return false;
  };

  //接收小孩
  handleMessageFromChild = (message) => {
    // 在父组件中更新狀態
    this.setState({ messageFromChild: message });
  };
  //日其選擇
  selectedDateChange = async (date) => {
    console.log("branch", this.props.branch);
    let newState = { ...this.state };
    newState.selectedDate = date;
    let week = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    let index = newState.selectedDate.getDay();
    if (newState.dbdata[`${week[index]}_start`] !== "店休") {
      [newState.openTime_hour, newState.openTime_minutes] = newState.dbdata[
        `${week[index]}_start`
      ].split(":", 2);

      [newState.closeTime_hour, newState.closeTime_minutes] = newState.dbdata[
        `${week[index]}_end`
      ].split(":", 2);

      if (date.getDate() === new Date().getDate()) {
        if (
          date.getHours() < new Date().getHours() ||
          (date.getHours() === new Date().getHours() &&
            date.getMinutes() < new Date().getMinutes())
        ) {
          newState.selectedDate.setHours(
            new Date().getHours() < newState.openTime_hour
              ? newState.openTime_hour
              : new Date().getHours()
          );
          newState.selectedDate.setMinutes(new Date().getMinutes() + 10);
          console.log(newState);
          this.setState(newState);
        }

        let year = new Date().getFullYear();
        let month = new Date().getMonth();
        let day = new Date().getDate() + 1;
        //選擇時間超過營業時間預設隔天的營業時間
        if (
          date.getHours() >= newState.closeTime_hour &&
          date.getMinutes() >= newState.closeTime_minutes
        ) {
          newState.selectedDate = new Date(
            year,
            month,
            day,
            newState.openTime_hour,
            newState.openTime_minutes
          );
          console.log(newState.selectedDate);
        }
      }

      console.log(newState.selectedDate);
      this.props.onTime(newState.selectedDate);
      this.setState(newState);
    }
  };

  render() {
    return (
      <React.Fragment>
        <DatePicker
          className="w-100 ms-2 text-des form-control"
          // onSendMessage={this.handleMessageFromChild}
          // onMessage={this.props.message}
          selected={this.state.selectedDate}
          onChange={this.selectedDateChange}
          minDate={new Date()}
          maxDate={new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000)}
          showTimeSelect
          timeFormat="HH:mm"
          timeIntervals={10}
          minTime={
            new Date(
              new Date().setHours(
                Number(this.state.openTime_hour),
                Number(this.state.openTime_minutes),
                0
              )
            )
          }
          maxTime={
            new Date(
              new Date().setHours(
                Number(this.state.closeTime_hour),
                Number(this.state.closeTime_minutes),
                0
              )
            )
          }
          dateFormat="yyyy-MM-dd HH:mm"
          renderDayContents={(day, date) => {
            //判斷是否店休
            if (this.isHoliday(date)) {
              return (
                //店休呈現灰色無法點擊
                <div
                  className="react-datepicker__day react-datepicker__day--017 react-datepicker__day--disabled react-datepicker__day--weekend"
                  tabIndex="-1"
                  aria-label="Not available Sunday, March 17th, 2024"
                  role="option"
                  title=""
                  aria-disabled="true"
                  aria-selected="false"
                >
                  {day}
                </div>
              );
            }
            return day;
          }}
        />
        {/* <p>{this.props.message}</p> */}
      </React.Fragment>
    );
  }

  componentDidUpdate(prevProps) {
    if (prevProps.branch !== this.props.branch) {
      this.fetchBranchInfo(this.props.branch);
      // newState.dbdata = result.data[0];
      // console.log(this.props.branch);
    }
  }

  fetchBranchInfo = async (branchId) => {
    try {
      const response = await axios.get(
        `http://localhost:8000/branchinfo/${branchId}`
      );
      const branchData = response.data[0];
      this.setState({ dbdata: branchData });
    } catch (error) {
      console.error("Error fetching branch info:", error);
    }
  };

  componentDidMount = async () => {
    let newState = { ...this.state };
    this.fetchBranchInfo(this.props.branch);
    this.setState(newState);
  };
}

export default DateTimePicker;
