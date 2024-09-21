type CookieObject = {
    [key: string] : string
}

// Function for parsing cookie header into js object
export const parseCookie = async (cookieString: string) : Promise<CookieObject> => {

    const cookieObject = cookieString.split(";").reduce((obj, curr) => {

        const [name, value] = curr.split("=");
        const nameWithoutSpaces = name.replace(/\s+/g, '');
        const valueWithoutSpaces = value.replace(/\s+/g, '');

        return {
            ...obj,
            [nameWithoutSpaces] : valueWithoutSpaces
        }

    }, {} as CookieObject);

    return cookieObject;

}