<template>
    <div class="movie-card row justify-content-center">
        <div class="col-xl-1 col-lg-1 col-md-1 col-sm-1 col-xs-1">
        </div>
        <div class="movie-card-container col-xl-10 col-lg-10 col-md-10 col-sm-10 col-xs-10">

            <a href="#"><img :src="img_src" alt="cover " class="cover thumbnail"  /></a>

            <div class="hero" :style="img_back">

                <div class="details">

                    <div class="title1">{{movie.name}}</div>

                </div> <!-- end details -->

            </div> <!-- end hero -->

            <div class="description row justify-content-center">
                <div class="col-md-1 col-sm-1 col-xs-1" ></div>
                <div class="column1 row col-md-4 col-sm-4 col-xs-4" >
                    <p class="text-left">{{Version('released')}}{{movie.first_air_date}}</p>
                    <p class="text-left">{{Version('seasons')}}{{movie.number_of_seasons}}</p>
                    <p class="text-left">{{Version('episodes')}}{{movie.number_of_episodes}}</p>
                    <p class="text-left">{{Version('genres')}}</p>
                    <div class="tag" v-for="(id, index) in movie.genres">{{id.name}}</div>


                </div> <!-- end column1 -->

                <div class="column2 col-md-7 col-sm-7 col-xs-7">

                    <div class="torrent-list">
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
                    <div class="avatars" v-if="movie.created_by">
                        <p>{{Version('director')}}</p>
                        <span  data-placement="top"  v-for="(director, index) in movie.created_by"  >
                            <img class="round-img" :title="director.name" :src="concat_cast(director.profile_path)" :alt="director.name" />
                        </span>
                    </div>
                    <div class="column3 col-md-7 col-sm-7 col-xs-7">
                        <p>{{Version('torrent_list')}}</p>

                    </div>
                    <div class="column3 col-md-7 col-sm-7 col-xs-7">
                        <div class="row row-eq-height"  v-model="movie.seasons" :movie="movie">

                            <div v-for="(Season, index) in movie.seasons" class="col-sm-12 col-xs-12 thumb col-height ">

                                <div class="img-overlay" @click="ToggleEpisodes(index)" >
                                    <img :src="concat_season_img(Season.poster_path)" alt="cover" class="image">

                                    <div class="middle">
                                        <div class="text">Season: {{Season.season_number}}</div>
                                        <div class="text" v-if="Season.air_date">{{Season.air_date}}</div>
                                    </div>

                                </div>
                                <ul class="episodes" v-if="is_open === index">

                                    <ul v-for="(episode, index) in Season.episode_count" @click="ToggleTorrents(index)" >Episode {{index +1}}
                                        <div v-if="load && show_torrents === index && cl" ><div class="ui active centered inline loader" ></div></div>
                                    <div class="torrent" v-if="show_torrents === index && cl" v-for="(torrent, key) in movie.torrents">
                                        <!-- <router-link :to="{name: link, params: { hash: torrent.hash , movie_id: movie_id}} "> -->
                                            <div @click="list(torrent.hash, index)">{{torrent.title}} <br/> seed: {{torrent.seeders}}</div>
                                        <!-- </router-link> -->
                                    </div>
                                    <div class="torrent" v-if="empty_torrent && show_torrents === index">
                                        <div>{{Version('torrent')}}</div>
                                    </div>
                                    <div class="torrent2" v-if="index == index2 && !cl">
                                            <div class="ui active centered inline loader" v-if="loading">
                                            </div>
                                            <div v-else>
                                                <span class="glyphicon glyphicon-menu-left"  @click="cl = true, empty_torrent = false"></span>
                                                <div class="torrent" v-for="(id, index) in torrent.response.videos">
                                                    <router-link :to="{name: 'Video', params : {hash: hash, movie_id: id._id}}">
                                                        <div>{{id.filename}}<br></div>
                                                    </router-link>
                                                </div>
                                                <div class="torrent-list" v-if="torrent.response.subtitles.length">  
                                                    {{Version('Sub')}}
                                                </div>
                                            </div>
                                    </div>
                                    </ul>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div> <!-- end avatars -->
            </div> <!-- end column2 -->
        </div> <!-- end description -->
    </div> <!-- end container -->
</div> <!-- end movie-card -->
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
				imdb_link: 'http://www.imdb.com/title/',
				img_id: '',
				img_id_back: '',
				img_src: '',
				img_back: '',
				img_cast: '',
				movies_search,
				load : false,
				is_open: false,
                show_torrents: false,
				link: 'Video',
                cl:true,
                hash: '',
                loading: false,
                index2: '',
                torrent: '',
                empty_torrent: false

			}
		},
		created () {
			this.movie_id = this.$route.params.id
			this.$http.get(`http://localhost:3000/search/one/tv/${this.movie_id}`).then((response) => {
				this.movie = response.body
				this.img_id_check()
				this.concat_img()
			})


		},
		methods:{

			ToggleEpisodes: function(index, event) {
                this.empty_torrent = false;
                if(this.is_open === index)
                {
                	this.is_open = false;
					this.show_torrents = false;
					this.movie.torrents = [];
				}
                else
                {
					this.is_open = index;
					this.show_torrents = false;
					this.movie.torrents = [];
                }

			},
			ToggleTorrents: function(index, event) {
                this.empty_torrent = false;
				if(this.show_torrents === index)
                {
                	this.show_torrents = false;
					this.movie.torrents = [];

				}
				else
                {
					this.movie.torrents = [];
                	this.show_torrents = index;
				    this.get_torent(index);
                }
			},
			Version(key) {
				return trad.getContent(message)[key]
			},
			concat_season_img(poster_path){
				if(poster_path)
					return(this.img_size.concat(poster_path));
				else
					return(this.img_size.concat('/fW37Gbk5PJZuXvyZwtcr0cMwPKY.jpg'));

			},
			concat_img(){
				this.img_src = this.img_size.concat(this.img_id);
				this.imdb_link = this.imdb_link.concat(this.movie.imdb_id);
				this.img_back = "background: url('" + this.img_size_back.concat(this.img_id_back) + "'); max-width: 1280px;";

			},
			concat_cast(cast_id){
				if(cast_id)
					return(this.img_size_cast.concat(cast_id));
				else
					return(this.img_size_cast.concat('/fW37Gbk5PJZuXvyZwtcr0cMwPKY.jpg'));
			},
			get_torent(index){
				this.load = true;
                if(this.is_open < 10)
                	var S = 'S0';
				else
					var S = 'S';
				if(this.show_torrents +1 < 10)
					var E = 'E0';
				else
					var E = 'E';
				this.$http.get(`http://localhost:3000/movies/tv/${this.movie.name} ${S}${this.is_open}${E}${this.show_torrents +1}/0/${this.movie_id}`, {
                        before(request) {
                            if (this.previousRequest){
                                this.previousRequest.abort();
                            }
                            this.previousRequest = request;
                        }
                    }).then((response) => {
					this.load = false;
					this.movie.torrents = response.body.torrents
					this.$mount()
                    if (!response.body.torrents.length)
                    {
                        this.empty_torrent = true;
                    }
				}, response => {});
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
            list(hash, index){
                this.hash = hash;
                this.index2 = index;
                this.cl = false;
                this.loading = true;
                this.$http.get(`http://localhost:3000/torrents/${hash}`).then((response)=>{
                    this.torrent = response.body;
                    this.loading = false;
                    if (!response.body.response.videos.length)
                    {
                        this.empty_torrent = true;
                    }
                })
            }
		},

	}

</script>
<style>
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

    .loader2 {
        border: 16px solid #f3f3f3; /* Light grey */
        border-top: 16px solid #3498db; /* Blue */
        border-radius: 50%;
        width: 120px;
        height: 120px;
        animation: spin 2s linear infinite;
        justify-content: center;
    }

    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
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
        overflow-x: auto;
    }

    .torrent:hover {
        background: #ddd;
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

    .img-overlay{
        position: relative;
        width: 100%;

    }
    .image {
        opacity: 1;
        display: block;
        width: 100%;
        height: auto;
        transition: .5s ease;
        backface-visibility: hidden;
    }
    .img-overlay img {
        height: 30vw;
        max-height: 525px;
    }

    .middle {
        transition: .5s ease;
        opacity: 0;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        -ms-transform: translate(-50%, -50%)
    }

    .img-overlay:hover .image {
        opacity: 0.3;
    }

    .img-overlay:hover .middle {
        opacity: 1;
    }

    .text {
        font-weight: bold;
        color: black;
        font-size: 25px;
        padding-bottom: 1em;

    }
    .thumb{
        padding-bottom: 15px;
    }
    ul{
        cursor: pointer;

    }


</style>
