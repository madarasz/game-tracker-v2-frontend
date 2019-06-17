<template>
    <span>
        <v-btn @click="launchFilePicker" name="button-upload-image" class="mt-0 mb-0">{{ buttonText }}</v-btn>
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
                    <!-- <img :src="resultImage" v-show="false"/> -->
                </v-card-text>
                <v-card-actions>
                    <v-btn flat @click="resetDialog()" name="button-dialog-cancel">Cancel</v-btn>
                    <v-spacer></v-spacer>
                    <!-- <v-btn class="btn btn-dark" @click="croppieObject.rotate(+90)" flat small v-if="allowRotate">
                        <v-icon>rotate_left</v-icon>
                    </v-btn>
                    <v-btn class="btn btn-dark" @click="croppieObject.rotate(-90)" flat small v-if="allowRotate">
                        <v-icon>rotate_right</v-icon>
                    </v-btn> -->
                    <v-btn flat @click="initiateCropper" v-if="!editing">Edit</v-btn>
                    <v-btn flat class="green" dark name="button-dialog-upload">Upload</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </span>
</template>

<script>
/* eslint-disable */
// import Croppie from 'croppie/croppie';
// import 'croppie/croppie.css';
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
            default: false
        },
        buttonText: {
            type: String,
            default: 'Upload'
        },
        type: {
            type: String,
            default: ''
        },
        parentid: {
            type: Number,
            default: 0
        }
    },
    data () {
        return {
            imageUploaded: false,
            // croppieObject: null, // TODO: delete
            resultImage: null,
            // dialogWidth: 800,
            // outputOptions: {
            //     format: 'jpeg'
            // } 
            cropperObject: null,
            imgData: '',
            imgObject: null,
            editing: false
        }
    },    
    computed: {
        ...mapState(['login']),
        imgMaxHeight: function() {
            const viewportHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
            return viewportHeight-48/*card margin*/-64/*card title*/-32/*card body margin*/-52/*card actions*/-16;
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
                // const bounds = this.getBounds(img);
                // const options = {
                //     viewport: bounds,
                //     boundary: bounds,
                //     showZoomer: true,
                //     enableResize: !this.isSquare,
                //     enableOrientation: true
                // }
                // const options = {
                //     size: { width: 128, height: 128 },
                //     canvas: document.querySelector('.js-editorcanvas'),
                //     preview: document.querySelector('.js-previewcanvas')
                // }

                // this.croppieObject = new Croppie(this.$refs.croppieContainer, options);
                // this.croppieObject.bind({ url: img.src });
                // const context = this.$refs.editor_canvas.get(0).getContext("2d");
                
                // this.cropperObject = new Cropper(document.querySelector('.js-editorcanvas'), options);
                
            };
        },

        initiateCropper: function() {
            const context = this.$refs.editor_canvas.getContext("2d");
            context.canvas.height = this.imgMaxHeight;
            context.canvas.width  = this.imgMaxHeight / this.imgObject.height * this.imgObject.width;
            context.drawImage(this.imgObject, 0, 0, this.imgObject.width, this.imgObject.height, 0, 0, this.imgMaxHeight / this.imgObject.height * this.imgObject.width, this.imgMaxHeight);
            this.cropperObject = new Cropper(this.$refs.editor_canvas, {
                viewMode: 1,
                dragMode: 'move',
                autoCropArea: 1
            });
            this.editing = true;
        },
        
        // calculates ideal dimensions for croppie
        // getBounds({height, width}) {
        //     const viewportWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
        //     const viewportHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
        //     const maxHeight = this.isSquare ? viewportHeight - 285 : viewportHeight - 230; // preceise: 196
        //     const maxWidth = Math.min(viewportWidth - 48, this.dialogWidth) - 75; // preceise: 80;
        //     const imgRatio = this.isSquare ? 1 : height / width;
        //     const maxRatio = maxHeight / maxWidth;
        //     var boundaryHeight, boundaryWidth;
        //     if (imgRatio > maxRatio) {
        //         boundaryHeight = maxHeight;
        //         boundaryWidth = boundaryHeight / imgRatio;
        //     } else {
        //         boundaryWidth = maxWidth;
        //         boundaryHeight = boundaryWidth * imgRatio;
        //     }
        //     // eslint-disable-next-line
        //     // console.log(`max space: ${maxWidth}x${maxHeight} ratio: ${maxRatio}- image: ${width}x${height} ratio: ${imgRatio} - boundary: ${boundaryWidth}x${boundaryHeight}`);
        //     return { width: boundaryWidth, height: boundaryHeight };
        // },

        cropImage() {
            this.croppieObject.result('base64').then((dataImg) => {
                this.resultImage = dataImg;
                
                // convert from base64 to file
                const i = dataImg.indexOf('base64,');
                const buffer = Buffer.from(dataImg.slice(i + 7), 'base64');
                const file = new File([buffer], 'name', {type: 'image/png'});

                // construct form data
                var formData = new FormData();
                formData.append('image', file);
                formData.append('type', this.type);
                formData.append('parent_id', this.parentid);

                imagesRepository.uploadImage(formData).then((response) => {
                    this.$emit('uploaded', response.data.filename);
                }).catch(() => {
                    this.$store.commit('toaster/showError', 'File upload failed');
                });
                this.resetDialog();
            });
        },

        resetDialog() {
            this.imageUploaded = false;
            this.resultImage = null;
        }
    }
};

</script>