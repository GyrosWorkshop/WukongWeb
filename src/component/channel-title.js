import React, {PureComponent, PropTypes} from 'react'
import {connect} from 'react-redux'
import CSSModules from 'react-css-modules'
import DocumentTitle from 'react-document-title'

import style from './channel-title.css'

function mapStateToProps(state) {
  return {
    channel: state.channel.name
  }
}

function mapDispatchToProps(dispatch) {
  return {}
}

@connect(mapStateToProps, mapDispatchToProps)
@CSSModules(style)
export default class ChannelTitle extends PureComponent {
  static propTypes = {
    channel: PropTypes.string
  }

  render() {
    const {channel} = this.props
    return (
      <DocumentTitle title={channel ? `Wukong / ${channel}` : 'Wukong'}>
        <div styleName='container'>
          <p>Wukong / {channel}</p>
        </div>
      </DocumentTitle>
    )
  }
}
