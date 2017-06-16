import React, { Component } from 'react'
import Isvg                 from 'react-inlinesvg'
import classNames           from 'classnames'

import quest                from './quest.svg'
import field                from './field.svg'

class Item extends Component {

  itemType() {
    if(this.props.item.type === "quest") {
      return (
        <Isvg src={quest} className="icon icon__type icon__type--quest" />
      )
    } else {
      return (
        <Isvg src={field} className="icon icon__type icon__type--field" />
      )
    }
  }

  isPhoto() {
    if (this.props.item.url) {
      return (
        <div className="Item__column">photo</div>
      )
    }
    return false
  }

  render() {
    const item = this.props.item
    const itemCheckedState = this.props.itemCheckedState

    const cardClasses = classNames("Item", {
      "Item--obtained": itemCheckedState,
    })

    return (
      <div className={cardClasses}>
        <div className="Item__content">
          <div className="Item__column">
            {this.itemType()}
          </div>
          <div className="Item__column Item__column--lg">
            <h3 className="Item__title">{item.title}</h3>
            <p className="text">X: {item.coords.x}, Y: {item.coords.y}, Z: {item.coords.z}</p>
            <p
              className="Item__summary text" 
              dangerouslySetInnerHTML={ {__html: item.summary} } 
            />
          </div>
          {this.isPhoto()}
          <div className="Item__column">
            <input
              type="checkbox"
              onChange={this.props.obtained}
              checked={itemCheckedState}
            />
          </div>
        </div>
      </div>
    )
  }
}

export default Item