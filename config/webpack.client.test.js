const helpers = require('./helpers');
const path = require('path');

/**
 * Webpack Plugins
 */
const ProvidePlugin = require('webpack/lib/ProvidePlugin');
const DefinePlugin = require('webpack/lib/DefinePlugin');
const LoaderOptionsPlugin = require('webpack/lib/LoaderOptionsPlugin');
const ContextReplacementPlugin = require('webpack/lib/ContextReplacementPlugin');

/**
 * Webpack Constants
 */
const ENV = process.env.ENV = process.env.NODE_ENV = 'test';

/**
 * Webpack configuration
 *
 * See: http://webpack.github.io/docs/configuration.html#cli
 */
module.exports = function(options) {
  return {
  /**
   * Source map for Karma from the help of karma-sourcemap-loader &  karma-webpack
   *
   * Do not change, leave as is or it wont work.
   * See: https://github.com/webpack/karma-webpack#source-maps
   */
  devtool: 'inline-source-map',

  /**
   * Options affecting the resolving of modules.
   *
   * See: http://webpack.github.io/docs/configuration.html#resolve
   */
  resolve: {

    /**
     * An array of extensions that should be used to resolve modules.
     *
     * See: http://webpack.github.io/docs/configuration.html#resolve-extensions
     */
    extensions: ['.ts', '.js'],

    /**
    * Make sure root is src
    */
    modules: [ helpers.root('src'), 'node_modules' ]

  },

  /**
   * Options affecting the normal modules.
   *
   * See: http://webpack.github.io/docs/configuration.html#module
   */
  module: {

    /**
     * An array of automatically applied loaders.
     *
     * IMPORTANT: The loaders here are resolved relative to the resource which they are applied to.
     * This means they are not resolved relative to the configuration file.
     *
     * See: http://webpack.github.io/docs/configuration.html#module-loaders
     */
    rules: [

      
      {
          test: /\.ts$/,
          use: [
            {
              loader: '@angularclass/hmr-loader',
              options: {
                pretty: !isProd,
                prod: isProd
              }
            },
            { // MAKE SURE TO CHAIN VANILLA JS CODE, I.E. TS COMPILATION OUTPUT.
              loader: 'ng-router-loader',
              options: {
                loader: 'async-import',
                genDir: 'compiled',
                aot: AOT
              }
            },
            {
              loader: 'awesome-typescript-loader',
              options: {
                configFileName: 'tsconfig.webpack.json'
              }
            },
            {
              loader: 'angular2-template-loader'
            }
          ],
          exclude: [/\.(spec|e2e)\.ts$/]
      },
      {
         test: /\.(html|css)$/,
         loader: 'raw-loader',
         exclude: [helpers.root('src/index.html')]
      },
      /**
       * Json loader support for *.json files.
       *
       * See: https://github.com/webpack/json-loader
       */
      { 
        test: /\.json$/, 
        loader: 'json-loader', 
        exclude: [helpers.root('src/index.html')] 
      },
      /*
      * Load Sass Styles
      * See: See: https://github.com/jtangelder/sass-loader
      */
      {
        test: /\.scss$/,
        loaders: ['to-string-loader','raw-loader', 'sass-loader'],
        exclude: [helpers.root('src/index.html')]
      },
    ]
  },

  /**
   * Add additional plugins to the compiler.
   *
   * See: http://webpack.github.io/docs/configuration.html#plugins
   */
  plugins: [
    	

    /**
    * Plugin LoaderOptionsPlugin (experimental)
    *
    * See: https://gist.github.com/sokra/27b24881210b56bbaff7
    */
    new LoaderOptionsPlugin({
      debug: true,
      options: {
        context: __dirname,
        output: {
          path: helpers.root('dist')
        },
        /**
         * Static analysis linter for TypeScript advanced options configuration
         * Description: An extensible linter for the TypeScript language.
         *
         * See: https://github.com/wbuchwalter/tslint-loader
         */
        tslint: {
          emitErrors: false,
          failOnHint: false,
          resourcePath: 'src'
        },

      }
    }),
    /**
     * Plugin: DefinePlugin
     * Description: Define free variables.
     * Useful for having development builds with debug logging or adding global constants.
     *
     * Environment helpers
     *
     * See: https://webpack.github.io/docs/list-of-plugins.html#defineplugin
     */
    // NOTE: when adding more properties make sure you include them in custom-typings.d.ts
    new DefinePlugin({
      'ENV': JSON.stringify(ENV),
      'HMR': false,
      'process.env': {
        'ENV': JSON.stringify(ENV),
        'NODE_ENV': JSON.stringify(ENV),
        'HMR': false,
      }
    }),

 
    new ContextReplacementPlugin(
      // The (\\|\/) piece accounts for path separators in *nix and Windows
      /angular(\\|\/)core(\\|\/)(esm(\\|\/)src|src)(\\|\/)linker/,
      helpers.root('src'),
      {
        
      }
      // resolveNgRoute(helpers.root('src'))
    ),

  ],

  /**
   * Include polyfills or mocks for various node stuff
   * Description: Node configuration
   *
   * See: https://webpack.github.io/docs/configuration.html#node
   */
  node: {
    global: true,
    process: true,
    crypto: 'empty',
    module: false,
    clearImmediate: false,
    setImmediate: false
  }

  };

};
