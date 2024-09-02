const { src, dest, watch, parallel, series } = require('gulp');

const sass = require('gulp-sass')(require('sass'))
const concat = require('gulp-concat');
const uglify = require('gulp-uglify-es').default;
const browserSync = require('browser-sync').create()
const autoPrefixer = require('gulp-autoprefixer');
const clean = require('gulp-clean');
const avif = require('gulp-avif');
const webp = require('gulp-webp');
const imagemin = require('gulp-imagemin');
const cached = require('gulp-cached');


function styles() {
    return src('src/sass/style.sass')
        .pipe(autoPrefixer({ overrideBrowserslist: ['last 10 version']}))
        .pipe(sass({ outputStyle: 'compressed' }))
        .pipe(concat('style.min.css'))
        .pipe(dest('src/css'))
        .pipe(browserSync.stream())
}

function scripts() {
    return src([
        'src/js/main.js'
    ])
        .pipe(concat('main.min.js'))
        .pipe(uglify())
        .pipe(dest('src/js'))
        .pipe(browserSync.stream())
}

function images() {
    return src(['src/img/all/*.*', '!src/img/all/*.svg'])
    .pipe(avif({ quality : 50}))
    .pipe(src('src/img/all/*.*'))
    .pipe(webp())
    .pipe(src('src/img/all/*.*'))
    .pipe(imagemin())
    .pipe(dest('src/img/dist'))
}

function cleanDist() {
    return src('dist')
    .pipe(clean())
}


function building() {
    return src([
        'src/css/style.min.css',
        'src/js/main.min.js',
        'src/**/*.html'
    ], {base : 'src'})
    .pipe(dest('dist'))
}

function watching() {
    browserSync.init({
        server: {
            baseDir: "src/"
        }
    });
    watch(['src/sass/style.sass'], styles)
    watch(['src/js/main.js'], scripts)
    watch(['src/*.html']).on('change', browserSync.reload)
}



exports.styles = styles;
exports.images = images;
exports.scripts = scripts;
exports.watching = watching;

exports.build = series(cleanDist, building)
exports.default = parallel(styles, images, scripts, watching);