<template>
  <ckeditor
    :editor="editor"
    :value="value"
    :config="editorConfig"
    :tag-name="tagName"
    :disabled="disabled"
    @input="event => $emit('input', event)"
  />
</template>

<script>
import '@ckeditor/ckeditor5-build-classic/build/translations/fr'
import '@ckeditor/ckeditor5-build-classic/build/translations/es'
import '@ckeditor/ckeditor5-build-classic/build/translations/de'
import '@ckeditor/ckeditor5-build-classic/build/translations/nl'

// Import CKEditor and its upload adapter
import CKEditor from '@ckeditor/ckeditor5-vue2'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import MyCustomUploadAdapterPlugin from '../plugins/MyCustomUploadAdapterPlugin' // Assuming you have a custom upload adapter plugin

export default {
  components: {
    ckeditor: CKEditor.component
  },
  props: {
    value: {
      type: String,
      default: ''
    },
    tagName: {
      type: String,
      required: false,
      default: 'div'
    },
    disabled: {
      type: Boolean,
      required: false
    },
    config: {
      type: Object,
      required: false,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      editor: ClassicEditor
    }
  },
  computed: {
    editorConfig () {
      return { ...this.config, extraPlugins: [this.uploader] }
    }
  },
  methods: {
    uploader (editor) {
      editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
        return new MyCustomUploadAdapterPlugin(loader, '/medias/upload')
      }
    }
  }
}
</script>
