import React, {PureComponent} from 'react'
import {connect} from 'react-redux'
import CSSModules from 'react-css-modules'
import PropTypes from 'prop-types'
import {mapValues, map, debounce} from 'lodash'

import {Action} from '../client'
import style from './config-form.css'

const options = {
  sync: {
    name: 'Playlist URLs'
  },
  cookie: {
    name: 'User Cookies'
  }
}
const actions = {
  clear: {
    name: 'Clear Playlist',
    object: Action.Song.assign.create([])
  }
}

function mapStateToProps(state) {
  return mapValues(options, (value, key) => state.user.preferences[key])
}

function mapDispatchToProps(dispatch) {
  return {
    dispatchPreferences(preferences) {
      dispatch(Action.User.preferences.create(preferences))
    },
    dispatchAction(action) {
      dispatch(action)
    }
  }
}

@connect(mapStateToProps, mapDispatchToProps)
@CSSModules(style)
export default class ConfigForm extends PureComponent {
  static propTypes = {
    ...mapValues(options, (value, key) => PropTypes.string),
    dispatchPreferences: PropTypes.func,
    dispatchAction: PropTypes.func
  }

  state = mapValues(options, (value, key) => this.props[key] || '')

  onInputChange = (() => {
    const debouncedDispatch = debounce(this.props.dispatchPreferences, 500)
    return event => {
      const {name, value} = event.target
      const preference = {[name]: value}
      this.setState(preference)
      debouncedDispatch(preference)
    }
  })()

  onButtonClick = (event) => {
    const {name} = event.target
    const action = actions[name].object
    this.props.dispatchAction(action)
  }

  render() {
    return (
      <div styleName='container'>
        {map(options, ({name}, key) => (
          <label key={key}>
            {name}
            <textarea name={key} rows={4}
              value={this.state[key]} onChange={this.onInputChange}/>
          </label>
        ))}
        {map(actions, ({name}, key) => (
          <label key={key}>
            <button name={key} onClick={this.onButtonClick}>
              {name}
            </button>
          </label>
        ))}
      </div>
    )
  }
}
