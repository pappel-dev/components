import {IdGenerator} from "./IdGenerator";

export interface ComponentMapping {
  [key: string]: any;
}

export interface Options {
  componentAttr: string,
  components: ComponentMapping,
  scope: Node
}

/**
 * The Manager class setups the components.
 */
export class Manager {
  /**
   * Represents the version of @pappel-dev/components currently in use.
   */
  public version: string = "__version__";

  /**
   * used to identify class internally
   */
  private id: string;

  /**
   * Options used internally
   */
  private options: Options;

  /**
   * MutationObserver instance
   */
  private static observer: MutationObserver | undefined;

  /**
   * Default options
   */
  private defaultOptions: Options = {
    componentAttr: "data-p-comp",
    components: {},
    scope: document
  };

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

  private initObserver(): void {
    if (Manager.observer === undefined) {
      Manager.observer = new MutationObserver(this.onMutation.bind(this));
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

    Manager.observer?.observe(this.options.scope, options);
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
      this.destroyComponent(elem, oldValue);
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
        this.destroyComponent(elem, type);
      }
    }
  }

  private initComponent(elem: Element, type: string): void {
    console.log("init", type, elem);
  }

  private destroyComponent(elem: Element, type: string): void {
    console.log("destroy", type, elem);
  }

  private componentTypeExists(type: string): boolean {
    return Object.prototype.hasOwnProperty.call(this.options.components, type);
  }
}
