import React, { Component } from "react";
import "./TimeTable.css";
import SlotElement from "./SlotElement";
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
          {this.getLabelElement("MONDAY", "grayLabel mon")}
          {this.getLabelElement("TUESDAY", "grayLabel tue")}
          {this.getLabelElement("WEDNESDAY", "grayLabel wed")}
          {this.getLabelElement("TURSDAY", "grayLabel thu")}
          {this.getLabelElement("FRIDAY", "grayLabel fri")}


          <SlotElement isEmpty="empty" slotName="A1L1" />
          <SlotElement isEmpty="empty" slotName="B1L7" />
          <SlotElement isEmpty="empty" slotName="C1L13" />
          <SlotElement isEmpty="empty" slotName="D1L19" />
          <SlotElement isEmpty="empty" slotName="E1L25" />

          <SlotElement isEmpty="empty" slotName="F1L2" />
          <SlotElement isEmpty="empty" slotName="G1L8" />
          <SlotElement isEmpty="empty" slotName="A1L14" />
          <SlotElement isEmpty="empty" slotName="B1L20"/>
          <SlotElement isEmpty="empty" slotName="C1L26" />

          <SlotElement isEmpty="empty" slotName="D1L3"/>
          <SlotElement isEmpty="empty" slotName="E1L9" />
          <SlotElement isEmpty="empty" slotName="F1L15" />
          <SlotElement isEmpty="empty" slotName="G1L21"/>
          <SlotElement isEmpty="empty" slotName="TA1L27" />

          <SlotElement isEmpty="empty" slotName="TB1L4"/>
          <SlotElement isEmpty="empty" slotName="TC1L10" />
          <SlotElement isEmpty="empty" slotName="V1L16" />
          <SlotElement isEmpty="empty" slotName="TE1L22"/>
          <SlotElement isEmpty="empty" slotName="TF1L28"/>

          <SlotElement isEmpty="empty" slotName="TG1L5" />
          <SlotElement isEmpty="empty" slotName="TAA1L11" />
          <SlotElement isEmpty="empty" slotName="V2" />
          <SlotElement isEmpty="empty" slotName="TCC1L23"/>
          <SlotElement isEmpty="empty" slotName="TD1L29" />

          <SlotElement isEmpty="empty" slotName="L6" />
          <SlotElement isEmpty="empty" slotName="L12" />
          <SlotElement isEmpty="empty" slotName=""/>
          <SlotElement isEmpty="empty" slotName="L24"/>
          <SlotElement isEmpty="empty" slotName="L30" />


          
        </div>
        <div className=" grayLabel">
          {this.getLabelElement("L\nU\nN\nC\nH")}
        </div>
        <div className="sectionGridEvening">
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

          <SlotElement isEmpty="empty" slotName="A2L31" />
          <SlotElement isEmpty="empty" slotName="B2L37" />
          <SlotElement isEmpty="empty" slotName="C2L43" />
          <SlotElement isEmpty="empty" slotName="D2L49" />
          <SlotElement isEmpty="empty" slotName="E2L55" />

          <SlotElement isEmpty="empty" slotName="F2L32" />
          <SlotElement isEmpty="empty" slotName="G2L38" />
          <SlotElement isEmpty="empty" slotName="A2L44" />
          <SlotElement isEmpty="empty" slotName="B2L50" />
          <SlotElement isEmpty="empty" slotName="C2L56" />

          
          <SlotElement isEmpty="empty" slotName="D2L33"/>
          <SlotElement isEmpty="empty" slotName="E2L39" />
          <SlotElement isEmpty="empty" slotName="F2L45" />
          <SlotElement isEmpty="empty" slotName="G2L51"/>
          <SlotElement isEmpty="empty" slotName="TA2L57" />

          <SlotElement isEmpty="empty" slotName="TB2L34"/>
          <SlotElement isEmpty="empty" slotName="TC2L40" />
          <SlotElement isEmpty="empty" slotName="TD2L46" />
          <SlotElement isEmpty="empty" slotName="TE2L52"/>
          <SlotElement isEmpty="empty" slotName="TF2L58"/>

          <SlotElement isEmpty="empty" slotName="TG2L35" />
          <SlotElement isEmpty="empty" slotName="TAA2L41" />
          <SlotElement isEmpty="empty" slotName="TBB2L47" />
          <SlotElement isEmpty="empty" slotName="TCC2L53"/>
          <SlotElement isEmpty="empty" slotName="TDD2L59" />

          <SlotElement isEmpty="empty" slotName="V3L36" />
          <SlotElement isEmpty="empty" slotName="V4L42" />
          <SlotElement isEmpty="empty" slotName="V5L48"/>
          <SlotElement isEmpty="empty" slotName="V6L54"/>
          <SlotElement isEmpty="empty" slotName="V7L60" />
          
        </div>
      </div>
    );
  }
}
export default TimeTable;
