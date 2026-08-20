import { describe, it, expect, beforeEach } from "vitest";
import { ref } from "vue";
import { useHistory } from "~/composables/useHistory";

describe("useHistory", () => {
  let history: ReturnType<typeof useHistory>;

  beforeEach(() => {
    history = useHistory(50);
  });

  it("should add entries and maintain correct index", () => {
    history.addEntry({
      type: "test",
      payload: { value: 1 },
      undo: () => {},
      redo: () => {},
    });

    expect(history.history.value.length).toBe(1);
    expect(history.historyIndex.value).toBe(0);
  });

  it("should undo and redo correctly", () => {
    let value = ref(0);

    history.addEntry({
      type: "increment",
      payload: { step: 1 },
      undo: () => {
        value.value -= 1;
      },
      redo: () => {
        value.value += 1;
      },
    });

    history.undo();
    expect(value.value).toBe(-1);

    history.redo();
    expect(value.value).toBe(0);
  });

  it("should clear redo branch after undo and new entry", () => {
    let value = ref(0);

    history.addEntry({
      type: "a",
      payload: {},
      undo: () => {
        value.value = 0;
      },
      redo: () => {
        value.value = 1;
      },
    });

    history.addEntry({
      type: "b",
      payload: {},
      undo: () => {
        value.value = 1;
      },
      redo: () => {
        value.value = 2;
      },
    });

    history.undo();
    expect(value.value).toBe(1);

    history.addEntry({
      type: "c",
      payload: {},
      undo: () => {
        value.value = 1;
      },
      redo: () => {
        value.value = 3;
      },
    });

    history.redo();
    expect(history.history.value.length).toBe(2);
    expect(history.historyIndex.value).toBe(1);
  });

  it("should respect history limit", () => {
    const limitedHistory = useHistory(2);

    limitedHistory.addEntry({
      type: "1",
      payload: {},
      undo: () => {},
      redo: () => {},
    });
    limitedHistory.addEntry({
      type: "2",
      payload: {},
      undo: () => {},
      redo: () => {},
    });
    limitedHistory.addEntry({
      type: "3",
      payload: {},
      undo: () => {},
      redo: () => {},
    });

    expect(limitedHistory.history.value.length).toBe(2);
    expect(limitedHistory.history.value[0]).toBeDefined();
    expect(limitedHistory.history.value[1]).toBeDefined();
    expect(limitedHistory.history.value[0]?.type).toBe("2");
    expect(limitedHistory.history.value[1]?.type).toBe("3");
  });

  it("should reset history", () => {
    history.addEntry({
      type: "test",
      payload: {},
      undo: () => {},
      redo: () => {},
    });

    history.reset();

    expect(history.history.value.length).toBe(0);
    expect(history.historyIndex.value).toBe(-1);
  });
});
