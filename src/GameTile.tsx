import { Component, createMemo } from "solid-js";
import { ALLOWED_SET, ANSWERS_SET, NUM_GAMES_X } from "./constants";
import { useGamesDataContext } from "./GameDataProvider";
import { GameMode } from "./types";

type GameTileProps = {
  mode: GameMode;
  gameX: number;
  gameY: number;
  gameCol: number;
  gameRow: number;
};
const GameTile: Component<GameTileProps> = (props) => {
  const gameIndex = props.gameX + props.gameY * NUM_GAMES_X;

  const [gamesData] = useGamesDataContext();

  const shouldRenderLetter = createMemo(() => {
    const gameData = gamesData[props.mode];
    const current = gameData.current;
    const guesses = gameData.guesses;
    const answer = gameData.answers[gameIndex];
    const answerIndex = guesses.indexOf(answer);
    return (
      props.gameRow <= answerIndex ||
      (answerIndex === -1 && props.gameRow < guesses.length) ||
      (answerIndex === -1 &&
        props.gameRow === guesses.length &&
        props.gameCol < current.length)
    );
  });

  const letter = createMemo(() => {
    const gameData = gamesData[props.mode];
    const guesses = gameData.guesses;
    const current = gameData.current;
    let letter: string = "";
    if (!shouldRenderLetter()) {
      return letter;
    } else if (props.gameRow < guesses.length) {
      letter = guesses[props.gameRow][props.gameCol];
    } else if (props.gameRow === guesses.length) {
      letter = current[props.gameCol];
    }
    return letter.toUpperCase();
  });

  const boxClasses = createMemo(() => {
    const gameData = gamesData[props.mode];
    const guesses = gameData.guesses;
    const answers = gameData.answers;
    const current = gameData.current;
    const classes = [];
    if (shouldRenderLetter()) {
      if (props.gameRow < guesses.length) {
        if (
          guesses[props.gameRow][props.gameCol] ===
          answers[gameIndex][props.gameCol]
        ) {
          classes.push("box-success");
        } else if (
          answers[gameIndex].indexOf(guesses[props.gameRow][props.gameCol]) !==
          -1
        ) {
          classes.push("box-diff");
        }
      }
      if (
        props.gameRow === guesses.length &&
        current.length === 5 &&
        !ALLOWED_SET.has(current) &&
        !ANSWERS_SET.has(current)
      ) {
        classes.push("text-invalid");
      }
    }
    return classes.join(" ");
  });

  return (
    <div
      class={`box pb-[20%]  ${props.gameRow === 0 ? "border-t-[1px]" : ""} ${
        props.gameCol === 0 ? "border-l-[1px]" : ""
      } ${boxClasses()}`}
    >
      <div
        class="box-content"
        id={`box${gameIndex + 1},${props.gameRow + 1},${props.gameCol + 1}`}
      >
        {letter()}
      </div>
    </div>
  );
};

export default GameTile;
