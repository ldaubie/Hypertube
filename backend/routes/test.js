const   express = require('express'),
        router = express.Router(),
        TorrentModel = require('../Models/Torrent.js'),
        Config = require('../config/config.js');

router.get('/', function(req, res)
{
    let tm = new TorrentModel({imdbId: 'tt2911666',
        magnet: 'magnet:?xt=urn:btih:62d03a5c70a4d05470d6a80810f268f6f9b4bd24&dn=John+Wick+2014+UHD+4K+2160p+HEVC10+SDR+Multi+Dolby+ATMOS+7.1+-Ze&tr=udp://tracker.leechers-paradise.org:6969&tr=udp://zer0day.ch:1337&tr=udp://tracker.coppersurfer.tk:6969&tr=udp://public.popcorn-tracker.org:6969',
        hash: '62D03A5C70A4D05470D6A80810F268F6F9B4BD24'})
        tm.save()
        TorrentModel.create({imdbId: 'tt3748528',
        magnet: 'magnet:?xt=urn:btih:4EFBD93BE04228A5D8E51CC19D8CD405E209DB1A&dn=Rogue+One+(2016)+[YTS+AG]&tr=udp://tracker.coppersurfer.tk:6969/announce&tr=udp://p4p.arenabg.ch:1337/announce&tr=udp://tracker.leechers-paradise.org:6969/announce&tr=udp://eddie4.nl:6969/announce&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://9.rarbg.to:2710/announce&tr=udp://9.rarbg.me:2710/announce&tr=udp://9.rarbg.com:2710/announce&tr=udp://open.demonii.com:1337/announce&tr=udp://tracker.openbittorrent.com:80/announce&tr=udp://tracker.trackerfix.com:80/announce',
        hash: '4EFBD93BE04228A5D8E51CC19D8CD405E209DB1A'})
        TorrentModel.create({imdbId: 'tt0081178',
        magnet: 'magnet:?xt=urn:btih:764105a56e631bd83fd87f420f9daafcdd489dd2&dn=The+Monster+Club+(1981)+1080p+BrRip+x264+-+YIFY&tr=udp://tracker.openbittorrent.com:80/announce&tr=udp://glotorrents.pw:6969/announce&tr=udp://tracker.openbittorrent.com:80/announce&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://zer0day.to:1337/announce&tr=udp://tracker.coppersurfer.tk:6969/announce',
        hash: '764105A56E631BD83FD87F420F9DAAFCDD489DD2'})
    res.end()
})

module.exports = router;