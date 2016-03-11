import gulp from 'gulp';
import del from 'del';
import gulpLoadPlugins from 'gulp-load-plugins';
import browserSync_module from 'browser-sync';

let browserSync = browserSync_module.create();

const $ = gulpLoadPlugins({
	pattern: ['gulp-*', 'gulp.*']
});

var paths = {
	styles: 'app/styles/**/*.scss',
	megatype: 'bower_components/megatype/**/*.scss',
	html: 'app/templates/pages/**/*.+(html|nunjucks)'
};


// =======================================================================
// Styles: compiles sass, autoprefixes, and combines media queries
// =======================================================================
gulp.task('styles', () => {
	return gulp.src(paths.styles)
		.pipe($.sass({
			outputStyle: 'expanded',
			precision: 20,
			includePaths: [
				'./bower_components/megatype'
			]
		})
		.on('error', $.sass.logError))
		.pipe($.postcss([
			require('postcss-assets')({loadPaths: ['app/images/']}),
			require('autoprefixer')({browsers: ['last 3 versions', '> 5%', 'IE >= 9']})

		]))
		.pipe(gulp.dest('.tmp/styles'))
		.pipe($.size())
		.pipe(browserSync.stream());
});


// =======================================================================
// Process html partials
// =======================================================================
gulp.task('html', () => {
	$.nunjucksRender.nunjucks.configure(['app/templates/']);

	// Gets .html and .nunjucks files in pages
	return gulp.src(paths.html)
		// Renders template with nunjucks
		.pipe($.nunjucksRender())
		// output files in app folder
		.pipe(gulp.dest('.tmp'))
		.pipe($.size());
});


// =======================================================================
// Minify html, css, and js, and move all files to dist
// =======================================================================
gulp.task('minify', () => {
	return gulp.src('.tmp/**/*')
		.pipe($.if('*.css', $.cssnano()))
		.pipe($.if('*.html', $.prettify({indent_size: 4})))
		.pipe(gulp.dest('.'))
		.pipe($.size());
});


// =======================================================================
// Build task: builds all files and minifies into 'dist'
// =======================================================================
gulp.task('build', ['html', 'styles'], () => {
	gulp.start('minify');
});


// =======================================================================
// Default build
// =======================================================================
gulp.task('default', ['build'], () => {});
// alias
gulp.task('dist', ['build'], () => {});


// =======================================================================
// Development watch task.  Does not build anything initially
// =======================================================================
gulp.task('watch', (done) => {
	browserSync.init({
		notify: false,
		port: 9000,
		server: {
			baseDir: ['.tmp', 'app'],
			routes: {
				'/bower_components': 'bower_components'
			}
		},
		ghostMode: false
	});

	// store the timeout
	var timeout;

	// watch for changes on built files
	gulp.watch([
		'.tmp/*.html'
	]).on('change', function() {
		// throttle the reload to 500ms
		clearTimeout(timeout);

		if (!timeout) {
			// reload the browser
			browserSync.reload();
		}

		timeout = setTimeout(function() {
			// reset the timeout
			timeout = false;
		}, 500);
	});

	// watch the source files, and build relevant files
	gulp.watch(['app/styles/**/*.scss', 'bower_components/megatype/**/*.scss'], ['styles']);
	gulp.watch('app/templates/**/*', ['html']);
});


// =======================================================================
// Development serve task.  Builds everything initially
// =======================================================================
gulp.task('serve', ['html', 'styles'], () => {
	gulp.start('watch');
});

gulp.task('clean', del.bind(null, ['.tmp', 'dist']));


