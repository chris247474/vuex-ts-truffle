import {ActionContext  } from 'vuex';
import Vue from 'vue'
import { IGlobalState, svgPath } from '@types';
import Api, { ApiError, ApiSuccess, ApiWarning, ApiResponse } from '../Api';
import { RootState } from '../index';
import { timeout } from '@methods';
import { merge } from 'lodash';
import axios from 'axios';
import { storeBuilder } from "./Store/Store";

type GlobalContext = ActionContext<IGlobalState, RootState>;

//State
const state: IGlobalState = {
  svgMapPaths: []
}

const b = storeBuilder.module<IGlobalState>("GlobalModule", state);
const stateGetter = b.state();

// Getters
namespace Getters {
  const svgMapReady = b.read(function svgMapReady(state: IGlobalState): boolean {
    return state.svgMapPaths.length > 0;
  })

  export const getters = {
    get svgMapReady() { return svgMapReady()}
  }  
}

// Mutations
namespace Mutations {
  function savePaths(state: IGlobalState, paths: svgPath[]) {
    state.svgMapPaths = paths;
  }

  export const mutations = {
    savePaths: b.commit(savePaths),
  }
}

// Actions
namespace Actions {
  async function fetchPaths(context: GlobalContext, svgPath: string) {
    if (!context.state.svgMapPaths.length) {
      let response = await axios.get(`maps/${svgPath}.json`);
      if (response.status == 200) {
        console.log(response)
        context.commit('savePaths', response.data)
      }
    }
  }

  export const actions = {
    fetchPaths: b.dispatch(fetchPaths)
  }
}

// Module
const GlobalModule = {
  get state() { return stateGetter()},
  getters: Getters.getters,
  mutations: Mutations.mutations,
  actions: Actions.actions
}


export default GlobalModule;

