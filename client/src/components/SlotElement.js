import React, { Component } from "react";
import './SlotElement.css'
export default class SlotElement extends Component {

	getComponentClass = () => {
		let isEmpty = this.props.isEmpty;
		let slotName = this.props.slotName;
		let posClass = slotName.toLowerCase().split('/');
		if (isEmpty === "empty") {
			if (posClass.length === 2)
				return "emptySlot " + posClass[0] + posClass[1];
			else
				return "emptySlot " + slotName.toLowerCase();
		}
		else {
			return "filledClass"
		}
	};

	render() {
		return (
			<div className={this.getComponentClass()}>
				{this.props.slotName}
			</div>
		);
	}
}
