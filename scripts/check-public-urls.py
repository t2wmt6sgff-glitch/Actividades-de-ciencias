#!/usr/bin/env python3
"""Check every public activity URL and write a compact maintenance report."""

from __future__ import annotations

import concurrent.futures
import json
import sys
import urllib.error
import urllib.request
from datetime import datetime, timezone
from pathlib import Path


def check(activity):
    request = urllib.request.Request(
        activity["url"],
        method="HEAD",
        headers={"User-Agent": "Mozilla/5.0 (compatible; ScienceActivitiesLinkCheck/1.0)"},
    )
    try:
        with urllib.request.urlopen(request, timeout=25) as response:
            return {
                "id": activity["id"],
                "url": activity["url"],
                "status": response.status,
                "finalUrl": response.geturl(),
                "ok": 200 <= response.status < 400,
                "error": None,
            }
    except urllib.error.HTTPError as error:
        return {"id": activity["id"], "url": activity["url"], "status": error.code, "finalUrl": error.geturl(), "ok": False, "error": str(error)}
    except Exception as error:
        return {"id": activity["id"], "url": activity["url"], "status": None, "finalUrl": None, "ok": False, "error": str(error)}


def main():
    if len(sys.argv) != 3:
        raise SystemExit("usage: check-public-urls.py DATA.json REPORT.json")
    data = json.loads(Path(sys.argv[1]).read_text(encoding="utf-8"))
    with concurrent.futures.ThreadPoolExecutor(max_workers=10) as executor:
        results = list(executor.map(check, data["activities"]))
    results.sort(key=lambda result: result["id"])
    report = {
        "checkedAt": datetime.now(timezone.utc).isoformat(),
        "total": len(results),
        "ok": sum(result["ok"] for result in results),
        "failed": sum(not result["ok"] for result in results),
        "results": results,
    }
    output = Path(sys.argv[2])
    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({key: report[key] for key in ("checkedAt", "total", "ok", "failed")}, ensure_ascii=False, indent=2))
    if report["failed"]:
        print(json.dumps([result for result in results if not result["ok"]], ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
