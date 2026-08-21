import type { Note } from "~/types/note";

export const mockNotes: Note[] = [
  {
    id: 1,
    title: "Покупки",
    todos: [
      { id: 1, text: "Хлеб", completed: false },
      { id: 2, text: "Молоко", completed: true },
      { id: 3, text: "Сыр", completed: false },
      { id: 4, text: "Масло", completed: false },
      { id: 5, text: "Яйца", completed: false },
    ],
  },
  {
    id: 2,
    title: "Работа",
    todos: [
      { id: 1, text: "Отправить отчёт", completed: true },
      { id: 2, text: "Подготовить презентацию", completed: false },
      { id: 3, text: "Созвон с командой", completed: false },
      { id: 4, text: "Уточнить статус у разработчиков", completed: false },
    ],
  },
  {
    id: 3,
    title: "Дом",
    todos: [
      { id: 1, text: "Полить цветы", completed: false },
      { id: 2, text: "Помыть посуду", completed: true },
      { id: 3, text: "Вынести мусор", completed: false },
      { id: 4, text: "Пропылесосить", completed: false },
      { id: 5, text: "Постирать бельё", completed: false },
      { id: 6, text: "Приготовить ужин", completed: false },
    ],
  },
  {
    id: 4,
    title: "Чтение",
    todos: [
      { id: 1, text: "Прочитать рабочую документацию", completed: false },
      { id: 2, text: "Прочитать почту", completed: true },
      { id: 3, text: "Прочитать тз от заказчика", completed: false },
      { id: 4, text: "Прочитать отчетность", completed: false },
      { id: 5, text: "Прочитать должностную инструкцию", completed: false },
    ],
  },
  {
    id: 5,
    title: "Уход за питомцами",
    todos: [
      { id: 1, text: "Покормить котов", completed: false },
      { id: 2, text: "Вычесать котов", completed: true },
      { id: 3, text: "Поиграть с котами", completed: false },
      { id: 4, text: "Подстричь когти котам", completed: false },
    ],
  },
  {
    id: 6,
    title: "Покупки в магазине косметики",
    todos: [
      { id: 1, text: "Спонж", completed: false },
      { id: 2, text: "Тушь", completed: true },
      { id: 3, text: "Тени", completed: false },
      { id: 4, text: "Кисти", completed: false },
      { id: 5, text: "Шампунь", completed: false },
      { id: 6, text: "Помада", completed: false },
    ],
  },
];
