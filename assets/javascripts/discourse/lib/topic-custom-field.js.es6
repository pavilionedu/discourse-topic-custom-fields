/* 
 * type:        example
 * description: Change these constants, and the same constants on the server, to
 *              change the field name and type.
 * references:  plugins/discourse-topic-custom-fields/plugin.rb
 */
const FIELD_NAME = 'price';
const FIELD_TYPE = 'integer';
const FIELD_INPUT_TYPE = {
  string: 'text',
  boolean: 'checkbox',
  integer: 'number',
  json: 'text'
}[FIELD_TYPE];

export {
  FIELD_NAME,
  FIELD_TYPE,
  FIELD_INPUT_TYPE
}