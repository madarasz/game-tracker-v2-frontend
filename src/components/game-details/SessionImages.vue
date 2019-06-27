<template>
    <div>
        <v-card-title class="pt-2 pb-0 pr-1">
            <div class="subheading">Images</div>
            <v-spacer/>
            <image-uploader v-if="canEditImages" buttonIcon="cloud_upload" buttonText="" type="session" :parentid="session.currentSession.id" @uploaded="imageUploaded" 
                color="white" buttonClass="btn-small green" flat fab/>
            <v-btn name="button-edit-images" flat fab color="white" class="green btn-small ml-0" 
                v-if="canEditImages && images.length > 0" @click="editImages = !editImages">
                <v-icon>{{ editImages ? 'clear' : 'edit' }}</v-icon>
            </v-btn>
        </v-card-title>
        <v-card-text>
            <v-layout row>
                <v-flex class="text-xs-center" v-if="loading">
                    <v-progress-circular indeterminate color="green" class="pa-3"/>
                </v-flex>
                <v-flex v-if="!loading">
                    <!-- Image gallery -->
                    <div v-if="images.length > 0">
                        <!-- Image preview -->
                        <silentbox-group v-if="!editImages">
                            <v-layout row wrap>
                                <v-flex xs4 md3 lg2 pa-1 v-for="(image,i) in images" :key="i">
                                    <silentbox-item :src="image.src">
                                        <v-img :src="image.src" aspect-ratio="1"/>
                                    </silentbox-item>
                                </v-flex>
                            </v-layout>
                        </silentbox-group>
                        <!-- Image edit -->
                        <v-layout row wrap v-if="editImages">
                            <v-flex xs4 md3 lg2 pa-1 v-for="(image,i) in images" :key="i">
                                <div style="position: relative">
                                    <v-img :src="image.src" aspect-ratio="1"/>
                                    <confirm-button icon buttonIcon="delete" iconColor="white" class="red" style="position: absolute; top: 0px; right: 0px"
                                        question="Do you want to delete the image?" :callback="function(){deleteImage(image.id)}" name="button-delete-image"/>
                                </div>
                            </v-flex>
                        </v-layout>
                    </div>
                    <div v-if="images.length == 0">
                    </div>
                </v-flex>
            </v-layout>
        </v-card-text>
    </div>
</template>

<script>
import ImageUploader from '@/components/ImageUploader';
import ConfirmButton from '@/components/ConfirmButton';
import { mapState } from 'vuex';

// using vue silentbox
import Vue from 'vue'
import VueSilentbox from 'vue-silentbox'
Vue.use(VueSilentbox);

export default {
    name: 'SessionImages',
    components: {
        ImageUploader, ConfirmButton
    },
    props: {
    },
    data () {
        return {
            showPreview: false,
            imageIndexInPreview: 0,
            editImages: false,
            loading: false,
        }
    },
    computed: {
        ...mapState(['game', 'groups', 'session']),
        canEditImages() {
            return this.$store.getters['groups/isUserGroupMember'];
        },
        imageFolder:function() {
            return process.env.VUE_APP_BACKEND_IMG_URL;
        },
        images: function() {
            return this.session.currentSession.images.map((x) => { 
                return {
                    src: this.imageFolder + x.filename,
                    id: x.id
                }
            });
        }
    },
    methods: {
        imageUploaded() {
            this.$store.commit('toaster/showConfirm', 'Image uploaded');
            this.refreshSession();
        },
        refreshSession() {
            this.loading = true;
            this.$store.dispatch('game/getGameDetails', { gameId: this.game.details.id, groupId: this.groups.selectedGroup.id }).then(() => {
                // refresh current session
                this.$store.commit('session/selectSession', 
                    this.game.details.sessions.find((x) => { return x.id == this.session.currentSession.id}));
                this.loading = false;
            }).catch(() => {
                this.$store.commit('toaster/showError', 'Could not update game details');
            })
        },
        showImage(index) {
            this.imageIndexInPreview = index;
            this.showPreview = true;
        },
        deleteImage(id) {
            this.$store.dispatch('session/removeImage', id).then(() => {
                this.$store.commit('toaster/showConfirm', 'Image removed');
                this.refreshSession();
            }).catch(() => {
                this.$store.commit('toaster/showError', 'Could not remove image');
            })          
        }
    }
}
</script>