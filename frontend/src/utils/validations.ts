export const normalizeNumber = (str: string): string => {
    return str
        .replace(/[０-９．]/g, (s) =>
            String.fromCharCode(s.charCodeAt(0) - 0xfee0),
        )
        .replace(/[。]/g, ".")
        .replace(/[^0-9.]/g, "")
        .replace(/(\..*)\./g, "$1");
};
