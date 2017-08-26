# ide**ads**

## Features  
* First of all you will have to create **places** for your ads. Configure a width and a height and place the code in your website.
* After that, create a **campaign** associated with one or multiple **places**.
* Finally create an **ad** in that campaign. An ad can be just an image, html or an AdSense block.

And thats it, your ad should start showing up in your website. Go to the dashboard where you can see the number of views and clicks.


## Requirements
Make sure you have installed all these prerequisites:
* Node.js - [Download & Install Node.js](http://www.nodejs.org/download/) and the npm package manager.
* MongoDB - [Download & Install MongoDB](http://www.mongodb.org/downloads), and make sure it's running on the default port (27017).
* Bower - You're going to use the [Bower Package Manager](http://bower.io/) to manage your front-end packages, in order to install it make sure you've installed Node.js and npm, then install bower globally using npm:

```
$ npm install -g bower
```

* Grunt - You're going to use the [Grunt Task Runner](http://gruntjs.com/) to automate your development process, in order to install it make sure you've installed Node.js and npm, then install grunt globally using npm:

```
$ sudo npm install -g grunt-cli
```

## Install
Install the dependencies:

```
$ npm install
```

## Running
After the install process is over, you'll be able to run your application using Grunt, just run grunt default task:

```
$ grunt
```

The application should run on the 3000 port so in your browser just go to [http://localhost:3000](http://localhost:3000)

That's it! your application should be running by now.
