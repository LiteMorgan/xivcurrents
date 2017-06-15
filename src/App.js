import React, { Component } from 'react'
import Isvg                 from 'react-inlinesvg'

import logo                 from './xivcurrents.svg'
import logoFallback         from './xivcurrents-light.png'
import './App.css'

import Grid                 from './Components/Grid/Grid.jsx'
import Footer               from './Components/Footer/Footer.jsx'

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="Header">
          <div className="Header__content">
            <div >
              <Isvg 
                src={logo}
                className="icon icon__logo"
              >
                <img src={logoFallback} alt="XIVCurrents" className="icon icon__logo"/>
              </Isvg>
            </div>
            <p className="Header__subtitle">Locate and log your <em>Final Fantasy XIV</em> Aether Currents</p>
          </div>
        </header>

        <main className="container">
          <Grid />
        </main>
        <Footer />
      </div>
    )
  }
}

export default App
