import { configFromUrl, Configuration, ConfigurationType } from '../configuration/config';


export class AppView {
  readonly modules: HTMLDivElement;

  constructor() {
    this.modules = document.getElementById('modules') as HTMLDivElement;
    if (!this.modules) {
      throw new Error('Fatal Error: required elements not found in the DOM!');
    }
  }

  public render(): Promise<any> {
    return configFromUrl()
      .then((config: Configuration) => {
        this.modules.innerHTML = '';
        (config.elements || []).forEach((widget) => {

          switch (widget.type) {
            case ConfigurationType.Link:
              const imgEl = document.createElement('img');
              imgEl.onerror = () => imgEl.src = '#';
              imgEl.src = widget.favicon || 'https://www.google.com/s2/favicons?domain=' + new URL(widget.url || '#').hostname;

              const aEl = document.createElement('a');
              aEl.title = widget.name || '';
              aEl.href = widget.url || '#';
              aEl.appendChild(imgEl);

              this.modules.appendChild(aEl);
              break;

            case ConfigurationType.Weather:
              // TypeScript now knows `widget` is a ConfigurationWeather
              console.log(widget.location);
              break;
            default:
              console.warn('Unknown widget:', widget);
          }
        });
      })
      .catch((error) => {
        console.error('Error loading configuration:', error);
        this.modules.innerHTML = '<p>Error loading modules. Please try again later.</p>';
      }
      );
  }
}