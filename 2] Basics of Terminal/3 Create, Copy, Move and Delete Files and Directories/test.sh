# Create file
# touch [file_name]

# Make directory/folder
# mkdir [folder_name]

# Copy file
# cp [file_name] [folder_name] or [path]

# Move file
# mv [file_name] [folder_name] or [path]

# Delete file
# rm [file_name]

# Delete directory/folder (only empty)
# rmdir [folder_name]

# Delete directory/folder (not empty)
# rm -r [folder_name] # r - recursive flag


# Create multiple files at once
for i in {1..10}; do touch "app$i.js"; done