import json
from pathlib import Path
import semver
import sys
import os
import lib

def update_prerelease_version(file_path):
    data = lib.read_json(file_path)

    if 'version' not in data:
        raise Exception(f"The 'version' field is missing in {file_path}")

    # Parse and increment the prerelease version with preid 'dev'
    try:
        current_version = semver.VersionInfo.parse(data['version'])
        new_version = current_version.bump_prerelease(token="dev")
    except ValueError as e:
        raise Exception(f"Invalid version format in {file_path}: {e}")

    # Update version in package.json
    data['version'] = str(new_version)
    lib.write_json(file_path, data)

    return str(new_version)

def propagate_version_to_app_json(app_json_path, version):
    data = lib.read_json(app_json_path)

    # Update the version in app.json
    data['expo']['version'] = version
    lib.write_json(app_json_path, data)

if len(sys.argv) != 2:
    print("Usage: python script.py <folder_path>")
    sys.exit(1)

folder_path = Path(sys.argv[1])

if not folder_path.is_dir():
    raise NotADirectoryError(f"{folder_path} is not a valid directory.")

package_json_path = f"{folder_path}/package.json"
app_json_path = f"{folder_path}/app.json"

if not os.path.exists(package_json_path):
    raise FileNotFoundError(f"{package_json_path} not found.")

if not os.path.exists(app_json_path):
    raise FileNotFoundError(f"{app_json_path} not found.")

# Update package.json version and propagate it to app.json
new_version = update_prerelease_version(package_json_path)
propagate_version_to_app_json(app_json_path, new_version)

print(f"Updated version to {new_version} in both package.json and app.json.")
