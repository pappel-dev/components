import {IdGenerator, PappelId} from "./IdGenerator";
import {Component} from "./Component";

export type ComponentType = string;

export type ComponentMapping = {
  [key in ComponentType]: any;
}

export interface Options {
  componentAttr: string;
  components: ComponentMapping;
  idAttr: string;
  scope: Node;
}

/**
 * The Manager class setups the components.
 */
export class Manager {
  /**
   * Represents the version of @pappel-dev/components currently in use.
   */
  public readonly version: string = "__version__";

  /**
   * used to identify class internally
   */
  private readonly id: PappelId;

  /**
   * Options used internally
   */
  public readonly options: Options;

  /**
   * MutationObserver instance
   */
  private observer: MutationObserver | undefined;

  /**
   * Default options
   */
  private readonly defaultOptions: Options = {
    componentAttr: "data-p-comp",
    components: {},
    idAttr: "data-p-id",
    scope: document
  };

  private components: { [key in PappelId]: Component } = {};

  /**
   * @param managerOptions: a set of options
   */
  constructor(managerOptions: Options) {
    this.id = IdGenerator.getNewId();
    this.options = {...this.defaultOptions, ...managerOptions};

    this.initObserver();
    this.startObserver();
    this.searchAndInitOrDestroyComponents(this.options.scope, "init");
  }

  public getComponentByElem(elem: Element): Component | undefined {
    if (!elem.hasAttribute(this.options.idAttr)) {
      return undefined;
    }

    const id = elem.getAttribute(this.options.idAttr);
    if (id === null) {
      return undefined;
    }

    return this.getComponentById(id);
  }

  public getComponentById(id: PappelId): Component | undefined {
    if (Object.prototype.hasOwnProperty.call(this.components, id)) {
      return this.components[id];
    } else {
      return undefined;
    }
  }

  public getParentComponentByElem(elem: Element): Component | undefined {
    const parent = elem.parentElement;

    if (parent === null || this.options.scope.isSameNode(parent)) {
      return undefined;
    }

    const comp = this.getComponentByElem(parent);

    if (comp === undefined) {
      return this.getParentComponentByElem(parent);
    } else {
      return comp;
    }
  }

  public getChildComponentsByElem(elem: Element): Component[] {
    let childComponents: Component[] = [];

    for (let child of Array.from(elem.children)) {
      const comp = this.getComponentByElem(child);
      if (comp !== undefined) {
        childComponents.push(comp);
        continue;
      }

      childComponents = childComponents.concat(this.getChildComponentsByElem(child));
    }

    return childComponents;
  }

  public setParentComponent(newParent: Component | undefined, child: Component): void {
    child.parentComponent = newParent;
  }

  public addChildComponent(addedChild: Component, parent: Component): void {
    if (!parent.childComponents.includes(addedChild)) {
      parent.childComponents.push(addedChild);
    }
  }

  public removeChildComponent(removedChild: Component, parent: Component): void {
    const index = parent.childComponents.indexOf(removedChild);

    if (index > -1) {
      parent.childComponents.splice(index, 1);
    }
  }

  private initObserver(): void {
    if (this.observer === undefined) {
      this.observer = new MutationObserver(this.onMutation.bind(this));
    }
  }

  private startObserver(): void {
    const options: MutationObserverInit = {
      attributeFilter: [this.options.componentAttr],
      attributeOldValue: true,
      attributes: true,
      childList: true,
      subtree: true
    };

    this.observer?.observe(this.options.scope, options);
  }

  private onMutation(records: MutationRecord[]): void {
    records.forEach(record => {
      switch (record.type) {
        case "attributes":
          this.onAttributeMutation(record);
          break;
        case "childList":
          this.onChildListMutation(record);
          break;
        default:
      }
    });
  }

  private onAttributeMutation(record: MutationRecord): void {
    const {componentAttr: attr} = this.options;
    if (record.attributeName !== attr || record.target.nodeType !== Node.ELEMENT_NODE) {
      return;
    }

    const elem = record.target as Element;
    const newValue = elem.getAttribute(attr);
    const {oldValue} = record;

    if (oldValue !== null && this.componentTypeExists(oldValue)) {
      this.destroyComponent(elem);
    }

    if (newValue !== null && this.componentTypeExists(newValue)) {
      this.initComponent(elem, newValue);
    }
  }

  private onChildListMutation(record: MutationRecord): void {
    const {addedNodes, removedNodes} = record;
    addedNodes.forEach(node => this.searchAndInitOrDestroyComponents.call(this, node, "init"));
    removedNodes.forEach(node => this.searchAndInitOrDestroyComponents.call(this, node, "destroy"));
  }

  private searchAndInitOrDestroyComponents(node: Node, action: "init" | "destroy"): void {
    if (node.nodeType !== Node.ELEMENT_NODE) {
      return;
    }
    const elem = node as Element;
    const {componentAttr: attr} = this.options;

    for (let child of Array.from(elem.children)) {
      this.searchAndInitOrDestroyComponents(child, action);
    }

    if (elem.hasAttribute(attr)) {
      const type = elem.getAttribute(attr);

      if (type === null || !this.componentTypeExists(type)) {
        return;
      }

      if (action === "init") {
        this.initComponent(elem, type);
      } else {
        this.destroyComponent(elem);
      }
    }
  }

  private initComponent(elem: Element, type: ComponentType): void {
    const id = IdGenerator.getNewId();
    const component = new this.options.components[type]({
      elem,
      id,
      manager: this,
      type
    });

    this.components[id] = component;
    component.init();
  }

  private destroyComponent(elem: Element): void {
    const component = this.getComponentByElem(elem);
    if (component === undefined) {
      return;
    }

    component.destroy();
    delete this.components[component.id];
  }

  private componentTypeExists(type: ComponentType): boolean {
    return Object.prototype.hasOwnProperty.call(this.options.components, type);
  }
}
