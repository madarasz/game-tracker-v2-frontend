<template>
    <v-flex xs12>
        <!-- Header -->
        <v-toolbar color="green" dark dense v-if="session.currentSession != null">
            <v-toolbar-title>
                <v-icon class="mr-2">details</v-icon>
                <span class="subheading">Session Details</span> 
            </v-toolbar-title>
            <v-spacer></v-spacer>
            <!-- Buttons -->
            <div v-if="session.editing">
                <v-btn @click="saveSession" class="white hidden-xs-only" color="green" dark flat name="button-save-session">
                    Save
                </v-btn>
                <v-btn @click="saveSession" class="white hidden-sm-and-up" color="green" dark flat icon name="button-save-session">
                    <v-icon>save</v-icon>
                </v-btn>
            </div>
            <v-btn v-if="!session.editing" @click="$store.commit('session/editSession')" dark flat icon name="button-edit-session">
                    <v-icon>edit</v-icon>
            </v-btn>
        </v-toolbar>
        <v-card v-if="session.currentSession != null" class="mb-3">
            <v-card-text>
                <v-form>
                    <v-layout row wrap>
                        <!-- Place -->
                        <v-flex xs12 sm6 mb-2>
                            <v-layout row>
                                <v-flex shrink>
                                    <span class="form-label">place:</span>
                                </v-flex>
                                <v-flex grow>
                                    <span v-if="!session.editing" class="subheading">{{ session.currentSession.place }}</span>
                                    <v-text-field v-model="session.currentSession.place" v-if="session.editing" class="form-input"/>
                                </v-flex>
                            </v-layout>
                        </v-flex>
                        <!-- Date -->
                        <v-flex xs12 sm6 mb-2>
                            <v-layout row>
                                <v-flex grow>
                                    <span class="form-label">date:</span>
                                </v-flex>
                                <v-flex shrink>
                                    <span v-if="!session.editing" class="subheading">{{ session.currentSession.date }}</span>
                                    <v-menu  v-if="session.editing"  v-model="sessionDateDialog" :close-on-content-click="false" lazy
                                        transition="scale-transition" full-width min-width="290px">
                                        <template v-slot:activator="{ on }">
                                            <v-text-field v-model="session.currentSession.date" readonly v-on="on" 
                                                class="form-input" prepend-inner-icon="calendar_today"/>
                                        </template>
                                        <v-date-picker v-model="session.currentSession.date" @input="sessionDateDialog = false"></v-date-picker>
                                    </v-menu>
                                </v-flex>
                            </v-layout>
                        </v-flex>
                        <v-flex xs 12>
                            <!-- Notes -->
                            <div class="form-label">
                                notes:
                                <span v-if="!session.editing" class="font-weight-regular">{{ session.currentSession.notes }}</span>
                            </div>
                            <v-textarea outline auto-grow rows="3" v-if="session.editing" v-model="session.currentSession.notes"/>
                        </v-flex>
                    </v-layout>
                </v-form>
                <v-card-actions>
                    
                </v-card-actions>
                <v-divider/>
                <v-card-text>
                    TODO: players
                </v-card-text>
                <v-divider/>
                <v-card-text>
                    TODO: images
                </v-card-text>
            </v-card-text>
        </v-card>
    </v-flex>
</template>
<script>
import { mapState } from 'vuex';

export default {
    name: 'SessionDetails',
    props: {
    },
    data () {
        return {
            sessionDateDialog: false
        }
    },
    computed: {
        ...mapState(['session'])
    },
    methods: {
        saveSession() {
            this.$store.dispatch('session/saveSession');
        }
    }
}
</script>