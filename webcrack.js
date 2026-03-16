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
