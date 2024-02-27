export function handleError(err) {
    let errorMessages = [];

    const { response, message } = err;
    
    if (response) {
        const { errors, message } = response.data;
    
        if (errors) {
            errorMessages = Object.values(errors).flat();
        } else {
            errorMessages.push(message);
        }
    } else {
        errorMessages.push(message);
    }

    return errorMessages;
}