import React, {PureComponent, PropTypes} from 'react'
import {connect} from 'react-redux'
import CSSModules from 'react-css-modules'
import {get, fromPairs, debounce} from 'lodash'

import Action from '../action'
import style from './config-form.css'

const options = ['sync', 'cookie']

function mapStateToProps(state) {
  return fromPairs(options.map(option => [
    option, get(state, `user.preferences.${option}`)
  ]))
}

function mapDispatchToProps(dispatch) {
  return {
    dispatchSaveConfiguration(preferences) {
      dispatch(Action.User.saveConfiguration.create(preferences))
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
    dispatchSaveConfiguration: PropTypes.func
  }

  state = fromPairs(options.map(option => [
    option, this.props[option] || ''
  ]))

  onInputChange = (() => {
    const debouncedDispatch = debounce(
      this.props.dispatchSaveConfiguration, 500)
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
