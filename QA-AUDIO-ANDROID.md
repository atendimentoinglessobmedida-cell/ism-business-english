# Android browser audio

Shared `audio-player.js` provides English device text-to-speech for Core and Premium. It selects English voices, handles asynchronously loaded voice lists, keeps utterances alive, splits long scripts, and exposes test/repeat/stop controls. Normal and slow buttons retain their respective rates. Playback starts from user interaction. Failed starts and synthesis errors provide actionable messages. Changing page or hiding the app cancels speech.

Core inline JSON arguments are escaped for HTML attributes, fixing broken playback and related activity buttons containing quoted strings. Audio voice preferences use only `ismbe:audio:v1`; learning storage is untouched.

Validation: mobile viewport in Edge/Chromium with an instrumented speech engine; delayed voice availability, English selection, normal/slow rates, phrase/question/builder controls, long-script completion, stop, network failure, missing English voice, and Premium integration all passed without uncaught JavaScript errors.

Limits: no physical Android device or audible voice quality was tested. This uses device text-to-speech, not downloadable MP3 recordings. Some voices require internet. English voice installation and speech support depend on the device/browser. Recognition/microphone behavior is not part of this change.
