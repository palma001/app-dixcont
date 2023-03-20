
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', name: 'Home', component: () => import('pages/IndexPage.vue') },
      { path: 'biller', name: 'Biller', component: () => import('pages/BillerPage.vue') }
    ]
  },
  {
    path: '/',
    children: [
      {
        path: 'login',
        name: 'Login',
        component: () => import('pages/LoginPage.vue')
      }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
