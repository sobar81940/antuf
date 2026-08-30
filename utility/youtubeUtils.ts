/**
 * YouTube Thumbnail Utility Functions
 * Provides methods to extract and generate YouTube thumbnail URLs
 */

/**
 * Extract YouTube video ID from various URL formats
 * @param {string} url - YouTube URL (long, short, or embed format)
 * @returns {string|null} - 11 character video ID or null if invalid
 */
export const extractYouTubeId = (url) => {
  if (!url) return null;

  let videoId = null;

  // Standard YouTube URL: https://www.youtube.com/watch?v=dQw4w9WgXcQ
  if (url.includes("youtube.com/watch?v=")) {
    videoId = url.split("v=")[1]?.split("&")[0];
  }
  // Short YouTube URL: https://youtu.be/dQw4w9WgXcQ
  else if (url.includes("youtu.be/")) {
    videoId = url.split("youtu.be/")[1]?.split("?")[0];
  }
  // Embed URL: https://www.youtube.com/embed/dQw4w9WgXcQ
  else if (url.includes("/embed/")) {
    videoId = url.split("/embed/")[1]?.split("?")[0];
  }

  // Validate video ID (should be 11 characters)
  if (videoId && videoId.length === 11) {
    return videoId;
  }

  return null;
};

/**
 * Get YouTube thumbnail URL with specified quality
 * @param {string} videoId - YouTube video ID (11 characters)
 * @param {string} quality - Quality level: 'maxres', 'sd', 'hq', 'mq', 'default'
 * @returns {string} - Thumbnail URL
 */
export const getYouTubeThumbnail = (videoId, quality = "maxres") => {
  const qualities = {
    maxres: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
    sd: `https://img.youtube.com/vi/${videoId}/sddefault.jpg`,
    hq: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
    mq: `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`,
    default: `https://img.youtube.com/vi/${videoId}/default.jpg`,
  };

  return qualities[quality] || qualities.maxres;
};

/**
 * Fetch YouTube oEmbed metadata (channel name, video title, etc.)
 * @param {string} videoId - YouTube video ID
 * @returns {Promise<object|null>} - oEmbed data or null on error
 */
export const fetchYouTubeOEmbed = async (videoId) => {
  try {
    const response = await fetch(
      `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`
    );
    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.error("Error fetching YouTube oEmbed data:", error);
    return null;
  }
};

/**
 * Generate multiple thumbnail quality options
 * @param {string} videoId - YouTube video ID
 * @returns {object} - Object with thumbnails for all quality levels
 */
export const generateThumbnailOptions = (videoId) => {
  return {
    maxres: getYouTubeThumbnail(videoId, "maxres"),
    sd: getYouTubeThumbnail(videoId, "sd"),
    hq: getYouTubeThumbnail(videoId, "hq"),
    mq: getYouTubeThumbnail(videoId, "mq"),
    default: getYouTubeThumbnail(videoId, "default"),
  };
};

export default {
  extractYouTubeId,
  getYouTubeThumbnail,
  fetchYouTubeOEmbed,
  generateThumbnailOptions,
};
