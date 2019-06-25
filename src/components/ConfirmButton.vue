<template>
    <div>
        <!-- Button -->
        <v-btn :name="name" :class="buttonClass" :icon="icon" :ripple="ripple" @click.prevent="showDialog = true">
            <v-icon v-if="buttonIcon != ''" :color="iconColor">{{ buttonIcon}}</v-icon>
            <span v-if="buttonText != ''">{{ buttonText }}</span>
        </v-btn>
        <!-- Dialog -->
        <v-dialog v-model="showDialog" width="500" name="dialog-confirm">
            <v-toolbar color="red" dark>
                <v-toolbar-title>Please confirm</v-toolbar-title>
            </v-toolbar>
            <v-card>
                <v-card-text class="subheading text-xs-center">
                    {{ question }}
                </v-card-text>
                <v-card-actions v-if="showDialog">
                    <v-btn flat @click="showDialog = false" name="button-dialog-cancel">Cancel</v-btn>
                    <v-spacer/>
                    <v-btn color="white" class="red" flat 
                        @click.prevent="triggerAction()" name="button-dialog-confirm">Confirm</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
// import { mapState } from 'vuex';

export default {
    name: 'ConfirmButton',
    props: {
        name: {
            type: String,
            default: ''
        },
        icon: {
            type: Boolean,
            default: false
        },
        ripple: {
            type: Boolean,
            default: false
        },
        buttonClass: {
            type: String,
            default: ''
        },
        buttonText: {
            type: String,
            default: ''
        },
        buttonIcon: {
            type: String,
            default: ''
        },
        iconColor: {
            type: String,
            default: ''
        },
        question: {
            type: String,
            default: 'Are you sure?'
        },
        callback: {
            type: Function,
            default:() => {
            }
        }
    },
    data () {
        return {
            showDialog: false
        }
    },
    methods: {
        triggerAction() {
            this.callback();
            this.showDialog = false;
        }
    }
}
</script>