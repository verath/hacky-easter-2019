import os
from PIL import Image

SCRIPT_DIR = os.path.dirname(os.path.realpath(__file__))


def split_image(im):
    """splits the given PIL.Image into 9 pieces."""
    # Each region is 300x300 px, separated by a 10px border
    # (left, top, right, bottom)
    regions = [
        (310 * 0, 310 * 0, 310 * 0 + 300, 310 * 0 + 300),
        (310 * 1, 310 * 0, 310 * 1 + 300, 310 * 0 + 300),
        (310 * 2, 310 * 0, 310 * 2 + 300, 310 * 0 + 300),
        (310 * 0, 310 * 1, 310 * 0 + 300, 310 * 1 + 300),
        (310 * 1, 310 * 1, 310 * 1 + 300, 310 * 1 + 300),
        (310 * 2, 310 * 1, 310 * 2 + 300, 310 * 1 + 300),
        (310 * 0, 310 * 2, 310 * 0 + 300, 310 * 2 + 300),
        (310 * 1, 310 * 2, 310 * 1 + 300, 310 * 2 + 300),
        (310 * 2, 310 * 2, 310 * 2 + 300, 310 * 2 + 300),
    ]
    for region in regions:
        yield im.crop(region)


def main():
    data_dir = os.path.join(SCRIPT_DIR, 'data')
    split_dir = os.path.join(data_dir, 'split')
    os.makedirs(split_dir, exist_ok=True)

    for file_name in os.listdir(data_dir):
        path = os.path.join(data_dir, file_name)
        if not os.path.isfile(path):
            continue
        if not path.endswith('.jpg'):
            continue
        print(file_name)
        name = os.path.splitext(file_name)[0]
        base_out_path = os.path.join(split_dir, name)
        im = Image.open(path)
        for i, im_piece in enumerate(split_image(im)):
            out_path = base_out_path + "_" + str(i) + ".jpg"
            im_piece.save(out_path)


if __name__ == "__main__":
    main()
