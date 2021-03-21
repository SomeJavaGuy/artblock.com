import { RouteRecordRaw } from 'vue-router';
import ContactPage from 'pages/Contact.vue';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/DemoLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Home.vue') },
      { path: 'commission', component: () => import('pages/Commission.vue') },
      {
        path: 'commission-contact',
        component: () => ContactPage,
        props: { isCommission: true },
      },
      { path: 'intro', component: () => ContactPage },
      { path: 'exhibition', component: () => ContactPage },
      { path: 'editorial', component: () => ContactPage },
      { path: 'profile', component: () => ContactPage },
      { path: 'contact', component: () => ContactPage },
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
