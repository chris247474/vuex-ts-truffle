<template>
<div>
  <a @click="uportRequest()">Click me to do Uport thing</a>
</div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";

import { Modal, FormText, CheckBox, FormButton } from "@components";
import { timeout } from '@methods';
import { required, email } from 'vuelidate/lib/validators';
import { LoginStore, NotificationsStore } from '@modules';
import { uport } from '../../utils/uportSetup'

@Component({
  components: {
    Modal, FormText, CheckBox, FormButton
  },
  validations: {
    LoginForm: {
      _username: {required},
      _password: {required}
    }
  }
})
export default class Login extends Vue {

  @Prop({required: false, default: true}) show: boolean;
  @Prop({default: true}) isPopup: boolean;
  @Prop({required: false}) redirect: string;



  private loginState = LoginStore.state;
  private connexionRequest = LoginStore.actions.connexionRequest;
  private closeModal = LoginStore.mutations.closeModal;

  private addNotification = NotificationsStore.actions.addNotification;

  public infoMessage: string = '';
  public error: boolean = true;
  public errorType: string = '';

  public images = {
    _username: require('@icons/mail.svg'),
    _password: require('@icons/password.svg')
  }
  public LoginForm = {
    _username: 'victor@free.fr',
    _password: 'aaaaa',
    _souvenir: false,
    reset() {
      this._username = null;
      this._password = null;
      this._souvenir = false;
    }
  };

  uportRequest() {
        // Request credentials to login
    uport.requestCredentials({
      requested: ['name', 'phone', 'country'],
      notifications: true // We want this if we want to recieve credentials
    })
    .then((credentials) => {
      // Do something
    })
  }

  modalClosed(empty: boolean) {
    this.infoMessage = '';
    if(empty) {
      this.LoginForm.reset()
    }
    this.closeModal();
  }

  async submitForm(){
    this.infoMessage = '';
    let loginResponse = await this.connexionRequest({loginData: this.LoginForm, redirect: this.redirect});
    if (!loginResponse.success) {
      this.errorType = loginResponse.type;
      this.infoMessage = loginResponse.message;
    }
  }
}
</script>



<style lang='scss' scoped>
  .infoMessage {
    border: 1px solid $w210;
    border-radius: 40px;
    font-size: 14px;
    font-weight: bold;
    margin: 5px;
    padding: 10px 10px 10px 10px;
    text-align: center;
    color: white;
    border: none;
    box-shadow: 0 0 8px transparentize($g0, $amount: 0.85);
    
    &.error {
      color: $red1;
    }

    &.warning {
      color: $yellow2;
    }
  }
</style>

