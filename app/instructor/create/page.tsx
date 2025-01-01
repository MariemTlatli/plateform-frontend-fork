'use client'

import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '@/ui/input'
import { Button } from '@/ui/button'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'
import { useAssignmentStore } from '@/app/store/MyStore/AssignmentsStore'
import RichTextEditor from '@/mic-component/RichTextEditor/RichTextEditor'
import { Popover, PopoverContent, PopoverTrigger } from '@/ui/popover'
import { CalendarIcon } from 'lucide-react'
import { format, parse } from 'date-fns'
import { Calendar } from '@/ui/calendar'
import { TimePicker } from '@/ui/time-picker/time-picker'
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage
} from '@/ui/form'
import { Assignment } from '@/store/Models/Assignment'
import { useSearchParams } from 'next/navigation'
import { cn } from '@/lib/utils'
function extractTextFromHTML(html: string) {
  const parser = new DOMParser()
  const doc = parser.parseFromString(html, 'text/html')
  return doc.body.textContent?.trim() || ''
}

const formSchema = z.object({
  title: z.string().nonempty('Title is required.'),
  description: z
    .string()
    .refine(value => extractTextFromHTML(value).trim().length >= 5, {
      message: 'The description must be at least 5 characters long.'
    }),
  DueDate: z.date()
})

export default function CreateOrUpdateAssignment() {
  const router = useRouter()
  const { createAssignment, updateAssignment } = useAssignmentStore()
  const searchParams = useSearchParams()
  const departmentId = searchParams.get('departmentId')
  const assignmentId = searchParams.get('assignmentId')

  // Pour remplir les données lors de la modification
  const existingAssignment = useAssignmentStore(state =>
    assignmentId
      ? state.assignments.find(assignment => assignment._id == assignmentId)
      : null
  )

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: existingAssignment?.Title || '',
      description: existingAssignment?.Description || '',
      DueDate: existingAssignment
        ? parse(existingAssignment.DueDate, 'dd/MM/yyyy HH:mm:ss', new Date())
        : new Date()
    }
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const formattedDate = format(values.DueDate, 'dd/MM/yyyy HH:mm:ss')
    const newAssignment: Assignment = {
      _id: existingAssignment?._id || '',
      Title: values.title,
      Description: values.description,
      DueDate: formattedDate,
      Attachments: ''
    }

    try {
      if (existingAssignment) {
        await updateAssignment(existingAssignment._id, newAssignment)
        toast.success('Assignment updated successfully.')
      } else {
        await createAssignment(newAssignment, departmentId)
        toast.success('Assignment created successfully.')
      }
      form.reset()
      router.push('/instructor/assignments')
    } catch (error) {
      toast.error('Failed to process the assignment.')
      console.error('Assignment error:', error)
    }
  }
  function handleCancel() {
    form.reset({
      title: '',
      description: '',
      DueDate: new Date()
    })
    router.push('/instructor/assignments')
  }

  return (
    <div className='pt-30 mx-auto w-11/12 max-w-3xl text-slate-700'>
      <h1 className='mb-7 text-start text-4xl text-white'>
        {existingAssignment
          ? 'Update the assignment'
          : 'Create a new assignment'}
      </h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          {/* Champ Titre */}
          <FormField
            control={form.control}
            name='title'
            render={({ field }) => (
              <FormItem className='mb-4'>
                <FormLabel className='text-white'>Title</FormLabel>
                <FormControl>
                  <Input {...field} placeholder='Enter title' />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Champ DueDate */}
          <FormField
            control={form.control}
            name='DueDate'
            render={({ field }) => (
              <FormItem className='flex flex-col items-start'>
                <FormLabel className='text-white'>Due Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={'outline'}
                      className={cn(
                        'w-[280px] justify-start text-left font-normal',
                        !field.value && 'text-muted-foreground'
                      )}
                    >
                      <CalendarIcon className='mr-2 h-4 w-4' />
                      {field.value ? (
                        format(field.value, 'PPP HH:mm:ss')
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className='w-auto bg-gray-100 p-0'>
                    <Calendar
                      mode='single'
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={date => date < new Date()}
                      initialFocus
                    />
                    <div className='border-border border-t p-3'>
                      <TimePicker setDate={field.onChange} date={field.value} />
                    </div>
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Champ Description avec RichTextEditor */}
          <FormField
            control={form.control}
            name='description'
            render={({ field }) => (
              <FormItem>
                <FormLabel className='text-white'>Description</FormLabel>
                <FormControl>
                  <RichTextEditor
                    content={field.value || ''}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Bouton Soumettre */}
          <div className='mt-4 flex justify-center space-x-4'>
            <Button type='submit'>
              {existingAssignment ? 'Update' : 'Submit'}
            </Button>
            <Button type='button' variant='secondary' onClick={handleCancel}>
              Cancel
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
