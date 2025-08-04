import { configToUrl, Configuration, ConfigurationElement } from "../../configuration/config";

export class SettingsRawView {
  readonly link = document.getElementById('settings-link') as HTMLAnchorElement;
  readonly linkCounter = document.getElementById('settings-link-counter') as HTMLSpanElement;
  readonly showRawConfigButton = document.getElementById('settings-showRawConfig') as HTMLButtonElement;
  readonly rawConfig = document.getElementById('settings-rawConfig') as HTMLPreElement;

  constructor() { }

  public init(configuration: Configuration): Promise<any> {
    this.init = () => { throw new Error('Class has already been initialized.') };

    this.showRawConfigButton.addEventListener('click', this.showRawConfigButtonClick.bind(this));
    return this.setConfiguration(configuration);
  }

  public destroy(): void {
    this.rawConfig.textContent = '';
    this.link.innerText = '';
    this.link.href = '#';
  }

  public addConfigElement(configElement: ConfigurationElement): Promise<any> {
    return Promise.resolve(this.getConfiguration())
      .then(configuration => {
        configuration.elements = configuration.elements || [];
        configuration.elements.push(configElement);
        return configuration;
      })
      .then(configuration => this.setConfiguration(configuration));
  }

  public setConfigElements(configElements: ConfigurationElement[]): Promise<any> {
    // Note: as of now configuration has only one property "elements", so getConfiguration
    // step is not needed (configuration could have been created from scratch) but
    // keeping it for future compatibility.
    return Promise.resolve(this.getConfiguration())
      .then(configuration => {
        configuration.elements = configElements
        return configuration;
      })
      .then(configuration => this.setConfiguration(configuration));
  }

  private getConfiguration(): Configuration {
    return JSON.parse(this.rawConfig.textContent || '') as Configuration;
  }

  private setConfiguration(configuration: Configuration): Promise<any> {
    this.rawConfig.textContent = JSON.stringify(configuration, null, 2);
    this.link.innerText = '';
    this.link.href = '#';
    return configToUrl(configuration)
      .then(url => {
        const urlStr = url.toString();
        this.link.innerText = urlStr;
        this.link.href = urlStr;
        this.linkCounter.textContent = `${urlStr.length}`;
      })
      .catch(error => this.link.innerText = `Error generating link: ${error.message}`);
  }

  private showRawConfigButtonClick() {
    this.rawConfig.classList.remove('hidden');
    this.showRawConfigButton.classList.add('hidden');
  }
}