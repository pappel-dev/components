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
  protected readonly elem: Element;
  protected readonly manager: Manager;

  public get parentComponent(): Component | undefined {
    return this.manager.getParentComponentByElem(this.elem);
  }

  public get childComponents(): Component[] {
    return this.manager.getChildComponentsByElem(this.elem);
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
