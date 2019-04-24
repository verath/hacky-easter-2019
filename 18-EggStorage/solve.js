(function () {
'use strict';

    // Chars that the input may contain
    const INPUT_CHARSET = [];
    for (let i = 32; i <= 126; i++) {
        INPUT_CHARSET.push(i);
    }
    // Chars that the final "flag" may contain
    const FLAG_CHARSET = INPUT_CHARSET.slice();
    // Known cipher (predefined in memory)
    // "fQ\01iP\13WP\03j\06\07\07{\05\04P\0b\06\07WzP\04"
    const CIPHER = [102, 81, 1, 105, 80, 19, 87, 80, 3, 106, 6, 7, 7, 123, 5, 4, 80, 11, 6, 7, 87, 122, 80, 4];

    function fullRange(c) {
        return INPUT_CHARSET.filter(ch => FLAG_CHARSET.indexOf(ch ^ c) > -1);
    }

    let ch0 = ["T".charCodeAt(0)];
    let ch1 = ["h".charCodeAt(0)];
    let ch2 = ["3".charCodeAt(0)];
    let ch3 = ["P".charCodeAt(0)];
    let ch4 = (function () {
        const c = CIPHER[4];
        return ["0", "1", "3", "4", "5", "H", "L", "X", "c", "d", "f", "r"]
            .map(ch => ch.charCodeAt(0))
            .filter(ch => FLAG_CHARSET.indexOf(ch ^ c) > -1);
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

    // totalLenght returns the total length of all the ch ranges. This
    // is used to determine if any change was made.
    function totalLenght() {
        let chs = [ch0, ch1, ch2, ch3, ch4, ch5, ch6, ch7, ch8, ch9, ch10, ch11, ch12, ch13, ch14, ch15, ch16, ch17, ch18, ch19, ch20, ch21, ch22, ch23,];
        return chs.reduce((acc, ch) => acc + ch.length, 0);
    }

    let prevTotalLength = 0;
    let outerLoopIters = 0;
    do {
        prevTotalLength = totalLenght();
        console.group(`Outer Loop ${++outerLoopIters}`);
        console.log("Total Length:", prevTotalLength);
        console.time("Outer Loop");

        // $var23 == $var17
        ch17 = ch17.filter(ch17_ => ch23.indexOf(ch17_) > -1);
        ch23 = ch23.filter(ch23_ => ch17.indexOf(ch23_) > -1);

        // $var12 == $var16
        ch12 = ch12.filter(ch12_ => ch16.indexOf(ch12_) > -1);
        ch16 = ch16.filter(ch16_ => ch12.indexOf(ch16_) > -1);

        // $var22 == $var15
        ch15 = ch15.filter(ch15_ => ch22.indexOf(ch15_) > -1);
        ch22 = ch22.filter(ch22_ => ch15.indexOf(ch22_) > -1);

        // ($var5 - $var7) == 14
        //   => $var5 == $var7 + 14
        //   => $var7 == $var5 - 14
        ch5 = ch5.filter(ch5_ => ch7.indexOf(ch5_ - 14) > -1);
        ch7 = ch7.filter(ch7_ => ch5.indexOf(ch7_ + 14) > -1);

        // $var14 + 1 == $var15
        //   => $var14 == $var15 - 1
        //   => $var15 == $var14 + 1
        ch14 = ch14.filter(ch14_ => ch15.indexOf(ch14_ + 1) > -1);
        ch15 = ch15.filter(ch15_ => ch14.indexOf(ch15_ - 1) > -1);

        // ($var9 % $var8) == 40
        let didChange = false;
        do {
            didChange = false;
            // Test that for each entry "ch9_" in ch9 there is an entry
            // "ch8_" in ch8 such that: (ch9_ % ch8_) == 40.
            for (let i = (ch9.length - 1); i >= 0; i--) {
                let ch9_ = ch9[i];
                let ok = false;
                for (let ch8_ of ch8) {
                    if (ch9_ % ch8_ === 40) {
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
                for (let ch9_ of ch9) {
                    if (ch9_ % ch8_ === 40) {
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

        // $var7 - $var14 == $var20
        //   => $var7 == $var14 + $var20
        //   => $var14 == $var7 - $var20
        //   => $var20 == $var7 - $var14
        didChange = false;
        do {
            didChange = false;

            // Test that for each entry "ch7_" in ch7 there are entries "ch14_"
            // in ch14 and "ch20_" in ch20 such that: ch7_ == ch14_ + ch20_
            let rhs = new Set();
            for (let ch14_ of ch14) {
                for (let ch20_ of ch20) {
                    rhs.add(ch14_ + ch20_);
                }
            }
            for (let i = (ch7.length - 1); i >= 0; i--) {
                let ch7_ = ch7[i];
                if (!rhs.has(ch7_)) {
                    ch7.splice(i, 1);
                    didChange = true;
                }
            }

            // Test that for each entry "ch14_" in ch14 there are entries "ch7_"
            // in ch7 and "ch20_" in ch20 such that: ch14_ == ch7_ - ch20_
            rhs = new Set();
            for (let ch7_ of ch7) {
                for (let ch20_ of ch20) {
                    rhs.add(ch7_ - ch20_);
                }
            }
            for (let i = (ch14.length - 1); i >= 0; i--) {
                let ch14_ = ch14[i];
                if (!rhs.has(ch14_)) {
                    ch14.splice(i, 1);
                    didChange = true;
                }
            }

            // Test that for each entry "ch20_" in ch20 there are entries "ch7_"
            // in ch7 and "ch14_" in ch14 such that: ch20_ == ch7_ - ch14_
            rhs = new Set();
            for (let ch7_ of ch7) {
                for (let ch14_ of ch14) {
                    rhs.add(ch7_ - ch14_);
                }
            }
            for (let i = (ch20.length - 1); i >= 0; i--) {
                let ch20_ = ch20[i];
                if (!rhs.has(ch20_)) {
                    ch20.splice(i, 1);
                    didChange = true;
                }
            }
            
        } while(didChange);

        console.timeEnd("Outer Loop");
        console.groupEnd();
    } while (totalLenght() < prevTotalLength)

    let chs = [ch0,ch1,ch2,ch3,ch4,ch5,ch6,ch7,ch8,ch9,ch10,ch11,ch12,ch13,ch14,ch15,ch16,ch17,ch18,ch19,ch20,ch21,ch22,ch23,];
    let out = chs.map(ch => ch.map(ch_ => String.fromCharCode(ch_)));
    console.log(out);
    console.log(out.reduce((acc, ch) => acc * ch.length, 1));
    console.log(totalLenght());
})();
