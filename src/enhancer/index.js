import {compose} from 'redux'

import offline from './offline'
import speech from './speech'

export default compose(
  offline,
  speech
)
