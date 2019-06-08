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
		var {slotFilled} = this.props;
		var slots=[];

		for(var i=0;i<slotFilled.length;i++){
			slots=slots.concat(slotFilled[i].toLowerCase().split('+'));
		}

		for(var i=0;i<slots.length;i++){
				var slotClass = document.getElementsByClassName(slots[i])[0];
				slotClass.style.background="yellowgreen";
				slotClass.style.color="black";
		}
		
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
					{this.getLabelElement("THURSDAY", "grayLabel thu")}
					{this.getLabelElement("FRIDAY", "grayLabel fri")}
					<SlotElement isEmpty="empty" slotName="A1/L1" />
					<SlotElement isEmpty="empty" slotName="B1/L7" />
					<SlotElement isEmpty="empty" slotName="C1/L13" />
					<SlotElement isEmpty="empty" slotName="D1/L19" />
					<SlotElement isEmpty="empty" slotName="E1/L25" />
					<SlotElement isEmpty="empty" slotName="F1/L2" />
					<SlotElement isEmpty="empty" slotName="D1/L3" />
					<SlotElement isEmpty="empty" slotName="TB1/L4" />
					<SlotElement isEmpty="empty" slotName="TG1/L5" />
					<SlotElement isEmpty="empty" slotName="L6" />
					<SlotElement isEmpty="empty" slotName="G1/L8" />
					<SlotElement isEmpty="empty" slotName="E1/L9" />
					<SlotElement isEmpty="empty" slotName="TC1/L10" />
					<SlotElement isEmpty="empty" slotName="TAA1/L11" />
					<SlotElement isEmpty="empty" slotName="L12" />
					<SlotElement isEmpty="empty" slotName="A1/L14" />
					<SlotElement isEmpty="empty" slotName="F1/L15" />
					<SlotElement isEmpty="empty" slotName="V1/L16" />
					<SlotElement isEmpty="empty" slotName="V2" />
					<SlotElement isEmpty="empty" slotName="EXTM" />
					<SlotElement isEmpty="empty" slotName="B1/L20" />
					<SlotElement isEmpty="empty" slotName="G1/L21" />
					<SlotElement isEmpty="empty" slotName="TE1/L22" />
					<SlotElement isEmpty="empty" slotName="TCC1/L23" />
					<SlotElement isEmpty="empty" slotName="L24" />
					<SlotElement isEmpty="empty" slotName="C1/L26" />
					<SlotElement isEmpty="empty" slotName="TA1/L27" />
					<SlotElement isEmpty="empty" slotName="TF1/L28" />
					<SlotElement isEmpty="empty" slotName="TD1/L29" />
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
					<SlotElement isEmpty="empty" slotName="A2/L31" />
					<SlotElement isEmpty="empty" slotName="F2/L32" />
					<SlotElement isEmpty="empty" slotName="D2/L33" />
					<SlotElement isEmpty="empty" slotName="TB2/L34" />
					<SlotElement isEmpty="empty" slotName="TG2/L35" />
					<SlotElement isEmpty="empty" slotName="V3/L36" />
					<SlotElement isEmpty="empty" slotName="B2/L37" />
					<SlotElement isEmpty="empty" slotName="G2/L38" />
					<SlotElement isEmpty="empty" slotName="E2/L39" />
					<SlotElement isEmpty="empty" slotName="TC2/L40" />
					<SlotElement isEmpty="empty" slotName="TAA2/L41" />
					<SlotElement isEmpty="empty" slotName="V4/L42" />
					<SlotElement isEmpty="empty" slotName="C2/L43" />
					<SlotElement isEmpty="empty" slotName="A2/L44" />
					<SlotElement isEmpty="empty" slotName="F2/L45" />
					<SlotElement isEmpty="empty" slotName="TD2/L46" />
					<SlotElement isEmpty="empty" slotName="TBB2/L47" />
					<SlotElement isEmpty="empty" slotName="V5/L48" />
					<SlotElement isEmpty="empty" slotName="D2/L49" />
					<SlotElement isEmpty="empty" slotName="B2/L50" />
					<SlotElement isEmpty="empty" slotName="G2/L51" />
					<SlotElement isEmpty="empty" slotName="TE2/L52" />
					<SlotElement isEmpty="empty" slotName="TCC2/L53" />
					<SlotElement isEmpty="empty" slotName="V6/L54" />
					<SlotElement isEmpty="empty" slotName="E2/L55" />
					<SlotElement isEmpty="empty" slotName="C2/L56" />
					<SlotElement isEmpty="empty" slotName="TA2/L57" />
					<SlotElement isEmpty="empty" slotName="TF2/L58" />
					<SlotElement isEmpty="empty" slotName="TDD2/L59" />
					<SlotElement isEmpty="empty" slotName="V7/L60" />
				</div>
			</div>
		);
	}
}
export default TimeTable;
