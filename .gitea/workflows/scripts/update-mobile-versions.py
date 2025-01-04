import json
from pathlib import Path
import semver
import sys
import os
import lib

def update_package_json(file_path):
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


def update_app_json(app_json_path):
    data = lib.read_json(app_json_path)

    # Update the version in app.json
    version = data['expo']['version']
    version_number_parts = ios_build_number.split('.')
    if len(version_number_parts) == 3:
        new_version = f"{version_number_parts[0]}.{version_number_parts[1]}.{int(version_number_parts[2]) + 1}"
        data['expo']['version'] = new_version
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
update_package_json(package_json_path)
update_app_json(app_json_path)

print(f"Updated versions in both package.json and app.json.")
