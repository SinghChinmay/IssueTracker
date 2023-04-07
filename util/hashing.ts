import crypto from 'crypto';
/**
 * Hashes a string using the SHA-256 algorithm.
 *
 * @param {string} str The string to hash.
 *
 * @returns {string} The hashed string.
 * console.log(hash('hello world'));
 */
const hash = (str: string): string => crypto.createHash('sha256').update(str).digest('hex');

/**
 * Compares a string to a hashed string.
 *
 * @param {string | undefined} str The string to compare.
 * @param {string | undefined} dbValue The hashed string to compare to.
 *
 * @returns {boolean} Whether the string matches the hashed string.
 * console.log(compareHash('hello world', hash('hello world')));
 */
const compareHash = (str: string | undefined, dbValue: string | undefined): boolean => {
	if (str === undefined || dbValue === undefined) {
		return false;
	}

	return hash(str) === dbValue;
};

export { hash, compareHash };
