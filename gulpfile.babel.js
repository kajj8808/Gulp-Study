import gulp from 'gulp';
import gPug from 'gulp-pug'; //glop fug
import del from 'del';
import ws from 'gulp-webserver';
import gImage from 'gulp-image';
import autoprefixer from 'gulp-autoprefixer';
import csso from 'gulp-csso';
import bro from 'gulp-bro';
import babelify from 'babelify';
import ghPages from 'gulp-gh-pages';

const sass = require('gulp-sass')(require('node-sass'));

const routes = {
  pug: {
    watch: 'src/**/*.pug', //files 감시
    src: 'src/*.pug' /* top files 만 더 안에있는거 할려면 src/ ** /*.pug */,
    dest: 'build',
  },
  img: {
    src: 'src/img/*',
    dest: 'build/img',
  },
  scss: {
    watch: 'src/scss/**/*.scss',
    src: 'src/scss/style.scss',
    dest: 'build/css',
  },
  js: {
    watch: 'src/js/**/*.js', //all the folder all the file!
    src: 'src/js/main.js',
    dest: 'build/js',
  },
};

const pug = () =>
  gulp
    .src(routes.pug.src)
    .pipe(gPug())
    .pipe(gulp.dest(routes.pug.dest)); /* pipe 를 통과후 갈곳 dest */

const clean = () => del(['build/', '.publish']);

const webServer = () =>
  gulp.src('build').pipe(ws({ livereload: true, open: true })); //livereload 자동 새로고침

const img = () =>
  gulp.src(routes.img.src).pipe(gImage()).pipe(gulp.dest(routes.img.dest));

const styles = () =>
  gulp
    .src(routes.scss.src)
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer())
    .pipe(csso())
    .pipe(gulp.dest(routes.scss.dest));

const js = () =>
  gulp
    .src(routes.js.src)
    .pipe(
      bro({
        transform: babelify.configure({ presets: ['@babel/preset-env'] }), //react 로 작업중이면 react-preset을넣으면됨.
      }),
      ['uglifyify', { global: true }]
    )
    .pipe(gulp.dest(routes.js.dest));

const ghDeploy = () => gulp.src('build/**/*').pipe(ghPages());

const watch = () => {
  gulp.watch(routes.pug.watch, pug);
  //gulp.watch(routes.img.src, img);// 이거넣으면 이미지 변경된거 반영됨.
  gulp.watch(routes.scss.watch, styles);
  gulp.watch(routes.js.watch, js);
};

const prepare = gulp.series([clean, img]);

const assets = gulp.series([pug, styles, js]);

const live = gulp.parallel([webServer, watch]); //동시에 task 를쓰기위해서 parallel

export const build = gulp.series([prepare , assets]);
export const dev = gulp.series([build, live]); //쓸껏만 export
export const deploy = gulp.series([build, ghDeploy , clean]);