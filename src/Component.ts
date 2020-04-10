import {ComponentType, Manager} from "./Manager";
import {PappelId} from "./IdGenerator";
import {ReactiveData} from "./ReactiveData";

type AllowedDataTemp = boolean | string | number | Symbol | BigInteger | { [key: string]: AllowedData };
export type AllowedData = AllowedDataTemp | { [key: string]: AllowedDataTemp } | AllowedDataTemp[];

export interface ComponentOptions {
  manager: Manager;
  type: ComponentType;
  elem: Element;
  id: PappelId;
}

export interface Data {
  [key: string]: AllowedData;
}

interface InternalData {
  [key: string]: AllowedData;
}

export class Component {
  public readonly type: ComponentType;
  public readonly id: string;
  protected readonly elem: Element;
  protected readonly manager: Manager;
  protected data: Data = {};
  private internalData: InternalData = {};
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
    this.makeDataReactive();
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

  private makeDataReactive(): void {
    for (let key in this.data) {
      this.addReactiveData(key, this.data[key]);
    }

    this.data = new Proxy(this.internalData, {
      get(target: Data, prop: string) {
        console.log(`get ${prop.toString()}`);
        return target[prop];
      },
      set(target: Data, prop: string, value: any): boolean {
        console.log(`set ${prop.toString()} to ${value}`);
        return target[prop] = value;
      }
    });
  }

  private addReactiveData(propName: string, initialData: AllowedData): void {
    this.internalData[propName] = initialData;
  }
}
