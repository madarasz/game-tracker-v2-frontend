<template>
    <v-dialog v-model="login.dialogSettings" width="500">
        <v-card-title class="headline green lighten-2">
            User Settings
        </v-card-title>
        <v-card-text>
            <v-avatar color="green darken-4" size="32" class="mr-2">
                <v-icon>person</v-icon>
            </v-avatar>
            dfgd
        </v-card-text>
    </v-dialog>
</template>

<script>
import { mapState } from 'vuex';

export default {
    name: 'UserSettingsDialog',
    data () {
        return {

        }
    },
    computed: {
      ...mapState(['login'])
    }
}
</script>