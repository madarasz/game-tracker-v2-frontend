<template>
    <div>
        <v-btn @click="launchFilePicker">Upload</v-btn>
        <input type="file" ref="fileInput" style="display:none" @change="onFileChange"/>
        <img :src="croppieImageSrc" ref="croppieImage" style="max-width: 500px;"/>
        <div ref="croppieContainer" />
        <v-btn @click="cropImage" v-show="imageUploaded">Crop</v-btn>
        <img :src="resultImage" v-show="imageCropped"/>
        <!-- <v-btn class="btn btn-dark" @click="rotate(+90)">Rotate Left</v-btn>
        <v-btn class="btn btn-dark" @click="rotate(-90)">Rotate Right</v-btn>
        <v-btn class="btn btn-dark" @click="crop()">Crop</v-btn> -->
        <!-- <croppie ref="croppieContainer" @result="result" @update="update" :croppieInitialized="croppieInitialized" :enableOrientation="true" :boundary="{height: 400}"/> -->
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
            croppieImageSrc: null,
            imageUploaded: false,
            imageCropped: false,
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
                // this.croppieImageSrc = e.target.result;
                this.croppieObject = new Croppie(this.$refs.croppieContainer, options);
                this.croppieObject.bind({ url: e.target.result });
                this.imageUploaded = true;
            }
        },

        cropImage() {
            this.croppieObject.result('base64').then((dataImg) => {
                // var data = [{ image: dataImg }, { name: 'myimgage.jpg' }];
                this.resultImage = dataImg;
                this.imageCropped = true;
            });
        }
        // bind() {
        //     // // Randomize cat photos, nothing special here.
        //     // let url = this.images[Math.floor(Math.random() * this.images.length)];
        //     // // Just like what we did with .bind({...}) on 
        //     // // the mounted() function above.
        //     // this.$refs.croppieContainer.bind({
        //     //     url: url,
        //     // });
        // },
        // // CALLBACK USAGE
  
        // crop() {
        //     // Here we are getting the result via callback function
        //     // and set the result to this.cropped which is being 
        //     // used to display the result above.
        //     this.$refs.croppieContainer.result(this.outputOptions, (output) => {
        //         this.cropped = output;
        //     });
        // },
        // // EVENT USAGE
        // cropViaEvent() {
        //     this.$refs.croppieContainer.result(this.outputOptions);
        // },
        // result(output) {
        //     this.cropped = output;
        // },
        // update(val) {
        //     // eslint-disable-next-line
        //     console.log(val);
        // },
        // rotate(rotationAngle) {
        // // Rotates the image
        //     this.$refs.croppieContainer.rotate(rotationAngle);
        // },
        // croppieInitialized() {
        //     // This method will be executed when the croppie is initialized
        //     // You can use it to set the image
        //     // this.$refs.croppieRef.bind({
        //     //   url: 'http://i.imgur.com/Fv2YOM6.jpg',
        //     // });
        //     // eslint-disable-next-line
        //     console.log('Croppie was  initialized');
        // },

        
    }
};

</script>