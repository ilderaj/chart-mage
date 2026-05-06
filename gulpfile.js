var gulp = require("gulp");
var fs = require("fs");
var path = require("path");
var browserSync = require("browser-sync").create();
var useref = require("gulp-useref");
var uglify = require("gulp-uglify");
var gulpIf = require("gulp-if");
var postcss = require("gulp-postcss");
var cssnano = require("cssnano");
var autoPrefixer = require("gulp-autoprefixer").default;

var deployAssetVersion = "20260506a";

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

function copyIntroRuntimeScripts() {
	return gulp.src([
		"app/js/lib/mermaidAPI.min.js",
		"app/js/maestro-observer.js"
	], { encoding: false })
		.pipe(gulp.dest("dist/js", { encoding: false }));
}

function copyHeaders() {
	return gulp.src("app/_headers")
		.pipe(gulp.dest("dist"));
}

function versionBuiltHtml(done) {
	["dist/intro.html", "dist/index.html"].forEach(function(filePath) {
		var absolutePath = path.resolve(filePath);
		var html = fs.readFileSync(absolutePath, "utf8");
		html = html
			.replace(/css\/intro\.min\.css(?!\?v=)/g, "css/intro.min.css?v=" + deployAssetVersion)
			.replace(/css\/style\.min\.css(?!\?v=)/g, "css/style.min.css?v=" + deployAssetVersion)
			.replace(/js\/bundle\.js(?!\?v=)/g, "js/bundle.js?v=" + deployAssetVersion);
		fs.writeFileSync(absolutePath, html);
	});
	done();
}

gulp.task("clean:dist", cleanDist);
gulp.task("browserSync", startBrowserSync);
gulp.task("watch", gulp.series(startBrowserSync, watchFiles));
gulp.task("useref", buildUseref);
gulp.task("images", copyImages);
gulp.task("intro-runtime", copyIntroRuntimeScripts);
gulp.task("headers", copyHeaders);
gulp.task("version:html", versionBuiltHtml);
gulp.task("default", gulp.series(cleanDist, gulp.parallel(buildUseref, copyImages, copyIntroRuntimeScripts, copyHeaders), versionBuiltHtml));
