<template>
  <q-page padding>
    <q-card class="my-card">
      <q-card-section class="q-pb-sm">
        <div class="row">
          <div class="col-12">
            <div class="row justify-between">
              <div class="col-auto">
                <p class="text-h5">
                  {{ $t('bill.billNew') }}
                </p>
              </div>
              <div class="col-xl-2 col-lg-2 col-md-4 col-sm-5 col-xs-6 q-pa-sm q-gutter-sm text-right">
                <q-btn
                  size="sm"
                  color="primary"
                  class="q-mt-sm"
                  icon="list"
                >
                  <q-tooltip
                    anchor="bottom middle"
                    transition-show="flip-right"
                    transition-hide="flip-left"
                    :offset="[10, 10]"
                    content-style="font-size: 13px"
                  >
                    {{ $t('bill.billList') }}
                  </q-tooltip>
                </q-btn>
                <!-- <q-btn
                  style="background: goldenrod; color: white"
                  class="q-mt-sm"
                  size="sm"
                  icon="attach_money"
                  @click="addEntryAndExitOfMoney = true"
                >
                  <q-tooltip
                    anchor="bottom middle"
                    transition-show="flip-right"
                    transition-hide="flip-left"
                    :offset="[10, 10]"
                    content-style="font-size: 13px"
                  >
                    {{ ucwords($t('bill.entryAndExitOfMoney')) }}
                  </q-tooltip>
                </q-btn> -->
                <!-- <q-btn
                  color="negative"
                  class="q-mt-sm"
                  size="sm"
                  icon="close"
                  @click="closeBoxCut = true">
                  <q-tooltip
                    anchor="bottom middle"
                    transition-show="flip-right"
                    transition-hide="flip-left"
                    :offset="[10, 10]"
                    content-style="font-size: 13px"
                  >
                    {{ ucwords($t('bill.closeBox')) }}
                  </q-tooltip>
                </q-btn> -->
              </div>
            </div>
          </div>
        </div>
      </q-card-section>
      <q-card-section class="q-pt-none">
        <div class="row justify-between q-col-gutter-sm">
          <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
            <q-select
              autocomplete="off"
              use-input
              hide-selected
              fill-input
              dense
              outlined
              clearable
              input-debounce="0"
              name="client"
              v-model="bill.client"
              :label="$t('bill.client')"
              :options="clients"
            >
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    No results
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
          </div>
          <div class="col-xs-12 col-sm-6 col-md-3 col-lg-2 col-xl-2">
            <q-select
              use-input
              hide-selected
              fill-input
              outlined
              clearable
              dense
              input-debounce="0"
              v-model="bill.billType"
              :label="$t('bill.billType')"
              :options="billTypes"
            >
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    No results
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
          </div>
          <div class="col-xs-12 col-sm-6 col-md-3 col-lg-2 col-xl-2">
            <q-select
              use-input
              hide-selected
              fill-input
              outlined
              clearable
              dense
              input-debounce="0"
              v-model="bill.voucherType"
              :label="$t('bill.voucherType')"
              :options="voucherTypes"
            >
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    No results
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
          </div>
          <div class="col-xs-12 col-sm-6 col-md-3 col-lg-2 col-xl-2">
            <q-input
              v-model="bill.date"
              outlined
              dense
              type="date"
            />
          </div>
        </div>
      </q-card-section>
      <!-- <q-card-section class="q-pt-md">
        <div class="row justify-between q-col-gutter-sm">
          <div class="col-xs-6 col-sm-6 col-md-3 col-lg-3 col-xl-3">
            <product-list
              label="articulo"
              value="id"
              autofocus
              ref="codigo"
              :data="products"
              @errorSearch="errorSearch"
              @selected="setTable"
              @showLists="getProducts"
            />
          </div>
          <div class="col-xs-6 col-sm-6 col-md-2 col-lg-2 col-xl-2">
            <q-input
              v-model="amount"
              outlined
              dense
              type="number"
              :label="ucwords($t('bill.amount'))"
            />
          </div>
          <div class="col-xs-6 col-sm-6 col-md-2 col-lg-2 col-xl-2">
            <q-input
              :label="ucwords($t('bill.stock'))"
              v-model="stock"
              outlined
              dense
              disable
            />
          </div>
          <div class="col-xs-6 col-sm-6 col-md-3 col-lg-3 col-xl-3">
            <q-input
              v-model="priceOfSale"
              outlined
              dense
              type="number"
              :label="ucwords($t('bill.priceOfSale'))"
            />
          </div>
        </div>
      </q-card-section> -->
      <q-card-section class="q-pt-none">
        <q-splitter
          v-model="splitterModel"
          separator-style="width: 0px"
          :horizontal="$q.screen.lt.sm"
        >
          <template v-slot:before>
            <div class="q-pa-xs">
              <q-table
                row-key="name"
                wrap-cells
                virtual-scroll
                :rows="billDetails"
                :columns="columns"
                :rows-per-page-options="[50]"
              >
                <template v-slot:body="props">
                  <q-tr :props="props">
                    <q-td>
                      <q-btn size="xs" color="negative" icon="close" @click="deleteProduct(props.row)"/>
                    </q-td>
                    <q-td key="articulo" :props="props">
                      {{ props.row.articulo }}
                    </q-td>
                    <q-td key="cantidad" :props="props">
                      {{ props.row.cantidad }}
                      <q-popup-edit v-model.number="props.row.cantidad">
                        <q-input type="number" v-model.number="props.row.cantidad" dense autofocus @input="recalculate(props.row)"/>
                      </q-popup-edit>
                    </q-td>
                    <q-td key="precio" :props="props">
                      {{ props.row.precio }}
                      <q-popup-edit v-model.number="props.row.precio">
                        <q-input type="number" v-model.number="props.row.precio" dense autofocus @input="recalculate(props.row)"/>
                      </q-popup-edit>
                    </q-td>
                    <q-td key="descuento" :props="props">
                      {{ props.row.descuento }}
                      <q-popup-edit v-model.number="props.row.descuento">
                        <q-input type="number" v-model.number="props.row.descuento" dense autofocus @input="recalculate(props.row)"/>
                      </q-popup-edit>
                    </q-td>
                    <q-td key="subtotal" :props="props">
                      {{ props.row.subtotal }}
                    </q-td>
                  </q-tr>
                </template>
              </q-table>
            </div>
          </template>
          <template v-slot:after>
            <div class="q-pa-xs">
              <q-card>
                <q-card-section style="background: goldenrod; color: white" class="q-pt-xs q-pb-xs">
                  <div class="text-h6 text-right">Total: {{ totalBill }} $</div>
                </q-card-section>
                <q-card-section class="q-pt-md q-pb-md">
                  <div class="row justify-between q-gutter-xs">
                    <div class="col-12">
                      <q-input
                        v-model.number="paidBill.debito"
                        outlined
                        dense
                        type="number"
                        label="Debito"
                      />
                    </div>
                    <div class="col-12">
                      <q-input
                        v-model.number="paidBill.credito"
                        outlined
                        dense
                        type="number"
                        :label="$t('bill.credit')"
                      />
                    </div>
                    <div class="col-5">
                      <q-input
                        v-model.number="paidBill.porcentaje"
                        outlined
                        dense
                        type="number"
                        :label="$t('bill.creditPercentage')"
                      />
                    </div>
                    <div class="col-12 q-mt-md">
                      <q-input
                        v-model.number="paidBill.efectivo"
                        outlined
                        dense
                        type="number"
                        name="efectivo"
                        :label="$t('bill.cash')"
                      />
                    </div>
                    <div class="col-5">
                      <q-btn class="full-width" color="negative" icon="close">
                        <q-tooltip
                          anchor="bottom middle"
                          transition-show="flip-right"
                          transition-hide="flip-left"
                          :offset="[10, 10]"
                          content-style="font-size: 13px"
                        >
                          {{ $t('bill.cancelBill') }}
                        </q-tooltip>
                      </q-btn>
                    </div>
                    <div class="col-5">
                      <q-btn
                        color="primary"
                        class="full-width"
                        icon="check"
                        @click="saveBill"
                      >
                        <q-tooltip
                          anchor="bottom middle"
                          transition-show="flip-right"
                          transition-hide="flip-left"
                          content-style="font-size: 13px"
                          :offset="[10, 10]"
                        >
                          {{ $t('bill.saveBill') }}
                        </q-tooltip>
                      </q-btn>
                    </div>
                  </div>
                </q-card-section>
              </q-card>
            </div>
          </template>
        </q-splitter>
      </q-card-section>
    </q-card>
    <q-inner-loading :showing="visible">
      <q-spinner-gears size="100px" color="primary"/>
    </q-inner-loading>
  </q-page>
</template>

<script>
import { ref } from 'vue'
export default {
  // name: 'PageName',
  setup () {
    /**
     * Client all
     * @type {Array}
     */
    const clients = ref([])
    /**
     * Splitter model
     * @type {Number}
     */
    const splitterModel = ref(60)
    /**
     * bill types all
     * @type {Array}
     */
    const billTypes = ref([])
    /**
     * Voucher types all
     * @type {Array}
     */
    const voucherTypes = ref([])
    /**
     * Bill details
     * @type {Array}
     */
    const billDetails = ref([])
    /**
     * bill
     * @type {Object}
     */
    const bill = ref({})
    /**
     * Paid bill
     * @type {Object}
     */
    const paidBill = ref({})
    /**
     * Total bill
     * @type {Object}
     */
    const totalBill = ref(0)
    /**
     * Loading page
     * @type {Object}
     */
    const visible = ref(false)

    /**
     * Columns Table
     * @type {Array} column array
     */
    const columns = [
      {
        name: 'Opciones',
        headerClasses: 'bg-primary text-white',
        classes: 'bg-grey-2 ellipsis',
        align: 'left',
        label: 'Opciones',
        field: 'opciones'
      },
      {
        name: 'articulo',
        align: 'left',
        headerClasses: 'bg-primary text-white',
        label: 'Artículos',
        field: 'articulo',
        sortable: true
      },
      {
        name: 'cantidad',
        label: 'Cantidad',
        field: 'cantidad',
        headerClasses: 'bg-primary text-white',
        sortable: true
      },
      {
        name: 'precio',
        label: 'Precio',
        field: 'precio',
        headerClasses: 'bg-primary text-white',
        sortable: true
      },
      {
        name: 'descuento',
        label: 'Descuento',
        field: 'descuento',
        headerClasses: 'bg-primary text-white',
        sortable: true
      },
      {
        name: 'subtotal',
        label: 'Subtotal',
        field: 'subtotal',
        headerClasses: 'bg-primary text-white',
        sortable: true
      }
    ]

    /**
     * Recalcute table subtotal
     */
    function recalculate (data) {
      billDetails.value.map(product => {
        if (product.id === data.id) {
          product.subtotal = (data.cantidad * data.precio) - data.descuento
        }
        return product
      })
      totalCalculate()
    }
    /**
     * Calculate bill total
     */
    function totalCalculate () {
      let total = 0
      this.dataProduct.forEach(element => {
        total = Number(total) + Number(element.subtotal)
      })
      totalBill.value = total
    }

    function deleteProduct (row) {
      console.log(row)
    }

    function saveBill () {
      console.log(bill)
    }

    return {
      clients,
      totalBill,
      bill,
      billTypes,
      billDetails,
      splitterModel,
      voucherTypes,
      columns,
      paidBill,
      saveBill,
      visible,
      deleteProduct,
      recalculate,
      totalCalculate
    }
  }
}
</script>
