"use client";

import { useEffect, useRef, useState } from "react";

type SpeechResult = { transcript: string; confidence?: number };
type Recognition = {
  lang: string; interimResults: boolean; continuous: boolean;
  onresult: ((event: { results: ArrayLike<ArrayLike<{ transcript: string; confidence: number }>> }) => void) | null;
  onerror: ((event: { error: string }) => void) | null;
  onend: (() => void) | null;
  start(): void; stop(): void; abort(): void;
};
type RecognitionConstructor = new () => Recognition;
type SpeechWindow = Window & {
  SpeechRecognition?: RecognitionConstructor;
  webkitSpeechRecognition?: RecognitionConstructor;
};

const prompts = [
  { id: "repeat", title: "Listen & Repeat", instruction: "Listen, then repeat the sentence.", phrase: "Good morning, everyone. My name is Alex.", mode: "repeat" },
  { id: "meeting", title: "Introducing Yourself", instruction: "Imagine you are joining a new team. Introduce yourself in English.", phrase: "Hello, my name is Alex. I work in marketing. It's nice to meet you.", mode: "free" },
  { id: "question", title: "Meeting Question", instruction: "Answer aloud: What do you do at your company?", phrase: "I work in marketing and I help our customers.", mode: "free" },
] as const;

function normalize(value: string) {
  return value.toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();
}
function wordCoverage(reference: string, actual: string) {
  const expected = normalize(reference).split(" ").filter(Boolean);
  const spoken = normalize(actual).split(" ").filter(Boolean);
  const counts = new Map<string, number>();
  spoken.forEach(word => counts.set(word, (counts.get(word) || 0) + 1));
  const matched = expected.reduce((sum, word) => {
    const remaining = counts.get(word) || 0;
    if (!remaining) return sum;
    counts.set(word, remaining - 1);
    return sum + 1;
  }, 0);
  return expected.length ? Math.round((matched / expected.length) * 100) : 0;
}

export default function SpeakingLabPilot() {
  const [index, setIndex] = useState(0);
  const [transcript, setTranscript] = useState("");
  const [state, setState] = useState<"idle" | "listening" | "done">("idle");
  const [error, setError] = useState("");
  const [supported, setSupported] = useState<boolean | null>(null);
  const recognition = useRef<Recognition | null>(null);
  const current = prompts[index];

  useEffect(() => {
    const w = window as SpeechWindow;
    setSupported(Boolean(w.SpeechRecognition || w.webkitSpeechRecognition));
    return () => { recognition.current?.abort(); window.speechSynthesis?.cancel(); };
  }, []);

  function listen() {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(current.phrase);
    utterance.lang = "en-US";
    utterance.rate = 0.88;
    window.speechSynthesis.speak(utterance);
  }
  function record() {
    const w = window as SpeechWindow;
    const Constructor = w.SpeechRecognition || w.webkitSpeechRecognition;
    if (!Constructor) { setError("Speech recognition is unavailable in this browser. Try Chrome or Edge, or use the text fallback."); return; }
    recognition.current?.abort();
    window.speechSynthesis.cancel();
    const instance = new Constructor();
    recognition.current = instance;
    instance.lang = "en-US";
    instance.continuous = false;
    instance.interimResults = false;
    instance.onresult = event => {
      const result: SpeechResult = event.results[0]?.[0] || { transcript: "" };
      setTranscript(result.transcript);
      setState("done");
    };
    instance.onerror = event => { setError("Microphone or recognition error: " + event.error); setState("idle"); };
    instance.onend = () => setState(s => s === "listening" ? "idle" : s);
    setTranscript("");
    setError("");
    try { instance.start(); setState("listening"); } catch { setError("Could not start the microphone."); setState("idle"); }
  }
  function next(nextIndex: number) {
    recognition.current?.abort();
    window.speechSynthesis.cancel();
    setIndex(nextIndex); setTranscript(""); setError(""); setState("idle");
  }

  const coverage = current.mode === "repeat" && transcript ? wordCoverage(current.phrase, transcript) : null;
  return (
    <main style={{ maxWidth: 640, margin: "2rem auto", padding: 24, fontFamily: "system-ui", lineHeight: 1.5 }}>
      <p style={{ letterSpacing: 2, fontSize: 12 }}>ISM · BUSINESS ENGLISH</p>
      <h1>Speaking Lab · Pilot</h1>
      <p>Activity {index + 1} of {prompts.length} · {current.title}</p>
      <section aria-label="Speaking activity" style={{ border: "1px solid #aaa", borderRadius: 16, padding: 24 }}>
        <h2>{current.title}</h2>
        <p>{current.instruction}</p>
        {current.mode === "repeat" && <p><strong>{current.phrase}</strong></p>}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
          <button type="button" onClick={listen}>▶ Listen to example</button>
          <button type="button" onClick={state === "listening" ? () => recognition.current?.stop() : record} disabled={supported === false}>
            {state === "listening" ? "■ Stop recording" : "🎤 Speak now"}
          </button>
        </div>
        {supported === false && <p role="status">Voice recognition is not available in this browser. You can type your response below.</p>}
        <label htmlFor="spoken-response" style={{ display: "block", marginTop: 20 }}>Your response (recognized text or typed fallback)</label>
        <textarea id="spoken-response" value={transcript} onChange={event => { setTranscript(event.target.value); setState("done"); }} rows={3} style={{ width: "100%", boxSizing: "border-box" }} />
        {error && <p role="alert">{error}</p>}
        {transcript && <div aria-live="polite">
          {coverage !== null
            ? <p><strong>Word coverage: {coverage}%.</strong> This compares recognized words with the model sentence. It is not a pronunciation score.</p>
            : <p><strong>Great practice!</strong> You gave a response. Compare your answer with the example and try again. This pilot does not grade free conversation.</p>}
          <details><summary>View model response</summary><p>{current.phrase}</p></details>
        </div>}
      </section>
      <nav aria-label="Activity navigation" style={{ display: "flex", gap: 12, marginTop: 20 }}>
        <button type="button" disabled={index === 0} onClick={() => next(index - 1)}>Previous</button>
        <button type="button" disabled={index === prompts.length - 1} onClick={() => next(index + 1)}>Next activity</button>
      </nav>
      <p style={{ fontSize: 12, color: "#666" }}>Privacy: this pilot does not upload, save, or retain audio recordings. Browser speech recognition may use an external recognition service depending on the browser; obtain learner consent before use.</p>
    </main>
  );
}
