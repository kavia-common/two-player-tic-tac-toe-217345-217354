import React, { useEffect, useMemo, useState } from 'react';
import './App.css';

// Light theme palette from style guide
const COLORS = {
  primary: '#3b82f6',
  success: '#06b6d4',
  background: '#f9fafb',
  surface: '#ffffff',
  text: '#111827',
  border: '#e5e7eb',
  subtleText: '#6b7280',
};

// Utility to compute winner and winning line
function calculateWinner(squares) {
  // All winning line indices
  const lines = [
    [0, 1, 2], // rows
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6], // cols
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8], // diagonals
    [2, 4, 6],
  ];

  for (const [a, b, c] of lines) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], line: [a, b, c] };
    }
  }
  return { winner: null, line: [] };
}

// PUBLIC_INTERFACE
export default function App() {
  /**
   * A simple two-player Tic Tac Toe game UI with no backend dependencies.
   * Renders a responsive 3x3 grid, tracks turns, detects win/draw, and allows reset.
   */
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);

  // Apply light theme to document for compatibility with template variables
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'light');
  }, []);

  const { winner, line } = useMemo(() => calculateWinner(squares), [squares]);
  const isDraw = useMemo(() => squares.every(Boolean) && !winner, [squares, winner]);

  const statusText = useMemo(() => {
    if (winner) {
      return `Winner: ${winner}`;
    }
    if (isDraw) {
      return 'Draw!';
    }
    return `Current player: ${xIsNext ? 'X' : 'O'}`;
  }, [winner, isDraw, xIsNext]);

  const statusAccent = winner ? COLORS.success : isDraw ? COLORS.primary : COLORS.primary;

  function handleSquareClick(index) {
    // Do nothing if square already filled or game over
    if (squares[index] || winner) return;
    const next = squares.slice();
    next[index] = xIsNext ? 'X' : 'O';
    setSquares(next);
    setXIsNext(!xIsNext);
  }

  // PUBLIC_INTERFACE
  function resetGame() {
    /** Reset the board to start a new game. */
    setSquares(Array(9).fill(null));
    setXIsNext(true);
  }

  // Accessibility: describe the board for screen readers
  const boardAriaLabel = `Tic Tac Toe board. ${statusText}. Click an empty square to place ${xIsNext ? 'X' : 'O'}.`;

  return (
    <div style={styles.app}>
      <div style={styles.card}>
        <h1 style={styles.title}>Tic Tac Toe</h1>

        <div style={{ ...styles.status, color: statusAccent }} aria-live="polite">
          {statusText}
        </div>

        <div
          role="grid"
          aria-label={boardAriaLabel}
          style={styles.boardContainer}
        >
          {/* 3x3 Grid */}
          <div style={styles.board}>
            {squares.map((val, idx) => {
              const isWinning = line.includes(idx);
              return (
                <button
                  key={idx}
                  role="gridcell"
                  aria-label={`Square ${idx + 1}, ${val ? val : 'empty'}`}
                  onClick={() => handleSquareClick(idx)}
                  style={{
                    ...styles.square,
                    borderColor: COLORS.border,
                    color: val === 'X' ? COLORS.primary : COLORS.success,
                    background:
                      isWinning
                        ? `linear-gradient(135deg, ${hexWithAlpha(COLORS.success, 0.12)}, ${hexWithAlpha(
                            COLORS.primary,
                            0.12
                          )})`
                        : COLORS.surface,
                    boxShadow: isWinning ? `0 0 0 2px ${hexWithAlpha(COLORS.success, 0.4)} inset` : 'none',
                  }}
                >
                  <span style={styles.squareText}>{val}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div style={styles.controls}>
          <button onClick={resetGame} style={styles.resetButton} className="btn">
            New Game
          </button>
        </div>

        <p style={styles.helperText}>
          X starts. Take turns tapping squares to get three in a row.
        </p>
      </div>
    </div>
  );
}

/**
 * Convert hex like #rrggbb to rgba with alpha for subtle backgrounds.
 */
function hexWithAlpha(hex, alpha = 0.15) {
  const h = hex.replace('#', '');
  const r = parseInt(h.substring(0, 2), 16);
  const g = parseInt(h.substring(2, 4), 16);
  const b = parseInt(h.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

const styles = {
  app: {
    minHeight: '100vh',
    background: COLORS.background,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '24px',
    boxSizing: 'border-box',
  },
  card: {
    width: '100%',
    maxWidth: 520,
    background: COLORS.surface,
    border: `1px solid ${COLORS.border}`,
    borderRadius: 16,
    padding: '24px',
    boxShadow:
      '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)',
  },
  title: {
    margin: 0,
    marginBottom: 12,
    color: COLORS.text,
    fontSize: 28,
    fontWeight: 800,
    letterSpacing: 0.2,
    textAlign: 'center',
  },
  status: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 600,
    marginBottom: 16,
  },
  boardContainer: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    margin: '0 auto',
  },
  board: {
    width: 'min(92vw, 420px)',
    aspectRatio: '1 / 1',
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: 10,
  },
  square: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
    borderWidth: 2,
    borderStyle: 'solid',
    background: COLORS.surface,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'transform 0.05s ease, background 0.2s ease, box-shadow 0.2s ease',
    userSelect: 'none',
    outline: 'none',
  },
  squareText: {
    fontSize: 'clamp(48px, 10vw, 72px)',
    fontWeight: 800,
    lineHeight: 1,
  },
  controls: {
    marginTop: 16,
    display: 'flex',
    justifyContent: 'center',
  },
  resetButton: {
    background: `linear-gradient(135deg, ${hexWithAlpha(COLORS.primary, 0.16)}, ${hexWithAlpha(
      COLORS.success,
      0.16
    )})`,
    color: COLORS.text,
    border: `1px solid ${hexWithAlpha(COLORS.primary, 0.35)}`,
    borderRadius: 10,
    padding: '10px 16px',
    fontSize: 14,
    fontWeight: 700,
    cursor: 'pointer',
    transition: 'transform 0.05s ease, box-shadow 0.2s ease, border-color 0.2s ease',
  },
  helperText: {
    marginTop: 12,
    textAlign: 'center',
    color: COLORS.subtleText,
    fontSize: 13,
  },
};
