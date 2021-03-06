const ipfsearch = require("ipfsearch-index");
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('db.sqlite3');
let indexer = new ipfsearch.Indexer();
let i = 0;
db.each("SELECT torrent.infohash, torrent.name, torrent.length, torrent.added, peercount.seeders, peercount.leechers, peercount.completed FROM torrent INNER JOIN peercount on torrent.infohash = peercount.infohash ORDER BY peercount.scraped DESC", function (err, row) {
    if (err)
        console.error(err);
    if (row["seeders"] > 0) {
        indexer.addToIndex(new Torrent(row["infohash"], row["name"], row["length"], row["seeders"], row["leechers"], row["completed"]));
    }
    i++;
}, function (err, num) {
    console.log("Read all " + i + " records.");
    console.log("Persisting " + num + " records.");
    indexer.persist("../website/generated/inv", "../website/generated/inx", "Urban Guacamole", "Torrent Paradise index", "", 1000);
});
class Torrent extends ipfsearch.Document {
    constructor(id, text, size, seeders, leechers, completed) {
        super(id, text);
        this.len = size;
        this.s = seeders;
        this.l = leechers;
        this.c = completed;
    }
}
