type CookieObject = {
    [key: string] : string
}

// Function for parsing cookie header into js object
export const parseCookie = async (cookieString: string) : Promise<CookieObject> => {

    const cookieObject = cookieString.split(";").reduce((obj, curr) => {

        const [name, value] = curr.split("=");

        return {
            ...obj,
            [name] : value
        }

    }, {} as CookieObject);

    return cookieObject;

}