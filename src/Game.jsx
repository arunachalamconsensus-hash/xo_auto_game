
import { useState, useEffect } from "react";
import "./Game.css";

const checkWinner = (board) => {
  const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (let combination of winningCombinations) {
    const [a, b, c] = combination;

    if (
      board[a] &&
      board[a] === board[b] &&
      board[a] === board[c]
    ) {
      return board[a];
    }
  }

  return null;
};


function Game() {

  // Randomly assign X or O to the human player
  const [playerSymbol, setPlayerSymbol] = useState(
    () => Math.random() < 0.5 ? "X" : "O"
  );

  // Computer gets the opposite symbol
  const [computerSymbol, setComputerSymbol] = useState(
    () => playerSymbol === "X" ? "O" : "X"
  );

  // Game States
  const [board, setBoard] = useState(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState("X");
  const [winner, setWinner] = useState(null);
  const [isDraw, setIsDraw] = useState(false);
  const [isComputerThinking, setIsComputerThinking] = useState(false);






  // Check Draw
  const checkDraw = (updatedBoard) => {
    return updatedBoard.every((cell) => cell !== null);
  };


  // Handle Player Move
  const handleCellClick = (index) => {

    if (
      board[index] !== null ||
      winner ||
      isDraw ||
      currentPlayer !== playerSymbol ||
      isComputerThinking
    ) {
      return;
    }

    const updatedBoard = [...board];

    updatedBoard[index] = playerSymbol;

    setBoard(updatedBoard);

    const gameWinner = checkWinner(updatedBoard);

    if (gameWinner) {
      setWinner(gameWinner);
      return;
    }

    if (checkDraw(updatedBoard)) {
      setIsDraw(true);
      return;
    }

    // Switch to computer
    setCurrentPlayer(computerSymbol);
    setIsComputerThinking(true);
  };


  // Computer Automatically Plays
  useEffect(() => {

    if (
      currentPlayer !== computerSymbol ||
      winner ||
      isDraw
    ) {
      return;
    }

    const timer = setTimeout(() => {

      const emptyCells = board
        .map((cell, index) =>
          cell === null ? index : null
        )
        .filter((index) => index !== null);

      if (emptyCells.length === 0) {
        setIsComputerThinking(false);
        return;
      }

      // Select Random Empty Cell
      const randomIndex = Math.floor(
        Math.random() * emptyCells.length
      );

      const computerMove = emptyCells[randomIndex];

      const updatedBoard = [...board];

      updatedBoard[computerMove] = computerSymbol;

      setBoard(updatedBoard);


      // Check Winner
      const gameWinner = checkWinner(updatedBoard);

      if (gameWinner) {
        setWinner(gameWinner);
        setIsComputerThinking(false);
        return;
      }


      // Check Draw
      if (checkDraw(updatedBoard)) {
        setIsDraw(true);
        setIsComputerThinking(false);
        return;
      }


      // Switch Back to Player
      setCurrentPlayer(playerSymbol);
      setIsComputerThinking(false);

    }, 700);

    return () => clearTimeout(timer);

  }, [currentPlayer, board, winner, isDraw, playerSymbol, computerSymbol]);


  // Restart Game and Randomly Assign Symbols
  const handleRestart = () => {

    const newPlayerSymbol = Math.random() < 0.5 ? "X" : "O";

    const newComputerSymbol =
      newPlayerSymbol === "X" ? "O" : "X";

    setPlayerSymbol(newPlayerSymbol);
    setComputerSymbol(newComputerSymbol);

    setBoard(Array(9).fill(null));

    setCurrentPlayer("X");

    setWinner(null);

    setIsDraw(false);

    setIsComputerThinking(false);

  };


  return (

    <div className="game-container">

      <div className="game-card">

        {/* Header */}

        <div className="game-header">

          <p className="game-subtitle">
            REACT USESTATE PROJECT
          </p>

          <h1>XO Challenge</h1>

          <p className="game-description">
            Play against the Computer!
          </p>

        </div>


        {/* Player Information */}

        <div className="player-section">

          <div className={`player-box ${
            currentPlayer === playerSymbol && !winner && !isDraw
              ? "active-player"
              : ""
          }`}>

            <span className={`player-symbol ${
              playerSymbol === "X" ? "x-symbol" : "o-symbol"
            }`}>
              {playerSymbol}
            </span>

            <div>
              <h3>You</h3>
              <p>Player 1</p>
            </div>

          </div>


          <div className={`player-box ${
            currentPlayer === computerSymbol && !winner && !isDraw
              ? "active-player"
              : ""
          }`}>

            <span className={`player-symbol ${
              computerSymbol === "X" ? "x-symbol" : "o-symbol"
            }`}>
              {computerSymbol}
            </span>

            <div>
              <h3>Computer</h3>
              <p>Player 2</p>
            </div>

          </div>

        </div>


        {/* Game Status */}

        <div className="game-status">

          {winner === playerSymbol ? (

            <h2 className="winner-message">
              🎉 Congratulations! You Won!
            </h2>

          ) : winner === computerSymbol ? (

            <h2 className="computer-message">
              🤖 Computer Won!
            </h2>

          ) : isDraw ? (

            <h2 className="draw-message">
              🤝 It's a Draw!
            </h2>

          ) : isComputerThinking ? (

            <h2>
              🤖 Computer is thinking...
            </h2>

          ) : (

            <h2>
              Your Turn
              <span className={
                playerSymbol === "X" ? "x-text" : "o-text"
              }>
                {" "}({playerSymbol})
              </span>
            </h2>

          )}

        </div>


        {/* Game Board */}

        <div className="game-board">

          {board.map((cell, index) => (

            <button
              key={index}
              className={`game-cell ${
                cell === "X"
                  ? "x-cell"
                  : cell === "O"
                  ? "o-cell"
                  : ""
              }`}
              onClick={() => handleCellClick(index)}
              disabled={
                cell !== null ||
                winner !== null ||
                isDraw ||
                currentPlayer !== playerSymbol ||
                isComputerThinking
              }
            >
              {cell}
            </button>

          ))}

        </div>


        {/* Restart Button */}

        <button
          className="restart-btn"
          onClick={handleRestart}
        >
          ↻ Restart Game
        </button>


        {/* Footer */}

        <div className="game-footer">

          <span>
            {playerSymbol === "X" ? "❌" : "⭕"} You ({playerSymbol})
          </span>

          <span>
            {computerSymbol === "X" ? "❌" : "⭕"} Computer ({computerSymbol})
          </span>

        </div>

      </div>

    </div>

  );

}

export default Game;
