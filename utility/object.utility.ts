export const getObjectKeys = async (object: Object) :Promise<string[]> => {

    const keys = Object.keys(object).map((key) => key);

    return keys

}