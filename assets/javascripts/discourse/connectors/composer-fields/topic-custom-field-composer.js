import Component from "@glimmer/component";
import { action } from "@ember/object";
import { alias } from "@ember/object/computed";
import { service } from "@ember/service";

/*
 * type:        step
 * number:      5
 * title:       Show an input in the composer
 * description: If your field can be edited by users, you need to show an input in the composer.
 * references:  app/assets/javascripts/discourse/app/templates/composer.hbs
 */

export default class TopicCustomFieldComposer extends Component {
  @service siteSettings;
  @alias("siteSettings.topic_custom_field_name") fieldName;
  @alias("args.outletArgs.model") composerModel;
  @alias("composerModel.topic") topic;

  constructor() {
    super(...arguments);

    // If the first post is being edited we need to pass our value from
    // the topic model to the composer model.
    if (
      !this.composerModel[this.fieldName] &&
      this.topic &&
      this.topic[this.fieldName]
    ) {
      this.composerModel.set(this.fieldName, this.topic[this.fieldName]);
    }

    this.fieldValue = this.composerModel.get(this.fieldName);
  }

  @action
  onChangeField(fieldValue) {
    this.composerModel.set(this.fieldName, fieldValue);
  }
}
