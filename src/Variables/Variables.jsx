import { darken } from 'polished'

const palette = {
  white:         '#ffffff',
  offWhite:      '#f7f8f8',
  offBlack:      '#222222',

  brandPrimary:  '#008ddf',
  quest:         'yellow',
  field:         'green',

  realmreborn:   '#c1eaef',
  heavensward:   '#182131',
  stormblood:    '#811111',
}


// Define clear variables that can be adjusted through mixins
//   for each component
const text            = palette.offBlack
const textLight       = palette.white
const background      = palette.offWhite
const button          = palette.brandPrimary


const color = {
  text:          text,
  textLight:     textLight,
  background:    background,
  backgroundBox: darken(0.04, background),
  border:        darken(0.12, background),
  button:        button,
  buttonActive:  darken(0.10, button)
}

export default color