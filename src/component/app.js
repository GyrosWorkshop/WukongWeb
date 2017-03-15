import React, {PureComponent, PropTypes} from 'react'
import {connect} from 'react-redux'
import DocumentTitle from 'react-document-title'
import {BrowserRouter, Route} from 'react-router-dom'

import Background from './background'
import Notification from './notification'
import Welcome from './welcome'
import Channel from './channel'
import Login from './login'
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
            <Route path='/' exact component={Welcome}/>
            <Route path='/:channel' component={Channel}/>
            {!auth && <Login/>}
            <Notification/>
            <Background/>
            {children}
          </div>
        </BrowserRouter>
      </DocumentTitle>
    )
  }
}
