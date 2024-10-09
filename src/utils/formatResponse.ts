function formatResponse(resultObj: any): any[] {
    const result: any[] = [];
    if (resultObj.records.length > 0) {
        resultObj.records.forEach((record: any) => {
            result.push(record._fields[0].properties);
        });
    }
    return result;
}

export default formatResponse;