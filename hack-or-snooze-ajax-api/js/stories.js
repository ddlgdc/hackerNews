"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  try {
    storyList = await StoryList.getStories();
    console.log('Loaded stories:', storyList.stories);
    $storiesLoadingMsg.remove();
    putStoriesOnPage();
  }
  catch ( error ) {
    console.error('Error loading stories:', error);
  }
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story) {
  // console.debug("generateStoryMarkup", story);

  const hostName = story.getHostName();
  const showDltBtn = Boolean(currentUser && story.username === currentUser.username);
  const isFavorite = currentUser && currentUser.isFavorite( story );
  const starIcon = isFavorite ? 'fas' : 'far'; // star icons
  return $(`
    <li id="${story.storyId}">
      ${showDltBtn ? `<button class="delete-story-btn" style="display: block; background-color: red;">X</button>` : ""}
      <span class="star">
        <i class="${starIcon} fa-star"></i>
      </span>
      <a href="${story.url}" target="_blank" class="story-link">
        ${story.title}
      </a>
      <small class="story-hostname">(${hostName})</small>
      <small class="story-author">by ${story.author}</small>
      <small class="story-user">posted by ${story.username}</small>
    </li>
  `);
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage"); 

  $allStoriesList.empty();

  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}

async function submitNewStory(evt) {
  evt.preventDefault();

  const title = $("#story-title").val();
  const author = $("#story-author").val();
  const url = $("#story-url").val();

  const newStory = await storyList.addStory(currentUser, { title, author, url });

  const $story = generateStoryMarkup( newStory );
  $allStoriesList.prepend( $story );

  // Hide the form and reset it
  $("#story-form-section").hide();
  $allStoriesList.show();
  $("#story-form")[0].reset();
}

$("#story-form").on("submit", submitNewStory);