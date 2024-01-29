import { Schema, model, models } from "mongoose";

/* WE'RE GONNA TO PROVIDE AN ARRAY OF DIFFERENT PROPERTIES */
const UserSchema = new Schema({
  clerkId: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  firstName: { type: String, required: true },
  lastName: {type: String, required: true },
  photo: { type: String, required: true },
})


/* We're gonna to use this schema below by saying:*/

const User = models.User || model('User', UserSchema);

export default User;