'use strict';

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var wiredep = require('wiredep').stream;
var runSequence = require('run-sequence');
var gulpif = require('gulp-if');
var args = require('get-gulp-args')();
var open = require('open');
var less = require('gulp-less');
var htmlmin = require('gulp-htmlmin');
var revReplace = require('gulp-rev-replace');
var replaceFilesContent = require('gulp-batch-replace'); // 用来替换文件内容
var proxy = require('http-proxy-middleware');


var buildEnv = args.env || args.buildEnv || 'dev';

// var sassCompilerConfig = {
//     sourcemap: false,
//     style: 'expanded',
//     compass: true,
//     lineNumbers: true
// };

// sass源路径
var lessPath = ['app/less/*.less', 'app/scripts/modules/**/*.less'];

gulp.task('bower', () => {
    return gulp.src('./app/index.html')
        .pipe(wiredep({
            directory: './app/bower_components'
        }))
        .pipe(gulp.dest('./app'));
});

gulp.task('serve', () => {
    runSequence('changEnv', 'start:client', 'buildLess', 'watch');
});

gulp.task('start:client', ['start:proxy'], () => {
    return open('http://localhost:9090');
})

gulp.task('start:proxy', function () {
    return $.connect.server({
        root: ['app'], // 若想运行打包后的代码，请将这里的"app"改为"dist"
        port: 9090,
        fallback: 'app/index.html', // 若想运行打包后的代码，请将这里的"app"改为"dist"
        livereload: true,
        middleware: function(connect, opt) {
            return [
                proxy('/api',  {
                    target: 'http://192.168.1.158:9090',
                    changeOrigin:true
                })
            ]
        }
    });
});

gulp.task('changEnv', function () {
    console.info("=== Build env.js with env '" + buildEnv + "'");
    gulp.src('./config/' + buildEnv + '.js')
        .pipe($.rename('env.js'))
        .pipe(gulp.dest('app/scripts'));
});

gulp.task('watch', () => {
    gulp.watch(lessPath, () => {
        return  gulp.src(lessPath)
            .pipe(less())
            .pipe(gulp.dest('./app/css'))
            .pipe($.connect.reload());
    });
    $.watch(['app/scripts/**/*.html', 'app/*.html', 'app/scripts/**/*.js'])
        .pipe($.connect.reload());
});

// 访问打包后的代码
gulp.task('serve:prod', ['build:proxy'], () => {
    return open('http://localhost:9090');
})

gulp.task('build:proxy', function () {
    return $.connect.server({
        root: ['dist'],
        port: 9090,
        fallback: 'dist/index.html',
        livereload: true,
        middleware: (connect, opts) => {
            var middlewares = [];
            var url = require('url');
            var proxy = require('proxy-middleware');
            var createProxy = (prefixString, proxyServer) => {
                var options = url.parse(proxyServer);
                options.route = prefixString;
                return proxy(options);
            }
            // 设置各种api代理
            middlewares.push(createProxy('/api', ''));
            middlewares.push(createProxy('/imgapi', ''));
            return middlewares;
        }
    });
});

/*build*/
var cssRoad = ['./app/css/**/*.css', '!./app/css/common.css'];
gulp.task('buildLess', function () {
    return gulp.src(lessPath)
        .pipe(less())
        .pipe(gulp.dest('./app/css'))
});


gulp.task('copyJs', function () {
    return gulp.src('./app/js/*.js')
        .pipe($.uglify())
        .pipe(gulp.dest('dist/js'))
});

// ocLazyLoad.config.js替换js
gulp.task('revReplaceModule', ['revModuleJs', 'revModuleCss', 'revModuleHtml'], function () {
    return gulp.src('./app/scripts/router.js')
        .pipe(revReplace({
            manifest: gulp.src('./app/temp/**/rev-manifest.json')
        }))
        .pipe(gulp.dest('app/temp'));
});

gulp.task('revModuleHtml', function () {
    return gulp.src('./app/scripts/modules/**/*.html')
        .pipe($.rev())
        .pipe(gulp.dest('dist/scripts/modules'))
        .pipe($.rev.manifest())
        .pipe(gulp.dest('app/temp/rev-html'));
});

gulp.task('revModuleJs', function () {
    return gulp.src('./app/scripts/modules/**/*.js')
    .pipe($.ngAnnotate())
    .pipe($.uglify())
    .pipe($.rev())
    .pipe(gulp.dest('dist/scripts/modules'))
    .pipe($.rev.manifest())
    .pipe(gulp.dest('app/temp/rev-js'));
});

gulp.task('revModuleCss', ['buildLess'], function () {
    return gulp.src(cssRoad)
    .pipe($.cssnano())
    .pipe($.rev())
    .pipe(gulp.dest('dist/css'))
    .pipe($.rev.manifest())
    .pipe(gulp.dest('app/temp/rev-css'));
});

gulp.task('copyModuleCss', ['buildLess'], function () {
    return gulp.src('./app/modules/**/*.css')
        .pipe($.cssnano())
        .pipe(gulp.dest('dist/modules'))
});

gulp.task('tpls', function () {
    return gulp.src('./app/tpl/*.html')
        .pipe(gulp.dest('dist/tpl'));
});

gulp.task('copyHtmlDirective', function () {
    return gulp.src('./app/scripts/directives/**/*.html')
        .pipe(gulp.dest('dist/scripts/directives'));
});
gulp.task('copyOther', function () {
    return gulp.src('./app/*.ico')
        .pipe(gulp.dest('dist'))
});

gulp.task('copyJsfile', function () {
    return gulp.src('./app/js/**')
        .pipe(gulp.dest('dist/js'))
});

gulp.task('copyImage', function () {
    return gulp.src('./app/img/*.*')
        .pipe(gulp.dest('dist/img'))
});

gulp.task('copyFonts', function () {
    return gulp.src('./app/fonts/*.{eot,otf,svg,ttf,woff,woff2}')
        .pipe(gulp.dest('dist/fonts'));
});

gulp.task('finalTask', function () {
    var jsFilter = $.filter('**/*.js', {
        restore: true
    });
    var cssFilter = $.filter('**/*.css', {
        restore: true
    });
    var replaceThis = [
        ['scripts/router.js', 'temp/router.js']
    ];
    return gulp.src('app/index.html')
        .pipe(replaceFilesContent(replaceThis))
        .pipe($.useref())
        .pipe(cssFilter)
        .pipe($.cssnano())
        .pipe($.rev())
        .pipe(cssFilter.restore)
        .pipe(jsFilter)
        .pipe($.ngAnnotate())
        .pipe($.uglify())
        .pipe($.rev())
        .pipe(jsFilter.restore)
        .pipe(revReplace())
        .pipe(gulp.dest('dist'))
});

gulp.task('cleanTemp', function () {
    return gulp.src('./app/temp')
        .pipe($.clean())
});

gulp.task('clean', function () {
    return gulp.src('./dist')
        .pipe($.clean())
});

gulp.task('build', ['clean'], function () {
    runSequence('changEnv', 'copyJs','copyModuleCss', 'copyJsfile','revReplaceModule', 'tpls','copyOther','copyHtmlDirective', 'copyImage', 'copyFonts', 'finalTask', 'cleanTemp');
});