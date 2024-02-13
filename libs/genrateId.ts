const generateId = ():string => {
    const timestamp = Date.now();
    return timestamp.toString(16);
}

export default generateId