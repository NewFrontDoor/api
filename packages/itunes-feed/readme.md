# Readme

## Usage

```javascript
const {default: Feed} = require('@newfrontdoor/itunes-feed');
```

Creating a new feed

```javascript
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
```

Adding an item

```javascript
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
```

Validating the `feed`

```javascript
  await feed.validate();
```

Rendering the `feed`

```javascript
  const xml = await feed.render();
```

Yields

    <?xml version="1.0"?>
    <rss version="2.0" xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd" xmlns:content="http://purl.org/rss/1.0/modules/content/">
      <channel>
        <title>Hiking Treks</title>
        <link>https://www.apple.com/itunes/podcasts/</link>
        <language>en-us</language>
        <description>Love to get outdoors and discover nature’s treasures? Hiking Treks is the show for you. We review hikes and excursions, review outdoor gear and interview a variety of naturalists and adventurers. Look for new episodes each week.</description>
        <itunes:image href="https://applehosted.podcasts.apple.com/hiking_treks/artwork.png"/>
        <itunes:category text="Sports">
          <itunes:category text="Wilderness"/>
        </itunes:category>
        <item>
          <title>Hiking Treks Trailer</title>
          <enclosure length="498537" type="audio/mpeg" url="http://example.com/podcasts/everything/AllAboutEverythingEpisode4.mp3"/>
          <description>The Sunset Explorers share tips, techniques and recommendations for great hikes and adventures around the United States. Listen on Apple Podcasts.</description>
        </item>
      </channel>
    </rss>

```javascript
})();
```
