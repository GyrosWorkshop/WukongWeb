import React, {PureComponent, createElement} from 'react'
import {connect} from 'react-redux'
import DocumentTitle from 'react-document-title'
import {BrowserRouter, Route} from 'react-router-dom'
import EventListener from 'react-event-listener'
import PropTypes from 'prop-types'

import Background from './background'
import Notification from './notification'
import DisconnectDialog from './disconnect-dialog'
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
            <DisconnectDialog/>
            <Notification/>
            <Background/>
            {listeners()}
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
