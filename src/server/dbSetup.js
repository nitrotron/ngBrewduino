var fs = require('fs');
var file = './data/' + 'brewduino.db';
var exists = fs.existsSync(file);

if (!exists) {
    console.log('Creating DB file.');
    fs.openSync(file, 'w');
}

var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database(file);

db.serialize(function () {
    if (!exists) {
        db.run('CREATE TABLE TemperatureHistories (id integer primary key autoincrement, temp0 DECIMAL(5,2), temp1 DECIMAL(5,2), temp2 DECIMAL(5,2), temp3 DECIMAL(5,2),dt datetime default current_timestamp, SessionID integer)');
        db.run('CREATE TABLE Sessions (id integer primary key autoincrement, dt datetime default current_timestamp, sessionName NVARCHAR(100) )');
    }

    //   var stmt = db.prepare('INSERT INTO TemperatureHistories (temp0, temp1, temp2, temp3) VALUES (?,?,?,?)');
    //
    //   //Insert random data
    //   var rnd;
    //   var temp0 = 62.0;
    //   var temp1 = 63.0;
    //   var temp2 = 64.0;
    //   var temp3 = 62.0;
    //   for (var i = 0; i < 10; i++) {
    //       temp0 = temp0 + Math.random();
    //       temp1 = temp1 + Math.random();
    //       temp2 = temp2 + Math.random();
    //       temp3 = temp3 + Math.random();
    //       //var cmd = [temp0, temp1, temp2, temp3];
    //       //console.log('data:' + cmd);
    //       stmt.run([temp0, temp1, temp2, temp3]);
    //   }

    //  stmt.finalize();

      // db.run('INSERT INTO Sessions (sessionName) VALUES (?)', 'initialSession');


    var currentSessionID = 0;

    db.all("select sessionName, id from Sessions order by id desc limit 1", function (err, row) {

        console.log("session Name:" + row[0].sessionName + ", id:" + row[0].id);
        currentSessionID = row[0].id;
        console.log(err);
    });

       db.each("SELECT rowid AS id, temp0, temp1, temp2, temp3, datetime(dt, 'localtime') as date, time(dt, 'localtime') time FROM TemperatureHistories", function (err, row) {
           var dt = new Date(row.date);
           row.date = dt;
    
           console.log(row.id + ': ' + row.temp0 + ' ,' + row.temp1 + ' ,' + row.temp2 + ' ,' + row.temp3 + ' ,' + row.date + ' ,' + row.time);
           var str = JSON.stringify(row);
           console.log(str);
           
       });
    
       db.all("SELECT th.rowid AS id, th.temp0, th.temp1, th.temp2, th.temp3, datetime(th.dt, 'localtime') as date, time(th.dt, 'localtime') time FROM TemperatureHistories th join Sessions s on s.id = th.SessionID  ", function (err, rows) {
           console.log('*****************************');
           console.log('rows=' + rows);
           console.log('*****************************');
           var str = JSON.stringify(rows);
           console.log(str);
           console.log("row count" + rows.length);
       });
});

db.close();