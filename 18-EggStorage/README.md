# 18 - Egg Storage [medium]
> Last year someone stole some eggs from Thumper.
> 
> This year he decided to use cutting edge technology to protect his eggs.
> 
> [Egg Storage](https://hackyeaster.hacking-lab.com/hackyeaster/challenges/eggstorage/index.html)


## Setup

Looking at the source we can directly see that this challenge is about WebAssembly:

```js
const content = new Uint8Array([0,97,115,109,1,0, ... ]);
// ...
function compileAndRun() {
    WebAssembly.instantiate(content, {
        base: {
            functions: nope
        }
    }).then(module => callWasm(module.instance));
}
compileAndRun();
```

We also notice that the level does things that makes debugging annoying, like
calling `debugger` in a loop. To avoid having to deal with that we instead
download the index.html file and modify it slightly to make it "run" locally:

```diff
--- index.html
+++ index-local.html
@@ -4,6 +4,7 @@
     <head>
         <meta charset="UTF-8">
         <title>Egg Storage</title>
+        <base href="https://hackyeaster.hacking-lab.com/hackyeaster/challenges/eggstorage/">
         <link href="main.css" rel="stylesheet" type="text/css"/>
     </head>
 
@@ -56,9 +57,8 @@
 
             function nope() {
                 for (let i = 0; i < 100; i++) {
-                    debugger;
                 }
-
+                debugger;
                 return 1337;
             }
```

We still keep a single debugger call in the `nope` function, so that
the debugger break once when it's called. Finally we also install
Firefox, since it seems to currently provide the better WebAssembly
debugging tools.


## Extracting The WebAssembly Textual Representation

After those setup steps, what we are really after is some way to get a more
human readable representation of the WebAssembly binary content. Some googling
seems to suggest that browsers can do this for us, and indeed after a quick
test that is the case. 

The perhaps easiest way to retrieve the textual representation created
by the browser is by using the call stack in the Firefox developer tools.
By supplying some valid (24 characters) input and clicking Validate we 
hit the `debugger` breakpoint in the `nope` function. Here we can see
that we are called by the WebAssembly code:

![nope_called.png](nope_called.png)

Clicking on the (wasmcall) entry we are taken to a textual representation of
the binary WebAssembly code that is running, see [content.wat](content.wat).
Now all we have to do is reverse it... :sweat_smile:!


## Reversing The WebAssembly

Resources for this section:
* [Understanding WebAssembly text format](https://developer.mozilla.org/en-US/docs/WebAssembly/Understanding_the_text_format)
* [WebAssembly Specification](http://webassembly.github.io/spec/core/index.html)
* The [content.wat](content.wat) from the previous section.


We know that from the outside we call `validatePassword`, so this seems like
the place to start. The call is made as follows:

```js
const password = document.getElementById('pass').value.split('').map(e => e.charCodeAt(0));
// ...
if(instance.exports.validatePassword(...password))
// ...
```

The first line transforms the string value of the `'pass'` input to an array of
character codes, e.g. the input string `"abc"` would become the array `[97, 98, 99]`.

The `...` in `...password` is javascript ["Spread syntax"](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax), resulting in `validatePassword` being called with `n` parameters, where `n` is the
number of characters in the `'pass'` input. But we know from the `{max,min}length` 
attributes in the HTML that the expected `n` here should be exactly 24.

Looking at the WebAssembly we see that the signature of `$func2` (which we from the
`export` declarations know is the `"validatePassword"` function) indeed has 24 input
parameters (`$var0` to `$var23`):

```wast
(func $func2 (param $var0 i32) (param $var1 i32) (param $var2 i32) (param $var3 i32) (param $var4 i32) (param $var5 i32) (param $var6 i32) (param $var7 i32) (param $var8 i32) (param $var9 i32) (param $var10 i32) (param $var11 i32) (param $var12 i32) (param $var13 i32) (param $var14 i32) (param $var15 i32) (param $var16 i32) (param $var17 i32) (param $var18 i32) (param $var19 i32) (param $var20 i32) (param $var21 i32) (param $var22 i32) (param $var23 i32) (result i32)
    ...
)
```

The first action performed by `"validatePassword"` is to call `$import0` and ignore
(`drop`) the result:

```wast
    call $import0   ;; base.functions
    drop
```

`$import0` is declared as `(import "base" "functions" (func $import0 (result i32)))`,
which we immediately recognize from the javascript side, where it is set to the
`nope` function:

```js
WebAssembly.instantiate(content, {
    base: {
        functions: nope
    }
}
```

Next follows a sequence of almost identical instructions, repeated for each
input parameter:

```wast
    i32.const 24           ;; Push 24 (memory offset) onto stack
    get_local $var0        ;; Push $var0 (1st param) onto stack
    i32.store8             ;; Store $var0 at memory offset 24+0
    i32.const 24
    get_local $var1
    i32.store8 offset=1    ;; Store $var1 at memory offset 24+1
    ...
    i32.const 24
    get_local $var23
    i32.store8 offset=23  ;; Store $var23 at memory offset 24+23
```

The result of the above code is that the value of each parameter is written to
the memory "array", starting at index 24 and continuing until index 47. The
reason that the code starts writing at index 24 is that there are already
24 entries predefined entries in the memory array, specified as a data
section:

```wast
(data (i32.const 0)
    "fQ\01iP\13WP\03j\06\07\07{\05\04P\0b\06\07WzP\04"
)
```

As such, the memory array at this point in execution contains the following:
```js
[102, 81, 1, 105, 80, 19, 87, 80, 3, 106, 6, 7, 7, 123, 5, 4, 80, 11, 6, 7, 87, 122, 80, 4, $var0, $var1, ..., $var23]
```

Switching to Chrome dev tools we can actually set breakpoints in the WebAssembly and
inspect the memory to assure ourselves that we haven't made a misstake yet:

![params_in_memory_debugger.png](params_in_memory_debugger.png)

Next is a loop that calls `validateRange`:

```wast
    i32.const 4           ;;
    set_local $var24      ;; $var24 = 4
    loop $label0
      i32.const 24        ;;
      get_local $var24    ;;
      i32.add             ;;
      i32.load8_u         ;;
      call $func1         ;; ret = validateRange(memory[$var24 + 24])
      i32.eqz             ;;
      if                  ;; if (ret == 0)
        i32.const 0       ;;   return 0
        return            ;;
      end
      get_local $var24    ;;
      i32.const 1         ;;
      i32.add             ;;
      set_local $var24    ;; $var24 += 1
      get_local $var23    ;;
      i32.const 24        ;; if ($var23 < 24)
      i32.le_s            ;;    goto $label0
      br_if $label0       ;;
    end $label0
```

The loop is either run once, if the last character of the input (`$var23`)
is >= 24, or run forever if `$var23` is < 24. Since characters below 24 in
the ascii table aren't easy to write in an input field, it seems pretty 
likely that the expected case is `$var23 >= 24` and that the loop will run
exactly one time. So `validateRange` is only really called once with the
value of `memory[4 + 24]`, the 5th character in the input (`$var4`).

`validateRange` ($func1) is a much simpler function. It's basically just a
bunch of `eq` and `or` instructions chained after each other. It returns
`1` if the input parameter matches any of (48, 49, 51, 52, 53, 72, 76, 88,
99, 100, 102, 114), or `0` otherwise:

```wast
(func $func1 (param $var0 i32) (result i32)
    i32.const 48         ;;
    get_local $var0      ;;
    i32.eq               ;; ret = ($var0 == 48)
    i32.const 49         ;;
    get_local $var0      ;;
    i32.eq               ;;
    i32.or               ;; ret = ($var0 == 49) || ret
    ;; ...
    if                   ;; 
      i32.const 1        ;;
      return             ;;
    end                  ;;
    i32.const 0          ;;
    return               ;; return (ret ? 1 : 0)
  )
```

The loop and `validateRange` together means that we now know that the
5th character (`$var4`) in the input must be one of the 12 possible ascii
values listed previously, i.e. one of:
`["0", "1", "3", "4", "5", "H", "L", "X", "c", "d", "f", "r"]`.
So yea, that was a lot of work for almost no reward...

Luckily, the next sequence of instructions are both easier to
interpret and gives us more information about the required input:

```wast
    get_local $var0       ;;
    i32.const 84          ;;
    i32.ne                ;;
    if                    ;; if ($var0 != 84)
      i32.const 0         ;;    return 0
      return              ;;
    end
    get_local $var1       ;;
    i32.const 104         ;;
    i32.ne                ;;
    if                    ;; if ($var1 != 104)
      i32.const 0         ;;    return 0
      return              ;;
    end
    get_local $var2       ;;
    i32.const 51          ;;
    i32.ne                ;;
    if                    ;; if ($var2 != 51)
      i32.const 0         ;;    return 0
      return              ;;
    end
    get_local $var3       ;;
    i32.const 80          ;;
    i32.ne                ;;
    if                    ;; if ($var3 != 80)
      i32.const 0         ;;    return 0
      return              ;;
    end
```

It's just a bunch of comparisons between input character and
hardcoded values. With those we now know the following must be
true:

```js
$var0 == 84  // ("T")
$var1 == 104 // ("h")
$var2 == 51  // ("3")
$var3 == 80  // ("P")
// ["0", "1", "3", "4", "5", "H", "L", "X", "c", "d", "f", "r"]
$var4 in [48, 49, 51, 52, 53, 72, 76, 88, 99, 100, 102, 114] 
```

___
Again, remember that this can be verified by stepping the code in the Chrome
developer tools; After entering a password that starts with "Th3P0" (where
the 0 can be replaced by any of the `$var4` range of possible values) we do
see that we continue past all the instructions that we have looked at so far.
___

Next are a couple of comparisons between pairs of input characters,
testing that they are the same value:

```wast
    get_local $var23      ;;
    get_local $var17      ;;
    i32.ne                ;;
    if                    ;; if ($var23 != $var17)
      i32.const 0         ;;    return 0
      return
    end
    get_local $var12      ;;
    get_local $var16      ;;
    i32.ne                ;; if ($var12 != $var16)
    if                    ;;    return 0
      i32.const 0         ;;
      return              ;;
    end
    get_local $var22      ;;
    get_local $var15      ;;
    i32.ne                ;; if ($var22 != $var15)
    if                    ;;    return 0
      i32.const 0         ;;
      return              ;;
    end
```

Followed by a bunch of more complicated relations between
character pairs:

```wast
    get_local $var5       ;;
    get_local $var7       ;;
    i32.sub               ;;
    i32.const 14          ;;
    i32.ne                ;;
    if                    ;; if (($var5 - $var7) != 14)
      i32.const 0         ;;    return 0
      return              ;;
    end
    get_local $var14      ;;
    i32.const 1           ;;
    i32.add               ;;
    get_local $var15      ;;
    i32.ne                ;;
    if                    ;; if (($var14 + 1) != $var15)
      i32.const 0         ;;    return 0
      return              ;;
    end
    get_local $var9       ;;
    get_local $var8       ;;
    i32.rem_s             ;;
    i32.const 40          ;;
    i32.ne                ;;
    if                    ;; if (($var9 % $var8) != 40)
      i32.const 0         ;;    return 0
      return              ;;
    end
```

Followed by even more complicated relations:

```wast
    get_local $var5       ;;
    get_local $var9       ;;
    i32.sub               ;;
    get_local $var19      ;;
    i32.add               ;; res = ($var5 - $var9) + $var19
    i32.const 79          ;;
    i32.ne                ;;
    if                    ;; if (res != 79)
      i32.const 0         ;;    return 0
      return              ;;
    end
    get_local $var7       ;;
    get_local $var14      ;;
    i32.sub               ;;
    get_local $var20      ;;
    i32.ne                ;;
    if                    ;; if (($var7 - $var14) != $var20)
      i32.const 0         ;;    return 0
      return              ;;
    end
    get_local $var9       ;;
    get_local $var4       ;;
    i32.rem_s             ;;
    i32.const 2           ;;
    i32.mul               ;; res = ($var9 % $var4) * 2
    get_local $var13      ;;
    i32.ne                ;;
    if                    ;; if (res != $var13)
      i32.const 0         ;;    return 0
      return              ;;
    end
    get_local $var13      ;;
    get_local $var6       ;;
    i32.rem_s             ;;
    i32.const 20          ;;
    i32.ne                ;;
    if                    ;; if ($var13 % $var6 == 20)
      i32.const 0         ;;    return 0
      return              ;;
    end
    get_local $var11      ;;
    get_local $var13      ;; 
    i32.rem_s             ;; 
    get_local $var21      ;;
    i32.const 46          ;;
    i32.sub               ;;
    i32.ne                ;;
    if                    ;; if (($var11 % $var13) != ($var21 - 46))
      i32.const 0         ;;    return 0
      return              ;;
    end
    get_local $var7       ;;
    get_local $var6       ;;
    i32.rem_s             ;;
    get_local $var10      ;;
    i32.ne                ;; if (($var7 % $var6) != $var10)
    if                    ;;    return 0
      i32.const 0         ;;
      return              ;;
    end
    get_local $var23      ;;
    get_local $var22      ;;
    i32.rem_s             ;;
    i32.const 2           ;;
    i32.ne                ;;
    if                    ;; if (($var23 % var22) != 2)
      i32.const 0         ;;    return 0
      return              ;;
    end
```

Finally there is a large loop that accumulates both the sum and the XOR of
memory between index `24+4` and `24+23`. (Remember that we know since earlier
that these memory locations has the same value as the vars `$var4` through
`$var23`):

```wast
    i32.const 4           ;;
    set_local $var24      ;; $var24 = 4
    i32.const 0           ;;
    set_local $var25      ;; $var25 = 0
    i32.const 0           ;;
    set_local $var26      ;; $var26 = 0
    loop $label1
      get_local $var25    ;;
      i32.const 24        ;;
      get_local $var24    ;;
      i32.add             ;;
      i32.load8_u         ;;
      i32.add             ;;
      set_local $var25    ;; $var25 += mem[$var24 + 24]
      get_local $var26    ;;
      i32.const 24        ;;
      get_local $var24    ;;
      i32.add             ;; 
      i32.load8_u         ;;
      i32.xor             ;;
      set_local $var26    ;; $var26 ^= mem[$var24 + 24] 
      get_local $var24    ;;
      i32.const 1         ;;
      i32.add             ;;
      set_local $var24    ;; $var24 += 1
      get_local $var24    ;;
      i32.const 24        ;;
      i32.le_s            ;; if ($var24 >= 24)
      br_if $label1       ;;    break
    end $label1
```

The accumulated sum and XOR is then checked against two constants:

```wast
    get_local $var25      ;;
    i32.const 1352        ;;
    i32.ne                ;; // $var25 == sum of numbers
    if                    ;; if ($var25 != 1352)
      i32.const 0         ;;    return 0
      return              ;;
    end
    get_local $var26      ;;
    i32.const 44          ;;
    i32.ne                ;; // $var26 == xor of numbers
    if                    ;; if ($var26 != 44)
      i32.const 0         ;;    return 0
      return              ;;
    end
```

If we manage to get past all that, the final instructions calls `$func3`
("decrypt") and returns 1, signaling to the caller that the input was correct.
The decrypt function performs a per character XOR between predefined data (the
initial memory content) and the input data, then storing it back to memory
at indices `0` through `24`.

```wast
    call $func3         ;; "decrypt"
    drop
    i32.const 1
    return
  )
  ;; decrypt
  (func $func3 (result i32)
    (local $var0 i32)
    loop $label0
      get_local $var0
      get_local $var0
      i32.load8_u       ;; a = mem[$var0]
      i32.const 24      ;;
      get_local $var0   ;;
      i32.add           ;;
      i32.load8_u       ;; b = mem[$var0 + 24]
      i32.xor           ;;
      i32.store8        ;; mem[$var0] = a ^ b
      get_local $var0   ;;
      i32.const 1       ;;
      i32.add           ;;
      set_local $var0   ;; $var0 += 1
      get_local $var0   ;;
      i32.const 24      ;;
      i32.le_s          ;; if ($var0 >= 24)
      br_if $label0     ;;    break
    end $label0
    i32.const 1337
    return
  )
```

The XORed memory is then read and used on the javascript side in `getEgg` to
return the flag for the level:

```js
function getEgg(instance) {
    const memory = new Uint8Array(instance.exports['0'].buffer);
    let flag = '';
    for (let i = 0; i < 24; i++) {
        flag += String.fromCharCode(memory[i]);
    }
    return flag;
}
```

Finally the flag is used as the URL for an image by calling `setResultImage`:

```js
function callWasm(instance) {
    if (instance.exports.validatePassword(...password)) {
        setResultImage(`eggs/${getEgg(instance)}`);
    } else {
        showError();
    }
}
```

Puh, that was a lot of WebAssembly and a lot of relations... Summarizing the
relations we end up with the following system of (pseudo) equations:

```
$var0  == 84  ("T")
$var1  == 104 ("h")
$var2  == 51  ("3")
$var3  == 80  ("P")
$var4  in ["0", "1", "3", "4", "5", "H", "L", "X", "c", "d", "f", "r"]
$var5  == 14 + $var7 == 79 - $var19 + $var9
$var6  == ?
$var7  == $var5 - 14 == $var20 + $var14
$var8  == ? 
$var9  == $var5 + $var19 - 79
$var11 == ?
$var10 == ?
$var12 == $var16
$var13 == ($var9 % $var4) * 2
$var14 == $var15 - 1 == $var7 - $var20
$var15 == $var22 == $var14 + 1
$var16 == $var12
$var17 == $var23
$var18 == ?
$var19 == 79 - $var5 + $var9
$var20 == $var7 - $var14
$var21 == ?
$var22 == $var15
$var23 == $var17

$var9 % $var8 == 40
$var13 % $var6 == 20
$var11 % $var13 == $var21 - 46
$var7 % $var6 == $var10
$var23 % $var22 == 2
$var4 + $var5 + ... + $var23 == 1352
$var4 ^ $var5 ^ ... ^ $var23 == 44
```

Now all that remains is to find an input that matches all of
those. Surely that's an easy task... :see_no_evil:

## Solving Relations

After spending some time trying to solve the relations by hand
it was pretty obvious that there were no easy solution that
could be found manually. Instead I wrote a script ([solve.js](solve.js))
for trying to programmatically solve the problem. This section
explains the underlying ideas of the solve.js script and how it,
together with some guessing, finally resulted in finding the
correct input to unlock the egg.

### Implementing A "Relation Solver"

The basic idea for the relation solver, solve.js, was to maintain a range
of possible input characters for each character position. The range for each
position would start of "unlimited" and then, due to the relations with other character positions, it would shrink. 

In practice, we can be almost certain that each character is within the range
of printable ASCII characters, since otherwise it would be hard to enter them
in an HTML input field (also it would make this already pretty hard level
close to impossible). So the initial range most probably isn't actually
"unlimited", but rather limited to some 100 printable ASCII characters. With
that assumption we have already reduced the number of combinations from 
"unlimited" to approximately `100^19` (=`1 × 10^38`). Nice! And we haven't
even started coding yet :).

One detail I didn't really consider much previously, but that turned
out to be essential for solving the level, was the per character XOR
performed in the `decrypt` function. This is important since it 
implicitly limits the range of possible input characters for a given
position to only those that when XORed with the *known* cipher
character produces a valid character. For some positions this was
another pretty large reduction in possible values.

Keeping the above in mind we can define the initial ranges for all
the 24 input positions (`ch0` through `ch23` in the script). For
the first 4 we already know their exact value so we use that. `ch4`
is known to be a smaller subset of input characters. All other
positions are given a `fullRange`, which means that they are "any
printable ascii character such that when XORed with the cipher
character produces a printable ascii character". This is implemented
in the solve.js script as follows:

```js
// Chars that the input may contain (=any printable ASCII characters)
const INPUT_CHARSET = [];
for (let i = 32; i <= 126; i++) {
    INPUT_CHARSET.push(i);
}
// Chars that the final "flag" may contain (=same as INPUT_CHARSET)
const FLAG_CHARSET = INPUT_CHARSET.slice();
// Known cipher (predefined in memory)
const CIPHER = [102, 81, 1, 105, 80, 19, 87, 80, 3, 106, 6, 7, 7, 123, 5, 4, 80, 11, 6, 7, 87, 122, 80, 4];

function fullRange(c) {
    return INPUT_CHARSET.filter(ch => FLAG_CHARSET.indexOf(ch ^ c) > -1);
}

// Initial ranges for character positions 0..23
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
// ...
let ch23 = fullRange(CIPHER[23]);
```

Following the initial ranges we enter a loop that repeats until no changes
were made to any of the ranges (the `ch` variables). The loop is there so
that we can evaluate each relation separately without having to consider
how other relations are affected. For example, if evaluating the last relation
changes `ch8` so that it is limited to `"3"` or `"5"` then each previous
relation that referenced `ch8` has to be re-evaluated. The loop does this for
us, but at a slight cost of evaluating all relations again, instead of only
those that *had* to be re-evaluated:

```js
// totalLenght returns the total length of all the ch ranges. This
// is used to determine if any change was made.
function totalLenght() {
    let chs = [ch0, ch1, ch2, ch3, ch4, ch5, ch6, ch7, ch8, ch9, ch10, ch11, ch12, ch13, ch14, ch15, ch16, ch17, ch18, ch19, ch20, ch21, ch22, ch23,];
    return chs.reduce((acc, ch) => acc + ch.length, 0);
}

let prevTotalLength = 0;
do {
    prevTotalLength = totalLenght();
    // Evaluate relations
    // ...
} while (totalLenght() < prevTotalLength)
```

Within the loop are all the relations that we found by reversing the
WebAssembly. Each relation is implemented by removing any entry from the range
of possible values for that input position that the relation cannot be true
for. For example, the equality relation between `ch17` and `ch23` is
implemented by removing any entry in `ch17` that is not in `ch23` (and the
other way around), since if some character is not in both `ch17` and `ch23`
then the relation cannot be true for that  character. The `ch17 == ch23`
implementation as such looks like this:

```js
// $var23 == $var17
ch17 = ch17.filter(ch17_ => ch23.indexOf(ch17_) > -1);
ch23 = ch23.filter(ch23_ => ch17.indexOf(ch23_) > -1);
```

Although the code is significantly simpler for the equality relation
than the other types of relations, the other types of relations are
still implemented based on the same principle.

After implementing all the relations (except the "total sum" and "total XOR")
we still end up with a fairly large number of possible characters.
Actually that is a bit of an understatement... At this point we have only
managed to reduce the number of possible combinations to approximately
`1.5 × 10^23`. According to Wolfram Alpha that number is on about the same
order of magnitude as there are grains of sand on the earth, AKA probably
not something we can brute-force. This is also why we cannot implement the
"total sum" and "total XOR", as they would also require enumerating all
(or almost all) possible combinations.

At this point there are probably two alternatives. Either we come up with a
clever way to incorporate "total sum" and "total XOR" without having to
enumerate all `1.5 × 10^23` possible combinations, or we do some guessing. I
thought the solve.js was clever enough at this point, so I decided on trying
the latter.


### (Educated) Guessing

Currently we are at a point where most positions can be a large number of
possible characters. Take the last position (`ch23`) for example, it can
take any of the following values:

```js
["$", "%", "&", "'", "(", ")", "*", "+", ",", "-", ".", "/", "0", "2", "3", "4", "5", "6", "7", "8", "9", ":", ";", "<", "=", ">", "?", "@", "A", "F", "H", "J", "L", "N", "P", "R", "T", "V", "X", "Z", "\\", "^", "b", "d", "f", "h", "j", "k", "l", "n", "p", "q", "r", "v", "w", "x", "z", "|", "}", "~"]
```

The reason for there being so many possibilities is mostly due to the "charsets"
we are allowing for both the input and the flag (see `INPUT_CHARSET` and
`FLAG_CHARSET`). Right now they are both set to the full range of printable
ASCII characters, which is probably a bit too permissive. Importantly, any
reduction to these charsets will potentially affect the range for all
positions.

After experimenting with reducing both the `INPUT_CHARSET` and the
`FLAG_CHARSET` to various subsets of characters, we eventually find that
allowing only lowercase hex for the flag seems to be the golden guess. Adding
only this additional restriction we still have at least one possible solution
for each characters position, and the total number of combinations is down to
just `921600`:

```js
const FLAG_CHARSET = "abcdef0123456789".split("").map(c => c.charCodeAt(0));

// Ranges after evaluating expressions
ch0: "T"
ch1: "h"
ch2: "3"
ch3: "P"
ch4: "4", "5"
ch5: "r"
ch6: "4"
ch7: "d"
ch8: "0", "1"
ch9: "X", "Y"
ch10: "0"
ch11: "b", "c", "d", "e", "f"
ch12: "1", "2", "3", "4", "5", "6", "a", "b", "c", "d", "e", "f"
ch13: "H"
ch14: "0"
ch15: "1"
ch16: "1", "2", "3", "4", "5", "6", "a", "b", "c", "d", "e", "f"
ch17: "3"
ch18: "0", "1", "2", "3", "4", "5", "6", "7", ">", "?", "`", "b", "c", "d", "e", "g"
ch19: "5", "6"
ch20: "4"
ch21: "H", "I", "J", "K", "L"
ch22: "1"
ch23: "3"
```

It's not that difficult to notice that these ranges very much looks like they
could form a sentence in leetspeak. Indeed, by doing some manual "locking" of
characters (e.g. locking ch11 to f: `ch11 = ["f".charCodeAt(0)];`) we finally
find the input we have been looking for has to be: `Th3P4r4d0X0fcH01c3154L13`
(= The paradox of choice is a lie).

Typing this into the "Egg Storage" input field and hitting Validate we are
given the egg for the level:

![2929dac4326ad3553872c6a7.png](2929dac4326ad3553872c6a7.png)
