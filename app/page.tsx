"use client";

import React, { useRef, useState } from "react";
import { FaArrowUpFromBracket } from "react-icons/fa6";

enum PlatformType {
  ChessCom = "Chess.com",
  Lichess = "Lichess.org",
  PGN = "PGN",
}

interface Platform {
  title: PlatformType;
  img: string;
  left: number;
}

const allPlatforms: Platform[] = [
  { title: PlatformType.ChessCom, img: "chess.png", left: 3 },
  { title: PlatformType.Lichess, img: "lichess.png", left: 3 },
  { title: PlatformType.PGN, img: "file.png", left: 1 },
];

export default function Home() {
  const [username, setUsername] = useState("");
  const [isUsernameValid, setIsUsernameValid] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [platform, setPlatform] = useState<PlatformType>(PlatformType.ChessCom);
  const [submittedUsername, setSubmittedUsername] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [pgnText, setPgnText] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  const checkUsernameValidity = (user: string): boolean => {
    if (!user.trim()) {
      setErrorMessage("Username is required");
      return false;
    }
    if (user.length < 3) {
      setErrorMessage("Username must be at least 3 characters long");
      return false;
    }
    if (!/^[a-zA-Z0-9_-]+$/.test(user)) {
      setErrorMessage(
        "Username can only contain letters, numbers, underscores, or hyphens"
      );
      return false;
    }
    setErrorMessage("");
    return true;
  };

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUsername = e.target.value.trim();
    setUsername(newUsername);
    if (hasSubmitted) {
      setIsUsernameValid(checkUsernameValidity(newUsername));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        setPgnText(content);
      };
      reader.readAsText(file);
    }
    e.target.value = "";
  };

  const handlePlatformSelect = (title: PlatformType) => {
    const selectedPlatform = allPlatforms.find((p) => p.title === title);
    if (selectedPlatform && selectedPlatform.left > 0) {
      setPlatform(title);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setHasSubmitted(true);
    if (!checkUsernameValidity(username)) {
      setIsUsernameValid(false);
      return;
    }

    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setSubmittedUsername(username);
      setUsername("");
      setIsUsernameValid(true);
      setHasSubmitted(false); // Reset after successful submission
      // Update platform's remaining count (mock)
      const platformIndex = allPlatforms.findIndex((p) => p.title === platform);
      if (platformIndex !== -1 && allPlatforms[platformIndex].left > 0) {
        allPlatforms[platformIndex].left -= 1;
      }
    } catch (error) {
      setErrorMessage("Failed to submit username. Try again.");
      setIsUsernameValid(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="bg-[#111] text-white rounded-lg shadow-lg w-full max-w-2xl p-8 border border-yellow-600">
        <h1 className="text-3xl font-semibold text-center text-yellow-500 mb-6">
          Add New Username
        </h1>

        <div className="grid grid-cols-3 gap-3">
          {allPlatforms.map((p, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handlePlatformSelect(p.title)}
              disabled={p.left === 0}
              aria-label={`Select ${p.title} platform${
                p.left === 0 ? " (no attempts left)" : ""
              }`}
              className={`relative group flex flex-col items-center justify-center p-3 cursor-pointer rounded-lg border transition-all duration-200 ${
                p.left === 0
                  ? "bg-neutral-800 opacity-60 border-neutral-700 cursor-not-allowed"
                  : platform === p.title
                  ? "bg-amber-400/10 border-amber-400 ring-1 ring-amber-400"
                  : "bg-neutral-750 border-neutral-700 hover:border-amber-400/50 hover:bg-neutral-700"
              }`}
            >
              {platform === p.title && (
                <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-amber-400"></div>
              )}
              <div className="relative w-8 h-8 mb-2 flex items-center justify-center">
                <img
                  src={p.img}
                  className="object-contain transition-transform group-hover:scale-110 rounded-sm overflow-hidden"
                  alt={`${p.title} logo`}
                />
              </div>
              <span className="text-sm font-medium text-amber-400">
                {p.title}
              </span>
              {p.title !== PlatformType.PGN && (
                <span className="text-xs text-neutral-400">
                  ({p.left} left)
                </span>
              )}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 mt-6">
          <div>
            <input
              type="text"
              placeholder={
                platform === PlatformType.ChessCom
                  ? "MagnusCarlsen"
                  : platform === PlatformType.Lichess
                  ? "DrNykterstein"
                  : "appyfizz"
              }
              className={`w-full px-4 py-2 rounded-md bg-neutral-700 text-white placeholder:text-neutral-400 border ${
                hasSubmitted && !isUsernameValid
                  ? "border-red-500"
                  : "border-neutral-600"
              } focus:outline-none focus:border-none focus:ring-2 focus:ring-amber-500`}
              value={username}
              onChange={handleUsernameChange}
              aria-invalid={hasSubmitted && !isUsernameValid}
              aria-describedby="username-error"
            />
            {hasSubmitted && !isUsernameValid && (
              <p id="username-error" className="mt-1 ml-2 text-xs text-red-400">
                {errorMessage}
              </p>
            )}
            {platform === "PGN" && isUsernameValid && (
              <p
                id="username-error"
                className="mt-1 ml-2 text-xs text-amber-500"
              >
                NOTE: Username must match one of the players names in the PGN.
              </p>
            )}
          </div>

          {platform === "PGN" && (
            <div>
              <div className="mb-2 flex justify-between items-center">
                <label htmlFor="pgnText">PGN Content</label>
                <div className="relative">
                  <input
                    id="pgnFile"
                    accept=".pgn"
                    className="hidden"
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                  />
                  <button
                    type="button"
                    onClick={handleImportClick}
                    className="cursor-pointer inline-flex items-center px-3 py-1.5 text-xs bg-neutral-700 hover:bg-neutral-600 text-neutral-200 rounded-md border border-neutral-600 hover:border-amber-400/50 transition-all duration-200 disabled:opacity-50"
                  >
                    <FaArrowUpFromBracket className="w-3.5 h-3.5 mr-1.5" />
                    Import PGN File
                  </button>
                </div>
              </div>

              <textarea
                name="pgnText"
                id="pgnText"
                placeholder="Paste PGN here or import a file..."
                rows={8}
                className={`w-full p-3 bg-neutral-700 border ${
                  hasSubmitted && !pgnText.trim()
                    ? "border-red-500"
                    : "border-neutral-600"
                } rounded-lg text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent disabled:opacity-50 font-mono text-sm transition-all duration-200`}
                aria-describedby="pgnText-error"
                value={pgnText}
                onChange={(e) => setPgnText(e.target.value)}
              ></textarea>

              {hasSubmitted && !pgnText.trim() && (
                <p id="pgnText-error" className="ml-2 text-xs text-red-400">
                  PGN is required
                </p>
              )}
            </div>
          )}

          <button
            type="submit"
            disabled={
              isSubmitting ||
              !allPlatforms.find((p) => p.title === platform)?.left
            }
            className={`w-full py-2 rounded-md font-semibold transition ${
              isSubmitting ||
              !allPlatforms.find((p) => p.title === platform)?.left
                ? "bg-yellow-500/50 text-black/50 cursor-not-allowed"
                : "bg-yellow-500 text-black hover:bg-yellow-400 cursor-pointer"
            }`}
          >
            {isSubmitting
              ? "Submitting..."
              : platform !== "PGN"
              ? "Add Username"
              : "Import PGN Game"}
          </button>
        </form>

        {submittedUsername && (
          <div className="mt-6 text-center">
            <p className="text-gray-300">👤 Username Entered:</p>
            <p className="text-xl font-bold text-yellow-400 mt-1">
              {submittedUsername} ({platform})
            </p>
          </div>
        )}
      </div>
    </div>
  );
}