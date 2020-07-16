<template>
  <div class="hello">
    <el-row>
      <!-- <el-button
        type="primary"
        icon="fas fa-edit"
        @click="handleClickLogin"
        :disabled="!isInit"
      >get authCode</el-button> -->
      <el-button
        type="primary"
        icon="fas fa-edit"
        @click="handleClickSignIn"
        v-if="!isSignIn"
        :disabled="!isInit"
      >sign in</el-button>
      <el-button
        type="primary"
        icon="fas fa-edit"
        @click="handleClickSignOut"
        v-if="isSignIn"
        :disabled="!isInit"
      >sign out</el-button>
      <!-- <el-button
        type="primary"
        icon="fas fa-edit"
        @click="handleClickDisconnect"
        :disabled="!isInit"
      >disconnect</el-button> -->
      <i class="fas fa-edit"></i>
      <p>isInit: {{isInit}}</p>
      <p>isSignIn: {{isSignIn}}</p>
      <p>isSignIn: {{token}}</p> 
      <button class="btn btn-primary" @click="getPhotos" :disabled="!token">Get Photos</button>
      <div class="images-container">
        <img @click="$emit('upload',uploadPhoto($event.target.alt))" v-for="photo in photos" :src="`${photo.thumbnail}=w${thulbnailWidth}-h${thulbnailHeight}-c`" :key="photo.id" :alt="photo.id">
      </div>
      <button class="btn btn-success" @click="getPhotos" :disabled="!nextpage">Get More Photos</button>
    </el-row>
  </div>
</template>

<script>
/* eslint-disable */
export default {
  name: "GooglePhotos",
  props: {
    thulbnailWidth: {
      type: String,
      required: false,
      default: "200",
    },
    thulbnailHeight: {
      type: String,
      required: false,
      default: "200",
    },
  },
  data() {
    return {
      isInit: false,
      isSignIn: false,
      token: null,
      nextpage: null,
      photos: [],
    };
  },
  methods: {
    uploadPhoto(src){
      let obj = this.photos.find(obj => obj.id == src)
      return `${obj.thumbnail}=w${obj.props.width}-h${obj.props.height}`
    },
    getPhotos(){
      console.log("hello");
      let myHeaders = new Headers();
      myHeaders.append("Authorization", `Bearer ${this.token}`);

      let requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
      };
      const url = this.nextpage ? `https://photoslibrary.googleapis.com/v1/mediaItems?pageToken=${this.nextpage}` 
                              : `https://photoslibrary.googleapis.com/v1/mediaItems`;  
      fetch(url, requestOptions)
        .then(response => response.json())
        .then((result) => {
            this.nextpage = null;
          for (const mediaItem of result.mediaItems) {
            this.photos.push({
              id: mediaItem.filename,
              thumbnail: mediaItem.baseUrl,
              props: {
                width: mediaItem.mediaMetadata.width,
                height: mediaItem.mediaMetadata.height,
              }
            })
          }
          // if (result.nextPageToken) {
            this.nextpage = result.nextPageToken ? result.nextPageToken : null; 
          // }
          console.log(result);
        })
        .catch(error => console.log('error', error));
    },
    handleClickLogin() {
      this.$gAuth
        .getAuthCode()
        .then(authCode => {
          //on success
          console.log("authCode", authCode);
        })
        .catch(error => {
          //on fail do something
          console.error(error);
        });
    },

    handleClickSignIn() {
      this.$gAuth
        .signIn()
        .then(GoogleUser => {
          //on success do something
          const loginObject = this.$gAuth.GoogleAuth.currentUser.get().getAuthResponse(); 
         
          this.token = loginObject.access_token;
          this.isSignIn = this.$gAuth.isAuthorized;
          this.getPhotos()
        })
        .catch(error => {
          //on fail do something
          console.error(error);
        });
    },

    handleClickSignOut() {
      this.$gAuth
        .signOut()
        .then(() => {
          //on success do something
          this.isSignIn = this.$gAuth.isAuthorized;
          console.log("isSignIn", this.$gAuth.isAuthorized);
        })
        .catch(error => {
          //on fail do something
          console.error(error);
        });
    },

    handleClickDisconnect() {
      window.location.href = `https://www.google.com/accounts/Logout?continue=https://appengine.google.com/_ah/logout?continue=${window.location.href}`;
    }
  },

  created() {
    let that = this;
    let checkGauthLoad = setInterval(function() {
      that.isInit = that.$gAuth.isInit;
      that.isSignIn = that.$gAuth.isAuthorized;
      if (that.isInit) clearInterval(checkGauthLoad);
    }, 1000);
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
</style>
