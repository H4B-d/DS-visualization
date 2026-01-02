import os

def generate_tree(dir_path, prefix=""):
    """
    Hàm đệ quy để tạo cấu trúc cây thư mục.
    """
    tree_str = ""
    try:
        items = sorted([item for item in os.listdir(dir_path) if not item.startswith('.')])
    except PermissionError:
        return ""

    for i, item in enumerate(items):
        path = os.path.join(dir_path, item)
        is_last = (i == len(items) - 1)
        
        connector = "└── " if is_last else "├── "
        tree_str += f"{prefix}{connector}{item}\n"
        
        if os.path.isdir(path):
            new_prefix = prefix + ("    " if is_last else "│   ")
            tree_str += generate_tree(path, new_prefix)
            
    return tree_str

def save_tree_to_file(root_directory, output_file):
    if not os.path.exists(root_directory):
        print("Đường dẫn không tồn tại!")
        return

    root_name = os.path.basename(os.path.abspath(root_directory))
    full_tree = f"{root_name}/\n" + generate_tree(root_directory)

    with open(output_file, "w", encoding="utf-8") as f:
        f.write(full_tree)
    
    print(f"Đã xuất cây thư mục thành công ra file: {output_file}")

folder_to_scan = "."  
output_filename = "File tree.txt"

save_tree_to_file(folder_to_scan, output_filename)