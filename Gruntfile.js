'ues strict'

module.exports = function (grunt) {
    require('time-grunt')(grunt);

    require('load-grunt-tasks')(grunt);

    var config = {
        client: 'client',
        app: 'app',
        dist: 'dist'
    }

    grunt.initConfig({
        config: config,
        pkg: grunt.file.readJSON('package.json'),

        copy: {
            dist: {
                src: '<%= config.client %>/index.html',
                dest: 'index.html'
            }
        },
        less: {
            dev: {
                options: {
                    compress: false,
                    yuicompress: false
                },
                files: {
                    '<%= config.client%>/css/index.css': '<%= config.client%>/less/index-2/main-2.less',
                    '<%= config.client%>/css/home.css': '<%= config.client%>/less/nowHome/main.less',
                    '<%= config.client%>/css/account.css': '<%= config.client%>/less/account/main.less',
                    '<%= config.client%>/css/success.css': '<%= config.client%>/less/success/main.less'
                }

            }
        },
        watch: {
            less: {
                files: ['<%= config.client %>/less/*.less','<%= config.client %>/less/*/*.less'],
                tasks: ['less:dev'],
                options: {
                    debounceDelay: 250
                }
            }
        },
        jshint: {
            options: {
                curly: true,
                eqeqeq: true,
                newcap: true,
                noarg: true,
                sub: true,
                undef: true,
                boss: true,
                node: true
            },
            globals: {
                exports: true,
                src: [ '<%= config.client %>/js/*.js']
            }
        }

    })

}