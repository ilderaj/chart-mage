var gulp = require("gulp");
var fs = require("fs");
var browserSync = require("browser-sync").create();
var useref = require("gulp-useref");
var uglify = require("gulp-uglify");
var gulpIf = require("gulp-if");
var postcss = require("gulp-postcss");
var cssnano = require("cssnano");
var autoPrefixer = require("gulp-autoprefixer").default;

function cleanDist(done) {
	fs.rmSync("dist", { recursive: true, force: true });
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
		.pipe(gulpIf("*.css", autoPrefixer({ overrideBrowserslist: [">5%"] })))
		.pipe(gulpIf("*.css", postcss([cssnano()])))
		.pipe(gulp.dest("dist"))
}

function copyImages() {
	return gulp.src("app/images/**/*", { encoding: false })
		.pipe(gulp.dest("dist/images", { encoding: false }));
}

gulp.task("clean:dist", cleanDist);
gulp.task("browserSync", startBrowserSync);
gulp.task("watch", gulp.series(startBrowserSync, watchFiles));
gulp.task("useref", buildUseref);
gulp.task("images", copyImages);
gulp.task("default", gulp.series(cleanDist, gulp.parallel(buildUseref, copyImages)));
