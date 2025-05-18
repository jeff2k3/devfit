import { src, dest, series, parallel, watch } from 'gulp';
import { deleteAsync } from 'del';
import terser from 'gulp-terser';
import rename from 'gulp-rename';
import replace from 'gulp-replace';
import cleanCSS from 'gulp-clean-css';
import gifsicle from 'imagemin-gifsicle';
import mozjpeg from 'imagemin-mozjpeg';
import optipng from 'imagemin-optipng';
import webp from 'gulp-webp';

const paths = {
    resources: {
        css: 'resources/css/**/*.css',
        js: 'resources/js/**/*.js',
        img: 'resources/images/**/*.{jpg,jpeg,png,gif,webp}',
    },
    build: {
        css: 'public/build/css',
        js: 'public/build/js'
    },
    img: 'public/images',
    temp: {
        js: 'resources/temp/js',
    },
};

const cleanBuild = () => deleteAsync(Object.values(paths.build));
const cleanTemp = () => deleteAsync([paths.temp.js]);
const cleanImages = () => deleteAsync([`${paths.build.img}/**/*.{jpg,jpeg,png,gif,webp}`]);

const minify_css = () =>
    src(paths.resources.css)
      .pipe(cleanCSS())
      .pipe(rename({ suffix: '.min' }))
      .pipe(dest(paths.build.css));

const adjust_js_imports = () =>
    src(paths.resources.js)
      .pipe(replace(/(import\s+.*?from\s+['"])(.*?)(\.js)(['"])/g, '$1$2.min.js$4'))
      .pipe(dest(paths.temp.js));

const minify_js = () =>
    src(`${paths.temp.js}/**/*.js`)
        .pipe(terser())
        .pipe(rename({ suffix: '.min' }))
        .pipe(dest(paths.build.js));

const minify_img = async () => {
    const imagemin = (await import('gulp-imagemin')).default;
    return src(paths.resources.img, { encoding: false })
        .pipe(imagemin([
            gifsicle({ interlaced: true }),
            mozjpeg({ quality: 75, progressive: true }),
            optipng({ optimizationLevel: 5 })], { verbose: true }))
        .pipe(webp({ quality: 65 }))
        .pipe(dest(paths.img));
}

const startWatcher = () => {
    watch(paths.resources.css, { usePolling: true, interval: 300 }, minify_css);
    watch(paths.resources.js, { usePolling: true, interval: 300 }, series(adjust_js_imports, minify_js));
    watch(paths.resources.img, { usePolling: true, interval: 300 }, minify_img);
};

export const clean = parallel(cleanBuild, cleanTemp, cleanImages);
export const css = minify_css;
export const img = minify_img;
export const js = series(adjust_js_imports, minify_js);
export const build = series(cleanBuild, parallel(minify_css, series(adjust_js_imports, minify_js)), cleanTemp, cleanImages, minify_img);
export const watchFiles = startWatcher;
export default build;
