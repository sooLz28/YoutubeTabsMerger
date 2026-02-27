document.addEventListener('DOMContentLoaded', async () => {
const videosList = document.getElementById("videoList");
const statusDiv = document.getElementById('status');
const mergeBtn = document.getElementById("mergeBtn");
let videoIds = [];
let tabIdsToClose = [];
let videoTitles = [];

findVideos()


document.getElementById('refreshBtn').addEventListener('click', async () => {
    findVideos()
});

async function findVideos(){
    videoIds = []
    videoTitles = []
    tabIdsToClose = []


    statusDiv.textContent = "Finding...";

    // Find all open youtube video tabs
    const tabs = await chrome.tabs.query({ url: "*://*.youtube.com/watch*" });

    if (tabs.length === 0) {
        statusDiv.textContent = "No YouTube video tabs were found.";
        return;
    }

    fetchData(tabs)



    previewTabs(videoTitles)
    mergeBtn.disabled = false
}

document.getElementById('mergeBtn').addEventListener('click', async () => {
    let selectedIds = []

    videoIds.forEach((videoid, index) => {
        let ischecked = document.getElementById(`videoItem${index}`).checked
        
        if (ischecked){
            selectedIds.push(videoid)
        }
    });
    statusDiv.textContent = `${selectedIds}`;
    if (selectedIds.length > 0) {
        createWatchlist(selectedIds)
        videoIds = []
    } 
    else {
        statusDiv.textContent = "Could not find any video IDs.";
    }

});


async function fetchData(tabs){
    // Extract the video ID (the "v" parameter) from each tab's URL
    
    // tabs.forEach(tab => {
    //     try {
            
    //         let url = new URL(tab.url);
    //         let videoId = url.searchParams.get('v');
    //         let title = tab.title.replace(" - YouTube", "");
    //         // let timeWatched = await chrome.tab.sendMessage(tab.id, { action: "get_video_time" });

    //     if (videoId) {
    //         videoIds.push(videoId);
    //         tabIdsToClose.push(tab.id);
    //         videoTitles.push(title)
    //         console.log(timeWatched)
    //     }
    //     } catch (e) {
    //         console.log("Error parsing URL:", tab.url);
    //     }
    // });
    for(const tab of tabs){
    try {
        
        let url = new URL(tab.url);
        let videoId = url.searchParams.get('v');
        let title = tab.title.replace(" - YouTube", "");

    if (videoId) {
        videoIds.push(videoId);
        tabIdsToClose.push(tab.id);
        videoTitles.push(title)
        console.log(timeWatched)
    }
    } catch (e) {
        console.log("Error parsing URL:", tab.url);
    }
};
}
function previewTabs(titles) {
    console.log("previewing...");
    console.log(`Video Titles:`, titles); // Fixed variable name

    // Clear the list first so you don't double-post if the function runs twice
    videosList.innerHTML = ''; 

    titles.forEach((title, index) => {
        // We create a unique ID for each row (e.g., item-0, item-1)
        const Id = `videoItem${index}`;

        let item = `
            <li>
                <input type="checkbox" id="${Id}" class="video-checkbox" checked>
                <label for="${Id}">${title}</label>
            </li>
        `;
        videosList.insertAdjacentHTML('beforeend', item);
    });
}






async function createWatchlist(videoIds){
    // built-in way to create a queue list
    const playlistUrl = `https://www.youtube.com/watch_videos?video_ids=${videoIds.join(',')}`;

    await chrome.tabs.create({ url: playlistUrl });

    // Close all the original, individual tabs
    // await chrome.tabs.remove(tabIdsToClose);

    statusDiv.textContent = `Merged ${videoIds.length} videos!`;
}
});