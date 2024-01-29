'use server'


/* we created our first server action */

import { revalidatePath } from 'next/cache' 
import { connectToDatabase } from '../database'
import { CreateUserParams, UpdateUserParams } from '@/types'
import { handleError } from '../utils'

import User from '../database/models/user.model'
import Order from '../database/models/order.model'
import Event from '../database/models/event.model'



// we must call it from our webhook file.
export async function createUser(user: CreateUserParams) {
    try {
      await connectToDatabase()  //-> This is the function that we've created in lib/database/index.ts.
  
      //Once we've have connected to the database, we want to create a newUser.
      const newUser = await User.create(user);
      return JSON.parse(JSON.stringify(newUser));  // This is the data that we passed to the frontend.
    } catch (error) {
      handleError(error)
    }
  }
  
   export async function getUserById(userId: string) {
    try {
      await connectToDatabase()
  
      const user = await User.findById(userId)
  
      if (!user) throw new Error('User not found')
      return JSON.parse(JSON.stringify(user))
    } catch (error) {
      handleError(error)
    }
  }
  
export async function updateUser(clerkId: string, user: UpdateUserParams) {
    try {
      await connectToDatabase()
  
      const updatedUser = await User.findOneAndUpdate({ clerkId }, user, { new: true })
  
      if (!updatedUser) throw new Error('User update failed')
      return JSON.parse(JSON.stringify(updatedUser))
    } catch (error) {
      handleError(error)
    }
  }
  
  export async function deleteUser(clerkId: string) {
    try {
      await connectToDatabase()
  
      // Find user to delete
      const userToDelete = await User.findOne({ clerkId })
  
      if (!userToDelete) {
        throw new Error('User not found')
      }
  
      // Unlink relationships
      await Promise.all([
        // Update the 'events' collection to remove references to the user
        Event.updateMany(
          { _id: { $in: userToDelete.events } },
          { $pull: { organizer: userToDelete._id } }
        ),
  
        // Update the 'orders' collection to remove references to the user
        Order.updateMany({ _id: { $in: userToDelete.orders } }, { $unset: { buyer: 1 } }),
      ])
  
      // Delete user
      const deletedUser = await User.findByIdAndDelete(userToDelete._id)
      revalidatePath('/')
  
      return deletedUser ? JSON.parse(JSON.stringify(deletedUser)) : null
    } catch (error) {
      handleError(error)
    }
  }
  