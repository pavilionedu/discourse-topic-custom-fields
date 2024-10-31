import Component from "@glimmer/component";
import { inject as controller } from "@ember/controller";
import { alias } from "@ember/object/computed";
import { service } from "@ember/service";

/*
 * type:        step
 * number:      8
 * title:       Display your field value in the topic
 * description: Display the value of your custom topic field below the
 *              title in the topic
 *              list.
 */

export default class TopicCustomFieldTopicTitle extends Component {
  @service siteSettings;
  @controller topic;
  @alias("siteSettings.topic_custom_field_name") fieldName;

  get fieldValue() {
    return this.args.outletArgs.model.get(this.fieldName);
  }
}
