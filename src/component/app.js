import React, {PureComponent, PropTypes} from 'react'
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
          <div className='app'>
            <Route path='/' exact component={
              <LazyComponent component={() => import('./welcome')}/>
            }/>
            <Route path='/:channel' component={
              <LazyComponent component={() => import('./channel')}/>
            }/>
            {!auth && (
              <LazyComponent component={() => import('./login')}/>
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

class LazyComponent extends PureComponent {
  static propTypes = {
    component: PropTypes.func
  }

  state = {
    component: null
  }

  render() {
    const {component, ...props} = this.props
    const {component: Component} = this.state
    if (Component) {
      return <Component {...props}/>
    } else {
      component().then(component => this.setState({component}))
      return null
    }
  }
}
