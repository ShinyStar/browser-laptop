/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

'use strict'

const appConstants = require('../../../js/constants/appConstants')
const settings = require('../../../js/constants/settings')
const { getSetting } = require('../../../js/settings')
const aboutNewTabState = require('../../common/state/aboutNewTabState')
const { calculateTopSites } = require('../api/topSites')

const aboutNewTabReducer = (state, action) => {
  switch (action.actionType) {
    case appConstants.APP_SET_STATE:
      // only show private search engine override options if needed
      // (ex: not shown if a region specific default is provided)
      const useAlternativePrivateSearchEngine = getSetting(settings.USE_ALTERNATIVE_PRIVATE_SEARCH_ENGINE, state.get('settings'))
      let newTabPageDetail = {}
      if (getSetting(settings.SHOW_ALTERNATIVE_PRIVATE_SEARCH_ENGINE, state.get('settings'))) {
        newTabPageDetail = {
          useAlternativePrivateSearchEngine
        }
      }
      state = aboutNewTabState.mergeDetails(state, {
        newTabPageDetail: newTabPageDetail
      })
      break
    case appConstants.APP_TOP_SITE_DATA_AVAILABLE:
      state = aboutNewTabState.setSites(state, action.topSites)
      break
    case appConstants.APP_CHANGE_NEW_TAB_DETAIL:
      state = aboutNewTabState.mergeDetails(state, action)
      if (action.refresh) {
        calculateTopSites(true, true)
      }
      break
    case appConstants.APP_CHANGE_SETTING:
      if (action.key === settings.USE_ALTERNATIVE_PRIVATE_SEARCH_ENGINE ||
          action.key === settings.SHOW_ALTERNATIVE_PRIVATE_SEARCH_ENGINE) {
        const showAlternativePrivateSearchEngines = action.key === settings.SHOW_ALTERNATIVE_PRIVATE_SEARCH_ENGINE
          ? action.value
          : getSetting(settings.SHOW_ALTERNATIVE_PRIVATE_SEARCH_ENGINE, state.get('settings'))

        const useAlternativePrivateSearchEngine = action.key === settings.USE_ALTERNATIVE_PRIVATE_SEARCH_ENGINE
          ? action.value
          : getSetting(settings.USE_ALTERNATIVE_PRIVATE_SEARCH_ENGINE, state.get('settings'))

        let newTabPageDetail = {}
        if (showAlternativePrivateSearchEngines) {
          newTabPageDetail = {
            useAlternativePrivateSearchEngine
          }
        }

        state = aboutNewTabState.mergeDetails(state, {
          newTabPageDetail: newTabPageDetail
        })
      }
  }
  return state
}

module.exports = aboutNewTabReducer
