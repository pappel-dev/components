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
  public parentComponent: Component | undefined = undefined;
  public childComponents: Component[] = [];

  constructor(options: ComponentOptions) {
    this.type = options.type;
    this.id = options.id;
    this.manager = options.manager;
    this.elem = options.elem;
  }

  public init(): void {
    console.log("init");
    this.elem.setAttribute(this.manager.options.idAttr, this.id);
    this.updateParentChildConnections("init");
  }

  public destroy(): void {
    console.log("destroy");
    this.elem.removeAttribute(this.manager.options.idAttr);
    this.updateParentChildConnections("destroy");
  }

  private updateParentChildConnections(onInitOrDestroy: "init" | "destroy"): void {
    this.parentComponent = this.manager.getParentComponentByElem(this.elem);
    const parentComponent = this.parentComponent;
    this.childComponents = this.manager.getChildComponentsByElem(this.elem);
    const childComponents = this.childComponents;

    if (parentComponent !== undefined) {
      if (onInitOrDestroy === "destroy") {
        this.manager.removeChildComponent(this, parentComponent);
        childComponents.forEach(child => {
          this.manager.addChildComponent(child, parentComponent);
        });
      } else {
        this.manager.addChildComponent(this, parentComponent);
        childComponents.forEach(child => {
          this.manager.removeChildComponent(child, parentComponent);
        });
      }
    }

    childComponents.forEach(child => {
      this.manager.setParentComponent(onInitOrDestroy === "destroy" ? parentComponent : this, child);
    });
  }
}
