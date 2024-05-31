import os

def count_lines_in_file(file_path):
    with open(file_path, 'r', encoding='utf-8') as file:
        lines = file.readlines()
        return len(lines)

def count_lines_in_directory(directory):
    total_lines = 0
    for root, dirs, files in os.walk(directory):
        # Exclude the node_modules directory
        if 'node_modules' in dirs:
            dirs.remove('node_modules')
        for file in files:
            if file.endswith('.ts') or file.endswith('.tsx'):
                file_path = os.path.join(root, file)
                total_lines += count_lines_in_file(file_path)
    return total_lines

# Replace 'your_directory_path' with the path to the directory you want to analyze
directory_path = '..'
total_lines = count_lines_in_directory(directory_path)
print(f"Total number of lines in .ts and .tsx files: {total_lines}")
