import { Configuration, ConfigurationType, ConfigurationLink } from '../configuration/config';
import { getFallbackIconForUrl } from '../configuration/image';


export class AppView {
  readonly appContainer = document.getElementById('app') as HTMLDivElement;
  readonly modules = document.getElementById('app-modules') as HTMLDivElement;

  constructor() {
  }

  public init(config: Configuration): Promise<any> {
    this.init = () => { throw new Error('Class has already been initialized.') };
  
    return Promise.resolve(config)
      .then((config) => {
        this.modules.innerHTML = '';
        (config.elements || []).forEach((configElement) => {

          switch (configElement.type) {
            case ConfigurationType.Link:
              this.modules.appendChild(createConfigurationLink(configElement));
              break;

            case ConfigurationType.Weather:
              // TypeScript now knows `widget` is a ConfigurationWeather
              console.log(configElement.location);
              break;
            default:
              console.warn('Unknown configElement:', configElement);
          }
        });
      })
      .catch((error) => {
        console.error('Error loading configuration:', error);
        this.modules.innerHTML = '<p>Error loading modules. Please try again later.</p>';
      }
      )
      .finally(() => this.appContainer.style.display = 'block');
  }

  public destroy(): void {
    this.appContainer.parentElement?.removeChild(this.appContainer);
  }
}

function createConfigurationLink(configElement: ConfigurationLink): HTMLDivElement {
  const linkEl = document.createElement('div');
  linkEl.className = 'app-configElement-link';

  const imgEl = document.createElement('img');
  imgEl.onerror = () => imgEl.src = '#';
  imgEl.src = configElement.favicon || getFallbackIconForUrl(new URL(configElement.url || '#'));

  const aEl = document.createElement('a');
  aEl.title = configElement.name || '';
  aEl.href = configElement.url || '#';
  aEl.appendChild(imgEl);
  aEl.className = 'app-configElement-link-anchor';

  const labelEl = document.createElement('span');
  labelEl.className = 'app-configElement-link-label';
  labelEl.textContent = configElement.name || '';

  linkEl.appendChild(aEl);
  linkEl.appendChild(labelEl);
  return linkEl;
}