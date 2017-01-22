import React, {PureComponent, PropTypes} from 'react'
import {connect} from 'react-redux'
import CSSModules from 'react-css-modules'

import Action from '../action'
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

@connect(mapStateToProps, mapDispatchToProps)
@CSSModules(style)
export default class SearchForm extends PureComponent {
  static propTypes = {
    dispatchKeyword: PropTypes.func
  }

  state = {
    value: ''
  }

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
    const {input} = this.refs
    if (this.state.value) {
      this.updateValue('', true)
      input.blur()
    } else {
      input.focus()
    }
  }

  render() {
    const {value} = this.state
    return (
      <div styleName='container'>
        <button onClick={this.onButtonClick}>
          <i className={`fa fa-${value ? 'arrow-left' : 'search'}`}/>
        </button>
        <input ref='input' value={value} onChange={this.onInputChange}
          onKeyDown={this.onKeyDown}/>
      </div>
    )
  }
}
