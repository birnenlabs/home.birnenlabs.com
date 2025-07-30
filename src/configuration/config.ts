import { deflate, inflate } from 'fflate';
import { toBase64URL, fromBase64URL } from './base64';

export enum ConfigurationType {
  Unknown = 'u',
  Link = 'l',
  Weather = 'w',
}

export type ConfigurationElement = ConfigurationLink | ConfigurationWeather;

const CONFIG_PARAM_NAME = 'c';

const DEFAULT_CONFIGURATION: Configuration = {
  elements: [
    {
      type: ConfigurationType.Link,
      name: 'Birnenlabs',
      url: 'https://birnenlabs.com',
    },
  ]
}

/**
 * Processes the current URL to extract the configuration parameter.
 * @returns A Promise that resolves with the current configuration
 */
export function configFromUrl(): Promise<Configuration> {
  const urlParams = new URLSearchParams(window.location.search);
  const configParam = urlParams.get(CONFIG_PARAM_NAME);
  return configParam
    ? compressedStringToObject(configParam)
    : Promise.resolve(DEFAULT_CONFIGURATION);
}

/**
 * Creates a URL with the given configuration object as a compressed string.
 * @param config The configuration object to convert to a URL.
 * @returns URL with the configuration parameter set.
 */
export function configToUrl(config: Configuration): Promise<URL> {
  return objectToCompressedString(config)
    .then(compressedString => {
      const url = new URL(window.location.href);
      url.searchParams.set(CONFIG_PARAM_NAME, compressedString);
      return url;
    }
    );
}


/**
 * Defines the structure of the application's configuration.
 * All fields are optional to provide compatibility between
 * future and past versions.
 */
export interface Configuration {
  elements?: ConfigurationElement[];
}

export interface ConfigurationLink {
  type: ConfigurationType.Link,
  name?: string;
  url?: string;
  favicon?: string;
}

export interface ConfigurationWeather {
  type: ConfigurationType.Weather,
  location?: string;
}

function objToConfiguration(obj: any): Configuration {
  if (typeof obj !== 'object' || obj === null) {
    throw new Error('Input must be a non-null object.');
  }

  if ('elements' in obj && !Array.isArray(obj.elements)) {
    throw new Error('The "widgets" property must be an array if it exists.');
  }

  for (const item of obj.elements || []) {
    if (typeof item !== 'object' || item === null) {
      throw new Error('Each widget must be a non-null object.');
    }
    if ('name' in item && typeof item.name !== 'string') {
      throw new Error('Widget "name" must be a string if it exists.');
    }
    if ('url' in item && typeof item.url !== 'string') {
      throw new Error('Widget "url" must be a string if it exists.');
    }
    if ('location' in item && typeof item.location !== 'string') {
      throw new Error('Widget "location" must be a string if it exists.');
    }
  }

  return obj as Configuration;
}

// The TextEncoder and TextDecoder are built-in browser APIs
const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder();

/**
 * Asynchronously compresses a Configuration object into a Base64URL string.
 * @param config The Configuration object to compress.
 * @returns A Promise that resolves with the compressed, URL-safe string.
 */
function objectToCompressedString(config: Configuration): Promise<string> {
  return Promise.resolve(config)
    .then(conf => JSON.stringify(conf))
    .then(j => textEncoder.encode(j))
    .then(data => new Promise<Uint8Array>((resolve, reject) => {
      deflate(data, (err, result) => err ? reject(err) : resolve(result));
    }))
    .then(a => toBase64URL(a));
}

/**
 * Asynchronously decompresses a Base64URL string back into a Configuration object.
 * @param str The compressed Base64URL string.
 * @returns A Promise that resolves with the reconstituted Configuration object.
 */
function compressedStringToObject(str: string): Promise<Configuration> {
  return Promise.resolve(str)
    .then((s) => fromBase64URL(s))
    .then(data => new Promise<Uint8Array>((resolve, reject) => {
      inflate(data, (err, result) => err ? reject(err) : resolve(result));
    }))
    .then((t) => textDecoder.decode(t))
    .then((conf) => JSON.parse(conf))
    .then((j) => objToConfiguration(j));
}
