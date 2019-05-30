import React, { Component } from "react";
import "./TimeTable.css";
class TimeTable extends Component {
  getLabelElement = (labelName, styleClass) => {
    return (
      <div className={styleClass}>
        {labelName.split("\n").map(text => {
          return <div>{text}</div>;
        })}
      </div>
    );
  };

  render() {
    return (
      <div className="containerGrid">
        <div className="sectionGridMorning">
          <div className="headerGridMorning">
            {this.getLabelElement("THEORY \n HOURS", "grayLabel theory")}
            {this.getLabelElement("8:00AM\nTO\n8:50AM", "purpleLabel theory")}
            {this.getLabelElement("9:00AM\nTO\n9:50AM", "purpleLabel theory")}
            {this.getLabelElement("10:00AM\nTO\n10:50AM", "purpleLabel theory")}
            {this.getLabelElement("11:00AM\nTO\n11:50AM", "purpleLabel theory")}
            {this.getLabelElement("12:00PM\nTO\n12:50PM", "purpleLabel theory")}
            {this.getLabelElement("NO THEORY \n SLOTS", "purpleLabel theory")}
            {this.getLabelElement("LAB \n HOURS", "grayLabel lab")}
            {this.getLabelElement("8:00AM\nTO\n8:45AM", "blueLabel lab")}
            {this.getLabelElement("8:46AM\nTO\n9:30AM", "blueLabel lab")}
            {this.getLabelElement("10:00AM\nTO\n10:45AM", "blueLabel lab")}
            {this.getLabelElement("10:46AM\nTO\n11:30AM", "blueLabel lab")}
            {this.getLabelElement("11:31AM\nTO\n12:15PM", "blueLabel lab")}
            {this.getLabelElement("12:16PM\nTO\n1:00PM", "blueLabel lab")}
          </div>
          <div className="slotsGridMorning">
            {this.getLabelElement("MON", "grayLabel mon")}
            {this.getLabelElement("TUE", "grayLabel tue")}
            {this.getLabelElement("WED", "grayLabel wed")}
            {this.getLabelElement("THU", "grayLabel thu")}
            {this.getLabelElement("FRI", "grayLabel fri")}
          </div>
        </div>
        <div className="sectionGrid grayLabel">
          {this.getLabelElement("L\nU\nN\nC\nH")}
        </div>
        <div className="sectionGridEvening">
          <div className="headerGridEvening">
            {this.getLabelElement("2:00PM\nTO\n2:50PM", "purpleLabel theory")}
            {this.getLabelElement("3:00PM\nTO\n3:50PM", "purpleLabel theory")}
            {this.getLabelElement("4:00PM\nTO\n4:50PM", "purpleLabel theory")}
            {this.getLabelElement("5:00PM\nTO\n5:50PM", "purpleLabel theory")}
            {this.getLabelElement("6:00PM\nTO\n6:50PM", "purpleLabel theory")}
            {this.getLabelElement("7:00PM\nTO\n7:50PM", "purpleLabel theory")}
            {this.getLabelElement("2:00PM\nTO\n2:45PM", "blueLabel lab")}
            {this.getLabelElement("2:46PM\nTO\n2:30PM", "blueLabel lab")}
            {this.getLabelElement("4:00PM\nTO\n4:45PM", "blueLabel lab")}
            {this.getLabelElement("4:46PM\nTO\n5:30PM", "blueLabel lab")}
            {this.getLabelElement("5:31PM\nTO\n6:15PM", "blueLabel lab")}
            {this.getLabelElement("6:16PM\nTO\n7:00PM", "blueLabel lab")}
          </div>
          <div className="slotsGridEvening" />
        </div>
      </div>
    );
  }
}
export default TimeTable;
