
/*
按城市区分文件命名规则：
1.对于json、wxml、less、js等文件，如果不同城市有不同的内容，不要修改原文件名，直接新建一个文件，文件名称为“城市名称-原文件名”
2.对于图片文件，建议按照城市进行区分，及images文件夹下面，按照不同的城市区分出几个大的文件夹

开发者工具需做的配置：
1.点击详情，勾选启用自定义处理命令，在编译前处理文本框，输入grunt dev --CITY=“当前城市名”

编译和打包时的具体过程：
1.在编译时，grunt会把所有带有城市名称的文件，进行重命名，去掉城市名称，但是会对原文件进行备份，不影响接下来的开发
2.在打包时，会先执行一遍编译过程，然后在过滤文件的时候，会把所有带有城市名称的文件过滤出去，这样就不会将用不到文件打包进来
*/


// 此处是所有城市的列表，写在这里可以，以后有了统一的config，从config中读取也可以
const allCity = ['wuhan', 'tianjin'];
const removeCity = (array, citys) => {
  const handledCitys = citys.map(item => (`!**/${item}*`));
  const result = [
    ...array,
    ...handledCitys,
  ];
  return result;
};
module.exports = function runGrunt(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    clean: ['dist/*', 'distTemp/*'],
    copy: {
      local: {
        files: [
          { expand: true,
            src: ['pages/**/*{.js,.wxml,.json,.less}', '*{.js,.json,.wxss}'],
            dest: '/',
            rename(dst, src) {
              // 后续可以用replace去掉目标城市标识符
              console.log(src);
              return src.replace(`${grunt.option('CITY')}-`, '');
            },
          },
        ],
      },
      main: {
        files: [
          // includes files within path and its sub-directories
          { expand: true,
            src: removeCity(['pages/**', '!pages/**/*.js', '!pages/**/*.less', 'miniprogram_npm/**'], allCity),
            dest: 'dist/',
            // rename(dst, src) {
            //   // 后续可以用replace去掉目标城市标识符
            //   return `${dst}${src}`.replace(`${grunt.option('CITY')}-`, '');
            // },
          },
          { expand: true, src: ['typings/**', '!typings/**/*.js', '!typings/**/*.less'], dest: 'dist/' },
          { expand: true, src: ['utils/**', '!utils/**/*.js', '!utils/**/*.less'], dest: 'dist/' },

          { src: ['app.json', 'app.wxss'], dest: 'dist/' },
        ],
      },
    },
    babel: {
      options: {
        sourceMap: false,
        presets: ['babel-preset-es2015'],
      },
      dist: {
        files: [{
          expand: true,
          src: removeCity(['pages/**/*.js', 'typings/**/*.js', 'utils/**/*.js', 'app.js'], allCity),
          dest: 'distTemp/',
        }],
      },
    },
    uglify: {
      dev: {
        options: {
          compress: {
            drop_console: true,
          },
        },
        files: [{
          expand: true,
          cwd: 'distTemp/',
          src: ['***/**/*.js', 'app.js'],
          dest: 'dist/',
        }],
      },
    },
    watch: {
      src: {
        files: ['pages/**', 'utils/**', 'app.js', 'app.json', 'app.wxss', 'images/**'],
        tasks: ['clean', 'copy', 'babel', 'uglify', 'imagemin'],
      },
    },
    // 对于图片部分，后期可以按照城市划分一下，然后打包的时候可以针对当前城市选取目标文件夹
    imagemin: {
      dynamic: {
        files: [{
          expand: true,
          src: ['images/**/*.{png,jpg}'],
          // src:[`images/${grunt.option('CITY')}/**/*.{png,jpg}`],
          dest: 'dist/',
        }],
      },
    },
    webpack: {
      // options: {
      //   stats: !process.env.NODE_ENV || process.env.NODE_ENV === 'development',
      // },
      prod: {
        entry: `${__dirname}/node_modules/fancy-log/index.js`,
        output: {
          path: `${__dirname}/utils`,
          filename: '[name].js',
          library: 'fancylog',
          libraryTarget: 'umd',
        },
        node: {
          fs: 'empty',
          setImmediate: 'empty',
        },
      },
      // dev: Object.assign({ watch: true }, webpackConfig),
    },
  });

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-imagemin');
  grunt.loadNpmTasks('grunt-babel');
  grunt.loadNpmTasks('grunt-webpack');
  grunt.loadNpmTasks('grunt-env');


  // 在命令行上输入"grunt test"，test task就会被执行
  grunt.registerTask('pack', ['webpack']);

  // const data = grunt.file.readJSON('gruntdata.json');
  // const list = ['clean', 'copy', 'babel', 'uglify', 'imagemin', 'watch'];
  const list = ['clean', 'copy:local', 'copy:main', 'babel', 'uglify', 'imagemin'];
  // const mission = [];
  // for (let i = 0; i < list.length; i += 1) {
  //   if (data[list[i]]) {
  //     mission.push(list[i]);
  //   }
  // }
  grunt.registerTask('dev', ['copy:local']);
  // 只需在命令行上输入"grunt"，就会执行 build tasks
  grunt.registerTask('build', list);
};
