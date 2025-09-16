import { id } from "../module.json";

/**
 * The unique module ID string for this module.
 */
export const MODULE_ID = "todo-module-id";
/**
 * The uppercase version of the module ID.
 */
export const UPPER_MODULE_ID = MODULE_ID.toUpperCase();

if (MODULE_ID !== id) throw new Error(`Module ID mismatch: ${MODULE_ID} !== ${id}`);
