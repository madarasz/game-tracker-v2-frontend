<template>
    <div>
        <v-btn @click="launchFilePicker">Upload</v-btn>
        <input type="file" ref="fileInput" style="display:none" @change="onFileChange"/>
        <!-- Dialog -->
        <v-dialog v-model="imageUploaded" :width="`${dialogWidth}px`" persistent>
            <v-card>
                <v-card-title class="headline green lighten-2">
                    Upload image
                </v-card-title>
                <v-card-text>  
                    <v-layout row wrap fill-height align-center>
                        <v-flex xs12 text-xs-center>                 
                            <div ref="croppieContainer"/>
                        </v-flex>
                    </v-layout>
                    <img :src="resultImage" v-show="false"/>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn flat @click="resetDialog()">Cancel</v-btn>
                    <v-btn class="btn btn-dark" @click="croppieObject.rotate(+90)" flat small v-if="allowRotate">
                        <v-icon>rotate_left</v-icon>
                    </v-btn>
                    <v-btn class="btn btn-dark" @click="croppieObject.rotate(-90)" flat small v-if="allowRotate">
                        <v-icon>rotate_right</v-icon>
                    </v-btn>
                    <v-btn flat @click="cropImage()" class="green" dark>Upload</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
import Croppie from 'croppie/croppie';
import 'croppie/croppie.css';
import { repositoryFactory } from '@/api/repositoryFactory';
const imagesRepository = repositoryFactory.get('images');
import { mapState } from 'vuex';

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
        }
    },
    data () {
        return {
            imageUploaded: false,
            croppieObject: null,
            resultImage: null,
            dialogWidth: 800
            // outputOptions: {
            //     format: 'jpeg'
            // } 
        }
    },    
    computed: {
        ...mapState(['login'])
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

            var img = new Image();
            var _URL = window.URL || window.webkitURL;

            img.src = _URL.createObjectURL(imageFile);
            img.onload = () => {
                const bounds = this.getBounds(img);
                const options = {
                    viewport: bounds,
                    boundary: bounds,
                    showZoomer: true,
                    enableResize: !this.isSquare,
                    enableOrientation: true
                }

                this.croppieObject = new Croppie(this.$refs.croppieContainer, options);
                this.croppieObject.bind({ url: img.src });
                this.imageUploaded = true;
            };
        },
        
        // calculates ideal dimensions for croppie
        getBounds({height, width}) {
            const viewportWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
            const viewportHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
            const maxHeight = this.isSquare ? viewportHeight - 285 : viewportHeight - 230; // preceise: 196
            const maxWidth = Math.min(viewportWidth - 48, this.dialogWidth) - 75; // preceise: 80;
            const imgRatio = this.isSquare ? 1 : height / width;
            const maxRatio = maxHeight / maxWidth;
            var boundaryHeight, boundaryWidth;
            if (imgRatio > maxRatio) {
                boundaryHeight = maxHeight;
                boundaryWidth = boundaryHeight / imgRatio;
            } else {
                boundaryWidth = maxWidth;
                boundaryHeight = boundaryWidth * imgRatio;
            }
            // eslint-disable-next-line
            // console.log(`max space: ${maxWidth}x${maxHeight} ratio: ${maxRatio}- image: ${width}x${height} ratio: ${imgRatio} - boundary: ${boundaryWidth}x${boundaryHeight}`);
            return { width: boundaryWidth, height: boundaryHeight };
        },

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
                formData.append('type', 'user');
                formData.append('parent_id', this.login.userId);

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
            this.croppieObject.destroy();
            this.croppieObject = null;
        }
    }
};

</script>