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
    input: ''
  }

  updateInput(input, emitChange) {
    this.setState({input})
    if (emitChange) this.props.dispatchKeyword(input)
  }

  onInputChange = (event) => {
    const input = event.target.value
    this.updateInput(input, !input)
  }

  onKeyDown = (event) => {
    if (event.key == 'Enter') {
      this.updateInput(this.state.input, true)
    }
  }

  onButtonAction = (event) => {
    this.updateInput(this.state.input, true)
  }

  render() {
    const {input} = this.state
    return (
      <div styleName='container'>
        <input value={input} onChange={this.onInputChange}
          onKeyDown={this.onKeyDown}/>
        <button onClick={this.onButtonAction}>
          <i className='fa fa-search'/>
        </button>
      </div>
    )
  }
}
