import React, { Component }     from 'react'
import ReactDOM                 from 'react-dom'
import classNames               from 'classnames'

import FilterToggle             from './../FilterToggle'

class Dropdown extends Component {
  constructor(props) {
    super(props)

    this.state = {
      visible: false,
    }

    this.filterOpened  = this.filterOpened.bind(this)
    this.filterToggled = this.filterToggled.bind(this)
  }

  componentDidMount() {
    document.addEventListener('click', this.handleClickOutside.bind(this), true);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.handleClickOutside.bind(this), true);
  }

  handleClickOutside(event) {
    const domNode = ReactDOM.findDOMNode(this);

    if ((!domNode || !domNode.contains(event.target))) {
      this.setState({
        visible: false,
      })
    }
  }

  filterOpened(thisFilterID) {
    this.setState({
      visible: !this.state.visible,
    })
  }


  filterToggled(event, state) {
    this.props.handleFilterEvent(event, state)
  }

  render () {
    const dropdown = this.props

    const dropdownToggleClasses = classNames('Dropdown', {
      'Dropdown--open': this.state.visible,
    })
    const dropdownMenuClasses = classNames('Dropdown__menu', {
      'Dropdown__menu--lg': dropdown.dropdownSize === 'lg',
    })

    return (
      <div className={dropdownToggleClasses}>
        <button 
          type="button" 
          id={dropdown.id}
          className="btn Dropdown__toggle" 
          data-toggle="dropdown" 
          aria-haspopup="true" 
          aria-expanded="false"
          onClick={() => this.filterOpened(dropdown.id)}
        >
          {dropdown.name}<span className="caret" />
        </button>
        {
          dropdown.customFilters ? (
            dropdown.customFilters
          ) : (
            <div className={dropdownMenuClasses}>
              {
                dropdown.data.map((item, key) => {
                  return (
                    <FilterToggle
                      key={item.id}
                      value={item.id}
                      type={dropdown.filters}
                      data={dropdown.data}
                      handleFilterChange={this.filterToggled}
                      label={item.name}
                    />
                  )
                })
              }
            </div>
          )
        }
      </div>
    )    
  }
}

export default Dropdown