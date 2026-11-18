/** Convert Mongoose documents (or anything with Date/ObjectId) into plain JSON-safe objects. */
export function toPlain<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

/** Today's date as a YYYY-MM-DD string in the user's server timezone. */
export function todayString(): string {
  const d = new Date();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${month}-${day}`;
}
