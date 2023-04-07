/* eslint-disable no-extend-native */
/**
 * string extensions
 */
export {};
declare global {
	interface String {
		capitalizeFirstLetter(): string;
	}
}

String.prototype.capitalizeFirstLetter = function capitalize() {
	return this.charAt(0).toUpperCase() + this.slice(1);
};
