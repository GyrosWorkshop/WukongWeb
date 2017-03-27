import React, {PureComponent, PropTypes, createElement} from 'react'
import {connect} from 'react-redux'
import DocumentTitle from 'react-document-title'
import {BrowserRouter, Route} from 'react-router-dom'

import Background from './background'
import Notification from './notification'
import './app.global.css'

function mapStateToProps(state) {
  return {
    auth: state.user.auth.status
  }
}

function mapDispatchToProps(dispatch) {
  return {}
}

@connect(mapStateToProps, mapDispatchToProps)
export default class App extends PureComponent {
  static propTypes = {
    auth: PropTypes.bool,
    children: PropTypes.node
  }

  render() {
    const {auth, children} = this.props
    return (
      <DocumentTitle title='Wukong'>
        <BrowserRouter>
          <div>
            <Route path='/' exact component={
              lazy(() => import('./welcome'))
            }/>
            <Route path='/:channel' component={
              lazy(() => import('./channel'))
            }/>
            {!auth && createElement(
              lazy(() => import('./login'))
            )}
            <Notification/>
            <Background/>
            {children}
          </div>
        </BrowserRouter>
      </DocumentTitle>
    )
  }
}

function lazy(loader) {
  return class LazyComponent extends PureComponent {
    state = {
      component: null
    }

    load() {
      loader().then(module => {
        const component = module.default
        this.setState({component})
      })
    }

    render() {
      const {component: Component} = this.state
      if (Component) {
        return <Component {...this.props}/>
      } else {
        this.load()
        return null
      }
    }
  }
}
