<template>
  <UCard :ui="{ 
    divide: 'dark:divide-black/40',
    header: { padding: 'py-2 sm:py-2 px-4 sm:px-4'},
    body: { padding: 'p-4 sm:p-4'}
  }">
    <template #header>
      <UiFlex v-if="editor" justify="center" class="gap-1" wrap>
        <UButtonGroup>
          <UButton
            @click="editor.chain().focus().undo().run()"
            :disabled="!editor.can().chain().focus().undo().run()"
            color="gray"
            icon="i-bx-undo" square
          />
          <UButton
            @click="editor.chain().focus().redo().run()"
            :disabled="!editor.can().chain().focus().redo().run()"
            color="gray"
            icon="i-bx-redo" square
          />
        </UButtonGroup>

        <UButtonGroup>
          <UButton
            @click="editor.chain().focus().toggleBold().run()"
            :disabled="!editor.can().chain().focus().toggleBold().run()"
            :color="editor.isActive('bold') ? 'primary' : 'gray'"
            icon="i-bx-bold" square
          />

          <UButton
            @click="editor.chain().focus().toggleItalic().run()"
            :disabled="!editor.can().chain().focus().toggleItalic().run()"
            :color="editor.isActive('italic') ? 'primary' : 'gray'"
            icon="i-bx-italic" square
          />

          <UButton
            @click="editor.chain().focus().toggleStrike().run()"
            :disabled="!editor.can().chain().focus().toggleStrike().run()"
            :color="editor.isActive('strike') ? 'primary' : 'gray'"
            icon="i-bx-strikethrough" square
          />
        </UButtonGroup>

        <UButtonGroup>
          <UButton
            @click="editor.chain().focus().toggleHeading({ level: 1 }).run()"
            :color="editor.isActive('heading', { level: 1 }) ? 'primary' : 'gray'"
            square
          >H1</UButton>

          <UButton
            @click="editor.chain().focus().toggleHeading({ level: 2 }).run()"
            :color="editor.isActive('heading', { level: 2 }) ? 'primary' : 'gray'"
            square
          >H2</UButton>

          <UButton
            @click="editor.chain().focus().toggleHeading({ level: 3 }).run()"
            :color="editor.isActive('heading', { level: 3 }) ? 'primary' : 'gray'"
            square
          >H3</UButton>
        </UButtonGroup>

        <UButtonGroup>
          <UButton
            @click="editor.chain().focus().toggleBulletList().run()"
            :color="editor.isActive('bulletList') ? 'primary' : 'gray'"
            icon="i-bx-list-ul" square
          />

          <UButton
            @click="editor.chain().focus().toggleOrderedList().run()"
            :color="editor.isActive('orderedList') ? 'primary' : 'gray'"
            icon="i-bx-list-ol" square
          />
        </UButtonGroup>

        <UButtonGroup>
          <UButton
            @click="editor.chain().focus().setTextAlign('left').run()"
            :color="editor.isActive({ textAlign: 'left' }) ? 'primary' : 'gray'"
            icon="i-bx-align-left" square
          />
          <UButton
            @click="editor.chain().focus().setTextAlign('center').run()"
            :color="editor.isActive({ textAlign: 'center' }) ? 'primary' : 'gray'"
            icon="i-bx-align-middle" square
          />
          <UButton
            @click="editor.chain().focus().setTextAlign('right').run()"
            :color="editor.isActive({ textAlign: 'right' }) ? 'primary' : 'gray'"
            icon="i-bx-align-right" square
          />
          <UButton
            @click="editor.chain().focus().setTextAlign('justify').run()"
            :color="editor.isActive({ textAlign: 'justify' }) ? 'primary' : 'gray'"
            icon="i-bx-align-justify" square
          />
        </UButtonGroup>

        <UButtonGroup>
          <UButton
            @click="editor.chain().focus().insertTable({ rows: 2, cols: 2, withHeaderRow: true }).run()"
            icon="i-bx-table" color="gray" square
          />

          <UButton
            @click="editor.chain().focus().addColumnBefore().run()"
            icon="i-fluent-table-column-resize-24-regular" color="gray" square
          />
          <UButton
            @click="editor.chain().focus().addRowBefore().run()"
            icon="i-fluent-table-row-resize-24-regular" color="gray" square
          />

          <UButton
            @click="editor.chain().focus().deleteTable().run()"
            icon="i-bx-trash" color="gray" square
          />
        </UButtonGroup>

        <UButtonGroup>
          <UButton
            @click="setLink"
            :color="editor.isActive('link') ? 'primary' : 'gray'"
            icon="i-bx-link"
            square
          />
          <UButton
            @click="editor.chain().focus().unsetLink().run()"
            :disabled="!editor.isActive('link')"
            icon="i-bx-unlink"
            square
            color="gray"
          />
        </UButtonGroup>

        <UButtonGroup>
          <UiUploadImage v-model="image" class="h-[32px]">
            <template #default="{ select }">
              <UButton @click="select" color="gray" icon="i-bx-image" square />
            </template>
          </UiUploadImage>
          
          <UButton @click="addYoutube" color="gray" icon="i-bx-video" square/>
        </UButtonGroup>

        <UButton
          @click="editor.chain().focus().toggleBlockquote().run()"
          icon="i-bx-square-rounded" square
          :color="editor.isActive('blockquote') ? 'primary' : 'gray'"
        />

        <UButton
          @click="editor.chain().focus().setHorizontalRule().run()"
          icon="i-bx-minus" square
          color="gray"
        />

        <UButton
          @click="editor.commands.clearContent(true)"
          icon="i-bx-trash" square
          color="gray"
        />
      </UiFlex>
    </template>

    <template #default>
      <div :class="{
        'HideScroll overflow-y-auto': !noScroll
      }" :style="{
        maxHeight: max || '70vh'
      }">
        <TiptapEditorContent :editor="editor" class="tiptap" />
      </div>
    </template>
  </UCard>
</template>

<script setup>
const props = defineProps(['modelValue', 'max', 'noScroll'])
const emits = defineEmits(['update:modelValue'])

const editor = useEditor({
  content: props.modelValue,
  extensions: [
    TiptapStarterKit.configure({
      table: false,
    }),
    TiptapImage, 
    TiptapYoutube,
    TiptapHardBreak.extend({
      addKeyboardShortcuts () {
        return {
          'Shift-Enter': () => editor.value.commands.setHardBreak()
        }
      }
    }),
    TiptapTextAlign.configure({
      types: ['heading', 'paragraph']
    }),
    TiptapLink.configure({
      HTMLAttributes: {
        rel: 'noopener noreferrer',
        target: '_blank'
      }, 
      openOnClick: false,
    }),
    TiptapTable.configure({
      resizable: true,
    }),
    TiptapTableRow,
    TiptapTableHeader,
    TiptapTableCell,
  ],
  onUpdate: ({ editor }) => {
    emits('update:modelValue', editor.getHTML())
  }
})

const image = ref(null)
watch(() => image.value, (val) => {
  if(!val) return
  editor.value.chain().focus().setImage({ src: val }).run()
  image.value = null
})

const addYoutube = () => {
  const url = window.prompt('Nhập Link Video Youtube')
  if (url) {
    editor.value.commands.setYoutubeVideo({
      src: url,
      width: 640,
      height: 480,
    })
  }
}

const setLink = () => {
  const previousUrl = editor.value.getAttributes('link').href
  const url = window.prompt('Nhập URL liên kết:', previousUrl)

  if (url === null) return
  if (url === '') {
    editor.value.chain().focus().unsetLink().run()
    return
  }
  editor.value.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
}

onBeforeUnmount(() => {
  unref(editor).destroy()
})
</script>