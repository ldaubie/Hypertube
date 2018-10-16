/**
 ** Requirements
 **/
const   Config = require('../config/config.js'),
        fs = require('fs'),
        path = require('path');

/**
 ** Database requirements 
 **/
const   ObjectId = require('mongoose').Types.ObjectId,
        TorrentModel = require('../Models/Torrent.js'),
        VideoModel = require('../Models/Video.js'),
        SubtitleModel = require('../Models/Subtitle.js');
/**
 ** External dependencies
 **/
const   torrentStream = require('torrent-stream'),
        Subtitle = require('../modules/Subtitle.js'),
        isVideo = require('is-video'),
        isSubtitle = require('is-subtitle'),
        pump = require('pump'),
        fileName = require('file-name'),
        mime = require('mime');

function linkSubtitleToVideo( torId )
{
    VideoModel.find({ torrentId: torId }, (err, videos) => {
        console.log(videos);
        console.log(err);
        if (!err && videos !== null)
        {
            console.log('Linking subtitles to videos')
            if (videos.length === 1)
                SubtitleModel.update(
                    { videoId: null, torrentId: torId },
                    { $set: { videoId: videos[0]._id } },
                    { multi: true }/*,
                    function (err, raw) {
                        if (err) console.log(handleError(err))
                        console.log('The raw response from Mongo was ', raw);
                    }*/
                ).exec();
            else
            {
                let largestLength = null;
                videos.forEach((video) => {
                    if (video.filelength > largestLength){
                        SubtitleModel.update(
                            { videoId: null, torrentId: video.torrentId },
                            { $set: { videoId: video._id } },
                            { multi: true }/*,
                            function (err, raw) {
                                if (err) console.log(handleError(err))
                                console.log('The raw response from Mongo was ', raw);
                            }*/
                        ).exec();
                    }
                })
            }
        }
    })
}

function _getVideos( torId )
{
    return VideoModel.find({ torrentId: torId }, {torrentId: 0, name: 0, filepath: 0}, {sort: {filelength: -1}}).lean().exec()
}

function _getSubtitles( torId ){
    return SubtitleModel.find({torrentId: torId}).lean().exec();
}

function _getVideosAndSubtitles( torId , resolve) {
	Promise.all([_getVideos( torId ), _getSubtitles( torId )]).then((results) => {resolve({videos: results[0], subtitles: results[1]})}).catch((err) => {console.log(err); resolve({videos: [], subtitles: []})});
}

var Torrent = function ( TorrentHash )
{
    let EngineConf = Object.assign({}, Config.torrentEngineOpts)
    return new Promise(
        function( resolve , reject )
        {
            TorrentModel.findOneAndUpdate( { hash: TorrentHash }, { lastSeen: new Date() }, (err, tor) => {
                if (err)
                    reject(new Error(err))
                else if (tor == null)
                    reject(new Error('Torrent not found : ' + TorrentHash))
                else if (tor.nbVideo !== null)
                {
                    console.log('Torrent already loaded : ' + tor.nbVideo + ' videos')
                    _getVideosAndSubtitles(tor._id, resolve)
                }
                else   // If torrent was never fetched
                {
                    console.log('Initializing torrent ' + TorrentHash)
                    tor.nbVideo = 0
                    // Arrays of promises
                    let Videos = []
                    let Subtitles = []

                    let SubtitlesToConvert = []
                    // Fetching torrent files
                    EngineConf.path = path.join(EngineConf.path, TorrentHash)
                    var e = torrentStream( tor.magnet, EngineConf)
                    e.on('ready', function()
                    {
                        console.log('Torrent ' + TorrentHash + ' ready for file fetching')
                        e.files.forEach( function(file)
                        {
                            if (file.length < 100)
                                console.log('File too short : ', file.name)
                            else if (isVideo(file.name))
                            {
                                file.deselect()
                                console.log(file.name + ' recognized as video')
                                // Incrementing torrent video counter
                                tor.nbVideo = tor.nbVideo + 1
                                tor.save()
                                // Adding founded video to database
                                Videos.push(
                                    new Promise((resolve,reject) => {
                                        VideoModel.create({
                                            torrentId: tor._id,
                                            filepath: file.path,
                                            filename: file.name,
                                            filelength: file.length,
                                            movieDbId: tor.movieDbId,
                                            status: 'not downloaded'
                                        })
                                        .then( (res) => resolve(res) )
                                        .catch( (err) => reject(err) )
                                    })
                                )
                            }
                            else if (isSubtitle(file.name))
                            {
                                console.log(file.name + ' recognized as subtitle')
                                // Downloading subtitle
                                file.createReadStream()

                                Subtitle.add(file.path, file.name, tor._id)
                                .then( (newSub) => {
                                    // Convert to WebVTT if needed
                                    if (mime.lookup(newSub.filename) !== "text/vtt")
                                        SubtitlesToConvert.push({ id: newSub._id, basepath: EngineConf.path })
                                })
                            }
                            else
                                console.log(file.name + ' not recognized')
                        })
                        if (Videos.length)
                        {
                            Promise.all(Videos).then( () => {
  
                                if (Subtitles.length)
                                {
                                    Promise.all(Subtitles)
                                    .then( () => {
                                        linkSubtitleToVideo(tor._id)
                                    })
                                    .catch((err) => {
                                        console.log(err)
                                    })
                                }
                                console.log('Torrent\'s files fetching completed')
	                            _getVideosAndSubtitles(tor._id, resolve)
                            }, (err) => {
                                console.log('Error adding videos to torrent ' + TorrentHash)
                                reject(new Error(err))
                            })
                        }
                        else
                        {
                            e.destroy()
                            resolve([])
                        }
                    })
                    e.on('idle', function() {

                        console.log('- Idling -')
                        //console.log(SubtitlesToConvert.length)

                        if (SubtitlesToConvert.length)
                        {
                            let SubtitlesDownloaded = []
                            SubtitlesToConvert.forEach( (sub, basepath) => {
                                SubtitlesToConvert.push(Subtitle.convert( sub.id, sub.basepath ))
                            })
                            SubtitlesToConvert = [] // idle event can be triggered multiple time
                            Promise.all(SubtitlesDownloaded)
                            .then(() => {
                                linkSubtitleToVideo(tor._id)
                            })
                            .catch((err) => {
                                console.log(err)
                                //SubtitlesToDownload = [] // idle event can be triggered multiple time
                            })
                        }
                    })
                    .on('download', (pcs) => {
                        console.log('Downloading ' + pcs + ' of unknow subtitle')
                    })
                    .on('error', function(err)
                    {
                        tor.nbVideo = null
                        tor.save()
                        e.destroy()
                        console.log('Error fetching file in torrent ' + TorrentHash)
                        reject(new Error(err))
                    })
                }
            })
        }
    )
}

module.exports = Torrent;