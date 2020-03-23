var recursive = require('recursive-readdir');
var path = require('path');
var fs = require('fs');
var iconv = require('iconv-lite');
var csso = require('csso');
var UglifyJS = require('uglify-js');
var less = require('less');

class BitrixStaticWatcher 
{
    constructor(path, params) {
        this.path = path;
        this.files = []
        this.timeout = (params && params.timeout > 0) ? params.timeout : 1000;
        this.encoding = (params && params.encoding) ? params.encoding : 'utf-8';

        this.getFiles();
    }

    toWin1251(str) {
        return iconv.encode(str, 'win1251');
    }

    // compress js file
    minJs(file) {
        var filepath = path.dirname(file);
        var buffer = fs.readFileSync(file);
        var code = iconv.decode(buffer, 'win1251');

        try {
            var result = UglifyJS.minify(code, {
                mangle: {
                    keep_fnames: true,
                }
            });
        } catch(e) {
            console.log('ERROR: can`t Js compress ', file);
        }

        if(! result.error) {
            fs.writeFileSync(filepath + '/script.min.js', this.toWin1251(result.code));
        }
    }

    // compress css file
    minCss(file) {
        var filepath = path.dirname(file);
        var buffer = fs.readFileSync(file);
        var css = iconv.decode(buffer, 'win1251');
        var basename = path.basename(file);

        try {
            var result = csso.minify(css, {
                // restructure: false
            });

        } catch(e) {
            console.log('ERROR: can`t Css compress error: ', file);
            console.log('===');
            console.log(e);
            console.log('===');
        }

        if(result) {
            var compressedName = (basename == 'styles.css') ? '/styles.min.css' : '/style.min.css';
            fs.writeFileSync(filepath + compressedName, this.toWin1251(result.css));
        }
    }

    checkMask(filename, masks) {
        for(var i in masks) {
            if(filename.search(masks[i]) > -1) {
                return true;
            }
        }
        return false;
    }

    // get js and css files from folder
    getFiles() {
        recursive(this.path, (err, files) => {
            for(var i in files) {
                var f = files[i];
                var stat = fs.statSync(f);

                if(stat.isFile()) {
                    var basename = path.basename(f);
                var masks = [/^script\.js$/, /^style\.css$/, /^styles\.css$/, /^.*\.less$/];
                    // if(basename == 'script.js' || basename == 'style.css' || basename == 'styles.css') {
                    if( this.checkMask(basename, masks) ) {
                        if(! this.files.includes(f)) {
                            this.files.push(f);

                            // if file has`t compressed copy make it
                            if(! this.isFileCompressed(f)) {
                                this.compressFile(f);
                            }

                            this.watcher(f);
                        }
                    }
                }
            }
        });
    }

    isScript(filename) {
        if(filename == 'script.js') {
            return true;
        } else {
            return false;
        }
    }

    isCss(filename) {
        if(filename == 'style.css' || filename == 'styles.css') {
            return true;
        } else {
            return false;
        }
    }

    isLess(filename) {
    if(filename.search(/^.*\.less$/) > -1) {
            return true;
        } else {
            return false;
        }
    }

    isDateActual(file, compressedName) {
        if(fs.existsSync(compressedName)) {
            //console.log('Compressed file exist: ', compressedName);
            var statOrig = fs.statSync(file);
            var statComp = fs.statSync(compressedName);

            if(statOrig.mtime < statComp.mtime) {
                //console.log('last version ', compressedName);
                return true;
            } else {
                //console.log('need update ', compressedName);
                return false;
            }
        } else {
            // console.log('Compressed file don`t exist: ', compressedName);
            return false;
        }
    }

    // check the file has a compressed copy
    isFileCompressed(file) {
        var dir = path.dirname(file);
        var basename = path.basename(file);

        if(this.isScript(basename) || this.isCss(basename) || this.isLess(basename)) {
            if(basename == 'script.js') {
                var compressedName = dir + '/script.min.js';
            } else if(basename == 'styles.css') {
                var compressedName = dir + '/styles.min.css';
            } else if(basename == 'style.css') {
                var compressedName = dir + '/style.min.css';
            } else if(this.isLess(basename)) {
                var compressedName = '../www/local/templates/bootstrap3/styles.css';
            }
            // var compressedName = (basename == 'script.js') ? dir + '/script.min.js' : dir + '/style.min.css';

            return this.isDateActual(file, compressedName);
        } else {
            return false;
        }
    }

    compressFile(file) {
        console.log('Compress: ', file);
        var basename = path.basename(file);
        if(this.isScript(basename)) {
            this.minJs(file);
        } else if(this.isCss(basename)) {
            this.minCss(file);
        } else if(this.isLess(basename)) {
            this.renderLess('../www/local/templates/bootstrap3/css/style.less', '../www/local/templates/bootstrap3/styles.css');
        }
    }

    renderLess(sourceFile, outputFile) {
        console.log('Compile less ' + sourceFile + ' to ' + outputFile);
        var buffer = fs.readFileSync(sourceFile);
        var source = iconv.decode(buffer, 'win1251');
        var $this = this;

        less.render(source, 
            {paths: path.dirname(sourceFile)}, 
            function(e, output) {
				if(!e) {
					fs.writeFileSync(outputFile, $this.toWin1251(output.css));
				} else {
					console.log(e);
				}
			});
    }

    watcher(file) {
        fs.watchFile(file, (curr, prev) => {
            this.compressFile(file);
        });
    }
}

var watcher = new BitrixStaticWatcher('../www/local/');
// var watcher = new BitrixStaticWatcher('./test');