import React, { Component } from 'react'
import classNames           from 'classnames'
import _filter              from 'lodash/filter'
import _head                from 'lodash/head'
import _intersection        from 'lodash/intersection'
import _pull                from 'lodash/pull'
import _pullAll             from 'lodash/pullAll'
import _some                from 'lodash/some'
import _sortBy              from 'lodash/sortBy'
import _union               from 'lodash/union'
import ReactGA              from 'react-ga'

import Card                 from './../Card/Card.jsx'
import FilterToggle         from './../FilterToggle/FilterToggle.jsx'

// Import Data Sets
import currents from './../../Data/currents.json'
import zones    from './../../Data/zones.json'
import groups   from './../../Data/groups.json'

const sortedZones  = _sortBy(zones, ['id'])
const sortedGroups = _sortBy(groups, ['id'])

const filteredByGroup      = []
const filteredByZone       = []
const currentsObtained     = []

class Grid extends Component {
  constructor(props) {
    super(props)

    this.state = {
      currentFilter: 'all',
      data: currents,
      zone: '',
      group: '',
      obtained: [],
      filterStatus: '',
      filterMenu: false,
    }

    this.loadCurrentsFromStorage      = this.loadCurrentsFromStorage.bind(this)
    this.obtainedCurrent              = this.obtainedCurrent.bind(this)
    this.updateCurrentState           = this.updateCurrentState.bind(this)
    this.currentsDisplay              = this.currentsDisplay.bind(this)

    this.showFilters                  = this.showFilters.bind(this)
    this.displayAllCurrents           = this.displayAllCurrents.bind(this)
    this.displayHeavenswardCurrents   = this.displayHeavenswardCurrents.bind(this)
    this.displayStormbloodCurrents    = this.displayStormbloodCurrents.bind(this)
    this.filterCurrents               = this.filterCurrents.bind(this)
    this.setFilterStatus              = this.setFilterStatus.bind(this)

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


  showFilters() {
    this.setState({
      filterMenu: !this.state.filterMenu
    })
  }


  /**
   * Show all Aether Currents
   */
   displayAllCurrents() {
    this.setState({
      currentFilter: 'all',
      data: currents,
      zone: '',
      group: '',
    })
   }

  /**
   * Show Heavensward Aether Currents only
   */
  displayHeavenswardCurrents() {
    this.setState({
      currentFilter: 'heavensward',
      data: _filter(currents, {'expansion': 1}),
      zone: '',
      group: '',
    })
  }


  /**
   * Show Stormblood Aether Currents only
   */
  displayStormbloodCurrents() {
    this.setState({
      currentFilter: 'stormblood',
      data: _filter(currents, {'expansion': 2}),
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
      return this.displayAllCurrents()
    }

    this.setState({
      currentFilter: 'filter',
      data: _sortBy(filteredCurrentsList, ['id']),
      zone: _sortBy(filteredByZone),
      group: _sortBy(filteredByGroup), 
    })
  }


  setFilterStatus(event) {

    if (event.target.checked) {
      this.setState({
        filterStatus: event.target.value,
      })
      return
    } else {
      this.setState({
        filterStatus: '',
      })
      return
    }
  }


  render () {
    const currentsDisplay = this.currentsDisplay()

    const allExpansionsClasses = classNames('col-4 btn btn-primary', {
      'btn--active': this.state.currentFilter === 'all'
    })
    const heavenswardExpansionClasses = classNames('col-4 btn btn-primary', {
      'btn--active': this.state.currentFilter === 'heavensward'
    })
    const stormbloodExpansionClasses = classNames('col-4 btn btn-primary', {
      'btn--active': this.state.currentFilter === 'stormblood'
    })
    const contentDisplayClasses = classNames('Grid__content row', {
      'Grid__content--sidebar': this.state.sidebar
    })
    const filterDisplayClasses = classNames('row Grid__filterAppear', {
      'Grid__filterAppear--show': this.state.filterMenu
    })
    const filterCompleteClasses = classNames('FilterToggle FilterRadio', {
      'FilterToggle--active': this.state.filterStatus === 'checked',
    })
    const filterIncompleteClasses = classNames('FilterToggle FilterRadio', {
      'FilterToggle--active': this.state.filterStatus === 'unchecked',
    })

    let CreateZones

    if (currentsDisplay.length < 1) {
      CreateZones = <div className="Grid__section Grid__section--wide">
        <div className="Grid__section__content">
          <p>Nothing matches your filter conditions. Please adjust and try again.</p>
        </div>
      </div>
    } else {
      // Creates a section for each Zone
      CreateZones = sortedZones.map((item, key) => {

        const filtered = _head(_filter(sortedZones, { 'id': parseInt(item.id, 10) }))
        const filteredCurrents = currentsDisplay.filter((current) => {
          return filtered.currents.indexOf(current.id) !== -1
        })

        const sectionTitleClasses = classNames('Grid__sectionTitle', {
          'Grid__sectionTitle--hs': item.expansion === 1,
          'Grid__sectionTitle--sb': item.expansion === 2,
        })

        if (filteredCurrents.length > 0) {
          return (
            <div
              className="Grid__section"
              key={item.id}
            >
              <div className={sectionTitleClasses}>
                <h2 className="heading">{item.name}</h2>
              </div>
              <div className="Grid__section__content">
              {
                filteredCurrents.map((current, key) => {
                  const cardCheckedState = _some(this.state.obtained, (i) => { return i === current.id })
                      
                  return (
                    <Card
                      key={current.id}
                      item={current}
                      cardCheckedState={cardCheckedState}
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

      <section className="Grid">
        <div className="row">
          <div className="Grid__intro">
            <p>XIVCurrents is a tracker for Aether Currents in Final Fantasy XIV. If you want to get flying (and swimming, in Stormblood!) sooner, then this is the site for you.</p>
            <p>As of Stormblood launching, a lot of data will be in flux over the course of early access. Heavensward data also needs confirming, as data has changed since I made my original list 2 years back!</p>
            <p>With that said, I hope this site is of use to you! Any issues you have, please <a className="link" href="">open a new request</a> on the GitHub page.</p>
            <p>Enjoy Stormblood, folks!</p>
          </div>
        </div>

        <div className="row">
          <div 
            className="btn-group"
            role="group"
            aria-label="Expansion Filters"
          >
            <button 
              className={allExpansionsClasses}
              onClick={this.displayAllCurrents}
            >
              All Currents
            </button>
            <button 
              className={heavenswardExpansionClasses}
              onClick={this.displayHeavenswardCurrents}
            >
              Heavensward
            </button>
            <button 
              className={stormbloodExpansionClasses}
              onClick={this.displayStormbloodCurrents}
              disabled
            >
              Stormblood
            </button>
          </div>

          <button
            className="btn"
            onClick={this.showFilters}
          >
            Filters
          </button>
        </div>

        <div className={filterDisplayClasses}>
          <div className="Grid__filters">
            <div className="Grid__filters__row">
              <div className="Grid__filters__column">
                Zones
              </div>
              <div className="Grid__filters__column Grid__filters__column--lg">
                {
                  sortedZones.map((item, key) => {
                    return (
                      <FilterToggle
                        key={item.id}
                        value={item.id}
                        type="zones"
                        data={sortedZones}
                        handleFilterChange={this.filterCurrents}
                        label={item.name}
                      />
                    )
                  })
                }
              </div>
            </div>

            <div className="Grid__filters__row">
              <div className="Grid__filters__column">
                Type
              </div>
              <div className="Grid__filters__column Grid__filters__column--lg">
                {
                  sortedGroups.map((item, key) => {
                    return (
                      <FilterToggle
                        key={item.id}
                        value={item.id}
                        type="groups"
                        data={sortedGroups}
                        handleFilterChange={this.filterCurrents}
                        label={item.name}
                      />
                    )
                  })
                }
              </div>
            </div>

            <div className="Grid__filters__row">
              <div className="Grid__filters__column">
                Status
              </div>
              <div className="Grid__filters__column Grid__filters__column--lg">
                <label className={filterCompleteClasses}>
                  <input
                    value="checked"
                    type="checkbox"
                    onChange={this.setFilterStatus}
                    checked={this.state.filterStatus === 'checked'}
                  />
                  Completed
                </label>
                <label className={filterIncompleteClasses}>
                  <input
                    value="unchecked"
                    type="checkbox"
                    onChange={this.setFilterStatus}
                    checked={this.state.filterStatus === 'unchecked'}
                  />
                  Incomplete
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className={contentDisplayClasses}>
          <section className="Grid__main">
            {CreateZones}
          </section>
        </div>
      </section>
    )
  }
}

export default Grid