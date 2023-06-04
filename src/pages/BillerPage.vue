<template>
  <q-page padding>
    <q-card class="q-pa-md">
      <q-form ref="saveBill" @submit="saveBill">
        <div class="row q-col-gutter-sm">
          <div class="col-xl-4 col-lg-4 col-md-4 col-sm-4 col-xs-4">
            <q-card class="bg-teal text-white" @click="exchange = !exchange">
              <q-card-section class="text-subtitle2 text-center">
                <span v-if="coin">{{ coin.symbol }}</span>{{ formatNumber(totalBill) }}
                <!-- <q-popup-proxy transition-show="flip-up" transition-hide="flip-down">
                  <q-banner>
                    {{ (totalBill * exchangeRate).toFixed(2) }} Bs
                  </q-banner>
                </q-popup-proxy> -->
              </q-card-section>
            </q-card>
          </div>
          <div class="col-xl-4 col-lg-4 col-md-4 col-sm-4 col-xs-4">
            <q-card class="bg-orange text-white">
              <q-card-section class="text-subtitle2 text-center">
                Cambio S{{ exchangeRate }}
              </q-card-section>
            </q-card>
          </div>
          <div class="col-xl-4 col-lg-4 col-md-4 col-sm-4 col-xs-4">
            <q-card class="bg-primary text-white">
              <q-card-section class="text-subtitle2 text-center">
                Items:
                {{ products.length }}
              </q-card-section>
            </q-card>
          </div>
          <div class="col-xl-3 col-lg-3 col-md-4 col-sm-12 col-xs-12">
            <q-select
              use-input
              filled
              dense
              label="Cliente"
              input-debounce="0"
              option-value="id"
              v-model="client"
              clearable
              :option-label="row => `${row.document_number ?? ''} | ${row.name}`"
              :options="clients"
              :rules="[val => !!val || 'El campo es requerido.']"
              @filter="filterClients"
            >
              <template v-slot:append>
                <q-btn color="primary" round icon="add_circle" @click.stop.prevent="(openAddClient = true)" size="sm"/>
              </template>
            </q-select>
          </div>
          <div class="col-xl-3 col-lg-3 col-md-4 col-sm-6 col-xs-6">
            <q-select
              use-input
              filled
              dense
              label="Tipo de factura"
              input-debounce="0"
              option-label="name"
              option-value="id"
              v-model="invoiceType"
              :options="invoiceTypes"
              :rules="[val => !!val || 'El campo es requerido.']"
              @filter="filterInvoiceTypes"
            />
          </div>
          <div class="col-xl-3 col-lg-3 col-md-2 col-sm-6 col-xs-6">
            <q-select
              use-input
              filled
              dense
              label="Tipo de servicio"
              input-debounce="0"
              option-label="name"
              option-value="id"
              v-model="typeOfService"
              :options="typeOfServices"
              :rules="[val => !!val || 'El campo es requerido.']"
              @filter="filterTypeOfServices"
            />
          </div>
          <div class="col-xl-3 col-lg-3 col-md-2 col-sm-6 col-xs-6">
            <q-select
              filled
              dense
              label="Moneda"
              option-label="name"
              option-value="id"
              v-model="coin"
              :options="coins"
              :rules="[val => !!val || 'El campo es requerido.']"
            />
          </div>
          <div class="col-xl-7 col-lg-7 col-md-7 col-sm-12 col-xs-12">
            <div class="row q-col-gutter-sm">
              <div class="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-xs-6">
                <q-input filled dense v-model="barcode" autofocus type="number" label="Código" @keypress.enter="getOnePorduct(this.barcode)">
                  <template v-slot:append>
                    <q-btn round color="teal" icon="qr_code" size="sm" @click="modelScan = true"/>
                  </template>
                </q-input>
              </div>
              <div class=" col-xl-6 col-lg-6 col-md-6 col-sm-6 col-xs-6 q-gutter-sm">
                <q-input v-model.number="amount" type="number" label="Cantidad" dense filled/>
              </div>
              <div class="col-xs-12 col-sm-12 col-md-12">
                <q-table
                  row-key="name"
                  title="Articulos"
                  dense
                  hide-pagination
                  :rows="products"
                  :columns="columns"
                  :loading="loadingPage"
                  :pagination="{ rowsPerPage: 0 }"
                >
                  <template v-slot:body="props">
                    <q-tr :props="props">
                      <q-td key="barcode" :props="props">
                        {{ props.row.barcode }}
                      </q-td>
                      <q-td key="name" :props="props">
                        {{ props.row.name }}
                      </q-td>
                      <q-td key="amount" :props="props">
                        {{ props.row.amount }}
                        <q-popup-edit v-model.number="props.row.amount" auto-save v-slot="scope" @update:model-value="calculate(props.row)">
                          <q-input label="Cantidad" type="number" v-model.number="scope.value" autofocus @keyup.enter="scope.set" />
                        </q-popup-edit>
                      </q-td>
                      <q-td key="price" :props="props">
                        {{ formatNumber(props.row.price) }}
                        <q-popup-edit v-model.number="props.row.price" auto-save v-slot="scope" @update:model-value="calculate(props.row)">
                          <q-input label="Precio" type="number" v-model.number="scope.value" autofocus @keyup.enter="scope.set" />
                        </q-popup-edit>
                      </q-td>
                      <q-td key="subtotal" :props="props">
                        {{ formatNumber(props.row.subtotal) }}
                      </q-td>
                      <q-td key="actions" :props="props">
                        <q-btn icon="delete" size="xs" color="negative" @click="deleteProduct(props)"/>
                      </q-td>
                    </q-tr>
                  </template>
                </q-table>
              </div>
            </div>
          </div>
          <div class="col-xl-5 col-lg-5 col-md-5 col-sm-12 col-xs-12">
            <div class="row full-width q-col-gutter-sm row">
              <div class="col-6">
                <q-select
                  use-input
                  filled
                  dense
                  clearable
                  label="Categorías"
                  input-debounce="0"
                  option-label="name"
                  option-value="id"
                  v-model="category"
                  :options="categories"
                  @filter="filterCategories"
                />
              </div>
              <div class="col-6">
                <q-input filled dense debounce="300" v-model="filter" placeholder="Buscar">
                  <template v-slot:append>
                    <q-icon name="search" />
                  </template>
                </q-input>
              </div>
            </div>
            <div class="col-12">
              <q-table
                row-key="name"
                no-data-label="Registro no encontrado"
                binary-state-sort
                grid
                hide-pagination
                :columns="columns"
                :rows="allProducts"
                :filter="filter"
                v-model:pagination="pagination"
                @request="setPagination"
              >
                <template v-slot:loading>
                  <q-inner-loading showing color="primary" />
                </template>
                <template v-slot:item="props">
                  <div class="q-pa-xs col-xs-12 col-sm-6 col-md-4">
                    <q-card class="my-card cursor-pointer">
                      <q-img style="height: 150px; width: 100" :src="props.row.images[0] ? props.row.images[0].url : 'https://cdn.quasar.dev/img/image-src.png'" @click="validateProduct(props.row)">
                        <div class="absolute-full text-subtitle2 flex flex-center">
                          {{ props.row.name }}
                        </div>
                      </q-img>
                    </q-card>
                  </div>
                </template>
              </q-table>
            </div>
            <div class="col-12 q-pa-lg flex flex-center">
              <q-pagination
                direction-links
                boundary-links
                icon-first="skip_previous"
                icon-last="skip_next"
                icon-prev="fast_rewind"
                icon-next="fast_forward"
                :max-pages="5"
                :ellipses="false"
                :boundary-numbers="false"
                v-model="pagination.rowsPerPage"
                :max="maxProducts"
                @update:model-value="updatePage"
              />
            </div>
            <div class="col-12 q-gutter-sm text-right">
              <q-btn
                color="secondary"
                icon="attach_money"
                @click="dialogPayment = true"
              >
                <q-badge floating color="negative">
                  {{ payments.length }}
                </q-badge>
                <q-tooltip>
                  Agregar pagos
                </q-tooltip>
              </q-btn>
              <q-btn
                icon="print"
                color="orange"
                @click="submitBill"
              >
                <q-tooltip>
                  Guardar e imprimir
                </q-tooltip>
              </q-btn>
              <q-btn
                icon="save"
                color="primary"
                @click="submitBill"
              >
                <q-tooltip>
                  Guardar
                </q-tooltip>
              </q-btn>
            </div>
          </div>
        </div>
      </q-form>
    </q-card>
    <q-dialog v-model="dialogPayment">
      <q-card style="width: 700px; max-width: 80vw;">
        <q-card-section class="row q-col-gutter-md">
          <div class="col-3 q-gutter-xs">
            <q-btn
              color="secondary"
              size="17px"
              style="width: 100%"
              :label="paymentMethod.name"
              v-for="paymentMethod in paymentMethods" :key="paymentMethod.id"
              @click="addPayment(paymentMethod)"
            />
          </div>
          <div class="col-9">
            <q-markup-table>
              <thead>
                <th colspan="4">Desglose de pago</th>
              </thead>
              <thead>
                <tr>
                  <th class="text-left">Metodo de pago</th>
                  <th class="text-left">Referencia</th>
                  <th class="text-right">Monto</th>
                  <th class="text-right">Aciones</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(payment, index) in payments" :key="payment.id">
                  <td class="text-left">{{ payment.name }}</td>
                  <td class="text-left">
                    <span v-if="payment.reference"> {{ payment.reference }}</span>
                    <span v-else>-</span>
                    <q-popup-edit
                      v-model="payment.reference"
                      auto-save
                      v-slot="scope"
                    >
                      <q-input
                        v-model="scope.value"
                        autofocus
                        @keyup.enter="scope.set"
                      />
                    </q-popup-edit>
                  </td>
                  <td class="text-right">
                    {{ formatNumber(payment.amount) }}
                    <q-popup-edit
                      v-model.number="payment.amount"
                      auto-save
                      v-slot="scope"
                    >
                      <q-input
                        v-model="scope.value"
                        autofocus
                        @keyup.enter="scope.set"
                      />
                    </q-popup-edit>
                  </td>
                  <q-td class="text-right">
                    <q-btn
                      icon="delete"
                      size="xs"
                      color="negative"
                      @click="deletePayment(index)"
                    />
                  </q-td>
                </tr>
                <tr>
                  <th colspan="4">
                    Restante a pagar:
                    <span v-if="coin">{{ coin.symbol }}</span>{{ formatNumber(pendingPayment) }}
                  </th>
                </tr>
              </tbody>
            </q-markup-table>
          </div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn
            label="Guardar y cerrar"
            color="primary"
            @click="submitBill"
          />
          <q-btn
            label="Guardar e imprimir factura"
            @click="submitBill"
            color="secondary"
          />
          <q-btn
            label="Cancelar"
            @click="cancelPayment"
            color="negative"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="openAddClient" persistent :maximized="$q.screen.lt.sm">
      <q-card :style="$q.screen.lt.sm ? '': 'width: 700px; max-width: 80vw;'">
        <q-bar class="text-white bg-primary q-pa-lg">
          Agregar cliente
          <q-space />
          <q-btn dense flat icon="close" v-close-popup>
            <q-tooltip class="bg-white text-primary">Close</q-tooltip>
          </q-btn>
        </q-bar>
        <q-form @submit="saveClient">
          <q-card-section class="row q-col-gutter-sm">
            <div class="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-xs-12 q-mb-sm">
              <q-option-group
                type="radio"
                inline
                autofocus
                dense
                v-model="documentType"
                :options="documentTypes"
              />
            </div>
            <div class="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-xs-12">
              <q-input
                :rules="[val => !!val || 'El campo es requerido.']"
                filled
                dense
                v-model="clientAdded.document_number"
                label="Número de documento"
              />
            </div>
            <div class="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-xs-12">
              <q-input
                filled
                dense
                v-model="clientAdded.name"
                label="Nombre"
                :rules="[val => !!val || 'El campo es requerido.']"
              />
            </div>
            <div class="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-xs-12">
              <q-input
                filled
                dense
                v-model="clientAdded.phone_number"
                label="Numero de telefono"
                :rules="[val => !!val || 'El campo es requerido.']"
              />
            </div>
            <div class="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-xs-12">
              <q-input
                filled
                dense
                v-model="clientAdded.email"
                label="Correo electronico"
                :rules="[val => !!val || 'El campo es requerido.']"
              />
            </div>
            <div class="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-xs-12">
              <q-input
                filled
                dense
                v-model="clientAdded.address"
                type="textarea"
                label="Dirección"
              />
            </div>
          </q-card-section>
          <q-card-actions align="right" class="text-primary">
            <q-btn color="orange" label="Cancelar" @click="(openAddClient = false)" />
            <q-btn color="primary" label="Agregar" type="submit"/>
          </q-card-actions>
        </q-form>
      </q-card>
    </q-dialog>
    <!-- <div id="printMe" v-show="false">
      <invoice-print :data="invoice" v-if="invoice"/>
    </div> -->
  </q-page>
</template>

<script>
// import { StreamBarcodeReader } from 'vue-barcode-reader'
import { Notify } from 'quasar'
// import { DraggableResizableVue, DraggableResizableContainer } from 'draggable-resizable-vue3'
// import InvoicePrint from '../components/InvoicePrint.vue'
// import BillOfSale from '../components/BillOfSale.vue'
export default {
  // name: 'PageName',
  components: {
    // StreamBarcodeReader
    // BillOfSale
  },
  data () {
    return {
      barcode: null,
      current: 3,
      docuemntTypeAll: [],
      documentType: null,
      invoiceTaxes: [],
      openAddClient: false,
      amount: 1,
      taxeTranslate: {
        percentage: '%'
      },
      params: {
        paginate: true,
        sortBy: 'id',
        sortOrder: 'desc',
        perPage: 9,
        dataSearch: {
          barcode: '',
          name: ''
        }
      },
      clientAdded: {},
      taxes: [],
      taxe: null,
      category: null,
      typeOfService: null,
      typeOfServices: [],
      payments: [],
      paymentMethods: [],
      dialogPayment: false,
      invoiceTypes: [],
      invoiceType: null,
      coins: [],
      coin: null,
      clients: [],
      client: null,
      exchange: false,
      exchangeRate: 0,
      /**
       * Pagination option
       * @type {Objct}
       */
      pagination: {
        rowsPerPage: 1,
        rowsNumber: 9,
        paginate: true,
        sortBy: 'id',
        sortOrder: 'desc'
      },
      thumbStyle: {
        right: '4px',
        borderRadius: '5px',
        backgroundColor: '#027be3',
        width: '5px',
        opacity: 0.75
      },
      barStyle: {
        right: '2px',
        borderRadius: '9px',
        backgroundColor: '#027be3',
        width: '9px',
        opacity: 0.2
      },
      filter: '',
      products: [],
      loadingPage: false,
      totalBill: 0,
      allProducts: [],
      categories: [],
      userSession: {},
      productColumns: [
        {
          name: 'barcode',
          align: 'left',
          label: 'Código',
          field: 'barcode',
          sortable: true
        },
        {
          name: 'name',
          required: true,
          label: 'Descripcion',
          align: 'left',
          field: row => row.name,
          sortable: true
        },
        {
          name: 'category',
          align: 'right',
          label: 'Categoría',
          field: row => row.category.name,
          sortable: true
        },
        {
          name: 'price',
          align: 'right',
          label: 'Precio',
          field: 'price',
          sortable: true
        }
      ],
      columns: [
        { name: 'barcode', align: 'left', label: 'Código', field: 'barcode', sortable: true },
        {
          name: 'name',
          required: true,
          label: 'Descripcion',
          align: 'left',
          field: row => row.name,
          sortable: true
        },
        { name: 'amount', align: 'right', label: 'Cantidad', field: 'amount', sortable: true },
        { name: 'price', align: 'right', label: 'Precio', field: 'price', sortable: true },
        { name: 'subtotal', align: 'right', label: 'Subtotal', field: 'subtotal', sortable: true },
        { name: 'actions', align: 'right', label: 'Acciones', field: 'actions' }
      ]
    }
  },
  computed: {
    documentTypes () {
      return this.docuemntTypeAll.map(documentType => {
        return {
          label: documentType.short_name,
          value: documentType.id
        }
      })
    },
    maxProducts () {
      return Math.ceil(this.params.rowsNumber / this.params.perPage)
    },
    pendingPayment () {
      return this.totalBill - this.totalPayment
    },
    totalPayment () {
      let totalPayment = 0
      this.payments.forEach((payment) => {
        totalPayment = totalPayment + payment.amount
      })
      return totalPayment
    }
  },
  watch: {
    filter (data) {
      this.searchData(data)
    },
    category (data) {
      this.params.dataFilter = {
        category_id: data ? data.id : null
      }
      this.getAllPorducts(this.params)
    },
    documentType (val) {
      this.clientAdded.document_type_id = val
    },
    payments (data) {
      localStorage.setItem('payments', JSON.stringify(data))
    },
    coin (data) {
      this.taxeTranslate.amount = data.symbol
    },
    client (data) {
      localStorage.setItem('client', JSON.stringify(data))
    },
    invoiceType (data) {
      localStorage.setItem('invoiceType', JSON.stringify(data))
    },
    typeOfService (data) {
      localStorage.setItem('typeOfService', JSON.stringify(data))
    },
    products (data) {
      localStorage.setItem('products', JSON.stringify(data))
    }
  },
  created () {
    this.getLocalStorage()
  },
  methods: {
    updatePage (data) {
      this.params.page = data
      this.getAllPorducts(this.params)
    },
    setPagination (data) {
      this.params.sortOrder = data.pagination.descending ? 'asc' : 'desc'
      this.params.page = data.pagination.page
      this.params.sortBy = data.pagination.sortBy ?? this.params.sortBy
      this.params.perPage = data.pagination.rowsNumber
      this.pagination = data.pagination
      this.getAllPorducts(this.params)
    },
    searchData (data) {
      for (const dataSearch in this.params.dataSearch) {
        this.params.dataSearch[dataSearch] = data
      }
      this.params.page = 1
      this.getAllPorducts(this.params)
    },
    /**
     * Save clients
     */
    saveClient () {
      this.visible = true
      this.$api.post('clients', this.clientAdded)
        .then(({ data }) => {
          this.openAddClient = false
          this.visible = false
          this.clientAdded = {}
          this.client = data
          Notify.create({
            message: 'Cliente creado exitosamente',
            icon: 'check_circle',
            color: 'positive'
          })
        })
        .catch(err => {
          this.visible = false
          Notify.create({
            message: err.message,
            icon: 'warning',
            color: 'negative'
          })
        })
    },
    /**
     * Submit bill
     */
    submitBill () {
      this.$refs.saveBill.submit()
    },
    /**
     * Cancelar payment
     */
    cancelPayment () {
      this.dialogPayment = false
      this.payments = []
    },
    /**
     * Format number
     */
    formatNumber (data) {
      return data.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    },
    /**
     * Add bill payment
     * @param {Object} data data payments
     */
    addPayment (data) {
      this.payments.push({
        name: data.name,
        amount: this.pendingPayment,
        reference: null,
        coin_id: this.coin.id,
        payment_method_id: data.id,
        user_created_id: this.userSession.id
      })
      localStorage.setItem('payments', JSON.stringify(this.payments))
    },
    /**
     * Get all payment-methods
     */
    getPaymentMethods () {
      this.$api.get('payment-methods')
        .then(({ data }) => {
          this.paymentMethods = data
        })
        .catch(err => {
          Notify.create({
            message: err.message,
            icon: 'warning',
            color: 'negative'
          })
        })
    },
    /**
     * Get all payment-methods
     */
    getDocuemntTypes () {
      this.$api.get('document-types')
        .then(({ data }) => {
          this.docuemntTypeAll = data
        })
        .catch(err => {
          Notify.create({
            message: err.message,
            icon: 'warning',
            color: 'negative'
          })
        })
    },
    /**
     * Select category
     * @param {String} value Value filter
     * @param {Callback} update update options
     */
    filterInvoiceTypes (value, update) {
      this.$api.get('invoice-types', {
        params: {
          dataSearch: {
            name: value
          }
        }
      })
        .then(({ data }) => {
          update(() => {
            this.invoiceTypes = data
          })
        })
        .catch(err => {
          Notify.create({
            message: err.message,
            icon: 'warning',
            color: 'negative'
          })
        })
    },
    /**
     * Select category
     * @param {String} value Value filter
     * @param {Callback} update update options
     */
    filterTypeOfServices (value, update) {
      this.$api.get('type-of-services', {
        params: {
          dataSearch: {
            name: value
          }
        }
      })
        .then(({ data }) => {
          update(() => {
            this.typeOfServices = data
          })
        })
        .catch(err => {
          Notify.create({
            message: err.message,
            icon: 'warning',
            color: 'negative'
          })
        })
    },
    /**
     * Select category
     * @param {String} value Value filter
     * @param {Callback} update update options
     */
    filterCategories (value, update) {
      this.$api.get('categories', {
        params: {
          dataSearch: {
            name: value
          }
        }
      })
        .then(({ data }) => {
          update(() => {
            this.categories = data
          })
        })
        .catch(err => {
          Notify.create({
            message: err.message,
            icon: 'warning',
            color: 'negative'
          })
        })
    },
    /**
     * Select category
     * @param {String} value Value filter
     * @param {Callback} update update options
     */
    getCoins () {
      this.$api.get('coins', {
        params: {
          sortBy: 'id',
          sortOrder: 'desc'
        }
      })
        .then(({ data }) => {
          this.coins = data
          this.coin = data[0]
        })
        .catch(err => {
          Notify.create({
            message: err.message,
            icon: 'warning',
            color: 'negative'
          })
        })
    },
    /**
     * Select category
     * @param {String} valueuserSession Value filter
     * @param {Callback} update update options
     */
    filterClients (value, update) {
      this.$api.get('clients', {
        params: {
          sortBy: 'id',
          sortOrder: 'desc',
          dataSearch: {
            name: value,
            document_number: value
          }
        }
      })
        .then(({ data }) => {
          update(() => {
            this.clients = data
          })
        })
        .catch(err => {
          Notify.create({
            message: err.message,
            icon: 'warning',
            color: 'negative'
          })
        })
    },
    /**
     * Get all tables
     */
    getAllPorducts (params = this.params) {
      this.$api.get('products', { params })
        .then(({ data }) => {
          this.allProducts = data.data
          this.params.rowsNumber = data.total
        })
        .catch(err => {
          Notify.create({
            message: err.message,
            icon: 'warning',
            color: 'negative'
          })
        })
    },
    /**
     * Clear invoice
     */
    clear () {
      this.payments = []
      this.products = []
      this.client = null
      this.products = []
      this.dialogPayment = false
      this.calculateTotal()
      setTimeout(() => {
        this.$refs.saveBill.resetValidation()
      }, 100)
    },
    /**
     * Print invoice
     * @param {Object} data invoice saved
     */
    printBill (data) {
      this.invoice = data
      setTimeout(() => {
        this.$htmlToPaper('printMe', {
          styles: [
            'src/css/styleInvoice.css'
          ]
        })
      })
    },
    /**
     * Save bill and payments
     */
    async saveBill () {
      this.$api.post('invoices', {
        client_id: this.client?.id,
        seller_id: this.userSession?.id,
        coin_id: this.coin?.id,
        invoice_taxes: this.invoiceTaxes,
        invoice_type_id: this.invoiceType?.id,
        type_of_service_id: this.typeOfService?.id,
        user_created_id: this.userSession?.id,
        exchange_rate: this.exchangeRate,
        products: this.products,
        payments: this.payments
      })
        .then(({ data }) => {
          this.clear()
          // this.printBill(data.data)
          this.dialogPayment = false
          this.$q.notify({
            message: 'Factura creada exitosamente',
            icon: 'check_circle',
            color: 'positive'
          })
        })
        .catch(err => {
          this.$q.notify({
            message: err.message,
            icon: 'warning',
            color: 'negative'
          })
        })
    },
    /**
     * Get local storage
     */
    getLocalStorage () {
      this.userSession = JSON.parse(localStorage.getItem('user'))
      this.products = JSON.parse(localStorage.getItem('products')) ?? []
      this.payments = JSON.parse(localStorage.getItem('payments')) ?? []
      this.client = JSON.parse(localStorage.getItem('client')) ?? null
      this.invoiceType = JSON.parse(localStorage.getItem('invoiceType')) ?? null
      this.typeOfService = JSON.parse(localStorage.getItem('typeOfService')) ?? null
      this.getCoins()
      this.getPaymentMethods()
      this.getDocuemntTypes()
      this.setPagination({ pagination: this.pagination, filter: undefined })
      this.calculateTotal()
    },
    /**
     * Delete product in table
     * @param {Object} product props table products
     */
    deleteProduct (product) {
      this.products.splice(product.rowIndex, 1)
      localStorage.setItem('products', JSON.stringify(this.products))
      this.calculateTotal()
    },
    /**
     * Delete invoice payment
     * @param {Number} index value index payments
     */
    deletePayment (index) {
      this.payments.splice(index, 1)
    },
    /**
     * Calculate the total
     */
    calculateTotal () {
      let total = 0
      this.products.forEach(product => {
        total += product.subtotal
      })
      this.totalBill = total
    },
    /**
     * Calculate the total and subtotal
     * @param {Object} data props products
     */
    calculate (data) {
      data.subtotal = data.price * data.amount
      this.calculateTotal()
    },
    /**
     * Validate products
     * @param {*} data product selected
     */
    validateProduct (data) {
      const findProduct = this.products.find(product => product.id === data.id)
      if (findProduct) {
        findProduct.amount += this.amount
        findProduct.product_id = findProduct.id
        this.calculate(findProduct)
      } else {
        data.amount = this.amount
        data.subtotal = 0
        data.product_id = data.id
        this.products.push(data)
        this.calculate(data)
      }
      this.amount = 1
      localStorage.setItem('products', JSON.stringify(this.products))
    },
    /**
     * Get one product
     * @param {Number} barcode barcode product
     */
    async getOnePorduct (barcode = this.barcode) {
      this.$api.get('products', {
        params: {
          dataEqualFilter: {
            barcode: this.barcode
          }
        }
      })
        .then(({ data }) => {
          const product = data[0]
          if (product) {
            this.validateProduct(product)
            this.barcode = null
            this.modelScan = false
          } else {
            this.$q.notify({
              message: 'Producto no encontrado',
              icon: 'warning',
              color: 'negative'
            })
          }
        })
        .catch((error) => {
          this.$q.notify({
            message: error.message,
            icon: 'warning',
            color: 'negative'
          })
        })
    }
  }
}
</script>
<style>
.container {
  width: 100%;
  height: 86vh;
  border: 1px solid black;
}

.element-one {
  color: white;
}
</style>
