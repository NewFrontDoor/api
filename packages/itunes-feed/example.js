const {default: Feed} = require('.');

// Creating a new feed
const feed = new Feed({
  description:
    'Love to get outdoors and discover nature’s treasures? Hiking Treks is the show for you. We review hikes and excursions, review outdoor gear and interview a variety of naturalists and adventurers. Look for new episodes each week.',
  itunesCategory: 'Sports',
  itunesSubCategory: 'Wilderness',
  itunesExplicit: false,
  itunesImage:
    'https://applehosted.podcasts.apple.com/hiking_treks/artwork.png',
  language: 'en-us',
  link: 'https://www.apple.com/itunes/podcasts/',
  title: 'Hiking Treks'
});

// Adding an item
feed.addItem({
  title: 'Hiking Treks Trailer',
  description:
    'The Sunset Explorers share tips, techniques and recommendations for great hikes and adventures around the United States. Listen on Apple Podcasts.',
  enclosure: {
    length: 498537,
    type: 'audio/mpeg',
    url: 'http://example.com/podcasts/everything/AllAboutEverythingEpisode4.mp3'
  }
});

(async function () {
  // Validating the `feed`
  await feed.validate();

  // Rendering the `feed`
  const xml = await feed.render();

  // Yields
  console.log(xml);
})();
