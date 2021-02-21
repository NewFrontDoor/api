import {Except} from 'type-fest';
import validate, {
  itunesFeed,
  item,
  ITunesFeed,
  MaybeITunesFeed,
  ITunesFeedInterface,
  ItemInterface
} from './validate';
import render from './render';

export default class Feed {
  readonly feed: MaybeITunesFeed;

  constructor(feed: Except<ITunesFeedInterface, 'items'>) {
    this.feed = itunesFeed.cast(feed);
  }

  public addItem(toAdd: ItemInterface): number {
    return this.feed.items.push(item.cast(toAdd));
  }

  public async render(): Promise<string> {
    return this.validate().then(render);
  }

  public async validate(): Promise<ITunesFeed> {
    return validate(this.feed);
  }
}
