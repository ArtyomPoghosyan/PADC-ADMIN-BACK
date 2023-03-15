import { ValidationError } from '@nestjs/common';
import { forEach, isEmpty } from 'lodash';

/**
 * @Description Handle validation errors and return error message
 * @param errors
 * @constructor
 */
export function ErrorHandler(errors: ValidationError[]): any {
  const message = {};
  const errs = [];

  forEach(errors, (e) => {
    const constraints = isEmpty(e.constraints)
      ? findChildConstraints(e.children)
      : e.constraints;
    const property = e.property;

    if (!message[property]) message[property] = [];

    const constraintKeys = Object.keys(constraints);
    for (const item of constraintKeys) {
      errs.push(constraints[item]);
      message[e.property].push({
        key: `ERROR_${item.toUpperCase()}`,
        message: constraints[item],
      });
    }
  });

  return errs;
}

function findChildConstraints(
  errors: (string | { [key: string]: any })[],
): any {
  let child = {};

  for (let i = 0; i < errors.length; i++) {
    const error = errors[i] as ValidationError;
    if (!isEmpty(error.constraints)) {
      child = { ...child, ...error.constraints };
    } else if (error.children.length) {
      return findChildConstraints(error.children);
    }
  }

  return child;
}
