export function getEmbedUrl(videoUrl: string): string | null {
  if (!videoUrl) return null;

  // Handle YouTube (matches standard, shortened, and already-embed links)
  const ytRegExp =
    /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
  const ytMatch = videoUrl.match(ytRegExp);
  if (ytMatch && ytMatch[1]) {
    return `https://www.youtube.com/embed/${ytMatch[1]}`;
  }

  // Fallback if neither matches
  return null;
}
