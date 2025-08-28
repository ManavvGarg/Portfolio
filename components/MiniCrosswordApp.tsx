"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";

// ------------------------------
// Utilities
// ------------------------------

type Cell = {
    row: number;
    col: number;
    isBlock: boolean;
    solution: string; // uppercase A-Z or '' for block
    value: string; // user-entered uppercase A-Z or ''
    number?: number; // clue number if this cell starts a clue
};

type Clue = {
    number: number;
    direction: "A" | "D"; // Across or Down
    row: number; // start row
    col: number; // start col
    answer: string; // e.g., "APPLE"
    clue: string;
    length: number; // computed from answer
};

export type Puzzle = {
    id: string;
    title: string;
    grid: string[]; // 5 strings of length 5, with letters or '#'
    clues: { across: Clue[]; down: Clue[] };
};

const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);
const formatTime = (ms: number) => {
    const s = Math.floor(ms / 1000);
    const m = Math.floor(s / 60);
    const ss = s % 60;
    return `${m}:${pad(ss)}`;
};

function hashDateToIndex(dateStr: string, modulo: number): number {
    // Simple deterministic hash
    let h = (2166136261 >>> 0) as number; // FNV-1a basis
    for (let i = 0; i < dateStr.length; i++) {
        h ^= dateStr.charCodeAt(i);
        h = Math.imul(h, 16777619);
    }
    return h % modulo;
}

function todayKey() {
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = pad(d.getMonth() + 1);
    const dd = pad(d.getDate());
    return `${yyyy}-${mm}-${dd}`; // local date
}

// The component validates fill using the grid letters only; clue metadata is used for numbering and UI.

// ------------------------------
// Cookie helpers (expire at next midnight IST)
// ------------------------------

const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000; // UTC+5:30

function nextISTMidnight(): Date {
    const nowUtcMs = Date.now();
    const nowIst = new Date(nowUtcMs + IST_OFFSET_MS);
    // set to next day 00:00:00 IST
    nowIst.setHours(24, 0, 0, 0);
    const expiresUtc = new Date(nowIst.getTime() - IST_OFFSET_MS);
    return expiresUtc;
}

function setCookie(name: string, value: string, expires: Date) {
    // Avoid 'secure' to work on http during local dev; set SameSite=Lax
    document.cookie = `${name}=${
        encodeURIComponent(value)
    }; expires=${expires.toUTCString()}; path=/; samesite=lax`;
}

function getCookie(name: string): string | null {
    const match = document.cookie
        .split(";")
        .map((s) => s.trim())
        .find((row) => row.startsWith(name + "="));
    if (!match) return null;
    return decodeURIComponent(match.split("=")[1] ?? "");
}

function deleteCookie(name: string) {
    document.cookie =
        `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; samesite=lax`;
}

// ------------------------------
// Component
// ------------------------------

export default function MiniCrosswordApp() {
    const dateKey = useMemo(() => todayKey(), []);
    const [puzzles, setPuzzles] = useState<Puzzle[] | null>(null);
    const [puzzle, setPuzzle] = useState<Puzzle | null>(null);
    const [validated, setValidated] = useState<boolean>(false);
    const [showWin, setShowWin] = useState<boolean>(false);
    const [errorMsg, setErrorMsg] = useState<string>("");

    // Load puzzles from public JSON once on mount
    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                const res = await fetch("/crosswords.json", {
                    cache: "no-store",
                });
                if (!res.ok) {
                    throw new Error(
                        `Failed to load crosswords.json: ${res.status}`,
                    );
                }
                const data = await res.json();
                if (!cancelled) setPuzzles(data as Puzzle[]);
            } catch (e) {
                console.error(e);
                if (!cancelled) setPuzzles([]);
            }
        })();
        return () => {
            cancelled = true;
        };
    }, []);

    // Pick a deterministic daily puzzle if available; otherwise random fallback
    useEffect(() => {
        if (!puzzles || puzzles.length === 0) return;
        // Random selection request: use time-seeded but stable per-page-load selection
        // If you want daily determinism, switch to hashDateToIndex(dateKey, puzzles.length)
        const idx = Math.floor(Math.random() * puzzles.length);
        setPuzzle(puzzles[idx]);
    }, [puzzles]);

    const cells = useMemo(
        () => (puzzle
            ? buildCells(puzzle.grid)
            : buildCells(["#####", "#####", "#####", "#####", "#####"])),
        [puzzle],
    );
    const [grid, setGrid] = useState<Cell[][]>(cells);
    const [direction, setDirection] = useState<"A" | "D">("A");
    const [cursor, setCursor] = useState<{ row: number; col: number }>(() =>
        firstFillable(cells)
    );

    // Timer state
    const [startedAt, setStartedAt] = useState<number | null>(null);
    const [elapsed, setElapsed] = useState<number>(0);
    const [finishedAt, setFinishedAt] = useState<number | null>(null);
    const timerRef = useRef<number | null>(null);

    // Load/save progress. Prefer cookie for cross-tab persistence; if none, fall back to localStorage.
    // If no save exists for today's puzzle, initialize a fresh grid.
    useEffect(() => {
        if (!puzzle) return;
        const key = storageKey(puzzle.id, dateKey);
        const cookieVal = getCookie(key);
        const saved = cookieVal ?? localStorage.getItem(key);
        if (saved) {
            try {
                const data = JSON.parse(saved);
                if (Array.isArray(data.values)) {
                    setGrid(() =>
                        applyValues(buildCells(puzzle.grid), data.values)
                    );
                } else {
                    const base = buildCells(puzzle.grid);
                    setGrid(base);
                    setCursor(firstFillable(base));
                }
                if (data.startedAt) setStartedAt(data.startedAt);
                if (data.finishedAt) setFinishedAt(data.finishedAt);
                if (data.elapsed) setElapsed(data.elapsed);
                if (typeof data.validated === "boolean") {
                    setValidated(data.validated);
                }
            } catch {
                const base = buildCells(puzzle.grid);
                setGrid(base);
                setCursor(firstFillable(base));
                setStartedAt(null);
                setElapsed(0);
                setFinishedAt(null);
                setValidated(false);
                setShowWin(false);
                setErrorMsg("");
            }
        } else {
            const base = buildCells(puzzle.grid);
            setGrid(base);
            setCursor(firstFillable(base));
            setStartedAt(null);
            setElapsed(0);
            setFinishedAt(null);
            setValidated(false);
            setShowWin(false);
            setErrorMsg("");
        }
    }, [puzzle?.id, dateKey]);

    // Tick timer
    useEffect(() => {
        if (finishedAt != null) {
            if (timerRef.current) cancelAnimationFrame(timerRef.current);
            return;
        }
        if (startedAt != null) {
            const tick = () => {
                setElapsed(Date.now() - startedAt);
                timerRef.current = requestAnimationFrame(tick);
            };
            timerRef.current = requestAnimationFrame(tick);
            return () => {
                if (timerRef.current) cancelAnimationFrame(timerRef.current);
            };
        }
    }, [startedAt, finishedAt]);

    // Persist progress to both localStorage and a cookie that expires at next midnight IST
    useEffect(() => {
        if (!puzzle) return;
        const values = grid.flat().map((c) => c.value);
        const payload = {
            values,
            startedAt,
            finishedAt,
            elapsed,
            dateKey,
            puzzleId: puzzle.id,
            validated,
        };
        const key = storageKey(puzzle.id, dateKey);
        const serialized = JSON.stringify(payload);
        localStorage.setItem(key, serialized);
        try {
            setCookie(key, serialized, nextISTMidnight());
        } catch {}
    }, [grid, startedAt, finishedAt, elapsed, validated, puzzle?.id, dateKey]);

    // No auto-complete; validation is user-initiated.

    const onCellInput = (ch: string) => {
        // Block typing until the player presses Start
        if (!startedAt) {
            setErrorMsg("Press Start to begin.");
            return;
        }
        const { row, col } = cursor;
        const cell = grid[row][col];
        if (cell.isBlock) return;

        const upper = (ch || "").toUpperCase();
        if (!upper.match(/^[A-Z]$/)) return;

        const next = cloneGrid(grid);
        next[row][col].value = upper;
        setGrid(next);

        // move cursor to next cell in current entry
        const n = stepCursor(next, row, col, direction, /*back*/ false);
        if (n) setCursor(n);
    };

    const onBackspace = () => {
        if (!startedAt) return; // Block edits until Start
        const { row, col } = cursor;
        const cell = grid[row][col];
        if (cell.isBlock) return;
        const next = cloneGrid(grid);
        if (next[row][col].value) {
            next[row][col].value = "";
            setGrid(next);
            return;
        }
        const prev = stepCursor(next, row, col, direction, /*back*/ true);
        if (prev) {
            setCursor(prev);
            const n2 = cloneGrid(next);
            if (!n2[prev.row][prev.col].isBlock) {
                n2[prev.row][prev.col].value = "";
                setGrid(n2);
            }
        }
    };

    const move = (d: { dr: number; dc: number }) => {
        const { row, col } = cursor;
        let r = row + d.dr;
        let c = col + d.dc;
        while (r >= 0 && r < 5 && c >= 0 && c < 5) {
            if (!grid[r][c].isBlock) {
                setCursor({ row: r, col: c });
                return;
            }
            r += d.dr;
            c += d.dc;
        }
    };

    const toggleDirection = () => setDirection((d) => (d === "A" ? "D" : "A"));

    const reset = () => {
        if (!puzzle) return;
        setGrid(buildCells(puzzle.grid));
        setStartedAt(null);
        setElapsed(0);
        setFinishedAt(null);
        setCursor(firstFillable(buildCells(puzzle.grid)));
        setValidated(false);
        setShowWin(false);
        setErrorMsg("");
        // Clear cookie for today's puzzle
        try {
            deleteCookie(storageKey(puzzle.id, dateKey));
        } catch {}
    };

    const isFilled = (g: Cell[][]) => {
        for (let r = 0; r < 5; r++) {
            for (let c = 0; c < 5; c++) {
                const cell = g[r][c];
                if (cell.isBlock) continue;
                if (!cell.value) return false;
            }
        }
        return true;
    };

    const validate = () => {
        setErrorMsg("");
        if (!puzzle) return;
        if (!isFilled(grid)) {
            setErrorMsg("Please fill all cells before validating.");
            return;
        }
        if (isSolved(grid)) {
            setValidated(true);
            if (!startedAt) setStartedAt(Date.now());
            setFinishedAt(Date.now());
            setShowWin(true);
        } else {
            setErrorMsg("Not quite right — try again!");
        }
    };

    const share = async () => {
        // Prevent sharing unless the user has completed and validated the puzzle
        if (!validated || finishedAt == null) {
            setErrorMsg("Finish and validate the crossword before sharing.");
            return;
        }
        const time = finishedAt != null
            ? finishedAt - (startedAt ?? finishedAt)
            : elapsed;
        const title = puzzle ? puzzle.title : "Mini Crossword";
        const msg = `I solved today's Mini Crossword in ${
            formatTime(time)
        } — ${title}. Try it here: ${window.location.href}`;
        try {
            await navigator.clipboard.writeText(msg);
        } catch {}
        if ((navigator as any).share) {
            try {
                await (navigator as any).share({ text: msg });
            } catch {}
        }
        alert("Share text copied to clipboard.");
    };

    // Keyboard handlers
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Backspace") {
                e.preventDefault();
                onBackspace();
                return;
            }
            if (e.key === "ArrowLeft") {
                e.preventDefault();
                move({ dr: 0, dc: -1 });
                setDirection("A");
                return;
            }
            if (e.key === "ArrowRight") {
                e.preventDefault();
                move({ dr: 0, dc: 1 });
                setDirection("A");
                return;
            }
            if (e.key === "ArrowUp") {
                e.preventDefault();
                move({ dr: -1, dc: 0 });
                setDirection("D");
                return;
            }
            if (e.key === "ArrowDown") {
                e.preventDefault();
                move({ dr: 1, dc: 0 });
                setDirection("D");
                return;
            }
            if (e.key === "Tab") {
                e.preventDefault();
                toggleDirection();
                return;
            }
            if (e.key.length === 1) {
                if (!startedAt) {
                    // Ignore typing until Start is pressed
                    return;
                }
                onCellInput(e.key);
            }
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [cursor, grid, direction, startedAt, finishedAt]);

    const activeEntry = useMemo(
        () => getEntryCells(grid, cursor.row, cursor.col, direction),
        [grid, cursor, direction],
    );

    return (
        <div className="w-full max-w-5xl mx-auto p-3 sm:p-4 md:p-6 lg:p-8">
            <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3 mb-3 sm:mb-4">
                <div>
                    <h1 className="text-2xl font-semibold">
                        Daily Mini Crossword
                    </h1>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        {dateKey} • {puzzle?.title ?? "Loading…"}
                    </p>
                </div>
                <div className="flex items-center flex-wrap gap-2 sm:gap-3">
                    <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-800 dark:bg-neutral-800 dark:text-gray-200 text-xs sm:text-sm">
                        {direction === "A" ? "Across" : "Down"}
                    </span>
                    <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-200 text-xs sm:text-sm font-medium">
                        {finishedAt
                            ? `Time: ${
                                formatTime(
                                    finishedAt - (startedAt ?? finishedAt),
                                )
                            }`
                            : `Time: ${formatTime(elapsed)}`}
                    </span>
                    {!startedAt && !finishedAt && (
                        <button
                            onClick={() => setStartedAt(Date.now())}
                            className="px-3 py-1 rounded-lg bg-blue-600 text-white hover:bg-blue-700 text-xs sm:text-sm"
                            disabled={!puzzle}
                        >
                            Start
                        </button>
                    )}
                    <button
                        onClick={validate}
                        className="px-3 py-1 rounded-lg bg-green-600 text-white hover:bg-green-700 text-xs sm:text-sm disabled:opacity-50"
                        disabled={!puzzle}
                    >
                        Validate
                    </button>
                    <button
                        onClick={toggleDirection}
                        className="px-3 py-1 rounded-lg bg-gray-200 hover:bg-gray-300 dark:bg-neutral-700 dark:hover:bg-neutral-600 dark:text-gray-100 text-xs sm:text-sm"
                    >
                        Toggle
                    </button>
                    <button
                        onClick={reset}
                        className="px-3 py-1 rounded-lg bg-gray-200 hover:bg-gray-300 dark:bg-neutral-700 dark:hover:bg-neutral-600 dark:text-gray-100 text-xs sm:text-sm"
                    >
                        Reset
                    </button>
                    <button
                        onClick={share}
                        className="px-3 py-1 rounded-lg bg-black text-white text-xs sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={!puzzle || !validated}
                        title={!validated
                            ? "Available after Validate"
                            : undefined}
                    >
                        Share
                    </button>
                </div>
            </header>

            {errorMsg && (
                <div className="mb-3 rounded-md border border-red-300 bg-red-50 text-red-700 dark:border-red-500/50 dark:bg-red-950/40 dark:text-red-300 px-3 py-2 text-sm">
                    {errorMsg}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Grid */}
                <div>
                    <div className="aspect-square w-full max-w-[min(92vw,28rem)] sm:max-w-md border-2 border-gray-800 dark:border-neutral-600 rounded-2xl overflow-hidden shadow">
                        {grid.map((row, r) => (
                            <div key={r} className="flex w-full h-[20%]">
                                {row.map((cell, c) => {
                                    const isCursor = r === cursor.row &&
                                        c === cursor.col;
                                    const isInActive = activeEntry.some((p) =>
                                        p.row === r && p.col === c
                                    );
                                    return (
                                        <button
                                            key={`${r}-${c}`}
                                            aria-label={`Row ${r + 1} column ${
                                                c + 1
                                            }`}
                                            onClick={() =>
                                                setCursor({ row: r, col: c })}
                                            className={[
                                                "flex-1 h-full border border-gray-800 dark:border-neutral-600 relative flex items-center justify-center",
                                                cell.isBlock
                                                    ? "bg-gray-900"
                                                    : "bg-white dark:bg-neutral-900",
                                                isInActive && !cell.isBlock
                                                    ? "bg-yellow-50 dark:bg-yellow-900/30"
                                                    : "",
                                                isCursor && !cell.isBlock
                                                    ? "outline outline-4 outline-blue-400 dark:outline-blue-500 z-10"
                                                    : "",
                                            ].join(" ")}
                                        >
                                            {!cell.isBlock && (
                                                <span className="absolute top-1 left-1 text-[11px] sm:text-[12px] text-gray-500 dark:text-gray-400 select-none">
                                                    {cell.number ?? ""}
                                                </span>
                                            )}
                                            {!cell.isBlock && (
                                                <span className="text-2xl sm:text-3xl font-semibold select-none leading-none text-center text-gray-900 dark:text-gray-100">
                                                    {cell.value || ""}
                                                </span>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        ))}
                    </div>

                    {/* Mobile keyboard */}
                    <div className="mt-4 grid grid-cols-9 gap-2 md:hidden select-none">
                        {"ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map((k) => (
                            <button
                                key={k}
                                onClick={() => onCellInput(k)}
                                className="py-3 rounded-xl border-2 border-gray-500 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-base font-semibold shadow-sm hover:bg-gray-50 dark:hover:bg-neutral-700 active:translate-y-px flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed text-gray-900 dark:text-gray-100"
                                disabled={!startedAt}
                                aria-label={`Type letter ${k}`}
                            >
                                {k}
                            </button>
                        ))}
                        <button
                            onClick={onBackspace}
                            className="col-span-3 py-3 rounded-xl border-2 border-gray-500 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-base font-semibold shadow-sm hover:bg-gray-50 dark:hover:bg-neutral-700 active:translate-y-px flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed text-gray-900 dark:text-gray-100"
                            disabled={!startedAt}
                            aria-label="Backspace"
                        >
                            ⌫ Back
                        </button>
                    </div>
                </div>

                {/* Clues */}
                <div className="space-y-6">
                    <div>
                        <h2 className="font-semibold mb-2">Across</h2>
                        <ul className="space-y-1">
                            {puzzle?.clues.across.map((cl) => (
                                <li key={`A-${cl.number}`} className="text-sm">
                                    <span className="font-semibold mr-2">
                                        {cl.number}.
                                    </span>
                                    <span className="text-gray-800 dark:text-gray-100">
                                        {cl.clue}
                                    </span>
                                    <span className="text-gray-500 dark:text-gray-400 ml-2">
                                        ({cl.length})
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h2 className="font-semibold mb-2">Down</h2>
                        <ul className="space-y-1">
                            {puzzle?.clues.down.map((cl) => (
                                <li key={`D-${cl.number}`} className="text-sm">
                                    <span className="font-semibold mr-2">
                                        {cl.number}.
                                    </span>
                                    <span className="text-gray-800 dark:text-gray-100">
                                        {cl.clue}
                                    </span>
                                    <span className="text-gray-500 dark:text-gray-400 ml-2">
                                        ({cl.length})
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            <footer className="mt-6 text-xs text-gray-500 dark:text-gray-400">
                <p>
                    Controls: Type letters • Arrow keys move • Tab toggles
                    direction • Reset to clear
                </p>
            </footer>
            {showWin && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-xl p-6 max-w-md w-[90%] text-center">
                        <h3 className="text-xl font-semibold mb-2">
                            You did it! 🎉
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                            Crossword complete. Share your result with friends!
                        </p>
                        <div className="flex items-center justify-center gap-2">
                            <button
                                onClick={share}
                                className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 text-sm"
                            >
                                Share result
                            </button>
                            <button
                                onClick={() => setShowWin(false)}
                                className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300 text-sm"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// ------------------------------
// Helpers
// ------------------------------

function buildCells(grid: string[]): Cell[][] {
    if (grid.length !== 5 || grid.some((r) => r.length !== 5)) {
        throw new Error("Grid must be 5×5");
    }
    const cells: Cell[][] = Array.from(
        { length: 5 },
        (_, r) =>
            Array.from({ length: 5 }, (_, c) => {
                const ch = grid[r][c];
                const isBlock = ch === "#";
                return {
                    row: r,
                    col: c,
                    isBlock,
                    solution: isBlock ? "" : ch.toUpperCase(),
                    value: "",
                } as Cell;
            }),
    );
    // Numbering
    let num = 1;
    for (let r = 0; r < 5; r++) {
        for (let c = 0; c < 5; c++) {
            const cell = cells[r][c];
            if (cell.isBlock) continue;
            const startAcross = c === 0 || cells[r][c - 1].isBlock;
            const startDown = r === 0 || cells[r - 1][c].isBlock;
            if (startAcross || startDown) {
                cell.number = num++;
            }
        }
    }
    return cells;
}

function firstFillable(grid: Cell[][]) {
    for (let r = 0; r < 5; r++) {
        for (let c = 0; c < 5; c++) {
            if (!grid[r][c].isBlock) return { row: r, col: c };
        }
    }
    return { row: 0, col: 0 };
}

function cloneGrid(g: Cell[][]): Cell[][] {
    return g.map((row) => row.map((c) => ({ ...c })));
}

function stepCursor(
    g: Cell[][],
    row: number,
    col: number,
    dir: "A" | "D",
    back: boolean,
) {
    const delta = back ? -1 : 1;
    if (dir === "A") {
        let c = col + delta;
        while (c >= 0 && c < 5) {
            if (!g[row][c].isBlock) return { row, col: c };
            c += delta;
        }
    } else {
        let r = row + delta;
        while (r >= 0 && r < 5) {
            if (!g[r][col].isBlock) return { row: r, col };
            r += delta;
        }
    }
    return null;
}

function getEntryCells(g: Cell[][], row: number, col: number, dir: "A" | "D") {
    if (g[row][col].isBlock) return [] as Cell[];
    let cells: Cell[] = [];
    if (dir === "A") {
        // go left to start
        let c = col;
        while (c - 1 >= 0 && !g[row][c - 1].isBlock) c--;
        // collect until block
        while (c < 5 && !g[row][c].isBlock) {
            cells.push(g[row][c]);
            c++;
        }
    } else {
        let r = row;
        while (r - 1 >= 0 && !g[r - 1][col].isBlock) r--;
        while (r < 5 && !g[r][col].isBlock) {
            cells.push(g[r][col]);
            r++;
        }
    }
    return cells;
}

function isSolved(g: Cell[][]) {
    for (let r = 0; r < 5; r++) {
        for (let c = 0; c < 5; c++) {
            const cell = g[r][c];
            if (cell.isBlock) continue;
            if (!cell.value || cell.value.toUpperCase() !== cell.solution) {
                return false;
            }
        }
    }
    return true;
}

function applyValues(g: Cell[][], values: string[]) {
    const next = cloneGrid(g);
    let i = 0;
    for (let r = 0; r < 5; r++) {
        for (let c = 0; c < 5; c++) {
            next[r][c].value = values[i++] || "";
        }
    }
    return next;
}

function storageKey(puzzleId: string, dateKey: string) {
    return `mini-xwd::${puzzleId}::${dateKey}`;
}
