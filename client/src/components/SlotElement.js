import React, { Component } from "react";
import './SlotElement.css'
export default class SlotElement extends Component {

	getComponentClass = () => {
		let isEmpty = this.props.isEmpty;
		let slotName = this.props.slotName;
		let posClass = slotName.toUpperCase().split('/');
		if (isEmpty === "empty") {
			if (posClass.length === 2)
				return "emptySlot " + posClass[0]+" "+ posClass[1];
			else
				return "emptySlot " + slotName.toUpperCase();
		}
		else {
			return "filledClass"
		}
	};

	render() {
		if(this.props.slotData){
			var line1 = this.props.slotData.code;
			var line2 = this.props.slotData.venue + " - " + this.props.slotData.course_type
		}	

		return (
			<div className={this.getComponentClass()}>
				{this.props.slotName}
				<div>{ line1 }</div>
				<div>{ line2 }</div>
			</div>
		);
	}
}
