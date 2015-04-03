var gulp = require('gulp');
var plug = require('gulp-load-plugins')();
var paths = require('./gulp.config.json');
var log = plug.util.log;

//var source = [
//'./Scripts/App/*module*.js',
//'./Scripts/App/**/*.js',
//'./Scripts/App/pageMethods.value.js'
//];

gulp.task('help', plug.taskListing);


/**
 * Create $templateCache from the html templates
 * @return {Stream}
 */
gulp.task('templatecache', function () {
    log('Creating an AngularJS $templateCache');

    return gulp
        .src(paths.htmltemplates)
        .pipe(plug.bytediff.start())
        .pipe(plug.minifyHtml({
          empty: true
         }))
        .pipe(plug.angularTemplatecache('templates.js', {
            module: 'app',
            standalone: false,
            root: 'App/'
        }))
       .pipe(plug.bytediff.stop())
       .pipe(gulp.dest(paths.build));
});

gulp.task('css', function () {
    log('Bundling, minifying, and copying the app\'s CSS');

    return gulp.src(paths.css)
        .pipe(plug.concat('all.min.css')) // Before bytediff or after
        .pipe(plug.autoprefixer('last 2 version', '> 5%', 'ie 9'))
        .pipe(plug.bytediff.start())
    .pipe(plug.minifyCss({}))
    .pipe(plug.bytediff.stop())
        //        .pipe(plug.concat('all.min.css')) // Before bytediff or after
        .pipe(gulp.dest(paths.build + 'content'));
});
gulp.task('vendorcss', function () {
    log('Compressing, bundling, copying vendor CSS');

    var vendorFilter = plug.filter(['**/*.css']);

    return gulp.src(paths.vendorcss)
        .pipe(vendorFilter)
        .pipe(plug.concat('vendor.min.css'))
        .pipe(plug.bytediff.start())
        .pipe(plug.minifyCss({}))
        .pipe(plug.bytediff.stop())
        .pipe(gulp.dest(paths.build + 'content'));
});

gulp.task('lint', function () {
    return gulp
        .src(paths.js)
        .pipe(plug.jshint())
        .pipe(plug.jshint('.jshintrc'))
        .pipe(plug.jshint.reporter('jshint-stylish'));

});



gulp.task('js', ['lint', 'templatecache'], function () {
    log('Bundling, Minifying, and copying MatterClosing JavaScript');
    var source = [].concat(paths.js, paths.build + 'templates.js');
    return gulp
        .src(source)
        .pipe(plug.concat('all.min.js'))
        .pipe(plug.ngAnnotate({
            add: true
        }))
        .pipe(plug.bytediff.start())
        .pipe(plug.uglify({
            mangle: true
        }))
        .pipe(plug.bytediff.stop())
        //.pipe(plug.sourcemaps.write('./'))
        //.pipe(gulp.dest(paths.build));
        .pipe(gulp.dest(paths.build));
});

gulp.task('vendorjs', function () {
    log('Bundling, Minifying, and copying Vendor JavaScript');
    return gulp
        .src(paths.vendorjs)
        .pipe(plug.concat('vendor.min.js'))
        .pipe(plug.bytediff.start())
        .pipe(plug.uglify())
        .pipe(plug.bytediff.stop())
        .pipe(gulp.dest(paths.build));
});



gulp.task('rev-and-inject', ['js', 'vendorjs', 'css', 'vendorcss'], function () {
    //   var minified = gulp.src([].concat(paths.build + '/all.min.js'));
    //   var vendorMin = gulp.src([].concat(paths.build + '/vendor.min.js'));
    //
    //   var index = gulp.src('MatterClosing.aspx');
    //   log('About to inject into the aspx');
    //
    //   return index.pipe(plug.inject(minified))
    //    .pipe(inject('vendor.min.js', 'inject-vendor'))
    //   .pipe(gulp.dest('.')
    //   );

    var minified = paths.build + '**/*.min.*';
    var index = paths.client + 'index.html';
    var minFilter = plug.filter(['**/*.min.*', '!**/*.map']);
    var indexFilter = plug.filter(['index.html']);

    var stream = gulp
        // Write the revisioned files
        .src([].concat(minified, index)) // add all built min files and index.html
        .pipe(minFilter) // filter the stream to minified css and js
        // .pipe(plug.rev()) // create files with rev's
        // .pipe(gulp.dest(paths.build)) // write the rev files
        .pipe(minFilter.restore()) // remove filter, back to original stream

    // inject the files into index.html
    .pipe(indexFilter) // filter to index.html
        .pipe(inject('content/vendor.min.css', 'inject-vendor'))
        .pipe(inject('content/all.min.css'))
        .pipe(inject('vendor.min.js', 'inject-vendor'))
        .pipe(inject('all.min.js'))
        .pipe(gulp.dest(paths.build)) // write the rev files
       .pipe(indexFilter.restore()); // remove filter, back to original stream

    function inject(path, name) {
        var pathGlob = paths.build + path;
        var options = {
            read: false
        };
        if (name) {
            options.name = name;
        }
        return plug.inject(gulp.src(pathGlob), options);
    }
});

gulp.task('justInject', function () {
    var minified = gulp.src(paths.js);
    var vendorMin = gulp.src(paths.vendorjs);
    var css = gulp.src(paths.css);
    var vendorCss = gulp.src(paths.vendorcss);


    var index = gulp.src([].concat(paths.client + 'index.html'));
    log('About to inject into the aspx');

    return index.pipe(inject(paths.js))
        .pipe(inject(paths.vendorjs, 'inject-vendor'))
        .pipe(inject(paths.css))
        .pipe(inject(paths.vendorcss, 'inject-vendor'))
        .pipe(gulp.dest(paths.build));


    function inject(path, name) {
        var pathGlob = path;
        var options = {
            read: false,
            addPrefix: '../src/client',
            relative: true
        };
        if (name) {
            options.name = name;
        }
        return plug.inject(gulp.src(pathGlob), options);
    }
});

//gulp.task('vendorInject')




gulp.task('watch', function () {
    gulp.watch(paths.js, ['lint']);
});