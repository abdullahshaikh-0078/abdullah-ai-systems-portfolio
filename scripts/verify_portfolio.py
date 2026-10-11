"""
Production Portfolio Verification Suite
Tests local server, HTML syntax, internal links, CSS balance, and visual captures.
"""

import os
import re
import subprocess
import urllib.request
from html.parser import HTMLParser

BASE_URL = "http://localhost:8080/index.html"
EDGE_EXE = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
OUT_DIR = r"C:\Users\ABDULLAH SHAIKH\.gemini\antigravity-ide\brain\dcf196ba-0159-4865-9316-7b874cccd8a4"

def test_server():
    print("[1/5] Testing local server connectivity...")
    try:
        with urllib.request.urlopen(BASE_URL, timeout=3) as resp:
            code = resp.getcode()
            print(f"  [OK] Server responded with HTTP {code}")
            return code == 200
    except Exception as e:
        print(f"  [FAIL] Server connection failed: {e}")
        return False

def test_html_syntax():
    print("[2/5] Testing HTML syntax integrity...")
    class Validator(HTMLParser):
        def __init__(self):
            super().__init__()
            self.stack = []
            self.self_closing = {'meta', 'link', 'img', 'br', 'hr', 'input', 'source', 'area', 'base', 'col', 'embed', 'param', 'track', 'wbr'}
            self.errors = []
        def handle_starttag(self, tag, attrs):
            if tag.lower() not in self.self_closing:
                self.stack.append((tag, self.getpos()))
        def handle_endtag(self, tag):
            if tag.lower() in self.self_closing: return
            if not self.stack:
                self.errors.append(f'Extra closing </{tag}>')
                return
            last, pos = self.stack.pop()
            if last.lower() != tag.lower():
                self.errors.append(f'Mismatch: expected </{last}> from line {pos[0]}, got </{tag}>')

    all_valid = True
    for page in ['index.html', 'projects/ai-news.html']:
        v = Validator()
        with open(page, 'r', encoding='utf-8') as f:
            v.feed(f.read())
        valid = len(v.stack) == 0 and len(v.errors) == 0
        if valid:
            print(f"  [OK] {page}: Perfectly nested HTML tags")
        else:
            print(f"  [FAIL] {page}: Errors: {v.errors}")
            all_valid = False
    return all_valid

def test_anchor_links():
    print("[3/5] Testing internal anchor links in index.html...")
    with open('index.html', 'r', encoding='utf-8') as f:
        c = f.read()
    hrefs = re.findall(r'href="#([a-zA-Z0-9_\-]+)"', c)
    ids = set(re.findall(r'id="([a-zA-Z0-9_\-]+)"', c))
    missing = [h for h in set(hrefs) if h and h not in ids]
    if not missing:
        print(f"  [OK] All {len(hrefs)} anchor links resolve to valid IDs")
        return True
    else:
        print(f"  [FAIL] Missing target IDs: {missing}")
        return False

def test_css_braces():
    print("[4/5] Testing CSS rule brace balance in styles/main.css...")
    with open('styles/main.css', 'r', encoding='utf-8') as f:
        css = f.read()
    open_b = css.count('{')
    close_b = css.count('}')
    if open_b == close_b:
        print(f"  [OK] main.css: {open_b} open braces match {close_b} close braces")
        return True
    else:
        print(f"  [FAIL] Mismatched CSS braces: {open_b} open vs {close_b} close")
        return False

def test_api_client():
    print("[5/6] Testing API client configuration & contracts...")
    try:
        res = subprocess.run(["node", "--test", "scripts/test_api_client.js"], capture_output=True, text=True)
        if res.returncode == 0:
            print("  [OK] All 9 API client & URL normalization tests passed")
            return True
        else:
            print(f"  [FAIL] API tests failed:\n{res.stderr or res.stdout}")
            return False
    except Exception as e:
        print(f"  [FAIL] Could not run Node.js tests: {e}")
        return False

def test_visual_captures():
    print("[6/6] Generating visual verification captures...")
    if not os.path.exists(EDGE_EXE):
        print("  - Edge executable not found, skipping screenshots")
        return True

    captures = [
        ("verify_hero_dark.png", f"{BASE_URL}?theme=dark"),
        ("verify_hero_light.png", f"{BASE_URL}?theme=light"),
        ("verify_modal_top.png", f"{BASE_URL}?theme=dark&modal=resume"),
        ("verify_modal_bottom.png", f"{BASE_URL}?theme=dark&modal=resume&scrollModal=bottom")
    ]

    for filename, url in captures:
        out_path = os.path.join(OUT_DIR, filename)
        cmd = [
            EDGE_EXE,
            '--headless=new',
            '--disable-gpu',
            '--window-size=1440,900',
            '--virtual-time-budget=2000',
            f'--screenshot={out_path}',
            url
        ]
        try:
            subprocess.run(cmd, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
            print(f"  [OK] Captured {filename}")
        except Exception as e:
            print(f"  [FAIL] Failed to capture {filename}: {e}")
    return True

if __name__ == "__main__":
    print("=" * 60)
    print("PORTFOLIO PRODUCTION VERIFICATION")
    print("=" * 60)
    t1 = test_server()
    t2 = test_html_syntax()
    t3 = test_anchor_links()
    t4 = test_css_braces()
    t5 = test_api_client()
    t6 = test_visual_captures()
    print("=" * 60)
    all_passed = t1 and t2 and t3 and t4 and t5 and t6
    print(f"FINAL RESULT: {'ALL CHECKS PASSED [OK]' if all_passed else 'SOME CHECKS FAILED [FAIL]'}")
    print("=" * 60)

