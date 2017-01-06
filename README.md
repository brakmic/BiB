# BiB

<img src="https://i.imgsafe.org/95ab99dfdf.jpg" width="500" height="400">


## Library Management Application for Elementary Schools

**BiB** is [OpenSource](https://github.com/brakmic/BiB/blob/master/LICENSE) and OS-independent because it runs completely in a browser. 

It comprises of these parts:

* A client-side UI based on [Angular 2](https://angular.io/)
* A backend based on [HapiJS](https://hapijs.com/)
* An SQL-database ([MariaDB](https://mariadb.com/) by default, or similar databases)

The only real requirement is one of the modern browsers like Chrome, Firefox, IE11, or Edge.

**BiB** supports retrieval of library content via [WorldCat](https://www.worldcat.org/). 

For a visual representation of BiB's features check out [this](https://github.com/brakmic/BiB/blob/master/docs/BiB-UI.md) manual.

The user manuals are available in [German](https://github.com/brakmic/BiB/blob/master/docs/BiB_DE.pdf) and [English](https://github.com/brakmic/BiB/blob/master/docs/BiB_EN.pdf).

## Technologies

BiB is based on these fine projects, packages & languages:

* TypeScript

* Angular 2

* HapiJS 

* jQuery Plugins: 

                 datatables.net
                 jquery.contextmenu
                 jquery.confirm 
                 jquery.select2

* Toastr

* SCSS

* Bootstrap 3

* HammerJS

* ng2-translate

## Preparations

* Database

    First, you'll have to provide a properly defined database. 
    The script for automatic database creation is located in the [config-folder](https://github.com/brakmic/BiB/blob/master/config/db-create.sql). 

* NodeJS
    
    A working [NodeJS](https://nodejs.org/en/) 7.x environment is needed to compile the application. 
    
    Therefore, before you execute the following command make sure you have one. 
    
    Then use 
    
    `npm install` 
    
    to install the packages for the app. 
    
    *Notice for Windows Users*:

    If you're using a Windows machine you'll have to provide a complete *Visual Studio Build Environment* because the NodeJS installation 
    procedure will try to build a Windows-compatible binary of the MariaDB package. If you experinece problems with building *node-gy*, 
    please, consult [this](https://www.robertkehoe.com/2015/03/fix-node-gyp-rebuild-error-on-windows/) tutorial. 

    For setting up NodeJS under Windows 10 I'd recommend [this](https://blog.risingstack.com/node-js-windows-10-tutorial/) blog post.

## Running

This application can either be run in a development mode directly from console or as a complete web application that
resides in a www-directory of one of the available web-servers. 

If you're planning to develop this app then you should use 

`npm run start:client` 

to run it under the WebPack DevServer. 

To run it as a complete web app use 

`npm run build:prod`

to create a new productive build under the dist folder. Afterwards, copy the contents of this folder to a directory inside 
the root of your preferred web server.

In either case your application will need a proper backend that has to be run with:

`npm run start:server`

Because the server-side scripts are written in TypeScript too you'll need a Node version called *ts-node* that understands this JavaScript dialect.
The installation of ts-node is usually done with the initial install from above but if you experience any problems with compiling TypeScript files,
please, check if you maybe have different versions of your globa/local packages. The same applies to your TypeScript and WebPack versions.

The server-side scripts run with HapiJS on port 10000. By default there are no additional security measures, like SSL, applied as this application is intended to run
on a single machine without any internet connection. The only exception is the ISBN data-retrieval that needs a working internet connection.

## APIs

The server provides an API for managing the following: 

* [Media](https://github.com/brakmic/BiB/blob/master/src/server/api/controllers/media.controller.ts) 
* [Lending](https://github.com/brakmic/BiB/blob/master/src/server/api/controllers/borrow.controller.ts)
* [Readers](https://github.com/brakmic/BiB/blob/master/src/server/api/controllers/reader.controller.ts)
* [Users](https://github.com/brakmic/BiB/blob/master/src/server/api/controllers/user.controller.ts)
* [Statistics](https://github.com/brakmic/BiB/blob/master/src/server/api/controllers/stats.controller.ts) 
* [Translations](https://github.com/brakmic/BiB/blob/master/src/server/api/controllers/translation.controller.ts)
* [Access Control Lists](https://github.com/brakmic/BiB/blob/master/src/server/api/controllers/acl.controller.ts)
* [Library Data Retrieval](https://github.com/brakmic/BiB/blob/master/src/server/api/controllers/isbn.controller.ts)

The opposite of it is the *BibAPI* that's located in [app/apis/bib.api.ts](https://github.com/brakmic/BiB/blob/master/src/app/apis/bib.api.ts). 

BibAPI is the client-side API and all future developments should follow its initial design. This API is quite big as it strives to abstract away all of the more low-level stuff like HTTP requests, JSON parsing etc. 

The complete list of all available API calls is located [here](https://github.com/brakmic/BiB/blob/master/docs/Client-API.md).

## User Management 

<img src="https://i.imgsafe.org/95a3d23a72.png">

**BiB** [supports](https://github.com/brakmic/BiB/blob/master/src/app/decorators/authorized.decorator.ts) user- and group-based Access Control Lists. In current version only group-based ACLs are active but the technical capability to enforce more fine-grained access control is 
already available. Future versions will also include additional options for UI-based user rights management. Internally, **BiB** relies on Angular 2 Decorators to enforce restrictions on certain system tasks that can 
manipulate database and other vital data. The current implementation is rather simple and based on a few interesting ideas from various blog posts. 

## System Configuration 

Both the server and client use a file called [config.json](https://github.com/brakmic/BiB/blob/master/src/config.json) to (de)activate certain behaviors. This file is quite complex as it includes many different entries that deal with important aspects on both sides of the system.
For easier management and future development of **BiB** there exists a corresponding IConfig.ts interface that maps to all available properties from config.js.

The most frequently used options are:

| Option     | Type   | Description           | Example  |
| -------------|:---- |:-------------| -----:|
| bib_server   | string  | DNS-entry of the backend | "localhost" |
| bib_server_port | number | Port number of the backend  |   10000 |
| bib_server_baseUrl | string | web app base path    |  "/bib" |
| bib_overdue_days | number | Maximum loan period in days | 14 |
| bib_localstorage | string  | Name of localStorage object | "bib-app" |
| bib_logon_mask_logo | string  | b64-encoded image for login | string with prepended `data:image/TYPE;base64,` |
| bib_use_fake_isbn_server | boolean | Fake WorldCat access | false |
| bib_datetime_format | string | Date format | "DD.MM.YYYY" |

## Internationalization

**BiB** is completely i18n-capable via language files that are located in the assets/i18n folder. Currently there are language files for these languages although only German and English are complely translated and othes simply fall back to English. 

[German](https://github.com/brakmic/BiB/blob/master/src/assets/i18n/de-DE.json)

[English](https://github.com/brakmic/BiB/blob/master/src/assets/i18n/en-GB.json)

[French](https://github.com/brakmic/BiB/blob/master/src/assets/i18n/fr-FR.json)

[Italian](https://github.com/brakmic/BiB/blob/master/src/assets/i18n/it-IT.json)

[Russian](https://github.com/brakmic/BiB/blob/master/src/assets/i18n/ru-RU.json)

[Turkish](https://github.com/brakmic/BiB/blob/master/src/assets/i18n/tr-TR.json)


Any help regarding new languages or extending the existing ones is greatly appreciated.

<img src="https://i.imgsafe.org/95a1f41e3f.png">


## License 

[MIT](https://github.com/brakmic/BiB/blob/master/LICENSE)

### Copyright notice regarding images

All images are from [Pixabay](http://www.pixabay.com) and [CC0 Public Domain](https://creativecommons.org/publicdomain/zero/1.0/deed.en) licensed. 

Original links:

* [Penguin](https://pixabay.com/de/tux-tier-vogel-buch-b%C3%BCcher-161406/)
* [Owl](https://pixabay.com/de/eule-vogel-buch-wise-natur-47526/)
* [Kids](https://pixabay.com/de/asiatische-cartoon-kinder-1294104/)
* [Books](https://pixabay.com/de/b%C3%BCcher-bibliothek-bildung-literatur-42701/)
* [Shelf](https://pixabay.com/de/regal-b%C3%BCcher-bibliothek-lesung-159852/)
