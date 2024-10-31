import Component from "@glimmer/component";
import { Input, Textarea } from "@ember/component";
import { on } from "@ember/modifier";
import { readOnly } from "@ember/object/computed";
import { service } from "@ember/service";
import { eq } from "truth-helpers";
import i18n from "discourse-common/helpers/i18n";

export default class TopicCustomFieldInput extends Component {
  @service siteSettings;
  @readOnly("siteSettings.topic_custom_field_name") fieldName;
  @readOnly("siteSettings.topic_custom_field_type") fieldType;

  <template>
    {{#if (eq this.fieldType "boolean")}}
      <Input
        @type="checkbox"
        @checked={{@fieldValue}}
        {{on "change" (action @onChangeField value="target.checked")}}
      />
      <span>{{this.fieldName}}</span>
    {{/if}}

    {{#if (eq this.fieldType "integer")}}
      <Input
        @type="number"
        @value={{@fieldValue}}
        placeholder={{i18n
          "topic_custom_field.placeholder"
          field=this.fieldName
        }}
        class="topic-custom-field-input small"
        {{on "change" (action @onChangeField value="target.value")}}
      />
    {{/if}}

    {{#if (eq this.fieldType "string")}}
      <Input
        @type="text"
        @value={{@fieldValue}}
        placeholder={{i18n
          "topic_custom_field.placeholder"
          field=this.fieldName
        }}
        class="topic-custom-field-input large"
        {{on "change" (action @onChangeField value="target.value")}}
      />
    {{/if}}

    {{#if (eq this.fieldType "json")}}
      <Textarea
        @value={{@fieldValue}}
        {{on "change" (action @onChangeField value="target.value")}}
        placeholder={{i18n
          "topic_custom_field.placeholder"
          field=this.fieldName
        }}
        class="topic-custom-field-textarea"
      />
    {{/if}}
  </template>
}
