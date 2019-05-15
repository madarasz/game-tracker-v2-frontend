<template>
    <v-snackbar v-model="toaster.showToaster" :color="toaster.color" :timeout="toaster.timeout" right bottom>
        {{ toaster.text }}
        <v-btn flat @click="toaster.showToaster = false" v-if="toaster.showCloseButton">
            Close
        </v-btn>
    </v-snackbar>
</template>

<script>

import { mapState } from 'vuex';

export default {
    name: 'Toaster',
    computed: {
        ...mapState(['toaster'])
    },
}
</script>