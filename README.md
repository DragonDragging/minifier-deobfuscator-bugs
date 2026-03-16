# Terser Side-Effect Detection

This snippet detects whether a JavaScript minifier (e.g. **Terser**) removed an expression it considers "unused".

It relies on a **side effect inside `Symbol.toPrimitive`**.
When the object is used in an arithmetic operation (`breakingObject * 2`), JavaScript must convert it to a number, triggering `Symbol.toPrimitive`.

If the minifier removes the expression:

```
breakingObject * 2
```

the conversion never happens and the side effect is skipped.

## Result
wrong call

## Idea
Minifiers sometimes remove expressions whose results are unused, even if they contain hidden side effects through implicit conversions.
