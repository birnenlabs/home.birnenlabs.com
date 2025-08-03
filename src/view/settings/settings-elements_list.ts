import { Configuration, ConfigurationElement, ConfigurationLink, ConfigurationType, ConfigurationWeather } from "../../configuration/config";
import { EMPTY_SVG } from "../settings";

const PROPERTY_NAME_CLASS = 'settings-elementsList-propertyName';
const PROPERTY_VALUE_CLASS = 'settings-elementsList-propertyValue';
const PROPERTY_ROW_CLASS = 'settings-elementsList-propertyPair';

export class SettingsElementsListView {
  readonly bookmarkTemplate: HTMLTemplateElement = document.getElementById('settings-elementsList-bookmarkTemplate') as HTMLTemplateElement;
  readonly list: HTMLDivElement = document.getElementById('settings-elementsList-list') as HTMLDivElement;
  readonly onConfigurationChanged: () => void;

  constructor(onConfigurationChanged: (configElements: ConfigurationElement[]) => void) {
    this.onConfigurationChanged = () => onConfigurationChanged(this.getConfigElements());
  }

  public init(configuration: Configuration): Promise<any> {
    this.init = () => { throw new Error('Class has already been initialized.') };

    this.list.replaceChildren(
      ...(configuration.elements || []).map(element => this.configElementToDiv(element)));

    return Promise.resolve();
  }

  public destroy(): void {
    this.list.replaceChildren();
  }

  public addConfigElement(configElement: ConfigurationElement): void {
    this.list.appendChild(this.configElementToDiv(configElement));
  }

  private getConfigElements(): ConfigurationElement[] {
    return Array.from(this.list.children).map(child => this.divToConfigElement(child as HTMLDivElement));
  }

  private configElementToDiv(configElement: ConfigurationElement): HTMLDivElement {
    const div = document.createElement('div');

    // Custom widgets based on type
    if (configElement.type === ConfigurationType.Link) {
      const faviconImg = document.createElement('img');
      faviconImg.className = 'settings-elementsList-faviconImg';
      faviconImg.src = (configElement as ConfigurationLink).favicon || EMPTY_SVG;
      div.appendChild(faviconImg);
    }

    for (const [key, value] of Object.entries(configElement).sort(nameFirstComparator)) {
      const nameSpan = document.createElement('span');
      nameSpan.className = PROPERTY_NAME_CLASS;
      nameSpan.textContent = key;

      const valueSpan = document.createElement('span');
      valueSpan.className = PROPERTY_VALUE_CLASS;
      valueSpan.textContent = value || '';
      valueSpan.addEventListener('click', () => {
        const selection = window.getSelection();
        const range = document.createRange();
        range.selectNodeContents(valueSpan);
        selection?.removeAllRanges();
        selection?.addRange(range);
      });

      const rowDiv = document.createElement('div');
      rowDiv.classList.add(PROPERTY_ROW_CLASS + '_' + key, PROPERTY_ROW_CLASS);
      rowDiv.appendChild(nameSpan);
      rowDiv.appendChild(document.createTextNode(': '));
      rowDiv.appendChild(valueSpan);

      div.appendChild(rowDiv);
    }

    // Add buttons for moving and deleting the element

    const btnUp = document.createElement('button');
    btnUp.textContent = '↑';
    btnUp.classList.add('settings-elementsList-btnUp');
    btnUp.addEventListener('click', () => {
      // No need to check if it's the first element as first up button is hidden by css.
      div.parentElement?.insertBefore(div, div.previousElementSibling);
      div.classList.add('settings-elementsList-propertyRowMoved');
      setTimeout(() => div.classList.remove('settings-elementsList-propertyRowMoved'), 1000);
      this.onConfigurationChanged();
    });

    const btnDown = document.createElement('button');
    btnDown.textContent = '↓';
    btnDown.classList.add('settings-elementsList-btnDown');
    btnDown.addEventListener('click', () => {
      // No need to check if it's the last element as last down button is hidden by css.
      div.parentElement?.insertBefore(div, div.nextElementSibling!.nextSibling);
      div.classList.add('settings-elementsList-propertyRowMoved');
      setTimeout(() => div.classList.remove('settings-elementsList-propertyRowMoved'), 1000);
      this.onConfigurationChanged();
    });

    const btnDelete = document.createElement('button');
    btnDelete.textContent = 'Delete';
    btnDelete.classList.add('settings-elementsList-btnDelete');
    btnDelete.addEventListener('click', () => {
      div.classList.add('settings-elementsList-propertyRowDeleted');
      setTimeout(() => {
        div.parentElement?.removeChild(div);
        this.onConfigurationChanged();
      }, 500);
    });

    div.appendChild(btnUp);
    div.appendChild(btnDown);
    div.appendChild(btnDelete);
    div.classList.add('settings-elementsList-propertyRow');
    return div;
  }

  private divToConfigElement(div: HTMLDivElement): ConfigurationElement {
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
          if (name) {
            result[name] = value || '';
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

function nameFirstComparator([keyA]: [string, any], [keyB]: [string, any]): number {
  if (keyA === 'name') return -1;
  if (keyB === 'name') return 1;

  return keyA.localeCompare(keyB);
}
