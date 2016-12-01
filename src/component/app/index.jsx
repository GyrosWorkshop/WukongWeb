import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import {StyleRoot, Style} from 'radium'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'

import Frame from './frame'
import TopBar from '../topbar'
import Lyrics from '../lyrics'
import OmniBar from '../omnibar'
import SongList from '../songlist'
import Theme from '../../theme'

function mapStateToProps(state) {
  return {
    theme: state.user.theme
  }
}

function mapDispatchToProps(dispatch) {
  return {}
}

@connect(mapStateToProps, mapDispatchToProps)
export default class App extends Component {
  static propTypes = {
    theme: PropTypes.number
  }

  state = {
    needsUpdate: false
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.theme != nextProps.theme) {
      this.setState({needsUpdate: true})
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.needsUpdate) {
      requestAnimationFrame(() => this.setState({needsUpdate: false}))
    }
  }

  render() {
    return this.state.needsUpdate ? null : (
      <StyleRoot>
        <MuiThemeProvider muiTheme={Theme[this.props.theme]}>
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
