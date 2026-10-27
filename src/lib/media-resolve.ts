import { media, type Media, type MediaKey } from "./media";

// Images are stored either as a key for the interim photo set (e.g. "serum")
// or as a full URL (Supabase Storage uploads from the admin).
export function resolveMedia(src: string | null | undefined, alt = ""): Media {
  if (src && src in media) return media[src as MediaKey];
  const url = src || media.botanical.large;
  return { small: url, large: url, original: url, width: 1200, height: 1500, alt };
}
