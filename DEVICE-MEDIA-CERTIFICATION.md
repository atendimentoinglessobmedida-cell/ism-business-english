# Device & Media Certification — final physical gate

This checklist is intentionally **not auto-certified**. It must be completed on real hardware before final production promotion.

## Android — Chrome

- [ ] Open installed/PWA and browser version.
- [ ] TESTAR ÁUDIO produces audible English with acceptable volume/clarity.
- [ ] Normal and slow playback are distinguishable and intelligible.
- [ ] Repeat and Stop work; audio stops when app is backgrounded.
- [ ] Microphone permission prompt is understandable.
- [ ] Record → stop → replay works with no duplicate playback.
- [ ] Denied microphone permission shows recovery guidance and does not block the lesson.
- [ ] Speaking rubric saves; retry creates a second evidence entry.
- [ ] Refresh/reopen resumes the expected learner state.
- [ ] Offline restart keeps previously loaded shell/content available.

## iPhone — Safari / installed web app

- [ ] App opens without horizontal overflow.
- [ ] English TTS is audible and acceptable.
- [ ] Audio starts only after user interaction and stops on background/navigation.
- [ ] Microphone permission, recording and replay work.
- [ ] Denied permission leaves a usable voice-out-loud fallback.
- [ ] Keyboard does not cover the active action/input.
- [ ] Refresh/reopen preserves progress.
- [ ] Installed app updates to the new cache without mixed old/new UI.

## Viewport matrix

Run critical Home → lesson → Speaking → Smart Review → Toolkit/My Business English at 320, 360, 375, 390, 412 and 430 CSS px. Record any horizontal overflow, clipped CTA, inaccessible modal control or keyboard obstruction.

## Pass rule

Final production promotion remains blocked until Android and iOS rows above are checked on physical devices. Automated capability checks are evidence of code coverage, not a substitute for audible/physical certification.