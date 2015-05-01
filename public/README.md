 #ifeelnaked
-------------
The static images that show up on https://fightforthefuture.github.io/ifeelnaked
are hard-coded into the page HTML. If you want to add some static images, you'll
have to edit the code!

Since you'll actually have to add images to the site, you shouldn't
edit `index.html` on Github's site. Instead use the Github app to checkout the
entire project on your computer so you can add images, edit the `index.html`
page and test. This guide will explain how to do that.

**Note:** Each static image only shows up after several user image shows up. So
if you have a lot of static images, you won't see all of them unless there are
a lot of user images too.

### Requirements for static image files:

* Images should be square cropped
* Should be 310×310 pixels or 620×620 pixels

### How to add static images to the site.

1. Get the Github App

2. Clone the #ifeelnaked project: git@github.com:fightforthefuture/ifeelnaked.git

3. This will download the #ifeelnaked code to your computer. Find the project in
   your file manager (ie. OS X Finder or Windows Explorer).

4. The project has an `images/people` subfolder. Drop your new photo in there.
   (Remember, the image should be 310×310px and square cropped). Give the photo
   an easy name like "clapper.jpg". Capitalization matters!

5. Open the `index.html` file in a suitable text editor. On Mac OS X you should
   use Sublime Text, Coda, or TextMate. Don't use the built-in text editor
   because it seriously sucks.

6. Near the bottom of `index.html` you'll see a section for Static Images. Each
   static image is in the following format:

   ```html
   <div class="good">
        <img src="images/people/aaron.jpg" />
        <a href="http://en.wikipedia.org/wiki/Aaron_Swartz">Source</a>
        <p>
            "This was somebody who was pushed to the edge by what I think of as
            a kind of bullying by our government." &mdash;Lawrence Lessig about 
            Aaron Swartz
        </p>
    </div>
   ```

   Things to keep in mind:

   * If the `class` is "good" then the image will be blue. If "evil", it will be
     red.

   * Make sure the image matches the file format (ie. "jpg" or "gif") and
     spelling and capitalization of the one you added.

   * Customize the link and description text.

   * _Make sure_ the double quotation marks that surround the HTML tag
     attribute values are simple double quotes, and not the stupid fancy ones
     that Mac OS X likes to add.

     **This is right:** `<div class="good">`

     **This is wrong:** `<div class=“good”>`

7. Save the file when you're done updating it. You can open and force reload the
   `index.html` file in Firefox to test your changes locally (note that fonts
   will render poorly.)

8. Once you're happy with your changes, go to the Github app and commit your
   changes. You'll have to enter a comment to describe the change you made,
   and then click `Commit to gh-pages`

9. Finally click the `Sync` button in Github App. This pushes it to the live
   server!

### Questions?

Email jeff@fightforthefuture.org. An email is better than being confused. I'm
happy to help.
