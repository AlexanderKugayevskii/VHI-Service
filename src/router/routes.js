import Trans from "src/i18n/translation";
import { RouterView } from "vue-router";
import { useAuthStore } from "src/stores/authStore";
import { useAppealStore } from "src/stores/appealStore";

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
                beforeEnter: async (to, from, next) => {
                  const appealStore = useAppealStore();
                  if (from.name) {
                    next();
                  } else {
                    await appealStore.fetchApplicantData();
                    await appealStore.fetchHospitalData();
                    next();
                  }
                },
              },
              {
                path: "create-appeal-limit/:id",
                name: "createAppealLimit",
                props: (route) => {
                  return {
                    id: route.params.id,
                    key: route.params.id,
                  };
                },
                component: () => import("pages/CreateAppealLimit.vue"),
              },
            ],
          },
          {
            path: "drugstore",
            component: () => import("pages/DrugstorePage.vue"),
            name: "drugstore-page",
            beforeEnter: (to, from, next) => {
              const { user } = useAuthStore();

              if (user.role.id !== 8) {
                next();
              } else {
                next({ path: "" });
              }
            },
            children: [
              {
                path: "create-appeal/:id",
                name: "createDrugsAppeal",
                props: (route) => {
                  return {
                    id: route.params.id,
                    key: route.params.id,
                  };
                },
                component: () => import("pages/CreateDrugAppealPage.vue"),
                beforeEnter: async (to, from, next) => {
                  const appealStore = useAppealStore();
                  if (from.name) {
                    next();
                  } else {
                    await appealStore.fetchApplicantDrugData();

                    next();
                  }
                },
              },
            ],
          },
          {
            path: "clients",
            name: "clients",
            component: () => import("pages/ClientsPage.vue"),
            beforeEnter: async (to, from, next) => {
              const appealStore = useAppealStore();
              if (appealStore.isAgent) {
                next();
              } else {
                next({ name: "notFound" });
              }
            },
            children: [
              {
                path: ":id",
                name: "clientInfo",
                component: () => import("pages/ClientInfoPage.vue"),
                props: (route) => {
                  return {
                    id: route.params.id,
                    key: route.params.id,
                  };
                },
              },
            ]
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
        name: "notFound",
        component: () => import("pages/ErrorNotFound.vue"),
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
];

export default routes;
