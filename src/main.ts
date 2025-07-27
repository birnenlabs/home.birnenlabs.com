import { compressedStringToObject } from './config';
import './style.css'
import { Loader } from './configuration/loader';
import { SettingsView } from './view/settings';

let settingsView: SettingsView;

/**
 * Asynchronously extracts and decodes a configuration object from a URL's GET parameter.
 * @param url The full URL string to process (e.g., window.location.href).
 * @param paramName The name of the GET parameter holding the config (defaults to 'c').
 * @returns null
 */
export async function processUrlForConfigAsync(
  url: string,
  paramName: string = 'c'
): Promise<object | null> {
  try {
    const urlObject = new URL(url);
    const configParam = urlObject.searchParams.get(paramName);

    if (configParam) {
      console.log(await compressedStringToObject(configParam));
    }
    return null;
  } catch (error) {
    console.error('Failed to process URL or decompress config:', error);
    return null;
  }
}

function initializePage(): Promise<any> {
  const loaderPromise = Loader.create();

  const appViewPromise = loaderPromise;
  const setingsViewPromise = loaderPromise
    .then(l => (settingsView = new SettingsView(l)))
    .then(s => s.render());

  return Promise.all([appViewPromise, setingsViewPromise]);
}


document.addEventListener('DOMContentLoaded', initializePage);

