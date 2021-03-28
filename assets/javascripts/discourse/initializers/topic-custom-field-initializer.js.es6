import { withPluginApi } from 'discourse/lib/plugin-api';
import discourseComputed from "discourse-common/utils/decorators";
import { alias } from '@ember/object/computed';
import { isDefined, fieldInputTypes } from '../lib/topic-custom-field';

export default {
  name: "topic-custom-field-intializer",
  initialize(container) {
    const siteSettings = container.lookup('site-settings:main');
    const fieldName = siteSettings.topic_custom_field_name;
    const fieldType = siteSettings.topic_custom_field_type;
    
    withPluginApi('0.11.2', api => {
      
      /*
       * type:        step
       * number:      5
       * title:       Show an input in the composer
       * description: If your field can be created or edited by users, you need
       *              to show an input in the composer.
       * references:  app/assets/javascripts/discourse/app/templates/composer.hbs,
       *              app/assets/javascripts/discourse/app/components/plugin-outlet.js.es6
       */
      
      /*
       * type:        step
       * number:      5.1
       * title:       Setup the composer connector class
       * description: Set the actions and properties you'll need in the
       *              composer connector template.
       * references:  app/assets/javascripts/discourse/app/components/plugin-outlet.js.es6
       */
      api.registerConnectorClass('composer-fields', 'composer-topic-custom-field-container', {
        setupComponent(attrs, component) {
          const model = attrs.model;
          
          // If the first post is being edited we need to pass our value from
          // the topic model to the composer model.
          if (!isDefined(model[fieldName]) && model.topic && model.topic[fieldName]) {
            model.set(fieldName, model.topic[fieldName]);
          }
          
          let props = {
            fieldName: fieldName,
            fieldValue: model.get(fieldName)
          }
          component.setProperties(Object.assign(props, fieldInputTypes(fieldType)));
        },
        
        actions: {
          onChangeField(fieldValue) {
            this.set(`model.${fieldName}`, fieldValue);
          }
        }
      });
      
      /*
       * type:        step
       * number:      5.2
       * title:       Render an input in the composer
       * description: Render an input where the user can edit your field in the
       *              composer.
       * location:    plugins/discourse-topic-custom-fields/assets/javascripts/discourse/connectors/composer-fields/composer-topic-custom-field-container.hbs
       * references:  app/assets/javascripts/discourse/app/templates/composer.hbs
       */
      
      /*
       * type:        step
       * number:      6
       * title:       Show an input in topic title edit
       * description: If your field can be edited by the topic creator or
       *              staff, you may want to let them do this in the topic
       *              title edit view.
       * references:  app/assets/javascripts/discourse/app/templates/topic.hbs,
       *              app/assets/javascripts/discourse/app/components/plugin-outlet.js.es6
       */
      
      /*
       * type:        step
       * number:      6.1
       * title:       Setup the edit topic connector class
       * description: Set the actions and properties you'll need in the edit
       *              topic connector template.
       * references:  app/assets/javascripts/discourse/app/components/plugin-outlet.js.es6
       */
      api.registerConnectorClass('edit-topic', 'edit-topic-custom-field-container', {
        setupComponent(attrs, component) {
          const model = attrs.model;
          
          let props = {
            fieldName: fieldName,
            fieldValue: model.get(fieldName)
          }
          component.setProperties(Object.assign(props, fieldInputTypes(fieldType)));
        },
        
        actions: {
          onChangeField(fieldValue) {
            this.set(`buffered.${fieldName}`, fieldValue);
          }
        }
      });
      
      /*
       * type:        step
       * number:      6.2
       * title:       Render an input in topic edit
       * description: Render an input where the user can edit your field in
       *              topic edit.
       * location:    plugins/discourse-topic-custom-fields/assets/javascripts/discourse/connectors/edit-topic/edit-topic-custom-field-container.hbs
       * references:  app/assets/javascripts/discourse/app/templates/topic.hbs
       */
         
      /*
       * type:        step
       * number:      7
       * title:       Serialize your field to the server
       * description: Send your field along with the post and topic data saved
       *              by the user when creating a new topic, saving a draft, or
       *              editing the first post of an existing topic.
       * references:  app/assets/javascripts/discourse/app/lib/plugin-api.js.es6,
       *              app/assets/javascripts/discourse/app/models/composer.js.es6
       */
      api.serializeOnCreate(fieldName);
      api.serializeToDraft(fieldName);
      api.serializeToTopic(fieldName, `topic.${fieldName}`);
      
      /*
       * type:        step
       * number:      8
       * title:       Display your field value
       * description: Display the value of your custom topic field below the 
       *              title in the topic, and after the title in the topic
       *              list.
       */
      
      /*
       * type:        step
       * number:      8.1
       * title:       Setup the topic title connector component
       * description: Set the actions and properties you'll need in the topic
       *              title
       *              connector template.
       * references:  app/assets/javascripts/discourse/app/components/plugin-outlet.js.es6
       */
      api.registerConnectorClass('topic-title', 'topic-title-custom-field-container', {
        setupComponent(attrs, component) {
          const model = attrs.model;
          const controller = container.lookup('controller:topic');
          
          component.setProperties({
            fieldName: fieldName,
            fieldValue: model.get(fieldName),
            showField: !controller.get('editingTopic') && isDefined(model.get(fieldName))
          });

          controller.addObserver('editingTopic', () => {
            if (this._state === 'destroying') return;
            component.set('showField', !controller.get('editingTopic') && isDefined(model.get(fieldName)));
          });
          
          model.addObserver(fieldName, () => {
            if (this._state === 'destroying') return;
            component.set('fieldValue', model.get(fieldName));
          });
        }
      });
      
      /*
       * type:        step
       * number:      8.2
       * title:       Render the value in the topic title plugin outlet
       * description: Render the value of the custom topic field under the
       *              topic title, unless the topic title is currently being
       *              edited.
       * location:    plugins/discourse-topic-custom-fields/assets/javascripts/discourse/connectors/topic-title/topic-title-custom-field-container.hbs
       * references:  app/assets/javascripts/discourse/app/templates/topic.hbs
       */
      
      /*
       * type:        step
       * number:      8.3
       * title:       Setup the topic list item component
       * description: Setup the properties you'll need in the topic list item
       *              template. You can't do this in a connector js file, as
       *              the topic list item is a raw template, which doesn't
       *              support js.
       * references:  app/assets/javascripts/discourse/app/components/topic-list-item.js.es6,
       *              app/assets/javascripts/discourse/app/helpers/raw-plugin-outlet.js.es6
       */
      api.modifyClass('component:topic-list-item', {
        customFieldName: fieldName,
        customFieldValue: alias(`topic.${fieldName}`),

        @discourseComputed('customFieldValue')
        showCustomField: (value) => (isDefined(value))
      });
      
      /*
       * type:        step
       * number:      8.4
       * title:       Render the value in the topic list after title plugin
       *              outlet
       * description: Render the value of the custom topic field in the topic
       *              list, after the topic title.
       * location:    plugins/discourse-topic-custom-fields/assets/javascripts/discourse/connectors/topic-list-after-title/topic-list-after-title-custom-field-container.hbr
       * references:  app/assets/javascripts/discourse/app/templates/list/topic-list-item.hbr
       */
    });
  }
}