import { model, models, Schema } from "mongoose";

export interface IUser {
  email: string;
  chessUsernames?: string[];
  liChessUsernames?: string[];
}

const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    chessUsernames: {
      type: [String],
      default: [],
      validate: [
        {
          validator: (val: string[]) => val.length <= 3,
          message: "You can only have up to 3 chess.com usernames.",
        },
      ],
    },
    liChessUsernames: {
      type: [String],
      default: [],
      validate: [
        {
          validator: (val: string[]) => val.length <= 3,
          message: "You can only have up to 3 lichess.org usernames.",
        },
      ],
    },
  },
  {
    timestamps: true,
  }
);

export const User = models.User || model<IUser>("User", userSchema);