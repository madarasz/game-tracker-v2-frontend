<template>
    <div>
        <v-btn @click="launchFilePicker">Upload</v-btn>
        <input type="file" ref="file" name="uploadedFile" style="display:none" 
            @change="onFileChange"/>
        <v-btn class="btn btn-dark" @click="rotate(+90)">Rotate Left</v-btn>
        <v-btn class="btn btn-dark" @click="rotate(-90)">Rotate Right</v-btn>
        <v-btn class="btn btn-dark" @click="crop()">Crop</v-btn>
        <img :src="cropped" style="width: 300px;"/>
        <croppie ref="croppieContainer" @result="result" @update="update" :croppieInitialized="croppieInitialized" :enableOrientation="true" :boundary="{height: 400}"/>
    </div>
</template>

<script>
import Croppie from './Croppie';

export default {
    name: 'ImageUploader',
    components: {
      Croppie  
    },
    data () {
        return {
            cropped: null,
            outputOptions: {
                format: 'jpeg'
            } 
        }
    },    
    mounted() {
        this.$refs.croppieContainer.bind({
            url: 'http://i.imgur.com/Fv2YOM6.jpg'
        })
        setTimeout(() => {
            this.crop()
        }, 1000)
    }, 
    methods: {
        onFileChange(event) {
            // check if file was selected
            if (event.target.files.length < 1) {
                this.$store.commit('toaster/showError', 'No file was selected');
                return;
            }
            const imageFile = event.target.files[0];
            // check if not image
            if (!imageFile.type.match('image.*')) {
                this.$store.commit('toaster/showError', 'Selected file is not an image');
                return;
            }
            let formData = new FormData()
            let imageURL = URL.createObjectURL(imageFile)
            formData.append('uploadedFile', imageFile)
            this.cropped = formData.imageURL;
        },
        bind() {
            // // Randomize cat photos, nothing special here.
            // let url = this.images[Math.floor(Math.random() * this.images.length)];
            // // Just like what we did with .bind({...}) on 
            // // the mounted() function above.
            // this.$refs.croppieContainer.bind({
            //     url: url,
            // });
        },
        // CALLBACK USAGE
  
        crop() {
            // Here we are getting the result via callback function
            // and set the result to this.cropped which is being 
            // used to display the result above.
            this.$refs.croppieContainer.result(this.outputOptions, (output) => {
                this.cropped = output;
            });
        },
        // EVENT USAGE
        cropViaEvent() {
            this.$refs.croppieContainer.result(this.outputOptions);
        },
        result(output) {
            this.cropped = output;
        },
        update(val) {
            // eslint-disable-next-line
            console.log(val);
        },
        rotate(rotationAngle) {
        // Rotates the image
            this.$refs.croppieContainer.rotate(rotationAngle);
        },
        croppieInitialized() {
            // This method will be executed when the croppie is initialized
            // You can use it to set the image
            // this.$refs.croppieRef.bind({
            //   url: 'http://i.imgur.com/Fv2YOM6.jpg',
            // });
            // eslint-disable-next-line
            console.log('Croppie was  initialized');
        },

        launchFilePicker(){
            this.$refs.file.click();
        },
    }
};

</script>