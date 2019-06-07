<template>
    <v-layout wrap row>
        <!-- Games -->
        <v-flex xs12 md8 v-if="groupDetailsLoaded" class="pa-2">
            <v-toolbar color="green" dark dense>
                <v-toolbar-title>
                    <span class="subheading">Games</span>       
                </v-toolbar-title>
                <v-spacer></v-spacer>
                <add-game-dialog v-if="isGroupMember"/>
            </v-toolbar>
            <v-card name="card-games">
                <v-card-text>
                </v-card-text>
            </v-card>
        </v-flex>
        <v-flex xs12 md4>
            <!-- Settings -->
            <div class="ma-2" v-if="isGroupAdmin">
                <v-toolbar color="orange" dark dense>
                    <v-toolbar-title>
                        <span class="subheading">Settings</span>       
                    </v-toolbar-title>
                </v-toolbar>
                <v-card name="card-group-settings">
                </v-card>
            </div>
            <!-- Members -->
            <div v-if="groupDetailsLoaded" class="ma-2">
                <v-toolbar color="green" dark dense>
                    <v-toolbar-title>
                        <span class="subheading">Members</span>       
                    </v-toolbar-title>
                </v-toolbar>
                <v-card name="card-members">
                    <v-list v-if="groups.selectedGroup && groups.selectedGroup.members">
                        <template v-for="(member) in groups.selectedGroup.members">
                            <user-with-avatar :user="member" :key="member.id"/>
                        </template>
                    </v-list>
                </v-card>
            </div>
        </v-flex>
    </v-layout>
</template>

<script>
import UserWithAvatar from '@/components/UserWithAvatar';
import AddGameDialog from '@/components/AddGameDialog';
import { mapState } from 'vuex';

export default {
        components: {
            UserWithAvatar, AddGameDialog
        },
        data() {
            return {
                groupDetailsLoaded: false
            }
        },
        computed: {
            ...mapState(['login', 'groups']),
            isGroupAdmin: function() { // can be site admin as well
                return this.groups.selectedGroup && 
                    (this.login.isAdmin || this.$store.getters['groups/isUserGroupAdmin'](this.login.userId));
            },
            isGroupMember: function() { // can be site admin as well
                return this.groups.selectedGroup && 
                    (this.login.isAdmin || this.$store.getters['groups/isUserGroupMember'](this.login.userId));
            },
            imageFolder:function() {
                return process.env.VUE_APP_BACKEND_IMG_URL;
            }
        },
        mounted: function() {
            // load group details and set it as selected
            const pathParts = window.location.href.substr(window.location.href.indexOf('/',10))
                .split('/').filter((el) => { return el != ''});
            const groupId = parseInt(pathParts[1]);
            this.$store.dispatch('groups/getGroupDetails', {
                id: groupId
            }).then(() => {
                this.groupDetailsLoaded = true;
            }).catch(() => {
                this.$store.commit('toaster/showError', 'Unable to load group details');
            });
        },
        methods: {
        }
    }
</script>