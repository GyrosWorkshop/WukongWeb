import Home from '../component/home'

export default function Routes() {
  return [{
    path: '/',
    component: Home,
    childRoutes: []
  }]
}
