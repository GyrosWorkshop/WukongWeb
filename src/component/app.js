import React, {PureComponent, Fragment, createElement} from 'react'
import {connect} from 'react-redux'
import DocumentTitle from 'react-document-title'
import {BrowserRouter, Route} from 'react-router-dom'
import EventListener from 'react-event-listener'
import PropTypes from 'prop-types'
import {hot} from 'react-hot-loader'

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

export default
@hot(module)
@connect(mapStateToProps, mapDispatchToProps)
class App extends PureComponent {
  static propTypes = {
    auth: PropTypes.bool,
    children: PropTypes.node
  }

  render() {
    const {auth, children} = this.props
    return (
      <DocumentTitle title='Wukong'>
        <BrowserRouter>
          <Fragment>
            <Route path='/' exact component={
              lazy(() => import(
                /* webpackChunkName: 'welcome' */
                './welcome'
              ))
            }/>
            <Route path='/:channel' component={
              lazy(() => import(
                /* webpackChunkName: 'channel' */
                './channel'
              ))
            }/>
            {!auth && createElement(
              lazy(() => import(
                /* webpackChunkName: 'login' */
                './login'
              ))
            )}
            <Notification/>
            <Background/>
            {listeners()}
            {children}
          </Fragment>
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

    async load() {
      const module = await loader()
      const component = module.default
      this.setState({component})
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

function listeners() {
  return [
    <EventListener key='document' target={document}
      onClick={event => {
        const element = document.activeElement
        switch (element.tagName) {
          case 'A':
          case 'BUTTON':
            element.blur()
        }
      }}
    />
  ]
}
