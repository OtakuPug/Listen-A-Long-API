var express = require('express');
var sqlite3 = require('sqlite3');
var router = express.Router();

/**
 * @api {get} / Get Home Page
 * @apiName GetHome
 * @apiGroup General
 * @apiDescription Returns the home page of the Music API
 */
router.get('/', function (req, res, next) {
  res.render('index', {title: 'Music API'});
});
/**
 * @api {get} /get-all-songs/:dbname Get All Songs
 * @apiName GetAllSongs
 * @apiGroup Songs
 * @apiDescription Retrieve all songs from the specified database
 * @apiParam {String} dbname Name of the database
 */
router.get('/get-all-songs/:dbname', function (req, res, next) {
  const db = new sqlite3.Database(req.params.dbname + '.db');
  let allSongs = db.all('SELECT * FROM songs', (error, rows) => {
    if (error) {
      res.status(500).send(error.message);
      return;
    }
    res.send(rows);
  });

});
/**
 * @api {get} /get-song-by-name/:dbname/:songname Get Song by Name
 * @apiName GetSongByName
 * @apiGroup Songs
 * @apiDescription Retrieve a specific song by name
 * @apiParam {String} dbname Name of the database
 * @apiParam {String} songname Name of the song to search for
 */
router.get('/get-song-by-name/:dbname/:songname', function (req, res, next) {
  const db = new sqlite3.Database(req.params.dbname + '.db');
  db.get('SELECT * FROM songs WHERE Name LIKE ' + '\'' + req.params.songname + '\'', (error, rows) => {
    if (error) {
      res.status(500).send(error.message);
    }
    res.send(rows);
  })
});
/**
 * @api {get} /get-songs-by-artist/:dbname/:artistname Get Songs by Artist
 * @apiName GetSongsByArtist
 * @apiGroup Songs
 * @apiDescription Retrieve all songs by a specific artist
 * @apiParam {String} dbname Name of the database
 * @apiParam {String} artistname Name of the artist to search for
 */
router.get('/get-songs-by-artist/:dbname/:artistname', function (req, res, next) {
  const db = new sqlite3.Database(req.params.dbname + '.db');
  db.get('SELECT * FROM songs WHERE Artist LIKE ' + '\'' + req.params.artistname + '\'', (error, rows) => {
    if (error) {
      res.status(500).send(error.message);
    }
    res.send(rows);
  })
});
/**
 * @api {get} /get-songs-by-album/:dbname/:albumname Get Songs by Album
 * @apiName GetSongsByAlbum
 * @apiGroup Songs
 * @apiDescription Retrieve all songs from a specific album
 * @apiParam {String} dbname Name of the database
 * @apiParam {String} albumname Name of the album to search for
 */
router.get('/get-songs-by-album/:dbname/:albumname', function (req, res, next) {
  const db = new sqlite3.Database(req.params.dbname + '.db');
  db.get('SELECT * FROM songs WHERE Album LIKE ' + '\'' + req.params.albumname + '\'', (error, rows) => {
    if (error) {
      res.status(500).send(error.message);
    }
    res.send(rows);
  })
});
/**
 * @api {get} /custom-query-singular/:dbname Custom Query (Single Result)
 * @apiName CustomQuerySingular
 * @apiGroup Custom
 * @apiDescription Execute a custom SQL query that returns a single result
 * @apiParam {String} dbname Name of the database
 * @apiBody {String} query SQL query to execute
 */
router.get('/custom-query-singular/:dbname', function (req, res, next) {
  const db = new sqlite3.Database(req.params.dbname + '.db');
  const query = req.body.query;
  db.get(query, (error, rows) => {
    if (error) {
      res.status(500).send(error.message);
    }
    res.send(rows);
  })
});
/**
 * @api {get} /custom-query-multiple/:dbname Custom Query (Multiple Results)
 * @apiName CustomQueryMultiple
 * @apiGroup Custom
 * @apiDescription Execute a custom SQL query that returns multiple results
 * @apiParam {String} dbname Name of the database
 * @apiBody {String} query SQL query to execute
 */
router.get('/custom-query-multiple/:dbname', function (req, res, next) {
  const db = new sqlite3.Database(req.params.dbname + '.db');
  const query = req.body.query;
  console.log(query);
  db.all(query, (error, rows) => {
    if (error) {
      res.status(500).send(error.message);
    }
    res.send(rows);
  })
});
/**
 * @api {delete} /delete-song/:dbname/:songname Delete Song
 * @apiName DeleteSong
 * @apiGroup Songs
 * @apiDescription Delete a specific song by name
 * @apiParam {String} dbname Name of the database
 * @apiParam {String} songname Name of the song to delete
 */
router.delete('/delete-song/:dbname/:songname', function (req, res, next) {
  const db = new sqlite3.Database(req.params.dbname + '.db');
  const query = req.body.query;
  db.all('DELETE FROM songs WHERE Name LIKE ' + '\'' + req.params.songname + '\'', (error, rows) => {
    if (error) {
      res.status(500).send(error.message);
    }
    res.send('successfully deleted ' + req.params.songname);
  })
});
/**
 * @api {delete} /delete-all-songs/:dbname Delete All Songs
 * @apiName DeleteAllSongs
 * @apiGroup Songs
 * @apiDescription Delete all songs from the database
 * @apiParam {String} dbname Name of the database
 */
router.delete('/delete-all-songs/:dbname', function (req, res, next) {
  const db = new sqlite3.Database(req.params.dbname + '.db');
  const query = req.body.query;
  db.all('DELETE FROM songs', (error, rows) => {
    if (error) {
      res.status(500).send(error.message);
    }
    res.send(rows);
  })
});
/**
 * @api {put} /update-song/:dbname/:songname Update Song
 * @apiName UpdateSong
 * @apiGroup Songs
 * @apiDescription Update a specific song's information
 * @apiParam {String} dbname Name of the database
 * @apiParam {String} songname Name of the song to update
 * @apiBody {Object} song Song object with updated properties
 * @apiBody {String} song.artist Artist name
 * @apiBody {String} song.album Album name
 * @apiBody {String} song.name Song name
 * @apiBody {Blob} song.data Song data
 */
router.put('/update-song/:dbname/:songname', function (req, res, next) {
  const db = new sqlite3.Database(req.params.dbname + '.db');
  const song = req.body;
  db.run("UPDATE songs SET Artist = $artist, Album = $album, Data = $data WHERE Name = $name", {
    $artist: song.artist.toLowerCase(),
    $album: song.album.toLowerCase(),
    $name: song.name.toLowerCase(),
    $data: song.data
  });
  res.send('song updated')
});
/**
 * @api {post} /create-database/:dbname Create Database
 * @apiName CreateDatabase
 * @apiGroup Database
 * @apiDescription Create a new database with songs table
 * @apiParam {String} dbname Name of the database to create
 */
router.post('/create-database/:dbname', function (req, res, next) {
  const db = new sqlite3.Database(req.params.dbname + '.db');
  db.run('CREATE TABLE songs (ID INTEGER PRIMARY KEY AUTOINCREMENT, Artist TEXT NOT NULL, Album TEXT NOT NULL, Name TEXT NOT NULL, Data BLOB)');
  res.send('created database ' + req.params.dbname);
});
/**
 * @api {post} /add-song/:dbname Add Song
 * @apiName AddSong
 * @apiGroup Songs
 * @apiDescription Add a new song to the database
 * @apiParam {String} dbname Name of the database
 * @apiBody {Object} song Song object to add
 * @apiBody {String} song.artist Artist name
 * @apiBody {String} song.album Album name
 * @apiBody {String} song.name Song name
 * @apiBody {Blob} song.data Song data
 */
router.post('/add-song/:dbname', function (req, res, next) {
  const db = new sqlite3.Database(req.params.dbname + '.db');
  const song = req.body;
  db.run("INSERT INTO songs (Artist, Album, Data, Name) VALUES ($artist, $album, $name, $data)", {
    $artist: song.artist.toLowerCase(),
    $album: song.album.toLowerCase(),
    $name: song.name.toLowerCase(),
    $data: song.data
  });
  res.send(JSON.stringify(req.body) + '\n' + req.params.dbname);
});

module.exports = router;
