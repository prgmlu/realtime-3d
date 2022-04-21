import { constructUrl as modulesUrlConstructor } from '../wsm/UrlConstructor'

const variables = require('../../variables/Variables.js');

export function constructUrl(urlObject) {
    return modulesUrlConstructor(urlObject, variables.s3Bucket)
}
