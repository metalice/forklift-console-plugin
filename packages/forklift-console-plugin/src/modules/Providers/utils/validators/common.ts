// regex

// validate container images
// example: quay.io/image:latest
const REGISTRY = '(?:[a-z0-9]+([.:_-][a-z0-9]+)*\\/)?';
const IMAGE_NAME = '[a-z0-9]+([._-][a-z0-9]+)*(\\/[a-z0-9]+([._-][a-z0-9]+)*)*';
const TAG = '[a-zA-Z0-9]+([._-][a-zA-Z0-9]+)*';
const SHA256 = 'sha256:[A-Fa-f0-9]{64}';

const IMAGE_REGEX = new RegExp(`^${REGISTRY}?${IMAGE_NAME}((@${SHA256}|:${TAG}))?$`);

// validate URL
// example: https://example.com/index
const PROTOCOL = '(https?:\\/\\/)';
const IPV4 = '((?:[0-9]{1,3}\\.){3}[0-9]{1,3})';
const HOSTNAME = '([a-zA-Z-_]+[a-zA-Z0-9-_]+\\.[a-zA-Z0-9-_\\.]+)';
const PORT = '(:[0-9]+)?';
const PATH = '(\\/[^ ]*)*';
const QUERY_PARAMS = '(\\?[a-zA-Z0-9=&_]*)?';

const URL_REGEX = new RegExp(
  `^${PROTOCOL}((${IPV4})|(${HOSTNAME}))((${PORT})(${PATH})?(${QUERY_PARAMS})?)?$`,
);

// validate CA certification.
const CERTIFICATE_HEADER = '-----BEGIN CERTIFICATE-----';
const CERTIFICATE_FOOTER = '-----END CERTIFICATE-----';
const BASE64_LINE = '([A-Za-z0-9+\\/]{64}\\r?\\n)';
const LAST_BASE64_LINE = '([A-Za-z0-9+\\/=]{1,64}\\r?\\n)?';
const BASE64_CONTENT = `(${BASE64_LINE}*${LAST_BASE64_LINE})`;

const EMPTY_LINES = '((\\#[^\\r\\n]*)?\\s*\\r?\\n)*';

const CERTIFICATE_REGEX = new RegExp(
  `^(${EMPTY_LINES}${CERTIFICATE_HEADER}\\r?\\n${BASE64_CONTENT}${CERTIFICATE_FOOTER}${EMPTY_LINES})+$`,
);

// validate CA certification fingerprint.
const FINGERPRINT_REGEX = /^([a-fA-F0-9]{2}:){19}[a-fA-F0-9]{2}$/;

// validate sub domain names, used in K8s
const DNS_SUBDOMAINS_NAME_REGEXP = /^[a-z][a-z0-9-]{0,251}[a-z0-9]$/;

// validate bearer tokens, used in K8s
const JWT_TOKEN_REGEX = /^([a-zA-Z0-9_=]+)\.([a-zA-Z0-9_=]+)\.([a-zA-Z0-9_\-+/=]*)/gm;
const K8S_TOKEN_REGEX = /^[a-z0-9]{6}.[a-z0-9]{16}$/;

// helper methods

export function validateContainerImage(image: string) {
  return IMAGE_REGEX.test(image);
}

export function validateURL(url: string) {
  return URL_REGEX.test(url);
}

export function validatePublicCert(ca: string) {
  return CERTIFICATE_REGEX.test(ca);
}

export function validateFingerprint(fingerprint: string) {
  return FINGERPRINT_REGEX.test(fingerprint);
}

export function validateK8sName(k8sName: string) {
  return DNS_SUBDOMAINS_NAME_REGEXP.test(k8sName);
}

export function validateK8sToken(token: string) {
  return JWT_TOKEN_REGEX.test(token) || K8S_TOKEN_REGEX.test(token);
}

export function validateNoSpaces(value: string) {
  // any string without spaces
  // max length 128 chars
  return /^[^\s]{1,128}$/.test(value);
}