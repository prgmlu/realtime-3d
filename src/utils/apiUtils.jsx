export const S3Bucket = Object.freeze({
	DEV: 'obsess-cms-dev',
	BETA: 'obsess-cms-beta',
	PROD: 'obsess-cms-prod',
});

const UrlOriginEnum = Object.freeze({
	S3: 's3',
	External: 'external',
	CDN: 'cdn',
});

const OriginUrlPrefixDict = {
	[UrlOriginEnum.S3]: 'https://s3.amazonaws.com/',
	[UrlOriginEnum.CDN]: 'https://cdn.obsess-vr.com/',
};

export function getCurrentBucket() {
	return S3Bucket.BETA;
}

export function formURL(urlObject) {
	let url = '';
	if (urlObject) {
		const { origin, path } = urlObject;
		switch (origin) {
			// case UrlOriginEnum.CDN:
			//     url = OriginUrlPrefixDict[UrlOriginEnum.CDN] + getCurrentBucket() + '/' + path;
			//     break;
			case UrlOriginEnum.S3:
			case UrlOriginEnum.CDN:
				url = `${
					OriginUrlPrefixDict[UrlOriginEnum.CDN]
				}${getCurrentBucket()}/${path}`.replace(/'/g, '%27');
				break;
			case UrlOriginEnum.External:
				url = path;
				break;
			default:
				url = path;
				break;
		}
	}
	return url;
}
