<template>
  <q-layout view="lHh Lpr fff" class="bg-grey-1">
    <q-header elevated class="bg-white text-grey-8" height-hint="64">
      <q-toolbar class="GPL__toolbar" style="height: 64px">
        <q-btn
          flat
          dense
          round
          @click="toggleLeftDrawer"
          aria-label="Menu"
          icon="menu"
          class="q-mx-md"
        />

        <q-toolbar-title v-if="$q.screen.gt.sm" shrink class="row items-center no-wrap">
          <q-avatar class="q-mr-sm" size="50px">
            <img src="icons/logo-solo.png">
          </q-avatar>
          {{  currentPath.title }}
        </q-toolbar-title>

        <q-space />

        <q-input class="GPL__toolbar-input" dense standout="bg-primary" v-model="search" placeholder="Search">
          <template v-slot:prepend>
            <q-icon v-if="search === ''" name="search" />
            <q-icon v-else name="clear" class="cursor-pointer" @click="search = ''" />
          </template>
        </q-input>

        <q-btn v-if="$q.screen.gt.xs" flat dense no-wrap color="primary" icon="add" no-caps label="Create" class="q-ml-sm q-px-md">
          <q-menu anchor="top end" self="top end">
            <q-list class="text-grey-8" style="min-width: 100px">
              <q-item aria-hidden="true">
                <q-item-section class="text-uppercase text-grey-7" style="font-size: 0.7rem">Crear nuevo</q-item-section>
              </q-item>
              <q-item v-for="menu in createMenu" :key="menu.text" clickable v-close-popup aria-hidden="true">
                <q-item-section avatar>
                  <q-icon :name="menu.icon" />
                </q-item-section>
                <q-item-section>{{ menu.text }}</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
        <q-space />

        <div class="q-gutter-sm row items-center no-wrap">
          <q-btn round dense flat color="text-grey-7" icon="apps">
            <q-tooltip>Google Apps</q-tooltip>
          </q-btn>
          <q-btn round dense flat color="grey-8" icon="notifications">
            <q-badge color="red" text-color="white" floating>
              2
            </q-badge>
            <q-tooltip>Notifications</q-tooltip>
          </q-btn>
          <q-btn round flat>
            <q-avatar size="26px">
              <img src="https://cdn.quasar.dev/img/boy-avatar.png">
            </q-avatar>
            <q-tooltip>Account</q-tooltip>
          </q-btn>
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      bordered
      behavior="mobile"
    >
      <q-scroll-area class="fit">
        <q-toolbar class="GPL__toolbar">
          <q-toolbar-title class="row justify-center">
            <div class="col-8">
              <img src="icons/logo.png" width="150" height="90">
            </div>
          </q-toolbar-title>
        </q-toolbar>

        <q-list padding>
          <div v-for="link in links" :key="link.id">
            <q-item
              clickable
              class="GPL__drawer-item q-pl-lg"
              active-class="bg-primary text-white"
              v-ripple
              :active="currentPath.route === link.route"
              @click="setRouter(link)"
              v-if="!link.children"
            >
              <q-item-section avatar>
                <q-icon :name="link.icon" />
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ link.title }}</q-item-label>
              </q-item-section>
            </q-item>
          </div>
          <div v-for="link in links" :key="link.id">
            <q-expansion-item
              clickable
              class="overflow-hidden GPL__drawer-item"
              style="border-end-end-radius;: 30px"
              expand-separator
              default-opened
              round
              :icon="link.icon"
              :label="link.title"
              v-if="link.children"
            >
              <q-list padding>
                <q-item
                  v-for="children in link.children"
                  clickable
                  class="GPL__drawer-item q-pl-lg"
                  active-class="bg-primary text-white"
                  :active="currentPath.route === children.route"
                  v-ripple
                  :key="children.id"
                  @click="setRouter(children)"
                >
                  <q-item-section avatar>
                    <q-icon :name="children.icon" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>{{ children.title }}</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-expansion-item>
          </div>
        </q-list>
      </q-scroll-area>
    </q-drawer>

    <q-page-container class="GPL__page-container">
      <router-view />

      <q-page-sticky expand v-if="$q.screen.gt.sm" position="left">
        <div class="fit q-pt-xl q-px-sm column">
          <q-btn round flat color="grey-8" stack no-caps size="26px">
            <q-icon size="22px" name="photo" />
            <div class="GPL__side-btn__label">Photos</div>
          </q-btn>

          <q-btn round flat color="grey-8" stack no-caps size="26px">
            <q-icon size="22px" name="collections_bookmark" />
            <div class="GPL__side-btn__label">Albums</div>
          </q-btn>

          <q-btn round flat color="grey-8" stack no-caps size="26px">
            <q-icon size="22px" name="assistant" />
            <div class="GPL__side-btn__label">Assistant</div>
            <q-badge floating color="red" text-color="white" style="top: 8px; right: 16px">
              1
            </q-badge>
          </q-btn>
        </div>
      </q-page-sticky>
    </q-page-container>
  </q-layout>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

export default {
  name: 'GooglePhotosLayout',

  created () {
    this.$api.defaults.headers.common.authorization = `${localStorage.getItem('tokenType')} ${localStorage.getItem('accessToken')}`
  },
  setup () {
    /**
     * Status menu
     * @type {Boolean}
     */
    const leftDrawerOpen = ref(false)
    /**
     * Search menu
     * @type {String}
     */
    const search = ref('')
    /**
     * Functions router
     * @type {Function}
     */
    const $router = useRouter()
    /**
     * Current path
     * @type {Object}
     */
    const currentPath = ref({
      icon: 'home',
      title: 'Inicio',
      route: 'Home'
    })
    /**
     * Toggle left drawer
     */
    function toggleLeftDrawer () {
      leftDrawerOpen.value = !leftDrawerOpen.value
    }
    /**
     * Set router
     * @param {Object} children menu data
     */
    function setRouter (children) {
      leftDrawerOpen.value = false
      currentPath.value = children
      $router.push({ name: children.route })
    }

    return {
      leftDrawerOpen,
      search,
      currentPath,
      createMenu: [
        { icon: 'photo_album', text: 'Album' },
        { icon: 'people', text: 'Shared Album' },
        { icon: 'movie', text: 'Movie' },
        { icon: 'library_books', text: 'Animation' },
        { icon: 'dashboard', text: 'Collage' },
        { icon: 'book', text: 'Photo book' }
      ],
      links: [
        {
          icon: 'home',
          title: 'Inicio',
          route: 'Home'
        },
        {
          title: 'Facturación',
          icon: 'receipt',
          children: [
            {
              icon: 'receipt_long',
              title: 'Facturar',
              route: 'Biller'
            },
            {
              icon: 'widgets',
              title: 'Productos',
              route: 'Product'
            },
            {
              icon: 'list_alt',
              title: 'Reporte de caja',
              route: 'BoxReport'
            }
          ]
        },
        {
          title: 'Personal',
          icon: 'person',
          children: [
            {
              icon: 'face',
              title: 'Vendedores',
              route: 'Seller'
            },
            {
              icon: 'face_6',
              title: 'Clientes',
              route: 'Client'
            }
          ]
        },
        {
          title: 'Configuración',
          icon: 'settings',
          children: [
            {
              icon: 'attach_money',
              title: 'Moneda',
              route: 'Coin'
            },
            {
              icon: 'credit_card',
              title: 'Metodos de pago',
              route: 'PaymentMethod'
            },
            {
              icon: 'summarize',
              title: 'Tipo de factura',
              route: 'InvoiceType'
            },
            {
              icon: 'category',
              title: 'Categorias',
              route: 'Category'
            },
            {
              icon: 'supervised_user_circle',
              title: 'Roles',
              route: 'Role'
            },
            {
              icon: 'account_circle',
              title: 'Usuarios',
              route: 'User'
            }
          ]
        }
      ],
      toggleLeftDrawer,
      setRouter
    }
  }
}
</script>

<style lang="sass">
.GPL

  &__toolbar
    height: 64px

  &__toolbar-input
    width: 35%

  &__drawer-item
    line-height: 24px
    border-radius: 0 24px 24px 0
    margin-right: 12px

    .q-item__section--avatar
      padding-left: 12px

    .q-item__label:not(.q-item__label--caption)
      letter-spacing: .01785714em
      font-size: .875rem
      font-weight: 500
      line-height: 1.25rem

  &__side-btn
    &__label
      font-size: 12px
      line-height: 24px
      letter-spacing: .01785714em
      font-weight: 500

  @media (min-width: 1024px)
    &__page-container
      padding-left: 94px
</style>
