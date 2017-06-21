import React, { Component } from 'react'
import Isvg                 from 'react-inlinesvg'

import logo                 from './xivcurrents.svg'
import logoFallback         from './xivcurrents-light.png'

import Grid                 from './Components/Grid'
import Footer               from './Components/Footer'

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

        <main className="pageContainer">
          <div className="siteContent">
            <div className="container">
              <p><strong>Update, 19/6/17:</strong> It is done! All the Currents are found, so go earn those wings! Any feedback, comments or suggestions, please feel free to open an issue on the Github, or drop a comment on the <a className="link" href="https://www.reddit.com/r/ffxiv/comments/6hpmbc/xivcurrents_aether_current_tracker_now_updating/" target="_blank" rel="noreferrer noopener">Reddit post</a>. Would be much appreciated! Thanks for taking part, and enjoy Stormblood!</p>
            </div>
            <div className="container">
              <p>XIVCurrents is a tracker for Aether Currents in Final Fantasy XIV. If you want to get flying (and swimming, in Stormblood!) sooner, then this is the site for you.</p>
              <p>As of Stormblood launching, a lot of data will be in flux over the course of early access. Heavensward data also needs confirming, as data has changed since I made my original list 2 years back!</p>
              <p>With that said, I hope this site is of use to you! Any issues you have, please <a className="link" href="https://github.com/getignited/xivcurrents" target="_blank" rel="noreferrer noopener">open a new request</a> on the GitHub page.</p>
              <p>Enjoy Stormblood, folks!</p>
            </div>

            <Grid />
          </div>
        </main>

        <Footer />
      </div>
    )
  }
}

export default App
