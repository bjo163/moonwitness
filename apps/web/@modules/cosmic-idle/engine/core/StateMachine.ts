export interface IState<T> {
  name: string;
  enter?: (context: T) => void;
  update?: (context: T, dt: number) => void;
  exit?: (context: T) => void;
}

export class StateMachine<T> {
  private states: Map<string, IState<T>> = new Map();
  private currentState: IState<T> | null = null;
  private context: T;

  constructor(context: T) {
    this.context = context;
  }

  addState(state: IState<T>): this {
    this.states.set(state.name, state);
    return this;
  }

  setState(name: string): void {
    if (!this.states.has(name)) {
      console.warn(`State '${name}' not found.`);
      return;
    }

    if (this.currentState && this.currentState.name === name) {
      return;
    }

    if (this.currentState && this.currentState.exit) {
      this.currentState.exit(this.context);
    }

    this.currentState = this.states.get(name)!;

    if (this.currentState.enter) {
      this.currentState.enter(this.context);
    }
  }

  update(dt: number): void {
    if (this.currentState && this.currentState.update) {
      this.currentState.update(this.context, dt);
    }
  }

  getCurrentState(): string | null {
    return this.currentState ? this.currentState.name : null;
  }
}
