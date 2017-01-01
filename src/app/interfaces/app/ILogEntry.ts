/**
 * A log entry.
 */
interface ILogEntry {
  id?: string;
  content: string;
  type?: string;
  createdAt?: string;
  component?: string;
};

export {
  ILogEntry
}
