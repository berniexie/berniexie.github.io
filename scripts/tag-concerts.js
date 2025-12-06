// Adds rich tags to each concert entry and writes back to public/concerts.json.
// Safe to rerun any time the source data or tag dictionaries change.
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import artistTags from "./data/artistTags.js";
import { venueTags, festivalGuesses, cityOverrides } from "./data/venueData.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const filePath = path.join(__dirname, "..", "public", "concerts.json");
const concerts = JSON.parse(fs.readFileSync(filePath, "utf8"));

function tagsForVenue(venue) {
  const tags = new Set();
  const direct = venueTags[venue];
  if (direct) direct.forEach((t) => tags.add(t));

  const vLower = venue.toLowerCase();
  festivalGuesses.forEach(({ match, tags: ftags }) => {
    if (vLower.includes(match)) ftags.forEach((t) => tags.add(t));
  });

  const cityTag = cityOverrides[venue];
  if (cityTag) tags.add(cityTag);

  // If we have no location, leave it empty; artist tags will still carry value.
  return [...tags];
}

function tagsForArtist(artist) {
  return artistTags[artist] || ["unknown"];
}

const enriched = concerts.map((entry) => {
  const tags = new Set();
  tagsForArtist(entry.artist).forEach((t) => tags.add(t));
  tagsForVenue(entry.venue).forEach((t) => tags.add(t));

  const status = entry.rating === null ? "cancelled" : undefined;

  return {
    ...entry,
    ...(status ? { status } : {}),
    tags: [...tags]
  };
});

fs.writeFileSync(filePath, JSON.stringify(enriched, null, 2));
console.log("Tagged concerts written:", enriched.length);
