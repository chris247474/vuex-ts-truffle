import { timeout } from '@methods';
import { ProgressBar } from '@store';
import * as RootStore from '@store';
import { RouteConfig } from 'vue-router';
import * as Stores from '@store';


export const routesList: RouteConfig[]  = [
  {
    path: '/', name: 'Accueil',
    component: () => import('@views/Home/Home.vue'),
  },
  { 
    path: '/moving/:search?', name: 'Je déménage',
    component: () => import('@views/Moving/Moving.vue'),
    props: true,
    meta: {
      async asyncData() {
        await Stores.MovingStore.actions.fetchMoving({});
      }
    }
  },
  {
    path: '/movers/:region?', name: 'Les déménageurs',
    component: () => import('@views/Movers.vue'),
    props: true,
    meta: {
      contentProp: true,
      async asyncData() {
        // await timeout(2000);
      }
    }
  },
  { path: '/bemover', name: 'Devenir déménageur',
    component: () => import('@views/BeMover/BeMover.vue'), 
    meta: {
      requiresAuth: true 
    },

  },
  { path: '/inscription', name: 'Inscription', 
    component: () => import('@components/Inscription.vue'),
    meta: {
      noAuth: true
    },
    props: { 
      isPopup: false 
    },
  },
  { path: '/connexion', name: 'Connexion',
    component: () => import('@components/Connexion.vue'),
    meta: {
      noAuth: true
    },
    props: {
      isPopup: false,
      redirect: '/'
    },
  },
  { path: '/*',
    alias: '404',
    component: () => import('@views/Home/Home.vue')
}
]