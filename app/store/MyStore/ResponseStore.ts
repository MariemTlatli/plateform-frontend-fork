import { create } from 'zustand'
import {
  fetchResponses,
  addResponse,
  fetchResponseByAssignmentAndUser,
  update_Response_By_Member
} from '@/store/Controller/ResponseController'
import { State , Response } from '@/store/Models/Response'

export type Actions = {
  fetchResponses: (MemberId: string) => Promise<void>
  updateResponseByMember: (dataResponse: Response) => Promise<void>
  addResponse: (
    Content: string,
    User_Id: string,
    Assignment_Id: string
  ) => Promise<void>
  fetchResponseByAssignmentAndUser: (
    assignmentId: string,
    userId: string
  ) => Promise<void>
}

export const useResponseStore = create<State & Actions>(set => ({
  responses: [],
  fetchedResponse: null,
  fetchResponses: async (MemberId: string) => {
    try {
      const responsesData = await fetchResponses(MemberId)
      set({ responses: responsesData })
    } catch (error) {
      console.error('Erreur lors de la récupération des réponses', error)
    }
  },
  addResponse: async (
    Content: string,
    User_Id: string,
    Assignment_Id: string
  ) => {
    try {
      const newResponse = await addResponse(Content, User_Id, Assignment_Id)
    } catch (error) {
      console.error("Erreur lors de l'ajout de la réponse", error)
    }
  },
  fetchResponseByAssignmentAndUser: async (assignmentId, userId) => {
    try {
      const newResponse = await fetchResponseByAssignmentAndUser(
        assignmentId,
        userId
      )
      set({ fetchedResponse: newResponse })
    } catch (error) {
      console.error('Erreur lors de la récupération de la réponse', error)
      set({ fetchedResponse: null })
    }
  },
  updateResponseByMember: async (dataResponse: Response) => {
    try {
      console.log('dataResponse store : ')
      console.log(dataResponse)
      const data = await update_Response_By_Member(dataResponse)
      set({ fetchedResponse: dataResponse })
    } catch (error) {
      console.error('Error fetching sessions:', error)
    }
  }
}))

export { fetchResponses }
