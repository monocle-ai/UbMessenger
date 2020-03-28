# UbMessenger (Experimental)

This is a port of messenger to ubunut touch.

WARNING : this project use a [custom bridge](https://github.com/Henri2h/UbTouchMessBridge) in order to connect to messenger and use push notification.



## Project setup
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn serve
```

### Compiles and minifies for production
```
yarn build
```

### Lints and fixes files
```
yarn lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).


## Plugins used :

* [vue-cli-plugin-cordava](https://github.com/m0dch3n/vue-cli-plugin-cordova)


# Ubuntu touch :

## Build and deploy to device
```sh
yarn run build-ubtouch
cd src-ubuntu-touch
clickable
```
# Cross platform : Cordova : (copied from the cordova plugin readme)
This project support cross platform build using cordova.

## Usage
Prepare
```sh
$ npm run cordova-prepare # prepare for build (you can run this command, when you checkouted your project from GIT, it's like npm install)
```
Android
```sh
$ npm run cordova-serve-android # Development Android
$ npm run cordova-build-android # Build Android
$ npm run cordova-build-only-www-android # Build only files to src-cordova
```
IOS
```sh
$ npm run cordova-serve-ios # Development IOS
$ npm run cordova-build-ios # Build IOS
$ npm run cordova-build-only-www-ios # Build only files to src-cordova
```
OSX
```sh
$ npm run cordova-serve-osx # Development OSX
$ npm run cordova-build-osx # Build OSX
$ npm run cordova-build-only-www-osx # Build only files to src-cordova
```
Browser
```sh
$ npm run cordova-serve-browser # Development Browser
$ npm run cordova-build-browser # Build Browser
$ npm run cordova-build-only-www-browser # Build only files to src-cordova
```
## IMPORTANT

* Path rewriting etc does not work under Cordova, that's why it's important to use router 'hash' mode, if you run or build for Cordova. **history mode does not** work! The plugin already tries to fix this automatically...

* Assets and Scripts in vue's public folder need to have a dynamic path, because depending on dev or production build, you have different bases. In dev it's normally **'/'** and in production it's **'file:///android_asset/www/'**. In other words, if you have i.e. an image under **'public/images/me.jpg'**, the relative url would be **img='images/me.jpg'**

* You need some experience with Cordova, to solve many issues, like having the right Java JDK, Android SDK, XTools, Signing an App, Publishing an App etc. If you encounter issues related to Cordova etc, please don't post them this issue tracker.

* If you are upgrading from an older release, please add `<hook type="after_prepare" src="../node_modules/vue-cli-plugin-cordova/serve-config-hook.js" />` to your config.xml

* The devserver will run under https from now on, so make sure your rest & api endpoints are available under https, and have a correct CORS setup)

# Current hack to enable push notifications and code-push

[here for ionic](https://github.com/Microsoft/react-native-code-push/issues/1448#issuecomment-487270749)
[here for cordova](https://github.com/microsoft/cordova-plugin-code-push/issues/600#issuecomment-590314216)