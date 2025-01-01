export type Assignment = {
  _id: string
  Title: string
  Description: string
  DueDate: string
  Attachments: string
}
export type State = {
  assignments: Assignment[]
}
