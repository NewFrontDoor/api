import {
  boolean,
  object,
  string,
  number,
  array,
  date,
  Asserts,
  TypeOf,
  InferType,
  ObjectSchema
} from 'yup';
import {ObjectShape} from 'yup/lib/object.js';
import {TypedSchema} from 'yup/lib/util/types.js';
import isArtwork from './is-artwork';

export type InferShape<TSchema> = TSchema extends ObjectSchema<infer Shape>
  ? Shape
  : never;

export type UndefinableKeys<Shape extends ObjectShape> = string &
  {
    [K in keyof Shape]?: Shape[K] extends TypedSchema
      ? undefined extends InferType<Shape[K]>
        ? K
        : never
      : never;
  }[keyof Shape];

export type InferInterfaceFromShape<Shape extends ObjectShape> = {
  [K in UndefinableKeys<Shape>]?: Shape[K] extends TypedSchema
    ? InferType<Shape[K]>
    : any;
} &
  {
    [K in Exclude<
      keyof Shape,
      UndefinableKeys<Shape>
    >]: Shape[K] extends TypedSchema ? InferType<Shape[K]> : any;
  };

export type InferInterface<TSchema> = InferInterfaceFromShape<
  InferShape<TSchema>
>;

const category = object({
  domain: string().url().notRequired(),
  value: string().defined()
});

export const item = object({
  /**
   * An episode title.
   */
  title: string().defined(),

  /**
   * The episode content, file size, and file type information.
   */
  enclosure: object({
    url: string().url().defined(),
    length: number().defined(),
    type: string()
      .oneOf([
        'audio/x-m4a',
        'audio/mpeg',
        'video/quicktime',
        'video/mp4',
        'video/x-m4v',
        'application/pdf'
      ])
      .defined()
  }).defined(),

  /**
   * The episode’s globally unique identifier (GUID).
   */
  guid: string().default(undefined).nullable().notRequired(),

  /**
   * The date and time when an episode was released.
   */
  pubDate: date().default(undefined).nullable().notRequired(),

  /**
   * An episode description.
   */
  description: string().default(undefined).nullable().notRequired(),

  /**
   * The duration of an episode in seconds
   */
  itunesDuration: number().default(undefined).nullable().notRequired(),

  /**
   * An episode link URL.
   */
  link: string().url().default(undefined).nullable().notRequired()
});

export type ItemInterface = InferInterface<typeof item>;

export type MaybeItem = TypeOf<typeof item>;

export type Item = Asserts<typeof item>;

export const itunesFeed = object({
  /**
   * The name of the channel.
   *
   * It's how people refer to your service.
   * If you have an HTML website that contains the same information as your RSS file,
   * the title of your channel should be the same as the title of your website.
   */
  title: string().defined(),

  /**
   * The URL to the HTML website corresponding to the channel.
   */
  link: string().url().defined(),

  /**
   * Phrase or sentence describing the channel.
   */
  description: string().defined(),

  /**
   * The artwork for the show.
   */
  itunesImage: string()
    .url()
    .test({
      name: 'is-artwork',
      // eslint-disable-next-line no-template-curly-in-string
      message: '${path} is not valid artwork',
      test: async (value) => isArtwork(value)
    })
    .defined(),

  /**
   * The show category information.
   *
   * https://help.apple.com/itc/podcasts_connect/#/itc9267a2f12
   */
  itunesCategory: string().defined(),
  itunesSubCategory: string().default(undefined).nullable().notRequired(),

  /**
   * The podcast parental advisory information.
   */
  itunesExplicit: boolean().defined(),

  /**
   * The language spoken on the show.
   *
   * http://www.loc.gov/standards/iso639-2/php/code_list.php
   */
  language: string().defined(),

  /**
   * The group responsible for creating the show.
   */
  itunesAuthor: string().default(undefined).nullable().notRequired(),

  /**
   * The podcast owner contact information.
   */
  itunesOwner: object({
    email: string().email().defined(),
    name: string().notRequired()
  })
    .default(undefined)
    .nullable()
    .notRequired(),

  /**
   * Copyright notice for content in the channel.
   */
  copyright: string().notRequired(),

  /**
   * Email address for person responsible for editorial content.
   */
  managingEditor: object({
    email: string().email().defined(),
    name: string().notRequired()
  })
    .default(undefined)
    .nullable()
    .notRequired(),

  /**
   * Email address for person responsible for technical issues relating to channel.
   */
  webMaster: object({
    email: string().email().defined(),
    name: string().notRequired()
  })
    .default(undefined)
    .nullable()
    .notRequired(),

  /**
   * The publication date for the content in the channel.
   */
  pubDate: date().default(undefined).nullable().notRequired(),

  /**
   * The last time the content of the channel changed.
   */
  lastBuildDate: date().default(undefined).nullable().notRequired(),

  /**
   * Specify one or more categories that the channel belongs to.
   */
  category: array().of(category).default(undefined).nullable().notRequired(),

  /**
   * A string indicating the program used to generate the channel.
   */
  generator: string().default(undefined).nullable().notRequired(),

  /**
   * A URL that points to the documentation for the format used in the RSS file.
   * It's for people who might stumble across an RSS file on a Web server 25 years from now and wonder what it is.
   */
  docs: string().url().default(undefined).nullable().notRequired(),

  /**
   * Allows processes to register with a cloud to be notified of updates to the channel,
   * implementing a lightweight publish-subscribe protocol for RSS feeds.
   */
  cloud: object({
    domain: string().url().defined(),
    port: number().defined(),
    path: string().defined(),
    registerProcedure: string().defined(),
    protocol: string().oneOf(['xml-rpc', 'soap', 'http-post'])
  })
    .default(undefined)
    .nullable()
    .notRequired(),

  /**
   * It's a number of minutes that indicates how long a channel can be cached before refreshing from the source
   * ttl stands for time to live.
   */
  ttl: number().notRequired(),

  /**
   * Specifies a GIF, JPEG or PNG image that can be displayed with the channel.
   */
  image: object({
    url: string().url().defined(),

    title: string().defined(),

    link: string().url().defined(),

    width: number().notRequired(),
    height: number().notRequired()
  })
    .default(undefined)
    .nullable()
    .notRequired(),

  items: array(item.defined()).defined().default([])
});

export type ITunesFeedInterface = InferInterface<typeof itunesFeed>;

export type MaybeITunesFeed = TypeOf<typeof itunesFeed>;

export type ITunesFeed = Asserts<typeof itunesFeed>;

export default async function validate(feed: unknown): Promise<ITunesFeed> {
  return itunesFeed.validate(feed);
}
