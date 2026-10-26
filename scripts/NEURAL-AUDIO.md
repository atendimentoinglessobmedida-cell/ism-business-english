# Rebuilding Business podcast narration

The three pilot episodes use original scripts, neural Kokoro voices and pre-rendered MP3 files. No speech service, credentials or model download is required on the learner's device.

Voice assignment is stable: `pf_dora` narrates Portuguese; `af_heart` narrates English and the first dialogue character; `am_michael` voices the second dialogue character. English examples always use an English voice, including inside the Portuguese version. The text and punctuation guide prosody. Repetition models retain their slower delivery and learner response pauses.

## Reproduction

Use Python 3.12 and install `kokoro-onnx==0.6.1`, `soundfile==0.14.0`, `espeakng-loader==0.2.4`, `misaki==0.9.4` and their dependencies in a local tool environment. The ONNX model and voice archive come from the official [model-files-v1.1 release](https://github.com/thewh1teagle/kokoro-onnx/releases/tag/model-files-v1.1): `kokoro-v1.0.onnx` and `voices-v1.0.bin`. Keep these large development files outside the application repository.

From the repository root, run the following commands, replacing the three absolute build, model and encoder paths with your local paths:

```powershell
node scripts/prepare-podcast-jobs.cjs C:/audio-build
python scripts/render-podcast-neural.py C:/audio-build C:/kokoro-models
python scripts/package-podcasts.py C:/audio-build . C:/tools/ffmpeg.exe
python scripts/check-podcast-media.py . C:/tools/ffmpeg.exe C:/audio-build/media-qa.json
node scripts/qa-static.mjs
```

The renderer caches complete clips by voice, engine revision, language, text and speaking rate. Failed synthesis aborts the run; atomic writes prevent interrupted clips from entering the cache. Packaging regenerates transcript timestamps and file hashes from the actual rendered speech. Encoding uses 24 kHz mono, 96 kbps MP3 and loudness normalization to -18 LUFS with a -2 dB true-peak target.

## Sources and limits

- [Kokoro-82M model](https://huggingface.co/hexgrad/Kokoro-82M): Apache-2.0.
- [Kokoro ONNX runtime](https://github.com/thewh1teagle/kokoro-onnx): MIT.
- [Official voice descriptions](https://huggingface.co/hexgrad/Kokoro-82M/blob/main/VOICES.md): the perceived naturalness varies by voice, language and phrase length.
- [eSpeak NG](https://github.com/espeak-ng/espeak-ng) supplies phonemes during local generation; the published app ships MP3 output rather than its library.

These are synthetic voices, not recordings of human actors. Automated decoding, signal and timing checks cannot judge pronunciation, intelligibility or naturalness by listening. Teacher listening remains the final editorial review before classroom adoption. This change covers the six pilot podcast recordings; other lesson playback systems remain separate.

Model SHA-256: `beb0d1848dee9a49da392cc3df26958d46cfa35d321edf434f52949153f0df3a`.
Voice archive SHA-256: `bca610b8308e8d99f32e6fe4197e7ec01679264efed0cac9140fe9c29f1fbf7d`.
