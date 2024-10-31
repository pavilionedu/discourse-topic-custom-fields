import { alias } from "@ember/object/computed";
import { withPluginApi } from "discourse/lib/plugin-api";
import discourseComputed from "discourse-common/utils/decorators";

export default {
  name: "topic-custom-field-intializer",
  initialize(container) {
    const siteSettings = container.lookup("site-settings:main");
    const fieldName = siteSettings.topic_custom_field_name;

    withPluginApi("1.37.3", (api) => {
      /* For step 5 see connectors/composer-fields/topic-custom-field-composer.js */
      /* For step 6 see connectors/edit-topic/topic-custom-field-edit-topic.js */

      /*
       * type:        step
       * number:      7
       * title:       Serialize your field to the server
       * description: Send your field along with the post and topic data saved
       *              by the user when creating a new topic, saving a draft, or
       *              editing the first post of an existing topic.
       * references:  discourse/app/lib/plugin-api.js,
       *              discourse/app/models/composer.js
       */
      api.serializeOnCreate(fieldName);
      api.serializeToDraft(fieldName);
      api.serializeToTopic(fieldName, `topic.${fieldName}`);

      /* For step 8 see connectors/topic-title/topic-custom-field-topic-title.js */

      /*
       * type:        step
       * number:      9
       * title:       Setup the topic list item component
       * description: Setup the properties you'll need in the topic list item
       *              template.
       * references:  discourse/app/components/topic-list-item.js,
       */
      api.modifyClass("component:topic-list-item", {
        pluginId: "topic-custom-field",
        customFieldName: fieldName,
        customFieldValue: alias(`topic.${fieldName}`),

        @discourseComputed("customFieldValue")
        showCustomField: (value) => !!value,
      });

      /*
       * type:        step
       * number:      10
       * title:       Render the value in the topic list after title plugin
       *              outlet
       * description: Render the value of the custom topic field in the topic
       *              list, after the topic title.
       * location:    connectors/topic-list-after-title/topic-custom-field-topic-list-after-title.hbr
       */
    });
  },
};
