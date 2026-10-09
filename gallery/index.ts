// The contrived gallery: 36 made-up interfaces built from the library to the osrs-interface skill,
// rated on the published Gallery Ratings page. See research/ratings.md for the feedback loop.
import { panels } from "./panels";
import { pickers } from "./pickers";
import { shops } from "./shops";
import { trackers } from "./trackers";

export const gallery = [...shops, ...trackers, ...pickers, ...panels];
export type { GalleryExample } from "./shared";
