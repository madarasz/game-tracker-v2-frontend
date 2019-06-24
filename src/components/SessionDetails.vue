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
            <div v-if="session.editingSession && session.isNewSession">
                <v-btn @click="saveSession()" class="white hidden-xs-only" color="green" dark flat name="button-save-session">
                    Save
                </v-btn>
                <v-btn @click="saveSession()" class="white hidden-sm-and-up" color="green" dark flat icon name="button-save-session">
                    <v-icon>save</v-icon>
                </v-btn>
            </div>
            <div v-if="session.editingSession && !session.isNewSession">
                <v-btn @click="updateSession()" class="white hidden-xs-only" color="green" dark flat name="button-save-session">
                    Update
                </v-btn>
                <v-btn @click="updateSession()" class="white hidden-sm-and-up" color="green" dark flat icon name="button-save-session">
                    <v-icon>save</v-icon>
                </v-btn>
            </div>
            <v-btn v-if="!session.editingSession" @click="editSession()" dark flat icon name="button-edit-session">
                    <v-icon>edit</v-icon>
            </v-btn>
        </v-toolbar>
        <v-card v-if="session.currentSession != null" class="mb-3">
            <!-- Session Form -->
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
                                    <span v-if="!session.editingSession" class="subheading">{{ session.currentSession.place }}</span>
                                    <v-text-field v-model="session.currentSession.place" v-if="session.editingSession" class="form-input"/>
                                </v-flex>
                            </v-layout>
                        </v-flex>
                        <!-- Date -->
                        <v-flex xs12 sm6 mb-2>
                            <v-layout row>
                                <v-flex grow class="text-sm-right">
                                    <span class="form-label">date:</span>
                                </v-flex>
                                <v-flex shrink>
                                    <span v-if="!session.editingSession" class="subheading">{{ session.currentSession.date }}</span>
                                    <v-menu  v-if="session.editingSession"  v-model="sessionDateDialog" :close-on-content-click="false" lazy
                                        transition="scale-transition" full-width min-width="290px">
                                        <template v-slot:activator="{ on }">
                                            <v-text-field v-model="session.currentSession.date" readonly v-on="on" 
                                                class="form-input" prepend-inner-icon="calendar_today" reverse style="max-width: 130px"/>
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
                                <span v-if="!session.editingSession" class="font-weight-regular">{{ session.currentSession.notes }}</span>
                            </div>
                            <v-textarea outline auto-grow rows="3" v-if="session.editingSession" v-model="session.currentSession.notes"/>
                        </v-flex>
                    </v-layout>
                </v-form>
            </v-card-text>
            <v-divider/>
            <!-- Players -->
            <v-card-text>
                TODO: players
            </v-card-text>
            <v-divider/>
            <!-- Images -->
            <v-card-text>
                TODO: images
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
            sessionDateDialog: false, 
        }
    },
    computed: {
        ...mapState(['game', 'groups', 'session'])
    },
    methods: {
        saveSession() {
            this.$store.dispatch('session/saveSession').then(() => {
                this.$store.commit('toaster/showConfirm', 'Session saved');
                this.reloadGameDetails();
            }).catch(() => {
                this.$store.commit('toaster/showError', 'Could not save session');
            });
        },
        updateSession() {
            this.$store.dispatch('session/updateSession').then(() => {
                this.$store.commit('toaster/showConfirm', 'Session updated');
                this.reloadGameDetails();
            }).catch(() => {
                this.$store.commit('toaster/showError', 'Could not update session');
            });
        },
        editSession() {
            this.$store.commit('session/editSession');
        },
        reloadGameDetails() {
            this.$store.dispatch('game/getGameDetails', { gameId: this.game.details.id, groupId: this.groups.selectedGroup.id }).catch(() => {
                this.$store.commit('toaster/showError', 'Could not update game details');
            })  
        }
    }
}
</script>