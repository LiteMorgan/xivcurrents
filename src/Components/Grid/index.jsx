import React, { Component } from 'react'
import classNames           from 'classnames'
import _filter              from 'lodash/filter'
import _head                from 'lodash/head'
import _intersection        from 'lodash/intersection'
import _map                 from 'lodash/map'
import _orderBy             from 'lodash/orderBy'
import _pull                from 'lodash/pull'
import _pullAll             from 'lodash/pullAll'
import _some                from 'lodash/some'
import _sortBy              from 'lodash/sortBy'
import _union               from 'lodash/union'
import ReactGA              from 'react-ga'

import Dropdown             from './../Dropdown'
import Item                 from './../Item'

// Import Data Sets
import currents from './../../Data/currents.json'
import zones    from './../../Data/zones.json'
import groups   from './../../Data/groups.json'

const displayZones = _orderBy(zones, ['expansion', 'id'], ['desc', 'asc'])

const sortedZones  = _sortBy(zones, ['id'])
const sortedGroups = _sortBy(groups, ['id'])

const filteredByGroup      = []
const filteredByZone       = []
const currentsObtained     = []

class Grid extends Component {
  constructor(props) {
    super(props)

    this.state = {
      data: currents,
      zone: '',
      group: '',
      obtained: [],
      filterStatus: '',
    }

    this.loadCurrentsFromStorage      = this.loadCurrentsFromStorage.bind(this)
    this.obtainedCurrent              = this.obtainedCurrent.bind(this)
    this.updateCurrentState           = this.updateCurrentState.bind(this)
    this.currentsDisplay              = this.currentsDisplay.bind(this)

    this.filterCurrents               = this.filterCurrents.bind(this)
    this.resetFilter                  = this.resetFilter.bind(this)
    this.setFilterStatus              = this.setFilterStatus.bind(this)
    this.markAllInZone                = this.markAllInZone.bind(this)

    if (process.env.NODE_ENV === 'production') {
      ReactGA.initialize('UA-101041740-1')
      ReactGA.pageview(window.location.pathname);
    }
  }


  componentDidMount() {
    this.loadCurrentsFromStorage()
  }


  loadCurrentsFromStorage() {
    const storedCurrentsObtained = JSON.parse(localStorage.getItem('currents'))
    
    currentsObtained.push.apply(currentsObtained, storedCurrentsObtained)

    this.setState({
      obtained: storedCurrentsObtained || []
    })
  }


  /**
   * Mark current as obtained/unobtained
   */
  obtainedCurrent(id) {
    if ( _some(currentsObtained, (i) => { return i === id }) ) {
      _pull(currentsObtained, id)
    } else {
      currentsObtained.push(id)
    }

    const sortedCurrentsObtained = _sortBy(currentsObtained)

    this.updateCurrentState(sortedCurrentsObtained)
  }


  updateCurrentState(updatedCurrents) {
    this.setState({
      obtained: updatedCurrents,
    }, function() {
      localStorage.setItem('currents', JSON.stringify(this.state.obtained))
    })
  }

  currentsDisplay() {
    const currentsDisplay = this.state.data
    const currentsCompleted = currentsDisplay.filter((removable) => {
      return currentsObtained.indexOf(removable.id) !== -1
    })
    const currentsIncomplete = currentsDisplay.slice(0)
    _pullAll(currentsIncomplete, currentsCompleted)

    if (this.state.filterStatus === 'checked') {
      return currentsCompleted
    } else if (this.state.filterStatus === 'unchecked') {
      return currentsIncomplete
    }
    return currentsDisplay
  }


  resetFilter() {
    this.setState({
      data: currents,
      zone: '',
      group: '',
    })
  }


  filterCurrents(event, state) {
    const mergedFilters = []
    const filteredCurrentsList = []

    const filtered = _head(_filter(event.data, { 'id': parseInt(event.value, 10) }))
    const filteredCurrents = currents.filter((item) => {
      return filtered.currents.indexOf(item.id) !== -1
    })

    switch (event.type) {
      case 'zones':
        (!state) ? filteredByZone.push.apply(filteredByZone, filteredCurrents) : _pullAll(filteredByZone, filteredCurrents)
        break
      case 'groups':
        (!state) ? filteredByGroup.push.apply(filteredByGroup, filteredCurrents) : _pullAll(filteredByGroup, filteredCurrents)
        break
      default:
        break
    }

    if (filteredByZone.length <= 0 || filteredByGroup.length <= 0) {
      mergedFilters.push.apply(mergedFilters, _union(filteredByZone, filteredByGroup))
    } else {
      mergedFilters.push.apply(mergedFilters, _intersection(filteredByZone, filteredByGroup))
    }

    filteredCurrentsList.push.apply(filteredCurrentsList, mergedFilters)

    if (filteredCurrentsList.length <= 0) {
      this.resetFilter()
      return
    }

    this.setState({
      data: _sortBy(filteredCurrentsList, ['id']),
      zone: _sortBy(filteredByZone),
      group: _sortBy(filteredByGroup), 
    })
  }


  setFilterStatus(event) {
    this.setState({
      filterStatus: event.target.checked ? event.target.value : '',
    })
  }

  markAllInZone(data, action) {
    const dataIDs = _map(data, 'id')
    const currentsObtained = this.state.obtained
    const currentsToIgnore = _intersection(dataIDs, currentsObtained)
    const currentsToUpdate = _pullAll(dataIDs, currentsToIgnore)

    if (action === 'select') {
      for (let i=0; i < currentsToUpdate.length; i++) {
        this.obtainedCurrent(currentsToUpdate[i])
      }
    } else {
      for (let i=0; i < currentsToIgnore.length; i++) {
        this.obtainedCurrent(currentsToIgnore[i])
      }
    }

  }


  render () {
    const currentsDisplay = this.currentsDisplay()

    const filterCompleteClasses = classNames('FilterToggle FilterRadio', {
      'FilterToggle--active': this.state.filterStatus === 'checked',
    })
    const filterIncompleteClasses = classNames('FilterToggle FilterRadio', {
      'FilterToggle--active': this.state.filterStatus === 'unchecked',
    })

    const statusFilters = <div className="Dropdown__menu">
      <label className={filterCompleteClasses}>
        Selected
        <input
          value="checked"
          type="checkbox"
          onChange={this.setFilterStatus}
          checked={this.state.filterStatus === 'checked'}
        />
      </label>
      <label className={filterIncompleteClasses}>
        Unselected
        <input
          value="unchecked"
          type="checkbox"
          onChange={this.setFilterStatus}
          checked={this.state.filterStatus === 'unchecked'}
        />
      </label>
    </div>

    let CreateZones

    if (currentsDisplay.length < 1) {
      CreateZones = <section className="container">
        <div className="Grid__noResults space-4 space-top-4">
          <h3>There's no currents here!</h3>
          <p className="text">We've searched high and low with out Aether Compasses, but unfortunately there are no Aether Currents to be found. Please adjust your filter conditions and try again!</p>
        </div>
      </section>
    } else {
      // Creates a section for each Zone
      CreateZones = displayZones.map((item, key) => {

        const filtered = _head(_filter(sortedZones, { 'id': parseInt(item.id, 10) }))
        const filteredCurrents = currentsDisplay.filter((current) => {
          return filtered.currents.indexOf(current.id) !== -1
        })

        const quickToggle = <div className="Dropdown__menu Dropdown__menu--right">
          <button
            className="FilterToggle FilterToggle__btn"
            onClick={() => this.markAllInZone(filteredCurrents, 'select')}
          >
            Select All
          </button>
          <button
            className="FilterToggle FilterToggle__btn"
            onClick={() => this.markAllInZone(filteredCurrents, 'deselect')}
          >
            Unselect All
          </button>
        </div>

        const sectionTitleClasses = classNames('Grid__cardTitle', {
          'Grid__cardTitle--hs': item.expansion === 1,
          'Grid__cardTitle--sb': item.expansion === 2,
        })

        if (filteredCurrents.length > 0) {
          return (
            <div
              className="Grid__card"
              key={item.id}
            >
              <div className={sectionTitleClasses}>
                <h2>{item.name}</h2>
                <Dropdown
                  id={item.name}
                  customFilters={quickToggle}
                />
              </div>
              <div className="Grid__card__content">
              {
                filteredCurrents.map((current, key) => {
                  const itemCheckedState = _some(this.state.obtained, (i) => { return i === current.id })
                      
                  return (
                    <Item
                      key={current.id}
                      item={current}
                      itemCheckedState={itemCheckedState}
                      obtained={() => this.obtainedCurrent(current.id)}
                      filterComplete={this.state.filterComplete}
                      filterIncomplete={this.state.filterIncomplete}
                    />
                  )
                })
              }
              </div>
            </div>
          )
        }
        return false
      })
    }

    return (
      <div className="Grid">
        <section className="container">
          <div>
            <Dropdown
              id="heavenswardZones"
              name="Filter by Zone"
              filters="zones"
              data={sortedZones}
              handleFilterEvent={this.filterCurrents}
              dropdownSize="lg"
            />

            <Dropdown
              id="currentGroups"
              name="Filter by Type"
              filters="groups"
              data={sortedGroups}
              handleFilterEvent={this.filterCurrents}
              dropdownSize="sm"
            />

            <Dropdown
              id="currentStatus"
              name="Filter by Status"
              customFilters={statusFilters}
            />
          </div>
        </section>

        <section className="Grid__main">
          {CreateZones}
        </section>
      </div>
    )
  }
}

export default Grid