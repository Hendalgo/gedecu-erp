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
        const splittedMessages = message.split(";");

        if (splittedMessages.length > 0) {
            errorMessages = splittedMessages;
        } else {
            errorMessages.push(message);
        }
    }

    return errorMessages;
}