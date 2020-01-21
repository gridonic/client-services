export interface ComponentRelay {
  parse(componentInfo: ComponentInfo): any;
}

export interface ComponentProvider {
  componentInfos: ComponentInfo[];
}

export interface ComponentInfo {
  selector: string;
  component: (() => any)|any;
  before?: () => void,
  args?: { [key: string]: any }
}
