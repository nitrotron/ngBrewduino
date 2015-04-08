var fs = require("fs");
var file = "./" + "test.db";
var exists = fs.existsSync(file);

if (!exists) {
    console.log("Creating DB file.");
    fs.openSync(file, "w");
}

var sqlite3 = require("sqlite3").verbose();
var db = new sqlite3.Database(file);

db.serialize(function () {
    if (!exists) {
        db.run("CREATE TABLE Stuff (thing TEXT,dt datetime default current_timestamp)");
    }

    var stmt = db.prepare("INSERT INTO Stuff (thing) VALUES (?)");

    //Insert random data
    var rnd;
    for (var i = 0; i < 10; i++) {
        rnd = Math.floor(Math.random() * 10000000);
        stmt.run("Thing #" + rnd);
    }

    stmt.finalize();
    db.each("SELECT rowid AS id, thing, datetime(dt, 'localtime') as dt FROM Stuff", function (err, row) {
        console.log(row.id + ": " + row.thing + " " + row.dt);
    });
});

db.close();