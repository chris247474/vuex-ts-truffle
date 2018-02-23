import { IMovingState } from '@types';
import Api, { ApiError, ApiSuccess, ApiWarning, ApiResponse } from '../Api';
import { RootState } from '../index';
import { timeout } from '@methods';
import { flatten } from 'lodash';
import { storeBuilder } from "./Store/Store";
import $ from 'jquery';
import axios from 'axios';

const MOVING_URL = 'announcements';
const GEO_API = 'https://geo.api.gouv.fr';

//State
const state: IMovingState = {
  formSearchData: {
    formSearchValue: '',
    placesResults: []
  },
  movingList: []
}

const b = storeBuilder.module<IMovingState>("MovingModule", state);
const stateGetter = b.state()

// Getters
namespace Getters {
  export const getters = {
    
  }  
}

// Mutations
namespace Mutations {
  function updateMovingList(state: IMovingState, list: Array<any>) {
    state.movingList = list;
  }

  function updateSearchList(state: IMovingState, list: Array<any>) {
    state.formSearchData.placesResults = list;
  }

  function updateSearchValue(state: IMovingState, newString: string) {
    state.formSearchData.formSearchValue = newString;
  }

  export const mutations = {
    updateMovingList: b.commit(updateMovingList),
    updateSearchList: b.commit(updateSearchList),
    updateSearchValue: b.commit(updateSearchValue)
  }
}

// Actions
namespace Actions {

  async function fetchMoving(context, payload: Object) {
    let { data } = await Api.get(MOVING_URL);
    if (data) {
      Mutations.mutations.updateMovingList(data);
    } else {
      return
    }
  }

  async function fetchPlaces(context, payload: string) {
    let searchValues = await Promise.all([
      axios.get(`${GEO_API}/communes?nom=${payload}&boost=population`),
      axios.get(`${GEO_API}/departements?nom=${payload}`),
      axios.get(`${GEO_API}/regions?nom=${payload}`),
    ])
    let filteredValues = flatten(searchValues.map(m => m.data))
      .map(m => {
        if (m.codeDepartement && m.codeRegion) {m.type = 'ville';}
        else if (m.codeRegion) { m.type = 'departement';} 
        else  {m.type = 'region'}
        return m;
      })
      .sort((a, b) => b._score - a._score)
      .filter((item, pos, self) => self.findIndex(elem => elem.nom == item.nom) == pos)
      .slice(0, 4);
    console.log(filteredValues);
    Mutations.mutations.updateSearchList(filteredValues);
  }

  export const actions = {
    fetchMoving: b.dispatch(fetchMoving),
    fetchPlaces: b.dispatch(fetchPlaces)
  }
}

// Module
const MovingModule = {
  get state() { return stateGetter()},
  getters: Getters.getters,
  mutations: Mutations.mutations,
  actions: Actions.actions
}


export default MovingModule;

