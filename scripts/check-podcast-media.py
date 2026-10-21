"""Decode every packaged episode and verify duration, audible signal and headroom."""
import json, subprocess, sys
from pathlib import Path
import numpy as np

root, encoder, output = map(Path, sys.argv[1:4])
text = (root / 'business-podcast-data.js').read_text(encoding='utf-8')
episodes = json.loads(text.split('window.ISMBusinessPodcasts=', 1)[1].rstrip(';\n'))
results = []
for episode in episodes:
    for language, version in episode['versions'].items():
        pcm = subprocess.check_output([str(encoder), '-v', 'error', '-i', str(root / version['audio']), '-ac', '1', '-ar', '16000', '-f', 's16le', 'pipe:1'])
        data = np.frombuffer(pcm, dtype='<i2').astype(np.float64) / 32768
        duration = len(data) / 16000
        peak = float(np.max(np.abs(data)))
        rms = float(np.sqrt(np.mean(data ** 2)))
        assert abs(duration - version['duration']) < .2, 'Duration mismatch'
        assert .1 < peak < .99, 'Signal is silent or has insufficient headroom'
        assert .005 < rms < .3, 'Unexpected overall signal level'
        results.append(dict(episode=episode['id'], language=language, seconds=duration, peak=round(peak, 4), rms_db=round(20 * np.log10(rms), 2), decoded=True))
output.write_text(json.dumps(results, indent=2), encoding='utf-8')
print(f'{len(results)} MP3 files decoded: duration, audible signal and headroom passed. Listening quality still requires human review.')
