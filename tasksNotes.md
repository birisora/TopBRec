# Tasks/Notes:

## Features to add
- ~~add event listeners!~~
- ~~create image links lead to new view for just a page~~
  - made it to lead to book preview
- ~~make logo bring back to home page~~
- ~~make a return to top button~~
- ~~have a return to previous page button?~~
  - made it for if no search results
- ~~loading image?~~
- styles
- ~~Explain what the page is when someone lands on it~~
- ACCESSIBILITY!
- ~~site description: a way to remove or get out of face~~
  - ~~modal~~
- ~~change logo/or title font~~

## Bugs:
- ~~If Search term not found, display error~~
- ~~fix so each book has their own image~~
- ~~**fix book search images so that they are in the right order**~~
- ~~seems like google api if multiple words are separated by %20 by default gives~~
  - entirely different results, changed to have + in between
- ~~if thumbnail does not exist, replace with temporary image~~
- ~~show-hide button not applied for all others, fix it later~~

## useful
- `...` useful to know
- using promise.all?
- Object.assign
- play around with flex

## feedback questions
- Do my users think the app is interesting or valuable?
- Did my users use the app as I intended?
- Did my users encounter any bugs or broken features?
- Did my users understand how to use the app?

## feedback
- include some way to show reviews/ratings to give users more of incentive to try out
- Your app is valuable for those who want to search for books when they can't find any recommendation. I probably won't use it though because nowadays people do really read books. Unless you expand the app a bit to give a broader genres or search application with keywords to help find what they are looking for.
- make book recommendations, avoid same author, add more variety
- book descriptions looks messy
  - maybe separate by periods and space with a `<br>` per sentence?
- change book preview to amazon page maybe
- make links that says amazon if it leads to amazon
- easy to use, no bugs
- add more genres
  - hardcover fiction (default), hardcover nonfiction, young adult hardcover
    - some more: Business, science, sports and fitness
- maybe add in number of search results as an option?


## Future feedback
Design (optional): I recommend sourcing your design in current best practice. A very easy way to start is to use materialize.css as a reference. It's based upon Google's material design principles and gives visual examples of forms, components and entire themes. You can of course use it to build your application user interface as well; it's just a simple link or two and it's free. But at a minimum it might be good to use it as design inspiration. While there are many other places to go for design inspiration, materialize.css is a great first step in building the design acumen that any developer needs.

Responsive CSS Implementation (required): Responsive design must be mobile-first. The CSS that comes first should be for mobile widths and the CSS that is in media queries should incrementally override mobile rules and properties as needed to take advantage of greater screen real estate. Whenever you find yourself using max-width in media queries, you may be doing a desktop-first implementation which is reverse of best practice.

Example: / Mobile CSS /

/ Tablet breakpoint / @media all and (min-width: 640px) { /* Override only properties needed for tablet }

/ Desktop breakpoint / @media all and (min-width: 1024px) { /* Override only properties needed for Desktop }