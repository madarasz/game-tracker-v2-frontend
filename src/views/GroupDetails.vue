<template>
    <v-layout wrap row :align-center="!groupDetailsLoaded">
        <!-- Loading Spinner -->
        <v-flex v-if="!groupDetailsLoaded" class="text-xs-center">
            <v-progress-circular indeterminate color="green"/>
        </v-flex>
        <!-- Games -->
        <v-flex xs12 md8 pa-2 v-if="groupDetailsLoaded">
            <v-toolbar color="green" dark dense>
                <v-toolbar-title>
                    <v-icon>casino</v-icon>
                    <span class="subheading">Games</span>       
                </v-toolbar-title>
                <v-spacer></v-spacer>
                <add-game-dialog v-if="isGroupMember"/>
            </v-toolbar>
            <!-- Game list -->
            <v-card name="card-games">
                <v-list two-line>
                    <template v-for="game in groups.selectedGroup.games">
                        <v-list-tile :key="game.id" name="list-group-games" 
                            :to="`/group/${groups.selectedGroup.id}/${$store.getters['groups/urlGroupName']}/${game.id}/${urlFriendly(game.name)}`">
                            <!-- Game thumbnail -->
                            <v-list-tile-avatar tile size="64">
                                <img v-if="game.thumbnail" :src="game.thumbnail"/>
                            </v-list-tile-avatar>
                            <v-list-tile-content class="ml-2">
                                <!-- Game name -->
                                <v-list-tile-title>
                                    {{ game.name }}
                                </v-list-tile-title>
                                <!-- Other info -->
                                <v-list-tile-sub-title>
                                    <em class="caption">
                                        <span>{{ game.designers }}</span>
                                        <span v-if="game.year"> ({{ game.year }})</span>
                                    </em>
                                </v-list-tile-sub-title>
                            </v-list-tile-content>
                            <!-- Delete button -->
                            <v-list-tile-action v-if="isGroupMember">
                                <v-btn icon ripple name="button-delete-game">
                                    <v-icon color="grey darken-1" @click.prevent="deleteGame(game.id)">delete</v-icon>
                                </v-btn>
                            </v-list-tile-action>
                        </v-list-tile>
                    </template>
                </v-list>
            </v-card>
        </v-flex>
        <v-flex xs12 md4 pa-2 v-if="groupDetailsLoaded"> 
            <!-- Group details -->
            <div class="pb-3">
                <v-toolbar :color="editingGroup ? 'orange' : 'green'" dark dense>
                    <v-toolbar-title>
                        <v-icon>details</v-icon>
                        <span class="subheading">Group details</span>       
                    </v-toolbar-title>
                    <v-spacer/>
                    <div v-if="isGroupAdmin">
                        <v-btn color="green" class="white btn-small" icon dark flat @click="editingGroup = true" name="button-edit-group" v-if="!editingGroup">
                            <v-icon>edit</v-icon>
                        </v-btn>
                        <v-btn class="btn-small" icon dark flat @click="editingGroup = false" name="button-cancel-edit-group" v-if="editingGroup">
                            <v-icon>close</v-icon>
                        </v-btn>
                    </div>
                </v-toolbar>
                <v-card name="card-group-settings">
                    <v-card-text>
                        <v-list>
                            <v-list-tile>
                                <!-- Group avatar in hexagon -->
                                <v-list-tile-avatar size="80" tile style="margin-right: -15px">
                                    <div class="hexagon hexagon-big">
                                        <div class="hexagon-in1">
                                            <div class="hexagon-in2">
                                                <div style="height: 75px" class="blue" v-if="groups.selectedGroup.imageFile == null">
                                                    <v-icon size="48" name="placeholder-group" class="blue">group</v-icon>
                                                </div>
                                                <v-img v-if="groups.selectedGroup.imageFile" :src="imageFolder+groups.selectedGroup.imageFile" name="image-group"/>
                                            </div>
                                        </div>
                                    </div>
                                </v-list-tile-avatar>         
                                <!-- Details while not editing -->
                                <v-list-tile-content v-if="!editingGroup">
                                    <v-list-tile-title class="text-xs-center title">
                                        {{ groups.selectedGroup.name }}
                                    </v-list-tile-title>
                                    <v-list-tile-sub-title class="text-xs-center">
                                        {{ groups.selectedGroup.is_public ? 'public' : 'private' }} group
                                    </v-list-tile-sub-title>
                                </v-list-tile-content>
                                <!-- Upload / remove image -->
                                <v-list-tile-content v-if="editingGroup">
                                    <div>
                                        <image-uploader is-square @uploaded="updateGroupImage" buttonText="Upload" type="group" :parentid="groups.selectedGroup.id"/>
                                        <v-btn v-if="groups.selectedGroup.imageFile" @click="removeGroupImage" name="button-remove-group-image" class="mt-0 mb-0">
                                            Remove
                                        </v-btn>
                                    </div>                            
                                </v-list-tile-content>
                            </v-list-tile>
                        </v-list>
                        <!-- Edit details -->
                        <div v-if="editingGroup">
                            <v-divider class="mt-4 mb-3"/>
                            <v-form>
                                <v-layout row>
                                    <v-flex shrink>
                                        <span class="form-label">Group name:</span>
                                    </v-flex>
                                    <v-flex grow>
                                        <v-text-field v-model="editGroupName" name="input-group-name" class="form-input"/>
                                    </v-flex>
                                </v-layout>
                                <v-layout wrap row>
                                    <v-flex xs12 sm6>
                                        <v-checkbox v-model="groups.selectedGroup.is_public" label="public" class="mt-0" name="checkbox-is-public"/>
                                    </v-flex>
                                    <v-flex xs12 sm6 text-xs-center text-sm-right>
                                        <v-btn @click="updateGroup" flat class="orange" dark name="button-update-group">Update</v-btn>
                                    </v-flex>
                                </v-layout>
                            </v-form>
                        </div>
                    </v-card-text>
                </v-card>
            </div>
            <!-- Members -->
            <div>
                <v-toolbar color="green" dark dense>
                    <v-toolbar-title>
                        <v-icon>face</v-icon>
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
import ImageUploader from '@/components/ImageUploader';
import { mapState } from 'vuex';
import { repositoryFactory } from '@/api/repositoryFactory';
import common from '@/common';
const gamesRepository = repositoryFactory.get('games');

export default {
        components: {
            UserWithAvatar, AddGameDialog, ImageUploader
        },
        data() {
            return {
                groupDetailsLoaded: false,
                editGroupName: '',
                editingGroup: false,
            }
        },
        computed: {
            ...mapState(['login', 'groups', 'game']),
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
            this.getGroupDetails(groupId);
            this.$store.commit('game/clearGame');
        },
        methods: {
            deleteGame: function(gameId) {
                gamesRepository.deleteGame({group_id: this.groups.selectedGroup.id, game_id: gameId}).then(() => {
                    this.getGroupDetails(this.groups.selectedGroup.id);
                }).catch(() => {
                    this.$store.commit('toaster/showError', 'Unable to remove game from group');
                })
            },
            getGroupDetails: function(groupId) {
                this.$store.dispatch('groups/getGroupDetails', {
                    id: groupId
                }).then(() => {
                    this.editGroupName = this.groups.selectedGroup.name;
                    this.groupDetailsLoaded = true;
                }).catch(() => {
                    this.$store.commit('toaster/showError', 'Unable to load group details');
                });
            },
            updateGroupImage: function(filename) {
                this.$store.commit('groups/setGroupImage', filename);
            },
            removeGroupImage: function() {
                this.$store.dispatch('groups/removeGroupImage');
            },
            updateGroup: function() {
                this.$store.dispatch('groups/updateGroup', {name: this.editGroupName, is_public: this.groups.selectedGroup.is_public}).then(() => {
                    this.editingGroup = false;
                    this.$store.commit('toaster/showConfirm', 'Group details updated');
                }).catch(() => {
                    this.$store.commit('toaster/showError', 'Could not update group details');
                });
            },
            urlFriendly: function(str) {
                return common.urlFriendly(str);
            }
        }
    }
</script>