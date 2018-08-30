import React, {PureComponent, createRef} from 'react'
import {connect} from 'react-redux'
import CSSModules from 'react-css-modules'
import PropTypes from 'prop-types'

import {Action} from '../client'
import style from './search-form.css'

function mapStateToProps(state) {
  return {}
}

function mapDispatchToProps(dispatch) {
  return {
    dispatchKeyword(keyword) {
      dispatch(Action.Search.keyword.create(keyword))
    }
  }
}

export default
@connect(mapStateToProps, mapDispatchToProps)
@CSSModules(style)
class SearchForm extends PureComponent {
  static propTypes = {
    dispatchKeyword: PropTypes.func
  }

  state = {
    value: ''
  }

  input = createRef()

  updateValue(value, emitChange) {
    this.setState({value})
    if (emitChange) this.props.dispatchKeyword(value)
  }

  onInputChange = (event) => {
    const {value} = event.target
    this.updateValue(value, !value)
  }

  onKeyDown = (event) => {
    if (event.key == 'Enter') {
      this.updateValue(this.state.value, true)
    }
  }

  onButtonClick = (event) => {
    if (this.state.value) {
      this.updateValue('', true)
      this.input.current.blur()
    } else {
      this.input.current.focus()
    }
  }

  render() {
    const {value} = this.state
    return (
      <div styleName='container'>
        <button onClick={this.onButtonClick}>
          <i className={`fa fa-${value ? 'arrow-left' : 'search'}`}/>
        </button>
        <input ref={this.input}
          value={value}
          onChange={this.onInputChange} onKeyDown={this.onKeyDown}/>
      </div>
    )
  }
}
