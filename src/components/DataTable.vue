<template>
  <q-table
    row-key="name"
    binary-state-sort
    :title="title"
    :grid="grid"
    :dense="dense"
    :hide-pagination="hidePagination"
    :columns="columns"
    :rows="data"
    :loading="loading"
    :filter="filter"
    v-model:pagination="pagConfig"
    @row-click="onClick"
    @request="setPagination"
    no-data-label="Registro no encontrado"
  >
    <template v-slot:loading>
      <q-inner-loading showing color="primary" />
    </template>
    <template v-slot:item="props">
      <slot name="item" :props="props">
      </slot>
    </template>
    <!-- <template v-slot:top-right>
      <q-input filled dense debounce="500" v-model="filterWatch" placeholder="Buscar">
        <template v-slot:append>
          <q-icon name="search" />
        </template>
      </q-input>
    </template> -->
  </q-table>
</template>

<script>
export default {
  props: {
    title: {
      type: String
    },
    dense: {
      type: Boolean,
      default: false
    },
    grid: {
      type: Boolean,
      default: false
    },
    hidePagination: {
      type: Boolean,
      default: false
    },
    columns: {
      type: Array,
      require: true
    },
    filter: {
      type: String,
      require: false
    },
    data: {
      type: Object,
      require: true
    },
    loading: {
      type: Boolean,
      default: false
    },
    pagination: {
      type: Object,
      default: () => {
        return {
          rowsPerPage: 20,
          rowsNumber: 20,
          paginate: true,
          descending: true,
          sortBy: 'id',
          sortOrder: 'desc'
        }
      }
    }
  },
  data () {
    return {
      pagConfig: {},
      params: {},
      filterWatch: null
    }
  },
  mounted () {
    this.setPagination({
      pagination: this.pagination,
      filter: undefined
    })
  },
  watch: {
    filter (data) {
      this.$emit('search', data)
    }
  },
  methods: {
    /**
     * Set data pagination emit event
     * @param  {Object} data value pagination
     */
    setPagination (data) {
      this.$emit('setPagination', data)
    },
    /**
     * View category
     */
    onClick (event, row, index) {
      this.$emit('onClick', row)
    }
  }
}
</script>
