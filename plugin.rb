# frozen_string_literal: true

# name: discourse-topic-custom-fields
# about: Discourse plugin showing how to add custom fields to Discourse topics
# version: 1.0
# authors: Angus McLeod
# contact email: angus@thepavilion.io
# url: https://github.com/pavilionedu/discourse-topic-custom-fields

enabled_site_setting :topic_custom_field_enabled
register_asset 'stylesheets/common.scss'

## 
# type:        introduction
# title:       Add a custom field to a topic
# description: This discourse plugin shows how to add a custom field to a topic.
#              Use the example below to easily create your own field, or follow
#              the steps to learn how it works. If you want to learn more about
#              how each step works, follow the links in the "References" section
#              of each step.
##

## 
# type:        example
# description: Change these constants, and the same constants in client, to
#              change the field name and type. The name must not contain spaces
#              and the type can be 'string', 'integer', 'boolean' or 'json'.
# references:  plugins/discourse-topic-custom-fields/assets/javascripts/discourse/lib/topic-custom-field.js.es6
##
FIELD_NAME ||= 'price'
FIELD_TYPE ||= 'integer'

after_initialize do
  
  ## 
  # type:        step
  # number:      1
  # title:       Register the field
  # description: Where we tell discourse what kind of field we're adding.
  ##
  
  ##
  # type:        step
  # number:      1.1
  # title:       Register the data type
  # description: You can register a string, integer, boolean or json field.
  # references:  lib/plugins/instance.rb,
  #              app/models/concerns/has_custom_fields.rb
  ##
  register_topic_custom_field_type(FIELD_NAME, FIELD_TYPE.to_sym)
  
  ##
  # type:        step
  # number:      2
  # title:       Add getter and setter methods
  # description: Adding getter and setter methods is optional, but advisable.
  #              It means you can handle data validation or normalisation, and
  #              it lets you easily change where you're storing the data.
  ##
  
  ##
  # type:        step
  # number:      2.1
  # title:       Getter method
  # references:  lib/plugins/instance.rb,
  #              app/models/topic.rb,
  #              app/models/concerns/has_custom_fields.rb
  ##
  add_to_class(:topic, FIELD_NAME.to_sym) do
    if !custom_fields[FIELD_NAME].nil?
      custom_fields[FIELD_NAME]
    else
      nil
    end
  end
  
  ##
  # type:        step
  # number:      2.2
  # title:       Setter method
  # references:  lib/plugins/instance.rb,
  #              app/models/topic.rb,
  #              app/models/concerns/has_custom_fields.rb
  ##
  add_to_class(:topic, "#{FIELD_NAME}=") do |value|
    custom_fields[FIELD_NAME] = value
  end
  
  ##
  # type:        step
  # number:      3
  # title:       Update the field when the topic is created or updated
  # description: Topic creation is contingent on post creation. This means alot
  #              of the topic CRUD methods are associated with the same classes
  #              that handle post CRUD.
  ##
  
  ##
  # type:        step
  # number:      3.1
  # title:       Update on topic creation
  # description: Here we're using an event callback to update the field after the
  #              first post in the topic, and the topic itself, is created.
  # referencess: lib/plugins/instance.rb,
  #              lib/post_creator.rb
  ##
  on(:topic_created) do |topic, opts, user|
    topic.send("#{FIELD_NAME}=".to_sym, opts[FIELD_NAME.to_sym])
    topic.save!
  end
  
  ## 
  # type:        step
  # number:      3.2
  # title:       Update on topic edit
  # description: Update the field when it's updated in the composer when editing
  #              the first post in the topic, or in the topic title edit view.
  # references:  lib/plugins/instance.rb,
  #              lib/post_revisor.rb
  ##
  PostRevisor.track_topic_field(FIELD_NAME.to_sym) do |tc, value|
    tc.record_change(FIELD_NAME, tc.topic.send(FIELD_NAME), value)
    tc.topic.send("#{FIELD_NAME}=".to_sym, value.present? ? value : nil)
  end

  ##
  # type:        step
  # number:      4
  # title:       Serialize the field
  # description: Send our field to the client, along with the other topic fields.
  # references:  lib/plugins/instance.rb,
  #              lib/topic_view.rb,
  #              app/serializers/topic_view_serializer.rb
  ##
  
  ## 
  # type:        step
  # number:      4.1
  # title:       Serialize to the topic
  # description: Send your field to the topic.
  # references:  lib/plugins/instance.rb,
  #              app/serializers/topic_view_serializer.rb
  ##
  add_to_serializer(:topic_view, FIELD_NAME.to_sym) do
    object.topic.send(FIELD_NAME)
  end
  
  ## 
  # type:        step
  # number:      4.2
  # title:       Serialize to the topic list
  # description: Send your field to the topic list.
  # references:  lib/plugins/instance.rb,
  #              app/serializers/topic_list_item_serializer.rb
  ##
  add_to_serializer(:topic_list_item, FIELD_NAME.to_sym) do
    object.send(FIELD_NAME)
  end
end