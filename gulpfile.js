// gulpプラグインの呼び出し
const { src, dest, watch, series, parallel } = require("gulp");
// Sassをコンパイルするプラグインの呼び出し
const sass = require('gulp-sass')(require('sass'));
// ベンダープレフィックスを付与するプラグインの呼び出し
const autoprefixer = require('gulp-autoprefixer');
// 画像を圧縮するプラグインの呼び出し
const imagemin = require('gulp-imagemin');
const pngquant = require('imagemin-pngquant');
// ファイルの変更を監視して、変更をブラウザーに反映させるプラグインの呼び出し
const browserSync = require('browser-sync');


/**
 * Sassをコンパイルするタスク
 */
const compileSass = () =>
  // style.scssファイルを取得
  src("src/scss/style.scss")
    // Sassのコンパイルを実行
    .pipe(
      // コンパイル後のCSSを展開
      sass({
        outputStyle: "expanded"
      })
    )
    // ベンダープレフィックス付与を実行
    .pipe(
      autoprefixer([
        // 各ブラウザの2世代前までのバージョンを担保
        'last 2 versions',
        // IE11を担保
        'ie >= 11'
      ])
    )
    // dist以下のcssフォルダーに保存
    .pipe(dest("dist/css"));


/**
 * 画像を圧縮するタスク
 */
const imgMin = () =>
  // 画像を取得
  src("src/img/**.jpg")
  // 画像の圧縮を実行
  .pipe(
    imagemin([
      // JPG画像を80%圧縮
      imagemin.mozjpeg({ quality: 80 })
    ])
  )
  // dist以下のimgフォルダーに保存
  .pipe(dest("dist/img"));


/**
 * ファイルの変更を監視して、ブラウザーに反映
 */
const browserSyncFunc = () => {
  browserSync.init(browserSyncOption);
}
const browserSyncOption = {
  server: {
    baseDir: "./"
  },
  startPath: "dist/index.html",
  open: "external", 
  reloadOnRestart: true,
}

// 変更があったら、ブラウザをリロード
const browserSyncReload = (done) => {
  browserSync.reload();
  done();
 }
// ファイルの変更を監視
const watchFiles = () => {
  watch("src/scss/style.scss", series(compileSass, browserSyncReload))
  watch("src/img/**", series(imgMin, browserSyncReload))
}

// npx gulpを実行したら、watchFilesを実行
exports.default = series(series(compileSass, imgMin), parallel(watchFiles, browserSyncFunc));