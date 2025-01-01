'use client'
import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { Controller, FormProvider, useFormContext } from 'react-hook-form'

import { cn } from '@/lib/utils'
import { Label } from '@/ui/label'

const Form = FormProvider

interface FormItemProps {
  children: React.ReactNode
  className?: string
}

const FormItem: React.FC<FormItemProps> = ({ children, className }) => (
  <div className={className}>{children}</div>
)
FormItem.displayName = 'FormItem'

interface FormLabelProps extends React.HTMLAttributes<HTMLLabelElement> {
  className?: string
}

const FormLabel = React.forwardRef<HTMLLabelElement, FormLabelProps>(
  ({ className, ...props }, ref) => {
    const { error, formItemId } = useFormField()

    return (
      <Label
        ref={ref}
        className={cn(error && 'text-destructive', className)}
        htmlFor={formItemId}
        {...props}
      />
    )
  }
)
FormLabel.displayName = 'FormLabel'

interface FormControlProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  className?: string
}

const FormControl = React.forwardRef<HTMLDivElement, FormControlProps>(
  ({ ...props }, ref) => {
    const { error, formItemId, formDescriptionId, formMessageId } =
      useFormField()

    return (
      <Slot
        ref={ref}
        id={formItemId}
        aria-describedby={
          !error
            ? `${formDescriptionId}`
            : `${formDescriptionId} ${formMessageId}`
        }
        aria-invalid={!!error}
        {...props}
      />
    )
  }
)
FormControl.displayName = 'FormControl'

interface FormFieldProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
  control: any
  name: string
  render: (props: any) => React.ReactNode
}
const FormField: React.FC<FormFieldProps> = ({
  control,
  name,
  render,
  className
}) => (
  <Controller
    control={control}
    name={name}
    render={({ field }) => <div className={className}>{render({ field })}</div>}
  />
)
FormField.displayName = 'FormField'
interface FormMessage extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
}

const FormMessage: React.FC<FormMessage> = ({ className }) => {
  const { error } = useFormField()

  return (
    <div className={cn('text-sm', className)}>
      {error && <span>{error.message}</span>}
    </div>
  )
}
FormMessage.displayName = 'FormMessage'
const useFormField = () => {
  const fieldContext = useFormContext()
  const id = React.useId()
  const fieldState = fieldContext.getFieldState(id)

  return {
    id,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState
  }
}

const FormItemContext = React.createContext({})

export {
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormField,
  FormMessage,
  useFormField
}
