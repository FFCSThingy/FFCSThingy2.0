import React, { Component } from "react";
import './SlotElement.css'
export default class SlotElement extends Component {

	getComponentClass = () => {
		let isEmpty = this.props.isEmpty;
		let slotName = this.props.slotName;
		let posClass = slotName.toLowerCase();
		if (isEmpty === "empty") {
			return "emptySlot " + posClass;
		}
		else {
			return "filledClass"
		}
	};

	slashBreak = (name) => {
		return name.substring(0, 2) + "/" + name.substring(2);
	}

	render() {
		return (
			<div className={this.getComponentClass()}>
				{this.slashBreak(this.props.slotName)}
			</div>
		);
	}
}
