/* tslint:disable */
/* eslint-disable */
/**
 * KubeVirt API
 * This is KubeVirt API an add-on for Kubernetes.
 *
 * The version of the OpenAPI document: 1.0.0
 * Contact: kubevirt-dev@googlegroups.com
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import { exists, mapValues } from '../../runtime';
/**
 * 
 * @export
 * @interface V1FeatureSpinlocks
 */
export interface V1FeatureSpinlocks {
    /**
     * Enabled determines if the feature should be enabled or disabled on the guest. Defaults to true.
     * @type {boolean}
     * @memberof V1FeatureSpinlocks
     */
    enabled?: boolean;
    /**
     * Retries indicates the number of retries. Must be a value greater or equal 4096. Defaults to 4096.
     * @type {number}
     * @memberof V1FeatureSpinlocks
     */
    spinlocks?: number;
}

/**
 * Check if a given object implements the V1FeatureSpinlocks interface.
 */
export function instanceOfV1FeatureSpinlocks(value: object): boolean {
    let isInstance = true;

    return isInstance;
}

export function V1FeatureSpinlocksFromJSON(json: any): V1FeatureSpinlocks {
    return V1FeatureSpinlocksFromJSONTyped(json, false);
}

export function V1FeatureSpinlocksFromJSONTyped(json: any, ignoreDiscriminator: boolean): V1FeatureSpinlocks {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'enabled': !exists(json, 'enabled') ? undefined : json['enabled'],
        'spinlocks': !exists(json, 'spinlocks') ? undefined : json['spinlocks'],
    };
}

export function V1FeatureSpinlocksToJSON(value?: V1FeatureSpinlocks | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'enabled': value.enabled,
        'spinlocks': value.spinlocks,
    };
}
