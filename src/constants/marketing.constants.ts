const unsplash = (photoId: string, width: number) =>
  `https://images.unsplash.com/${photoId}?auto=format&fit=crop&w=${width}&q=80`;

export const MARKET_IMAGES = {
  hero: unsplash("photo-1523240795612-9a054b0db644", 2000),
  quad: unsplash("photo-1541339907198-e08756dedf3f", 1600),
  books: unsplash("photo-1497633762265-9d179a990aa6", 1200),
  laptop: unsplash("photo-1517336714731-489689fd1ca8", 1200),
  headphones: unsplash("photo-1505740420928-5e560c06d30e", 1200),
  bike: unsplash("photo-1485965120184-e220f721d03e", 1200),
  sofa: unsplash("photo-1555041469-a586c61ea9bc", 1200),
  desk: unsplash("photo-1434030216411-0b793f4b4173", 1400),
  students: unsplash("photo-1522202176988-66273c2fd55f", 1600),
  sneakers: unsplash("photo-1542291026-7eec264c27ff", 1200),
  auth: unsplash("photo-1523050854058-8df90110c9f1", 1600),
} as const;

export const MARKET_LANES = [
  {
    title: "Textbooks",
    query: "textbook",
    image: MARKET_IMAGES.books,
    caption: "Course books between semesters",
  },
  {
    title: "Electronics",
    query: "laptop",
    image: MARKET_IMAGES.laptop,
    caption: "Laptops, audio, and chargers",
  },
  {
    title: "Campus gear",
    query: "bike",
    image: MARKET_IMAGES.bike,
    caption: "Bikes, bags, and daily kit",
  },
  {
    title: "Dorm living",
    query: "desk",
    image: MARKET_IMAGES.sofa,
    caption: "Furniture for the next move",
  },
] as const;

export const POPULAR_SEARCHES = ["Textbooks", "Bike", "Headphones", "Desk"] as const;
