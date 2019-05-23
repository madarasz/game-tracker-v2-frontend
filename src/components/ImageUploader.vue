<template>
    <div>
        <v-btn @click="launchFilePicker">Upload</v-btn>
        <input type="file" ref="fileInput" style="display:none" @change="onFileChange"/>
        <!-- Dialog -->
        <v-dialog v-model="imageUploaded" width="800px" persistent>
            <v-card>
                <v-card-title class="headline green lighten-2">
                    Upload image
                </v-card-title>
                <v-card-text>  
                    <v-layout row wrap fill-height align-center>
                        <v-flex xs2 text-xs-right>
                            <v-btn class="btn btn-dark" @click="croppieObject.rotate(+90)" fab>
                                <v-icon>rotate_left</v-icon>
                            </v-btn>
                        </v-flex>
                        <v-flex xs8>
                            <div ref="croppieContainer"/>
                        </v-flex>
                        <v-flex xs2 text-xs-left>
                            <v-btn class="btn btn-dark" @click="croppieObject.rotate(-90)" fab>
                                <v-icon>rotate_right</v-icon>
                            </v-btn>
                        </v-flex>
                    </v-layout>
                    <img :src="resultImage" v-show="false"/>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn flat @click="resetDialog()">Cancel</v-btn>
                    <v-btn flat @click="cropImage()">Upload</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
import Croppie from 'croppie/croppie';
import 'croppie/croppie.css';

export default {
    name: 'ImageUploader',
    components: {
    },
    data () {
        return {
            imageUploaded: false,
            croppieObject: null,
            resultImage: null
            // outputOptions: {
            //     format: 'jpeg'
            // } 
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
            var reader = new FileReader();

            const options = {
                viewport: { width: 100, height: 100 },
                boundary: { width: 300, height: 300 },
                showZoomer: false,
                enableResize: true,
                enableOrientation: true
            }
            
            reader.readAsDataURL(imageFile);
            reader.onload = (e) => {
                if (this.croppieObject == null) {
                    this.croppieObject = new Croppie(this.$refs.croppieContainer, options);
                }
                this.croppieObject.bind({ url: e.target.result });
                this.imageUploaded = true;
            }
        },

        cropImage() {
            this.croppieObject.result('base64').then((dataImg) => {
                // var data = [{ image: dataImg }, { name: 'myimgage.jpg' }];
                this.resultImage = dataImg;
                // todo send to backend
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