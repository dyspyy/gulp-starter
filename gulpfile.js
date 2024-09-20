const { src, dest, watch, parallel, series } = require('gulp');

const sass = require('gulp-sass')(require('sass'))
const concat = require('gulp-concat');
const uglify = require('gulp-uglify-es').default;
const browserSync = require('browser-sync').create()
const autoPrefixer = require('gulp-autoprefixer');
const clean = require('gulp-clean');
const include = require('gulp-include');
const ttf2woff2 = require('gulp-ttf2woff2');
const svgSprite = require('gulp-svg-sprite');


function styles() {
    return src('src/sass/style.sass')
        .pipe(autoPrefixer({ overrideBrowserslist: ['last 10 version']}))
        .pipe(sass({ outputStyle: 'compressed' }))
        .pipe(concat('style.min.css'))
        .pipe(dest('src/css'))
        .pipe(browserSync.stream())
}

function pages() {
    return src('src/pages/*.html')
    .pipe(include({
        includePaths: 'src/components'
    }))
    .pipe(dest('src'))
    .pipe(browserSync.stream())
}

function fonts() {
    return src('src/fonts/src/*.ttf') // Берем только TTF файлы
        .pipe(ttf2woff2()) // Преобразуем TTF в WOFF2
        .pipe(dest('src/fonts'));
}



function sprite() {
    return src('src/img/src/*.svg')
    .pipe(svgSprite({
        mode: {
            stack: {
                sprite: '../sprite.svg',
                example: true
            }
        }
    }))
    .pipe(dest('src/img/'))
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

function cleanDist() {
    return src('dist')
    .pipe(clean())
}

function building() {
    return src([
        'src/css/style.min.css',
        'src/img/*/*.*',
        '!src/img/src',
        '!src/img/stack',
        'src/fonts/*.*',
        'src/js/main.min.js',
        'src/**/*.html'
    ], {base : 'src', allowEmpty: true}) // Добавил allowEmpty
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
    watch(['src/components/*','src/pages/*'], pages)
    watch(['src/*.html']).on('change', browserSync.reload)
}



exports.styles = styles;
exports.pages = pages;
exports.sprite = sprite;
exports.fonts = fonts;
exports.scripts = scripts;
exports.watching = watching;

exports.build = series(cleanDist, building)
exports.default = parallel(styles, scripts, pages, watching);