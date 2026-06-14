// YouTube Data API Service
// This service fetches real YouTube videos for courses
// Requires YOUTUBE_API_KEY in .env file

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

// Fallback videos when API is not available
// These are high-quality, general education videos that work for any CS topic
const fallbackVideos = {
  default: [
    { id: "fallback-intro", title: "CS Fundamentals Introduction", url: "https://www.youtube.com/watch?v=zOjov-2OZ0E", thumbnail: "" },
    { id: "fallback-complete", title: "Complete Course Overview", url: "https://www.youtube.com/watch?v=rfscVS0vtbw", thumbnail: "" },
    { id: "fallback-advanced", title: "Advanced Technical Concepts", url: "https://www.youtube.com/watch?v=pTB0EiLXUC8", thumbnail: "" }
  ]
};

/**
 * Search YouTube for tutorial videos
 * @param {string} query - Search query (e.g., "Python programming")
 * @param {number} maxResults - Maximum number of results (default: 5)
 * @returns {Promise<Array>} Array of video objects
 */
const ytCache = new Map();

export async function searchYouTubeVideos(query, maxResults = 5) {
  // If no API key, return fallback videos
  if (!YOUTUBE_API_KEY) {
    console.log("YouTube API key not configured. Using fallback videos.");
    return getFallbackVideos(query);
  }

  const cacheKey = `${query}-${maxResults}`;
  if (ytCache.has(cacheKey)) {
    return ytCache.get(cacheKey);
  }

  try {
    const searchQuery = encodeURIComponent(query + " tutorial complete course");
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${searchQuery}&type=video&maxResults=${maxResults}&key=${YOUTUBE_API_KEY}`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`YouTube API error: ${response.status}`);
    }

    const data = await response.json();

    if (!data.items || data.items.length === 0) {
      return getFallbackVideos(query);
    }

    const results = data.items.map(item => ({
      id: item.id.videoId,
      title: item.snippet.title,
      url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
      thumbnail: item.snippet.thumbnails.medium?.url || item.snippet.thumbnails.default?.url,
      channelTitle: item.snippet.channelTitle,
      publishedAt: item.snippet.publishedAt
    }));

    ytCache.set(cacheKey, results);
    return results;
  } catch (error) {
    console.error("YouTube API search failed:", error.message);
    return getFallbackVideos(query);
  }
}

/**
 * Get fallback videos when API is not available
 * @param {string} query - Search query
 * @returns {Array} Array of fallback video objects
 */
function getFallbackVideos(query) {
  console.log(`Using fallback videos for: ${query}`);
  return fallbackVideos.default.map((video, index) => ({
    ...video,
    title: `${query} - Video ${index + 1}`,
    id: `fallback-${query}-${index}`
  }));
}

/**
 * Fetch video details by video ID
 * @param {string} videoId - YouTube video ID
 * @returns {Promise<Object|null>} Video details or null
 */
export async function getVideoDetails(videoId) {
  if (!YOUTUBE_API_KEY) {
    return null;
  }

  try {
    const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${videoId}&key=${YOUTUBE_API_KEY}`;
    const response = await fetch(url);

    if (!response.ok) {
      return null;
    }

    const data = await response.json();

    if (!data.items || data.items.length === 0) {
      return null;
    }

    const item = data.items[0];
    return {
      id: item.id,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnail: item.snippet.thumbnails.high?.url,
      views: item.statistics?.viewCount,
      likes: item.statistics?.likeCount,
      publishedAt: item.snippet.publishedAt
    };
  } catch (error) {
    console.error("Failed to fetch video details:", error.message);
    return null;
  }
}

/**
 * Batch search for multiple topics
 * @param {Array<string>} topics - Array of search queries
 * @param {number} maxResultsPerTopic - Results per topic
 * @returns {Promise<Object>} Map of topic to videos
 */
export async function batchSearchVideos(topics, maxResultsPerTopic = 3) {
  const results = {};

  for (const topic of topics) {
    try {
      results[topic] = await searchYouTubeVideos(topic, maxResultsPerTopic);
    } catch (error) {
      console.error(`Failed to search for ${topic}:`, error.message);
      results[topic] = getFallbackVideos(topic);
    }
  }

  return results;
}
