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
		if (name.length>3){
				var theoryletter=[];
				var thnumindex;
				var z=[];
				var labletterindex;
				for (var i=0;i<name.length;i++){
				if (isNaN(name[i])===true)
				{
					theoryletter=theoryletter.concat(name[i]);
				}

				else{
					thnumindex=i;
					break;
				}
			}

			for (var i=thnumindex;i<name.length;i++){
				if(isNaN(name[i])===false){
					z=z.concat(name[i]);
				}
				else{
					labletterindex=i;
					break;
				}

			}

			return name.slice(0,labletterindex)+"/"+name.slice(labletterindex);

		}

		else{
				return name;
			}
}

	render() {
		return (
			<div className={this.getComponentClass()}>
				{this.slashBreak(this.props.slotName)}
			</div>
		);
	}
}
