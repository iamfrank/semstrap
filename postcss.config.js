module.exports = {
    plugins: [
        require('postcss-import'), // Collect @import'ed CSS files into one destination file
        require('precss'), // Enable SASS style syntax and future CSS 
        require('cssnano') // Minify CSS
    ]
}