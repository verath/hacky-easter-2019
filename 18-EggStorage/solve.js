(function(){
    const CHARSET = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-._~"
                    .split("")
                    .map(ch => ch.charCodeAt(0));
    const CIPHER = ["f", "Q", "\01", "i", "P", "\13", "W", "P", "\03", "j", "\06", "\07", "\07","{", "\05", "\04", "P", "\0b", "\06", "\07", "W", "z", "P", "\04"]
                    .map(ch => ch.charCodeAt(0));

    function fullRange(c) {
        return CHARSET.filter(ch => (ch ^ c) in CHARSET);
    }

    function sharedRange(c1, c2) {
        return CHARSET.filter(ch => (ch ^ c1) in CHARSET && (ch ^ c2) in CHARSET);
    }

    const range_ch1 = ["T".charCodeAt(0)];
    const range_ch2 = ["h".charCodeAt(0)];
    const range_ch3 = ["3".charCodeAt(0)];
    const range_ch4 = ["P".charCodeAt(0)];
    const range_ch5 = (function() {
        const c = CIPHER[4];
        return ["0", "1", "3", "4", "5", "H", "L", "X", "c", "d", "f", "r"]
               .map(ch => ch.charCodeAt(0))
               .filter(ch => (ch ^ c) in CHARSET);
    })();
    const range_ch6 = fullRange(CIPHER[5]);
    const range_ch7 = fullRange(CIPHER[6]);
    const range_ch8 = fullRange(CIPHER[7]);
    const range_ch9 = fullRange(CIPHER[8]);
    const range_ch10 = fullRange(CIPHER[9]);
    const range_ch11 = fullRange(CIPHER[10]);
    const range_ch12 = sharedRange(CIPHER[11], CIPHER[15]); // $var12 == $var16
    const range_ch13 = fullRange(CIPHER[12]);
    const range_ch14 = fullRange(CIPHER[13]);
    const range_ch15 = sharedRange(CIPHER[14], CIPHER[21]); // $var15 == $var22
    const range_ch16 = sharedRange(CIPHER[11], CIPHER[15]); // $var12 == $var16
    const range_ch17 = sharedRange(CIPHER[16], CIPHER[23]); // $var17 == $var23
    const range_ch18 = fullRange(CIPHER[17]);
    const range_ch19 = fullRange(CIPHER[18]);
    const range_ch20 = fullRange(CIPHER[19]);
    const range_ch21 = fullRange(CIPHER[20]);
    const range_ch22 = sharedRange(CIPHER[14], CIPHER[21]); // $var15 == $var22
    const range_ch23 = sharedRange(CIPHER[16], CIPHER[23]); // $var17 == $var23

    return [
        range_ch1,
        range_ch2,
        range_ch3,
        range_ch4,
        range_ch5,
        range_ch6,
        range_ch7,
        range_ch8,
        range_ch9,
        range_ch10,
        range_ch11,
        range_ch12,
        range_ch13,
        range_ch14,
        range_ch15,
        range_ch16,
        range_ch17,
        range_ch18,
        range_ch19,
        range_ch20,
        range_ch21,
        range_ch22,
        range_ch23,
    ];
})();