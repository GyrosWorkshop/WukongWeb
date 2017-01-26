import React, {PureComponent, PropTypes} from 'react'
import {connect} from 'react-redux'

import Selector from '../selector'
import Action from '../action'
import ButtonItem from './button-item'

function mapStateToProps(state) {
  return {
    files: state.song.playing.files
  }
}

function mapDispatchToProps(dispatch) {
  return {}
}

@connect(mapStateToProps, mapDispatchToProps)
export default class DownloadButton extends PureComponent {
  static propTypes = {
    files: PropTypes.array
  }

  render() {
    const {files} = this.props
    //format || 'unknown'
    //quality && quality.description
    return (
      <ButtonItem icon='download' hidden={!files}>
        <p>Download Song</p>
        {files && files.map(({format, quality}) => (
          <p>{JSON.stringify(file)}</p>
        ))}
      </ButtonItem>
    )
  }
}
