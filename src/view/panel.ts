export class PanelView {

  readonly panelContainer = document.getElementById('panel') as HTMLDivElement;
  readonly settingsButton = document.getElementById('panel-settings-button') as HTMLButtonElement;

  constructor(onSettingsButtonClick: () => void) {
    this.settingsButton.addEventListener('click', onSettingsButtonClick);
  }

  public init(): Promise<any> {
    return Promise.resolve()
      .finally(() => this.panelContainer.style.display = 'block')
  }

  public destroy() {
    this.panelContainer.parentElement?.removeChild(this.panelContainer);
  }
}
