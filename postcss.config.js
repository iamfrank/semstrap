module.exports = {
    plugins: [
        require('postcss-import'), // Collect @import'ed CSS files into one destination file
        require('cssnano') // Minify CSS
    ]
}