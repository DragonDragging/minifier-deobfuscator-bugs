# Terser Side-Effect Detection & Webcrack Deobfuscation Bug

This README covers two related topics:

1. Detecting side effects removed by minifiers like **Terser**.
2. A bug in Webcrack deobfuscation related to self-redefining lookup tables.

---

## Terser Side-Effect Detection

This snippet detects whether a JavaScript minifier (e.g. **Terser**) removed an expression it considers "unused".

It relies on a **side effect inside `Symbol.toPrimitive`**.  
When the object is used in an arithmetic operation (`breakingObject * 2`), JavaScript must convert it to a number, triggering `Symbol.toPrimitive`.

If the minifier removes the expression:

```js
breakingObject * 2
```
The conversion never happens and the side effect is skipped.

Result

wrong call

Idea

Minifiers sometimes remove expressions whose results are unused, even if they contain hidden side effects through implicit conversions.

Bug: Incorrect Transformation of Self-Redefining Lookup Table
Original Code
```js
function decodeFunction(index) {
    var lookupTable = createLookupTable();

    decodeFunction = function(index) {
        return lookupTable[index];
    };
}

function createLookupTable() {
    var lookupTable = [];

    createLookupTable = function() {
        return lookupTable;
    };

    return createLookupTable();
}

(() => {})(createLookupTable());
```
What the Code Does
This is a self-redefining function modified pattern commonly produced by javascript-obfuscator (obfuscator.io).

Resulting output:
(() => {})(__STRING_ARRAY__());
Why This Is Incorrect
createLookupTable() is not a simple string array provider.
Important properties lost during transformation:
Self-redefining behavior
Closure over lookupTable
Runtime initialization step
The deobfuscator assumes the function is equivalent to a static array provider, which is not guaranteed.

Effect
The transformation breaks semantics:
Replacing it with __STRING_ARRAY__ removes the closure.

Summary
The deobfuscator incorrectly treats a self redefining closure pattern as a static string array provider, producing:
(() => {})(__STRING_ARRAY__());
instead of preserving the original runtime behavior.

Conclusion
Terser Side-Effect Detection: helps identify hidden side effects removed by minifiers.
Webcrack Deobfuscation Bug: demonstrates how self redefining closure patterns can break when misinterpreted as static arrays.
Both highlight the importance of preserving runtime behavior when working with obfuscated JavaScript.

