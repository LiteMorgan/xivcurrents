import React, { Component } from 'react'
import Isvg                 from 'react-inlinesvg'
import classNames           from 'classnames'

import quest                from './quest.svg'
import field                from './field.svg'

class Card extends Component {

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
        <div className="Card__column">photo</div>
      )
    }
    return false
  }

  render() {
    const item = this.props.item
    const cardCheckedState = this.props.cardCheckedState

    const cardClasses = classNames("Card", {
      "Card--obtained": cardCheckedState,
    })

    return (
      <div className={cardClasses}>
        <div className="Card__content">
          <div className="Card__column">
            {this.itemType()}
          </div>
          <div className="Card__column Card__column--lg">
            <h3 className="Card__title heading">{item.title}</h3>
            <p className="text">X: {item.coords.x}, Y: {item.coords.y}, Z: {item.coords.z}</p>
            <p
              className="Card__summary text" 
              dangerouslySetInnerHTML={ {__html: item.summary} } 
            />
          </div>
          {this.isPhoto()}
          <div className="Card__column">
            <input
              type="checkbox"
              onChange={this.props.obtained}
              checked={cardCheckedState}
            />
          </div>
        </div>
      </div>
    )
  }
}

export default Card