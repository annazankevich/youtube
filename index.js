window.onload = async () => {
    const head = document.createElement('header');
    head.innerHTML = `
  <form id="data">
    <input type="text" id="query-input" placeholder="Find clip name">
    <button type="button" form="data" class="button">Search</button>
  </form>
  <div id="video-container"></div>
  <div id="pagination"></div>
`;
    document.querySelector('body').appendChild(head);
    document.querySelector('form#data button').addEventListener('click', search);
    document.querySelector('form#data #query-input').addEventListener('keyup', doSearch);
};

async function search() {
    let query = document.querySelector('#query-input').value;
    await youtubeSearch(query);
}

this.delayTimer = null;

function doSearch() {
    clearTimeout(this.delayTimer);
    this.delayTimer = setTimeout(function () {
        search();
    }, 1000);
}

let videoList = [];

async function youtubeSearch(query) {
    const key = 'AIzaSyB9y6D3-w8Pf-oqCQ1B_buoFyEvJ7nzfp8';
    const url = 'https://www.googleapis.com/youtube/v3/search';
    const tail = 'type=video&part=snippet&maxResults=15';
    const result = await fetch(`${url}?key=${key}&${tail}&q=${query}${this.createPageTokenString()}`);
    const data = await result.json();
    this.nextPageToken = data.nextPageToken;
    videoList = data.items;
    //this.ids = this.ids.concat(items.map(elem => elem.id.videoId));
    //return this.ids;
    createDivs(videoList, 0);
}


function createPageTokenString() {
    return this.nextPageToken ? `&pageToken=${this.nextPageToken}` : '';

}

function createDivs(videos, indexActive) {
    document.querySelector('#video-container').innerHTML = '';
    const visibleVideos = videos.slice(indexActive * 4, indexActive * 4 + 4);
    visibleVideos.forEach(video => {
        let videoSnippet = video.snippet;
        const div = document.createElement('div');
        div.innerHTML = `
              <div class="picture">
                <img src=${video.snippet.thumbnails.medium.url} alt="img">
              </div>
              <div class="title">
                <a href="https://www.youtube.com/watch?v=${video.id.videoId}">${videoSnippet.title}</a>
              </div>
              <div class="video-link">
                <p><i class="description" aria-hidden="true"></i><span id="author">${videoSnippet.channelTitle}</span></p>
                <p><i class="description" aria-hidden="true"></i><span id="date">${videoSnippet.publishedAt.substring(0, 10)}</span></p>
                <p><i class="description" aria-hidden="true"></i><span id="views">${video.viewCount}</span></p>      
                <p class="description">${videoSnippet.description}</p>
              </div>`;
        div.classList.add('item');
        document.querySelector('#video-container').appendChild(div);
    });
    createPagination(4, 0);
}


function createPagination(count, activeItem) {
    document.querySelector('#pagination').innerHTML = '';
    const pagination = document.getElementById('pagination');
    for (let i = 0; i < count; i++) {
        const item = document.createElement('div');
        item.classList.add('page-item');
        if (i === activeItem) {
            item.classList.add('active');
        }
        pagination.appendChild(item);
    }
    pagination.addEventListener('click', handleActiveItem);

}

function handleActiveItem() {
    if (event.target.classList.contains('page-item')) {
        const pagination = document.getElementById('pagination');
        [...pagination.children].forEach(item => item.classList.remove("active"));
        event.target.classList.add('active');
        let index = [...pagination.children].findIndex( item => item.classList.contains('active'));
        console.log(index);
        createDivs(videoList,index);
    }
}
