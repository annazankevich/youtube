window.onload = async () => {
    const head = document.createElement('header');
    head.innerHTML = `
  <form id="data">
    <input type="text" id="query-input" placeholder="Find clip name">
    <button type="button" form="data" class="button">Search</button>
  </form>
  <div id="video-container"></div>
`;
    document.querySelector('body').appendChild(head);
    document.querySelector('form#data button').addEventListener('click', search );
    document.querySelector('form#data #query-input').addEventListener('keyup', doSearch );
};
async function search () {
    let query = document.querySelector('#query-input').value;
    await youtubeSearch(query);
}

this.delayTimer = null;
function doSearch() {
    clearTimeout(this.delayTimer);
    this.delayTimer = setTimeout(function() {
        search();
    }, 1000);
}

async function youtubeSearch(query) {
    const key = 'AIzaSyDPHc-_wuKwo-WuSN2CIEo8lGSBzVrENng';
    const url = 'https://www.googleapis.com/youtube/v3/search';
    const tail = 'type=video&part=snippet&maxResults=15';
    const result = await fetch(`${url}?key=${key}&${tail}&q=${query}${this.createPageTokenString()}`);
    const data = await result.json();
    this.nextPageToken = data.nextPageToken;
    const items = data.items;

    //this.ids = this.ids.concat(items.map(elem => elem.id.videoId));
    //return this.ids;
    createDivs(items);
}


function createPageTokenString(){
return this.nextPageToken ? `&pageToken=${this.nextPageToken}` : '';
}

function createDivs(videos) {
    document.querySelector('#video-container').innerHTML = '';
    videos.forEach(video=>{
        let videoSnippet = video.snippet;
        const div = document.createElement('div');
        div.innerHTML = `
              <div class="picture">
                <img src=${video.snippet.thumbnails.medium.url} alt="img">
              </div>
              <div class="title">
                <a href="https://www.youtube.com/watch?v=${video.id.videoId}">${videoSnippet.title}</a>
              </div>
              <div class="about">
                <p><i class="fa fa-user" aria-hidden="true"></i><span id="author">${videoSnippet.channelTitle}</span></p>
                <p><i class="fa fa-calendar" aria-hidden="true"></i><span id="date">${videoSnippet.publishedAt}</span></p>
                <p><i class="fa fa-eye" aria-hidden="true"></i><span id="views">${video.viewCount}</span></p>      
                <p class="description">${videoSnippet.description}</p>
              </div>`;
        div.classList.add('item');
        document.querySelector('#video-container').appendChild(div);
    })
}