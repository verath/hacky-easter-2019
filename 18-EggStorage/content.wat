(module
  (type $type0 (func (param i32) (result i32)))
  (type $type1 (func (param i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32) (result i32)))
  (type $type2 (func (result i32)))
  (type $type3 (func (result i32)))
  (import "base" "functions" (func $import0 (result i32)))
  (memory (;0;) 1 1)
  (export "validateRange" (func $func1))
  (export "validatePassword" (func $func2))
  (export "decrypt" (func $func3))
  (export "0" (memory 0))
  ;; validateRange
  (func $func1 (param $var0 i32) (result i32)
    i32.const 48         ;;
    get_local $var0      ;;
    i32.eq               ;; ret = ($var0 == 48)
    i32.const 49         ;;
    get_local $var0      ;;
    i32.eq               ;;
    i32.or               ;; ret = ($var0 == 49) || ret
    i32.const 51
    get_local $var0
    i32.eq
    i32.or
    i32.const 52
    get_local $var0
    i32.eq
    i32.or
    i32.const 53
    get_local $var0
    i32.eq
    i32.or
    i32.const 72
    get_local $var0
    i32.eq
    i32.or
    i32.const 76
    get_local $var0
    i32.eq
    i32.or
    i32.const 88
    get_local $var0
    i32.eq
    i32.or
    i32.const 99
    get_local $var0
    i32.eq
    i32.or
    i32.const 100
    get_local $var0
    i32.eq
    i32.or
    i32.const 102
    get_local $var0
    i32.eq
    i32.or
    i32.const 114
    get_local $var0
    i32.eq
    i32.or
    if                   ;; 
      i32.const 1        ;;
      return             ;;
    end                  ;;
    i32.const 0          ;;
    return               ;; return (ret ? 1 : 0)
  )
  ;; validatePassword
  (func $func2 (param $var0 i32) (param $var1 i32) (param $var2 i32) (param $var3 i32) (param $var4 i32) (param $var5 i32) (param $var6 i32) (param $var7 i32) (param $var8 i32) (param $var9 i32) (param $var10 i32) (param $var11 i32) (param $var12 i32) (param $var13 i32) (param $var14 i32) (param $var15 i32) (param $var16 i32) (param $var17 i32) (param $var18 i32) (param $var19 i32) (param $var20 i32) (param $var21 i32) (param $var22 i32) (param $var23 i32) (result i32)
    (local $var24 i32) (local $var25 i32) (local $var26 i32)
    call $import0 ;; base.functions (==nope)
    drop
    i32.const 24           ;; Push 24 (memory offset) onto stack
    get_local $var0        ;; Push $var0 (1st param) onto stack
    i32.store8             ;; Store $var0 at memory offset 24+0
    i32.const 24
    get_local $var1
    i32.store8 offset=1
    i32.const 24
    get_local $var2
    i32.store8 offset=2
    i32.const 24
    get_local $var3
    i32.store8 offset=3
    i32.const 24
    get_local $var4
    i32.store8 offset=4
    i32.const 24
    get_local $var5
    i32.store8 offset=5
    i32.const 24
    get_local $var6
    i32.store8 offset=6
    i32.const 24
    get_local $var7
    i32.store8 offset=7
    i32.const 24
    get_local $var8
    i32.store8 offset=8
    i32.const 24
    get_local $var9
    i32.store8 offset=9
    i32.const 24
    get_local $var10
    i32.store8 offset=10
    i32.const 24
    get_local $var11
    i32.store8 offset=11
    i32.const 24
    get_local $var12
    i32.store8 offset=12
    i32.const 24
    get_local $var13
    i32.store8 offset=13
    i32.const 24
    get_local $var14
    i32.store8 offset=14
    i32.const 24
    get_local $var15
    i32.store8 offset=15
    i32.const 24
    get_local $var16
    i32.store8 offset=16
    i32.const 24
    get_local $var17
    i32.store8 offset=17
    i32.const 24
    get_local $var18
    i32.store8 offset=18
    i32.const 24
    get_local $var19
    i32.store8 offset=19
    i32.const 24
    get_local $var20
    i32.store8 offset=20
    i32.const 24
    get_local $var21
    i32.store8 offset=21
    i32.const 24
    get_local $var22
    i32.store8 offset=22
    i32.const 24
    get_local $var23
    i32.store8 offset=23
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
    i32.rem_s             ;; $var7 % $var6
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
    call $func3
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
    i32.const 1337      ;;
    return              ;; return 1337
  )
  (data (i32.const 0)
    "fQ\01iP\13WP\03j\06\07\07{\05\04P\0b\06\07WzP\04"
  )
)