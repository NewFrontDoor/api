import test from 'ava';
import Feed from '../src';

const validFeed = {
  description: 'Crossroads Hobart',
  itunesCategory: 'Religion & Spirituality',
  itunesExplicit: false,
  itunesImage:
    'https://cdn.sanity.io/images/woz73k85/production/978bdd3f25e8b01bfcac978ec763c22412d62cb7-1934x1934.png?w=1400',
  language: 'en',
  link: 'https://crossroadshobart.org',
  title: 'Crossroads Presbyterian Church Hobart'
};

const completeFeed = {
  ...validFeed,
  copyright: '© Crossroads Hobart 2020',
  itunesAuthor: 'Crossroads Presbyterian Church Hobart',
  itunesSubCategory: 'Christianity',
  itunesOwner: {
    email: 'dan@crossroadshobart.org',
    name: 'Dan Shepheard'
  }
};

const item = {
  title: 'Joshua 9',
  enclosure: {
    length: 498537,
    type: 'audio/mpeg',
    url: 'http://example.com/podcasts/everything/AllAboutEverythingEpisode4.mp3'
  }
};

const completeItem = {
  autho: 'Mike Hall',
  title: 'Joshua 3:1-5:12',
  pubDate: new Date(Date.UTC(2020, 0, 1)),
  description: 'Joshua 3 Chapter 1 Verse 5 to Chapter 5 verse 12',
  guid: '123e4567-e89b-12d3-a456-426655440000',
  enclosure: {
    length: 498537,
    type: 'audio/mpeg',
    url: 'http://example.com/podcasts/everything/AllAboutEverythingEpisode4.mp3'
  }
};

test('it validates a feed with required fields', async (t) => {
  const feed = new Feed(validFeed);

  feed.addItem(item);

  await t.notThrowsAsync(async () => feed.validate());
});

test('it renders a valid feed', async (t) => {
  const feed = new Feed(validFeed);

  feed.addItem(item);

  t.snapshot(await feed.render());
});

test('it validates a feed with all fields', async (t) => {
  const feed = new Feed(completeFeed);

  feed.addItem(item);
  feed.addItem(completeItem);

  await t.notThrowsAsync(async () => feed.validate());
});

test('it renders a complete feed', async (t) => {
  const feed = new Feed(completeFeed);

  feed.addItem(item);
  feed.addItem(completeItem);

  t.snapshot(await feed.render());
});
