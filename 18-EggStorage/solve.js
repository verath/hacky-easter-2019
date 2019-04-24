(function () {
    // Chars that the input may contain
    const INPUT_CHARSET = [];
    for (let i = 32; i <= 126; i++) {
        INPUT_CHARSET.push(i);
    }
    // Chars that the final "flag" may contain
    const FLAG_CHARSET = INPUT_CHARSET;
    // Known cipher (predefined in memory)
    const CIPHER = ["f", "Q", "\01", "i", "P", "\13", "W", "P", "\03", "j", "\06", "\07", "\07", "{", "\05", "\04", "P", "\0b", "\06", "\07", "W", "z", "P", "\04"]
        .map(ch => ch.charCodeAt(0));

    function fullRange(c) {
        return INPUT_CHARSET.filter(ch => (ch ^ c) in FLAG_CHARSET);
    }

    let ch0 = ["T".charCodeAt(0)];
    let ch1 = ["h".charCodeAt(0)];
    let ch2 = ["3".charCodeAt(0)];
    let ch3 = ["P".charCodeAt(0)];
    let ch4 = (function () {
        const c = CIPHER[4];
        return ["0", "1", "3", "4", "5", "H", "L", "X", "c", "d", "f", "r"]
            .map(ch => ch.charCodeAt(0))
            .filter(ch => (ch ^ c) in FLAG_CHARSET);
    })();
    let ch5 = fullRange(CIPHER[5]);
    let ch6 = fullRange(CIPHER[6]);
    let ch7 = fullRange(CIPHER[7]);
    let ch8 = fullRange(CIPHER[8]);
    let ch9 = fullRange(CIPHER[9]);
    let ch10 = fullRange(CIPHER[10]);
    let ch11 = fullRange(CIPHER[11]);
    let ch12 = fullRange(CIPHER[12]);
    let ch13 = fullRange(CIPHER[13]);
    let ch14 = fullRange(CIPHER[14]);
    let ch15 = fullRange(CIPHER[15]);
    let ch16 = fullRange(CIPHER[16]);
    let ch17 = fullRange(CIPHER[17]);
    let ch18 = fullRange(CIPHER[18]);
    let ch19 = fullRange(CIPHER[19]);
    let ch20 = fullRange(CIPHER[20]);
    let ch21 = fullRange(CIPHER[21]);
    let ch22 = fullRange(CIPHER[22]);
    let ch23 = fullRange(CIPHER[23]);

    // $var23 == $var17
    ch17 = ch17.filter(ch => (ch ^ CIPHER[23]) in FLAG_CHARSET);
    ch23 = ch17;

    // $var12 == $var16
    ch12 = ch12.filter(ch => (ch ^ CIPHER[16]) in FLAG_CHARSET);
    ch16 = ch12;

    // $var22 == $var15
    ch15 = ch15.filter(ch => (ch ^ CIPHER[22]) in FLAG_CHARSET);
    ch22 = ch15;

    // ($var5 - $var7) == 14
    //   => $var5 == $var7 + 14
    //   => $var7 == $var5 - 14
    ch5 = ch5.filter(ch => (ch - 14) in INPUT_CHARSET);
    ch7 = ch7.filter(ch => (ch + 14) in INPUT_CHARSET);
    ch5 = ch5.filter(ch => ((ch - 14) ^ CIPHER[7]) in FLAG_CHARSET);
    ch7 = ch7.filter(ch => ((ch + 14) ^ CIPHER[5]) in FLAG_CHARSET);

    // $var14 + 1 == $var15
    //   => $var14 == $var15 - 1
    //   => $var15 == $var14 + 1
    ch14 = ch14.filter(ch => (ch + 1) in INPUT_CHARSET);
    ch15 = ch15.filter(ch => (ch - 1) in INPUT_CHARSET);
    ch14 = ch14.filter(ch => ((ch + 1) ^ CIPHER[15]) in FLAG_CHARSET);
    ch15 = ch15.filter(ch => ((ch - 1) ^ CIPHER[14]) in FLAG_CHARSET);

    // ($var9 % $var8) == 40
    let didChange = false;
    do {
        didChange = false;
        // Test that for each entry "ch9_" in ch9 there is an entry
        // "ch8_" in ch8 such that: (ch9_ % ch8_) == 40.
        for (let i = (ch9.length - 1); i >= 0; i--) {
            let ch9_ = ch9[i];
            let ok = false;
            for (ch8_ of ch8) {
                if (ch9_ % ch8_ == 40) {
                    ok = true;
                    break;
                }
            }
            if (!ok) {
                ch9.splice(i, 1);
                didChange = true;
            }
        }
        // Test that for each entry "ch8_" in ch8 there is an entry
        // "ch9_" in ch9 such that: (ch9_ % ch8_) == 40.
        for (let i = (ch8.length - 1); i >= 0; i--) {
            let ch8_ = ch8[i];
            let ok = false;
            for (ch9_ of ch9) {
                if (ch9_ % ch8_ == 40) {
                    ok = true;
                    break;
                }
            }
            if (!ok) {
                ch8.splice(i, 1);
                didChange = true;
            }
        }
    } while (didChange);

    // $var5 - $var9 + $var19 == 79
    //   => $var5 == 79 - $var19 + $var9
    //   => $var9 == $var5 + $var19 - 79
    //   => $var19 == 79 - $var5 + $var9
    didChange = false;
    do {
        didChange = false;

        // Test that for each entry "ch5_" in ch5 there are entries "ch9_"
        // in ch9 and "ch19_" in ch19 such that: ch5_ == 79 - ch19_ + ch9_
        let rhs = new Set();
        for (let ch9_ of ch9) {
            for (let ch19_ of ch19) {
                rhs.add(79 - ch19_ + ch9_);
            }
        }
        for (let i = (ch5.length - 1); i >= 0; i--) {
            let ch5_ = ch5[i];
            if (!rhs.has(ch5_)) {
                ch5.splice(i, 1);
                didChange = true;
            }
        }

        // Test that for each entry "ch9_" in ch9 there are entries "ch5_"
        // in ch5 and "ch19_" in ch19 such that: ch9_ == ch5_ + ch19_ - 79
        rhs = new Set();
        for (let ch5_ of ch5) {
            for (let ch19_ of ch19) {
                rhs.add(ch5_ + ch19_ - 79);
            }
        }
        for (let i = (ch9.length - 1); i >= 0; i--) {
            let ch9_ = ch9[i];
            if (!rhs.has(ch9_)) {
                ch9.splice(i, 1);
                didChange = true;
            }
        }

        // Test that for each entry "ch19_" in ch19 there are entries "ch5_"
        // in ch5 and "ch9_" in ch9 such that: ch19_ == 79 - ch5_ + ch9_
        rhs = new Set();
        for (let ch5_ of ch5) {
            for (let ch9_ of ch9) {
                rhs.add(79 - ch5_ + ch9_);
            }
        }
        for (let i = (ch19.length - 1); i >= 0; i--) {
            let ch19_ = ch19[i];
            if (!rhs.has(ch19_)) {
                ch19.splice(i, 1);
                didChange = true;
            }
        }
    } while (didChange);

    let out = [
        ch0,
        ch1,
        ch2,
        ch3,
        ch4,
        ch5,
        ch6,
        ch7,
        ch8,
        ch9,
        ch10,
        ch11,
        ch12,
        ch13,
        ch14,
        ch15,
        ch16,
        ch17,
        ch18,
        ch19,
        ch20,
        ch21,
        ch22,
        ch23,
    ].map(chs => chs.map(ch => String.fromCharCode(ch)));
    console.log(out);
    console.log(out.reduce((acc, ch) => acc * ch.length, 1));
})();
