import {create} from 'xmlbuilder2';
import {XMLBuilder} from 'xmlbuilder2/lib/interfaces.js';
import {ITunesFeed, Item} from './validate';

export default function render(feed: ITunesFeed): string {
  const root = create({version: '1.0'}).ele('rss', {
    version: '2.0',
    'xmlns:itunes': 'http://www.itunes.com/dtds/podcast-1.0.dtd',
    'xmlns:content': 'http://purl.org/rss/1.0/modules/content/'
  });

  const channel = root.ele('channel');

  channel.ele('title').txt(feed.title);
  channel.ele('link').txt(feed.link);
  channel.ele('language').txt(feed.language);
  channel.ele('description').txt(feed.description);

  channel.ele('itunes:image', {href: feed.itunesImage});

  const category = channel.ele('itunes:category', {text: feed.itunesCategory});

  if (feed.itunesSubCategory) {
    category.ele('itunes:category', {text: feed.itunesSubCategory});
  }

  if (feed.copyright) {
    channel.ele('copyright').txt(feed.copyright);
  }

  if (feed.itunesAuthor) {
    channel.ele('itunes:author').txt(feed.itunesAuthor);
  }

  if (feed.itunesOwner) {
    const owner = channel.ele('itunes:owner');
    owner.ele('itunes:email').txt(feed.itunesOwner.email);

    /* istanbul ignore else */
    if (feed.itunesOwner.name) {
      owner.ele('itunes:name').txt(feed.itunesOwner.name);
    }
  }

  for (const item of feed.items) {
    renderChannelItem(channel, item);
  }

  return root.end({prettyPrint: true});
}

function renderChannelItem(channel: XMLBuilder, item: Item): XMLBuilder {
  const channelItem = channel.ele('item');

  channelItem.ele('title').txt(item.title);
  channelItem.ele('enclosure', item.enclosure);

  if (item.guid) {
    channelItem.ele('guid').txt(item.guid);
  }

  if (item.description) {
    channelItem.ele('description').txt(item.description);
  }

  if (item.pubDate) {
    channelItem.ele('pubDate').txt(item.pubDate.toUTCString());
  }

  return channelItem;
}
