import { Control, useFormContext } from "react-hook-form"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form"
import { Input } from "./ui/input"

import { ChangeEvent } from 'react'

interface CustomInputProps {
  control: Control<any>
  registerName: string
  textlabel?: string
  placeholder?: string
  type: string
  maskName?: 'contact_phone' | 'zip_code'
  defaultValue?: string
}

export const normalizePhoneNumber = (value: string) => {
  const cleanedValue = value.replace(/\D/g, '')
  if (!cleanedValue) return ''
  let formattedValue = '(' + cleanedValue.substring(0, 2)
  if (cleanedValue.length > 2) {
    formattedValue += ') ' + cleanedValue.substring(2, 7)
  }
  if (cleanedValue.length > 7) {
    formattedValue += '-' + cleanedValue.substring(7, 11)
  }
  return formattedValue
}

export const normalizeZipCode = (value: string) => {
  const cleanedValue = value.replace(/\D/g, '').substring(0, 8) // Limita a 8 dígitos
  if (!cleanedValue) return ''
  if (cleanedValue.length <= 5) return cleanedValue
  return cleanedValue.substring(0, 5) + '-' + cleanedValue.substring(5)
}

export const InputMask = ({ defaultValue, registerName, textlabel, control, placeholder, type, maskName }: CustomInputProps) => {
  const { setValue } = useFormContext()

  const handleMask = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target

    let newValue = value

    if (maskName === 'contact_phone' && name === registerName) {
      newValue = normalizePhoneNumber(value)
    } else if (maskName === 'zip_code' && name === registerName) {
      newValue = normalizeZipCode(value)
    }

    setValue(name, newValue)
  }

  return (
    <FormField
      control={control}
      name={registerName}
      render={({ field }) => (
        <FormItem className="w-full">
          <FormLabel htmlFor={registerName}>
            {textlabel}
          </FormLabel>
          <FormControl onChange={handleMask}>
            <Input
              defaultValue={defaultValue}
              id={registerName}
              data-mask={maskName}
              placeholder={placeholder}
              {...field}
              type={type}
              autoComplete="off"
              className=""
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
