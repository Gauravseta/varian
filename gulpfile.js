var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var sass = require('gulp-sass');
var useref = require('gulp-useref');
var runSequence = require('run-sequence');
var clean = require('gulp-clean');

gulp.task('sass',function(){
    return gulp.src('./app/scss/*.scss')
            .pipe(sass())
            .pipe(gulp.dest('./app/css'))
            .pipe(browserSync.stream());
});
gulp.task('build:dev',['sass'],function(){
    
    browserSync.init({
        server :{
            baseDir: "./"
        }
    });
    gulp.watch('app/scss/*.scss',['sass']);
    gulp.watch(['app/js/*.js','app/js/**/*.js']).on('change',browserSync.reload);
    gulp.watch('./*.html').on('change',browserSync.reload);
});

gulp.task('clean:dist',function(){
    return gulp.src('./dist')
                .pipe(clean());
});

gulp.task('useref',function(){
    return gulp.src('./index.html')
                .pipe(useref({allowEmpty:true}))
                .pipe(gulp.dest('./dist/'));
});

gulp.task('build:prod',function(){
    runSequence('clean:dist','sass','useref');
})