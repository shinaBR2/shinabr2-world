/**
 * Human-readable title for your website
 */
const RP_NAME = 'SWorld';
/**
 * A unique identifier for your website. 'localhost' is okay for
 * local dev
 */
const RP_ID = 'localhost';
/**
 * The URL at which registrations and authentications should occur.
 * 'http://localhost' and 'http://localhost:PORT' are also valid.
 * Do NOT include any trailing /
 */
const ORIGIN = `http://${RP_ID}`;

export { RP_ID, RP_NAME, ORIGIN };
