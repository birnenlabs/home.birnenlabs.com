import { ConfigurationElement, ConfigurationLink, ConfigurationType, ConfigurationWeather } from "../configuration/config";

const PROPERTY_NAME_CLASS = 'settings-elementsList-propertyName';
const PROPERTY_VALUE_CLASS = 'settings-elementsList-propertyValue';
const PROPERTY_ROW_CLASS = 'settings-elementsList-propertyRow';

export class SettingsElementsListView {
  readonly bookmarkTemplate: HTMLTemplateElement = document.getElementById('settings-elementsList-bookmarkTemplate') as HTMLTemplateElement;
  readonly list: HTMLDivElement = document.getElementById('settings-elementsList-list') as HTMLDivElement;
  readonly renderRequiredCallback: () => void;

  constructor(configElements: ConfigurationElement[], renderRequiredCallback: () => void = () => {}) {
    this.list.replaceChildren(
      ...configElements.map(element => this.configElementToDiv(element)));
    this.renderRequiredCallback = renderRequiredCallback;
  }

  public getConfigElements(): ConfigurationElement[] {
    return Array.from(this.list.children).map(child => SettingsElementsListView.divToConfigElement(child as HTMLDivElement));
  }

  public addConfigElement(configElement: ConfigurationElement): void {
    this.list.appendChild(this.configElementToDiv(configElement));
  }

  private configElementToDiv(configElement: ConfigurationElement): HTMLDivElement {
    const div = document.createElement('div');

    for (const [key, value] of Object.entries(configElement)) {
      const nameSpan = document.createElement('span');
      nameSpan.className = PROPERTY_NAME_CLASS;
      nameSpan.textContent = key;

      const valueSpan = document.createElement('span');
      valueSpan.className = PROPERTY_VALUE_CLASS;
      valueSpan.textContent = String(value);

      const rowDiv = document.createElement('div');
      rowDiv.classList.add(PROPERTY_ROW_CLASS, PROPERTY_ROW_CLASS + '-' + key);
      rowDiv.appendChild(nameSpan);
      rowDiv.appendChild(document.createTextNode(': '));
      rowDiv.appendChild(valueSpan);

      div.appendChild(rowDiv);
    }

    const btnUp = document.createElement('button');
    btnUp.textContent = '↑';
    btnUp.classList.add('settings-elementsList-btnUp');
    btnUp.addEventListener('click', () => {
      // No need to check if it's the first element as first up button is hidden by css.
      div.parentElement?.insertBefore(div, div.previousElementSibling);
      this.renderRequiredCallback();
    });

    const btnDown = document.createElement('button');
    btnDown.textContent = '↓';
    btnDown.classList.add('settings-elementsList-btnDown');
    btnDown.addEventListener('click', () => {
      // No need to check if it's the last element as last down button is hidden by css.
      div.parentElement?.insertBefore(div, div.nextElementSibling!.nextSibling);
      this.renderRequiredCallback();
    });

    const btnDelete = document.createElement('button');
    btnDelete.textContent = 'Delete';
    btnDelete.classList.add('settings-elementsList-btnDelete');
    btnDelete.addEventListener('click', () => {
      div.parentElement?.removeChild(div);
      this.renderRequiredCallback();
    });

    div.appendChild(btnUp);
    div.appendChild(btnDown);
    div.appendChild(btnDelete);
    return div;
  }

  private static divToConfigElement(div: HTMLDivElement): ConfigurationElement {
    const result: { [key: string]: any } = {
      type: ConfigurationType.Unknown, // Default type, will be overridden
    };
    for (const row of div.children) {
      if (row.classList.contains(PROPERTY_ROW_CLASS)) {
        const nameSpan = row.querySelector(`.${PROPERTY_NAME_CLASS}`);
        const valueSpan = row.querySelector(`.${PROPERTY_VALUE_CLASS}`);
        if (nameSpan && valueSpan) {
          const name = nameSpan.textContent?.trim();
          const value = valueSpan.textContent?.trim();
          if (name && value) {
            result[name] = value;
          }
        }
      }
    }
    if (result.type === ConfigurationType.Link) {
      return result as ConfigurationLink;
    } else if (result.type === ConfigurationType.Weather) {
      return result as ConfigurationWeather;
    } else {
      throw new Error('Unknown configuration element type');
    }
  }
}