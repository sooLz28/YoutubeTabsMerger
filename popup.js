document.getElementById('mergeBtn').addEventListener('click', async () => {
    const statusDiv = document.getElementById('status');
    statusDiv.textContent = "Merging...";

    // Find all open youtube videos tabs
    const tabs = await chrome.tabs.query({ url: "*://*.youtube.com/watch*" });

    if (tabs.length === 0) {
        statusDiv.textContent = "No YouTube video tabs were found.";
        return;
    }

    let videoIds = [];
    let tabIdsToClose = [];

    // Extract the video ID (the "v" parameter) from each tab's URL
    tabs.forEach(tab => {
        try {
            let url = new URL(tab.url);
            let videoId = url.searchParams.get('v');
        
        if (videoId) {
            videoIds.push(videoId);
            tabIdsToClose.push(tab.id);
        }
        } catch (e) {
            console.error("Error parsing URL:", tab.url);
        }
    });

    if (videoIds.length > 0) {
        // built-in way to create a queue list
        const playlistUrl = `https://www.youtube.com/watch_videos?video_ids=${videoIds.join(',')}`;

        // Open the new playlist in a new tab
        await chrome.tabs.create({ url: playlistUrl });

        // Close all the original, individual tabs
        // await chrome.tabs.remove(tabIdsToClose);
        
        statusDiv.textContent = `Merged ${videoIds.length} videos!`;
    } else {
        statusDiv.textContent = "Could not find any video IDs.";
    }
});