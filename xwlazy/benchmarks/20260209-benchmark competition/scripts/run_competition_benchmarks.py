#!/usr/bin/env python3
"""
Benchmark campaign: 20260209-benchmark competition
This script aligns the legacy xwlazy competition benchmarks with
GUIDE_54_BENCH:
- Lives under benchmarks/<date-title>/scripts/
- Delegates to the existing competition_tests/benchmark_competition.py
- Copies generated BENCH_*.md and BENCH_*.json outputs into:
    - benchmarks/<date-title>/benchmarks/  (Markdown reports)
    - benchmarks/<date-title>/data/        (JSON/raw results)
Usage (from project root):
    python benchmarks/20260209-benchmark competition/scripts/run_competition_benchmarks.py
You can pass any arguments supported by benchmark_competition.py, for example:
    python benchmarks/20260209-benchmark competition/scripts/run_competition_benchmarks.py \\
        --library all --test all
See docs/guides/GUIDE_54_BENCH.md for structure and expectations.
"""

from __future__ import annotations
import shutil
import subprocess
import sys
from pathlib import Path
from typing import Iterable, Tuple, Set


def _list_bench_outputs(output_dir: Path) -> Tuple[Set[str], Set[str]]:
    """Return sets of BENCH_*.md and BENCH_*.json file names in output_dir."""
    md = {p.name for p in output_dir.glob("BENCH_*.md")}
    js = {p.name for p in output_dir.glob("BENCH_*.json")}
    return md, js


def _copy_new_files(
    names: Iterable[str], src_dir: Path, dst_dir: Path
) -> int:
    """Copy files listed in names from src_dir to dst_dir, return count."""
    copied = 0
    dst_dir.mkdir(parents=True, exist_ok=True)
    for name in names:
        src = src_dir / name
        if not src.is_file():
            continue
        dst = dst_dir / name
        shutil.copy2(src, dst)
        copied += 1
    return copied


def main(argv: list[str] | None = None) -> int:
    argv = list(sys.argv[1:] if argv is None else argv)
    # Resolve key paths based on this script location
    script_path = Path(__file__).resolve()
    campaign_dir = script_path.parents[1]  # .../20260209-benchmark competition
    benchmarks_root = campaign_dir.parent  # .../benchmarks
    competition_dir = benchmarks_root / "competition_tests"
    output_dir = competition_dir / "output_log"
    if not competition_dir.is_dir():
        print(f"ERROR: competition_tests directory not found at {competition_dir}")
        return 1
    # Ensure output/log and campaign folders exist
    output_dir.mkdir(parents=True, exist_ok=True)
    campaign_bench_dir = campaign_dir / "benchmarks"
    campaign_data_dir = campaign_dir / "data"
    campaign_bench_dir.mkdir(parents=True, exist_ok=True)
    campaign_data_dir.mkdir(parents=True, exist_ok=True)
    print("=" * 80)
    print("xwlazy Competition Benchmark (GUIDE_54_BENCH campaign: 20260209-benchmark competition)")
    print("=" * 80)
    print(f"- Legacy harness: {competition_dir / 'benchmark_competition.py'}")
    print(f"- Raw outputs   : {output_dir}")
    print(f"- Reports (.md) : {campaign_bench_dir}")
    print(f"- Data (.json)  : {campaign_data_dir}")
    print()
    before_md, before_json = _list_bench_outputs(output_dir)
    cmd = [sys.executable, str(competition_dir / "benchmark_competition.py"), *argv]
    print("Running competition benchmark harness:")
    print("  ", " ".join(cmd))
    print()
    proc = subprocess.run(cmd, cwd=str(competition_dir))
    if proc.returncode != 0:
        print(f"WARNING: benchmark_competition.py exited with code {proc.returncode}")
    after_md, after_json = _list_bench_outputs(output_dir)
    new_md = sorted(after_md - before_md)
    new_json = sorted(after_json - before_json)
    md_count = _copy_new_files(new_md, output_dir, campaign_bench_dir)
    json_count = _copy_new_files(new_json, output_dir, campaign_data_dir)
    print()
    print("Benchmark artifact sync summary:")
    print(f"- New markdown reports copied: {md_count}")
    print(f"- New JSON result files copied: {json_count}")
    print()
    print("Done. See BENCH_*.md under this campaign's benchmarks/ folder for human-readable results.")
    return 0
if __name__ == "__main__":
    raise SystemExit(main())
