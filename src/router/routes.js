import Trans from "src/i18n/translation";
import { RouterView } from "vue-router";
const routes = [
  {
    path: "/:locale?",
    component: RouterView,
    beforeEnter: Trans.routeMiddleware,
    children: [
      {
        path: "",
        name: "Dashboard",
        redirect: { name: "appeals-page" },
        component: () => import("layouts/MainLayout.vue"),
        meta: { requiresAuth: true },
        children: [
          {
            path: "appeals",
            component: () => import("pages/AppealsPage.vue"),
            name: "appeals-page",
            // props: (route) => {
            //   return {
            //     page: parseInt(route.query.page) || 1,
            //     limit: parseInt(route.query.limit) || 10,
            //   };
            // },
            children: [
              {
                path: "create-appeal/:id",
                name: "createAppeal",
                props: (route) => {
                  return {
                    id: route.params.id,
                    key: route.params.id,
                  };
                },
                component: () => import("pages/CreateAppealPage.vue"),
                beforeEnter: (to, from, next) => {
                  if (from.name) {
                    next();
                  } else {
                    next("/");
                  }
                },
              },
            ],
          },
          {
            path: "clients",
            name: "clients",
            component: () => import("pages/ClientsPage.vue"),
          },
        ],
      },
      {
        path: "login",
        name: "Login",
        component: () => import("pages/LoginPage.vue"),
      },
      {
        path: ":catchAll(.*)*",
        component: () => import("pages/ErrorNotFound.vue"),
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
];

export default routes;
