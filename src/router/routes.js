import Trans from "src/i18n/translation";
import { RouterView } from "vue-router";
import { useAuthStore } from "src/stores/authStore";
import { useAppealStore } from "src/stores/appealStore";
import { SessionStorage } from "quasar";

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
                  const appealType =
                    SessionStorage.getItem("typeOfAppeal") ||
                    appealStore.typeOfAppeal;

                  if (from.name) {
                    next();
                  } else if (appealType === 1) {
                    await appealStore.fetchApplicantData();
                    await appealStore.fetchHospitalData();
                    next();
                  } else {
                    next({ name: "appeals-page" });
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
                beforeEnter: async (to, from, next) => {
                  const appealStore = useAppealStore();
                  if(appealStore.isClinic || appealStore.isDrugstore) {
                    return; 
                  }
                  if (from.name) {
                    next();
                  } else {
                    await appealStore.fetchMedicalPrograms();
                    await appealStore.fetchApplicantData();
                    await appealStore.fetchHospitalData();
                    next();
                  }
                },
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
                  const appealType =
                    SessionStorage.getItem("typeOfAppeal") ||
                    appealStore.typeOfAppeal;

                  if (from.name) {
                    next();
                  } else if (appealType === 1) {
                    await appealStore.fetchApplicantDrugData();
                    next();
                  } else {
                    next({ name: "drugstore-page" });
                  }
                },
              },
              {
                path: "create-appeal-drug-limit/:id",
                name: "createAppealDrugLimit",
                props: (route) => {
                  return {
                    id: route.params.id,
                    key: route.params.id,
                  };
                },
                component: () => import("pages/CreateAppealDrugLimit.vue"),
                beforeEnter: async (to, from, next) => {
                  const appealStore = useAppealStore();
                  if (from.name) {
                    next();
                  } else {
                    await appealStore.fetchMedicalPrograms();
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
            ],
          },
          {
            path: "reports-clinic",
            name: "reports-clinic-page",
            component: () => import("src/pages/ReportsClinicsPage.vue"),
          },
          {
            path: "reports-drugstore",
            name: "reports-drugstore-page",
            component: () => import("src/pages/ReportsDrugstorePage.vue"),
          },
          {
            path: "reports-organizations",
            name: "reports-organizations-page",
            component: () => import("src/pages/ReportsOrganizationsPage.vue"),
          },
          {
            path: "billing",
            name: "billing-page",
            component: () => import("src/pages/BillingPage.vue"),
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
