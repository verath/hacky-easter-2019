import requests
import os
import uuid
import time

SCRIPT_DIR = os.path.dirname(os.path.realpath(__file__))
INDEX_URL = 'http://whale.hacking-lab.com:3555/'
PICTURE_URL = 'http://whale.hacking-lab.com:3555/picture'


def get_capteg():
    with requests.Session() as sess:
        sess.get(INDEX_URL).raise_for_status()
        pic_res = sess.get(PICTURE_URL, stream=True)
        pic_res.raise_for_status()
        return pic_res


def main():
    data_dir = os.path.join(SCRIPT_DIR, 'data')
    os.makedirs(data_dir, exist_ok=True)

    while True:
        pic_name = str(uuid.uuid4()) + ".jpg"
        pic_path = os.path.join(data_dir, pic_name)
        try:
            pic_res = get_capteg()
            with open(pic_path, 'wb') as f:
                for chunk in pic_res:
                    f.write(chunk)
            print("-> ", pic_path)
        except requests.HTTPError as err:
            print(err)

        time.sleep(5)


if __name__ == "__main__":
    main()
