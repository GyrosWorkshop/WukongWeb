import React, {Component} from 'react'
import {StyleRoot, Style} from 'radium'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import injectTapEventPlugin from 'react-tap-event-plugin'

import Frame from './frame'
import TopBar from '../topbar'
import Lyrics from '../lyrics'
import OmniBar from '../omnibar'
import SongList from '../songlist'
import Theme from '../../theme'

injectTapEventPlugin()

export default class App extends Component {
  render() {
    return (
      <StyleRoot>
        <MuiThemeProvider muiTheme={Theme['Dark']}>
          <Frame
            header={<TopBar />}
            footer={<Lyrics />}
          >
            <OmniBar />
            <SongList />
          </Frame>
        </MuiThemeProvider>
        <Style rules={{
          body: {
            margin: 0
          }
        }}/>
      </StyleRoot>
    )
  }
}
