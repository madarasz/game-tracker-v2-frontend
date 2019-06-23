<template>
    <div>
        <!-- Button -->
        <v-btn icon dark flat @click="displayDialog()" name="button-add-session">
            <v-icon>add</v-icon>
        </v-btn>
        <!-- Dialog -->
        <v-dialog v-model="showDialog" width="500" name="dialog-add-session">
            <v-toolbar color="green" dark>
                <v-toolbar-title>Add Session</v-toolbar-title>
            </v-toolbar>
            <v-card>
                <!-- Form -->
                <v-card-text>
                    <v-form>
                        <v-text-field v-model="place" label="Place"/>
                        <v-textarea/>
                    </v-form>
                </v-card-text>
                <!-- Action buttons -->
                <v-card-actions>
                    <v-btn flat @click="showDialog = false" name="button-dialog-cancel">Cancel</v-btn>
                    <v-spacer></v-spacer>
                    <v-btn flat @click="addSession()" class="green" dark name="button-dialog-add">Add Session</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
    name: 'AddSessionDialog',
    data () {
        return {
            showDialog: false,
            place: ''
        }
    },
    methods: {
        addSession: function() {

        },
        displayDialog: function() {
            this.showDialog = true;
        }
    },
    computed: {
        ...mapState(['game']),
    }
}
</script>