# Flickr Gallery

Welcome to the Flickr Gallery application.
This app is simple, you write a tag at the top and you get images from flickr with that tag.

[![Build Status](https://travis-ci.org/guysopher/flickr-gallery.svg?branch=master)](https://travis-ci.org/guysopher/flickr-gallery)

## Getting Started
To get this app running locally all you need to do is:
1. Fork this repo into your personal github account.
1. Clone the forked repo into your computer `git clone git@github.com:[YOUR_USERNAME]/flickr-gallery.git`
2. In the created folder install the node modules `npm install`
3. Run the app `npm start`
4. Your local app should be available at `http://localhost:8000`

## Your Tasks
This project includes several tasks for different skill levels. You may try completing them all but if you are new to Web Development, complete the tasks that are a bit above your level.
You can and should learn new skills during the process, you may consult with Google and friends but you will need to explain why you implemented what you implemented, so be responsible for your code.

### Task 1 - Image Actions
Each image has three buttons that appear on mouse hover. You need to make them work.
1. Delete: clicking the delete button should remove the image from the display. (easy)
2. Rotate: each click should rotate the image by 90 degrees. (intermediate)
3. Expand: clicking an image should display this image in a larger view. (hard)

### Task 2 - Gallery Actions
1. Responsive:  the gallery adjusts the size of each image so that all the images will fit into the screen without margin. However, when the window is resized, the images are not fitted so well. Make sure the images are always adjusted to the window width. (easy)
2. Infinite Scroll: currently the gallery displays only 100 images. Create a mechanizm that loads more images from flickr when the user is scrolling past the last image. (hard)

## Tips
- All the code you should change / add will be in the `/src/components` folder.
- You don't need to complete all tasks. If you are new to web development, finish only the easy tasks. If you have the required skills, try to complete the intermediate and hard tasks too.
- If possible, write tests for every new feature you write (tests are written in spec.js files)
- You can see a working demo video of the completed app [here](https://youtu.be/NW4VojSUFQc)
- Think about the product you create, try inovating the user interface, you don't have to create the exact solution as it is in the video, or even the exacts tasks. **be creative, creative is good**.

#### Remember: this test is designed to see how you complete tasks that require self learning, not to test your existing knowledge.

## Deploying Your Project
After you've completed your tasks, and you are ready to submit it, do the following:
1. Make sure your code is on the `master` branch and that it is pushed into your repo.
2. Run the deploy script `npm run deploy`
3. You project should be live on `https://[YOUR_USERNAME].github.io/flickr-gallery/`
4. Create a Pull Request of your changes (Pull Requests > New Pull Request > Create Pull Request)
5. Send us an email with your repo link and the deployed app link
6. Profit

## Good Luck!