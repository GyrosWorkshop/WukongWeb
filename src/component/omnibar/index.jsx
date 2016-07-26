import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import {debounce} from 'lodash'

import Field from './field'
import Action from '../../action'

function mapStateToProps(state) {
  return {}
}

function mapDispatchToProps(dispatch) {
  return {
    onSearch(keyword) {
      dispatch(Action.Search.keyword.create(keyword))
    }
  }
}

@connect(mapStateToProps, mapDispatchToProps)
export default class OmniBar extends Component {
  static propTypes = {
    onSearch: PropTypes.func
  }

  onKeywordChange = (() => {
    const debouncedSearch = debounce(this.props.onSearch, 500)
    return value => debouncedSearch(value)
  })()

  render() {
    return (
      <Field
        name='Add Song'
        onChange={this.onKeywordChange}
      />
    )
  }

  generateStyle() {
    return {}
  }
}
