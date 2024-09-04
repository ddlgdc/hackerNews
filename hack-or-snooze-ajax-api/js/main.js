"use strict";

// So we don't have to keep re-finding things on page, find DOM elements once:

const $body = $("body");

const $storiesLoadingMsg = $("#stories-loading-msg");
const $allStoriesList = $("#all-stories-list");

const $loginForm = $("#login-form");
const $signupForm = $("#signup-form");

const $navLogin = $("#nav-login");
const $navUserProfile = $("#nav-user-profile");
const $navLogOut = $("#nav-logout");

/** To make it easier for individual components to show just themselves, this
 * is a useful function that hides pretty much everything on the page. After
 * calling this, individual components can re-show just what they want.
 */

function hidePageComponents() {
  const components = [
    $allStoriesList,
    $loginForm,
    $signupForm,
    $('#story-form-section')
  ];
  components.forEach(c => c.hide());
}

/** Overall function to kick off the app. */

async function start() {
  console.debug("start");

  // "Remember logged-in user" and log in, if credentials in localStorage
  await checkForRememberedUser();
  await getAndShowStoriesOnStart();

  // if we got a logged-in user
  if (currentUser) updateUIOnUserLogin();
}

function putFavoritesOnPage() {
  // logs to the console
  console.debug('putFavoritesOnPage');

  // clears curr list of stories
  $allStoriesList.empty();

  // check if user has any favs stories
  if (currentUser.favorites.length === 0) {

    // iuf no stories, display a message indicating no stories favorited
    $allStoriesList.append('<h5>No favorites added!</h5>');
  }
  else {

    // loop through the list of fav stories
    for (let story of currentUser.favorites) {

      // generate HTML for each fav story
      const $story = generateStoryMarkup(story);

      // append the generated html to the list on page
      $allStoriesList.append($story);
    }
  }
  // show the list of favs stories on the page
  $allStoriesList.show();
}

$allStoriesList.on('click', '.star i', async function( evt ) {
  const $target = $(evt.target);
  const storyId = $target.closest('li').attr('id');
  const story = storyList.stories.find(s => s.storyId === storyId);

  if ($target.hasClass('fas')) {
    await currentUser.unfavoriteStory(story);
    $target.removeClass('fas').addClass('far');
  }
  else {
    await currentUser.favoriteStory(story);
    $target.removeClass('far').addClass('fas');
  }
});

// Event listner to show the users favs stories when the favs link is clicked
$('#nav-favorites').on('click', function() {
  hidePageComponents(); // hides all other components of the page
  putFavoritesOnPage(); // call func to show favs stories
});

$allStoriesList.on('click', '.delete-story-btn', async function(evt) {
  // Find the story's ID
  const $closestLi = $(evt.target).closest("li");
  const storyId = $closestLi.attr("id");

  // Call the removeStory method on the current user to delete the story
  await currentUser.removeStory(storyId);

  // Remove the story from the DOM
  $closestLi.remove();
})

// Once the DOM is entirely loaded, begin the app

console.warn("HEY STUDENT: This program sends many debug messages to" +
  " the console. If you don't see the message 'start' below this, you're not" +
  " seeing those helpful debug messages. In your browser console, click on" +
  " menu 'Default Levels' and add Verbose");
$(start);
