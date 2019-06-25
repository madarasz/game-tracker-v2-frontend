<template>
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
</template>

<script>
import ImageUploader from '@/components/ImageUploader';
import { mapState } from 'vuex';

export default {
    name: 'GroupDetailsCard',
    components: {
        ImageUploader
    },
    data() {
        return {
            editGroupName: '',
            editingGroup: false,
        }
    },
    computed: {
        ...mapState(['login', 'groups']),
        isGroupAdmin: function() { // can be site admin as well
            return this.$store.getters['groups/isUserGroupAdmin'];
        },
        imageFolder:function() {
            return process.env.VUE_APP_BACKEND_IMG_URL;
        }
    },
    mounted() {
        this.editGroupName = this.groups.selectedGroup.name;
    },
    methods: {
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
    }
}
</script>