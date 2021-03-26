function isDefined(value) {
  return value !== null && value !== undefined;
}

function fieldInputTypes(fieldType) {
  return {
    isBoolean: fieldType === 'boolean',
    isString: fieldType === 'string',
    isInteger: fieldType === 'integer',
    isJson: fieldType === 'json'
  }
}

export {
  isDefined,
  fieldInputTypes
}