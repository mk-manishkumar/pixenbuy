/**
 * Wraps an async route handler to catch errors and pass them to next().
 * Eliminates the need for try-catch blocks in every controller.
 *
 * Usage:
 *   const handler = asyncHandler(async (req, res) => {
 *     const data = await someAsyncOp();
 *     res.json(data);
 *   });
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

export default asyncHandler;
