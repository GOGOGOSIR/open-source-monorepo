import { useBemHelper } from '@utils/namespace'
import { computed, defineComponent } from 'vue'
import { buttonProps } from './props'

export default defineComponent({
  // eslint-disable-next-line vue/no-reserved-component-names
  name: 'Button',
  props: buttonProps,
  setup(_props) {
    const bh = useBemHelper('button')
    const className = computed(() => {
      return {
        [bh.b()]: true,
      }
    })

    return () => {
      return (
        <button class={ className.value }>
          { _props.text }
        </button>
      )
    }
  },
})
