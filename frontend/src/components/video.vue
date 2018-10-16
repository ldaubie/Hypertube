<template>
  <div class="container">
  <div class="ui active dimmer" v-if="loading">
    <div class="loader ui"> <p>Converting video</p></div>
    </div>
    <div v-if="showVideo">
      <video-player id="lecteur" ref="videoPlayer" :options="playerOptions" @play="onPlayerPlay($event)"/>
    </div>
    <br />
    <button @click="returnTo()" type="button" class="back btn btn-block btn-large btn-github">{{Version('back')}}</button>
    <br />
    <comments />
  </div>
</template>

<script>
  import Comments from '@/components/partials/comments/Comments.vue'
  import { videoPlayer } from 'vue-video-player'
  import trad from '@/services/LanguageStore.js'
  import message from '../lang/MovieCard.js'
  import router from '@/router/index.js'
  import notif from "@/services/NotificationStore.js"
  export default {
    data() {
      return {
        showVideo : false,
        cheat: 0,
        loading: false,
        mp4: false,
        playerOptions: {
          sources : [],
          tracks : [],
          crossorigin : "use-credentials",
          countdown: ''
        }
      }
    },
    created() {
      this.$http.get('http://localhost:3000/torrents/subtitles/' + this.$route.params.movie_id).then(
      (res) => {
          let array = res.body.response;
          let size = array.length;
      var apiRoad = `http://localhost:3000/torrents/` + this.$route.params.hash + `/` + this.$route.params.movie_id


          if (size)
          {
            for (let i = 0; i  < size; i++)
            {
              this.playerOptions.tracks.push({ 
                kind: 'subtitles',
                src: 'http://localhost:3000/torrents/subtitles/' + array[i]._id + '/sub.vtt',
                label: (i + 1).toString(),
              })
              if (i + 1 === size){
					  this.playerOptions.sources.push({ src: apiRoad + '.webm', type: 'video/webm'})
				  }
                this.showVideo = true
            }
          }
          else
          {
			  if(navigator.userAgent.indexOf("Chrome") && !size)
			  {
				  this.playerOptions.sources.push({ src: apiRoad + '.mp4', type: 'video/mp4'})
                  this.mp4 = true
			  }
			  else
			  {
				  this.playerOptions.sources.push({ src: apiRoad + '.webm', type: 'video/webm'})
			  }
            this.showVideo = true
          }
        },
        (res) => {
          this.showVideo = true
          notif.showNotification(
            res.body ? (res.body.err.message ? res.body.err.message : res.body.message) : "database error",
            "alert-danger",
            true
            )
        })
    },

    methods:{
    onPlayerPlay(player) {
        this.loading = false;
        var load = this;
        var lecteur = document.getElementById('lecteur').firstChild.firstChild
        if (!this.cheat)
        {
          this.cheat = 1;
          lecteur.pause();
          this.loading = true;
          setTimeout(function(){load.loading = false}, 30000)
        }
        else{
        	var time = 0
        }
      },
      onPlayerStop(player){
      },
      load(){
      },
      returnTo () {
        router.go(-1)
      },

      Version(key) {
        return trad.getContent(message)[key]
      },
    },

    components: {
      Comments,
      videoPlayer
    },
  }
</script>

<style scoped>
  .back {
    float: left;
    width : auto;
  }
</style>