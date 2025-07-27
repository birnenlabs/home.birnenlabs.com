export interface Module {
  readonly name: string;
  render(div: HTMLDivElement, config: object): void;
}