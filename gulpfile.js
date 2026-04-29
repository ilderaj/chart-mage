var gulp = require("gulp");
var browserSync = require("browser-sync").create();
var useref = require("gulp-useref");
var uglify = require("gulp-uglify");
var gulpIf = require("gulp-if");
var cssnano = require("gulp-cssnano");
var del = require("del");
var autoPrefixer = require("gulp-autoprefixer");

function cleanDist(done) {
	del.sync("dist");
	done();
}

function startBrowserSync(done) {
	browserSync.init({
		server: {
			baseDir: "app"
		}
	});
	done();
}

function watchFiles() {
	gulp.watch("app/css/**/*.css", browserSync.reload);
	gulp.watch("app/js/**/*.js", browserSync.reload);
	gulp.watch("app/*.html", browserSync.reload);
}

function buildUseref() {
	return gulp.src("app/*.html")
		.pipe(useref())
		.pipe(gulpIf("*.js", uglify()))
		.pipe(gulpIf("*.css", autoPrefixer({ browsers: [">5%"] })))
		.pipe(gulpIf("*.css", cssnano()))
		.pipe(gulp.dest("dist"))
}

function copyImages() {
	return gulp.src("app/images/**/*")
		.pipe(gulp.dest("dist/images"));
}

gulp.task("clean:dist", cleanDist);
gulp.task("browserSync", startBrowserSync);
gulp.task("watch", gulp.series(startBrowserSync, watchFiles));
gulp.task("useref", buildUseref);
gulp.task("images", copyImages);
gulp.task("default", gulp.series(cleanDist, gulp.parallel(buildUseref, copyImages)));