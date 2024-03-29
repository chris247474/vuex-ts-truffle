<template>
  <div class='header-wrapper'>
    <header>
      <nav>
        <router-link to='/' class='logo'>
          <img src="~@images/logo_banniere.svg" alt="">
        </router-link>
        <ul class='nav-list'>
          <router-link :to='item.link' v-for="item in nav" :key='item.name'>
            <li class='route' :size='26'>
              <!-- <SvgIcon class='tablet' :src='item.icon'></SvgIcon> -->
              <span>{{item.title}}</span>
            </li>
          </router-link>
        </ul>
        <ul class='login-list'>
          <li class="header-button color">
            <router-link to='/bemover'>
              <span>Devenir déménageur</span>
            </router-link>
          </li>

          <!-- If user logged in -->

          <template v-if='loginState.isLoggedIn' >
            <li for='user-notifications' class='header-button popup'>
              <Popup ref='profile' class='right' v-if='loginState.isLoggedIn' :width='250'>
                <template>
                  
                </template>
              </Popup>
              <div class='bouton-data image'>
                <SvgIcon :src="require('@icons/notification_none.svg')"></SvgIcon>
              </div>
            </li>

            <li for='user-menu' class="header-button popup" @click.stop="togglePopup('profile')">
              <Popup ref='profile' class='right' v-if='loginState.isLoggedIn' :width='250'>
                <template>
                  <div class="user">
                      <div class="user-picture" :style='getProfileImage'></div>
                      <div class="user-name">{{loginState.userInfos.username | capitalize}}</div>
                  </div>
                  <ul class='user-option-list'>
                      <a href="#"><li class='user-option'>Mon profil</li></a>
                      <a href="#" v-if='isAdmin'>
                        <li class='user-option'>
                          Administration
                        </li>
                      </a>
                      <li class='user-option'>Aide</li>
                      <li class='user-option' @click='disconnectRequest'>Deconnexion</li>
                  </ul>
                </template>
              </Popup>
              <div class='bouton-data'>
                <span>{{loginState.userInfos.username | capitalize}}</span>
                <div class='profile-image' :style='getProfileImage'></div>
              </div>
            </li>
          </template>

          <!-- Else -->

          <template v-else>
            <li class="header-button" @click='showLogin'>
              <span>Connexion</span>
            </li>
            <li class="header-button"  @click='showSignup'>
              <span>Inscription</span>
            </li>
          </template>
        </ul>
      </nav>
    </header>
  
    <Connexion :show='loginState.showModal' v-if='!loginState.isLoggedIn' ></Connexion>  
    <Inscription :show='signupState.showModal' v-if='!loginState.isLoggedIn'></Inscription>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import {Store} from 'vuex';
import {RootState} from '@store';

import { ILoginState, ISignupState } from '@types';
import { timeout } from '@methods';
import { SvgIcon, Connexion, Inscription, Popup } from "@components";
import { LoginStore, SignupStore } from '@modules'
import { StringifyOptions } from "querystring";

@Component({
  components: { Connexion, Inscription, Popup, SvgIcon },
})
export default class HeaderComponent extends Vue {

  private loginState = LoginStore.state;
  private fullName = LoginStore.getters.fullName;
  private userPicture = LoginStore.getters.userPicture;
  private isAdmin = LoginStore.getters.isAdmin;

  private showLogin = LoginStore.mutations.showLogin;
  private disconnectRequest = LoginStore.actions.disconnectRequest;

  private signupState = SignupStore.state;
  private showSignup = SignupStore.mutations.showSignup;
  

  public $store: Store<RootState>;
  public refs = {};
  public popups = [];

  get getProfileImage() {
    return {
      backgroundImage: `url(${this.userPicture})`
    }
  }

  mounted() {
    this.refs = this.$refs;
  }

  togglePopup(popupName: string, target?: HTMLElement) {
    this.$refs[popupName].togglePopup(target);
  }

  public nav = [
    { title: "Needs", name: "moving", link: "/moving", icon: require('@icons/truck.svg')},
    { title: "Offers", name: "movers", link: "/movers", icon: require('@icons/people.svg')}
  ];

}
</script>



<style lang='scss' scoped>

div.header-wrapper{
  position: absolute;
  height: 100%;
  width: 100%;
  top: 0;
  left: 0;


  header {
    position: fixed;
    top: 0px;
    left: 0px;
    height: $headerHeight;
    width: 100%;
    display: flex;
    background-color: white;
    color: $mainColor;
    z-index: 10000;
    flex-flow: row nowrap;
    justify-content: flex-start;
    box-shadow: 0 0 5px transparentize($g20, 0.8);

    .logo {
      display: flex;
      flex: 0 0 auto;
      padding: 5px;
      align-items: center;

      img {
        height: 30px;
        width: auto;
        max-width: 100%;
      }
    }

    nav {
      display: flex;
      flex-flow: row nowrap;
      flex: 1 1 auto;

      ul.nav-list {
        display: flex;
        flex-flow: row wrap;
        flex: 1 0 auto;
        padding: 0px 15px 0px 15px;

        a {
          display: flex;
          margin-right: 5px;

          &:not(.router-link-active):hover li.route{
            border-color: $mainStyle;
            color: $g40;
          }
          &.router-link-active li.route{
            border-color: $mainStyle;
            color: $g40;
            /deep/ svg { fill: $mainStyle }
          }

          li.route {
            display: flex;
            flex-flow: row nowrap;
            justify-content: center;
            align-items: center;
            align-content: center;
            font-size: 14px;
            padding: 7px 5px 5px 5px;
            font-weight: bold;
            border-bottom: 3px solid transparent;

            span {padding: 0 5px 0 5px}

            /deep/ div, svg {
              fill: $g90;
              height: 25px;
              width: 25px;
            }
          }
        }
      }

      ul.login-list {
        display: flex;
        flex-flow: row nowrap;
        flex: 1 0 auto;
        justify-content: flex-end;
        padding: 8px 15px 8px 15px;

        %header-button {
          display: flex;
          flex-flow: row nowrap;
          justify-content: center;
          align-items: center;
          align-content: center;
          font-size: 14px;
          font-weight: bold;
          border-radius: 40px;
          transition: background-color 0.3s;
          cursor: pointer;
          &:not(.color) {
            // &:hover {background-color: $w230;}
            // &.active {background-color: $w220;}
          }
          &.color {
            // background-color: $mainStyle;
            color: $mainStyle;
            // &:hover {background-color: darken($mainStyle, 4%);}
            // &:active {background-color: darken($mainStyle, 8%);}
          }

          &:hover {background-color: $w235;}
          &.active {background-color: $w220;}

          span {padding: 7px 15px 8px 15px;}

          .profile-image {
            @include bg-center;
            height: 28px;
            width: 28px;
            margin-left: -5px;
            margin-right: 15px;
            border-radius: 40px;
            border: 2px solid $mainStyle;
          }
        }

        li.header-button {
          &:not(.popup) {
            margin-left: 5px;
            @extend %header-button;
          }

          &.popup {
            position: relative;
            margin-left: 10px;
            white-space: nowrap;
            float: left;

            .bouton-data {
              @extend %header-button;

              &.image {
                padding: 5px;
              }
            }

            .popup-box.active ~ .bouton-data{
              background-color: $w220;
            }

          }
        }  
      }
    }
  }
}

.user{
  position: relative;
  display: flex;
  height: auto;
  flex-flow: column nowrap;
  border-bottom: 1px solid $w240;
  align-items: center;

  .user-picture{
    position: relative;
    height: 100px;
    width: 100px;
    border-radius: 100%;
    margin-top: 10px;
    border: 2px solid $mainStyle;
    @include bg-center;
  }

  .user-name{
    position: relative;
    height: 40px;
    font-size: 17px;
    line-height: 40px;
    text-align: center;
    text-transform: capitalize;
    font-weight: bold;
  }
}

.user-option-list{
  position: relative;
  display: flex;
  flex-flow: column nowrap;
  overflow: hidden;
  border-radius: 0 0 3px 3px;

  .user-option{
    position: relative;
    height: 40px;
    padding-left: 20px;
    line-height: 40px;
    font-size: 14px;
    cursor: pointer;
    font-weight: bold;

    &:hover{
      background-color: $w245;
    }

    &:active{
      background-color: $w220;
    }
  }
}

</style>

