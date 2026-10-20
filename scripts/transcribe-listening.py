#!/usr/bin/env python3
"""
用 mcode-tools 的 listen_audio 把切好的听力单元逐段转写。

用法：
    python3 scripts/transcribe-listening.py <units-dir> <out-dir> [prompt]
"""
import json
import os
import subprocess
import sys
import time

TOOL = "connector__matrix__listen_audio"


def run(cmd: list[str]) -> str:
    proc = subprocess.run(cmd, capture_output=True, text=True)
    if proc.returncode != 0:
        raise SystemExit(f"命令失败: {' '.join(cmd)}\n{proc.stdout}\n{proc.stderr}")
    return proc.stdout


def transcribe(path: str, prompt: str | None) -> dict:
    url = json.loads(run(["mcode-tools", "upload_temp_url", path]))["temp_url"]
    audio_info: dict = {"url": url, "mime_type": "audio/wav"}
    if prompt:
        audio_info["prompt"] = prompt
    args_path = path + ".args.json"
    with open(args_path, "w") as fh:
        json.dump({"audio_info": audio_info}, fh)
    out = ""
    for attempt in range(4):
        proc = subprocess.run(
            ["mcode-tools", "connector", "call", TOOL, "--args-file", args_path],
            capture_output=True,
            text=True,
        )
        if proc.returncode == 0:
            out = proc.stdout
            break
        print(f"  第 {attempt + 1} 次调用失败，重试：{proc.stderr.strip()[:120]}")
        time.sleep(5 * (attempt + 1))
    if not out:
        raise SystemExit(f"转写失败：{path}")
    os.remove(args_path)
    return json.loads(out)


def main() -> None:
    units_dir, out_dir = sys.argv[1], sys.argv[2]
    prompt = sys.argv[3] if len(sys.argv) > 3 else None
    os.makedirs(out_dir, exist_ok=True)

    files = sorted(
        f for f in os.listdir(units_dir) if f.endswith(".wav")
    )
    for name in files:
        src = os.path.join(units_dir, name)
        dst = os.path.join(out_dir, name.replace(".wav", ".json"))
        if os.path.exists(dst):
            print(f"skip {name}")
            continue
        result = transcribe(src, prompt)
        with open(dst, "w") as fh:
            json.dump(result, fh, ensure_ascii=False)
        text = result.get("transcription", "")
        print(f"{name} -> {len(text)} chars")
        sys.stdout.flush()


if __name__ == "__main__":
    main()
