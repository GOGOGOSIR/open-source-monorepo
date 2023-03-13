import type { ExtractPropTypes } from 'vue'

export const buttonProps = {
  text: {
    type: String,
    default: '',
  },
}

export type ButtonProps = ExtractPropTypes<typeof buttonProps>
