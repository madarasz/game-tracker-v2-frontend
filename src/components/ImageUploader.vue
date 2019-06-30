<template>
    <span>
        <v-btn @click="launchFilePicker" name="button-upload-image" :flat="flat" :fab="fab" :color="color" :class="(buttonClass + ' mt-0 mb-0')">
            <v-icon v-if="buttonIcon != ''">{{ buttonIcon }}</v-icon>
            <span>{{ buttonText }}</span>
        </v-btn>
        <input type="file" ref="fileInput" style="display:none" @change="onFileChange" name="input-file"
            accept="image/jpeg,image/png,image/gif"/>
        <!-- Dialog -->
        <v-dialog v-model="imageUploaded" persistent style="display: inline">
            <v-card>
                <v-card-title class="headline green lighten-2">
                    Upload image
                </v-card-title>
                <v-card-text>  
                    <v-layout row wrap fill-height align-center>
                        <v-flex xs12 text-xs-center>                 
                            <v-img ref="img_original" style="max-width: 100%" :src="imgData" :max-height="imgMaxHeight" contain v-if="!editing"/>
                            <canvas ref="editor_canvas" v-show="editing"></canvas>
                        </v-flex>
                    </v-layout>
                </v-card-text>
                <v-card-actions>
                    <v-btn flat @click="resetDialog()" name="button-dialog-cancel" class="hidden-xs-only">Cancel</v-btn>
                    <v-btn flat @click="resetDialog()" fab small class="hidden-sm-and-up"><v-icon>clear</v-icon></v-btn>
                    <v-btn flat @click="resetEdit()" v-if="editing" name="button-dialog-discard" class="hidden-xs-only">Discard edit</v-btn>
                    <v-btn flat @click="resetEdit()" fab small v-if="editing" name="button-dialog-discard" class="hidden-sm-and-up"><v-icon>keyboard_backspace</v-icon></v-btn>
                    <v-spacer></v-spacer>
                    <v-btn @click="rotate(-90)" small fab flat v-if="allowRotate && editing">
                        <v-icon>rotate_left</v-icon>
                    </v-btn>
                    <v-btn @click="rotate(90)" small fab flat v-if="allowRotate && editing">
                        <v-icon>rotate_right</v-icon>
                    </v-btn>
                    <v-btn flat @click="initiateCropper" v-if="!editing">Edit</v-btn>
                    <v-btn flat @click="upload" class="green" dark name="button-dialog-upload">Upload</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </span>
</template>

<script>
import { repositoryFactory } from '@/api/repositoryFactory';
const imagesRepository = repositoryFactory.get('images');
import { mapState } from 'vuex';
import Cropper from 'cropperjs';
import 'cropperjs/dist/cropper.css';

export default {
    name: 'ImageUploader',
    props: {
        isSquare: {
            type: Boolean,
            default: false
        },
        allowRotate: {
            type: Boolean,
            default: true
        },
        flat: {
            type: Boolean,
            default: false
        },
        fab: {
            type: Boolean,
            default: false
        },
        buttonText: {
            type: String,
            default: 'Upload'
        },
        buttonIcon: {
            type: String,
            default: ''
        },
        color: {
            type: String,
            default: ''
        },
        buttonClass: {
            type: String,
            default: ''
        },
        type: {
            type: String,
            default: ''
        },
        parentid: {
            type: Number,
            default: 0
        },
        groupid: {
            type: Number,
            default: 0
        }
    },
    data () {
        return {
            imageUploaded: false,
            cropperObject: null,
            imgData: '',
            imgObject: null,
            editing: false,
            isRotated: false // is true if rotated by 90 or 270 degrees
        }
    },    
    computed: {
        ...mapState(['login']),
        imgMaxHeight: function() {
            const viewportHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
            return viewportHeight-48/*card margin*/-64/*card title*/-32/*card body margin*/-52/*card actions*/-64;
        }
    },
    methods: {
        launchFilePicker(){
            this.$refs.fileInput.click();
        },

        onFileChange(event) {
            // check if file was selected
            if (!event.target.files || event.target.files.length < 1) {
                this.$store.commit('toaster/showError', 'No file was selected');
                return;
            }
            const imageFile = event.target.files[0];
            // check if not image
            if (!imageFile.type.match('image.*')) {
                this.$store.commit('toaster/showError', 'Selected file is not an image');
                return;
            }

            this.imgObject = new Image();
            var _URL = window.URL || window.webkitURL;

            this.imgObject.src = _URL.createObjectURL(imageFile);
            this.imgObject.onload = () => {
                this.imageUploaded = true;
                this.imgData = this.imgObject.src;
                // cropper is mandatory if isSquare
                if (this.isSquare && this.imgObject.width != this.imgObject.height) {
                    this.initiateCropper();
                }
            };
        },

        initiateCropper() {
            // init canvas
            const context = this.$refs.editor_canvas.getContext("2d");
            context.canvas.height = this.imgMaxHeight;
            context.canvas.width  = this.imgMaxHeight / this.imgObject.height * this.imgObject.width;
            context.drawImage(this.imgObject, 0, 0, this.imgObject.width, this.imgObject.height, 0, 0, this.imgMaxHeight / this.imgObject.height * this.imgObject.width, this.imgMaxHeight);

            // create Cropper
            this.cropperObject = new Cropper(this.$refs.editor_canvas, {
                viewMode: 1,
                dragMode: 'move',
                autoCropArea: 1,
                aspectRatio: this.isSquare ? 1 : NaN
            });

            this.editing = true;
        },

        rotate(degrees) {
            this.isRotated = !this.isRotated;
            const newWidth = this.isRotated ? this.imgObject.height : this.imgObject.width;
            const newHeight = this.isRotated ? this.imgObject.width : this.imgObject.height;
            var ratio = newHeight/newWidth;

            this.cropperObject.setCropBoxData({left: 0, right: 0, width: 1, height: 1});    // cropbox needs to be minimal, so there is no scaling restriction

            // rotation
            this.cropperObject.rotate(degrees);
            
            // scaling
            if (!this.isRotated) {
                ratio = 1; // only 90 and 270 degrees rotation needs scaling (relative to original), scaling is relative to original
            }
            this.cropperObject.scale(1/ratio);

            // recentering
            const container = this.cropperObject.getContainerData();
            this.cropperObject.moveTo(container.width / 2, container.height / 2);  // TODO: still needs some refinement on recentering while isRotated = true

            this.cropperObject.setCropBoxData({left: 0, right: 0, width: newWidth, height: newHeight}); // restore cropbox to full image
        },

        resetEdit() {
            this.editing = false;
            this.isRotated = false;
            this.cropperObject.destroy();
        },

        upload() {
            this.$emit('upload-started');
            let file; 
            if (this.editing) {
                // upload edited file
                const resultImage = this.cropperObject.getCroppedCanvas().toDataURL("image/png");
                const i = resultImage.indexOf('base64,');
                const buffer = Buffer.from(resultImage.slice(i + 7), 'base64');
                const originalType = this.$refs.fileInput.files[0].type; // save in original image file type
                file = new File([buffer], 'name', {type: originalType}); // convert from base64 to file
            } else {
                // upload unmodified file
                file = this.$refs.fileInput.files[0];
            }  

            // construct form data
            var formData = new FormData();
            formData.append('image', file);
            formData.append('type', this.type);
            formData.append('parent_id', this.parentid);
            formData.append('group_id', this.groupid);  // for session images

            imagesRepository.uploadImage(formData).then((response) => {
                this.$emit('uploaded', response.data.filename);
            }).catch(() => {
                this.$store.commit('toaster/showError', 'File upload failed');
            });
            this.resetDialog();
        },

        resetDialog() {
            this.imageUploaded = false;
            this.resultImage = null;
            this.imgData = '';
            this.imgObject = null;
            this.editing = false;
            this.isRotated = false;
            this.$refs.fileInput.value = '';
            if (this.cropperObject != null) {
                this.cropperObject.destroy();
            }
        }
    }
};

</script>