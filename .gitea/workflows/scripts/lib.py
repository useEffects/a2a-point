import json

def read_json(file_path):
    try:
        with open(file_path, 'r') as file:
            return json.load(file)
    except Exception as e:
        raise Exception(f"Failed to read {file_path}: {e}")

def write_json(file_path, data):
    try:
        with open(file_path, 'w') as file:
            json.dump(data, file, indent=4)
    except Exception as e:
        raise Exception(f"Failed to write to {file_path}: {e}")