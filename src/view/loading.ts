export class LoadingView {
  readonly loadingPanel = document.getElementById('loading') as HTMLDivElement;

  constructor() {}

  // No init method as loading panel is immediatelly shown.

  public destroy() {
    this.loadingPanel.parentElement?.removeChild(this.loadingPanel);
  }
}