import { Ref } from "preact"
import { useCallback, useMemo, useRef, useState } from "preact/hooks"
import { JSX } from "preact/jsx-runtime"

type TextInputProps = {
    focus?: boolean
} & JSX.HTMLAttributes<HTMLInputElement>

const Input = ({ focus = false, ...props }: TextInputProps) => {

    return useMemo(() =>
        <form onSubmit={ (event) => event.preventDefault() }>
            <input
                { ...props }
                ref={ (ref) => focus && setTimeout(() => ref?.focus(), 1) }
            />
        </form>
    , []);
}

export default Input;