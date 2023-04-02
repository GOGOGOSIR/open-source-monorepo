import { useNameHelper, useProps } from '@utils/mixins'
import { addSum } from '@eric-wan/use'
import { computed, defineComponent } from 'vue'
import { buttonProps } from './props'

export default defineComponent({
  name: 'Button',
  props: buttonProps,
  setup(_props) {
    const props = useProps('Button', _props, {
      text: `1-${addSum(1, 2)}`,
    })
    const nh = useNameHelper('button')
    const className = computed(() => {
      return {
        [nh.b()]: true,
      }
    })

    return () => {
      return (
        <button class={ className.value }>
          { props.text }
        </button>
      )
    }
  },
})
