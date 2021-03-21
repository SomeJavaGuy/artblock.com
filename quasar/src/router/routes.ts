import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/DemoLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Home.vue') },
      { path: 'commission', component: () => import('pages/Commission.vue') },
      { path: 'contact2', component: () => import('pages/Index.vue') },
      { path: 'intro', redirect: 'contact2' },
      { path: 'exhibition', redirect: 'contact2' },
      { path: 'editorial', redirect: 'contact2' },
      { path: 'profile', redirect: 'contact2' },
      { path: 'pledge', redirect: 'contact2' },
    ],
  },

  {
    path: '/artist',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/Index.vue') }],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/Error404.vue'),
  },
];

export default routes;
