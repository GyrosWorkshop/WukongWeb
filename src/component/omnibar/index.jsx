import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import Radium from 'radium'
import Paper from 'material-ui/Paper'
import muiThemeable from 'material-ui/styles/muiThemeable'
import {debounce} from 'lodash'

import Field from './field'
import Action from '../../action'

const PaperRadium = Radium(Paper)

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
@muiThemeable()
export default class OmniBar extends Component {
  static propTypes = {
    onSearch: PropTypes.func,
    muiTheme: PropTypes.object.isRequired
  }

  onKeywordChange = (() => {
    const debouncedSearch = debounce(this.props.onSearch, 500)
    return value => debouncedSearch(value)
  })()

  render() {
    const style = this.generateStyle()
    return (
      <PaperRadium style={style.container}>
        <Field
          name='Add Song'
          onChange={this.onKeywordChange}
        />
      </PaperRadium>
    )
  }

  generateStyle() {
    return {
      container: {
        width: 'auto',
        marginLeft: this.props.muiTheme.appBar.padding,
        marginRight: this.props.muiTheme.appBar.padding,
        marginTop: this.props.muiTheme.spacing.desktopGutterMini,
        marginBottom: this.props.muiTheme.spacing.desktopGutterMini,
        padding: 0,
        [this.props.muiTheme.responsive.tablet.mediaQuery]: {
          width: this.props.muiTheme.searchField.recommendedWidth,
          marginLeft: 'auto',
          marginRight: 'auto',
          marginTop: this.props.muiTheme.spacing.desktopGutterLess,
          marginBottom: this.props.muiTheme.spacing.desktopGutterLess
        }
      }
    }
  }
}
