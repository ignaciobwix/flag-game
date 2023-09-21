(function () {
  const state = {
    teke1btn: document.querySelector("#take-1-button"),
    teke2btn: document.querySelector("#take-2-button"),
    resetBtn: document.querySelector("#reset-button"),
    log: document.querySelector("#log"),
    flagsContainer: document.querySelector("#flags-container"),
    operationId: 0,
    currentRow: 6,
    flagElementsByRow: {},
  };

  const createElement = (html) => {
    return new DOMParser().parseFromString(html, "text/html").body
      .firstElementChild;
  };

  const getPlayerId = () => {
    console.log(state.operationId);
    return Number.isInteger(state.operationId / 2) ? 2 : 1;
  };

  const getWinner = () => {
    if (state.currentRow !== 0) return;

    const message = `Player ${getPlayerId()} won!`;
    state.log.innerHTML = message;
  };

  const createFlags = () => {
    [1, 2, 3, 4, 5, 6]
      .map((row) => {
        return [...Array(row).keys()].map((f) =>
          createElement(`<span class='flag'>${row === 1 ? "🚩" : "🏳"}</span>`)
        );
      })
      .forEach((rowFlags, i) => {
        const id = i + 1;
        const row = createElement(`<div id='row-${id}' class='row'></div>`);
        state.flagElementsByRow[id] = [];
        document.querySelector("#flags-container").appendChild(row);
        rowFlags.forEach((e) => {
          state.flagElementsByRow[id].push(e);
          row.appendChild(e);
        });
      });
  };

  const operationIsValid = (numberOfFlags) =>
    state.flagElementsByRow[state.currentRow].length >= numberOfFlags;

  const takeFlags = (numberOfFlags) => {
    if (operationIsValid(numberOfFlags)) {
      state.operationId = state.operationId + 1;
      state.flagElementsByRow[state.currentRow].shift().remove();

      if (numberOfFlags === 2) {
        state.flagElementsByRow[state.currentRow].pop().remove();
      }

      if (!state.flagElementsByRow[state.currentRow].length) {
        state.currentRow--;
      }

      state.log.innerHTML = `Player ${getPlayerId()} took ${numberOfFlags} flags.`;
      getWinner();

      return;
    }

    throw new Error("You can take only one flag");
  };

  const handleTake2Flags = () => {
    takeFlags(2);
  };

  const handleTakeFlag = () => {
    takeFlags(1);
  };

  const startNewGame = () => {
    const { teke1btn, teke2btn, resetBtn, log } = state;
    teke1btn.removeEventListener("click", handleTakeFlag);

    teke2btn.removeEventListener("click", handleTake2Flags);

    teke2btn.removeEventListener("click", startNewGame);

    state.operationId = 0;
    state.flagElementsByRow = {};
    state.flagsContainer.innerHTML = "";

    createFlags();

    log.innerHTML = "New game started!";

    teke1btn.addEventListener("click", handleTakeFlag);

    teke2btn.addEventListener("click", handleTake2Flags);

    resetBtn.addEventListener("click", startNewGame);
  };

  startNewGame();
})();
