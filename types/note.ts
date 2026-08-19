export interface Todo {
  id: number | string;
  text: string;
  completed: boolean;
}

export interface Note {
  id: number | string;
  title: string;
  todos: Todo[];
}
