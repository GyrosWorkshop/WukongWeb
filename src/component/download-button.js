import React, {PureComponent, PropTypes} from 'react'
import {connect} from 'react-redux'
import {parse} from 'url'
import {uniq} from 'lodash'

import ButtonItem from './button-item'

function mapStateToProps(state) {
  return {
    title: state.song.playing.title,
    artist: state.song.playing.artist,
    files: state.song.playing.files
  }
}

function mapDispatchToProps(dispatch) {
  return {}
}

@connect(mapStateToProps, mapDispatchToProps)
export default class DownloadButton extends PureComponent {
  static propTypes = {
    title: PropTypes.string,
    artist: PropTypes.string,
    files: PropTypes.array
  }

  render() {
    const {title, artist, files} = this.props
    return (
      <ButtonItem icon='download' hidden={!files}>
        <p>Download Song</p>
        {files && files.map(({urls, format, quality}) => (
          <p key={urls.join('.')}>
            <span>
              {format || 'unknown'}&nbsp;
              {quality && quality.description}:
            </span>
            {uniq(urls).map((url, index) => (
              <span key={url}>
                <br/>&nbsp;·&nbsp;
                <a href={url} target='_blank'
                  type={`audio/${format}`}
                  download={`${artist} - ${title}`}
                  style={{
                    color: 'inherit',
                    textDecoration: 'underline',
                    cursor: 'pointer'
                  }}>
                  {parse(url).host}
                </a>
              </span>
            ))}
          </p>
        ))}
      </ButtonItem>
    )
  }
}
