import React, {PureComponent} from 'react'
import {connect} from 'react-redux'
import CSSModules from 'react-css-modules'
import PropTypes from 'prop-types'
import {get, fromPairs, debounce} from 'lodash'
import {Action} from 'wukong-client'

import style from './config-form.css'

const options = ['sync', 'cookie']

function mapStateToProps(state) {
  return fromPairs(options.map(option => [
    option, get(state, `user.preferences.${option}`)
  ]))
}

function mapDispatchToProps(dispatch) {
  return {
    dispatchPreferences(preferences) {
      dispatch(Action.User.preferences.create(preferences))
    }
  }
}

@connect(mapStateToProps, mapDispatchToProps)
@CSSModules(style)
export default class ConfigForm extends PureComponent {
  static propTypes = {
    ...fromPairs(options.map(option => [
      option, PropTypes.string
    ])),
    dispatchPreferences: PropTypes.func
  }

  state = fromPairs(options.map(option => [
    option, this.props[option] || ''
  ]))

  onInputChange = (() => {
    const debouncedDispatch = debounce(this.props.dispatchPreferences, 500)
    return event => {
      const {name, value} = event.target
      const preference = {[name]: value}
      this.setState(preference)
      debouncedDispatch(preference)
    }
  })()

  render() {
    return (
      <div styleName='container'>
        {options.map(option => (
          <label key={option}>
            <span>{option}</span>
            <textarea name={option} rows={4}
              value={this.state[option]} onChange={this.onInputChange}/>
          </label>
        ))}
      </div>
    )
  }
}
