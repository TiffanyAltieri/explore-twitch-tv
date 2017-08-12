(function(global) {'use strict';

  const resultsContainer = document.getElementById("twitchResults");
  const streamsNav = document.getElementById("streamsNav");
  const streamsTotalText = document.getElementById("streamsTotalText");
  const streamsPager = document.getElementById("streamsPager");

  const streamsPreviousPage = document.getElementById("streamsPreviousPage");
  const streamsNextPage = document.getElementById("streamsNextPage");

  const currentPageNumber = document.getElementById("currentPageNumber");
  const totalPageNumber = document.getElementById("totalPageNumber");

  const errorDialog = document.getElementById("errorDialog");

  const twitchAPIUrl = `https://api.twitch.tv/kraken/search/streams`;
  const clientId = `client_id=xrxvaomni2i1rkoj3h879yqirsegit`;

  let totalPages;
  let currentPage = 1;
  let twitchLinks;

  //keep track of state of query
  let newRender = true;

  // Sorts between error and whether first time through
  function handleResults(response) {
    // Check for error in response
    if (response.error) {
      handleErrorResponse(response);
    } else {
      if(response._total > 0) {
        twitchLinks = response._links;

        // Do only on first time
        if (currentPage === 1 && newRender) {
          handleNav(response._total, response.streams.length);
          setHandlers();
          removeWelcomeMessage();
          showNav();

          newRender = false;
        }

        // Successful run
        removeErrorMessage();
        handleStreams(response.streams);
      } else {
        removeWelcomeMessage();
        handleErrorResponse({ status: 'No results found.', error: "Bummer.", message: "Try again?" });
      }
    }
  }

  // Welcome message only shown the first time in
  function removeWelcomeMessage() {
    let welcomeMessage = document.getElementById("welcome");
    welcomeMessage.classList.add("hide-welcome");
    welcomeMessage.classList.remove("show-welcome");
  }

  // Set handlers on the previous and next buttons
  function setHandlers() {
    streamsPreviousPage.addEventListener("click", showPreviousStreams, false);
    streamsNextPage.addEventListener("click", showNextStreams, false);
  }

  // Set the total number of streams
  function setStreamTotal(total){
    // Clear total
    if(streamsTotalText.firstChild) {
      streamsTotalText.removeChild(streamsTotalText.firstChild);
    }
    let totalStreams = document.createTextNode(total);
    streamsTotalText.appendChild(totalStreams);
  }

  // Set the total number of pages
  function setTotalPageNumber(){
    // Clear total
    if(totalPageNumber.firstChild) {
      totalPageNumber.removeChild(totalPageNumber.firstChild);
    }
    let totalPagesText = document.createTextNode(totalPages);
    totalPageNumber.appendChild(totalPagesText);
  }

  function setPageNumber(){
    // Clear page number
    if(currentPageNumber.firstChild) {
      currentPageNumber.removeChild(currentPageNumber.firstChild);
    }
    let currentPages = document.createTextNode(`${currentPage}`);
    currentPageNumber.appendChild(currentPages);
  }

  // When left arrow is clicked, call to show the previous streams
  function showPreviousStreams() {
    if (currentPage >= 2) {
      let query = makeNewQuery(twitchLinks.prev);
      //re-query twitch
      queryTwitch(query);

      // Set current page back
      currentPage--;
      setPageNumber();
    }
  }

  // When right arrow is clicked, call to show the next streams
  function showNextStreams() {
    if (currentPage < totalPages) {
      let query = makeNewQuery(twitchLinks.next);
      //re-query twitch
      queryTwitch(query);

      // Set current page forward
      currentPage++;
      setPageNumber();
    }
  }

  // Given the name of a stream, create the full URL for use in a JSONP call to twitch.tv
  function createFullUrl(stream) {
    return `${twitchAPIUrl}?callback=handleResults&${clientId}&q=${encodeURIComponent(stream)}`;
  }

  // remove out any old error messages
  function removeErrorMessage(){
    errorDialog.classList.add('hide-error-dialog');
    errorDialog.classList.remove('show-error-dialog');
  }

  // Handle error response: status, error ans message passed in via object
  function handleErrorResponse(errorResponse) {
    let errorWrapper = document.createElement('div');
    errorWrapper.classList.add('error-wrapper');

    let errorHeader = document.createElement('h2');
    errorHeader.classList.add('error-header');
    errorHeader.appendChild(document.createTextNode(`Hmmm... ${errorResponse.status} ${errorResponse.error}`));

    let errorInner = document.createElement('p');
    errorInner.classList.add('error-inner');

    let errorText = document.createTextNode(errorResponse.message);

    errorInner.appendChild(errorText);
    errorWrapper.appendChild(errorHeader);
    errorWrapper.appendChild(errorInner);
    errorDialog.appendChild(errorWrapper);

    errorDialog.classList.add('show-error-dialog');
  }

  // Rebuilds the query string based up the link data twitch gives us
  function makeNewQuery(link) {
    let components = link.slice(link.indexOf('?') + 1).split('&');

    let baseUrl = `${twitchAPIUrl}?callback=handleResults&${clientId}`;
    //build new query
    for(let i =0; i < components.length; i++){
      baseUrl += `&${components[i]}`;
    }

    return baseUrl;
  }

  // Add script, then remove
  function queryTwitch(query) {
    // Make script tag and append to head
    let twitchScript = document.createElement('script');
    twitchScript.setAttribute('src', query);
    document.body.appendChild(twitchScript);

    // Clean up and remove script tag
    twitchScript.parentNode.removeChild(twitchScript);
  }

  // Sets initial pagination (n/N)
  function setPagination(total, streamLength) {
    // Set total number of pages here
    totalPages = Math.ceil(total / streamLength);

    if (Number.isInteger(totalPages)){
      setPageNumber();
      setTotalPageNumber();
    }

    return false;
  }

  // Fill in navigation including total number of streas and then pagination
  function handleNav(total, streamLength) {
    setStreamTotal(total);
    setPagination(total, streamLength);
  }

  // Decide if streams are valid.
  function handleStreams(streams){
    // Ensure there are streams to display
      if (streams.length !== 0){
        let twitchResultContainer = document.getElementById("twitchResults");
        createStreamsList(streams);
      }
  }

  // Remove underscores
  function cleanDisplayName(displayName) {
    return displayName.replace(/_/g, " ");
  }

  // Return and create an empty template for a single stream
  function createSingleStreamTemplate() {
    // Object of elements that will be filled
    let fillableElements = {};

    // Create template // // // // //
    let item = document.createElement('li');
    item.classList.add('twitch-stream');

    let itemLink = document.createElement('a');
    itemLink.classList.add('twitch-stream-link');
    itemLink.setAttribute('target', '_blank');
    item.appendChild(itemLink);
    fillableElements.itemLink = itemLink;

    // Stream image: create
    let imageWrapper = document.createElement('div');
    imageWrapper.classList.add('stream-image-wrapper');

    let image  = document.createElement('span');
    image.classList.add('stream-image');
    fillableElements.image = image;

    //Stream image: append
    imageWrapper.appendChild(image);
    itemLink.appendChild(imageWrapper);

    // Stream info: create
    let infoWrapper = document.createElement('div');
    infoWrapper.classList.add('stream-info-wrapper');

    let streamName = document.createElement('h2');
    streamName.classList.add('stream-name');
    fillableElements.streamName = streamName;

    let streamStats = document.createElement('ul');
    streamStats.classList.add('stream-stats');

    let streamStatsGameName = document.createElement('li');
    streamStatsGameName.classList.add('stream-stats-game-name');
    fillableElements.streamStatsGameName = streamStatsGameName;

    let streamStatsViewerCount = document.createElement('li');
    streamStatsViewerCount.classList.add('stream-stats-viewer-count');
    fillableElements.streamStatsViewerCount = streamStatsViewerCount;

    let streamDescription = document.createElement('p');
    streamDescription.classList.add('stream-description');
    fillableElements.streamDescription = streamDescription;

    // Stream info: append
    infoWrapper.appendChild(streamName);
    infoWrapper.appendChild(streamStats);
    streamStats.appendChild(streamStatsGameName);
    streamStats.appendChild(streamStatsViewerCount);
    infoWrapper.appendChild(streamDescription);

    itemLink.appendChild(infoWrapper);

    return { stream: item, elements: fillableElements };
  }

  // Fill in empty template for a single stream
  function fillSingleStreamTemplate (stream, data) {
    console.log(data);
    // Fill in template // // // // //
    stream.itemLink.setAttribute("href", data.channel.url);
    stream.image.style.backgroundImage = `url(${data.preview.medium})`;

    // Stream name
    let streamNameText = document.createTextNode(cleanDisplayName(data.channel.display_name));
    stream.streamName.appendChild(streamNameText);

    // Stream game name
    let streamGameText = document.createTextNode(data.channel.game);
    stream.streamStatsGameName.appendChild(streamGameText);

    // Stream viewer count
    let streamViewerCountText = document.createTextNode(data.channel.followers);
    stream.streamStatsViewerCount.appendChild(streamViewerCountText);

    // Stream description
    let streamDescriptionText = document.createTextNode(data.channel.status);
    stream.streamDescription.appendChild(streamDescriptionText);
  }

  // Creates a list  of the resulting stream data
  function createStreamsList(streams) {
    // Clear results container of previous items
    clearResultsContainer();

    for (let i = 0; i < streams.length; i++) {
      // Get single stream
      let singleStreamObject = createSingleStreamTemplate();

      // Stream container: append and fill in
      resultsContainer.appendChild(singleStreamObject.stream);
      fillSingleStreamTemplate(singleStreamObject.elements, streams[i]);
    }
  }

  // Looks for and returns an empty unordered list intended to contain stream results
  function clearResultsContainer() {
    while(resultsContainer.firstChild){
      resultsContainer.removeChild(resultsContainer.firstChild);
    }
  }

  // Check that inout has been filled
  function hasStreamName(stream) {
    return (stream !== '');
  }

  // Show navigation - pager and total # of streams
  function showNav(){
    streamsNav.classList.add('show-nav');
    streamsNav.classList.remove('hide-nav');
  }

  // Handle when user makes a query
  function handleSubmit(event) {
    event.preventDefault();

    // Set page back to initial
    newRender = true;
    currentPage = 1;
    totalPages;

    // get inputted value the first time around
    // Get stream name from input
    let streamName = document.getElementById("twitchSearchInput").value;
     // Check that we have a value
    if (hasStreamName(streamName)){
      let fullUrl = createFullUrl(streamName);
      queryTwitch(fullUrl);
    }
  }

  // Add click event to button and define actions after click
  let searchForm = document.getElementById("twitchQueryForm");
  searchForm.addEventListener("submit", handleSubmit.bind(this), false);

  // Make callback handleResults global so script can access
  global.handleResults = handleResults;
})(typeof window !== 'undefined' ? window : Function('return this')());
