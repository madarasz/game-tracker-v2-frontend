<template>
    <div>
        <v-btn icon dark flat @click="showDialog = true" name="button-add-game">
            <v-icon>add</v-icon>
        </v-btn>
        <v-dialog v-model="showDialog" width="500">
            <v-toolbar color="green" dark>
                <v-toolbar-title>Add Game</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-text-field dark v-model="search" append-icon="search" label="Search" single-line hide-details class="pa-0"/>
            </v-toolbar>

            <v-card>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
export default {
    name: 'LoginDialog',
    data () {
        return {
            showDialog: false,
            search: ''
        }
    },
    
}
</script>