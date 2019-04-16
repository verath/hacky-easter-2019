import sys
import os


def main(file_path):
    # reverse filename for out_file, evihcra.piz -> archive.zip.
    (file_name, ext) = os.path.splitext(os.path.basename(file_path))
    ext = ext[1:]  # strip leading '.'
    out_file = file_name[::-1] + "." + ext[::-1]
    out_file = os.path.join(os.path.dirname(file_path), out_file)

    # Open input, mirror, and write to new file.
    with open(file_path, 'rb') as f:
        contents = f.read()
    contents = contents[::-1]
    with open(out_file, 'wb') as f:
        f.write(contents)

    print("{} -> {}".format(file_path, out_file))


if __name__ == "__main__":
    main(sys.argv[1])
