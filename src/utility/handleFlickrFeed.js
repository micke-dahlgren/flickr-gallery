
function extractPropertyValues(arr, key){
    let ret = [];
    arr.forEach(itm => {
        ret.push(itm[key]);
    })
    return ret;
}


function isArray(obj) {
    return !!obj && obj.constructor === Array;
}


export function validFlickrFeed(data) {
    if (!data.hasOwnProperty('items') || !isArray(data?.items)) {
        return false;
    }
    return true;
}


export function handleFlickrFeed(data, prevData) {
    if(data.length === 0){
        return data;
    }
    // sort data so that most recently published image is first in the array
    data.sort((a, b) => new Date(a.published) - new Date(b.published));

    if (data.length !== prevData.length) {
        return data;
    }

    /*
    flickr image object does unfortunately not contain id values,
    Solution: Use the image url as a unique identifier
    */
    // image url located in item.media.m
    let dataIdValue = extractPropertyValues(extractPropertyValues(data, 'media'), 'm');
    let prevDataIdValue = extractPropertyValues(extractPropertyValues(prevData, 'media'), 'm');

    // Get ids that are not in previous data set
    let differenceIdValues = [];
    dataIdValue.forEach(val => {
        if (!prevDataIdValue.includes(val)) {
            differenceIdValues.push(val);
        }
    })
    if (differenceIdValues.length <= 0) {
        return null;
    }

    return data;
}
