/**
 * This file used to hold a second copy of the whole Express app, including a
 * duplicate PDF reader with the same resolution bug that broke the deployed
 * build. Two copies of the app is a trap: fixing one leaves the other broken,
 * and it is not obvious which one a request reached.
 *
 * The app now lives in exactly one place, ../server.js. This stub is kept only
 * so an existing import of src/server.js fails loudly instead of silently
 * attaching an unhandled "start()". It can be deleted once nothing references it.
 */
export { default } from "../server.js";
