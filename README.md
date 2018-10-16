<h1>Hypertube</h1>
<p>Web app' for downloading/streaming torrents. Group project.</p>

<h2>Subject</h2>
<p>Hypertube is the third 42's web project and last before intermediate internship.</p>

<p><strong>Grade: 125 / 100 (max)</strong></p>

<p><em>French subject --> cf hypertube.fr.pdf</em></p>

<h2>Stack</h2>
<ul>
  <li>
    <p>Back:</p>
    <ul>
      <li>Node.js express micro-framework</li>
      <li>MongoDb with mongoose ORM</li>
      <li>Torrent-stream</li>
      <li>FFMPEG</li>
      <li>API calls</li>
    </ul>
  </li>
  <li>
    <p>Front:</p>
      <ul>
        <li>Vue.js 2 with webpack, vue-router and vue-resource</li>
        <li>twitter bootstrap</li>
        <li>jquery, moment.js, video.js ...</li>
        <li>Getting Started</li>
        <li>Git clone parent repo and open a terminal.</li>
      </ul>
  </li>
</ul>

<h2>Getting start</h2>
<p>Git clone parent repo 'portfolio' and open a terminal.</p>

<p>Setup mongoDb :</p>
<pre>
  <code>
    mongod --dbpath "{mongoDB path}/.database"
    mongo
    use hypertube
    db.createUser({user: "hypertube", pwd: "hypertube", roles: ["readWrite"]})
  </code>
</pre>

<p>Setup Back server : </p>
<pre>
  <code>
    npm install hypertube/api
    npm start hypertube/api
  </code>
</pre>

<p>Setup Front server :</p>
<pre>
  <code>
    npm install hypertube/app
    npm run dev hypertube/app
  </code>
 </pre>
 
<h2>Notes</h2>
<ul>
  <li>Team work</li>
  <li>API RESTful</li>
  <li>Single Page App' with Vue.js 2</li>
  <li>Authentication and connexion system:
    <ul>
        <li>local</li>
       <li>OAuth protocol for facebook and 42</li>    
    </ul>
  </li>
  <li>Proper data validation for security concern</li>
  <li>Edit profile</li>
  <li>Browse other user's profile / your own</li>
  <li>Browse movies / TV shows</li>
  <li>Multiple torrent sources</li>
  <li>Torrent's file selection</li>
  <li>Downloading torrent</li>
  <li>Live encoding for video stream</li>
  <li>Stream video</li>
  <li>Link video to subtitle's torrent</li>
  <li>Comments system</li>
  <li>Search and filter movies / TV shows</li>
  <li>Seen / Unseen movie systems</li>
  <li>flash message system</li>
  <li>Emailing for account validation and forgotten password</li>
  <li>File uploading</li>
  <li>Responsive design</li>
  <li>POO</li>
  <li>Firefox and Chrome support</li>
</ul>
