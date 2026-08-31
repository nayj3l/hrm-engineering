"""
HRM Engineering - SFTP Deploy Script
Uploads all site files to the Network Solutions hosting server.

Usage:
  .venv\Scripts\python.exe -u deploy.py audit    # List remote files
  .venv\Scripts\python.exe -u deploy.py deploy   # Upload local files

SFTP credentials are loaded from environment variables or hardcoded below.
"""

import paramiko
import os
import sys
import stat

SFTP_HOST = "000ca59.netsolhost.com"
SFTP_USER = "hrmengineering"
SFTP_PASS = "@1696Nayj"
SFTP_PORT = 22

LOCAL_ROOT = os.path.dirname(os.path.abspath(__file__))

# Files/dirs to skip entirely
SKIP_DIRS = {".venv", ".git", "src", "__pycache__"}
SKIP_FILES = {
    ".gitignore", "readme.md", "environment.mjs", "github-env.mjs",
    "deploy.py", "index.scss", "index.css.map",
}
SKIP_EXTENSIONS = {".scss", ".map", ".mjs", ".pyc", ".py"}


def should_skip(rel_path: str) -> bool:
    parts = rel_path.replace("\\", "/").split("/")
    for part in parts[:-1]:
        if part in SKIP_DIRS or part.startswith("."):
            return True
    filename = parts[-1]
    if filename in SKIP_FILES:
        return True
    _, ext = os.path.splitext(filename)
    if ext.lower() in SKIP_EXTENSIONS:
        return True
    return False


def sftp_makedirs(sftp, remote_path: str):
    """Recursively create directories on remote."""
    parts = remote_path.replace("\\", "/").split("/")
    current = ""
    for part in parts:
        if not part:
            continue
        current = current + "/" + part if current else part
        try:
            sftp.stat(current)
        except FileNotFoundError:
            try:
                sftp.mkdir(current)
                print(f"  [mkdir] {current}")
            except Exception as e:
                print(f"  [mkdir failed] {current}: {e}")


def list_remote_tree(sftp, remote_dir: str, depth: int = 0):
    """List remote directory tree for auditing."""
    try:
        items = sftp.listdir_attr(remote_dir)
    except Exception as e:
        print(f"  [error listing {remote_dir}]: {e}")
        return

    for item in sorted(items, key=lambda x: x.filename):
        path = f"{remote_dir}/{item.filename}"
        indent = "  " * depth
        if stat.S_ISDIR(item.st_mode):
            print(f"{indent}[DIR]  {item.filename}/")
            if depth < 3:
                list_remote_tree(sftp, path, depth + 1)
        else:
            size = item.st_size
            print(f"{indent}       {item.filename}  ({size:,} bytes)")


def get_remote_root(sftp):
    """Detect the web root on the server."""
    candidates = ["public_html", "www", "htdocs", "web"]
    cwd = sftp.getcwd() or "."
    print(f"SFTP landing directory: {cwd}")

    try:
        root_items = [i.filename for i in sftp.listdir_attr(".")]
        print(f"Root contents: {root_items}")
    except Exception as e:
        print(f"Could not list root: {e}")
        root_items = []

    for candidate in candidates:
        if candidate in root_items:
            print(f"Found web root: {candidate}")
            return candidate

    print("Using server root as web root")
    return "."


def deploy(mode: str = "deploy"):
    """
    mode='audit': list remote files only
    mode='deploy': upload all local files
    """
    print(f"\n{'='*60}")
    print(f"HRM Engineering - SFTP {mode.upper()}")
    print(f"Host: {SFTP_HOST}")
    print(f"{'='*60}\n")

    transport = paramiko.Transport((SFTP_HOST, SFTP_PORT))
    transport.connect(username=SFTP_USER, password=SFTP_PASS)
    sftp = paramiko.SFTPClient.from_transport(transport)

    try:
        remote_root = get_remote_root(sftp)

        if mode == "audit":
            print(f"\nRemote tree under '{remote_root}':\n")
            list_remote_tree(sftp, remote_root)
            return

        to_upload = []
        for dirpath, dirnames, filenames in os.walk(LOCAL_ROOT):
            dirnames[:] = [d for d in dirnames
                          if d not in SKIP_DIRS and not d.startswith(".")]
            for filename in filenames:
                local_path = os.path.join(dirpath, filename)
                rel_path = os.path.relpath(local_path, LOCAL_ROOT)
                if should_skip(rel_path):
                    continue
                to_upload.append((local_path, rel_path))

        print(f"Files to upload: {len(to_upload)}\n")

        uploaded = 0
        errors = 0

        for local_path, rel_path in sorted(to_upload):
            rel_unix = rel_path.replace("\\", "/")
            remote_path = f"{remote_root}/{rel_unix}" if remote_root != "." else rel_unix

            remote_dir = "/".join(remote_path.split("/")[:-1])
            if remote_dir:
                sftp_makedirs(sftp, remote_dir)

            try:
                sftp.put(local_path, remote_path)
                size = os.path.getsize(local_path)
                print(f"  [ok]  {rel_unix}  ({size:,} bytes)")
                uploaded += 1
            except Exception as e:
                print(f"  [err] {rel_unix}: {e}")
                errors += 1

        print(f"\n{'='*60}")
        print(f"Upload complete: {uploaded} uploaded, {errors} errors")
        print(f"{'='*60}\n")

    finally:
        sftp.close()
        transport.close()


if __name__ == "__main__":
    mode = sys.argv[1] if len(sys.argv) > 1 else "deploy"
    deploy(mode)
