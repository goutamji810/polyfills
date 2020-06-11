/**
 * @license
 * Copyright (c) 2020 The Polymer Project Authors. All rights reserved. This
 * code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt The complete set of authors may be
 * found at http://polymer.github.io/AUTHORS.txt The complete set of
 * contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt Code
 * distributed by Google as part of the polymer project is also subject to an
 * additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

import {constructor as FormDataConstructor, prototype as FormDataPrototype} from '../Environment/FormData.js';
import {dispatchEvent} from '../EnvironmentAPI/EventTarget.js';
import {FormDataEvent} from '../FormDataEvent.js';

export const install = () => {
  const FormDataWrapper = function FormData(this: FormData, form?: HTMLFormElement) {
    const _this = new FormDataConstructor(form);
    Object.setPrototypeOf(_this, Object.getPrototypeOf(this));

    if (form instanceof HTMLFormElement) {
      dispatchEvent.call(form, new FormDataEvent('formdata', {
        bubbles: true,
        formData: _this,
      }));
    }

    return _this;
  };

  for (const prop of Object.keys(FormDataConstructor)) {
    Object.defineProperty(FormDataWrapper, prop,
        Object.getOwnPropertyDescriptor(FormDataConstructor, prop) as PropertyDescriptor);
  }
  FormDataWrapper.prototype = FormDataPrototype;
  FormDataWrapper.prototype.constructor = FormDataWrapper;

  (window.FormData as any) = FormDataWrapper;
};
