import React, { Component } from 'react'
import classNames           from 'classnames'


class FilterToggle extends Component {
  constructor(props) {
    super(props)

    this.state = {
      isChecked: false
    }

    this.filterChecked = this.filterChecked.bind(this)
  }

  filterChecked() {
    const filterBtn = this.props
    const filterState = this.state.isChecked
    this.setState(
      {
        isChecked: !this.state.isChecked
      }, () => {
        this.props.handleFilterChange(filterBtn, filterState)
      }
    )
  }

  render () {
    const filter = this.props

    const filterToggleClasses = classNames('FilterToggle', {
      'FilterToggle--active': this.state.isChecked,
    })

    return (
      <label className={filterToggleClasses}>
        <input
          id={filter.id}
          value={filter.id}
          name={filter.label}
          type="checkbox"
          onChange={this.filterChecked}
        />
        {filter.label}
      </label>
    )
  }
}

export default FilterToggle