import React, { Component } from 'react'

class Footer extends Component {
  render() {
    return(
      <footer className="Footer">
        <div className="Footer__content">
          <section className="Footer__content__left">
            <p>XIVCurrents v0.3.0 assembled by <a className="link link--light" href="http://eu.finalfantasyxiv.com/lodestone/character/5227277" target="_blank" rel="noreferrer noopener">Mayo Steakfries of Coeurl</a>. <br />
              <a className="link link--light" href="https://github.com/getignited/xivcurrents" target="_blank" rel="noreferrer noopener">View this project</a> on Github.</p>
            <small>&copy; 2017 XIVCurrents. FINAL FANTASY is a registered trademark of Square Enix Holdings Co., Ltd.</small>
          </section>
        </div>
      </footer>
    )
  }
}

export default Footer