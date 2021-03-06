<template>
    <v-flex xs12>
        <!-- Header -->
        <v-toolbar color="green" dark dense v-if="session.currentSession != null">
            <v-toolbar-title>
                <v-icon>details</v-icon>
                <span class="subheading">Session details</span> 
            </v-toolbar-title>
            <v-spacer></v-spacer>
            <!-- Buttons -->
            <div v-if="session.editingSession">
                <v-btn @click="stopEdit()" class="hidden-xs-only" dark flat name="button-stop-edit-session">
                    Cancel
                </v-btn>
                <v-btn @click="stopEdit()" class="hidden-sm-and-up" dark flat icon name="button-stop-edit-session2">
                    <v-icon>close</v-icon>
                </v-btn>
            </div>
            <div v-if="session.editingSession && session.isNewSession">
                <v-btn @click="saveSession()" class="white hidden-xs-only" color="green" dark flat name="button-save-session">
                    Save
                </v-btn>
                <v-btn @click="saveSession()" class="white hidden-sm-and-up" color="green" dark flat icon name="button-save-session2">
                    <v-icon>save</v-icon>
                </v-btn>
            </div>
            <div v-if="session.editingSession && !session.isNewSession">
                <v-btn @click="updateSession()" class="white hidden-xs-only" color="green" dark flat name="button-update-session">
                    Update
                </v-btn>
                <v-btn @click="updateSession()" class="white hidden-sm-and-up" color="green" dark flat icon name="button-update-session2">
                    <v-icon>save</v-icon>
                </v-btn>
            </div>
            <div v-if="(!session.editingSession) && canEditSession">
                <confirm-button dark flat icon buttonIcon="delete" iconColor="green" class="white btn-small" name="button-delete-session"
                    question="Do you want to delete the session?" :callback="function(){deleteSession()}"/>
                <v-btn @click="editSession()" dark flat icon name="button-edit-session" class="white btn-small" color="green">
                    <v-icon>edit</v-icon>
                </v-btn>
            </div>
        </v-toolbar>
        <v-card v-if="session.currentSession != null" class="mb-3" name="card-session-details">
            <!-- Session Form -->
            <v-card-text>
                <v-form>
                    <v-layout row wrap>
                        <!-- Created by -->
                        <v-flex xs12 sm6 mb-2 v-if="!session.editingSession">
                            <span class="form-label">last updated by:</span>
                            <span class="subheading">
                                <user-with-avatar :user="session.currentSession.creator" inline/>
                            </span>
                        </v-flex>
                        <!-- Season -->
                        <v-flex xs12 sm6 mb-2 v-if="!session.editingSession" class="text-xs-right">
                            <span class="form-label">season:</span>
                            <span class="subheading" v-if="seasonTitle != null">{{ seasonTitle }}</span>
                            <em class="subheading" v-if="seasonTitle == null">without season</em>
                        </v-flex>
                        <!-- Place -->
                        <v-flex xs12 sm6 mb-2>
                            <v-layout row>
                                <v-flex shrink>
                                    <span class="form-label">place:</span>
                                </v-flex>
                                <v-flex grow>
                                    <span v-if="!session.editingSession" class="subheading" name="value-place">{{ session.currentSession.place }}</span>
                                    <v-text-field v-model="session.currentSession.place" v-if="session.editingSession" class="form-input" name="input-place"/>
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
                                <span v-if="!session.editingSession" class="font-weight-regular" name="value-notes">{{ session.currentSession.notes }}</span>
                            </div>
                            <v-textarea outline auto-grow rows="3" v-if="session.editingSession" v-model="session.currentSession.notes" name="input-notes"/>
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
            <session-images/>
        </v-card>
    </v-flex>
</template>
<script>
import ConfirmButton from '@/components/ConfirmButton';
import SessionImages from '@/components/game-details/SessionImages';
import UserWithAvatar from '@/components/UserWithAvatar';
import { mapState } from 'vuex';

export default {
    name: 'SessionDetailsCard',
    components: {
        ConfirmButton, SessionImages, UserWithAvatar
    },
    props: {
    },
    data () {
        return {
            sessionDateDialog: false, 
        }
    },
    computed: {
        ...mapState(['game', 'groups', 'session']),
        canEditSession() {
            return this.$store.getters['session/canUserEditSession'];
        },
        seasonTitle() {
            if (this.game.details === undefined || this.session.currentSession === undefined) return null;
            const _season = this.game.details.seasons.find((x) => { return x.id == this.session.currentSession.season_id });
            if (_season === undefined) return null;
            return _season.title;
        }
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
        deleteSession() {
            this.$store.dispatch('session/deleteSession').then(() => {
                this.$store.commit('toaster/showConfirm', 'Session deleted');
                this.reloadGameDetails();
            }).catch(() => {
                this.$store.commit('toaster/showError', 'Could not delete session');
            });
        },
        editSession() {
            this.$store.commit('session/editSession');
        },
        stopEdit() {
            // TODO: confirmation dialog about discarding edits
            if (this.session.isNewSession) {
                this.$store.commit('session/clearSession');
            } else {
                this.$store.commit('session/stopEditingSession');
            }
        },
        reloadGameDetails() {
            this.$store.dispatch('game/getGameDetails').catch(() => {
                this.$store.commit('toaster/showError', 'Could not update game details');
            })  
        }
    }
}
</script>