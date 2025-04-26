/**
 Copyright (c) 2024 A.S Nasseri
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 *
 * @see https://github.com/nassiry/kando-storage
 */

type ExpirationSeconds = number | null;
type Storable = string | number | boolean | object | null;

/**
 * Sets, gets, or deletes values in localStorage or sessionStorage.
 *
 * - Get: `const value = kando<T>('local.key.path')`
 * - Set: `kando('local.key.path', value)`
 * - Delete: `kando('local.key.path', null)`
 * - Set with expiration (session): `kando('session.key.path', value, 60)`
 *
 * @param typePath A string like "local.user.name"
 * @param data Optional value to set. If omitted, gets the value. If null, deletes it.
 * @param expiration Optional expiration in seconds (only for sessionStorage).
 */
declare function kando<T = unknown>(
    typePath: string,
    data?: Storable,
    expiration?: ExpirationSeconds,
): T | undefined;


export = kando;
export as namespace kando;
