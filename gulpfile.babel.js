import gulp from 'gulp';
import del from 'del';
import gulpLoadPlugins from 'gulp-load-plugins';

const $ = gulpLoadPlugins({
	pattern: ['gulp-*', 'gulp.*']
});

var paths = {
	styles: 'megatype.scss'
};


// =======================================================================
// Styles: compiles sass, autoprefixes, and combines media queries
// =======================================================================
gulp.task('styles', () => {
	return gulp.src(paths.styles)
		.pipe($.sass({
			outputStyle: 'expanded',
			precision: 10,
			includePaths: [
				'./node_modules',
				'./bower_components'
			]
		})
		.on('error', $.sass.logError))
		.pipe($.postcss([
			require('autoprefixer')({browsers: ['last 3 versions', '> 5%', 'IE >= 9']})
		]))
		.pipe($.combineMediaQueries({
			log: true
		}))
		.pipe(gulp.dest('dist'))
		.pipe($.size());
});


// =======================================================================
// Build task: builds all files and minifies into 'dist'
// =======================================================================
gulp.task('build', ['styles',], () => {});


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
	// watch the source files, and build relevant files
	gulp.watch([
		'./**/*.scss'],
		['styles']
	);
});


// =======================================================================
// Cleans built files
// =======================================================================
gulp.task('clean', del.bind(null, ['.tmp', 'dist']));


