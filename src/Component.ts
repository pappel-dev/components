import {ComponentType, Manager} from "./Manager";
import {PappelId} from "./IdGenerator";

export interface ComponentOptions {
  manager: Manager;
  type: ComponentType;
  elem: Element;
  id: PappelId;
}

export class Component {
  public readonly type: ComponentType;
  public readonly id: string;
  protected readonly manager: Manager;
  protected readonly elem: Element;

  public get parentComponent(): Component | undefined {
    return undefined;
  }

  public get childComponents(): Component[] {
    return [];
  }

  constructor(options: ComponentOptions) {
    this.type = options.type;
    this.id = options.id;
    this.manager = options.manager;
    this.elem = options.elem;
  }

  public init(): void {
    console.log("init");
    this.elem.setAttribute(this.manager.options.idAttr, this.id);
  }

  public destroy(): void {
    console.log("destroy");
    this.elem.removeAttribute(this.manager.options.idAttr);
  }
}
