const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/AppealsPage.vue'),
        name: 'appeals-page',
        props: (route) => {
          return {
            page: parseInt(route.query.page) || 1,
            limit: parseInt(route.query.limit) || 10,
          };
        },
      },
      { path: 'clients', component: () => import('pages/ClientsPage.vue') },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
