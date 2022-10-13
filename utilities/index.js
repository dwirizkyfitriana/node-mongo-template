export default {
    generateCommonResponse: function (responseCode, responseStatus, responseData) {
        const response = {}
        response.httpStatus = responseCode,
        response.status = responseStatus
        if (responseStatus === 'failed') response.errorDetails = responseData
        else response.responseData = responseData

        return response
    }
}