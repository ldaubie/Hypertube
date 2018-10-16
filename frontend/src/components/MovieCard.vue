<template>
    <div>
        <div class="movie-card row justify-content-center">
            <div class="col-xl-1 col-lg-1 col-md-1 col-sm-1 col-xs-1">
            </div>
            <div class="movie-card-container col-xl-10 col-lg-10 col-md-10 col-sm-10 col-xs-10">

                <img :src="img_src" alt="cover " class="cover thumbnail"  />
                <router-link class="back" :to="{name: 'Login'}"><button type="button" class="btn btn-block btn-large btn-github">{{Version('back')}}</button></router-link>
                <div class="hero" :style="img_back">
                    <div class="details">
                        <div class="title1">{{movie.original_title}}</div>
                        <div class="title2">{{movie.tagline}}</div>
                    </div>
                </div>
                <div class="description row justify-content-center">
                    <div class="col-md-1 col-sm-1 col-xs-1" ></div>
                    <div class="column1 row col-md-4 col-sm-4 col-xs-4" >
                        <p class="text-left">{{Version('released')}}{{movie.release_date}}</p>
                        <p class="text-left">{{Version('runtime')}}{{movie.runtime}}mn</p>
                        <p class="text-left">{{Version('genres')}}</p>
                        <div class="tag" v-for="(id, index) in movie.genres">{{id.name}}</div>
                    </div> 
                    <div class="column2 col-md-7 col-sm-7 col-xs-7">
                        <div class="torrent-list" v-if="list_torrent">
                            <div class="ui active dimmer tor" v-if="load">
                                <div class="loader ui"></div>
                            </div>
                            <div class="torrent" v-for="(id, index) in movie.torrents">
                                <div @click="list(id.hash)">{{id.title}} <br/> seed: {{id.seeders}}</div>
                            </div>
                            <div class="torrent" v-if="empty_torrent">
                                <div>{{Version('torrent')}}</div>
                            </div>
                        </div>
                        <div class="torrent-list" v-else>
                            <div class="ui active dimmer tor" v-if="load">
                                <div class="loader ui"></div>
                            </div>
                            <span class="glyphicon glyphicon-menu-left"  @click="list_torrent = true, empty_torrent = false"></span>
                            <div class="torrent" v-for="(id, index) in torrent.response.videos  ">
                                <router-link :to="{name: 'Video', params : {hash: hash, movie_id: id._id}}">
                                    <div>{{id.filename}}<br></div>
                                </router-link>
                            </div>
                            <div class="torrent-list" v-if="torrent.response.subtitles.length">  
                                {{Version('Sub')}}
                            </div>
                            <div class="torrent" v-if="empty_torrent">
                                <div>{{Version('torrent')}}</div>
                            </div>
                        </div>
                        
                    </div>
                    <div class="column2 col-md-7 col-sm-7 col-xs-7">
                    <div v-if="imdb_link" class="torrent-list">
                        <a :href="imdb_link"> <img src="../assets/images/logo-imdb.svg"></a>
                        <span class="likes">{{movie.vote_average}}</span>
                        <span class="hidden-xs glyphicon glyphicon-star icon-star"></span>
                    </div>
                    <p class="description">{{movie.overview}}</p>
                    <div class="avatars" v-if="movie.cast">
                        <p>{{Version('actors')}}</p>
                        <span  data-placement="top"  v-for="(actor, index) in movie.cast"  >
                            <img  class="round-img" :title="actor.name" :src="concat_cast(actor.profile_path)" :alt="actor.name" />
                        </span>
                    </div>
                    <div class="avatars" v-if="movie.director">
                        <p>{{Version('director')}}</p>
                        <img class="round-img" :title="movie.director.name" :src="concat_cast(movie.director.profile_path)" :alt="movie.director.name" />
                    </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
</div>
</template>
<script>
    import movies_search from "@/services/Search.js"
    import trad from '@/services/LanguageStore.js'
    import message from '../lang/MovieCard.js'
    export default {
      props: ['userId'],
      params: ['id'],
      data () {
       return {
        movie: '',
        movie_id: '',
        id: '',
        img_size: 'https://image.tmdb.org/t/p/w342',
        img_size_back: 'http://image.tmdb.org/t/p/w1280/',
        img_size_cast: 'http://image.tmdb.org/t/p/w45/',
        imdb_link: '',
        img_id: '',
        img_id_back: '',
        img_src: '',
        img_back: '',
        img_cast: '',
        movies_search,
        load : false,
        list_torrent : true,
        torrent : '',
        hash: '',
        empty_torrent: false
    }
},

created () {
    this.movie_id = this.$route.params.id
    this.$http.get(`http://localhost:3000/search/one/${movies_search.data.category}/${this.movie_id}`).then((response) => {
        this.movie = response.body
        this.get_torent()
        this.img_id_check()
        this.concat_img()
    })
},

methods:{
   Version(key) {
    return trad.getContent(message)[key]
},

concat_img(){
    this.img_src = this.img_size.concat(this.img_id);
    if (this.movie.imdb_id)
        this.imdb_link = 'http://www.imdb.com/title/'.concat(this.movie.imdb_id);
    this.img_back = "background: url('" + this.img_size_back.concat(this.img_id_back) + "'); max-width: 1280px;";

},

concat_cast(cast_id){
    if(cast_id)
        return(this.img_size_cast.concat(cast_id));
    else
     return(this.img_size_cast.concat('/fW37Gbk5PJZuXvyZwtcr0cMwPKY.jpg'));
},

get_torent(){
    this.load = true;
    if (movies_search.data.category == "movie")
        var year = this.movie.release_date.substr(0,4)
    this.$http.get(`http://localhost:3000/movies/${movies_search.data.category}/${this.movie.title}/${year}/${this.movie_id}`).then((response) => {
        this.load = false;
        this.movie.torrents = response.body.torrents
        if (!response.body.torrents.length)
        {
            this.empty_torrent = true;
        }
        this.$mount()
    }, response => { this.load = false; this.empty_torrent = true;})
},

img_id_check(){
    if(this.movie.poster_path){
     this.img_id = this.movie.poster_path;
     this.img_id_back = this.movie.backdrop_path;
 }

 else if(this.movie.backdrop_path){
     this.img_id = this.movie.backdrop_path;
 }
 else{
     this.img_id = '/q1i8QHiHZ1cukG5iOxai8pydmoa.jpg';

 }
 if(!(this.movie.backdrop_path)){
     this.img_id_back = '/lBVtKWWXH46r7oMLdfT3quioaVb.jpg';
 }
},

list(hash){
    this.hash = hash
    this.load = true;
    this.$http.get(`http://localhost:3000/torrents/${hash}`).then((response)=>{
        this.torrent = response.body;
        this.load = false;
        this.list_torrent = false;
        if (!response.body.response.videos.length)
        {
            this.empty_torrent = true;
        }
    })
},
},
}
</script>

<style scoped>
    .movie-card {
        font: 14px/22px "Lato", Arial, sans-serif;
        color: #A9A8A3;
        padding: 40px 0;
    }

    .movie-card-container {
        margin: 0, auto;
        max-width: 1305px;
        background: #F0F0ED;
        border-radius: 5px;
        margin-left: 11vw;
    }
    .icon-star{
        color: #6ac045;
        margin-left: 10px;
        font-size: 1.1em;
    }

    .hero {
        height: 342px;

        margin:0;
        position: relative;
        overflow: hidden;
        z-index:1;
        border-top-left-radius: 5px;
        border-top-right-radius: 5px;

    }

    .hero:before {
        content:'';
        width:100%; height:100%;
        position:absolute;
        overflow: hidden;
        top:0; left:0;
        z-index:-1;
        transform: skewY(-2.2deg);
        transform-origin:0 0;
        //chrome antialias fix
        -webkit-backface-visibility: hidden;

    }

    .cover {
        position: absolute;
        max-width: 190px;
        top: 160px;
        left: 40px;
        z-index: 2;
    }



    .details {

        padding: 190px 0 0 280px;
    }

    .title1 {
        color: white;
        font-size: 44px;
        margin-bottom: 13px;
        position: relative;

        span {
            position: absolute;
            top: 3px;
            margin-left: 12px;
            background: #C4AF3D;
            border-radius: 5px;
            color: #544C21;
            font-size: 14px;
            padding: 0px 4px;

        }
    }

    .title2 {
        color: #C7C1BA;
        font-size: 23px;
        font-weight: 300;
        margin-bottom: 15px;
    }




    .description {

        bottom: 0px;
        margin-left: 1vw; 
        font-size: 16px;
        line-height: 26px;
        color: #B1B0AC;

    }

    .column1 {
        min-width: 190px;
        padding-top: 120px;

    }

    .tag {
        background: #ddd;
        border-radius: 10px;
        margin-right: 4px;
        margin-top: 4px;
        max-width: 150px;
    }
    .torrent-list{
        padding-bottom: 2em;
    }
    .torrent {
        background: white;
        border-radius: 10px;
        margin-right: 4px;
        margin-top: 4px;
        cursor: pointer;
        max-width: 500px;
        display: block;
        margin-right: auto;
        margin-left: auto;
        color: #B1B0AC;
        overflow-x: auto;
    }

    .torrent:hover {
        background: #ddd;
        color: #B1B0AC;
    }

    .column2 {
        display: flex;
        flex-direction: column;
        padding-top: 30px;

    }    
    .column3 {
        margin: 0 auto;
    }

    .avatars {

        margin-top: 23px;
        margin-bottom: 23px;

        img {
            cursor: pointer;

        }

        img:hover {
            opacity: 0.6;
        }

        span:hover {
            text-decoration: none;
        }

    }
    .round-img{
        width: 48px;
        height: 65px;
        -webkit-border-radius: 50%;
    }
    
    .ui.active.dimmer.tor{
        background:  #F0F0ED;
    }

    a {
        text-decoration : none;
    }

    .glyphicon-menu-left{
        cursor:pointer;
    }
    .back {
        margin-top: 10px;
        margin-right: 10px;
        float: left;
    }
</style>
